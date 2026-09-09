/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Faculty, UserAccount } from './types';
import { loadStudents, saveStudents, loadFaculties, resetToInitialData } from './lib/storage';
import { DEMO_USERS } from './data/authData';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { StudentList } from './components/StudentList';
import { StudentDetailModal } from './components/StudentDetailModal';
import { GradebookModal } from './components/GradebookModal';
import { StudentCardModal } from './components/StudentCardModal';
import { AddEditStudentModal } from './components/AddEditStudentModal';
import { AttendanceManager } from './components/AttendanceManager';
import { TuitionManager } from './components/TuitionManager';
import { AIAssistantModal } from './components/AIAssistantModal';
import { TeacherWorkspace } from './components/TeacherWorkspace';
import { LoginModal } from './components/LoginModal';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [activeTab, setActiveTab] = useState<string>('teacher-workspace');

  // Auth state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('vietduc_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default to first teacher for instant exploration
    const { password: _, ...defaultTeacher } = DEMO_USERS[0];
    return defaultTeacher;
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Modals state
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [selectedStudentGrades, setSelectedStudentGrades] = useState<Student | null>(null);
  const [selectedStudentCard, setSelectedStudentCard] = useState<Student | null>(null);
  const [selectedStudentAI, setSelectedStudentAI] = useState<Student | null>(null);
  
  // Add/Edit modal state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedStudents = loadStudents();
    const loadedFaculties = loadFaculties();
    setStudents(loadedStudents);
    setFaculties(loadedFaculties);
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('vietduc_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    if (user.role === 'teacher') {
      setActiveTab('teacher-workspace');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vietduc_current_user');
    } catch (e) {
      console.error(e);
    }
    setActiveTab('dashboard');
  };

  // Save changes to storage
  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    saveStudents(updated);

    // Update active modal objects if open
    if (selectedStudentDetail?.id === updatedStudent.id) setSelectedStudentDetail(updatedStudent);
    if (selectedStudentGrades?.id === updatedStudent.id) setSelectedStudentGrades(updatedStudent);
    if (selectedStudentCard?.id === updatedStudent.id) setSelectedStudentCard(updatedStudent);
    if (selectedStudentAI?.id === updatedStudent.id) setSelectedStudentAI(updatedStudent);
  };

  const handleSaveStudent = (studentData: Student) => {
    let updated: Student[];
    const exists = students.some(s => s.id === studentData.id);
    if (exists) {
      updated = students.map(s => s.id === studentData.id ? studentData : s);
    } else {
      updated = [studentData, ...students];
    }
    setStudents(updated);
    saveStudents(updated);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updated = students.filter(s => s.id !== studentId);
    setStudents(updated);
    saveStudents(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu sinh viên mẫu gốc của Trường Cao đẳng Việt Đức?')) {
      const initial = resetToInitialData();
      setStudents(initial);
    }
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsAddEditOpen(true);
  };

  const handleOpenAIWithStudent = (student: Student) => {
    setSelectedStudentAI(student);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* App Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onResetData={handleResetData}
        totalStudents={students.length}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 0: Teacher Workspace */}
        {activeTab === 'teacher-workspace' && currentUser && currentUser.role === 'teacher' && (
          <TeacherWorkspace
            currentUser={currentUser}
            students={students}
            faculties={faculties}
            onUpdateStudent={handleUpdateStudent}
            onSelectStudent={student => setSelectedStudentDetail(student)}
            onOpenGradesModal={student => setSelectedStudentGrades(student)}
            onOpenAIModal={handleOpenAIWithStudent}
          />
        )}

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DashboardStats
            students={students}
            faculties={faculties}
            onSelectStudent={student => setSelectedStudentDetail(student)}
            onNavigateToTab={tab => setActiveTab(tab)}
          />
        )}

        {/* Tab 2: Students List */}
        {activeTab === 'students' && (
          <StudentList
            students={students}
            faculties={faculties}
            onSelectStudent={student => setSelectedStudentDetail(student)}
            onOpenEditModal={handleOpenEditModal}
            onOpenGradesModal={student => setSelectedStudentGrades(student)}
            onOpenCardModal={student => setSelectedStudentCard(student)}
            onOpenAIModal={handleOpenAIWithStudent}
            onDeleteStudent={handleDeleteStudent}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {/* Tab 3: Grades & Transcript */}
        {activeTab === 'grades' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Quản Lý Bảng Điểm & Học Bạ Tín Chỉ
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn sinh viên để nhập điểm thi giữa kỳ, cuối kỳ và xem quy đổi điểm hệ 4, hệ chữ (A, B+, B, C, D, F).
                </p>
              </div>
            </div>

            <StudentList
              students={students}
              faculties={faculties}
              onSelectStudent={student => setSelectedStudentGrades(student)}
              onOpenEditModal={handleOpenEditModal}
              onOpenGradesModal={student => setSelectedStudentGrades(student)}
              onOpenCardModal={student => setSelectedStudentCard(student)}
              onOpenAIModal={handleOpenAIWithStudent}
              onDeleteStudent={handleDeleteStudent}
              onOpenAddModal={handleOpenAddModal}
            />
          </div>
        )}

        {/* Tab 4: Attendance */}
        {activeTab === 'attendance' && (
          <AttendanceManager
            students={students}
            faculties={faculties}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {/* Tab 5: Tuition & Decree 81 */}
        {activeTab === 'tuition' && (
          <TuitionManager
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {/* Tab 6: AI Assistant */}
        {activeTab === 'ai' && (
          <AIAssistantModal
            students={students}
            selectedStudent={selectedStudentAI || students[0] || null}
            onSelectStudent={s => setSelectedStudentAI(s)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-white text-xs">
              VĐ
            </div>
            <div>
              <p className="font-bold text-white text-xs">
                TRƯỜNG CAO ĐẲNG Y TẾ VÀ TRANG THIẾT BỊ VIỆT ĐỨC
              </p>
              <p className="text-[11px] text-slate-500">
                Đối tác đào tạo nghề chuẩn CHLB Đức (DIHK & AHK) • Hệ thống quản lý học vụ số 4.0
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Sông Công, Thái Nguyên</span>
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>(0208) 3862 123</span>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>vietduc.edu.vn</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {selectedStudentDetail && (
        <StudentDetailModal
          student={selectedStudentDetail}
          onClose={() => setSelectedStudentDetail(null)}
          onOpenCardModal={s => {
            setSelectedStudentDetail(null);
            setSelectedStudentCard(s);
          }}
          onOpenAIModal={s => {
            setSelectedStudentDetail(null);
            handleOpenAIWithStudent(s);
          }}
          onOpenGradesModal={s => {
            setSelectedStudentDetail(null);
            setSelectedStudentGrades(s);
          }}
        />
      )}

      {selectedStudentGrades && (
        <GradebookModal
          student={selectedStudentGrades}
          onClose={() => setSelectedStudentGrades(null)}
          onUpdateStudent={handleUpdateStudent}
        />
      )}

      {selectedStudentCard && (
        <StudentCardModal
          student={selectedStudentCard}
          onClose={() => setSelectedStudentCard(null)}
        />
      )}

      {isAddEditOpen && (
        <AddEditStudentModal
          isOpen={isAddEditOpen}
          student={editingStudent}
          faculties={faculties}
          onClose={() => setIsAddEditOpen(false)}
          onSave={handleSaveStudent}
        />
      )}
    </div>
  );
}
