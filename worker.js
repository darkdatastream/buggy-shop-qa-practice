const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const rateLimitBuckets = new Map();

const products = [
  { id: 1, name: "Mechanical Keyboard", price: 79.99, inStock: true, category: "peripherals" },
  { id: 2, name: "USB-C Hub", price: "29.99", inStock: true, category: "accessories" }, // INTENTIONAL BUG: price should be number, not string.
  { id: 3, name: "27-inch Monitor", price: 189.5, inStock: false, category: "displays" },
];

const orders = [
  { id: 1001, product_id: 1, quantity: 1, status: "created" },
];

// Mock-only demo credentials for a controlled QA training target.
// These are intentionally fake values, not real secrets.
const validUser = {
  email: "qa@example.com",
  password: "correct-password",
  role: "user",
};

const mockToken = "demo-token-user";

function getClientIp(request) {
  return request.headers.get("cf-connecting-ip") || "local-dev";
}

function checkRateLimit(request) {
  const key = getClientIp(request);
  const now = Date.now();
  const existing = rateLimitBuckets.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  existing.count += 1;
  rateLimitBuckets.set(key, existing);

  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { limited: false, retryAfterSeconds: 0 };
}

function getCorsHeaders(request) {
  const requestOrigin = request.headers.get("origin");
  const currentOrigin = new URL(request.url).origin;
  const allowedOrigin = !requestOrigin || requestOrigin === currentOrigin ? currentOrigin : "null";

  return {
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "vary": "Origin",
  };
}

function json(request, data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...getCorsHeaders(request),
      ...extraHeaders,
    },
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

function parseJsonBody(request) {
  return request.json().catch(() => null);
}

