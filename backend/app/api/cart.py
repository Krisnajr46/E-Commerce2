from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse
from app.services.cart_service import (
    add_item_to_cart,
    get_cart,
    remove_cart_item,
    update_cart_item,
)

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.post("/items", response_model=CartResponse)
def add_cart_item(
    item_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return add_item_to_cart(db, current_user, item_data)


@router.get("", response_model=CartResponse)
def read_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return get_cart(db, current_user)


@router.put("/items/{item_id}", response_model=CartResponse)
def update_cart_item_endpoint(
    item_id: int,
    item_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return update_cart_item(db, current_user, item_id, item_data)


@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item_endpoint(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return remove_cart_item(db, current_user, item_id)
