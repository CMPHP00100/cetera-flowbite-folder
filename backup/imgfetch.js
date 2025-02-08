import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const {
        CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET,
      } = process.env;

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image`;

      // Make the request to Cloudinary
      const response = await axios.get(cloudinaryUrl, {
        auth: {
          username: CLOUDINARY_API_KEY,
          password: CLOUDINARY_API_SECRET,
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
