import React, { useEffect, useState } from "react";

export async function fetchR2Images() {
  const response = await fetch("/api/download", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch files");

  return await response.json();
}

export function ImageGallery() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getImages() {
      try {
        const data = await fetchR2Images();
        console.log(data);
        setImages(data.files || []); // Assuming API response contains a `files` array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getImages();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mt-8 flex flex-wrap">
        {images.map((image) => (
          <div
            key={image.key}
            style={{ maxWidth: "200px", textAlign: "center" }}
            className="me-3"
          >
            <img
              src={image.url}
              alt={image.name}
              style={{
                maxWidth: "100%",
                height: "auto",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
            <p style={{ fontSize: "14px", wordBreak: "break-word" }}>
              {image.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
