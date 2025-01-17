import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query; // Extract ID from the URL

  if (req.method === "DELETE") {
    try {
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // Ensure ID is parsed to an integer
      const deletedEvent = await prisma.event.delete({
        where: {
          id: parseInt(id, 10), // Ensure ID is an integer
        },
      });

      return res.status(200).json({
        message: `Event with ID ${id} deleted successfully`,
        deletedEvent,
      });
    } catch (error) {
      console.error("Error deleting event:", error);

      if (error.code === "P2025") {
        // Record not found
        return res.status(404).json({ error: "Event not found" });
      }

      return res.status(500).json({ error: "Failed to delete event" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
