const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const os = require('os');
const fs = require('fs');

const router = express.Router();

const uploadDir = process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.error('Failed to create upload directory:', e);
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

function checkFileType(file, cb, type) {
  let filetypes;
  if (type === 'image') {
    filetypes = /\.(jpg|jpeg|png|webp)$/;
  } else {
    filetypes = /\.(mp4|mkv|webm|mov)$/;
  }

  // .mov/.mkv report mimetypes like video/quicktime and video/x-matroska, so only check the top-level type
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith(`${type}/`);

  if (extname && mimetype) {
    return cb(null, true);
  }

  const error = new Error(`${type === 'image' ? 'Images' : 'Videos'} only!`);
  error.statusCode = 400;
  cb(error);
}

const uploadVideo = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb, 'video');
  }
});

const uploadImage = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb, 'image');
  }
});

const sendUploadedPath = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.send(`/uploads/${req.file.filename}`);
};

router.post('/', protect, authorizeRoles('instructor', 'admin'), uploadVideo.single('video'), sendUploadedPath);

router.post('/image', protect, uploadImage.single('image'), sendUploadedPath);

module.exports = router;
