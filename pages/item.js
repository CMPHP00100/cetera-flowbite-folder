import { useState, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa6";
//import { addItem } from "../redux/slices/itemsSlice";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { setSelectedItem } from "@/redux/slices/textSlice";
import { useRouter } from "next/router";

const items = [
  { id: "a1", name: "Apple" },
  { id: "b2", name: "Banana" },
  { id: "c3", name: "Cherry" },
];
export default function Item() {
  const dispatch = useDispatch();

  const handleSelect = (item) => {
    dispatch(setSelectedItem(item)); // Update Redux state
    localStorage.setItem("selectedItem", JSON.stringify(item)); // Save to localStorage
  };

  return (
    <div>
      <h1>Select an Item</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button onClick={() => handleSelect(item)}>{item.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
