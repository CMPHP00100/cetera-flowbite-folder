import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description, location, startTime, endTime } = req.body;
    if (!title || !description || !location || !startTime || !endTime) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    try {
      const event = await prisma.event.create({
        data: {
          title,
          description,
          location,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        },
      });
      //console.log(event);
      res.status(201).json({ success: true, event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
