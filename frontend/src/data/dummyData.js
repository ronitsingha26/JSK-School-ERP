// ═══════════════════════════════════════════════════════════
// JSK SCHOOL ERP — CENTRALIZED DUMMY DATA
// All modules import from this single file for consistency.
// ═══════════════════════════════════════════════════════════

// ── Academic Years ──
export const academicYears = [
  { id: 1, name: "2025-26", isCurrent: true },
  { id: 2, name: "2024-25", isCurrent: false },
];

// ── Classes ──
export const classes = [
  { id: 1, name: "Nursery", order: 0 },
  { id: 2, name: "LKG", order: 1 },
  { id: 3, name: "UKG", order: 2 },
  { id: 4, name: "Class I", order: 3 },
  { id: 5, name: "Class II", order: 4 },
  { id: 6, name: "Class III", order: 5 },
  { id: 7, name: "Class IV", order: 6 },
  { id: 8, name: "Class V", order: 7 },
  { id: 9, name: "Class VI", order: 8 },
  { id: 10, name: "Class VII", order: 9 },
  { id: 11, name: "Class VIII", order: 10 },
  { id: 12, name: "Class IX", order: 11 },
  { id: 13, name: "Class X", order: 12 },
];

// ── Sections ──
export const sections = [
  { id: 1, classId: 4, name: "A" },
  { id: 2, classId: 4, name: "B" },
  { id: 3, classId: 5, name: "A" },
  { id: 4, classId: 5, name: "B" },
  { id: 5, classId: 5, name: "C" },
  { id: 6, classId: 6, name: "A" },
  { id: 7, classId: 6, name: "B" },
  { id: 8, classId: 7, name: "A" },
  { id: 9, classId: 8, name: "A" },
  { id: 10, classId: 9, name: "A" },
  { id: 11, classId: 9, name: "B" },
  { id: 12, classId: 10, name: "A" },
];

// ── Subjects ──
export const subjects = [
  {
    id: 1, name: "English", code: "ENG", category: "Language",
    color: "#3b82f6", icon: "BookOpen",
    classIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    description: "English Language and Literature",
    isCore: true, hasTheory: true, hasPractical: false,
    theoryMaxMarks: 100, practicalMaxMarks: 0,
  },
  {
    id: 2, name: "Hindi", code: "HIN", category: "Language",
    color: "#f97316", icon: "BookOpen",
    classIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    description: "Hindi Bhasha aur Sahitya",
    isCore: true, hasTheory: true, hasPractical: false,
    theoryMaxMarks: 100, practicalMaxMarks: 0,
  },
  {
    id: 3, name: "Mathematics", code: "MATH", category: "Science",
    color: "#8b5cf6", icon: "Calculator",
    classIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    description: "Mathematics and Arithmetic",
    isCore: true, hasTheory: true, hasPractical: false,
    theoryMaxMarks: 100, practicalMaxMarks: 0,
  },
  {
    id: 4, name: "Science", code: "SCI", category: "Science",
    color: "#10b981", icon: "FlaskConical",
    classIds: [4, 5, 6, 7, 8, 9, 10],
    description: "General Science",
    isCore: true, hasTheory: true, hasPractical: true,
    theoryMaxMarks: 80, practicalMaxMarks: 20,
  },
  {
    id: 5, name: "Social Science", code: "SST", category: "Humanities",
    color: "#f59e0b", icon: "Globe",
    classIds: [4, 5, 6, 7, 8, 9, 10],
    description: "History, Geography, Civics",
    isCore: true, hasTheory: true, hasPractical: false,
    theoryMaxMarks: 100, practicalMaxMarks: 0,
  },
  {
    id: 6, name: "Computer Science", code: "CS", category: "Technology",
    color: "#06b6d4", icon: "Monitor",
    classIds: [6, 7, 8, 9, 10, 11, 12, 13],
    description: "Computer Fundamentals and Programming",
    isCore: false, hasTheory: true, hasPractical: true,
    theoryMaxMarks: 70, practicalMaxMarks: 30,
  },
  {
    id: 7, name: "Sanskrit", code: "SKT", category: "Language",
    color: "#ec4899", icon: "Scroll",
    classIds: [6, 7, 8, 9, 10],
    description: "Sanskrit Language",
    isCore: false, hasTheory: true, hasPractical: false,
    theoryMaxMarks: 100, practicalMaxMarks: 0,
  },
  {
    id: 8, name: "Drawing & Art", code: "ART", category: "Arts",
    color: "#84cc16", icon: "Palette",
    classIds: [4, 5, 6, 7, 8],
    description: "Fine Arts and Drawing",
    isCore: false, hasTheory: false, hasPractical: true,
    theoryMaxMarks: 0, practicalMaxMarks: 100,
  },
  {
    id: 9, name: "Physical Education", code: "PE", category: "Sports",
    color: "#14b8a6", icon: "Trophy",
    classIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    description: "Physical Education and Sports",
    isCore: false, hasTheory: false, hasPractical: true,
    theoryMaxMarks: 0, practicalMaxMarks: 50,
  },
  {
    id: 10, name: "GK & Current Affairs", code: "GK", category: "General",
    color: "#6366f1", icon: "Lightbulb",
    classIds: [4, 5, 6, 7, 8],
    description: "General Knowledge",
    isCore: false, hasTheory: true, hasPractical: false,
    theoryMaxMarks: 50, practicalMaxMarks: 0,
  },
];

// ── Teachers ──
export const teachers = [
  { id: 1, name: "Ramesh Kumar", empId: "JSK-T-001", subjectIds: [1, 10], avatar: "RK", color: "#3b82f6" },
  { id: 2, name: "Priya Verma", empId: "JSK-T-002", subjectIds: [2, 7], avatar: "PV", color: "#ec4899" },
  { id: 3, name: "Sunil Sharma", empId: "JSK-T-003", subjectIds: [3], avatar: "SS", color: "#8b5cf6" },
  { id: 4, name: "Anita Singh", empId: "JSK-T-004", subjectIds: [4], avatar: "AS", color: "#10b981" },
  { id: 5, name: "Mohan Yadav", empId: "JSK-T-005", subjectIds: [5], avatar: "MY", color: "#f59e0b" },
  { id: 6, name: "Kavita Joshi", empId: "JSK-T-006", subjectIds: [6], avatar: "KJ", color: "#06b6d4" },
  { id: 7, name: "Deepak Gupta", empId: "JSK-T-007", subjectIds: [8, 9], avatar: "DG", color: "#84cc16" },
  { id: 8, name: "Sunita Devi", empId: "JSK-T-008", subjectIds: [1, 2], avatar: "SD", color: "#f97316" },
];

// ── Periods Configuration ──
export const periods = [
  { id: 1, name: "Assembly", startTime: "07:30", endTime: "08:00", isBreak: true, type: "assembly" },
  { id: 2, name: "Period 1", startTime: "08:00", endTime: "08:45", isBreak: false, type: "class" },
  { id: 3, name: "Period 2", startTime: "08:45", endTime: "09:30", isBreak: false, type: "class" },
  { id: 4, name: "Period 3", startTime: "09:30", endTime: "10:15", isBreak: false, type: "class" },
  { id: 5, name: "Short Break", startTime: "10:15", endTime: "10:30", isBreak: true, type: "break" },
  { id: 6, name: "Period 4", startTime: "10:30", endTime: "11:15", isBreak: false, type: "class" },
  { id: 7, name: "Period 5", startTime: "11:15", endTime: "12:00", isBreak: false, type: "class" },
  { id: 8, name: "Lunch Break", startTime: "12:00", endTime: "12:30", isBreak: true, type: "break" },
  { id: 9, name: "Period 6", startTime: "12:30", endTime: "13:15", isBreak: false, type: "class" },
  { id: 10, name: "Period 7", startTime: "13:15", endTime: "14:00", isBreak: false, type: "class" },
];

