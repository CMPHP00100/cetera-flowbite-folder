/*import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images when the component mounts
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/imgfetch");

        setImages(response.data.resources || []); // Assuming resources array exists
      } catch (err) {
        console.error(err);
        setError("Error fetching images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div class="row">
        {images.map((image) => (
          <div
            class="col-12 col-sm-6 col-md-3 w-full py-2.5"
            key={image.public_id}
          >
            <Image
              className="object-cover"
              src={image.secure_url}
              alt={image.public_id}
              //style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;*/
