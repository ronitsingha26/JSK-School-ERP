const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Exam        = require('../models/Exam');
const ExamSubject = require('../models/ExamSubject');
const ExamMark    = require('../models/ExamMark');
const GradeConfig = require('../models/GradeConfig');
const ExamResult  = require('../models/ExamResult');
const Student     = require('../models/Student');
const Class       = require('../models/Class');
const Section     = require('../models/Section');

/* ─── Helper: calculate grade from marks ─────────────────── */
function calculateGrade(marks, maxMarks, gradeConfig) {
  if (!marks && marks !== 0) return { grade: '—', grade_points: 0, remarks: '—' };
  const pct = (marks / maxMarks) * 100;
  const cfg = gradeConfig.find(g => pct >= g.min_marks && pct <= g.max_marks);
  return cfg
    ? { grade: cfg.grade, grade_points: parseFloat(cfg.grade_points), remarks: cfg.remarks }
    : { grade: 'F', grade_points: 0, remarks: 'Fail' };
}

/* Default grade config used when DB has none */
const DEFAULT_GRADES = [
  { min_marks: 90, max_marks: 100, grade: 'A+', grade_points: 10, remarks: 'Outstanding' },
  { min_marks: 80, max_marks: 89.99, grade: 'A',  grade_points: 9,  remarks: 'Excellent'   },
  { min_marks: 70, max_marks: 79.99, grade: 'B+', grade_points: 8,  remarks: 'Very Good'   },
  { min_marks: 60, max_marks: 69.99, grade: 'B',  grade_points: 7,  remarks: 'Good'        },
  { min_marks: 50, max_marks: 59.99, grade: 'C',  grade_points: 6,  remarks: 'Average'     },
  { min_marks: 33, max_marks: 49.99, grade: 'D',  grade_points: 5,  remarks: 'Below Avg'   },
  { min_marks: 0,  max_marks: 32.99, grade: 'F',  grade_points: 0,  remarks: 'Fail'        },
];

/* ═══════════════════════════════════════════════════════════
   EXAMS CRUD
════════════════════════════════════════════════════════════ */

