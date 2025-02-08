"use client";
//import MediaUpload from "../../components/media-sections/media-upload";
import { FileUploader } from "../../components/media-sections/media-upload";
import { ImageGallery } from "../../components/media-sections/media-fetch";
//import ImageGallery from "../../components/image-gallery";
import "../../components/custom-styles/media.css";
//import { Provider } from "react-redux";
//import store from "../../redux/store";

export default function MediaGallery() {
  return (
    <div className="container-fluid">
      <h1 className="mb-2 max-w-2xl px-4 py-2 text-4xl font-extrabold leading-none tracking-tight text-gray-800 underline decoration-cetera-orange md:text-5xl xl:text-6xl">
        Media Gallery
      </h1>
      <div className="row p-4">
        <div className="col-12 mb-4">{/*<ImageUpload />*/}</div>
        <div className="col-12">
          {/*<Provider store={store}>
            <FileUploader
              onUploadSuccess={(result) => alert(JSON.stringify(result))}
            />
          </Provider>*/}
          <FileUploader
            onUploadSuccess={(result) => alert(JSON.stringify(result))}
          />
          <ImageGallery />
        </div>
      </div>
    </div>
  );
}
