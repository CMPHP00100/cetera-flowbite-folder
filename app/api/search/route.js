// app/api/search/route.js
export async function GET(request) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const keywords = searchParams.get("keywords") || "";

  console.log('Search params:', { query, category, keywords });

  const apiUrl = "https://www.promoplace.com/ws/ws.dll/ConnectAPI";

  // Build the search payload
  const payload = {
    serviceId: 103, // Service ID for product search
    apiVer: 130,
    auth: {
      acctId: SAGE_ACCT_ID,
      loginId: SAGE_LOGIN_ID,
      key: SAGE_AUTH_KEY
    },
    search: {}
  };

  // Add search criteria based on what's provided
  if (keywords) {
    payload.search.keywords = keywords;
  }
  
  if (category) {
    payload.search.categories = category;
  } else if (query) {
    // If no specific category, use query for both keywords and categories
    payload.search.keywords = query;
    payload.search.categories = query;
  }

  try {
    console.log('Making API request with payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    console.log('API response structure:', Object.keys(data));
    
    // Try different possible response structures for products
    const rawProducts = data.products ||
                        data.searchResults?.products ||
                        data.list?.products ||
                        data.list ||
                        data.results ||
                        [];

    console.log('Raw products found:', Array.isArray(rawProducts) ? rawProducts.length : 'Not an array');

    // Transform products to ensure consistent structure
    const products = Array.isArray(rawProducts)
      ? rawProducts.map(product => ({
          // Use multiple possible ID fields
          id: product.prodEid || product.prodEId || product.id,
          prodEId: product.prodEid || product.prodEId || product.id,
          spc: product.spc || product.sku,
          name: product.name || product.title || product.productName,
          thumbPic: product.thumbPic || product.thumbnail || product.image,
          prc: product.prc || product.price,
          // Include all original fields
          ...product
        }))
      : [];

    console.log('Transformed products:', products.length);

    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, products: [] }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}