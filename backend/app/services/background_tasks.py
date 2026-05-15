import logging
from decimal import Decimal

logger = logging.getLogger(__name__)


def send_order_confirmation_email(
    order_id: int,
    customer_email: str,
    total_amount: Decimal,
) -> None:
    logger.info(
        "Sending confirmation email for order %s to %s with total %s",
        order_id,
        customer_email,
        total_amount,
    )


def generate_invoice(order_id: int, total_amount: Decimal) -> None:
    logger.info("Invoice generated for order %s with total %s", order_id, total_amount)


def update_order_processing_status(order_id: int) -> None:
    logger.info("Order %s background processing completed", order_id)
