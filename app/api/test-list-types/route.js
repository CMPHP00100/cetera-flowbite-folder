// app/api/test-list-types/route.js
export async function GET() {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  
  const apiUrl = "https://www.promoplace.com/ws/ws.dll/ConnectAPI";
  
  // Common list types to try
  const listTypesToTry = [
    "categories",
    "category", 
    "productCategories",
    "product_categories",
    "categoryList",
    "category_list",
    "catList",
    "cats",
    "productCats",
    "prodCategories",
    "classification",
    "classifications",
    "productTypes",
    "product_types",
    "types",
    "groups",
    "productGroups",
    "product_groups"
  ];

  const results = [];

  for (const listType of listTypesToTry) {
    try {
      console.log(`\n=== Testing listType: "${listType}" ===`);
      
      const payload = {
        serviceId: 101,
        apiVer: 130,
        auth: {
          acctId: SAGE_ACCT_ID,
          loginId: SAGE_LOGIN_ID,
          key: SAGE_AUTH_KEY
        },
        listType: listType
      };
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        results.push({
          listType,
          status: 'HTTP_ERROR',
          error: `${response.status} ${response.statusText}`
        });
        continue;
      }

      const data = await response.json();
      
      if (data.ok === false) {
        results.push({
          listType,
          status: 'API_ERROR',
          error: `${data.errNum}: ${data.errMsg}`
        });
      } else {
        // Success! Let's see what we got
        results.push({
          listType,
          status: 'SUCCESS',
          responseKeys: Object.keys(data),
          dataType: Array.isArray(data) ? 'array' : typeof data,
          hasCategories: !!(data.categories || data.list || Array.isArray(data)),
          sampleData: JSON.stringify(data).substring(0, 200) + '...'
        });
        
        console.log(`SUCCESS with listType "${listType}":`, data);
      }
      
    } catch (error) {
      results.push({
        listType,
        status: 'EXCEPTION',
        error: error.message
      });
    }
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}