# Buggy Shop QA Practice API

A small Cloudflare Worker project for practicing practical QA/API testing.

The project contains:

- one HTML documentation page
- JSON API endpoints
- intentional bugs
- requirements
- manual test cases
- traceability matrix
- example bug reports
- Postman collection
- pytest tests
- GitHub Actions CI
- lightweight security scan
- security and data privacy notes

## Goal

This project is not a normal shop application. It is a controlled QA training target.

The workflow is:

```text
Requirement -> Test case -> Postman request -> pytest test -> bug report -> evidence
```

## Public safety note

This project uses mock-only demo credentials:

```text
email: qa@example.com
password: correct-password
Authorization header for orders:
Bearer demo-token-user
```

These values are intentionally fake training data. They are not real secrets and must never be reused in real systems.

## API endpoints

```text
GET  /api/health
GET  /api/products
GET  /api/products/1
GET  /api/products/999
POST /api/login
POST /api/orders
GET  /api/orders
```

## Local run with Wrangler

```bash
npm install -g wrangler
wrangler dev
```

Then open the local URL shown by Wrangler.

## Deploy to Cloudflare Workers

```bash
wrangler login
wrangler deploy
```

## Run Python tests

Set your deployed or local base URL:

```bash
export BASE_URL="https://your-worker-name.your-subdomain.workers.dev"
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements-test.txt
pytest -q
```

Expected training result:

```text
5 passed, 4 xfailed
```

The `xfailed` tests are documented known intentional defects. They are not broken tests.

## Local quality gate

```bash
npm run check:worker
npm run scan:security
pytest -q
```

Or all together:

```bash
npm run quality:local
```

## Documentation map

```text
docs/requirements.md           test basis / requirements
docs/test-cases.md             manual test cases
docs/traceability-matrix.md    REQ -> TC -> TEST -> BUG mapping
docs/known-defects.md          known intentional defects and xfail explanation
TEST_STRATEGY.md               test strategy and scope
SECURITY.md                    safety notes and supported checks
DATA_PRIVACY.md                data/privacy notes
```

## What this demonstrates

- API exploration in Postman
- HTTP status code checks
- JSON response validation
- negative testing
- bug reporting with expected vs actual result
- pytest automation with requests
- traceability from requirement to test and defect
- evidence-based QA thinking
- basic CI and safety checks
