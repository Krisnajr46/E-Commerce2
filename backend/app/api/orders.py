from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, require_admin
from app.db.session import get_db
from app.models.user import User
from app.schemas.order import OrderResponse, OrderStatusUpdate
from app.services.background_tasks import (
    generate_invoice,
    send_order_confirmation_email,
    update_order_processing_status,
)
from app.services.order_service import (
    checkout_cart,
    get_order_by_id,
    get_user_orders,
    update_order_status,
)

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/checkout", response_model=OrderResponse)
def checkout_current_cart(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    order = checkout_cart(db, current_user)
    background_tasks.add_task(
        send_order_confirmation_email,
        order["id"],
        current_user.email,
        order["total_amount"],
    )
    background_tasks.add_task(generate_invoice, order["id"], order["total_amount"])
    background_tasks.add_task(update_order_processing_status, order["id"])
    return order


@router.get("", response_model=list[OrderResponse])
def read_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return get_user_orders(db, current_user)


@router.get("/{order_id}", response_model=OrderResponse)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return get_order_by_id(db, order_id, current_user)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status_endpoint(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _current_admin: User = Depends(require_admin),
):
    return update_order_status(db, order_id, status_data)
