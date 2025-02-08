"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createItem } from "../redux/slices/itemSlice";

const CreateItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageURL: "",
    imageWidth: "",
    imageHeight: "",
    price: "",
    color: "",
  });
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.items);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createItem({ formData }));
  };

  return (
    <div className="h-50 relative bg-white p-4 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Create Item</h1>

      {/* Entering Events */}
      <div className="mb-4 mt-16">
        <form className="mx-auto max-w-sm" onSubmit={handleSubmit}>
          {/* Form Fields */}
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Item title..."
            value={formData.title}
            onChange={handleChange}
            className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
          />
          <input
            type="textarea"
            id="description"
            name="description"
            placeholder="Item description..."
            value={formData.description}
            onChange={handleChange}
            className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
          />
          <label
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            for="file_input"
          >
            Upload file
          </label>
          <input
            id="imageURL"
            name="imageURL"
            placeholder="Item Image URL..."
            value={formData.imageURL}
            onChange={handleChange}
            className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-100 p-4"
            aria-describedby="image_input_help"
            type="text"
          />
          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="image_input_help"
          >
            SVG, PNG, JPG or GIF (MAX. 1200x1200px).
          </p>

          <div className="mx-auto mb-2 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="image-width"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Image Width:
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5"></div>
                <input
                  type="text"
                  id="image-width"
                  name="imageWidth"
                  placeholder="Image width..."
                  value={formData.imageWidth}
                  onChange={handleChange}
                  className="mb-2 block size-full w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="image-height"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Image Height:
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5"></div>
                <input
                  type="text"
                  id="image-height"
                  name="imageHeight"
                  placeholder="Image height..."
                  value={formData.imageHeight}
                  onChange={handleChange}
                  className="mb-2 block size-full w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mx-auto mb-2 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Price:
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                  <svg
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter price..."
                  value={formData.price}
                  onChange={handleChange}
                  className="mb-2 block size-full w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="color"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Color:
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5"></div>
                <input
                  type="datetime-local"
                  id="color"
                  name="color"
                  placeholder="Enter color..."
                  value={formData.color}
                  onChange={handleChange}
                  className="mb-2 block size-full w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Item
          </button>
        </form>
        {response && (
          <div
            style={{
              marginTop: "1rem",
              color: response.success ? "green" : "red",
            }}
          >
            {response.success ? "Item entered successfully!" : response.error}
          </div>
        )}
      </div>
    </div>
  );
};
export default CreateItem;
