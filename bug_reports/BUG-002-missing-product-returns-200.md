# BUG-002: Missing product returns 200 instead of 404

Requirement: REQ-004

Severity: Medium

Environment: Buggy Shop QA Practice API

## Steps to reproduce

1. Send `GET /api/products/999`.
2. Check response status code.

## Expected result

Status code should be `404` because product `999` does not exist.

## Actual result

Status code is `200`.

## Evidence

Endpoint: `GET /api/products/999`

Returning `200` for a missing resource can mislead clients and automated tests.
