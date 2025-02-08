import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/itemSlice";

const ItemForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [imageURL, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [sku, setSku] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.items);

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemData = { title, description, imageURL, price, color, sku };
    dispatch(addItem(itemData));
  };

  return (
    <div>
      <h1>Add Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Image:
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Color:
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            SKU:
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Item</button>
      </form>
      {status === "loading" && <p>Loading...</p>}
      {status === "succeeded" && <p>Item added successfully!</p>}
      {status === "failed" && <p>Error: {error}</p>}
    </div>
  );
};

export default ItemForm;
