import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const images = await prisma.image.findMany();
      res.status(200).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
