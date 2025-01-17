import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { title, description, location, startTime, endTime } = req.body;
      if (!title || !description || !location || !startTime || !endTime) {
        return res.status(400).json({ error: "This is required" });
      }
      const updatedEvent = await prisma.event.update({
        where: { id: parseInt(id, 10) },
        data: { title, description, location, startTime, endTime },
      });
      return res.status(200).json(updatedEvent);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update event" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
