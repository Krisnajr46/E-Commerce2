from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import (
    create_product,
    delete_product,
    get_product_by_id,
    get_products,
    update_product,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[ProductResponse])
def list_products(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    return get_products(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        category=category,
        active_only=True,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    return get_product_by_id(db, product_id, active_only=True)


@router.post("", response_model=ProductResponse, status_code=201)
def create_product_endpoint(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    _current_admin: User = Depends(require_admin),
):
    return create_product(db, product_data)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product_endpoint(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    _current_admin: User = Depends(require_admin),
):
    return update_product(db, product_id, product_data)


@router.delete("/{product_id}", response_model=ProductResponse)
def delete_product_endpoint(
    product_id: int,
    db: Session = Depends(get_db),
    _current_admin: User = Depends(require_admin),
):
    return delete_product(db, product_id)
