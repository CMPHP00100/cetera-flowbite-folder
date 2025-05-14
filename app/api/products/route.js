export async function GET(request) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query") || ""; // Extract query parameter

  const apiUrl = query
    ? `https://www.promoplace.com/ws/ws.dll/ConnectAPI?search=${query}` // Fetch filtered results
    : `https://www.promoplace.com/ws/ws.dll/ConnectAPI`; // Fetch all results if no query

  const payload = {
    serviceId: 103,
    apiVer: 130, // Ensure this matches the SAGE API requirements
    auth: {
      acctId: SAGE_ACCT_ID,
      loginId: SAGE_LOGIN_ID,
      key: SAGE_AUTH_KEY,
    },
    search: {
      categories: "Flashlights",
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST", // Change to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`SAGE API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure data.products exists
    const results = data.products?.length
      ? data.products.filter(
          (item) =>
            item.name?.toLowerCase().includes(query.toLowerCase()) ||
            item.spc?.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching SAGE data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
