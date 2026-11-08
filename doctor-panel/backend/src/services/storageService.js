import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    console.warn('[Cloudflare R2] Credentials not configured in environment. Using mock storage.');
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads finalized Prescription PDF to Cloudflare R2 private bucket
 */
export async function uploadPrescriptionPdf({ prescriptionId, pdfBuffer, mimeType = 'application/pdf' }) {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME || 'kale-clinic-prescriptions';
  const key = `prescriptions/${prescriptionId}.pdf`;

  if (!client) {
    // In local dev without R2 credentials, simulate storage path
    console.log(`[Storage Mock] Prescription ${prescriptionId} saved to simulated R2 path: ${key}`);
    return { key, storage: 'local-mock' };
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: pdfBuffer,
      ContentType: mimeType,
      Metadata: {
        prescriptionId,
        uploadedAt: new Date().toISOString(),
      },
    })
  );

  console.log(`[Cloudflare R2] Successfully uploaded prescription PDF: ${key}`);
  return { key, storage: 'cloudflare-r2' };
}

/**
 * Generates short-lived, authenticated signed download URL for prescription PDF
 * Expiry: 15 minutes (900 seconds)
 */
export async function getPrescriptionSignedUrl({ key, expiresInSeconds = 900 }) {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME || 'kale-clinic-prescriptions';

  if (!client) {
    return `http://localhost:4001/api/prescriptions/mock-download/${encodeURIComponent(key)}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  return signedUrl;
}

