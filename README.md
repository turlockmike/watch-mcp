# Watch: remote MCP server for watching web pages, prices and JSON values

[![Glama](https://glama.ai/mcp/connectors/com.darmousseh/watch/badge)](https://glama.ai/mcp/connectors/com.darmousseh/watch)

Watch a web page, one part of it (CSS selector), a JSON value or a price **for weeks**, and get the changes by polling, signed webhook or email. One base URL serves both REST and MCP:

- MCP (streamable HTTP): `https://watch.darmousseh.com/mcp`
- REST: `https://watch.darmousseh.com/v1/*`
- Docs and free key: https://watch.darmousseh.com
- Official MCP Registry: `com.darmousseh/watch`

Assistants are good at checking something once and bad at checking it every hour for a month. Watch does the waiting: your agent creates a watch, Watch checks on a schedule, and the agent reads the changes later (or gets a webhook).

## Get a free key (no account, no email)

```sh
curl -X POST -H 'content-type: application/json' \
  -d '{"label":"my-agent"}' https://watch.darmousseh.com/v1/signup
# {"key":"wk_...","mcp_url":"https://watch.darmousseh.com/mcp", ...}
```

Or use the form at https://watch.darmousseh.com/#signup. Free plan: 5 watches, checks every 60 minutes or slower.

## Add it to your client

**Claude (web/desktop):** Settings → Connectors → Add custom connector → URL `https://watch.darmousseh.com/mcp`, header `Authorization: Bearer <key>`.

**Claude Code:**
```sh
claude mcp add --transport http watch https://watch.darmousseh.com/mcp \
  --header "Authorization: Bearer $WATCH_KEY"
```

**Cursor** (`~/.cursor/mcp.json`) / **VS Code** (`.vscode/mcp.json`, key `servers`):
```json
{
  "mcpServers": {
    "watch": {
      "url": "https://watch.darmousseh.com/mcp",
      "headers": { "Authorization": "Bearer wk_your_key" }
    }
  }
}
```

**ChatGPT:** developer mode → add connector with the same URL and header. **Meta Muse:** custom connector, same URL and header.

Then ask: *"Watch this product page and tell me when the price drops below $50."*

## Tools

| Tool | What it does |
|---|---|
| `ping` | Check the key works and show plan limits. Read-only. |
| `create-watch` | Start watching a URL; does one check now to set the baseline. Options: `selector` or `json_path`, `keyword` or `condition`+`threshold`, `regex`, `interval_min`, `webhook_url`. |
| `list-watches` | Your watches, newest first, 10 per page. |
| `get-watch` | One watch with its last value, status and webhook secret. |
| `delete-watch` | Stop and remove a watch (its changes stay readable). |
| `list-changes` | Recorded changes; with `since` returns changes after that cursor, oldest first, for polling. |

`initialize`, `tools/list` and `ping`-style discovery work without a key; `tools/call` needs one (HTTP 401 + `WWW-Authenticate` otherwise).

## REST quick start

```sh
curl -H "Authorization: Bearer $KEY" https://watch.darmousseh.com/v1/ping
curl -X POST -H "Authorization: Bearer $KEY" -H "Idempotency-Key: demo-1" \
  -H "content-type: application/json" \
  -d '{"url":"https://example.com/product","selector":".price","condition":"below","threshold":50,"interval_min":60}' \
  https://watch.darmousseh.com/v1/watches
curl -H "Authorization: Bearer $KEY" "https://watch.darmousseh.com/v1/changes?since=0"
```

Webhooks: POST JSON with header `X-Watch-Signature: t=UNIX,v1=HEX`, where HEX = HMAC-SHA256(webhook_secret, t + "." + body). See [`examples/verify-webhook.js`](examples/verify-webhook.js). Retries after 1m, 5m, 30m, 2h and 6h.

## Use cases

- Price drops on a product page (`selector` + `condition: below`)
- A restock or "sold out" banner (`keyword`)
- A government or public-records JSON API changing a status field (`json_path`)
- Release notes, changelogs, job boards, school or HOA pages (whole page or a `selector`)

## Limits

No JavaScript rendering (the page must carry the value in its HTML or JSON). Public http(s) URLs only. Some large retailers block automated fetches; the watch reports `blocked` instead of silently failing.

## About

Watch is operated by an AI agent (Alfred) for its owner; contact vsm-bot@agentmail.to. [Privacy](https://watch.darmousseh.com/privacy) · [Terms](https://watch.darmousseh.com/terms). This repository holds the docs, registry manifest (`server.json`) and client examples; the examples are MIT licensed.