// ── Timetable Data (classId-sectionId as key) ──
export const timetableData = {
  "4-1": {
    Monday: {
      2: { subjectId: 1, teacherId: 1 },
      3: { subjectId: 3, teacherId: 3 },
      4: { subjectId: 2, teacherId: 2 },
      6: { subjectId: 4, teacherId: 4 },
      7: { subjectId: 5, teacherId: 5 },
      9: { subjectId: 10, teacherId: 1 },
      10: { subjectId: 9, teacherId: 7 },
    },
    Tuesday: {
      2: { subjectId: 3, teacherId: 3 },
      3: { subjectId: 1, teacherId: 1 },
      4: { subjectId: 5, teacherId: 5 },
      6: { subjectId: 2, teacherId: 2 },
      7: { subjectId: 4, teacherId: 4 },
      9: { subjectId: 8, teacherId: 7 },
      10: { subjectId: 10, teacherId: 1 },
    },
    Wednesday: {
      2: { subjectId: 2, teacherId: 2 },
      3: { subjectId: 4, teacherId: 4 },
      4: { subjectId: 3, teacherId: 3 },
      6: { subjectId: 1, teacherId: 1 },
      7: { subjectId: 10, teacherId: 1 },
      9: { subjectId: 5, teacherId: 5 },
      10: { subjectId: 8, teacherId: 7 },
    },
    Thursday: {
      2: { subjectId: 5, teacherId: 5 },
      3: { subjectId: 2, teacherId: 2 },
      4: { subjectId: 1, teacherId: 1 },
      6: { subjectId: 3, teacherId: 3 },
      7: { subjectId: 9, teacherId: 7 },
      9: { subjectId: 4, teacherId: 4 },
      10: { subjectId: 10, teacherId: 1 },
    },
    Friday: {
      2: { subjectId: 4, teacherId: 4 },
      3: { subjectId: 5, teacherId: 5 },
      4: { subjectId: 10, teacherId: 1 },
      6: { subjectId: 2, teacherId: 2 },
      7: { subjectId: 1, teacherId: 1 },
      9: { subjectId: 3, teacherId: 3 },
      10: { subjectId: 8, teacherId: 7 },
    },
    Saturday: {
      2: { subjectId: 1, teacherId: 8 },
      3: { subjectId: 3, teacherId: 3 },
      4: { subjectId: 2, teacherId: 8 },
      6: { subjectId: 5, teacherId: 5 },
      7: { subjectId: 4, teacherId: 4 },
      9: { subjectId: 9, teacherId: 7 },
      10: { subjectId: 10, teacherId: 1 },
    },
  },
};

// ── Students ──
export const students = [
  { id: 1, admNo: "JSK20250001", name: "Aaditya Kumar", fatherName: "Rajesh Kumar", classId: 4, sectionId: 1, mobile: "9876543210", email: "aaditya@mail.com", bus: true, status: "active", avatar: "AK", avatarColor: "#3b82f6" },
  { id: 2, admNo: "JSK20250002", name: "Priya Sharma", fatherName: "Suresh Sharma", classId: 5, sectionId: 3, mobile: "9123456780", email: "priya@mail.com", bus: false, status: "active", avatar: "PS", avatarColor: "#10b981" },
  { id: 3, admNo: "JSK20250003", name: "Rahul Verma", fatherName: "Anil Verma", classId: 7, sectionId: 8, mobile: "8899001122", email: "rahul@mail.com", bus: true, status: "active", avatar: "RV", avatarColor: "#f97316" },
  { id: 4, admNo: "JSK20250004", name: "Sneha Gupta", fatherName: "Vikram Gupta", classId: 5, sectionId: 5, mobile: "9012345678", email: "sneha@mail.com", bus: false, status: "inactive", avatar: "SG", avatarColor: "#ef4444" },
  { id: 5, admNo: "JSK20250005", name: "Vikash Yadav", fatherName: "Mohan Yadav", classId: 6, sectionId: 6, mobile: "9988776655", email: "vikash@mail.com", bus: true, status: "active", avatar: "VY", avatarColor: "#8b5cf6" },
  { id: 6, admNo: "JSK20250006", name: "Anjali Tiwari", fatherName: "Ramesh Tiwari", classId: 9, sectionId: 10, mobile: "9871234560", email: "anjali@mail.com", bus: false, status: "active", avatar: "AT", avatarColor: "#ec4899" },
  { id: 7, admNo: "JSK20250007", name: "Rohit Singh", fatherName: "Suresh Singh", classId: 10, sectionId: 12, mobile: "9765432100", email: "rohit@mail.com", bus: true, status: "active", avatar: "RS", avatarColor: "#06b6d4" },
  { id: 8, admNo: "JSK20250008", name: "Kavya Mishra", fatherName: "Dinesh Mishra", classId: 4, sectionId: 2, mobile: "9654321098", email: "kavya@mail.com", bus: false, status: "active", avatar: "KM", avatarColor: "#84cc16" },
];

// ── Fee Collections ──
export const feeCollections = [
  { id: 1, receiptNo: "REC/2025/5280", studentId: 1, amount: 2900, mode: "cash", date: "2025-05-15", type: "Monthly" },
  { id: 2, receiptNo: "REC/2025/5317", studentId: 2, amount: 1500, mode: "online", date: "2025-05-15", type: "Monthly" },
  { id: 3, receiptNo: "REC/2025/5354", studentId: 3, amount: 4000, mode: "cash", date: "2025-05-14", type: "Monthly" },
  { id: 4, receiptNo: "REC/2025/5391", studentId: 4, amount: 2500, mode: "online", date: "2025-05-13", type: "Annual" },
  { id: 5, receiptNo: "REC/2025/5428", studentId: 5, amount: 1360, mode: "cash", date: "2025-05-12", type: "Monthly" },
];

// ── Helper: Get class name by ID ──
export const getClassName = (id) => classes.find(c => c.id === id)?.name || '—';

// ── Helper: Get section name by ID ──
export const getSectionName = (id) => sections.find(s => s.id === id)?.name || '—';

// ── Helper: Get subject by ID ──
export const getSubject = (id) => subjects.find(s => s.id === id);

// ── Helper: Get teacher by ID ──
export const getTeacher = (id) => teachers.find(t => t.id === id);

// ── Helper: Get sections for a class ──
export const getSectionsForClass = (classId) => sections.filter(s => s.classId === classId);

// ── Helper: Get subjects for a class ──
export const getSubjectsForClass = (classId) => subjects.filter(s => s.classIds.includes(classId));

// ── Helper: Get teachers for a subject ──
export const getTeachersForSubject = (subjectId) => teachers.filter(t => t.subjectIds.includes(subjectId));

