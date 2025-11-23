# PocketBase Hooks

This directory will contain PocketBase server-side hooks (JavaScript files that run on the PocketBase server).

## Planned Hooks

### 1. fetch_url.pb.js (Sprint 6)
Endpoint to fetch and extract text from URLs.

**Endpoint:** `POST /api/fetch-url`

**Request:**
```json
{
  "url": "https://example.com/blog-post"
}
```

**Response:**
```json
{
  "success": true,
  "text": "Extracted text content...",
  "title": "Page title"
}
```

### 2. stripe_webhook.pb.js (Sprint 10)
Handle Stripe webhooks for subscription management.

**Endpoint:** `POST /api/stripe-webhook`

**Events handled:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Hook Development

PocketBase hooks are written in JavaScript and have access to:
- `$app` - PocketBase app instance
- `$http` - HTTP client for making requests
- Database collections and records
- Environment variables

Example hook structure:
```javascript
routerAdd("POST", "/api/custom-endpoint", (c) => {
  const data = $apis.requestInfo(c).data

  // Your logic here

  return c.json(200, { success: true })
})
```

## Documentation

- [PocketBase Hooks Guide](https://pocketbase.io/docs/js-overview/)
- [PocketBase HTTP Routing](https://pocketbase.io/docs/js-routing/)

## Notes

- Hooks run in a V8 JavaScript environment
- They have full access to the database
- Use hooks for server-side logic only (e.g., webhooks, URL fetching)
- Keep hooks simple and focused
