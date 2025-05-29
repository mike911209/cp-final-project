import os
import json
import boto3
import uuid
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

dynamodb = boto3.resource('dynamodb')
scheduler = boto3.client('scheduler')
CORS_HEADERS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
}


def lambda_handler(event, context):
    claims = event.get('requestContext', {}) \
                      .get('authorizer', {}) \
                      .get('claims', {})
    user_id = claims.get('sub') or claims.get('cognito:username')
    if not user_id:
        return {
            'statusCode': 401,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    raw_body = event.get('body', {})
    if isinstance(raw_body, str):
        body = json.loads(raw_body)
    else:
        body = raw_body
    event_str  = body.get('event', '{}')
    
    try:
        event = json.loads(event_str)
    except (TypeError, json.JSONDecodeError):
        event = event_str  # assume it's already a dict

    spray_flag  = event['spray_flag']
    user_prompt = event['user_prompt']
    alarm_interval = event['alarm_interval']
    alarm_repeat_times = event['alarm_repeat_times']
    receivers   = event['receivers']

    table = dynamodb.Table(os.environ['DDB_TABLE'])

    event_id = event['id']

    # Get the event start time and timezone
    start_ts = event['start'].get('dateTime') or event['start'].get('date')
    tz = event['start']['timeZone']
    
    # Parse the datetime and ensure it's in the correct timezone
    dt_local = datetime.fromisoformat(start_ts).astimezone(ZoneInfo(tz))

    # Get reminder minutes from the event
    reminder_minutes = 10  # Default to 10 minutes if not specified
    if 'reminders' in event and 'overrides' in event['reminders']:
        for reminder in event['reminders']['overrides']:
            if reminder.get('method') == 'popup':
                reminder_minutes = reminder.get('minutes', 10)
                break

    # Calculate the trigger time by subtracting reminder minutes
    trigger_time = dt_local - timedelta(minutes=reminder_minutes)
    
    # Format the time in the local timezone for EventBridge
    expr = f"at({trigger_time.strftime('%Y-%m-%dT%H:%M:%S')})"
    name = str(uuid.uuid4())

    resp = scheduler.create_schedule(
        Name=name,
        ScheduleExpression=expr,
        ScheduleExpressionTimezone=tz,
        FlexibleTimeWindow={'Mode': 'OFF'},
        Target={
            'Arn':     os.environ['NOTIFICATION_FUNCTION_ARN'],
            'RoleArn': os.environ['SCHEDULER_ROLE_ARN'],
            'Input': json.dumps({
                'user_id':     user_id,
                'event_id':    event_id,
                'spray_flag':  spray_flag,
                'user_prompt': user_prompt,
                'alarm_repeat_times': alarm_repeat_times,
                'alarm_interval': alarm_interval,
                'receivers':   receivers
            }),
        }
    )

    table.put_item(Item={
        'user_id':      user_id,
        'event_id':     event_id,
        'trigger_time': trigger_time.isoformat(),
        'spray_flag':   spray_flag,
        'user_prompt':  user_prompt,
        'alarm_repeat_times': alarm_repeat_times,
        'alarm_interval': alarm_interval,
        'receivers':    receivers,
        'schedule_name': name
    })
    
    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({
            'message':      'schedule created',
            'schedule_name': name
        })
    }
