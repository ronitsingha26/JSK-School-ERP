const { Op, Sequelize } = require('sequelize');
const Student = require('../models/Student');
const Class   = require('../models/Class');
const Section = require('../models/Section');
const AcademicYear = require('../models/AcademicYear');

/* ── helpers ── */
const generateAdmissionNo = async () => {
  const year = new Date().getFullYear();
  const last = await Student.findOne({
    where: { admission_no: { [Op.like]: `JSK${year}%` } },
    order: [['id', 'DESC']],
  });
  if (!last) return `JSK${year}0001`;
  const num = parseInt(last.admission_no.replace(`JSK${year}`, ''), 10) + 1;
  return `JSK${year}${String(num).padStart(4, '0')}`;
};

/* ─────────────────────────────────────────
   GET /api/admission  — list with filters
───────────────────────────────────────── */
exports.getStudents = async (req, res) => {
  try {
    const {
      page = 1, limit = 10,
      search, class_id, section_id, academic_year_id, status,
    } = req.query;

    const where = {};
    if (status)           where.status           = status;
    if (class_id)         where.class_id         = class_id;
    if (section_id)       where.section_id       = section_id;
    if (academic_year_id) where.academic_year_id = academic_year_id;
    if (search) {
      const s = `%${search.toLowerCase()}%`;
      where[Op.or] = [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('first_name')),  { [Op.like]: s }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('last_name')),   { [Op.like]: s }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('admission_no')),{ [Op.like]: s }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('mobile')),      { [Op.like]: s }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('father_name')), { [Op.like]: s }),
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Student.findAndCountAll({
      where,
      limit:   parseInt(limit),
      offset,
      order:   [['id', 'DESC']],
      include: [
        { model: Class,        as: 'class',        required: false, attributes: ['id','class_name'] },
        { model: Section,      as: 'section',      required: false, attributes: ['id','section_name'] },
        { model: AcademicYear, as: 'academicYear', required: false, attributes: ['id','year_name'] },
      ],
    });

    res.json({
      students: rows,
      total:    count,
      page:     parseInt(page),
      pages:    Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    console.error('getStudents:', err);
    res.status(500).json({ message: 'Failed to fetch students', error: err.message });
  }
};

/* ─────────────────────────────────────────
   GET /api/admission/stats
───────────────────────────────────────── */
exports.getAdmissionStats = async (req, res) => {
  try {
    const total   = await Student.count();
    const active  = await Student.count({ where: { status: 'Active' } });
    const start   = new Date(); start.setDate(1);
    const thisMonth = await Student.count({
      where: { created_at: { [Op.gte]: start } },
    });
    res.json({ total, active, thisMonth });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

/* ─────────────────────────────────────────
   GET /api/admission/next-no
───────────────────────────────────────── */
exports.getNextAdmissionNo = async (req, res) => {
  try {
    const no = await generateAdmissionNo();
    res.json({ admission_no: no });
  } catch (err) {
    res.status(500).json({ message: 'Error generating admission number' });
  }
};

/* ─────────────────────────────────────────
   GET /api/admission/:id
───────────────────────────────────────── */
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: Class,        as: 'class',        required: false },
        { model: Section,      as: 'section',      required: false },
        { model: AcademicYear, as: 'academicYear', required: false },
      ],
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student', error: err.message });
  }
};

/* ─────────────────────────────────────────
   POST /api/admission  — create
───────────────────────────────────────── */
exports.createStudent = async (req, res) => {
  try {
    const admission_no = await generateAdmissionNo();
    const student = await Student.create({ ...req.body, admission_no });
    res.status(201).json({ message: 'Student admitted successfully', student });
  } catch (err) {
    console.error('createStudent:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Admission number already exists' });
    }
    res.status(500).json({ message: 'Failed to create student', error: err.message });
  }
};

/* ─────────────────────────────────────────
   PUT /api/admission/:id  — update
───────────────────────────────────────── */
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update student', error: err.message });
  }
};

/* ─────────────────────────────────────────
   DELETE /api/admission/:id
───────────────────────────────────────── */
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete student', error: err.message });
  }
};

/* ─────────────────────────────────────────
   PATCH /api/admission/:id/status
───────────────────────────────────────── */
exports.toggleStatus = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const newStatus = student.status === 'Active' ? 'Inactive' : 'Active';
    await student.update({ status: newStatus });
    res.json({ message: `Student marked ${newStatus}`, status: newStatus });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle status', error: err.message });
  }
};
