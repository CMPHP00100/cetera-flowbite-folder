// app/api/mediaUploader/route.js

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_KEY_ID,
  },
});

// Generate a unique filename to prevent conflicts
function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  const extension = originalFilename.split('.').pop();
  const nameWithoutExtension = originalFilename.replace(/\.[^/.]+$/, "");
  
  return `${nameWithoutExtension}-${timestamp}-${uuid}.${extension}`;
}

export async function POST(request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return Response.json({ 
        error: "Missing required fields: filename and contentType" 
      }, { status: 400 });
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(filename);
    const key = `resources/${uniqueFilename}`; // Store in resources folder

    // Create the command for uploading
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      // Optional: Add metadata
      Metadata: {
        originalName: filename,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Generate signed URL (valid for 1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    return Response.json({
      method: "PUT",
      url: signedUrl,
      key: key,
      filename: uniqueFilename,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return Response.json({ 
      error: "Failed to generate upload URL",
      details: error.message 
    }, { status: 500 });
  }
}