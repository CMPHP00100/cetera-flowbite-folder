// app/api/productDetails/route.js
export async function GET(request) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Product ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check if the ID is numeric (prodEId)
  const prodEId = parseInt(id);
  if (isNaN(prodEId)) {
    return new Response(
      JSON.stringify({ error: `ID "${id}" is not a valid prodEId. Please ensure you're using numeric product IDs.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload = {
      serviceId: 105,
      apiVer: 130,
      auth: {
        acctId: SAGE_ACCT_ID,
        loginId: SAGE_LOGIN_ID,
        key: SAGE_AUTH_KEY,
      },
      prodEId: prodEId,
      includeSuppInfo: 1
    };

    console.log("API payload:", JSON.stringify(payload, null, 2));

    const response = await fetch("https://www.promoplace.com/ws/ws.dll/ConnectAPI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("API error:", response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch product details" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("External API response:", JSON.stringify(data, null, 2));

    if (!data.product) {
      return new Response(
        JSON.stringify({ error: "Product details not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(data.product),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}