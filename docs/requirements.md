# Requirements

## REQ-001: Health check

`GET /api/health` should return status `200` and a JSON body containing `status: ok`.

## REQ-002: Product list schema

`GET /api/products` should return a JSON array of products.

Each product should contain:

- `id` as number
- `name` as string
- `price` as number
- `inStock` as boolean
- `category` as string

## REQ-003: Existing product by ID

`GET /api/products/1` should return status `200` and product data for product ID `1`.

## REQ-004: Missing product by ID

`GET /api/products/999` should return status `404`.

## REQ-005: Valid login

`POST /api/login` with valid credentials should return status `200` and a token.

## REQ-006: Invalid login

`POST /api/login` with incorrect password should return status `401`.

## REQ-007: Create order

`POST /api/orders` with valid `product_id` should return status `201` and created order data.

## REQ-008: Create order validation

`POST /api/orders` without `product_id` should return status `400`.

## REQ-009: Orders require authorization

`GET /api/orders` without valid authorization should return status `401`.

`GET /api/orders` with header `Authorization: Bearer demo-token-user` should return status `200` and order list.
