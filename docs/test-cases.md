# Manual Test Cases

## TC-001: Health endpoint returns OK

Requirement: REQ-001

Precondition: API is available.

Steps:
1. Send `GET /api/health`.
2. Check response status.
3. Check JSON body.

Expected result:
- Status code is `200`.
- Body contains `status: ok`.

## TC-002: Products list has valid schema

Requirement: REQ-002

Steps:
1. Send `GET /api/products`.
2. Check response status.
3. Check that response body is an array.
4. Check each product field and data type.

Expected result:
- Status code is `200`.
- Response is array.
- Every product has numeric `id` and numeric `price`.

## TC-003: Missing product returns 404

Requirement: REQ-004

Steps:
1. Send `GET /api/products/999`.
2. Check response status.

Expected result:
- Status code is `404`.

## TC-004: Invalid login is rejected

Requirement: REQ-006

Steps:
1. Send `POST /api/login` with body:

```json
{
  "email": "qa@example.com",
  "password": "wrong-password"
}
```

Expected result:
- Status code is `401`.
- Response does not contain valid token.

## TC-005: Order without product_id is rejected

Requirement: REQ-008

Steps:
1. Send `POST /api/orders` with body:

```json
{
  "quantity": 1
}
```

Expected result:
- Status code is `400`.
- Response explains that `product_id` is required.

## TC-006: Existing product returns correct ID

Requirement: REQ-003

Steps:
1. Send `GET /api/products/1`.
2. Check response status.
3. Check JSON body.

Expected result:
- Status code is `200`.
- Response body contains `id: 1`.

## TC-007: Valid login returns mock token

Requirement: REQ-005

Steps:
1. Send `POST /api/login` with the documented mock credentials.
2. Check response status.
3. Check response body.

Expected result:
- Status code is `200`.
- Response contains the documented mock token.

## TC-008: Valid order is created

Requirement: REQ-007

Steps:
1. Send `POST /api/orders` with a valid `product_id` and `quantity`.
2. Check response status.
3. Check response body.

Expected result:
- Status code is `201`.
- Response contains created order data.

## TC-009: Orders endpoint requires authorization

Requirement: REQ-009

Steps:
1. Send `GET /api/orders` without authorization header.
2. Send `GET /api/orders` with the documented mock authorization header.

Expected result:
- Request without authorization returns `401`.
- Request with documented mock authorization returns `200` and order list.
