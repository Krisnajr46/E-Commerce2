from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate


def _get_active_product(db: Session, product_id: int) -> Product:
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.is_active.is_(True))
        .first()
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )
    return product


def _format_cart(cart: Cart) -> dict:
    total_amount = Decimal("0.00")
    items = []

    for item in cart.cart_items:
        product = item.product
        line_total = Decimal(product.price) * item.quantity
        total_amount += line_total
        items.append(
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "name": product.name,
                "price": product.price,
                "image_url": product.image_url,
            }
        )

    return {
        "id": cart.id,
        "user_id": cart.user_id,
        "items": items,
        "total_amount": total_amount,
    }


def get_or_create_cart(db: Session, user: User) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if cart:
        return cart

    cart = Cart(user_id=user.id)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart


def get_cart(db: Session, user: User) -> dict:
    cart = get_or_create_cart(db, user)
    db.expire(cart, ["cart_items"])
    return _format_cart(cart)


def add_item_to_cart(db: Session, user: User, item_data: CartItemCreate) -> dict:
    product = _get_active_product(db, item_data.product_id)
    cart = get_or_create_cart(db, user)

    existing_item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == item_data.product_id)
        .first()
    )
    new_quantity = item_data.quantity
    if existing_item:
        new_quantity += existing_item.quantity

    if new_quantity > product.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock.",
        )

    if existing_item:
        existing_item.quantity = new_quantity
    else:
        db.add(
            CartItem(
                cart_id=cart.id,
                product_id=product.id,
                quantity=item_data.quantity,
            )
        )

    db.commit()
    db.refresh(cart)
    return get_cart(db, user)


def update_cart_item(
    db: Session,
    user: User,
    item_id: int,
    item_data: CartItemUpdate,
) -> dict:
    cart_item = (
        db.query(CartItem)
        .join(Cart)
        .filter(CartItem.id == item_id, Cart.user_id == user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found.",
        )

    product = _get_active_product(db, cart_item.product_id)
    if item_data.quantity > product.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock.",
        )

    cart_item.quantity = item_data.quantity
    db.commit()
    return get_cart(db, user)


def remove_cart_item(db: Session, user: User, item_id: int) -> dict:
    cart_item = (
        db.query(CartItem)
        .join(Cart)
        .filter(CartItem.id == item_id, Cart.user_id == user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found.",
        )

    db.delete(cart_item)
    db.commit()
    return get_cart(db, user)


def clear_cart(db: Session, user: User) -> dict:
    cart = get_or_create_cart(db, user)
    for item in list(cart.cart_items):
        db.delete(item)
    db.commit()
    return get_cart(db, user)
