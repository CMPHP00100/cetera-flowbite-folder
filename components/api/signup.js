import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    // Validate the input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: "User created successfully!", user });
    } catch (error) {
      if (error.code === "P2002") {
        res.status(400).json({ error: "Email already in use." });
      } else {
        res.status(500).json({ error: "Something went wrong." });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
