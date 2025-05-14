export default async function handler(req, res) {
  const { SAGE_ACCT_ID, SAGE_LOGIN_ID, SAGE_AUTH_KEY } = process.env;

  const payload = {
    serviceId: 103,
    apiVer: 130, // Ensure this matches the SAGE API requirements
    auth: {
      acctId: SAGE_ACCT_ID,
      loginId: SAGE_LOGIN_ID,
      key: SAGE_AUTH_KEY,
    },
    search: {
      categories: "Books, Flashlights",
    },
  };

  try {
    const response = await fetch(
      "https://www.promoplace.com/ws/ws.dll/ConnectAPI",
      {
        method: "POST", // Change to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`SAGE API Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching SAGE data:", error);
    res.status(500).json({ error: "Failed to fetch data from SAGE API" });
  }
}
