"""
Создание платежа в ЮKassa.
Принимает сумму, описание и return_url, возвращает ссылку на оплату.
"""
import json
import os
import uuid
import base64
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    try:
        body = json.loads(event.get('body') or '{}')
        amount = body.get('amount')
        description = body.get('description', 'Оплата учебных работ')
        return_url = body.get('return_url', 'https://uchyobamarket.ru/success')
        items = body.get('items', [])

        if not amount or float(amount) <= 0:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Укажите сумму платежа'})
            }

        shop_id = os.environ.get('YOOKASSA_SHOP_ID')
        secret_key = os.environ.get('YOOKASSA_SECRET_KEY')

        if not shop_id or not secret_key:
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({'error': 'ЮKassa не настроена. Добавьте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в секреты.'})
            }

        idempotency_key = str(uuid.uuid4())
        credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()

        payment_data = {
            'amount': {
                'value': f'{float(amount):.2f}',
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': return_url
            },
            'capture': True,
            'description': description,
            'metadata': {
                'items': json.dumps(items)
            }
        }

        request_body = json.dumps(payment_data).encode('utf-8')
        req = urllib.request.Request(
            'https://api.yookassa.ru/v3/payments',
            data=request_body,
            headers={
                'Authorization': f'Basic {credentials}',
                'Content-Type': 'application/json',
                'Idempotence-Key': idempotency_key,
            },
            method='POST'
        )

        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode('utf-8'))

        confirmation_url = result.get('confirmation', {}).get('confirmation_url')
        payment_id = result.get('id')

        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({
                'payment_id': payment_id,
                'confirmation_url': confirmation_url,
                'status': result.get('status')
            })
        }

    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': cors_headers,
            'body': json.dumps({'error': f'Ошибка ЮKassa: {error_body}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': str(e)})
        }
