import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: process.env.AWS_USE_PATH_STYLE_ENDPOINT === 'true',
});

export const BUCKET = process.env.AWS_BUCKET;

export default s3;
