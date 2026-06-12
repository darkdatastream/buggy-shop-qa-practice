# BUG-001: Product price is returned as string instead of number

Requirement: REQ-002

Severity: Medium

Environment: Buggy Shop QA Practice API

## Steps to reproduce

1. Send `GET /api/products`.
2. Inspect product with `id: 2`.
3. Check the type of `price` field.

## Expected result

`price` should be a number.

Example:

```json
"price": 29.99
```

## Actual result

`price` is returned as a string.

```json
"price": "29.99"
```

## Evidence

Endpoint: `GET /api/products`

This can break calculations, sorting, filtering, and schema validation.
