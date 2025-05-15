"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function GetUsers({ productId }) {
  //const [users, setUsers] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("./api/apiusers");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []); */
  const fixedProductId = productId || 946016742;

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching product from API...", fixedProductId);

      const response = await fetch("/api/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prodEId: fixedProductId }), // ✅ Send correct ID
      });

      const data = await response.json();
      console.log("🎯 API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch product");
      }

      // ✅ Ensure product data exists
      if (!data || Object.keys(data).length === 0) {
        console.log("⚠ No product received");
        setProduct(null);
        return;
      }

      setProduct(data);
      //setProduct(data[0] || null);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fixedProductId) return; // ✅ Avoid API calls with an empty ID
    fetchProduct();
  }, [fixedProductId]); // ✅ Runs when productId changes

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>No product found.</p>;
  //if (error) return <div>{error}</div>;
  //if (!users.length) return <div>Loading...</div>;

  return (
    <>
      <div className="rounded-lg border p-4 shadow">
        <h2 className="text-xl font-bold">{product.prName}</h2>
        <p>{product.description}</p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Price:</strong> ${product.prc[0]}
        </p>
        <p>
          <strong>Colors:</strong> {product.colors}
        </p>
        <div className="relative overflow-hidden rounded-lg border">
          {product.pics.map((pic) => (
            <Image
              key={pic.index}
              src={pic.url}
              alt={pic.caption || "Product Image"}
              className="h-40 inline-block w-[200px] object-cover"
              width={300}
              height={300}
            />
          ))}
        </div>
      </div>
      {/* <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} {user.email}
          </li>
        ))}
      </ul> */}
    </>
  );
}
