import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { imageBase64 } = req.body;

    try {
      // Replace with your Cloudinary credentials
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      // Cloudinary API URL for uploading
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      // Form data to send to Cloudinary
      const formData = new FormData();
      formData.append("file", imageBase64);
      formData.append("upload_preset", "cetera_uploads"); // Set an upload preset in Cloudinary
      formData.append("api_key", apiKey);

      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Send back the Cloudinary image URL
      res.status(200).json({ url: response.data.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
