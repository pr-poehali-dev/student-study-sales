"""
Webhook от ЮKassa: получает уведомление об оплате, обновляет статус заказа в БД.
ЮKassa POST-ит сюда JSON с объектом payment при изменении статуса.
"""
import json
import os
import psycopg2
from datetime import datetime, timezone


DB_SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p11556835_student_study_sales')


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    # ЮKassa не поддерживает preflight, но на всякий случай
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': ''}

    try:
        body = json.loads(event.get('body') or '{}')
        event_type = body.get('type')          # например: "notification"
        obj_type = body.get('object', {}).get('object') if 'event' in body else None

        # ЮKassa v3 формат: {"type":"notification","event":"payment.succeeded","object":{...}}
        yoo_event = body.get('event', '')
        payment = body.get('object', {})
        payment_id = payment.get('id')
        status = payment.get('status')         # succeeded | canceled | pending

        if not payment_id or not status:
            return {'statusCode': 400, 'body': json.dumps({'error': 'invalid payload'})}

        conn = get_db()
        try:
            with conn.cursor() as cur:
                if status == 'succeeded':
                    cur.execute(
                        f"UPDATE {DB_SCHEMA}.orders "
                        "SET status = %s, paid_at = %s "
                        "WHERE payment_id = %s",
                        ('paid', datetime.now(timezone.utc), payment_id)
                    )
                elif status == 'canceled':
                    cur.execute(
                        f"UPDATE {DB_SCHEMA}.orders SET status = %s WHERE payment_id = %s",
                        ('canceled', payment_id)
                    )
                # для прочих статусов просто обновляем
                else:
                    cur.execute(
                        f"UPDATE {DB_SCHEMA}.orders SET status = %s WHERE payment_id = %s",
                        (status, payment_id)
                    )
            conn.commit()
        finally:
            conn.close()

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }

    except Exception as e:
        # Возвращаем 200, чтобы ЮKassa не слала повторно при серверной ошибке
        return {
            'statusCode': 200,
            'body': json.dumps({'ok': False, 'error': str(e)})
        }
