const { Op, Sequelize } = require('sequelize');
const sequelize       = require('../config/database');
const FeeHead         = require('../models/FeeHead');
const FeeStructure    = require('../models/FeeStructure');
const LateFineRule    = require('../models/LateFineRule');
const DiscountType    = require('../models/DiscountType');
const FeeCollection   = require('../models/FeeCollection');
const FeeCollectionDetail = require('../models/FeeCollectionDetail');
const Student         = require('../models/Student');
const Class           = require('../models/Class');
const Section         = require('../models/Section');
const AcademicYear    = require('../models/AcademicYear');

/* ══════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════ */
const generateReceiptNo = async () => {
  const today = new Date();
  const prefix = `REC${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}`;
  const last = await FeeCollection.findOne({
    where: { receipt_no: { [Op.like]: `${prefix}%` } },
    order: [['id', 'DESC']],
  });
  if (!last) return `${prefix}0001`;
  const num = parseInt(last.receipt_no.replace(prefix, ''), 10) + 1;
  return `${prefix}${String(num).padStart(4, '0')}`;
};

/* ══════════════════════════════════════════
   FEE STRUCTURE CRUD
   ══════════════════════════════════════════ */

/* POST /api/fees/setup/structure — create/update bulk */
exports.saveStructure = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { class_id, academic_year_id, structures } = req.body;
    if (!class_id || !academic_year_id || !Array.isArray(structures)) {
      return res.status(400).json({ message: 'class_id, academic_year_id, and structures[] are required' });
    }

    const results = [];
    for (const s of structures) {
      if (!s.fee_head_id) continue;
      const monthly = parseFloat(s.monthly_amount) || 0;
      const [record] = await FeeStructure.upsert({
        fee_head_id:      s.fee_head_id,
        class_id,
        academic_year_id,
        monthly_amount:   monthly,
        annual_amount:    monthly * 12,
        is_active:        s.is_active !== false,
      }, { transaction: t });
      results.push(record);
    }

    await t.commit();
    res.json({ message: 'Fee structure saved', count: results.length });
  } catch (err) {
    await t.rollback();
    console.error('saveStructure:', err);
    res.status(500).json({ message: 'Failed to save structure', error: err.message });
  }
};

/* GET /api/fees/setup/structure/:class_id */
exports.getStructure = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { academic_year_id } = req.query;
    const where = { class_id };
    if (academic_year_id) where.academic_year_id = academic_year_id;

    const structures = await FeeStructure.findAll({
      where,
      include: [{ model: FeeHead, as: 'feeHead', attributes: ['id','fee_head_name','description'] }],
      order: [['id', 'ASC']],
    });
    res.json(structures);
  } catch (err) {
    console.error('getStructure:', err);
    res.status(500).json({ message: 'Failed to fetch structure', error: err.message });
  }
};

/* PUT /api/fees/setup/structure/:id */
exports.updateStructure = async (req, res) => {
  try {
    const record = await FeeStructure.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Structure not found' });

    const monthly = parseFloat(req.body.monthly_amount) || record.monthly_amount;
    await record.update({
      monthly_amount: monthly,
      annual_amount:  monthly * 12,
      is_active:      req.body.is_active !== undefined ? req.body.is_active : record.is_active,
    });
    res.json({ message: 'Structure updated', record });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update structure', error: err.message });
  }
};

/* ══════════════════════════════════════════
   LATE FINE RULES
   ══════════════════════════════════════════ */

/* POST /api/fees/setup/fine-rules */
exports.saveFineRules = async (req, res) => {
  try {
    const { academic_year_id, due_day, fine_type, fine_amount, grace_period, max_fine, apply_to, class_id } = req.body;
    if (!academic_year_id) return res.status(400).json({ message: 'academic_year_id is required' });

    const [rule, created] = await LateFineRule.upsert({
      academic_year_id,
      due_day:      due_day || 10,
      fine_type:    fine_type || 'per_day',
      fine_amount:  fine_amount || 5,
      grace_period: grace_period || 3,
      max_fine:     max_fine || 500,
      apply_to:     apply_to || 'all',
      class_id:     apply_to === 'per_class' ? class_id : null,
      is_active:    true,
    });
    res.json({ message: created ? 'Fine rule created' : 'Fine rule updated', rule });
  } catch (err) {
    console.error('saveFineRules:', err);
    res.status(500).json({ message: 'Failed to save fine rules', error: err.message });
  }
};

