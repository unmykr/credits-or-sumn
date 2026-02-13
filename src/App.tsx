import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import About from '@/pages/About';
import Credits from '@/pages/Credits.tsx'; // <-- 1. Added Credits import

// main pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// student
import StudentLogin from "./pages/students/StudentLogin";
import StudentDashboard from "./pages/students/StudentDashboard";
import StudentGrades from "./pages/students/StudentGrades";
import StudentComplaints from "./pages/students/StudentComplaints";
import NewComplaint from "./pages/students/NewComplaint";
import StudentFinalGrades from "./pages/students/StudentFinalGrades";

// teacher
import TeacherLogin from "./pages/teachers/TeacherLogin";
import TeacherDashboard from "./pages/teachers/TeacherDashboard";
import TeacherManual from "./pages/TeacherManual";
import AddGrades from "./pages/teachers/AddGrades";
import Grades from "./pages/teachers/TeachersGrades";
import EditGrade from "./pages/teachers/Edit";
import AddFinalGrades from "./pages/teachers/AddFinalGrades";

// administration
import AdminLogin from "./pages/administration/AdminLogin";
import AdminDashboard from "./pages/administration/AdminDashboard";
import AdminSuggestions from "./pages/administration/AdminSuggestions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              {/* h */}
              <Route path="/" element={<Index />} />
              
              {/* sp */}
              <Route path="/students" element={<StudentLogin />} />
              <Route path="/students/dashboard" element={<StudentDashboard />} />
              <Route path="/students/grades" element={<StudentGrades />} />
              <Route path="/students/complaints" element={<StudentComplaints />} />
              <Route path="/students/complaints/new" element={<NewComplaint />} />
              <Route path="/students/final-grades" element={<StudentFinalGrades />} />
              
              {/* tp */}
              <Route path="/teachers" element={<TeacherLogin />} />
              <Route path="/teachers/dashboard" element={<TeacherDashboard />} />
              <Route path="/manual/teacher" element={<TeacherManual />} />
              <Route path="/teachers/grades/add" element={<AddGrades />} />
              <Route path="/teachers/grades" element={<Grades />} />
              <Route path="/teachers/grades/edit/:id" element={<EditGrade />} />
              <Route path="/teachers/AddFinalGrades" element={<AddFinalGrades />} />

              {/* ap */}
              <Route path="/administration" element={<AdminLogin />} />
              <Route path="/administration/dashboard" element={<AdminDashboard />} />
              <Route path="/administration/suggestions" element={<AdminSuggestions />} />

              {/* general pages */}
              <Route path="/about" element={<About />} />
              <Route path="/credits" element={<Credits />} /> {/* <-- 2. Added Credits route */}
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;