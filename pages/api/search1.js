export default async function handler(req, res) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  if (req.method !== "GET") return res.status(405).end();
  const { query } = req.query; // Example: /api/sageSearch?query=invoice

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
    // Ensure data.results exists
    //const results = data.products || [];

    const results = data.products?.length
      ? data.products.filter(
          (item) =>
            item.name?.toLowerCase().includes(query.toLowerCase()) ||
            item.spc?.toLowerCase().includes(query.toLowerCase()),
        )
      : [];
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching SAGE data:", error);
    res.status(500).json({ error: "Failed to fetch data from SAGE API" });
  }
}
