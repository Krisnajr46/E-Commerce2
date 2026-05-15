from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart import Cart
from app.models.order import Order, OrderItem
from app.models.user import User
from app.schemas.order import OrderStatusUpdate


def _format_order(order: Order) -> dict:
    items = []
    for item in order.order_items:
        items.append(
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": item.subtotal,
            }
        )

    return {
        "id": order.id,
        "user_id": order.user_id,
        "status": order.status,
        "total_amount": order.total_amount,
        "items": items,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
    }


def _get_order_or_404(db: Session, order_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )
    return order


def checkout_cart(db: Session, user: User) -> dict:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart or not cart.cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty.",
        )

    validated_items = []
    total_amount = Decimal("0.00")

    for cart_item in cart.cart_items:
        product = cart_item.product
        if not product or not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found.",
            )
        if cart_item.quantity > product.stock_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock.",
            )

        unit_price = Decimal(product.price)
        subtotal = unit_price * cart_item.quantity
        total_amount += subtotal
        validated_items.append((cart_item, product, unit_price, subtotal))

    try:
        order = Order(
            user_id=user.id,
            status="pending",
            total_amount=total_amount,
        )
        db.add(order)
        db.flush()

        for cart_item, product, unit_price, subtotal in validated_items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=cart_item.quantity,
                    unit_price=unit_price,
                    subtotal=subtotal,
                )
            )
            product.stock_quantity -= cart_item.quantity
            db.delete(cart_item)

        db.commit()
        db.refresh(order)
    except Exception:
        db.rollback()
        raise

    return get_order_by_id(db, order.id, user)


def get_user_orders(db: Session, user: User) -> list[dict]:
    orders = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [_format_order(order) for order in orders]


def get_order_by_id(db: Session, order_id: int, user: User) -> dict:
    order = _get_order_or_404(db, order_id)

    if user.role != "admin" and order.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to access this resource.",
        )

    return _format_order(order)


def update_order_status(
    db: Session,
    order_id: int,
    status_data: OrderStatusUpdate,
) -> dict:
    order = _get_order_or_404(db, order_id)
    order.status = status_data.status
    db.commit()
    db.refresh(order)
    return _format_order(order)
