"use client";

import { useDrop } from "react-dnd";
import { useState, useEffect, useCallback } from "react";
import DraggableProduct from "./drag-drop";
import Image from "next/image";

export default function Moodboard() {
  const [moodboardItems, setMoodboardItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10); // Initial limit
  const [loading, setLoading] = useState(true);
  /*   const products = [
    { id: 1, name: "Product 1", image: "/images/product1.jpg" },
    { id: 2, name: "Product 2", image: "/images/product2.jpg" },
    { id: 3, name: "Product 3", image: "/images/product3.jpg" },
    
  ]; */

  // Fetch products from the API when the component mounts

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.slice(0, limit));
      //setProducts(data); // Set products fetched from API
      setLoading(false); // Set loading to false once data is loaded
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false); // Stop loading even on error
    }
  }, [limit]);


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PRODUCT",
    drop: (item) => {
      const newItem = { ...item, moodboardId: Date.now() };
      setMoodboardItems((prev) => [...prev, newItem]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleRemove = (moodboardId) => {
    setMoodboardItems((prev) =>
      prev.filter((item) => item.moodboardId !== moodboardId),
    );
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="container-fluid p-4">
      <h1 className="text-3xl font-bold">
        Drag & Drop Products into Moodboard
      </h1>
      <div className="row">
        {/* Product List */}
        <div className="col-sm-6">
          {products.map((product) => (
            <DraggableProduct key={product.moodboardId} product={product} />
          ))}
        </div>

        {/* Moodboard Drop Area */}
        <div
          ref={drop}
          className={`col-sm-6 rounded-lg border-4 border-dashed border-gray-500 bg-gray-100 ${
            isOver ? "bg-blue-200" : ""
          }`}
        >
          {moodboardItems.length === 0 && (
            <p className="text-center text-gray-700">Drop products here</p>
          )}
          <div className="mt-4">
            {moodboardItems.map((item, index) => (
              <div
                key={item.moodboardId}
                className="shadown row relative rounded border p-2"
              >
                <div className="col-sm-2">
                  <Image
                    key={index}
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-lg shadow-lg"
                    width={150} // 24 * 4 (Tailwind's scale factor)
                    height={150} // 24 * 4
                  />
                </div>
                <div className="col-sm-10">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-sm">{item.spc}</p>
                </div>
                <div className="col-sm-2">
                  <button
                    onClick={() => handleRemove(item.moodboardId)}
                    className="absolute right-1 top-1 rounded bg-red-500 p-1 text-xs text-white"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
