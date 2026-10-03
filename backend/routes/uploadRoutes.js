const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const os = require('os');
const fs = require('fs');

const router = express.Router();

const uploadDir = process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : 'uploads/';
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
    filetypes = /jpg|jpeg|png|webp/;
  } else {
    filetypes = /mp4|mkv|webm|mov/;
  }
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(`Error: ${type === 'image' ? 'Images' : 'Videos'} only!`);
  }
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

router.post('/', protect, authorizeRoles('instructor', 'admin'), uploadVideo.single('video'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

router.post('/image', protect, uploadImage.single('image'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;
