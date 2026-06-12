# Known Intentional Defects

This project intentionally contains defects so that QA work produces meaningful findings.

## Why xfail is used

Some pytest tests are marked with `pytest.mark.xfail` because the API currently violates the requirement on purpose.

This is not used to hide a broken test. It is used to document a known defect while keeping the full test suite executable.

## Known defects

| Bug ID | Requirement | Summary | Pytest marker |
|---|---|---|---|
| BUG-001 | REQ-002 | Product 2 returns `price` as string instead of number | xfail |
| BUG-002 | REQ-004 | Missing product returns success-style response instead of 404 | xfail |
| BUG-003 | REQ-006 | Invalid login returns 200 instead of 401 | xfail |
| BUG-004 | REQ-008 | Order without `product_id` returns 201 instead of 400 | xfail |

## Interview explanation

A useful explanation is:

```text
The xfailed tests represent documented known defects in the intentional-bug API. Passing tests confirm expected behavior, while xfailed tests preserve traceability between requirements, failing behavior and bug reports.
```
