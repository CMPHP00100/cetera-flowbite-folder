import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

export async function fetchR2Images() {
  const response = await fetch("/api/mediaDownloader", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch files");

  return await response.json();
}

export function ImageGallery({ refresh }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImages = useCallback(async () => {
    try {
      const data = await fetchR2Images();
      console.log(data);
      setImages(data.files || []); // Assuming API response contains a `files` array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    getImages();
  }, [refresh, getImages]);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mt-4 flex flex-wrap">
        {images.map((image) => (
          <div
            key={image.key}
            style={{ maxWidth: "200px", textAlign: "center" }}
            className="me-3"
          >
            <Image
              src={image.url}
              alt={image.name}
              className="rounded-lg border mb-2"
              layout="intrinsic"
              width={800} // 24 * 4 (Tailwind's scale factor)
              height={600}
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

