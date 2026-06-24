const AcademicYear = require('../models/AcademicYear');
const Class = require('../models/Class');
const Section = require('../models/Section');
const FeeHead = require('../models/FeeHead');

// ═══════════════════════════════════════════════
// ACADEMIC YEAR CRUD
// ═══════════════════════════════════════════════

const getAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.findAll({ order: [['start_date', 'DESC']] });
    res.json(years);
  } catch (error) {
    console.error('Get academic years error:', error);
    res.status(500).json({ message: 'Failed to fetch academic years' });
  }
};

const createAcademicYear = async (req, res) => {
  try {
    const { year_name, start_date, end_date, is_current } = req.body;
    if (!year_name || !start_date || !end_date) {
      return res.status(400).json({ message: 'Year name, start date, and end date are required.' });
    }
    // If marking as current, unset all others
    if (is_current) {
      await AcademicYear.update({ is_current: false }, { where: {} });
    }
    const year = await AcademicYear.create({ year_name, start_date, end_date, is_current: is_current || false });
    res.status(201).json({ message: 'Academic year created', data: year });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'This academic year already exists.' });
    }
    console.error('Create academic year error:', error);
    res.status(500).json({ message: 'Failed to create academic year' });
  }
};

const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { year_name, start_date, end_date, is_current } = req.body;
    const year = await AcademicYear.findByPk(id);
    if (!year) return res.status(404).json({ message: 'Academic year not found' });
    if (is_current) {
      await AcademicYear.update({ is_current: false }, { where: {} });
    }
    await year.update({ year_name, start_date, end_date, is_current });
    res.json({ message: 'Academic year updated', data: year });
  } catch (error) {
    console.error('Update academic year error:', error);
    res.status(500).json({ message: 'Failed to update academic year' });
  }
};

const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const year = await AcademicYear.findByPk(id);
    if (!year) return res.status(404).json({ message: 'Academic year not found' });
    await year.destroy();
    res.json({ message: 'Academic year deleted' });
  } catch (error) {
    console.error('Delete academic year error:', error);
    res.status(500).json({ message: 'Failed to delete academic year' });
  }
};

// ═══════════════════════════════════════════════
// CLASS CRUD
// ═══════════════════════════════════════════════

const getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      order: [['numeric_order', 'ASC']],
      include: [{ model: Section, as: 'sections' }],
    });
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

const createClass = async (req, res) => {
  try {
    const { class_name, numeric_order } = req.body;
    if (!class_name) return res.status(400).json({ message: 'Class name is required.' });
    const cls = await Class.create({ class_name, numeric_order: numeric_order || 0 });
    res.status(201).json({ message: 'Class created', data: cls });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'This class already exists.' });
    }
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Failed to create class' });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name, numeric_order } = req.body;
    const cls = await Class.findByPk(id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    await cls.update({ class_name, numeric_order });
    res.json({ message: 'Class updated', data: cls });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Failed to update class' });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const cls = await Class.findByPk(id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    // Delete related sections first
    await Section.destroy({ where: { class_id: id } });
    await cls.destroy();
    res.json({ message: 'Class and its sections deleted' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Failed to delete class' });
  }
};

// ═══════════════════════════════════════════════
// SECTION CRUD
// ═══════════════════════════════════════════════

const getSections = async (req, res) => {
  try {
    const where = {};
    if (req.query.class_id) where.class_id = req.query.class_id;
    const sections = await Section.findAll({
      where,
      order: [['section_name', 'ASC']],
      include: [{ model: Class, as: 'class', attributes: ['id', 'class_name'] }],
    });
    res.json(sections);
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ message: 'Failed to fetch sections' });
  }
};

const createSection = async (req, res) => {
  try {
    const { class_id, section_name } = req.body;
    if (!class_id || !section_name) {
      return res.status(400).json({ message: 'Class and section name are required.' });
    }
    // Check class exists
    const cls = await Class.findByPk(class_id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    // Check duplicate
    const exists = await Section.findOne({ where: { class_id, section_name } });
    if (exists) return res.status(400).json({ message: `Section "${section_name}" already exists for this class.` });
    const section = await Section.create({ class_id, section_name });
    const full = await Section.findByPk(section.id, {
      include: [{ model: Class, as: 'class', attributes: ['id', 'class_name'] }],
    });
    res.status(201).json({ message: 'Section created', data: full });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ message: 'Failed to create section' });
  }
};

const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, section_name } = req.body;
    const section = await Section.findByPk(id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await section.update({ class_id, section_name });
    const full = await Section.findByPk(id, {
      include: [{ model: Class, as: 'class', attributes: ['id', 'class_name'] }],
    });
    res.json({ message: 'Section updated', data: full });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ message: 'Failed to update section' });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findByPk(id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await section.destroy();
    res.json({ message: 'Section deleted' });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({ message: 'Failed to delete section' });
  }
};

// ═══════════════════════════════════════════════
// FEE HEAD CRUD
// ═══════════════════════════════════════════════

const getFeeHeads = async (req, res) => {
  try {
    const heads = await FeeHead.findAll({ order: [['fee_head_name', 'ASC']] });
    res.json(heads);
  } catch (error) {
    console.error('Get fee heads error:', error);
    res.status(500).json({ message: 'Failed to fetch fee heads' });
  }
};

const createFeeHead = async (req, res) => {
  try {
    const { fee_head_name, description, is_active } = req.body;
    if (!fee_head_name) return res.status(400).json({ message: 'Fee head name is required.' });
    const head = await FeeHead.create({ fee_head_name, description, is_active: is_active !== false });
    res.status(201).json({ message: 'Fee head created', data: head });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'This fee head already exists.' });
    }
    console.error('Create fee head error:', error);
    res.status(500).json({ message: 'Failed to create fee head' });
  }
};

const updateFeeHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { fee_head_name, description, is_active } = req.body;
    const head = await FeeHead.findByPk(id);
    if (!head) return res.status(404).json({ message: 'Fee head not found' });
    await head.update({ fee_head_name, description, is_active });
    res.json({ message: 'Fee head updated', data: head });
  } catch (error) {
    console.error('Update fee head error:', error);
    res.status(500).json({ message: 'Failed to update fee head' });
  }
};

const deleteFeeHead = async (req, res) => {
  try {
    const { id } = req.params;
    const head = await FeeHead.findByPk(id);
    if (!head) return res.status(404).json({ message: 'Fee head not found' });
    await head.destroy();
    res.json({ message: 'Fee head deleted' });
  } catch (error) {
    console.error('Delete fee head error:', error);
    res.status(500).json({ message: 'Failed to delete fee head' });
  }
};

module.exports = {
  getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear,
  getClasses, createClass, updateClass, deleteClass,
  getSections, createSection, updateSection, deleteSection,
  getFeeHeads, createFeeHead, updateFeeHead, deleteFeeHead,
};
