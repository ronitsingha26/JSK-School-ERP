const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const fees = require('../controllers/feesController');

router.use(authenticate);

/* ── Fee Heads ── */
router.get('/fee-heads',      fees.getFeeHeads);
router.post('/fee-heads',     authorize('admin','principal','receptionist'), fees.createFeeHead);
router.put('/fee-heads/:id',  authorize('admin','principal','receptionist'), fees.updateFeeHead);
router.delete('/fee-heads/:id', authorize('admin','principal'),              fees.deleteFeeHead);

/* ── Fee Structure ── */
router.post('/setup/structure',          authorize('admin','principal'), fees.saveStructure);
router.get('/setup/structure/:class_id', fees.getStructure);
router.put('/setup/structure/:id',       authorize('admin','principal'), fees.updateStructure);

/* ── Late Fine Rules ── */
router.post('/setup/fine-rules', authorize('admin','principal'), fees.saveFineRules);
router.get('/setup/fine-rules',  fees.getFineRules);

/* ── Discount Types ── */
router.get('/setup/discounts',      fees.getDiscounts);
router.post('/setup/discounts',     authorize('admin','principal'), fees.createDiscount);
router.put('/setup/discounts/:id',  authorize('admin','principal'), fees.updateDiscount);
router.delete('/setup/discounts/:id', authorize('admin','principal'), fees.deleteDiscount);

/* ── Collection ── */
router.get('/search-student',       fees.searchStudent);
router.get('/student/:id/dues',     fees.getStudentDues);
router.post('/collect',             authorize('admin','principal','receptionist'), fees.collectFee);
router.get('/receipt/:collection_id', fees.getReceipt);
router.get('/receipt/:collection_id/pdf', fees.getReceiptPDF);
router.get('/ledger/:student_id',   fees.getLedger);
router.get('/dashboard/stats',      fees.getDashboardStats);

module.exports = router;
