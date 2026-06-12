# BUG-004: Order without product_id is created

Requirement: REQ-008

Severity: High

Environment: Buggy Shop QA Practice API

## Steps to reproduce

1. Send `POST /api/orders` without `product_id`.
2. Check response status code and body.

Request body:

```json
{
  "quantity": 1
}
```

## Expected result

Status code should be `400` and order should not be created.

## Actual result

Status code is `201` and order is created with `product_id: null`.

## Evidence

Endpoint: `POST /api/orders`

This may create invalid data and break downstream order processing.
