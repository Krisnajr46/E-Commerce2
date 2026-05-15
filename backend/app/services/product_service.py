import logging

from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.product import ProductResponse
from app.services.cache_service import delete_cache, delete_pattern, get_cache, set_cache

logger = logging.getLogger(__name__)


def _product_detail_cache_key(product_id: int) -> str:
    return f"products:detail:{product_id}"


def _product_list_cache_key(
    skip: int,
    limit: int,
    search: str | None,
    category: str | None,
) -> str:
    return (
        f"products:list:skip={skip}:limit={limit}:"
        f"search={search or ''}:category={category or ''}"
    )


def _serialize_product(product: Product) -> dict:
    return jsonable_encoder(ProductResponse.model_validate(product))


def _serialize_products(products: list[Product]) -> list[dict]:
    return [_serialize_product(product) for product in products]


def _clear_product_list_cache() -> None:
    delete_pattern("products:list:*")


def create_product(db: Session, product_data: ProductCreate) -> Product:
    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    _clear_product_list_cache()
    return product


def get_product_by_id(
    db: Session,
    product_id: int,
    active_only: bool = True,
) -> Product:
    if active_only:
        cache_key = _product_detail_cache_key(product_id)
        cached_product = get_cache(cache_key)
        if cached_product is not None:
            logger.info("Product detail cache hit: %s", cache_key)
            return cached_product
        logger.info("Product detail cache miss: %s", cache_key)

    query = db.query(Product).filter(Product.id == product_id)
    if active_only:
        query = query.filter(Product.is_active.is_(True))

    product = query.first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )
    if active_only:
        set_cache(cache_key, _serialize_product(product))
    return product


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: str | None = None,
    category: str | None = None,
    active_only: bool = True,
) -> list[Product]:
    if active_only:
        cache_key = _product_list_cache_key(skip, limit, search, category)
        cached_products = get_cache(cache_key)
        if cached_products is not None:
            logger.info("Product list cache hit: %s", cache_key)
            return cached_products
        logger.info("Product list cache miss: %s", cache_key)

    query = db.query(Product)

    if active_only:
        query = query.filter(Product.is_active.is_(True))
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Product.category == category)

    products = query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()
    if active_only:
        set_cache(cache_key, _serialize_products(products))
    return products


def update_product(
    db: Session,
    product_id: int,
    product_data: ProductUpdate,
) -> Product:
    product = get_product_by_id(db, product_id, active_only=False)
    update_data = product_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    _clear_product_list_cache()
    delete_cache(_product_detail_cache_key(product_id))
    return product


def delete_product(db: Session, product_id: int) -> Product:
    product = get_product_by_id(db, product_id, active_only=False)
    product.is_active = False
    db.commit()
    db.refresh(product)
    _clear_product_list_cache()
    delete_cache(_product_detail_cache_key(product_id))
    return product