// ── Category Colors ──
export const CATEGORY_COLORS = {
  Language:   { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' },
  Science:    { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' },
  Humanities: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  Technology: { bg: '#cffafe', text: '#0891b2', border: '#a5f3fc' },
  Arts:       { bg: '#fce7f3', text: '#db2777', border: '#fbcfe8' },
  Sports:     { bg: '#ccfbf1', text: '#0d9488', border: '#99f6e4' },
  General:    { bg: '#e0e7ff', text: '#4f46e5', border: '#c7d2fe' },
};

// ── Subject Icon Map (string → component name reference) ──
export const SUBJECT_ICON_OPTIONS = [
  'BookOpen', 'Calculator', 'FlaskConical', 'Globe',
  'Monitor', 'Palette', 'Trophy', 'Lightbulb', 'Scroll',
];

// ── Preset Color Swatches ──
export const COLOR_SWATCHES = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f97316',
  '#ef4444', '#06b6d4', '#f59e0b', '#ec4899',
];

// ── Days of the week ──
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ═══════════════════════════════════════════════════════════
// TEACHER MANAGEMENT MODULE — DATA
// ═══════════════════════════════════════════════════════════

// ─── DEPARTMENTS ───────────────────────────────────────────
export const departments = [
  { id: 1, name: "Academic",           color: "#3b82f6" },
  { id: 2, name: "Science",            color: "#10b981" },
  { id: 3, name: "Commerce",           color: "#8b5cf6" },
  { id: 4, name: "Arts",               color: "#ec4899" },
  { id: 5, name: "Physical Education", color: "#14b8a6" },
  { id: 6, name: "Administration",     color: "#6b7280" },
];

// ─── DESIGNATIONS ──────────────────────────────────────────
export const designations = [
  { id: 1,  name: "Principal",                       short: "Principal"    },
  { id: 2,  name: "Vice Principal",                  short: "V. Principal" },
  { id: 3,  name: "PGT (Post Graduate Teacher)",     short: "PGT"          },
  { id: 4,  name: "TGT (Trained Graduate Teacher)",  short: "TGT"          },
  { id: 5,  name: "PRT (Primary Teacher)",           short: "PRT"          },
  { id: 6,  name: "Computer Teacher",                short: "Comp. Teacher"},
  { id: 7,  name: "PTI (Physical Training Inst)",    short: "PTI"          },
  { id: 8,  name: "Librarian",                       short: "Librarian"    },
  { id: 9,  name: "Accountant",                      short: "Accountant"   },
  { id: 10, name: "Clerk",                           short: "Clerk"        },
];

// ─── TEACHERS (8 full records) ─────────────────────────────
export const teachersData = [
  {
    id: 1, empId: "JSK-T-001", firstName: "Ramesh", lastName: "Sharma",
    name: "Ramesh Kumar Sharma", fatherName: "Shiv Kumar Sharma",
    dob: "1985-04-12", gender: "Male", bloodGroup: "B+", religion: "Hindu",
    category: "General", nationality: "Indian",
    mobile: "9876543210", alternateMobile: "9123456789",
    email: "ramesh.sharma@jsk.edu.in",
    address: "Ward No. 5, Pratapganj, Bihar", city: "Bhagalpur", state: "Bihar", pin: "813105",
    departmentId: 1, designationId: 4, employmentType: "Permanent",
    qualification: "M.A. English, B.Ed", experience: "8 Years",
    joinDate: "2017-06-01", subjectIds: [1, 10], classIds: [4, 5, 6, 7, 8],
    basicSalary: 18000, hra: 3600, da: 1800, ta: 1000,
    pf: 2160, esi: 0, tds: 0,
    accountNo: "1234567890", bankName: "State Bank of India", ifsc: "SBIN0001234",
    branch: "Pratapganj Branch", accountType: "Savings",
    status: "active", avatar: "RK", avatarColor: "#3b82f6", photo: null,
    documents: { photo: true, aadhar: true, pan: true, degree: true, appointment: false, cheque: true },
  },
  {
    id: 2, empId: "JSK-T-002", firstName: "Priya", lastName: "Verma",
    name: "Priya Verma", fatherName: "Arun Verma",
    dob: "1990-08-22", gender: "Female", bloodGroup: "O+", religion: "Hindu",
    category: "OBC", nationality: "Indian",
    mobile: "9234567801", alternateMobile: "",
    email: "priya.verma@jsk.edu.in",
    address: "Near Bus Stand, Pratapganj", city: "Bhagalpur", state: "Bihar", pin: "813105",
    departmentId: 1, designationId: 5, employmentType: "Permanent",
    qualification: "M.A. Hindi, B.Ed", experience: "5 Years",
    joinDate: "2020-07-10", subjectIds: [2, 7], classIds: [4, 5, 6],
    basicSalary: 15000, hra: 3000, da: 1500, ta: 800,
    pf: 1800, esi: 0, tds: 0,
    accountNo: "9876543210", bankName: "Punjab National Bank", ifsc: "PUNB0001234",
    branch: "Bhagalpur Main", accountType: "Savings",
    status: "active", avatar: "PV", avatarColor: "#ec4899", photo: null,
    documents: { photo: true, aadhar: true, pan: false, degree: true, appointment: true, cheque: false },
  },
  {
    id: 3, empId: "JSK-T-003", firstName: "Sunil", lastName: "Sharma",
    name: "Sunil Kumar Sharma", fatherName: "Ram Prasad Sharma",
    dob: "1982-11-05", gender: "Male", bloodGroup: "A+", religion: "Hindu",
    category: "General", nationality: "Indian",
    mobile: "9345678012", alternateMobile: "9012345678",
    email: "sunil.sharma@jsk.edu.in",
    address: "Station Road, Pratapganj", city: "Bhagalpur", state: "Bihar", pin: "813105",
    departmentId: 2, designationId: 3, employmentType: "Permanent",
    qualification: "M.Sc Mathematics, B.Ed", experience: "15 Years",
    joinDate: "2010-04-01", subjectIds: [3], classIds: [7, 8, 9, 10, 11, 12, 13],
    basicSalary: 25000, hra: 5000, da: 2500, ta: 1200,
    pf: 3000, esi: 0, tds: 500,
    accountNo: "4567890123", bankName: "Bank of India", ifsc: "BKID0001234",
    branch: "Bhagalpur City", accountType: "Savings",
    status: "active", avatar: "SS", avatarColor: "#8b5cf6", photo: null,
    documents: { photo: true, aadhar: true, pan: true, degree: true, appointment: true, cheque: true },
  },
  {
    id: 4, empId: "JSK-T-004", firstName: "Anita", lastName: "Singh",
    name: "Anita Singh", fatherName: "Mohan Singh",
    dob: "1988-03-17", gender: "Female", bloodGroup: "AB+", religion: "Hindu",
    category: "General", nationality: "Indian",
    mobile: "9456780123", alternateMobile: "",
    email: "anita.singh@jsk.edu.in",
    address: "Andar Mahal, Bhagalpur", city: "Bhagalpur", state: "Bihar", pin: "812001",
    departmentId: 2, designationId: 4, employmentType: "Permanent",
    qualification: "M.Sc Science, B.Ed", experience: "7 Years",
    joinDate: "2018-06-15", subjectIds: [4], classIds: [6, 7, 8, 9, 10],
    basicSalary: 16000, hra: 3200, da: 1600, ta: 900,
    pf: 1920, esi: 0, tds: 0,
    accountNo: "7890123456", bankName: "State Bank of India", ifsc: "SBIN0005678",
    branch: "Nathnagar Branch", accountType: "Savings",
    status: "active", avatar: "AS", avatarColor: "#10b981", photo: null,
    documents: { photo: true, aadhar: true, pan: true, degree: false, appointment: true, cheque: true },
  },
  {
    id: 5, empId: "JSK-T-005", firstName: "Mohan", lastName: "Yadav",
    name: "Mohan Yadav", fatherName: "Shyam Yadav",
    dob: "1987-07-30", gender: "Male", bloodGroup: "B+", religion: "Hindu",
    category: "OBC", nationality: "Indian",
    mobile: "9567801234", alternateMobile: "",
    email: "mohan.yadav@jsk.edu.in",
    address: "Godda Road, Pratapganj", city: "Bhagalpur", state: "Bihar", pin: "813105",
    departmentId: 1, designationId: 4, employmentType: "Permanent",
    qualification: "M.A. Social Science, B.Ed", experience: "9 Years",
    joinDate: "2016-07-01", subjectIds: [5], classIds: [6, 7, 8, 9, 10],
    basicSalary: 17000, hra: 3400, da: 1700, ta: 950,
    pf: 2040, esi: 0, tds: 0,
    accountNo: "3210987654", bankName: "UCO Bank", ifsc: "UCBA0001234",
    branch: "Pratapganj", accountType: "Savings",
    status: "active", avatar: "MY", avatarColor: "#f59e0b", photo: null,
    documents: { photo: true, aadhar: true, pan: false, degree: true, appointment: true, cheque: false },
  },
  {
    id: 6, empId: "JSK-T-006", firstName: "Kavita", lastName: "Joshi",
    name: "Kavita Joshi", fatherName: "Dinesh Joshi",
    dob: "1993-01-25", gender: "Female", bloodGroup: "O-", religion: "Hindu",
    category: "General", nationality: "Indian",
    mobile: "9678012345", alternateMobile: "8765432100",
    email: "kavita.joshi@jsk.edu.in",
    address: "New Colony, Bhagalpur", city: "Bhagalpur", state: "Bihar", pin: "812002",
    departmentId: 1, designationId: 6, employmentType: "Contract",
    qualification: "MCA, B.Ed", experience: "4 Years",
    joinDate: "2021-03-20", subjectIds: [6], classIds: [8, 9, 10, 11, 12],
    basicSalary: 14000, hra: 2800, da: 1400, ta: 750,
    pf: 1680, esi: 0, tds: 0,
    accountNo: "6543210987", bankName: "Axis Bank", ifsc: "UTIB0001234",
    branch: "Bhagalpur", accountType: "Savings",
    status: "active", avatar: "KJ", avatarColor: "#06b6d4", photo: null,
    documents: { photo: false, aadhar: true, pan: true, degree: true, appointment: false, cheque: true },
  },
  {
    id: 7, empId: "JSK-T-007", firstName: "Deepak", lastName: "Gupta",
    name: "Deepak Gupta", fatherName: "Rakesh Gupta",
    dob: "1986-09-14", gender: "Male", bloodGroup: "A-", religion: "Hindu",
    category: "General", nationality: "Indian",
    mobile: "9780123456", alternateMobile: "",
    email: "deepak.gupta@jsk.edu.in",
    address: "Tilkamanjhi, Bhagalpur", city: "Bhagalpur", state: "Bihar", pin: "812001",
    departmentId: 5, designationId: 7, employmentType: "Permanent",
    qualification: "B.P.Ed, M.P.Ed", experience: "12 Years",
    joinDate: "2013-06-01", subjectIds: [8, 9], classIds: [4, 5, 6, 7, 8, 9, 10],
    basicSalary: 16500, hra: 3300, da: 1650, ta: 900,
    pf: 1980, esi: 0, tds: 0,
    accountNo: "9870123456", bankName: "State Bank of India", ifsc: "SBIN0009012",
    branch: "Tilkamanjhi", accountType: "Savings",
    status: "active", avatar: "DG", avatarColor: "#84cc16", photo: null,
    documents: { photo: true, aadhar: true, pan: true, degree: true, appointment: true, cheque: true },
  },
  {
    id: 8, empId: "JSK-T-008", firstName: "Sunita", lastName: "Devi",
    name: "Sunita Devi", fatherName: "Vijay Kumar",
    dob: "1992-05-08", gender: "Female", bloodGroup: "B-", religion: "Hindu",
    category: "SC", nationality: "Indian",
    mobile: "9890234567", alternateMobile: "",
    email: "sunita.devi@jsk.edu.in",
    address: "Nathnagar, Bhagalpur", city: "Bhagalpur", state: "Bihar", pin: "812003",
    departmentId: 1, designationId: 5, employmentType: "Contract",
    qualification: "B.A., B.Ed", experience: "3 Years",
    joinDate: "2022-07-01", subjectIds: [1, 2], classIds: [4, 5],
    basicSalary: 13000, hra: 2600, da: 1300, ta: 700,
    pf: 1560, esi: 0, tds: 0,
    accountNo: "1234509876", bankName: "Punjab National Bank", ifsc: "PUNB0005678",
    branch: "Nathnagar", accountType: "Savings",
    status: "on-leave", avatar: "SD", avatarColor: "#f97316", photo: null,
    documents: { photo: true, aadhar: false, pan: false, degree: true, appointment: false, cheque: false },
  },
];

// ─── TEACHER ATTENDANCE (May 2026) ─────────────────────────
export const teacherAttendanceData = [
  { id: 1,  teacherId: 1, date: "2026-05-01", status: "present"  },
  { id: 2,  teacherId: 1, date: "2026-05-02", status: "present"  },
  { id: 3,  teacherId: 1, date: "2026-05-03", status: "absent"   },
  { id: 4,  teacherId: 1, date: "2026-05-05", status: "present"  },
  { id: 5,  teacherId: 1, date: "2026-05-06", status: "present"  },
  { id: 6,  teacherId: 1, date: "2026-05-07", status: "present"  },
  { id: 7,  teacherId: 1, date: "2026-05-08", status: "half-day" },
  { id: 8,  teacherId: 1, date: "2026-05-09", status: "present"  },
  { id: 9,  teacherId: 1, date: "2026-05-12", status: "present"  },
  { id: 10, teacherId: 1, date: "2026-05-13", status: "present"  },
  { id: 11, teacherId: 1, date: "2026-05-14", status: "present"  },
  { id: 12, teacherId: 1, date: "2026-05-15", status: "present"  },
  { id: 13, teacherId: 1, date: "2026-05-16", status: "present"  },
  { id: 14, teacherId: 2, date: "2026-05-01", status: "present"  },
  { id: 15, teacherId: 2, date: "2026-05-02", status: "present"  },
  { id: 16, teacherId: 2, date: "2026-05-05", status: "absent"   },
  { id: 17, teacherId: 2, date: "2026-05-06", status: "present"  },
  { id: 18, teacherId: 3, date: "2026-05-01", status: "present"  },
  { id: 19, teacherId: 3, date: "2026-05-02", status: "present"  },
  { id: 20, teacherId: 4, date: "2026-05-01", status: "present"  },
  { id: 21, teacherId: 5, date: "2026-05-01", status: "present"  },
  { id: 22, teacherId: 6, date: "2026-05-01", status: "present"  },
  { id: 23, teacherId: 7, date: "2026-05-01", status: "present"  },
  { id: 24, teacherId: 8, date: "2026-05-01", status: "on-leave" },
  { id: 25, teacherId: 8, date: "2026-05-02", status: "on-leave" },
  { id: 26, teacherId: 8, date: "2026-05-05", status: "on-leave" },
  { id: 27, teacherId: 8, date: "2026-05-06", status: "on-leave" },
  { id: 28, teacherId: 8, date: "2026-05-07", status: "on-leave" },
];

// ─── TEACHER SALARY HISTORY ────────────────────────────────
export const teacherSalaryHistory = [
  { id: 1, teacherId: 1, month: "May",      year: 2026, gross: 24400, deductions: 2160, net: 22240, status: "pending", paidOn: null },
  { id: 2, teacherId: 1, month: "April",    year: 2026, gross: 24400, deductions: 2160, net: 22240, status: "paid",    paidOn: "2026-04-30" },
  { id: 3, teacherId: 1, month: "March",    year: 2026, gross: 24400, deductions: 2160, net: 22240, status: "paid",    paidOn: "2026-03-31" },
  { id: 4, teacherId: 1, month: "February", year: 2026, gross: 24400, deductions: 2160, net: 22240, status: "paid",    paidOn: "2026-02-29" },
  { id: 5, teacherId: 2, month: "May",      year: 2026, gross: 20300, deductions: 1800, net: 18500, status: "pending", paidOn: null },
  { id: 6, teacherId: 2, month: "April",    year: 2026, gross: 20300, deductions: 1800, net: 18500, status: "paid",    paidOn: "2026-04-30" },
  { id: 7, teacherId: 3, month: "May",      year: 2026, gross: 33700, deductions: 3500, net: 30200, status: "pending", paidOn: null },
  { id: 8, teacherId: 3, month: "April",    year: 2026, gross: 33700, deductions: 3500, net: 30200, status: "paid",    paidOn: "2026-04-30" },
];

// ─── MONTHS LIST ───────────────────────────────────────────
export const monthsList = [
  { id: 1,  name: "April",     short: "Apr", days: 30 },
  { id: 2,  name: "May",       short: "May", days: 31 },
  { id: 3,  name: "June",      short: "Jun", days: 30 },
  { id: 4,  name: "July",      short: "Jul", days: 31 },
  { id: 5,  name: "August",    short: "Aug", days: 31 },
  { id: 6,  name: "September", short: "Sep", days: 30 },
  { id: 7,  name: "October",   short: "Oct", days: 31 },
  { id: 8,  name: "November",  short: "Nov", days: 30 },
  { id: 9,  name: "December",  short: "Dec", days: 31 },
  { id: 10, name: "January",   short: "Jan", days: 31 },
  { id: 11, name: "February",  short: "Feb", days: 28 },
  { id: 12, name: "March",     short: "Mar", days: 31 },
];

// ─── PAYROLL RECORDS ───────────────────────────────────────
export const payrollRecords = [
  { id: 1, teacherId: 1, month: "April", year: 2026, workingDays: 26, presentDays: 25, lopDays: 1, basic: 18000, hra: 3600, da: 1800, ta: 1000, grossEarnings: 24400, pf: 2160, esi: 0, tds: 0, otherDeduction: 692, totalDeductions: 2852, netSalary: 21548, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "" },
  { id: 2, teacherId: 2, month: "April", year: 2026, workingDays: 26, presentDays: 26, lopDays: 0, basic: 15000, hra: 3000, da: 1500, ta: 800, grossEarnings: 20300, pf: 1800, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1800, netSalary: 18500, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "" },
  { id: 3, teacherId: 3, month: "April", year: 2026, workingDays: 26, presentDays: 26, lopDays: 0, basic: 25000, hra: 5000, da: 2500, ta: 1200, grossEarnings: 33700, pf: 3000, esi: 0, tds: 500, otherDeduction: 0, totalDeductions: 3500, netSalary: 30200, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "" },
  { id: 4, teacherId: 4, month: "April", year: 2026, workingDays: 26, presentDays: 26, lopDays: 0, basic: 16000, hra: 3200, da: 1600, ta: 900, grossEarnings: 21700, pf: 1920, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1920, netSalary: 19780, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "" },
  { id: 5, teacherId: 5, month: "April", year: 2026, workingDays: 26, presentDays: 25, lopDays: 1, basic: 17000, hra: 3400, da: 1700, ta: 950, grossEarnings: 23050, pf: 2040, esi: 0, tds: 0, otherDeduction: 654, totalDeductions: 2694, netSalary: 20356, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "" },
  { id: 6, teacherId: 6, month: "April", year: 2026, workingDays: 26, presentDays: 26, lopDays: 0, basic: 14000, hra: 2800, da: 1400, ta: 750, grossEarnings: 18950, pf: 1680, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1680, netSalary: 17270, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "" },
  { id: 7, teacherId: 7, month: "April", year: 2026, workingDays: 26, presentDays: 26, lopDays: 0, basic: 16500, hra: 3300, da: 1650, ta: 900, grossEarnings: 22350, pf: 1980, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1980, netSalary: 20370, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "" },
  { id: 8, teacherId: 8, month: "April", year: 2026, workingDays: 26, presentDays: 18, lopDays: 8, basic: 13000, hra: 2600, da: 1300, ta: 700, grossEarnings: 10261, pf: 1560, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1560, netSalary: 8701, advanceRecovery: 0, status: "paid", paidOn: "2026-04-30", paidMode: "Bank Transfer", remarks: "LOP applied for 8 days absence" },
  { id: 9, teacherId: 1, month: "May", year: 2026, workingDays: 27, presentDays: 26, lopDays: 1, basic: 18000, hra: 3600, da: 1800, ta: 1000, grossEarnings: 23733, pf: 2160, esi: 0, tds: 0, otherDeduction: 667, totalDeductions: 2827, netSalary: 20906, advanceRecovery: 0, status: "pending", paidOn: null, paidMode: "", remarks: "" },
  { id: 10, teacherId: 2, month: "May", year: 2026, workingDays: 27, presentDays: 26, lopDays: 1, basic: 15000, hra: 3000, da: 1500, ta: 800, grossEarnings: 19556, pf: 1800, esi: 0, tds: 0, otherDeduction: 556, totalDeductions: 2356, netSalary: 17200, advanceRecovery: 0, status: "pending", paidOn: null, paidMode: "", remarks: "" },
  { id: 11, teacherId: 3, month: "May", year: 2026, workingDays: 27, presentDays: 27, lopDays: 0, basic: 25000, hra: 5000, da: 2500, ta: 1200, grossEarnings: 33700, pf: 3000, esi: 0, tds: 500, otherDeduction: 0, totalDeductions: 3500, netSalary: 30200, advanceRecovery: 0, status: "processing", paidOn: null, paidMode: "Bank Transfer", remarks: "" },
  { id: 12, teacherId: 4, month: "May", year: 2026, workingDays: 27, presentDays: 27, lopDays: 0, basic: 16000, hra: 3200, da: 1600, ta: 900, grossEarnings: 21700, pf: 1920, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1920, netSalary: 19780, advanceRecovery: 0, status: "pending", paidOn: null, paidMode: "", remarks: "" },
  { id: 13, teacherId: 5, month: "May", year: 2026, workingDays: 27, presentDays: 27, lopDays: 0, basic: 17000, hra: 3400, da: 1700, ta: 950, grossEarnings: 23050, pf: 2040, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 2040, netSalary: 21010, advanceRecovery: 0, status: "pending", paidOn: null, paidMode: "", remarks: "" },
  { id: 14, teacherId: 6, month: "May", year: 2026, workingDays: 27, presentDays: 27, lopDays: 0, basic: 14000, hra: 2800, da: 1400, ta: 750, grossEarnings: 18950, pf: 1680, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1680, netSalary: 17270, advanceRecovery: 0, status: "pending", paidOn: null, paidMode: "", remarks: "" },
  { id: 15, teacherId: 7, month: "May", year: 2026, workingDays: 27, presentDays: 27, lopDays: 0, basic: 16500, hra: 3300, da: 1650, ta: 900, grossEarnings: 22350, pf: 1980, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1980, netSalary: 20370, advanceRecovery: 0, status: "pending", paidOn: null, paidMode: "", remarks: "" },
  { id: 16, teacherId: 8, month: "May", year: 2026, workingDays: 27, presentDays: 0, lopDays: 27, basic: 13000, hra: 2600, da: 1300, ta: 700, grossEarnings: 0, pf: 0, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 0, netSalary: 0, advanceRecovery: 0, status: "on-hold", paidOn: null, paidMode: "", remarks: "Full month on medical leave - pending approval" },
  { id: 17, teacherId: 1, month: "March", year: 2026, workingDays: 26, presentDays: 26, lopDays: 0, basic: 18000, hra: 3600, da: 1800, ta: 1000, grossEarnings: 24400, pf: 2160, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 2160, netSalary: 22240, advanceRecovery: 0, status: "paid", paidOn: "2026-03-31", paidMode: "Bank Transfer", remarks: "" },
  { id: 18, teacherId: 2, month: "March", year: 2026, workingDays: 26, presentDays: 26, lopDays: 0, basic: 15000, hra: 3000, da: 1500, ta: 800, grossEarnings: 20300, pf: 1800, esi: 0, tds: 0, otherDeduction: 0, totalDeductions: 1800, netSalary: 18500, advanceRecovery: 0, status: "paid", paidOn: "2026-03-31", paidMode: "Bank Transfer", remarks: "" },
];

// ─── ADVANCE RECORDS ───────────────────────────────────────
export const advanceRecords = [
  { id: 1, teacherId: 1, amount: 5000, givenDate: "2026-03-15", reason: "Medical emergency", recoveryPerMonth: 1000, recoveredSoFar: 2000, remainingAmount: 3000, status: "active" },
  { id: 2, teacherId: 5, amount: 3000, givenDate: "2026-02-10", reason: "Personal reason", recoveryPerMonth: 1000, recoveredSoFar: 3000, remainingAmount: 0, status: "closed" },
];

export const getPayrollSummary = (records = payrollRecords, month = "May", year = 2026) => {
  const monthRecords = records.filter(r => r.month === month && r.year === year);
  return {
    staffCount: monthRecords.length,
    totalGross: monthRecords.reduce((sum, r) => sum + r.grossEarnings, 0),
    totalNet: monthRecords.reduce((sum, r) => sum + r.netSalary, 0),
    totalPF: monthRecords.reduce((sum, r) => sum + r.pf, 0),
    totalPaid: monthRecords.filter(r => r.status === "paid").length,
    totalPending: monthRecords.filter(r => ["pending", "processing", "on-hold"].includes(r.status)).length,
  };
};

// ─── TEACHER HELPERS ───────────────────────────────────────
export const getDepartment  = (id) => departments.find(d => d.id === id);
export const getDesignation = (id) => designations.find(d => d.id === id);
export const getTeacherData = (id) => teachersData.find(t => t.id === id);

// ═══════════════════════════════════════════════════════════
// LIBRARY MANAGEMENT MODULE — DATA
// ═══════════════════════════════════════════════════════════

// ─── BOOK CATEGORIES ───────────────────────────────────────
export const bookCategories = [
  { id: 1,  name: "Mathematics",        color: "#8b5cf6", icon: "Calculator"   },
  { id: 2,  name: "Science",            color: "#10b981", icon: "FlaskConical" },
  { id: 3,  name: "English Literature", color: "#3b82f6", icon: "BookOpen"     },
  { id: 4,  name: "Hindi Literature",   color: "#f97316", icon: "BookOpen"     },
  { id: 5,  name: "Social Science",     color: "#f59e0b", icon: "Globe"        },
  { id: 6,  name: "Computer Science",   color: "#06b6d4", icon: "Monitor"      },
  { id: 7,  name: "General Knowledge",  color: "#6366f1", icon: "Lightbulb"    },
  { id: 8,  name: "Sanskrit",           color: "#ec4899", icon: "Scroll"       },
  { id: 9,  name: "Reference",          color: "#14b8a6", icon: "BookMarked"   },
  { id: 10, name: "Story / Fiction",    color: "#84cc16", icon: "BookHeart"    },
  { id: 11, name: "Encyclopedia",       color: "#ef4444", icon: "Library"      },
  { id: 12, name: "Dictionary",         color: "#0ea5e9", icon: "AlignLeft"    },
  { id: 13, name: "Magazine",           color: "#a855f7", icon: "Newspaper"    },
  { id: 14, name: "Biography",          color: "#64748b", icon: "User"         },
  { id: 15, name: "Sports",             color: "#22c55e", icon: "Trophy"       },
];

// ─── PUBLISHERS ────────────────────────────────────────────
export const publishers = [
  { id: 1, name: "NCERT"                        },
  { id: 2, name: "S. Chand & Company"           },
  { id: 3, name: "Arihant Publications"         },
  { id: 4, name: "Oswaal Books"                 },
  { id: 5, name: "Dhanpat Rai & Sons"           },
  { id: 6, name: "Oxford University Press"      },
  { id: 7, name: "Pearson Education"            },
  { id: 8, name: "Rajpal & Sons"                },
  { id: 9, name: "Prabhat Prakashan"            },
  { id: 10, name: "Diamond Books"               },
];

// ─── BOOKS CATALOG ─────────────────────────────────────────
export const booksData = [
  {
    id: 1, bookId: "LIB-B-0001", title: "Mathematics Textbook Class X", author: "R.D. Sharma", publisher: "Dhanpat Rai & Sons", publisherId: 5, categoryId: 1, isbn: "978-81-89928-01-4", edition: "2024", language: "English", pages: 480, price: 320, rack: "A-01", shelf: "Top", totalCopies: 8, availableCopies: 5, issuedCopies: 3, lostCopies: 0, description: "Comprehensive mathematics textbook for Class X students covering all CBSE topics", coverColor: "#8b5cf6", addedOn: "2023-06-01", isActive: true,
  },
  {
    id: 2, bookId: "LIB-B-0002", title: "Science Textbook Class IX", author: "NCERT", publisher: "NCERT", publisherId: 1, categoryId: 2, isbn: "978-81-7450-634-1", edition: "2023", language: "English", pages: 320, price: 195, rack: "A-02", shelf: "Middle", totalCopies: 10, availableCopies: 8, issuedCopies: 2, lostCopies: 0, description: "NCERT Science textbook for Class IX as per latest syllabus", coverColor: "#10b981", addedOn: "2023-06-01", isActive: true,
  },
  {
    id: 3, bookId: "LIB-B-0003", title: "Wings of Fire", author: "A.P.J. Abdul Kalam", publisher: "Universities Press", publisherId: 6, categoryId: 14, isbn: "978-81-7371-146-6", edition: "2020", language: "English", pages: 196, price: 175, rack: "C-03", shelf: "Bottom", totalCopies: 5, availableCopies: 3, issuedCopies: 2, lostCopies: 0, description: "Autobiography of Dr. APJ Abdul Kalam, former President of India", coverColor: "#3b82f6", addedOn: "2023-07-10", isActive: true,
  },
  {
    id: 4, bookId: "LIB-B-0004", title: "Godan", author: "Munshi Premchand", publisher: "Rajpal & Sons", publisherId: 8, categoryId: 10, isbn: "978-81-7028-123-4", edition: "2021", language: "Hindi", pages: 352, price: 145, rack: "B-01", shelf: "Top", totalCopies: 4, availableCopies: 4, issuedCopies: 0, lostCopies: 0, description: "Classic Hindi novel by Munshi Premchand depicting rural India", coverColor: "#f97316", addedOn: "2023-07-15", isActive: true,
  },
  {
    id: 5, bookId: "LIB-B-0005", title: "Computer Science with Python", author: "Sumita Arora", publisher: "Dhanpat Rai & Sons", publisherId: 5, categoryId: 6, isbn: "978-81-89928-45-8", edition: "2024", language: "English", pages: 560, price: 450, rack: "D-01", shelf: "Top", totalCopies: 6, availableCopies: 4, issuedCopies: 2, lostCopies: 0, description: "Complete Python programming guide for Class XI-XII Computer Science", coverColor: "#06b6d4", addedOn: "2023-08-01", isActive: true,
  },
  {
    id: 6, bookId: "LIB-B-0006", title: "General Knowledge 2026", author: "Manohar Pandey", publisher: "Arihant Publications", publisherId: 3, categoryId: 7, isbn: "978-93-5158-123-5", edition: "2026", language: "English", pages: 840, price: 395, rack: "E-01", shelf: "Top", totalCopies: 3, availableCopies: 2, issuedCopies: 1, lostCopies: 0, description: "Comprehensive GK book covering current affairs, history, geography", coverColor: "#6366f1", addedOn: "2026-01-10", isActive: true,
  },
  {
    id: 7, bookId: "LIB-B-0007", title: "English Grammar & Composition", author: "S.C. Gupta", publisher: "S. Chand & Company", publisherId: 2, categoryId: 3, isbn: "978-81-219-0123-6", edition: "2022", language: "English", pages: 428, price: 285, rack: "A-03", shelf: "Middle", totalCopies: 7, availableCopies: 6, issuedCopies: 1, lostCopies: 0, description: "Complete English grammar guide for school and competitive exams", coverColor: "#3b82f6", addedOn: "2023-06-20", isActive: true,
  },
  {
    id: 8, bookId: "LIB-B-0008", title: "Bharat Ka Itihas", author: "Ram Sharan Sharma", publisher: "Prabhat Prakashan", publisherId: 9, categoryId: 5, isbn: "978-93-5048-234-7", edition: "2021", language: "Hindi", pages: 312, price: 220, rack: "B-02", shelf: "Middle", totalCopies: 5, availableCopies: 4, issuedCopies: 1, lostCopies: 0, description: "Ancient and medieval Indian history for competitive exams", coverColor: "#f59e0b", addedOn: "2023-09-05", isActive: true,
  },
  {
    id: 9, bookId: "LIB-B-0009", title: "Oxford Advanced Learner's Dictionary", author: "Oxford Press", publisher: "Oxford University Press", publisherId: 6, categoryId: 12, isbn: "978-01-9479-650-3", edition: "10th", language: "English", pages: 1952, price: 1200, rack: "F-01", shelf: "Bottom", totalCopies: 2, availableCopies: 1, issuedCopies: 1, lostCopies: 0, description: "Oxford Advanced Learner's Dictionary 10th Edition", coverColor: "#0ea5e9", addedOn: "2022-11-01", isActive: true,
  },
  {
    id: 10, bookId: "LIB-B-0010", title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperCollins", publisherId: 7, categoryId: 10, isbn: "978-00-6231-500-7", edition: "2014", language: "English", pages: 197, price: 250, rack: "C-01", shelf: "Top", totalCopies: 4, availableCopies: 3, issuedCopies: 1, lostCopies: 0, description: "Philosophical novel following a young Andalusian shepherd", coverColor: "#84cc16", addedOn: "2023-10-01", isActive: true,
  },
  {
    id: 11, bookId: "LIB-B-0011", title: "Vigyan Textbook Class VIII", author: "NCERT", publisher: "NCERT", publisherId: 1, categoryId: 2, isbn: "978-81-7450-578-8", edition: "2023", language: "Hindi", pages: 280, price: 145, rack: "A-02", shelf: "Bottom", totalCopies: 12, availableCopies: 10, issuedCopies: 2, lostCopies: 0, description: "NCERT Science textbook in Hindi for Class VIII", coverColor: "#10b981", addedOn: "2023-06-01", isActive: true,
  },
  {
    id: 12, bookId: "LIB-B-0012", title: "Chandrakanta", author: "Devaki Nandan Khatri", publisher: "Rajpal & Sons", publisherId: 8, categoryId: 10, isbn: "978-81-7028-456-3", edition: "2019", language: "Hindi", pages: 520, price: 180, rack: "C-02", shelf: "Top", totalCopies: 3, availableCopies: 3, issuedCopies: 0, lostCopies: 0, description: "Classic Hindi adventure novel by Devaki Nandan Khatri", coverColor: "#ec4899", addedOn: "2023-11-15", isActive: true,
  },
  {
    id: 13, bookId: "LIB-B-0013", title: "Pratiyogita Darpan", author: "Editorial Board", publisher: "Pratiyogita Darpan", publisherId: 10, categoryId: 13, isbn: "MAGAZINE-PD-2026", edition: "May 2026", language: "Hindi", pages: 196, price: 50, rack: "G-01", shelf: "Top", totalCopies: 5, availableCopies: 5, issuedCopies: 0, lostCopies: 0, description: "Monthly magazine for competitive exam preparation", coverColor: "#a855f7", addedOn: "2026-05-01", isActive: true,
  },
  {
    id: 14, bookId: "LIB-B-0014", title: "Encyclopaedia Britannica — Science", author: "Britannica", publisher: "Encyclopaedia Britannica", publisherId: 7, categoryId: 11, isbn: "978-15-9339-292-5", edition: "2020", language: "English", pages: 1200, price: 2500, rack: "F-02", shelf: "Bottom", totalCopies: 1, availableCopies: 1, issuedCopies: 0, lostCopies: 0, description: "Reference encyclopedia covering all science topics", coverColor: "#ef4444", addedOn: "2022-06-01", isActive: true,
  },
  {
    id: 15, bookId: "LIB-B-0015", title: "Sanskrit Vyakaran", author: "Pt. Kailash Nath", publisher: "Rajpal & Sons", publisherId: 8, categoryId: 8, isbn: "978-81-7028-789-2", edition: "2022", language: "Sanskrit/Hindi", pages: 256, price: 160, rack: "B-03", shelf: "Top", totalCopies: 4, availableCopies: 4, issuedCopies: 0, lostCopies: 0, description: "Complete Sanskrit grammar guide for school students", coverColor: "#ec4899", addedOn: "2023-07-01", isActive: true,
  },
];

// ─── LIBRARY MEMBERS ───────────────────────────────────────
export const libraryMembers = [
  { id: 1, memberId: "LIB-M-0001", memberType: "student", refId: 1, name: "Aaditya Kumar", classOrDesig: "Class I - A", mobile: "9876543210", maxBooksAllowed: 3, currentIssued: 2, joinDate: "2025-06-01", expiryDate: "2026-03-31", fineBalance: 0, isActive: true, avatar: "AK", avatarColor: "#3b82f6" },
  { id: 2, memberId: "LIB-M-0002", memberType: "student", refId: 2, name: "Priya Sharma", classOrDesig: "Class II - A", mobile: "9123456780", maxBooksAllowed: 3, currentIssued: 1, joinDate: "2025-06-01", expiryDate: "2026-03-31", fineBalance: 20, isActive: true, avatar: "PS", avatarColor: "#10b981" },
  { id: 3, memberId: "LIB-M-0003", memberType: "student", refId: 3, name: "Rahul Verma", classOrDesig: "Class IV - A", mobile: "8899001122", maxBooksAllowed: 3, currentIssued: 1, joinDate: "2025-06-01", expiryDate: "2026-03-31", fineBalance: 0, isActive: true, avatar: "RV", avatarColor: "#f97316" },
  { id: 4, memberId: "LIB-M-0004", memberType: "student", refId: 5, name: "Vikash Yadav", classOrDesig: "Class III - A", mobile: "9988776655", maxBooksAllowed: 3, currentIssued: 0, joinDate: "2025-06-01", expiryDate: "2026-03-31", fineBalance: 50, isActive: true, avatar: "VY", avatarColor: "#8b5cf6" },
  { id: 5, memberId: "LIB-M-0005", memberType: "student", refId: 6, name: "Anjali Tiwari", classOrDesig: "Class VI - A", mobile: "9871234560", maxBooksAllowed: 3, currentIssued: 2, joinDate: "2025-06-01", expiryDate: "2026-03-31", fineBalance: 0, isActive: true, avatar: "AT", avatarColor: "#ec4899" },
  { id: 6, memberId: "LIB-M-0006", memberType: "student", refId: 7, name: "Rohit Singh", classOrDesig: "Class VII - A", mobile: "9765432100", maxBooksAllowed: 3, currentIssued: 1, joinDate: "2025-06-01", expiryDate: "2026-03-31", fineBalance: 0, isActive: true, avatar: "RS", avatarColor: "#06b6d4" },
  { id: 7, memberId: "LIB-M-0007", memberType: "teacher", refId: 1, name: "Ramesh Kumar Sharma", classOrDesig: "TGT — Academic", mobile: "9876543210", maxBooksAllowed: 5, currentIssued: 1, joinDate: "2022-06-01", expiryDate: "2027-03-31", fineBalance: 0, isActive: true, avatar: "RK", avatarColor: "#3b82f6" },
  { id: 8, memberId: "LIB-M-0008", memberType: "teacher", refId: 3, name: "Sunil Kumar Sharma", classOrDesig: "PGT — Science", mobile: "9345678012", maxBooksAllowed: 5, currentIssued: 1, joinDate: "2022-06-01", expiryDate: "2027-03-31", fineBalance: 0, isActive: true, avatar: "SS", avatarColor: "#8b5cf6" },
];

// ─── BOOK ISSUE RECORDS ────────────────────────────────────
export const bookIssues = [
  { id: 1, issueId: "LIB-I-0001", bookId: 1, memberId: 1, issueDate: "2026-04-20", dueDate: "2026-05-04", returnDate: null, finePerDay: 2, fineAmount: 0, finePaid: false, status: "issued", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 2, issueId: "LIB-I-0002", bookId: 3, memberId: 1, issueDate: "2026-04-25", dueDate: "2026-05-09", returnDate: null, finePerDay: 2, fineAmount: 0, finePaid: false, status: "issued", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 3, issueId: "LIB-I-0003", bookId: 5, memberId: 2, issueDate: "2026-04-15", dueDate: "2026-04-29", returnDate: null, finePerDay: 2, fineAmount: 16, finePaid: false, status: "overdue", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 4, issueId: "LIB-I-0004", bookId: 7, memberId: 3, issueDate: "2026-05-01", dueDate: "2026-05-15", returnDate: null, finePerDay: 2, fineAmount: 0, finePaid: false, status: "issued", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 5, issueId: "LIB-I-0005", bookId: 6, memberId: 5, issueDate: "2026-04-28", dueDate: "2026-05-12", returnDate: null, finePerDay: 2, fineAmount: 0, finePaid: false, status: "issued", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 6, issueId: "LIB-I-0006", bookId: 10, memberId: 5, issueDate: "2026-05-01", dueDate: "2026-05-15", returnDate: null, finePerDay: 2, fineAmount: 0, finePaid: false, status: "issued", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 7, issueId: "LIB-I-0007", bookId: 9, memberId: 6, issueDate: "2026-04-10", dueDate: "2026-04-24", returnDate: null, finePerDay: 2, fineAmount: 24, finePaid: false, status: "overdue", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 8, issueId: "LIB-I-0008", bookId: 2, memberId: 7, issueDate: "2026-05-01", dueDate: "2026-05-29", returnDate: null, finePerDay: 2, fineAmount: 0, finePaid: false, status: "issued", issuedBy: "Admin", returnedTo: null, remarks: "Teacher reference copy" },
  { id: 9, issueId: "LIB-I-0009", bookId: 1, memberId: 8, issueDate: "2026-04-22", dueDate: "2026-05-20", returnDate: null, finePerDay: 2, fineAmount: 0, finePaid: false, status: "issued", issuedBy: "Admin", returnedTo: null, remarks: "" },
  { id: 10, issueId: "LIB-I-0010", bookId: 4, memberId: 1, issueDate: "2026-03-01", dueDate: "2026-03-15", returnDate: "2026-03-14", finePerDay: 2, fineAmount: 0, finePaid: true, status: "returned", issuedBy: "Admin", returnedTo: "Admin", remarks: "Returned in good condition" },
  { id: 11, issueId: "LIB-I-0011", bookId: 8, memberId: 4, issueDate: "2026-03-10", dueDate: "2026-03-24", returnDate: "2026-04-03", finePerDay: 2, fineAmount: 20, finePaid: true, status: "returned", issuedBy: "Admin", returnedTo: "Admin", remarks: "Fine collected ₹20" },
  { id: 12, issueId: "LIB-I-0012", bookId: 11, memberId: 2, issueDate: "2026-02-15", dueDate: "2026-03-01", returnDate: "2026-02-28", finePerDay: 2, fineAmount: 0, finePaid: false, status: "returned", issuedBy: "Admin", returnedTo: "Admin", remarks: "" },
];

// ─── LIBRARY SETTINGS ──────────────────────────────────────
export const librarySettings = {
  issueDurationStudent: 14,
  issueDurationTeacher: 28,
  finePerDay: 2,
  graceDays: 0,
  maxBooksStudent: 3,
  maxBooksTeacher: 5,
  renewalAllowed: true,
  maxRenewals: 1,
  renewalDays: 7,
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
