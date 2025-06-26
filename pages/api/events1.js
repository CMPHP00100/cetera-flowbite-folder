//pages/api/events.js
import { getDatabase } from '@/lib/database';

export default async function handler(req, res) {
  try {
    // Use your existing database wrapper
    const db = getDatabase(req.cf?.env);
    
    if (req.method === "POST") {
      const { title, description, location, startTime, endTime } = req.body;
      
      // Validate required fields
      if (!title || !description || !location || !startTime || !endTime) {
        return res.status(400).json({ 
          error: "All fields are required" 
        });
      }

      try {
        const result = await db.prepare(`
          INSERT INTO events (title, description, location, startTime, endTime) VALUES (?, ?, ?, ?, ?)
        `).bind(title, description, location, startTime, endTime).run();

        if (result.success) {
          res.status(201).json({ 
            message: "Event created successfully",
            id: result.meta.last_row_id 
          });
        } else {
          res.status(500).json({ error: "Failed to create event" });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ error: "Database error occurred" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}