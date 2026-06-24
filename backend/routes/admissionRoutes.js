const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getStudents, getAdmissionStats, getNextAdmissionNo,
  getStudent, createStudent, updateStudent,
  deleteStudent, toggleStatus,
} = require('../controllers/admissionController');

router.use(authenticate);

router.get('/stats',    getAdmissionStats);
router.get('/next-no',  getNextAdmissionNo);
router.get('/',         getStudents);
router.get('/:id',      getStudent);
router.post('/',        authorize('admin','principal','receptionist'), createStudent);
router.put('/:id',      authorize('admin','principal','receptionist'), updateStudent);
router.patch('/:id/status', authorize('admin','principal'),           toggleStatus);
router.delete('/:id',   authorize('admin'),                           deleteStudent);

module.exports = router;
