"use client";
import React, { useState, useCallback } from "react";
//import MediaUpload from "../../components/media-sections/media-upload";
import { FileUploader } from "../../components/media-sections/media-upload";
import { ImageGallery } from "../../components/media-sections/media-fetch";
//import ImageGallery from "../../components/image-gallery";
import "../../components/custom-styles/media.css";
import { IoRefresh } from "react-icons/io5";

//import { Provider } from "react-redux";
//import store from "../../redux/store";

const MediaGallery = () => {
  const [refresh, setRefresh] = useState(false); // Refresh state

  // Function to toggle refresh state
  const triggerRefresh = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);

  /*const handleUploadSuccess = (result) => {
    console.log("Upload success!", result);
    setRefresh((prev) => !prev);
    // Add custom logic here, e.g., updating a gallery or refreshing state.
  };*/
  return (
    <div className="container-fluid">
      <h1 className="mb-2 max-w-2xl px-4 py-2 text-4xl font-extrabold leading-none tracking-tight text-gray-800 underline decoration-cetera-orange md:text-5xl xl:text-6xl">
        Media Gallery
      </h1>
      <div className="row p-4">
        <div className="col-12">
          {/*<Provider store={store}>
            <FileUploader
              onUploadSuccess={(result) => alert(JSON.stringify(result))}
            />
          </Provider>*/}
          <FileUploader onUploadSuccess={triggerRefresh} />

          <button
            className="btn btn-primary refresh-btn mt-4 rounded-md border-2 border-cetera-blue bg-none text-cetera-blue hover:bg-cetera-blue hover:text-white"
            type="submit"
            onClick={triggerRefresh}
          >
            <span className="inline-flex whitespace-break-spaces p-1">
              <IoRefresh className="mt-1" /> Refresh
            </span>
          </button>

          <ImageGallery refresh={refresh} />
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
