/*import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const events = await prisma.event.findMany(); // Replace 'user' with your model name
      res.status(200).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}*/
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const events = await prisma.event.findMany(); // Fetch data from your database
      res.status(200).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}