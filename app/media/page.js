"use client";
import React, { useState, useCallback } from "react";
//import MediaUpload from "../../components/media-sections/media-upload";
import { FileUploader } from "../../components/media-sections/media-upload";
import { ImageGallery } from "../../components/media-sections/media-fetch";
import CSVuploader from "@/components/shop-sections/csv-uploader";
import HeroSection from "@/components/page-sections/hero";
import TypedText from "@/components/animations/typed-text";
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
    <>
      <HeroSection
        heading="Media"
        subheading={
                    <TypedText
                      className="textbase"
                      texts={[
                        "If you need to upload media files...",
                        "Or upload data tables to our database...",
                        "Check out our media section",
                      ]}
                    />
                  }
        callToActionButtonLink="#"
        callToActionButtonText="Get started"
        heroImage="/uploads/media.svg"
        heroAlt="Media Alt Text"
      />
      <div className="container-fluid">
        <div className="mt-8 pb-8 p-4">
          <div className="row p-4">
            <div className="col-12">
              <h1 className="w-full text-3xl text-center font-cetera-libre text-cetera-dark-blue underline decoration-cetera-orange md:text-4xl">
                Media File Upload
              </h1>
              <FileUploader onUploadSuccess={triggerRefresh} />
            </div>
          </div>
        </div>
        <div className="row p-4">
          <div className="col-12">
            <button
              className="btn refresh-btn mt-4 rounded-md border-2 border-cetera-dark-blue bg-cetera-dark-blue text-white hover:border-cetera-orange hover:bg-cetera-orange hover:text-white"
              type="submit"
              onClick={triggerRefresh}
            >
              <span className="inline-flex whitespace-break-spaces b p-0">
                <IoRefresh className="mt-[2px]" /> Refresh
              </span>
            </button>
            <ImageGallery refresh={refresh} />
          </div>
        </div>
        <div className="my-8 pb-8 p-4">
          <h1 className="w-full text-3xl text-center font-cetera-libre text-cetera-dark-blue underline decoration-cetera-orange md:text-4xl">
            CSV Upload
          </h1>
          <CSVuploader />
        </div>
      </div>
    </>
  );
};

export default MediaGallery;
