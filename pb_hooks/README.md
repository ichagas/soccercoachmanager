# PocketBase Hooks

This directory contains PocketBase server-side hooks (JavaScript files that run on the PocketBase server).

## Soccer Coach Manager Hooks

Currently, the Soccer Coach Manager app does not require custom PocketBase hooks. All business logic is handled in the React frontend or through PocketBase's built-in features.

### Future Hooks (Phase 2+)

Potential hooks that may be added in future versions:

1. **Analytics Calculation Hook**
   - Automatically calculate team analytics when a game is saved
   - Update recommended focus areas

2. **Subscription Management Hook** (when subscription tiers are implemented)
   - Handle subscription webhooks
   - Enforce usage limits based on tier

3. **Email Notifications Hook**
   - Send practice plan reminders
   - Weekly digest emails

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

## Testing Hooks

Since PocketBase hooks don't support the same test framework as React, use simple CURL scripts:

```bash
# Example: Test custom endpoint
curl -X POST http://localhost:8090/api/custom-endpoint \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

## Documentation

- [PocketBase Hooks Guide](https://pocketbase.io/docs/js-overview/)
- [PocketBase HTTP Routing](https://pocketbase.io/docs/js-routing/)

## Notes

- Hooks run in a V8 JavaScript environment
- They have full access to the database
- Use hooks for server-side logic only
- Keep hooks simple and focused