function getHomePage(origin) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Buggy Shop QA Practice API</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0d1117;
      --panel: rgba(22, 27, 34, 0.86);
      --panel-strong: rgba(33, 38, 45, 0.95);
      --text: #e6edf3;
      --muted: #9da7b3;
      --border: rgba(139, 148, 158, 0.28);
      --accent: #7dd3fc;
      --good: #86efac;
      --warn: #fbbf24;
      --bad: #f87171;
      --code: #111827;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 20% 20%, rgba(125, 211, 252, 0.18), transparent 35%),
        radial-gradient(circle at 80% 0%, rgba(168, 85, 247, 0.16), transparent 32%),
        radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.12), transparent 36%),
        var(--bg);
      color: var(--text);
      line-height: 1.55;
    }

    .wrap {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 48px 0 72px;
    }

    .hero {
      padding: 36px;
      border: 1px solid var(--border);
      border-radius: 28px;
      background: linear-gradient(135deg, rgba(22, 27, 34, 0.94), rgba(22, 27, 34, 0.66));
      box-shadow: 0 22px 80px rgba(0,0,0,0.34);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: 999px;
      color: var(--accent);
      background: rgba(125, 211, 252, 0.08);
      font-weight: 700;
      font-size: 14px;
    }

    h1 {
      margin: 18px 0 12px;
      font-size: clamp(36px, 6vw, 72px);
      line-height: 0.95;
      letter-spacing: -0.06em;
    }

    h2 {
      margin: 0 0 14px;
      font-size: 24px;
      letter-spacing: -0.03em;
    }

    p { color: var(--muted); margin: 0; max-width: 820px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-top: 22px;
    }

    .card {
      padding: 22px;
      border: 1px solid var(--border);
      border-radius: 22px;
      background: var(--panel);
    }

    .endpoint {
      display: grid;
      grid-template-columns: 90px 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }

    .endpoint:last-child { border-bottom: 0; }

    .method {
      display: inline-flex;
      justify-content: center;
      padding: 5px 9px;
      border-radius: 8px;
      background: rgba(125, 211, 252, 0.12);
      color: var(--accent);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 800;
      font-size: 13px;
    }

    code, pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    code {
      color: #dbeafe;
      background: rgba(17, 24, 39, 0.88);
      border: 1px solid var(--border);
      padding: 3px 6px;
      border-radius: 8px;
    }

    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: var(--code);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      color: #dbeafe;
    }

    .pill {
      font-size: 12px;
      padding: 5px 8px;
      border-radius: 999px;
      color: var(--warn);
      background: rgba(251, 191, 36, 0.11);
      border: 1px solid rgba(251, 191, 36, 0.22);
      font-weight: 700;
    }

    .ok { color: var(--good); }
    .bad { color: var(--bad); }

    .footer {
      margin-top: 24px;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 820px) {
      .grid { grid-template-columns: 1fr; }
      .hero { padding: 24px; }
      .endpoint { grid-template-columns: 78px 1fr; }
      .pill { grid-column: 2; width: fit-content; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <span class="badge">QA Practice API · Cloudflare Worker</span>
      <h1>Buggy Shop</h1>
      <p>
        A small intentional-bug API for practicing manual API testing in Postman and automated tests with Python, pytest and requests.
        This page is documentation. The real test target is the JSON API below.
        Credentials and tokens are mock-only demo values, not real secrets.
      </p>
    </section>

    <section class="grid">
      <article class="card">
        <h2>API endpoints</h2>
        <div class="endpoint"><span class="method">GET</span><code>/api/health</code><span class="pill">smoke</span></div>
        <div class="endpoint"><span class="method">GET</span><code>/api/products</code><span class="pill">data validation</span></div>
        <div class="endpoint"><span class="method">GET</span><code>/api/products/1</code><span class="pill">positive</span></div>
        <div class="endpoint"><span class="method">GET</span><code>/api/products/999</code><span class="pill">negative</span></div>
        <div class="endpoint"><span class="method">POST</span><code>/api/login</code><span class="pill">auth</span></div>
        <div class="endpoint"><span class="method">POST</span><code>/api/orders</code><span class="pill">validation</span></div>
        <div class="endpoint"><span class="method">GET</span><code>/api/orders</code><span class="pill">auth / roles</span></div>
      </article>

      <article class="card">
        <h2>Requirements to test</h2>
        <p><span class="ok">REQ-001</span> Health endpoint should return status 200 and <code>{ "status": "ok" }</code>.</p><br>
        <p><span class="ok">REQ-002</span> Product list should return products with numeric <code>id</code> and numeric <code>price</code>.</p><br>
        <p><span class="ok">REQ-003</span> Missing product should return status 404.</p><br>
        <p><span class="ok">REQ-004</span> Invalid login should return status 401.</p><br>
        <p><span class="ok">REQ-005</span> Order without <code>product_id</code> should return status 400.</p>
      </article>
    </section>

    <section class="grid">
      <article class="card">
        <h2>Example login request</h2>
        <pre>POST ${origin}/api/login
Content-Type: application/json

{
  "email": "qa@example.com",
  "password": "correct-password"
}</pre>
      </article>

      <article class="card">
        <h2>Intentional bugs</h2>
        <p><span class="bad">BUG-001</span> Product 2 has <code>price</code> as string instead of number.</p><br>
        <p><span class="bad">BUG-002</span> Missing product <code>/api/products/999</code> incorrectly returns 200 instead of 404.</p><br>
        <p><span class="bad">BUG-003</span> Invalid login incorrectly returns 200 instead of 401.</p><br>
        <p><span class="bad">BUG-004</span> Order without <code>product_id</code> incorrectly returns 201 instead of 400.</p>
      </article>
    </section>

    <p class="footer">Use this app as a controlled QA training target: requirement → Postman check → pytest automation → bug report → evidence.</p>
  </main>
</body>
</html>`;
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(request),
    });
  }

  const rateLimit = checkRateLimit(request);
  if (rateLimit.limited) {
    return json(
      request,
      { error: "rate limit exceeded", retry_after_seconds: rateLimit.retryAfterSeconds },
      429,
      { "retry-after": String(rateLimit.retryAfterSeconds) },
    );
  }

  if (path === "/" && request.method === "GET") {
    return html(getHomePage(url.origin));
  }

  if (path === "/api/health" && request.method === "GET") {
    return json(request, { status: "ok", service: "buggy-shop-api", version: "1.0.0" });
  }

  if (path === "/api/products" && request.method === "GET") {
    return json(request, products);
  }

  const productMatch = path.match(/^\/api\/products\/(\d+)$/);
  if (productMatch && request.method === "GET") {
    const productId = Number(productMatch[1]);
    const product = products.find((item) => item.id === productId);

    if (!product) {
      // INTENTIONAL BUG: requirement says missing product should return 404.
      return json(request, { id: productId, name: null, message: "Product not found" }, 200);
    }

    return json(request, product);
  }

  if (path === "/api/login" && request.method === "POST") {
    const body = await parseJsonBody(request);

    if (!body || !body.email || !body.password) {
      return json(request, { error: "email and password are required" }, 400);
    }

    if (body.email === validUser.email && body.password === validUser.password) {
      return json(request, { token: mockToken, role: validUser.role }, 200);
    }

    // INTENTIONAL BUG: requirement says invalid login should return 401.
    return json(request, { token: null, error: "invalid credentials" }, 200);
  }

  if (path === "/api/orders" && request.method === "POST") {
    const body = await parseJsonBody(request);

    if (!body) {
      return json(request, { error: "invalid JSON body" }, 400);
    }

    if (!body.product_id) {
      // INTENTIONAL BUG: requirement says missing product_id should return 400.
      return json(request, { id: 1002, product_id: null, quantity: body.quantity || 1, status: "created" }, 201);
    }

    const product = products.find((item) => item.id === Number(body.product_id));
    if (!product) {
      return json(request, { error: "product does not exist" }, 404);
    }

    const order = {
      id: 1000 + orders.length + 1,
      product_id: Number(body.product_id),
      quantity: body.quantity || 1,
      status: "created",
    };

    orders.push(order);
    return json(request, order, 201);
  }

  if (path === "/api/orders" && request.method === "GET") {
    const auth = request.headers.get("authorization") || "";

    if (auth !== `Bearer ${mockToken}`) {
      return json(request, { error: "missing or invalid token" }, 401);
    }

    return json(request, orders);
  }

  return json(request, { error: "route not found", path, method: request.method }, 404);
}

export default {
  async fetch(request) {
    return handleRequest(request);
  },
};