/* GET /api/fees/setup/fine-rules */
exports.getFineRules = async (req, res) => {
  try {
    const { academic_year_id } = req.query;
    const where = {};
    if (academic_year_id) where.academic_year_id = academic_year_id;
    const rules = await LateFineRule.findAll({ where, order: [['id', 'DESC']] });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch fine rules', error: err.message });
  }
};

/* ══════════════════════════════════════════
   DISCOUNT TYPES CRUD
   ══════════════════════════════════════════ */

/* GET /api/fees/setup/discounts */
exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await DiscountType.findAll({ order: [['id', 'ASC']] });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch discounts', error: err.message });
  }
};

/* POST /api/fees/setup/discounts */
exports.createDiscount = async (req, res) => {
  try {
    const { name, discount_type, value, applicable_fees } = req.body;
    if (!name || !value) return res.status(400).json({ message: 'name and value are required' });

    const discount = await DiscountType.create({
      name,
      discount_type: discount_type || 'percentage',
      value,
      applicable_fees: applicable_fees ? JSON.stringify(applicable_fees) : null,
    });
    res.status(201).json({ message: 'Discount created', discount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create discount', error: err.message });
  }
};

/* PUT /api/fees/setup/discounts/:id */
exports.updateDiscount = async (req, res) => {
  try {
    const discount = await DiscountType.findByPk(req.params.id);
    if (!discount) return res.status(404).json({ message: 'Discount not found' });

    await discount.update({
      ...req.body,
      applicable_fees: req.body.applicable_fees ? JSON.stringify(req.body.applicable_fees) : discount.applicable_fees,
    });
    res.json({ message: 'Discount updated', discount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update discount', error: err.message });
  }
};

/* DELETE /api/fees/setup/discounts/:id */
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await DiscountType.findByPk(req.params.id);
    if (!discount) return res.status(404).json({ message: 'Discount not found' });
    await discount.destroy();
    res.json({ message: 'Discount deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete discount', error: err.message });
  }
};

/* ══════════════════════════════════════════
   FEE COLLECTION
   ══════════════════════════════════════════ */

/* GET /api/fees/search-student?q=query */
exports.searchStudent = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const s = `%${q.toLowerCase()}%`;
    const students = await Student.findAll({
      where: {
        status: 'Active',
        [Op.or]: [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('first_name')),  { [Op.like]: s }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('last_name')),   { [Op.like]: s }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('admission_no')),{ [Op.like]: s }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('mobile')),      { [Op.like]: s }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('father_name')), { [Op.like]: s }),
        ],
      },
      include: [
        { model: Class,   as: 'class',   required: false, attributes: ['id','class_name'] },
        { model: Section, as: 'section', required: false, attributes: ['id','section_name'] },
      ],
      limit: 10,
      order: [['first_name', 'ASC']],
    });
    res.json(students);
  } catch (err) {
    console.error('searchStudent:', err);
    res.status(500).json({ message: 'Failed to search students', error: err.message });
  }
};

