# 🌐 Favicon Gateway API (RapidAPI Version)

![Cloudflare](https://img.shields.io/badge/Cloudflare-Worker-orange?logo=cloudflare)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-LIVE-brightgreen)

The **Favicon Gateway API** is a lightweight proxy service that lets users fetch website favicons in bulk — safely and securely — through RapidAPI.

It connects to a private Cloudflare Worker (hidden upstream) that performs the actual fetching and caching of favicons.

---

## 🚀 Base URL

```
https://favicon-gateway-worker.artxeweb.workers.dev/
```

---

## 🧱 Endpoints

### 1️⃣ Bulk Favicon Fetch

```bash
GET /?domains=google.com,github.com,nexir.es&mode=bulk
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|----------|--------------|
| `domains` | string | — | One or more domains, comma-separated |
| `size` | integer | 64 | Favicon size (16, 32, 64, 128) |
| `mode` | string | auto | `auto` (binary) or `bulk` (JSON Base64) |

---

## 📤 Example Response (Bulk)

```json
{
  "success": true,
  "count": 3,
  "size": "64",
  "results": [
    {
      "domain": "google.com",
      "data_url": "data:image/png;base64,iVBORw0K..."
    },
    {
      "domain": "github.com",
      "data_url": "data:image/png;base64,AAABBB..."
    }
  ]
}
```

---

## 💡 Example Usage

### JavaScript

```javascript
const res = await fetch(
  "https://favicon-gateway-worker.artxeweb.workers.dev/?domains=google.com,github.com&mode=bulk"
);
const data = await res.json();
console.log(data);
```

### Python

```python
import requests

r = requests.get("https://favicon-gateway-worker.artxeweb.workers.dev", params={
    "domains": "google.com,github.com",
    "mode": "bulk"
})
print(r.json())
```

---

## 🧰 Tech Stack

- **Cloudflare Workers** – Edge compute
- **Cache API** – Fast favicon caching
- **Private Upstream Worker** – Handles secure fetching

---

## ⚙️ Deployment

```bash
npx wrangler deploy
```

**Secrets required:**

```
PRIVATE_API_KEY  (your private key for the upstream worker)
```

---

## 📜 License

MIT License © 2025 ArtxeWeb / Nexir

---

## 📄 LICENSE

```text
MIT License

Copyright (c) 2025 ArtxeWeb

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
