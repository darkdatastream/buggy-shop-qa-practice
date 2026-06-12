# BUG-003: Invalid login returns 200 instead of 401

Requirement: REQ-006

Severity: High

Environment: Buggy Shop QA Practice API

## Steps to reproduce

1. Send `POST /api/login` with incorrect password.
2. Check response status code.

Request body:

```json
{
  "email": "qa@example.com",
  "password": "wrong-password"
}
```

## Expected result

Status code should be `401`.

## Actual result

Status code is `200`.

## Evidence

Endpoint: `POST /api/login`

Incorrect authentication status codes can cause incorrect client-side behavior and security confusion.
