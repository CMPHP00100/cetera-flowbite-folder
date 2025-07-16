import React from "react";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { Dashboard } from "@uppy/react";
//import { sha256 } from "crypto-hash";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "../custom-styles/media.css"; // Your custom CSS file

export async function getUploadParameters(file) {
  const response = await fetch("/api/mediaUploader", {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });
  if (!response.ok) throw new Error("Unsuccessful request");

  const data = await response.json();

  const object = {
    method: data.method,
    url: data.url,
    fields: {},
    headers: {
      "Content-Type": file.type ? file.type : "application/octet-stream",
    },
  };
  return object;
}

export function FileUploader({ onUploadSuccess }) {
  const uppy = React.useMemo(() => {
    const uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 3,
      },
    }).use(AwsS3, {
      id: "AwsS3",
      getUploadParameters: (file) => getUploadParameters(file),
    });

    uppy.on("complete", (result) => {
      onUploadSuccess(result);
      if (onUploadSuccess) {
        onUploadSuccess(result); // Call the function passed via props
      } else {
        console.warn("onUploadSuccess is not defined.");
      }
    });

    return uppy;
  }, [onUploadSuccess]);

  return (
    <>
      <Dashboard
        uppy={uppy}
        showLinkToFileUploadResult={true}
        className="custom-uppy-dashboard" // Apply your custom class
        proudlyDisplayPoweredByUppy={false} // Optional: hide "Powered by Uppy"
        //theme="dark" // Optional: use a predefined theme
      />
    </>
  );
}
