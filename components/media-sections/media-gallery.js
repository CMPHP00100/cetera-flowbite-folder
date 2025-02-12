/*import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description, imageURL, price, color, sku } = req.body;
    if (!title || !imageURL || !price) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    try {
      const item = await prisma.item.create({
        data: {
          title,
          description,
          imageURL,
          price: parseFloat(price),
          color,
          sku,
        },
      });
      console.log(item);
      res.status(201).json({ success: true, item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

import prisma from "../../lib/prisma"; // Import your Prisma client

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description, imageURL, price, color, sku } = req.body;

    try {
      const apiItem = await prisma.item.create({
        data: {
          title,
          description,
          imageURL,
          price: parseFloat(price),
          color,
          sku,
        },
      });
      console.log(item);
      res.status(201).json({ success: true, apiItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}*/
