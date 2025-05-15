import { useState } from "react";
import axios from "axios";
import Image from "next/image";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // Convert the image to base64
        const imageBase64 = reader.result;

        // Send the base64 image to the API route
        const response = await axios.post("/api/upload", { imageBase64 });

        // Set the Cloudinary image URL
        setImageUrl(response.data.url);
      } catch (err) {
        console.error(err);
        setError("Error uploading image");
      } finally {
        setLoading(false);
      }
    };

    // Read the file as base64
    reader.readAsDataURL(image);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button
        class="upload-button border-2 border-cetera-orange p-1 font-medium text-gray-800 hover:bg-cetera-orange"
        onClick={uploadImage}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div class="image-upload">
          <Image
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "400px" }}
          />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ImageUpload;
