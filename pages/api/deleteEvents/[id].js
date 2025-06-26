//pages/api/deleteEvents/[id].js
import { getDatabase } from '@/lib/database';

export default async function handler(req, res) {
  try {
    // Use your existing database wrapper
    const db = getDatabase(req.cf?.env);
    
    if (req.method === "DELETE") {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: "Event ID is required" });
      }

      try {
        const result = await db.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
        
        if (result.success) {
          res.status(200).json({ message: "Event deleted successfully" });
        } else {
          res.status(404).json({ error: "Event not found" });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ error: "Failed to delete event" });
      }
    } else {
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}