export default async function handler(req, res) {
  // Check for correct method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Ensure environment variables are set
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;
  if (!SAGE_ACCT_ID || !SAGE_LOGIN_ID || !SAGE_AUTH_KEY) {
    return res.status(500).json({ error: "Missing SAGE API credentials" });
  }

  // Extract the product ID from request body
  const { prodEId } = req.body;
  if (!prodEId) {
    return res.status(400).json({ error: "Missing prodEId in request" });
  }

  const apiUrl = "https://www.promoplace.com/ws/ws.dll/ConnectAPI";

  // Prepare the payload (should match Postman request)
  const payload = {
    serviceId: 104,
    apiVer: 130,
    auth: {
      acctId: SAGE_ACCT_ID,
      loginId: SAGE_LOGIN_ID,
      key: SAGE_AUTH_KEY,
    },
    prodEId: prodEId, // Dynamic Product ID
    includeSuppInfo: 1,
  };

  try {
    console.log(
      "🔄 Sending request to SAGE API:",
      JSON.stringify(payload, null, 2),
    );

    const response = await fetch(apiUrl, {
      method: "POST", // POST request (matches Postman)
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("🔎 Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`SAGE API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Received Data:", data.product);

    // Ensure data contains products
    if (!data.product) {
      return res.status(404).json({ error: "No products found" });
    }

    res.status(200).json(data.product);
  } catch (error) {
    console.error("❌ Error fetching SAGE API:", error.message);
    res.status(500).json({ error: "Failed to fetch data from SAGE API" });
  }
}
