//pages/api/editEvents/[id].js
import { getDatabase } from '@/lib/database';

export default async function handler(req, res) {
  try {
    // Use your existing database wrapper
    const db = getDatabase(req.cf?.env);
    
    if (req.method === "PUT") {
      const { id } = req.query;
      const { title, description, location, startTime, endTime } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: "Event ID is required" });
      }
      
      // Validate required fields
      if (!title || !description || !location || !startTime || !endTime) {
        return res.status(400).json({ 
          error: "All fields are required" 
        });
      }

      try {
        const result = await db.prepare(`
          UPDATE events SET title = ?, description = ?, location = ?, startTime = ?, endTime = ? WHERE id = ?
        `).bind(title, description, location, startTime, endTime, id).run();

        if (result.success) {
          res.status(200).json({ message: "Event updated successfully" });
        } else {
          res.status(404).json({ error: "Event not found" });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ error: "Failed to update event" });
      }
    } else {
      res.setHeader("Allow", ["PUT"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}