/* GET /api/fees/student/:id/dues */
exports.getStudentDues = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: Class,        as: 'class',        required: false },
        { model: Section,      as: 'section',      required: false },
        { model: AcademicYear, as: 'academicYear', required: false },
      ],
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Get fee structure for student's class
    const structures = await FeeStructure.findAll({
      where: {
        class_id: student.class_id,
        is_active: true,
        ...(student.academic_year_id && { academic_year_id: student.academic_year_id }),
      },
      include: [{ model: FeeHead, as: 'feeHead' }],
    });

    // Get already-paid details
    const paidDetails = await FeeCollectionDetail.findAll({
      include: [{
        model: FeeCollection, as: 'collection',
        where: { student_id: student.id, status: { [Op.ne]: 'Cancelled' } },
        attributes: [],
      }],
    });

    // Build month-wise dues
    const months = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
    const dues = [];
    for (const struct of structures) {
      for (const month of months) {
        const paid = paidDetails
          .filter(p => p.fee_head_id === struct.fee_head_id && p.month === month)
          .reduce((s, p) => s + parseFloat(p.net_amount), 0);
        const due = parseFloat(struct.monthly_amount) - paid;
        dues.push({
          fee_head_id:   struct.fee_head_id,
          fee_head_name: struct.feeHead?.fee_head_name,
          month,
          amount:        parseFloat(struct.monthly_amount),
          paid,
          due:           Math.max(0, due),
          status:        due <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending',
        });
      }
    }

    res.json({ student, dues });
  } catch (err) {
    console.error('getStudentDues:', err);
    res.status(500).json({ message: 'Failed to fetch dues', error: err.message });
  }
};

/* POST /api/fees/collect */
exports.collectFee = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      student_id, academic_year_id, items,
      paid_amount, payment_date, payment_mode,
      cheque_no, slip_no, remark, fine_amount, discount_amount,
    } = req.body;

    // Validation
    if (!student_id || !paid_amount || !payment_date || !payment_mode || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'student_id, paid_amount, payment_date, payment_mode, and items[] are required' });
    }

    const receipt_no = await generateReceiptNo();
    const totalAmount = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    const totalDiscount = parseFloat(discount_amount) || 0;
    const totalFine = parseFloat(fine_amount) || 0;
    const paidAmt = parseFloat(paid_amount);
    const balance = (totalAmount - totalDiscount + totalFine) - paidAmt;

    // Create collection record
    const collection = await FeeCollection.create({
      receipt_no,
      student_id,
      academic_year_id: academic_year_id || null,
      total_amount:     totalAmount,
      discount_amount:  totalDiscount,
      fine_amount:      totalFine,
      paid_amount:      paidAmt,
      balance:          Math.max(0, balance),
      payment_date,
      payment_mode,
      cheque_no:    cheque_no || null,
      slip_no:      slip_no || null,
      remark:       remark || null,
      collected_by: req.user?.id || null,
      status:       balance <= 0 ? 'Completed' : 'Partial',
    }, { transaction: t });

    // Create detail rows
    const details = items.map(i => ({
      collection_id: collection.id,
      fee_head_id:   i.fee_head_id,
      month:         i.month || null,
      amount:        parseFloat(i.amount) || 0,
      discount:      parseFloat(i.discount) || 0,
      fine:          parseFloat(i.fine) || 0,
      net_amount:    (parseFloat(i.amount) || 0) - (parseFloat(i.discount) || 0) + (parseFloat(i.fine) || 0),
    }));
    await FeeCollectionDetail.bulkCreate(details, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Fee collected successfully', collection, receipt_no });
  } catch (err) {
    await t.rollback();
    console.error('collectFee:', err);
    res.status(500).json({ message: 'Failed to collect fee', error: err.message });
  }
};

