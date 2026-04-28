"""
Получение заказа по payment_id.
Фронтенд опрашивает после возврата с ЮKassa, чтобы показать купленные файлы.
"""
import json
import os
import psycopg2


DB_SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p11556835_student_study_sales')


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    params = event.get('queryStringParameters') or {}
    payment_id = params.get('payment_id')

    if not payment_id:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'payment_id обязателен'})
        }

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT payment_id, status, amount, email, items, created_at, paid_at "
                f"FROM {DB_SCHEMA}.orders WHERE payment_id = %s",
                (payment_id,)
            )
            row = cur.fetchone()
    finally:
        conn.close()

    if not row:
        return {
            'statusCode': 404,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Заказ не найден'})
        }

    payment_id_db, status, amount, email, items, created_at, paid_at = row

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'payment_id': payment_id_db,
            'status': status,
            'amount': float(amount),
            'email': email,
            'items': items,
            'created_at': created_at.isoformat() if created_at else None,
            'paid_at': paid_at.isoformat() if paid_at else None,
        })
    }
