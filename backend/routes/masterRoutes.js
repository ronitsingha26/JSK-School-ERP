const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear,
  getClasses, createClass, updateClass, deleteClass,
  getSections, createSection, updateSection, deleteSection,
  getFeeHeads, createFeeHead, updateFeeHead, deleteFeeHead,
} = require('../controllers/masterController');

// All master routes are protected
router.use(authenticate);

// ─── Academic Years ───
router.get('/academic-years', getAcademicYears);
router.post('/academic-years', authorize('admin'), createAcademicYear);
router.put('/academic-years/:id', authorize('admin'), updateAcademicYear);
router.delete('/academic-years/:id', authorize('admin'), deleteAcademicYear);

// ─── Classes ───
router.get('/classes', getClasses);
router.post('/classes', authorize('admin'), createClass);
router.put('/classes/:id', authorize('admin'), updateClass);
router.delete('/classes/:id', authorize('admin'), deleteClass);

// ─── Sections ───
router.get('/sections', getSections);
router.post('/sections', authorize('admin'), createSection);
router.put('/sections/:id', authorize('admin'), updateSection);
router.delete('/sections/:id', authorize('admin'), deleteSection);

// ─── Fee Heads ───
router.get('/fee-heads', getFeeHeads);
router.post('/fee-heads', authorize('admin', 'accountant'), createFeeHead);
router.put('/fee-heads/:id', authorize('admin', 'accountant'), updateFeeHead);
router.delete('/fee-heads/:id', authorize('admin'), deleteFeeHead);

module.exports = router;