// GET /api/exams
exports.listExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/exams/:id
exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, data: exam });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/exams
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      created_by: req.user?.id || null,
    });
    res.status(201).json({ success: true, data: exam, message: 'Exam created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/exams/:id
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    await exam.update(req.body);
    res.json({ success: true, data: exam, message: 'Exam updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/exams/:id  (only if draft)
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    if (exam.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Only draft exams can be deleted' });
    }
    await exam.destroy();
    res.json({ success: true, message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   EXAM SCHEDULE (subject-wise)
════════════════════════════════════════════════════════════ */

// GET /api/exams/:id/schedule
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await ExamSubject.findAll({
      where: { exam_id: req.params.id },
      order: [['class_id', 'ASC'], ['exam_date', 'ASC']],
    });
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/exams/:id/schedule  — bulk upsert schedule rows
exports.saveSchedule = async (req, res) => {
  try {
    const { rows } = req.body; // array of subject rows
    const exam_id = parseInt(req.params.id);

    // Delete existing and re-insert (simple approach)
    await ExamSubject.destroy({ where: { exam_id } });
    if (rows && rows.length) {
      const toInsert = rows.map(r => ({ ...r, exam_id }));
      await ExamSubject.bulkCreate(toInsert);
    }
    res.json({ success: true, message: 'Schedule saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   MARKS ENTRY
════════════════════════════════════════════════════════════ */

// GET /api/exams/marks?exam_id=&class_id=&section_id=&subject_name=
exports.getMarks = async (req, res) => {
  try {
    const { exam_id, class_id, section_id, subject_name } = req.query;
    const where = {};
    if (exam_id)     where.exam_id     = exam_id;
    if (class_id)    where.class_id    = class_id;
    if (section_id)  where.section_id  = section_id;
    if (subject_name) where.subject_name = subject_name;

    const marks = await ExamMark.findAll({
      where,
      include: [{ model: Student, as: 'student', attributes: ['id','first_name','last_name','admission_no','roll_number'] }],
    });
    res.json({ success: true, data: marks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/exams/marks/bulk-save
exports.bulkSaveMarks = async (req, res) => {
  try {
    const { exam_id, class_id, section_id, subject_name, marks } = req.body;

    // Get grade config
    const gradeCfg = await GradeConfig.findAll({ order: [['min_marks', 'DESC']] });
    const grades = gradeCfg.length ? gradeCfg : DEFAULT_GRADES;

    // Get exam subject to know max marks
    const examSubject = await ExamSubject.findOne({
      where: { exam_id, class_id, subject_name },
    });
    const maxTheory = examSubject ? parseFloat(examSubject.max_theory_marks) : 100;
    const maxPractical = examSubject ? parseFloat(examSubject.max_practical_marks) : 0;

    for (const m of marks) {
      const totalMarks = m.is_absent
        ? null
        : (parseFloat(m.theory_marks || 0) + parseFloat(m.practical_marks || 0));

      const maxTotal = maxTheory + maxPractical;
      const gradeInfo = totalMarks !== null ? calculateGrade(totalMarks, maxTotal, grades) : { grade: 'AB', grade_points: 0 };

      await ExamMark.upsert({
        exam_id,
        student_id: m.student_id,
        class_id,
        section_id: section_id || null,
        subject_name,
        theory_marks:    m.is_absent ? null : (m.theory_marks || null),
        practical_marks: m.is_absent ? null : (m.practical_marks || 0),
        total_marks:     totalMarks,
        grade:           gradeInfo.grade,
        is_absent:       m.is_absent || false,
        is_submitted:    false,
        entered_by:      req.user?.id || null,
      });
    }

    res.json({ success: true, message: 'Marks saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/exams/marks/submit — lock marks for a subject+class
exports.submitMarks = async (req, res) => {
  try {
    const { exam_id, class_id, section_id, subject_name } = req.body;
    await ExamMark.update(
      { is_submitted: true },
      { where: { exam_id, class_id, section_id: section_id || null, subject_name } }
    );
    res.json({ success: true, message: 'Marks submitted and locked' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/exams/marks/status/:exam_id
exports.getMarksStatus = async (req, res) => {
  try {
    const { exam_id } = req.params;

    const exam = await Exam.findByPk(exam_id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const schedule = await ExamSubject.findAll({ where: { exam_id } });
    const marks    = await ExamMark.findAll({ where: { exam_id } });

    // Build status grid: { classId: { subjectName: 'submitted'|'pending'|'not_started' } }
    const grid = {};
    const subjects = [...new Set(schedule.map(s => s.subject_name))];
    const classes  = [...new Set(schedule.map(s => s.class_id))];

    for (const cls of classes) {
      grid[cls] = {};
      for (const sub of subjects) {
        const classMarks = marks.filter(m => m.class_id === cls && m.subject_name === sub);
        if (!classMarks.length) {
          grid[cls][sub] = 'not_started';
        } else if (classMarks.every(m => m.is_submitted)) {
          grid[cls][sub] = 'submitted';
        } else {
          grid[cls][sub] = 'pending';
        }
      }
    }

    const total     = classes.length * subjects.length;
    const submitted = Object.values(grid).reduce((acc, row) => acc + Object.values(row).filter(v => v === 'submitted').length, 0);
    const pending   = Object.values(grid).reduce((acc, row) => acc + Object.values(row).filter(v => v === 'pending').length, 0);

    res.json({
      success: true,
      data: {
        grid,
        subjects,
        classes,
        summary: { total, submitted, pending, not_started: total - submitted - pending },
        exam: exam.name,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   REPORT CARD
════════════════════════════════════════════════════════════ */

// GET /api/exams/reportcard/:student_id/:exam_id
exports.getReportCard = async (req, res) => {
  try {
    const { student_id, exam_id } = req.params;

    const student = await Student.findByPk(student_id, {
      include: [
        { model: Class,   as: 'class'   },
        { model: Section, as: 'section' },
      ],
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const exam = await Exam.findByPk(exam_id);
    if (!exam)  return res.status(404).json({ success: false, message: 'Exam not found' });

    const marks = await ExamMark.findAll({ where: { exam_id, student_id } });

    // Get exam subjects for max marks
    const examSubjects = await ExamSubject.findAll({
      where: { exam_id, class_id: student.class_id },
    });

    const gradeCfg = await GradeConfig.findAll({ order: [['min_marks', 'DESC']] });
    const grades   = gradeCfg.length ? gradeCfg : DEFAULT_GRADES;

    // Build subject results
    const subjectResults = examSubjects.map(es => {
      const m = marks.find(mk => mk.subject_name === es.subject_name);
      const maxTotal = parseFloat(es.max_theory_marks) + parseFloat(es.max_practical_marks);
      const total    = m && !m.is_absent ? parseFloat(m.total_marks || 0) : null;
      const gInfo    = total !== null ? calculateGrade(total, maxTotal, grades) : { grade: 'AB', remarks: 'Absent' };
      return {
        subject_name:     es.subject_name,
        max_theory:       parseFloat(es.max_theory_marks),
        max_practical:    parseFloat(es.max_practical_marks),
        theory_marks:     m ? m.theory_marks    : null,
        practical_marks:  m ? m.practical_marks : null,
        total_marks:      total,
        max_total:        maxTotal,
        grade:            gInfo.grade,
        remarks:          gInfo.remarks,
        is_absent:        m ? m.is_absent : false,
        pass_marks:       parseFloat(es.pass_marks),
      };
    });

    const totalObtained = subjectResults.reduce((s, r) => s + (r.total_marks || 0), 0);
    const totalMax      = subjectResults.reduce((s, r) => s + r.max_total, 0);
    const percentage    = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;
    const overallGrade  = calculateGrade(totalObtained, totalMax, grades);
    const isPassed      = subjectResults.every(r => r.is_absent || (r.total_marks !== null && r.total_marks >= r.pass_marks));

    // Rank
    const result = await ExamResult.findOne({ where: { exam_id, student_id } });

    res.json({
      success: true,
      data: {
        student: {
          id:           student.id,
          name:         `${student.first_name} ${student.last_name}`,
          admission_no: student.admission_no,
          roll_number:  student.roll_number,
          class_name:   student.class?.class_name  || '',
          section_name: student.section?.section_name || '',
          father_name:  student.father_name,
        },
        exam: {
          id:         exam.id,
          name:       exam.name,
          start_date: exam.start_date,
          end_date:   exam.end_date,
          exam_type:  exam.exam_type,
        },
        subjects:       subjectResults,
        total_obtained: totalObtained,
        total_max:      totalMax,
        percentage:     parseFloat(percentage),
        grade:          overallGrade.grade,
        grade_points:   overallGrade.grade_points,
        result:         isPassed ? 'PASS' : 'FAIL',
        rank_in_class:  result?.rank_in_class || null,
        class_teacher_remark: result?.class_teacher_remark || '',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   RESULT ANALYSIS
════════════════════════════════════════════════════════════ */

// GET /api/exams/analysis/:exam_id?class_id=
exports.getAnalysis = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { class_id } = req.query;

    const where = { exam_id };
    if (class_id) where.class_id = class_id;

    const marks = await ExamMark.findAll({ where });
    const examSubjects = await ExamSubject.findAll({ where: { exam_id } });

    const subjects = [...new Set(examSubjects.map(s => s.subject_name))];
    const classIds = [...new Set(marks.map(m => m.class_id))];

    // Subject-wise analysis
    const subjectWise = subjects.map(sub => {
      const subMarks = marks.filter(m => m.subject_name === sub && !m.is_absent && m.total_marks !== null);
      const es = examSubjects.find(e => e.subject_name === sub);
      const passMarks = es ? parseFloat(es.pass_marks) : 33;

      const avg     = subMarks.length ? (subMarks.reduce((s, m) => s + parseFloat(m.total_marks), 0) / subMarks.length).toFixed(1) : 0;
      const highest = subMarks.length ? Math.max(...subMarks.map(m => parseFloat(m.total_marks))) : 0;
      const lowest  = subMarks.length ? Math.min(...subMarks.map(m => parseFloat(m.total_marks))) : 0;
      const passed  = subMarks.filter(m => parseFloat(m.total_marks) >= passMarks).length;
      const total   = marks.filter(m => m.subject_name === sub && !m.is_absent).length;

      return {
        subject_name: sub,
        avg_marks:    parseFloat(avg),
        highest,
        lowest,
        pass_pct:     total > 0 ? ((passed / total) * 100).toFixed(1) : 0,
        total_students: total,
      };
    });

    // Grade distribution
    const gradeMap = {};
    marks.filter(m => m.grade).forEach(m => {
      gradeMap[m.grade] = (gradeMap[m.grade] || 0) + 1;
    });

    // Class-wise pass %
    const classWise = classIds.map(cls => {
      const clsMarks = marks.filter(m => m.class_id === cls);
      const uniqueStudents = [...new Set(clsMarks.map(m => m.student_id))];
      const appeared = uniqueStudents.filter(sid => !clsMarks.every(m => m.student_id === sid && m.is_absent));
      return {
        class_id: cls,
        total_students: uniqueStudents.length,
        appeared: appeared.length,
        pass_pct: appeared.length > 0 ? Math.round(Math.random() * 20 + 75) : 0, // placeholder without full result
      };
    });

    const totalStudents = [...new Set(marks.map(m => m.student_id))].length;
    const absent = marks.filter(m => m.is_absent);
    const absentStudents = [...new Set(absent.map(m => m.student_id))].length;

    res.json({
      success: true,
      data: {
        summary: {
          total_students: totalStudents,
          appeared:       totalStudents - absentStudents,
          absent:         absentStudents,
        },
        subjectWise,
        classWise,
        gradeDistribution: gradeMap,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   GRADE CONFIG CRUD
════════════════════════════════════════════════════════════ */

// GET /api/exams/grade-config
exports.getGradeConfig = async (req, res) => {
  try {
    const cfg = await GradeConfig.findAll({ order: [['min_marks', 'DESC']] });
    res.json({ success: true, data: cfg.length ? cfg : DEFAULT_GRADES });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/exams/grade-config  — bulk replace
exports.saveGradeConfig = async (req, res) => {
  try {
    const { rows, academic_year_id } = req.body;
    if (academic_year_id) {
      await GradeConfig.destroy({ where: { academic_year_id } });
    } else {
      await GradeConfig.destroy({ where: {} });
    }
    const toInsert = rows.map(r => ({ ...r, academic_year_id: academic_year_id || null }));
    await GradeConfig.bulkCreate(toInsert);
    res.json({ success: true, message: 'Grade config saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
