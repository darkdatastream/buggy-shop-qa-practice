# Traceability Matrix

This matrix connects requirements, manual test cases, automated pytest tests and known bug reports.

| Requirement | Manual test case | Automated pytest test | Bug report | Status |
|---|---|---|---|---|
| REQ-001 Health check | TC-001 | `test_health_returns_ok` | N/A | PASS |
| REQ-002 Product list schema | TC-002 | `test_products_list_returns_array` | N/A | PASS |
| REQ-002 Product list schema | TC-002 | `test_all_products_have_numeric_price` | BUG-001 | KNOWN DEFECT / XFAIL |
| REQ-003 Existing product by ID | TC-006 | `test_existing_product_returns_correct_id` | N/A | PASS |
| REQ-004 Missing product by ID | TC-003 | `test_missing_product_returns_404` | BUG-002 | KNOWN DEFECT / XFAIL |
| REQ-005 Valid login | TC-007 | `test_valid_login_returns_token` | N/A | PASS |
| REQ-006 Invalid login | TC-004 | `test_invalid_login_returns_401` | BUG-003 | KNOWN DEFECT / XFAIL |
| REQ-007 Create order | TC-008 | `test_create_order_with_valid_product_id_returns_201` | N/A | PASS |
| REQ-008 Create order validation | TC-005 | `test_create_order_without_product_id_returns_400` | BUG-004 | KNOWN DEFECT / XFAIL |
| REQ-009 Orders require authorization | TC-009 | Not yet automated | N/A | MANUAL COVERAGE ONLY |

## Notes

- `XFAIL` means the test documents a known intentional defect in the training API.
- `MANUAL COVERAGE ONLY` means the requirement has a manual test case but should receive automated coverage in a future iteration.
- This matrix is the main QA traceability artifact for the project.
