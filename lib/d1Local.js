// lib/d1Local.js
let DB;

if (process.env.NODE_ENV === "production") {
  // Proxy to your Cloudflare Worker endpoint
  DB = {
    prepare(query) {
      return {
        bind: (...params) => ({
          async first() {
            const res = await fetch(process.env.NEXT_PUBLIC_PROD_API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query, params }),
            });
            const data = await res.json();
            return Array.isArray(data) ? data[0] : data;
          },
          async all() {
            const res = await fetch(process.env.NEXT_PUBLIC_PROD_API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query, params }),
            });
            return res.json();
          },
        }),
      };
    },
  };
} else {
  // Local dev with Wrangler bindings
  const { D1Database } = await import("@cloudflare/d1");
  // Assumes you’ve bound your DB locally with Wrangler (e.g. `cetera-sandbox-db`)
  DB = new D1Database({
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    token: process.env.CLOUDFLARE_API_TOKEN,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  });
}

export default DB;
