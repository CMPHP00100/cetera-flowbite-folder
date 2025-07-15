// app/api/products/route.js - Enhanced debugging version
export async function GET(request) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  const searchParams = new URL(request.url).searchParams;
  
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const limit = parseInt(searchParams.get("limit")) || 20;
  const id = searchParams.get("id");

  console.log('=== PRODUCTS API DEBUG ===');
  console.log('Request URL:', request.url);
  console.log('Search params:', { query, category, limit, id });
  console.log('Env vars present:', {
    SAGE_ACCT_ID: !!SAGE_ACCT_ID,
    SAGE_LOGIN_ID: !!SAGE_LOGIN_ID,
    SAGE_AUTH_KEY: !!SAGE_AUTH_KEY
  });

  if (!SAGE_ACCT_ID || !SAGE_LOGIN_ID || !SAGE_AUTH_KEY) {
    console.error('Missing required environment variables');
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiUrl = "https://www.promoplace.com/ws/ws.dll/ConnectAPI";

  // Build payload
  let payload = {
    serviceId: 103,
    apiVer: 130,
    auth: {
      acctId: SAGE_ACCT_ID,
      loginId: SAGE_LOGIN_ID,
      key: SAGE_AUTH_KEY
    }
  };

  if (id) {
    payload.search = {
      productId: id
    };
  } else {
    payload.search = {
      keywords: query,
      categories: category || "Flashlights",
      limit: limit
    };
  }

  console.log('Payload being sent:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log('External API response status:', response.status);
    console.log('External API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response structure:', Object.keys(data));
    console.log('Full API response:', JSON.stringify(data, null, 2));
    
    // Log different possible locations for products
    console.log('data.products:', data.products);
    console.log('data.searchResults:', data.searchResults);
    console.log('data.list:', data.list);
    console.log('data.result:', data.result);
    console.log('data.items:', data.items);
    
    // Try multiple possible locations for products
    const rawProducts = data.products || 
                       data.searchResults?.products || 
                       data.list?.products || 
                       data.list || 
                       data.result?.products ||
                       data.result ||
                       data.items ||
                       [];

    console.log('Raw products type:', typeof rawProducts);
    console.log('Raw products is array:', Array.isArray(rawProducts));
    console.log('Raw products length:', rawProducts.length);

    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      console.log('First product sample:', JSON.stringify(rawProducts[0], null, 2));
    }

    const products = Array.isArray(rawProducts) 
      ? rawProducts.slice(0, limit).map(product => {
          console.log('Processing product:', product.name || product.title);
          return {
            id: product.prodEid || product.id,
            prodEId: product.prodEid || product.id,
            spc: product.spc,
            name: product.name,
            thumbPic: product.thumbPic,
            prc: product.prc,
            ...product
          };
        })
      : [];

    console.log('Final products count:', products.length);
    console.log('===========================');

    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Products API Error:", error);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check server logs for more information'
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}