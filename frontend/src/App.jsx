import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UnderConstruction from './components/UnderConstruction';

/* Admission Module */
import AdmissionList   from './pages/admission/AdmissionList';
import AdmissionForm   from './pages/admission/AdmissionForm';
import StudentProfile  from './pages/admission/StudentProfile';

/* Fees Module */
import FeesSetup       from './pages/fees/FeesSetup';
import FeesCollection  from './pages/fees/FeesCollection';
import PreviousDues    from './pages/fees/PreviousDues';
import DemandBill      from './pages/fees/DemandBill';
import OtherFees       from './pages/fees/OtherFees';

/* Examination Module */
import ExamDashboard   from './pages/examination/ExamDashboard';
import ExamCreate      from './pages/examination/ExamCreate';
import MarksEntry      from './pages/examination/MarksEntry';
import MarksStatus     from './pages/examination/MarksStatus';
import ReportCard      from './pages/examination/ReportCard';
import ResultAnalysis  from './pages/examination/ResultAnalysis';
import AdmitCard       from './pages/examination/AdmitCard';

/* Subject Master & Routine Modules */
import SubjectMaster   from './pages/modules/SubjectMaster';
import Routine         from './pages/modules/Routine';

/* Teacher Management Module */
import Teacher         from './pages/modules/Teacher';
import TeacherForm     from './pages/modules/TeacherForm';
import TeacherProfile  from './pages/modules/TeacherProfile';
import Payroll         from './pages/modules/Payroll';
import PayrollAdvance  from './pages/modules/PayrollAdvance';
import PayrollReports  from './pages/modules/PayrollReports';

/* Library Management Module */
import Library from './pages/modules/Library';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* ── Admission Module ── */}
            <Route path="admission"              element={<AdmissionList />} />
            <Route path="admission/new"          element={<AdmissionForm />} />
            <Route path="admission/form-sale"    element={<UnderConstruction moduleName="Form Sale" />} />
            <Route path="admission/boarding"     element={<UnderConstruction moduleName="Map Boarding with Lunch" />} />
            <Route path="admission/transfer"     element={<UnderConstruction moduleName="Transfer Students in New Year" />} />
            <Route path="admission/:id"          element={<StudentProfile />} />
            <Route path="admission/:id/edit" element={<AdmissionForm />} />

            {/* ── Fees Module ── */}
            <Route path="fees/setup"         element={<FeesSetup />} />
            <Route path="fees/collection"    element={<FeesCollection />} />
            <Route path="fees/previous-dues" element={<PreviousDues />} />
            <Route path="fees/demand-bill"   element={<DemandBill />} />
            <Route path="fees/other"         element={<OtherFees />} />

            {/* ── Other modules (under construction) ── */}
            <Route path="front-office"        element={<UnderConstruction moduleName="Front Office" />} />
            <Route path="master-setup"        element={<UnderConstruction moduleName="Master Setup" />} />
            <Route path="scholarship"         element={<UnderConstruction moduleName="Scholarship" />} />
            <Route path="user-permissions"    element={<UnderConstruction moduleName="User Permissions" />} />
            <Route path="reports"             element={<UnderConstruction moduleName="Reports" />} />
            <Route path="account"             element={<UnderConstruction moduleName="Account" />} />
            <Route path="subject-master"      element={<SubjectMaster />} />
            
            {/* ── Library Management ── */}
            <Route path="library"             element={<Library />} />
            <Route path="library/issue"       element={<Library defaultTab="issue" />} />
            <Route path="library/return"      element={<Library defaultTab="return" />} />

            <Route path="teacher"             element={<Teacher />} />
            <Route path="teacher/new"         element={<TeacherForm />} />
            <Route path="teacher/edit/:id"    element={<TeacherForm />} />
            <Route path="teacher/:id"         element={<TeacherProfile />} />
            <Route path="routine"             element={<Routine />} />
            {/* ── Examination Module ── */}
            <Route path="examination"                  element={<ExamDashboard />} />
            <Route path="examination/create"           element={<ExamCreate />} />
            <Route path="examination/:id/edit"         element={<ExamCreate />} />
            <Route path="examination/marks"            element={<MarksEntry />} />
            <Route path="examination/marks/status"     element={<MarksStatus />} />
            <Route path="examination/reportcard"       element={<ReportCard />} />
            <Route path="examination/analysis"         element={<ResultAnalysis />} />
            <Route path="examination/admitcard"        element={<AdmitCard />} />
            <Route path="transportation"      element={<UnderConstruction moduleName="Transportation" />} />
            <Route path="payroll"             element={<Payroll />} />
            <Route path="payroll/advance"     element={<PayrollAdvance />} />
            <Route path="payroll/reports"     element={<PayrollReports />} />
            {/* Library routes handled above */}
            <Route path="online-registration" element={<UnderConstruction moduleName="Online Registration" />} />
            <Route path="lms"                 element={<UnderConstruction moduleName="LMS Management" />} />
            <Route path="sale-purchase"       element={<UnderConstruction moduleName="Sale & Purchase" />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
