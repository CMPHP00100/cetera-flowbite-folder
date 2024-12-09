import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password, // In production, hash passwords before storing
        },
      });

      res.status(201).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to create user" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
