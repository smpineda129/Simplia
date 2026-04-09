import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3, { BUCKET } from '../config/storage.js';

const EXPIRES_IN = 3600; // 1 hora

/**
 * Genera una pre-signed URL para un key de S3.
 */
export const presignKey = (key) => {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn: EXPIRES_IN });
};

/**
 * Extrae el key S3 de una URL almacenada (retrocompatibilidad
 * con registros que guardaron la URL completa en vez del key).
 * Soporta path-style y virtual-hosted.
 */
const extractKey = (url) => {
  // Strip query params (handles already-presigned URLs stored in DB)
  const base = url.split('?')[0];
  // path-style: https://s3.region.amazonaws.com/bucket/key
  const pathMatch = base.match(/^https?:\/\/s3\.[^/]+\.amazonaws\.com\/[^/]+\/(.+)$/);
  if (pathMatch) return decodeURIComponent(pathMatch[1]);
  // virtual-hosted: https://bucket.s3.region.amazonaws.com/key
  const vhMatch = base.match(/^https?:\/\/[^/]+\.s3\.[^/]+\.amazonaws\.com\/(.+)$/);
  if (vhMatch) return decodeURIComponent(vhMatch[1]);
  return null;
};

/**
 * Convierte un valor de avatar/signature almacenado en BD a una URL utilizable:
 *  - null / undefined  → devuelve tal cual
 *  - URL de S3         → extrae el key y genera pre-signed URL
 *  - URL externa       → devuelve tal cual (no es S3 gestionado)
 *  - key S3 (con "/")  → genera pre-signed URL directamente
 *  - ícono (sin "/")   → devuelve tal cual (sistema de íconos legacy)
 */
export const presignValue = async (value) => {
  if (!value) return value;

  if (value.startsWith('http')) {
    const key = extractKey(value);
    return key ? presignKey(key) : value;
  }

  if (value.includes('/')) {
    return presignKey(value);
  }

  return value; // ícono legacy como 'person', 'face', etc.
};

/**
 * Aplica presignValue a los campos avatar y signature de un objeto usuario.
 */
export const presignUser = async (user) => {
  const [avatar, signature] = await Promise.all([
    presignValue(user.avatar),
    presignValue(user.signature),
  ]);
  return { ...user, avatar, signature };
};
