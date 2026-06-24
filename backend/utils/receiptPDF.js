const PDFDocument = require('pdfkit');
const { numberToWords } = require('./numberToWords');

/**
 * Generate a fee receipt PDF and pipe it to a writable stream.
 *
 * @param {object} data          - Fee collection record with details, student, etc.
 * @param {WritableStream} stream - e.g. res (Express response) or fs.createWriteStream
 */
function generateReceiptPDF(data, stream) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(stream);

  const w = doc.page.width - 100; // usable width

  /* ── School Letterhead ── */
  doc.fontSize(20).font('Helvetica-Bold').text('JSK Educational Institute', { align: 'center' });
  doc.fontSize(9).font('Helvetica').fillColor('#555')
    .text('123 Education Road, Knowledge City · Ph: 9876543210 · Email: info@jsk.edu', { align: 'center' });
  doc.moveDown(0.3);
  doc.strokeColor('#0f172a').lineWidth(2)
    .moveTo(50, doc.y).lineTo(50 + w, doc.y).stroke();
  doc.moveDown(0.6);

  /* ── Receipt Title ── */
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#000')
    .text('FEE RECEIPT', { align: 'center' });
  doc.moveDown(0.3);

  /* ── Receipt Meta ── */
  const student = data.student || {};
  const cls = student.class || {};
  const sec = student.section || {};

  const metaY = doc.y;
  doc.fontSize(10).font('Helvetica');
  doc.fillColor('#000').text(`Receipt No: `, 50, metaY, { continued: true }).font('Helvetica-Bold').text(data.receipt_no);
  doc.font('Helvetica').text(`Date: `, 350, metaY, { continued: true }).font('Helvetica-Bold').text(data.payment_date);
  doc.moveDown(0.4);
  doc.font('Helvetica').text(`Academic Year: 2025-26`, 50);
  doc.moveDown(0.8);

  /* ── Student Details Box ── */
  const boxY = doc.y;
  doc.rect(50, boxY, w, 70).fillAndStroke('#f8fafc', '#e2e8f0');

  doc.fillColor('#000').fontSize(10).font('Helvetica');
  doc.text(`Student Name:`, 60, boxY + 10, { continued: true }).font('Helvetica-Bold')
    .text(` ${student.first_name || ''} ${student.last_name || ''}`);
  doc.font('Helvetica').text(`Admission No:`, 350, boxY + 10, { continued: true })
    .font('Helvetica-Bold').text(` ${student.admission_no || ''}`);

  doc.font('Helvetica').text(`Class:`, 60, boxY + 30, { continued: true })
    .font('Helvetica-Bold').text(` ${cls.class_name || ''} ${sec.section_name ? '- ' + sec.section_name : ''}`);
  doc.font('Helvetica').text(`Father's Name:`, 350, boxY + 30, { continued: true })
    .font('Helvetica-Bold').text(` ${student.father_name || ''}`);

  doc.font('Helvetica').text(`Payment Mode:`, 60, boxY + 50, { continued: true })
    .font('Helvetica-Bold').text(` ${data.payment_mode || ''}`);
  if (data.slip_no) {
    doc.font('Helvetica').text(`Slip No:`, 350, boxY + 50, { continued: true })
      .font('Helvetica-Bold').text(` ${data.slip_no}`);
  }

  doc.y = boxY + 85;

  /* ── Fee Table ── */
  const details = data.details || [];
  const tableTop = doc.y;
  const cols = [50, 80, 200, 340, 420, 500];
  const colW = ['#', 'Fee Head', 'Month', 'Amount', 'Discount', 'Net Amt'];

  // Header
  doc.rect(50, tableTop, w, 22).fillAndStroke('#0f172a', '#0f172a');
  doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold');
  colW.forEach((h, i) => doc.text(h, cols[i] + 5, tableTop + 6, { width: 70 }));

  // Rows
  let y = tableTop + 25;
  doc.fillColor('#000').font('Helvetica').fontSize(9);
  details.forEach((d, i) => {
    if (i % 2 === 0) doc.rect(50, y - 2, w, 20).fill('#f8fafc');
    doc.fillColor('#000');
    doc.text(String(i + 1),                          cols[0] + 5, y + 3, { width: 25 });
    doc.text(d.feeHead?.fee_head_name || 'Fee',      cols[1] + 5, y + 3, { width: 120 });
    doc.text(d.month || '-',                          cols[2] + 5, y + 3, { width: 70 });
    doc.text(`₹${parseFloat(d.amount).toLocaleString('en-IN')}`,   cols[3] + 5, y + 3, { width: 70 });
    doc.text(d.discount > 0 ? `-₹${parseFloat(d.discount).toLocaleString('en-IN')}` : '-', cols[4] + 5, y + 3, { width: 70 });
    doc.text(`₹${parseFloat(d.net_amount).toLocaleString('en-IN')}`, cols[5] + 5, y + 3, { width: 70 });
    y += 20;
  });

  // Total row
  doc.strokeColor('#0f172a').lineWidth(1.5)
    .moveTo(50, y).lineTo(50 + w, y).stroke();
  y += 5;
  doc.font('Helvetica-Bold').fontSize(11);
  doc.text('Total Paid:', 60, y + 2);
  doc.fillColor('#2563eb').text(`₹${parseFloat(data.paid_amount).toLocaleString('en-IN')}`, cols[5] + 5, y + 2);
  y += 22;

  if (data.fine_amount > 0) {
    doc.fillColor('#d97706').fontSize(9).font('Helvetica').text(`Late Fine: ₹${parseFloat(data.fine_amount).toLocaleString('en-IN')}`, 60, y);
    y += 16;
  }
  if (data.balance > 0) {
    doc.fillColor('#ef4444').fontSize(9).font('Helvetica').text(`Balance Due: ₹${parseFloat(data.balance).toLocaleString('en-IN')}`, 60, y);
    y += 16;
  }

  /* ── Amount in Words ── */
  y += 8;
  doc.rect(50, y, w, 30).fillAndStroke('#eff6ff', '#bfdbfe');
  doc.fillColor('#1e40af').fontSize(9).font('Helvetica-Bold')
    .text('Amount in Words:', 60, y + 5, { continued: true })
    .font('Helvetica').text(` ${numberToWords(Math.round(parseFloat(data.paid_amount)))}`);
  y += 45;

  /* ── Remark ── */
  if (data.remark) {
    doc.fillColor('#555').fontSize(9).font('Helvetica')
      .text(`Remark: ${data.remark}`, 60, y);
    y += 20;
  }

  /* ── Signature Lines ── */
  y = Math.max(y + 40, doc.page.height - 130);
  doc.strokeColor('#0f172a').lineWidth(1);
  doc.moveTo(60, y).lineTo(200, y).stroke();
  doc.moveTo(380, y).lineTo(520, y).stroke();
  doc.fillColor('#555').fontSize(9).font('Helvetica');
  doc.text('Student / Parent', 80, y + 5);
  doc.text('Authorized Signatory', 390, y + 5);

  /* ── Footer ── */
  doc.fontSize(7).fillColor('#999')
    .text('This is a computer-generated receipt. No signature is required.', 50, doc.page.height - 50, { align: 'center' });

  doc.end();
}

module.exports = { generateReceiptPDF };
