# fetch_calendar/app.py

import os
import json
import time
import datetime
import logging

import boto3
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# 讀環境變數
DDB_TABLE     = os.environ['DDB_TABLE']
CLIENT_ID     = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
TOKEN_URI     = 'https://oauth2.googleapis.com/token'

# DynamoDB
_dynamodb = boto3.resource('dynamodb')
_table    = _dynamodb.Table(DDB_TABLE)

# 統一的 CORS headers
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',    # 或指定你的前端 domain
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

def lambda_handler(event, context):
    try:
        # —— 1) 從 API Gateway Cognito Authorizer 取出 user_id —— 
        claims = (
            event
            .get('requestContext', {})
            .get('authorizer', {})
            .get('claims', {})
        )
        user_id = claims.get('sub') or claims.get('cognito:username')
        if not user_id:
            return {
                'statusCode': 401,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Unauthorized'})
            }

        # —— 2) 從 DynamoDB 拿 token 資料 —— 
        resp = _table.get_item(Key={'user_id': user_id})
        item = resp.get('Item')
        if not item:
            return {
                'statusCode': 404,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': f'No tokens found for user_id {user_id}'})
            }

        access_token  = item.get('access_token')
        refresh_token = item.get('refresh_token')
        expires_at    = item.get('expires_at', 0)

        # —— 3) 建立 Credentials 並檢查是否過期要續期 —— 
        creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri=TOKEN_URI,
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET
        )

        if creds.expired and creds.refresh_token:
            logger.info("Access token expired for user %s, refreshing...", user_id)
            creds.refresh(Request())
            new_exp = int(creds.expiry.timestamp())

            # 回寫新的 access_token 與 expires_at
            _table.update_item(
                Key={'user_id': user_id},
                UpdateExpression='SET access_token = :at, expires_at = :exp',
                ExpressionAttributeValues={
                    ':at': creds.token,
                    ':exp': new_exp
                }
            )
            logger.info("Refreshed token saved to DynamoDB for user %s", user_id)

        # —— 4) 呼叫 Google Calendar API 取事件 —— 
        service = build('calendar', 'v3', credentials=creds)
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        events_result = (
            service.events()
                   .list(
                       calendarId='primary',
                       timeMin=now,
                       maxResults=10,
                       singleEvents=True,
                       orderBy='startTime'
                   )
                   .execute()
        )

        items = events_result.get('items', [])
        # —— 5) 回傳結果 + CORS headers —— 
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                **CORS_HEADERS
            },
            'body': json.dumps({'events': items})
        }

    except Exception:
        logger.exception("Failed to fetch calendar for user")
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Internal server error'})
        }
