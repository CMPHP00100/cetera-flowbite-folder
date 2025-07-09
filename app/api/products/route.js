// app/api/products/route.js
export async function GET(request) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query") || "";

  console.log('Search params:', { query }); // Debug

  const apiUrl = "https://www.promoplace.com/ws/ws.dll/ConnectAPI";

   //const category = (searchParams.get("category") == true ? searchParams.get("category") : "Flashlights");

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
      categories: query
    }
  };

  try {
    console.log('Making API request with payload:', payload); // Debug
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    console.log('API response data:', data); // Debug
    
     const rawProducts = data.products || 
                       data.searchResults?.products || 
                       data.list?.products || 
                       data.list || 
                       [];

    // Transform products to include both prodEId and spc
    const products =  Array.isArray(rawProducts) 
      ? rawProducts.map(product => ({
      id: product.prodEid, // Numeric ID for API requests
      sku: product.spc,    // Alphanumeric SKU for display
      name: product.name,
      thumbPic: product.thumbPic,
      prc: product.prc,
      // Include other needed fields
      ...product
    }))
      : [];

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