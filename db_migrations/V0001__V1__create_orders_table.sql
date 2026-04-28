-- Таблица заказов: хранит платёж и список купленных работ
CREATE TABLE IF NOT EXISTS t_p11556835_student_study_sales.orders (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    amount NUMERIC(10,2) NOT NULL,
    email VARCHAR(255),
    items JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON t_p11556835_student_study_sales.orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON t_p11556835_student_study_sales.orders(status);
