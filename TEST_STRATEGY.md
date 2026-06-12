# Test Strategy

## Purpose

This project is a controlled QA practice target for API testing. It is designed to demonstrate practical QA thinking, not production shop functionality.

## Test basis

The test basis is:

- `docs/requirements.md`
- `docs/test-cases.md`
- `docs/traceability-matrix.md`
- intentional behavior implemented in `worker.js`

## Scope

In scope:

- HTTP status code validation
- JSON response structure validation
- positive API checks
- negative API checks
- basic authentication behavior using mock credentials
- documented known intentional defects
- pytest automation with `requests`
- Postman collection for manual exploration
- lightweight repository safety checks

Out of scope:

- real authentication
- real user accounts
- real payments
- database persistence
- performance testing beyond the simple demo rate limit
- production-grade security hardening

## Test levels represented

- API/system-level checks through public HTTP endpoints
- manual test cases for exploratory and repeatable manual checks
- automated regression checks with pytest

## Risk focus

The main risks covered are:

- wrong status codes
- invalid response schema
- missing validation
- incorrect handling of missing resources
- incorrect authentication failure behavior
- accidental publishing of local identity strings or secret-like values

## Known defects and xfail policy

Known intentional defects are documented in:

- `docs/known-defects.md`
- `bug_reports/`
- `docs/traceability-matrix.md`

`pytest.mark.xfail` is used only where a known intentional defect exists. It must include a reason containing the bug ID.

## Evidence

Local execution evidence can be stored under `evidence/`, but raw local evidence files are ignored by Git because they can contain local paths, timestamps or deployed URLs.

Only sanitized example evidence should be committed.

## Exit criteria for this training version

- Worker syntax check passes.
- Security scan passes.
- Pytest suite runs successfully with expected result: `5 passed, 4 xfailed`.
- Requirements, test cases, bug reports and automated tests are traceable.
