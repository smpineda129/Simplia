import multer from 'multer';
import multerS3 from 'multer-s3';
import { extname } from 'path';
import s3, { BUCKET } from '../config/storage.js';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten imágenes.`), false);
  }
};

const uploadImage = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const folder = req.uploadFolder || 'admin-docs/avatars';
      const hash = [...Array(40)].map(() => Math.random().toString(36)[2]).join('');
      const ext = extname(file.originalname);
      cb(null, `${folder}/${hash}${ext}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default uploadImage;
