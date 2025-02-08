"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { createItem } from "../redux/slices/itemSlice";

/*const ItemList = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(createItem());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title} {item.startTime}
        </li> // Adjust based on your Prisma schema
      ))}
    </ul>
  );
};

export default ItemList;*/
