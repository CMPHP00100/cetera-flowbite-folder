// app/api/products/route.js
export async function GET(request) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query") || "";

  const apiUrl = "https://www.promoplace.com/ws/ws.dll/ConnectAPI";

  const payload = {
    serviceId: 103, // Service ID for product search
    apiVer: 130,
    auth: {
      acctId: SAGE_ACCT_ID,
      loginId: SAGE_LOGIN_ID,
      key: SAGE_AUTH_KEY
    },
    search: {
      keywords: query,
      categories: "Flashlights"
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();

    // Transform products to include both prodEId and spc
    const products = data.products?.map(product => ({
      id: product.prodEid, // Numeric ID for API requests
      sku: product.spc,    // Alphanumeric SKU for display
      name: product.name,
      thumbPic: product.thumbPic,
      prc: product.prc,
      // Include other needed fields
    })) || [];

    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Products API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}