// lib/d1Local.js
let DB;

async function initD1() {
  if (DB) return DB;

  if (process.env.NODE_ENV === "production") {
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
              const data = await res.json();
              return data;
            },
          }),
        };
      },
    };
  } else {
    const { D1Database } = await import("@cloudflare/d1");
    DB = new D1Database({
      databaseId: process.env.CLOUDFLARE_DATABASE_ID,
      token: process.env.CLOUDFLARE_API_TOKEN,
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    });
  }

  return DB;
}

function getD1() {
  if (!DB) throw new Error("D1 not initialized. Call initD1() first.");
  return DB;
}

export { initD1, getD1 };
export default DB;
