# Data Privacy Notes

## Data used by the project

This project uses fictional product data and mock-only credentials.

It does not require:

- real names
- real emails
- real passwords
- customer data
- payment data
- personal documents

## Evidence files

Raw local evidence files can accidentally include:

- local usernames
- local machine names
- local paths
- deployed URLs
- timestamps

For that reason, `.gitignore` excludes raw evidence files by default.

Commit only sanitized evidence examples.

## Cloudflare deployment

The deployed Worker serves the code from `worker.js`. It should not expose local paths or machine names in HTTP responses.

Before sharing publicly, run the repository scan and a public response scan.

```bash
npm run scan:security
BASE_URL="https://your-worker-url.workers.dev"
curl -s "$BASE_URL/" | grep -Ein "<your-local-username>|<your-machine-name>|<local-path>|secret|client_secret|access_key|api_key|private" || true
```

Replace the placeholders with your real local identifiers before running the public response check.
