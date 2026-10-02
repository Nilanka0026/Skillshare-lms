const Certificate = require('../models/Certificate');
const asyncHandler = require('../utils/asyncHandler');

const certificateIdPattern = /^SKL-[A-F0-9]{32}$/i;
const certificatePopulation = [
  { path: 'student', select: 'name' },
  { path: 'course', select: 'title instructor', populate: { path: 'instructor', select: 'name' } }
];

const toCertificateResponse = (certificate) => ({
  certificateId: certificate.certificateId,
  studentName: certificate.student?.name || 'Student',
  courseName: certificate.course?.title || 'Course',
  instructorName: certificate.course?.instructor?.name || 'Instructor',
  completionDate: certificate.completionDate,
  issueDate: certificate.issueDate
});

const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id })
    .populate(certificatePopulation)
    .sort({ issueDate: -1 });

  res.json(certificates.map(toCertificateResponse));
});

const getMyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  if (!certificateIdPattern.test(certificateId)) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  const certificate = await Certificate.findOne({
    certificateId: certificateId.toUpperCase(),
    student: req.user._id
  }).populate(certificatePopulation);

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  res.json(toCertificateResponse(certificate));
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  if (!certificateIdPattern.test(certificateId)) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  const certificate = await Certificate.findOne({ certificateId: certificateId.toUpperCase() })
    .populate(certificatePopulation);
  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  res.json({ valid: true, ...toCertificateResponse(certificate) });
});

module.exports = { getMyCertificates, getMyCertificate, verifyCertificate };
