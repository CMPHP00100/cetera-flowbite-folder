// app/api/mediaDownloader/route.js

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_KEY_ID,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return Response.json({ files: [] });
    }

    const files = response.Contents
      .filter(item => item.Key && item.Size > 0)
      .map(item => ({
        key: item.Key,
        name: item.Key.split('/').pop(),
        url: `https://${process.env.R2_PUBLIC_BUCKET_ID}.r2.dev/${item.Key}`,
        size: item.Size,
        lastModified: item.LastModified,
      }));

    return Response.json({ files });
  } catch (error) {
    console.error("Error fetching R2 files:", error);
    return Response.json(
      { 
        error: "Failed to fetch files",
        details: error.message 
      },
      { status: 500 }
    );
  }
}