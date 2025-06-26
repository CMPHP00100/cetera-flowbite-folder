//pages/api/getEvents.js
import { getDatabase } from '@/lib/database';

export default async function handler(req, res) {
  try {
    // Use your existing database wrapper
    const db = getDatabase(req.cf?.env);
    
    if (req.method === "GET") {
      try {
        const result = await db.prepare("SELECT * FROM events ORDER BY startTime ASC").bind().all();
        const events = result.results || result; // Handle both D1 and SQLite response formats
        
        res.status(200).json(events);
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ error: "Failed to fetch events" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
