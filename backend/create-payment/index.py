"""
Создание платежа в ЮKassa и сохранение заказа в БД.
Принимает сумму, список товаров, email, return_url — возвращает ссылку на оплату.
"""
import json
import os
import uuid
import base64
import urllib.request
import urllib.error
import psycopg2


DB_SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p11556835_student_study_sales')


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


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
        base_return = body.get('return_url', window_origin(event))
        items = body.get('items', [])
        email = body.get('email', '')

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

        # return_url содержит idempotency_key как временный ID — заменим на payment_id после ответа
        sep = '&' if '?' in base_return else '?'
        tmp_return_url = f"{base_return}{sep}payment=success"

        payment_data = {
            'amount': {'value': f'{float(amount):.2f}', 'currency': 'RUB'},
            'confirmation': {'type': 'redirect', 'return_url': tmp_return_url},
            'capture': True,
            'description': description,
            'metadata': {'items': json.dumps(items)},
        }
        if email:
            payment_data['receipt'] = {
                'customer': {'email': email},
                'items': [
                    {
                        'description': it.get('title', 'Учебная работа')[:128],
                        'quantity': '1.00',
                        'amount': {'value': f"{float(it.get('price', 0)):.2f}", 'currency': 'RUB'},
                        'vat_code': 1,
                        'payment_mode': 'full_payment',
                        'payment_subject': 'service',
                    }
                    for it in items
                ]
            }

        req_body = json.dumps(payment_data).encode('utf-8')
        req = urllib.request.Request(
            'https://api.yookassa.ru/v3/payments',
            data=req_body,
            headers={
                'Authorization': f'Basic {credentials}',
                'Content-Type': 'application/json',
                'Idempotence-Key': idempotency_key,
            },
            method='POST'
        )

        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode('utf-8'))

        payment_id = result.get('id')
        confirmation_url = result.get('confirmation', {}).get('confirmation_url')

        # Строим return_url с реальным payment_id — ЮKassa редиректит сюда после оплаты
        sep = '&' if '?' in base_return else '?'
        return_url_with_id = f"{base_return}{sep}payment_id={payment_id}"

        # Сохраняем заказ в БД со статусом pending
        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"INSERT INTO {DB_SCHEMA}.orders "
                    "(payment_id, status, amount, email, items) "
                    "VALUES (%s, %s, %s, %s, %s) ON CONFLICT (payment_id) DO NOTHING",
                    (payment_id, 'pending', float(amount), email or None, json.dumps(items))
                )
            conn.commit()
        finally:
            conn.close()

        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({
                'payment_id': payment_id,
                'confirmation_url': confirmation_url,
                'status': result.get('status'),
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


def window_origin(event):
    headers = event.get('headers') or {}
    origin = headers.get('origin') or headers.get('Origin') or 'https://uchyobamarket.ru'
    return f"{origin}?payment=success"