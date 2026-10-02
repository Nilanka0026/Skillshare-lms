const express = require('express');
const {
  getMyCertificate,
  getMyCertificates,
  verifyCertificate
} = require('../controllers/certificateController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/verify/:certificateId', verifyCertificate);
router.get('/mine', protect, authorizeRoles('student'), getMyCertificates);
router.get('/:certificateId', protect, authorizeRoles('student'), getMyCertificate);

module.exports = router;
