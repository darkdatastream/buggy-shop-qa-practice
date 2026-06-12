# Security Notes

## Project type

This is a public QA practice project with intentional bugs. It is not a production application.

## No real secrets

The project must not contain real credentials, API keys, private tokens or customer data.

The following values are documented mock-only training values:

```text
qa@example.com
correct-password
wrong-password
demo-token-user
Bearer demo-token-user
```

They are intentionally fake and must not be reused in real systems.

## Local identity protection

Before publishing to GitHub, run:

```bash
npm run scan:security
```

The scan checks for configured local identity patterns such as local usernames, machine names, local paths and obvious secret-like values.

## CORS

The Worker avoids wildcard `Access-Control-Allow-Origin: *` and only allows same-origin browser requests for CORS use.

Postman, curl and pytest do not depend on browser CORS.

## Rate limiting

A simple in-memory demo rate limit exists to show the security concept.

Limitations:

- It is not a production-grade rate limiter.
- Cloudflare Worker isolates can reset memory.
- For production, use platform-level rate limiting or durable storage.

## Reporting issues

For this training project, document findings as Markdown bug reports in `bug_reports/` with:

- title
- requirement
- steps to reproduce
- expected result
- actual result
- evidence
- impact