/* GET /api/fees/receipt/:collection_id */
exports.getReceipt = async (req, res) => {
  try {
    const collection = await FeeCollection.findByPk(req.params.collection_id, {
      include: [
        { model: FeeCollectionDetail, as: 'details', include: [{ model: FeeHead, as: 'feeHead' }] },
        { model: Student, as: 'student', include: [
          { model: Class, as: 'class', required: false },
          { model: Section, as: 'section', required: false },
        ]},
      ],
    });
    if (!collection) return res.status(404).json({ message: 'Receipt not found' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch receipt', error: err.message });
  }
};

/* GET /api/fees/receipt/:collection_id/pdf */
exports.getReceiptPDF = async (req, res) => {
  try {
    const collection = await FeeCollection.findByPk(req.params.collection_id, {
      include: [
        { model: FeeCollectionDetail, as: 'details', include: [{ model: FeeHead, as: 'feeHead' }] },
        { model: Student, as: 'student', include: [
          { model: Class, as: 'class', required: false },
          { model: Section, as: 'section', required: false },
        ]},
      ],
    });
    if (!collection) return res.status(404).json({ message: 'Receipt not found' });

    const { generateReceiptPDF } = require('../utils/receiptPDF');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=receipt_${collection.receipt_no}.pdf`);
    generateReceiptPDF(collection.toJSON(), res);
  } catch (err) {
    console.error('getReceiptPDF:', err);
    res.status(500).json({ message: 'Failed to generate PDF', error: err.message });
  }
};

/* GET /api/fees/ledger/:student_id */
exports.getLedger = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await FeeCollection.findAndCountAll({
      where: { student_id: req.params.student_id },
      include: [{ model: FeeCollectionDetail, as: 'details', include: [{ model: FeeHead, as: 'feeHead' }] }],
      order: [['payment_date', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ collections: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ledger', error: err.message });
  }
};

/* GET /api/fees/dashboard/stats */
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date(); monthStart.setDate(1);

    const [todayCollection] = await sequelize.query(
      `SELECT COALESCE(SUM(paid_amount), 0) AS total FROM fee_collections WHERE payment_date = :today AND status != 'Cancelled'`,
      { replacements: { today }, type: Sequelize.QueryTypes.SELECT }
    );

    const [monthCollection] = await sequelize.query(
      `SELECT COALESCE(SUM(paid_amount), 0) AS total FROM fee_collections WHERE payment_date >= :start AND status != 'Cancelled'`,
      { replacements: { start: monthStart.toISOString().slice(0, 10) }, type: Sequelize.QueryTypes.SELECT }
    );

    const [pendingDues] = await sequelize.query(
      `SELECT COALESCE(SUM(balance), 0) AS total, COUNT(DISTINCT student_id) AS students FROM fee_collections WHERE balance > 0 AND status = 'Partial'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const todayReceipts = await FeeCollection.count({
      where: { payment_date: today, status: { [Op.ne]: 'Cancelled' } },
    });

    res.json({
      today_collection: parseFloat(todayCollection.total),
      month_collection: parseFloat(monthCollection.total),
      pending_dues:     parseFloat(pendingDues.total),
      pending_students: pendingDues.students || 0,
      today_receipts:   todayReceipts,
    });
  } catch (err) {
    console.error('getDashboardStats:', err);
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

/* ══════════════════════════════════════════
   FEE HEADS (quick CRUD)
   ══════════════════════════════════════════ */
exports.getFeeHeads = async (req, res) => {
  try {
    const heads = await FeeHead.findAll({ order: [['fee_head_name', 'ASC']] });
    res.json(heads);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch fee heads', error: err.message });
  }
};

exports.createFeeHead = async (req, res) => {
  try {
    const { fee_head_name, description } = req.body;
    if (!fee_head_name) return res.status(400).json({ message: 'fee_head_name is required' });
    const head = await FeeHead.create({ fee_head_name, description });
    res.status(201).json({ message: 'Fee head created', head });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Fee head already exists' });
    }
    res.status(500).json({ message: 'Failed to create fee head', error: err.message });
  }
};

exports.updateFeeHead = async (req, res) => {
  try {
    const head = await FeeHead.findByPk(req.params.id);
    if (!head) return res.status(404).json({ message: 'Fee head not found' });
    await head.update(req.body);
    res.json({ message: 'Fee head updated', head });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update fee head', error: err.message });
  }
};

exports.deleteFeeHead = async (req, res) => {
  try {
    const head = await FeeHead.findByPk(req.params.id);
    if (!head) return res.status(404).json({ message: 'Fee head not found' });
    await head.destroy();
    res.json({ message: 'Fee head deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete fee head', error: err.message });
  }
};
