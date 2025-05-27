import os
import json
import logging
import time

import boto3
import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

TOKEN_URL = 'https://oauth2.googleapis.com/token'
DDB_TABLE = os.environ['DDB_TABLE']

_dynamodb = boto3.resource('dynamodb')
_table = _dynamodb.Table(DDB_TABLE)
CORS_HEADERS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
}

def lambda_handler(event, context):
    try:
        # —— 1) 取出 Cognito 验证过后的 claims —— <<<
        claims = event.get('requestContext', {}) \
                      .get('authorizer', {}) \
                      .get('claims', {})
        user_id = claims.get('sub') or claims.get('cognito:username')
        if not user_id:
            # 理论上不会到这，因为 Authorizer 已拦截无效 token
            return {
                'statusCode': 401,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Unauthorized'})
            }
        # 支援 console dict 直傳 + API Gateway 字串傳 body
        raw = event.get('body') or '{}'
        body = json.loads(raw) if isinstance(raw, str) else raw

        code = body.get('code')
        code_verifier = body.get('code_verifier')
        if not code or not code_verifier:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'code and code_verifier are required'})
            }

        payload = {
            'grant_type':    'authorization_code',
            'code':          code,
            'client_id':     os.environ['CLIENT_ID'],
            'client_secret': os.environ['CLIENT_SECRET'],
            'redirect_uri':  os.environ['REDIRECT_URI'],
            'code_verifier': code_verifier,
        }

        resp = requests.post(TOKEN_URL, data=payload)
        # 先印出完整回應，方便 debug
        logger.info("Google token response status=%s body=%s", resp.status_code, resp.text)

        # 如果不是 200，raise HTTPError 進到下方 except
        resp.raise_for_status()
        tokens = resp.json()

        # 存到 DynamoDB
        item = {
            'user_id':       user_id,
            'code':          code,
            'access_token':  tokens['access_token'],
            'refresh_token': tokens.get('refresh_token'),
            'expires_at':    int(time.time()) + tokens.get('expires_in', 0)
        }
        _table.put_item(Item=item)
        logger.info("Stored tokens for code %s into DynamoDB", code)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                **CORS_HEADERS
            },
            'body': json.dumps(tokens)
        }

    except requests.HTTPError as e:
        # 這裡也再印一次錯誤 body
        err_body = e.response.text if e.response is not None else str(e)
        logger.error("Token exchange failed: %s", err_body)
        return {
            'statusCode': e.response.status_code if e.response else 500,
            'body': json.dumps({'error': err_body})
        }

    except Exception as e:
        logger.exception("Unexpected error")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
