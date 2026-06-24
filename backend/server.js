const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./config/database');
const User    = require('./models/User');
const Student = require('./models/Student');
const Class   = require('./models/Class');
const Section = require('./models/Section');
const AcademicYear = require('./models/AcademicYear');
const FeeHead         = require('./models/FeeHead');
const FeeStructure    = require('./models/FeeStructure');
const LateFineRule    = require('./models/LateFineRule');
const DiscountType    = require('./models/DiscountType');
const FeeCollection   = require('./models/FeeCollection');
const FeeCollectionDetail = require('./models/FeeCollectionDetail');

// Exam Module Models
const Exam        = require('./models/Exam');
const ExamSubject = require('./models/ExamSubject');
const ExamMark    = require('./models/ExamMark');
const GradeConfig = require('./models/GradeConfig');
const ExamResult  = require('./models/ExamResult');

// Set up associations
Student.belongsTo(Class,        { foreignKey: 'class_id',         as: 'class'        });
Student.belongsTo(Section,      { foreignKey: 'section_id',       as: 'section'      });
Student.belongsTo(AcademicYear, { foreignKey: 'academic_year_id', as: 'academicYear' });

// Fee associations
FeeStructure.belongsTo(FeeHead, { foreignKey: 'fee_head_id', as: 'feeHead' });
FeeHead.hasMany(FeeStructure,   { foreignKey: 'fee_head_id', as: 'structures' });

FeeCollection.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(FeeCollection,   { foreignKey: 'student_id', as: 'feeCollections' });

FeeCollection.hasMany(FeeCollectionDetail,    { foreignKey: 'collection_id', as: 'details' });
FeeCollectionDetail.belongsTo(FeeCollection,  { foreignKey: 'collection_id', as: 'collection' });
FeeCollectionDetail.belongsTo(FeeHead,        { foreignKey: 'fee_head_id',   as: 'feeHead' });

// Exam associations
Exam.hasMany(ExamSubject, { foreignKey: 'exam_id', as: 'subjects' });
ExamSubject.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

Exam.hasMany(ExamMark, { foreignKey: 'exam_id', as: 'marks' });
ExamMark.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });
ExamMark.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(ExamMark, { foreignKey: 'student_id', as: 'examMarks' });

Exam.hasMany(ExamResult, { foreignKey: 'exam_id', as: 'results' });
ExamResult.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });
ExamResult.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(ExamResult, { foreignKey: 'student_id', as: 'examResults' });

const authRoutes       = require('./routes/authRoutes');
const dashboardRoutes  = require('./routes/dashboardRoutes');
const admissionRoutes  = require('./routes/admissionRoutes');
const masterRoutes     = require('./routes/masterRoutes');
const feesRoutes       = require('./routes/feesRoutes');
const examRoutes       = require('./routes/examRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/dashboard',  dashboardRoutes);
app.use('/api/admission',  admissionRoutes);
app.use('/api/master',     masterRoutes);
app.use('/api/fees',       feesRoutes);
app.use('/api/exams',      examRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'JSK School ERP API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    ... (process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// ─── Database Sync & Server Start ────────────────────────
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Create missing tables on startup. Enable DB_SYNC_ALTER=true only for deliberate schema migrations.
    await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
    console.log('✅ Database models synced');

    // Seed default admin user if none exists
    const adminExists = await User.findOne({ where: { email: 'admin@jsk.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@jsk.com',
        password: 'Admin@123',
        role: 'admin',
        is_active: true,
      });
      console.log('✅ Default admin user created (admin@jsk.com / Admin@123)');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 JSK School ERP Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
