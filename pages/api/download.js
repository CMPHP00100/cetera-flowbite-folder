import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_KEY_ID,
  R2_BUCKET_NAME,
  R2_PUBLIC_BUCKET_ID,
} = process.env;

const r2Client = new S3Client({
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "auto",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_KEY_ID,
  },
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const command = new ListObjectsCommand({ Bucket: R2_BUCKET_NAME });
    const data = await r2Client.send(command);

    const files = data.Contents.map((item) => ({
      key: item.Key,
      name: item.Key.split("/").pop(),
      url: `https://${R2_PUBLIC_BUCKET_ID}.r2.dev/${item.Key}`,
    }));

    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch files from R2" });
  }
}
