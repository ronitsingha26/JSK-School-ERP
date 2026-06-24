const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/examController');

// ── Grade Config (must be before /:id) ────────────────────
router.get   ('/grade-config',           ctrl.getGradeConfig);
router.post  ('/grade-config',           ctrl.saveGradeConfig);

// ── Marks (must be before /:id) ───────────────────────────
router.get   ('/marks/list',             ctrl.getMarks);
router.post  ('/marks/bulk-save',        ctrl.bulkSaveMarks);
router.put   ('/marks/submit',           ctrl.submitMarks);
router.get   ('/marks/status/:exam_id',  ctrl.getMarksStatus);

// ── Report Card (must be before /:id) ─────────────────────
router.get   ('/reportcard/:student_id/:exam_id', ctrl.getReportCard);

// ── Result Analysis (must be before /:id) ─────────────────
router.get   ('/analysis/:exam_id',      ctrl.getAnalysis);

// ── Exams CRUD ────────────────────────────────────────────
router.get   ('/',    ctrl.listExams);
router.post  ('/',    ctrl.createExam);
router.get   ('/:id', ctrl.getExam);
router.put   ('/:id', ctrl.updateExam);
router.delete('/:id', ctrl.deleteExam);

// ── Exam Schedule ─────────────────────────────────────────
router.get   ('/:id/schedule', ctrl.getSchedule);
router.post  ('/:id/schedule', ctrl.saveSchedule);

module.exports = router;
