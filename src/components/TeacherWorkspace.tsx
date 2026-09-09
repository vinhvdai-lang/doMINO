import React, { useState } from 'react';
import { 
  UserAccount, 
  Student, 
  Faculty, 
  ScheduleItem, 
  ClassAnnouncement,
  SubjectGrade 
} from '../types';
import { INITIAL_SCHEDULES, INITIAL_ANNOUNCEMENTS } from '../data/authData';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  GraduationCap, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  Plus, 
  Send, 
  Clock, 
  MapPin, 
  BookOpen, 
  FileText,
  Award,
  Phone,
  Printer
} from 'lucide-react';

interface TeacherWorkspaceProps {
  currentUser: UserAccount;
  students: Student[];
  faculties: Faculty[];
  onUpdateStudent: (updatedStudent: Student) => void;
  onSelectStudent: (student: Student) => void;
  onOpenGradesModal: (student: Student) => void;
  onOpenAIModal: (student: Student) => void;
}

export const TeacherWorkspace: React.FC<TeacherWorkspaceProps> = ({
  currentUser,
  students,
  faculties,
  onUpdateStudent,
  onSelectStudent,
  onOpenGradesModal,
  onOpenAIModal
}) => {
  const [activeSection, setActiveSection] = useState<'class' | 'grading' | 'schedule' | 'announcements'>('class');

  // Homeroom class of teacher
  const homeroomClass = currentUser.homeroomClass || 'CĐ-CK23A';
  const homeroomStudents = students.filter(s => s.className === homeroomClass);

  // Teaching subjects
  const teachingSubjects = currentUser.teachingSubjects || [
    'Gia công Phay - Tiện CNC tiêu chuẩn Đức (CK202)',
    'Vẽ kỹ thuật cơ khí & SolidWorks (CK101)'
  ];
  const [selectedSubject, setSelectedSubject] = useState(teachingSubjects[0]);

  // Schedules and announcements
  const [schedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES[currentUser.id] || INITIAL_SCHEDULES['GV-CK-01']);
  const [announcements, setAnnouncements] = useState<ClassAnnouncement[]>(
    INITIAL_ANNOUNCEMENTS.filter(a => a.className === homeroomClass)
  );

  // New announcement form
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceContent, setNewAnnounceContent] = useState('');
  const [newAnnouncePriority, setNewAnnouncePriority] = useState<'high' | 'normal'>('normal');

  // Fast grading state for selected subject: mapping studentId -> { attendance, midterm, final }
  const [gradesDraft, setGradesDraft] = useState<Record<string, { attendance: number; midterm: number; final: number }>>(() => {
    const draft: Record<string, { attendance: number; midterm: number; final: number }> = {};
    homeroomStudents.forEach(s => {
      const existing = s.grades.find(g => selectedSubject.includes(g.name) || selectedSubject.includes(g.code));
      if (existing) {
        draft[s.id] = {
          attendance: existing.attendanceScore,
          midterm: existing.midtermScore,
          final: existing.finalScore
        };
      } else {
        draft[s.id] = { attendance: 10, midterm: 8.0, final: 8.5 };
      }
    });
    return draft;
  });

  // Calculate score helper
  const calculateTotal = (att: number, mid: number, fin: number) => {
    const score10 = Math.round((att * 0.1 + mid * 0.3 + fin * 0.6) * 10) / 10;
    let score4 = 0;
    let letter: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' = 'F';

    if (score10 >= 8.5) { score4 = 4.0; letter = 'A'; }
    else if (score10 >= 8.0) { score4 = 3.5; letter = 'B+'; }
    else if (score10 >= 7.0) { score4 = 3.0; letter = 'B'; }
    else if (score10 >= 6.5) { score4 = 2.5; letter = 'C+'; }
    else if (score10 >= 5.5) { score4 = 2.0; letter = 'C'; }
    else if (score10 >= 4.0) { score4 = 1.0; letter = 'D'; }
    else { score4 = 0; letter = 'F'; }

    return { score10, score4, letter };
  };

  const handleGradeChange = (studentId: string, field: 'attendance' | 'midterm' | 'final', value: number) => {
    setGradesDraft(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { attendance: 10, midterm: 8, final: 8 }),
        [field]: Number(value)
      }
    }));
  };

  const handleSaveAllGrades = () => {
    let count = 0;
    homeroomStudents.forEach(student => {
      const draft = gradesDraft[student.id];
      if (draft) {
        const { score10, score4, letter } = calculateTotal(draft.attendance, draft.midterm, draft.final);
        
        // Extract subject code and name
        const match = selectedSubject.match(/(.*?)\s*\((.*?)\)/);
        const name = match ? match[1].trim() : selectedSubject;
        const code = match ? match[2].trim() : 'MOD-' + Math.floor(100 + Math.random() * 900);

        const newGrade: SubjectGrade = {
          code,
          name,
          credits: 4,
          attendanceScore: draft.attendance,
          midtermScore: draft.midterm,
          finalScore: draft.final,
          totalScore10: score10,
          totalScore4: score4,
          letterGrade: letter,
          semester: 'Kỳ 1 (2024-2025)'
        };

        const existingGrades = student.grades.filter(g => g.code !== code && g.name !== name);
        const updatedGrades = [...existingGrades, newGrade];

        // Recalculate GPA
        const totalCredits = updatedGrades.reduce((a, b) => a + b.credits, 0);
        const sumScore10 = updatedGrades.reduce((a, b) => a + b.totalScore10 * b.credits, 0);
        const sumScore4 = updatedGrades.reduce((a, b) => a + b.totalScore4 * b.credits, 0);
        const gpa10 = Math.round((sumScore10 / totalCredits) * 100) / 100;
        const gpa4 = Math.round((sumScore4 / totalCredits) * 100) / 100;

        let rank: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' = 'Khá';
        if (gpa10 >= 9.0) rank = 'Xuất sắc';
        else if (gpa10 >= 8.0) rank = 'Giỏi';
        else if (gpa10 >= 7.0) rank = 'Khá';
        else if (gpa10 >= 5.0) rank = 'Trung bình';
        else rank = 'Yếu';

        onUpdateStudent({
          ...student,
          grades: updatedGrades,
          gpa10,
          gpa4,
          academicRank: rank,
          creditsEarned: totalCredits
        });
        count++;
      }
    });

    alert(`Đã lưu thành công bảng điểm môn "${selectedSubject}" cho ${count} sinh viên lớp ${homeroomClass}!`);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnounceTitle.trim() || !newAnnounceContent.trim()) return;

    const newAnnouncement: ClassAnnouncement = {
      id: 'TB-' + Date.now(),
      title: newAnnounceTitle.trim(),
      content: newAnnounceContent.trim(),
      date: new Date().toISOString().slice(0, 10),
      className: homeroomClass,
      teacherName: currentUser.name,
      priority: newAnnouncePriority
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setNewAnnounceTitle('');
    setNewAnnounceContent('');
    alert(`Đã gửi thông báo đến sinh viên lớp ${homeroomClass}!`);
  };

  // Class KPI calculations
  const classTotal = homeroomStudents.length;
  const classAvgGPA = classTotal > 0 
    ? (homeroomStudents.reduce((a, b) => a + b.gpa10, 0) / classTotal).toFixed(2)
    : '0.00';
  const classWarnings = homeroomStudents.filter(s => s.status === 'Cảnh cáo học vụ' || s.gpa10 < 5.5).length;
  const classPolicyCount = homeroomStudents.filter(s => s.policyCategory && s.policyCategory !== 'Không').length;

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-blue-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold">{currentUser.name}</h1>
                <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Giảng Viên Chính
                </span>
                <span className="text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Lớp CN: {homeroomClass}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{currentUser.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{currentUser.email}</span>
                {currentUser.phone && (
                  <>
                    <span>•</span>
                    <span>SĐT: {currentUser.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Homeroom quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/60 p-3 rounded-xl border border-blue-500/20 text-xs text-center">
            <div className="p-1">
              <span className="text-[10px] text-slate-400 block">Sĩ số lớp CN</span>
              <strong className="text-base font-bold text-white">{classTotal} SV</strong>
            </div>
            <div className="p-1">
              <span className="text-[10px] text-slate-400 block">GPA Bình quân</span>
              <strong className="text-base font-bold text-amber-400">{classAvgGPA}</strong>
            </div>
            <div className="p-1">
              <span className="text-[10px] text-slate-400 block">Cảnh báo học vụ</span>
              <strong className={`text-base font-bold ${classWarnings > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {classWarnings} SV
              </strong>
            </div>
            <div className="p-1">
              <span className="text-[10px] text-slate-400 block">Hưởng NĐ 81</span>
              <strong className="text-base font-bold text-purple-300">{classPolicyCount} SV</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Workspace Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm flex space-x-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSection('class')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeSection === 'class'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Lớp Chủ Nhiệm ({homeroomClass})</span>
        </button>

        <button
          onClick={() => setActiveSection('grading')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeSection === 'grading'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>2. Sổ Nhập Điểm Môn Học Nhanh</span>
        </button>

        <button
          onClick={() => setActiveSection('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeSection === 'schedule'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>3. Thời Khóa Biểu & Lịch Xưởng Đức</span>
        </button>

        <button
          onClick={() => setActiveSection('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeSection === 'announcements'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>4. Thông Báo & Dặn Dò Lớp Học</span>
        </button>
      </div>

      {/* SECTION 1: Homeroom Class */}
      {activeSection === 'class' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">
                Danh Sách Sinh Viên Lớp Chủ Nhiệm {homeroomClass}
              </h2>
              <p className="text-slate-500">
                Theo dõi hạnh kiểm, kết quả học tập và nhận xét sổ liên lạc định kỳ cho sinh viên.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In danh sách lớp CN</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Sinh viên</th>
                    <th className="py-3 px-3">Chuyên ngành</th>
                    <th className="py-3 px-3 text-center">GPA (Hệ 10)</th>
                    <th className="py-3 px-3 text-center">Điểm rèn luyện</th>
                    <th className="py-3 px-3 text-center">Tỷ lệ vắng</th>
                    <th className="py-3 px-3">Chế độ NĐ 81</th>
                    <th className="py-3 px-4 text-right">Hành động của GVCN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {homeroomStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Chưa có dữ liệu sinh viên cho lớp {homeroomClass}.
                      </td>
                    </tr>
                  ) : (
                    homeroomStudents.map(student => {
                      const isWarned = student.status === 'Cảnh cáo học vụ' || student.gpa10 < 5.5;
                      const isHighAbsence = (student.attendanceSummary?.absentPercentage || 0) > 15;

                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={student.avatar}
                                alt={student.fullName}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{student.fullName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">
                                  {student.id} • {student.phone}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <p className="font-medium text-slate-800 text-[11px]">{student.major}</p>
                            <p className="text-[10px] text-slate-500">{student.cohort}</p>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-slate-900 text-xs">{student.gpa10}</span>
                            <span className={`text-[10px] block font-semibold ${
                              student.academicRank === 'Xuất sắc' ? 'text-emerald-600' :
                              student.academicRank === 'Giỏi' ? 'text-blue-600' :
                              student.academicRank === 'Khá' ? 'text-indigo-600' :
                              student.academicRank === 'Trung bình' ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {student.academicRank}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-emerald-700">{student.conductScore}/100</span>
                            <span className="text-[10px] text-slate-400 block">{student.conductRank}</span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`font-semibold ${isHighAbsence ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                              {student.attendanceSummary?.absentPercentage || 0}%
                            </span>
                            {isHighAbsence && (
                              <span className="block text-[9px] text-red-500 font-semibold">Cần nhắc nhở</span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded block truncate max-w-[160px]">
                              {student.policyCategory}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => onSelectStudent(student)}
                                className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
                              >
                                Xem hồ sơ
                              </button>

                              <button
                                onClick={() => onOpenGradesModal(student)}
                                className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors"
                              >
                                Học bạ
                              </button>

                              <button
                                onClick={() => onOpenAIModal(student)}
                                className="px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI Nhận xét</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Fast Grade Entry Grid */}
      {activeSection === 'grading' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Bảng Nhập Điểm Môn Học / Mô-đun Đào Tạo</span>
              </h2>
              <p className="text-slate-500">
                Nhập điểm chuyên cần xưởng, kiểm tra kỹ năng và thi kết thúc môn. Tự động tính điểm hệ 10, hệ 4 và xếp loại.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Chọn môn giảng dạy:</span>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium text-xs focus:ring-1 focus:ring-blue-500"
                >
                  {teachingSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveAllGrades}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Toàn Bộ Điểm</span>
              </button>
            </div>
          </div>

          {/* Grade Entry Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">STT & Sinh viên</th>
                    <th className="py-3 px-3 text-center">Chuyên cần (10%)</th>
                    <th className="py-3 px-3 text-center">Kiểm tra thực hành (30%)</th>
                    <th className="py-3 px-3 text-center">Thi kết thúc môn (60%)</th>
                    <th className="py-3 px-3 text-center">Điểm tổng kết (Hệ 10)</th>
                    <th className="py-3 px-3 text-center">Hệ 4</th>
                    <th className="py-3 px-3 text-center">Điểm chữ</th>
                    <th className="py-3 px-4 text-center">Trạng thái môn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {homeroomStudents.map((student, idx) => {
                    const draft = gradesDraft[student.id] || { attendance: 10, midterm: 8.0, final: 8.5 };
                    const { score10, score4, letter } = calculateTotal(draft.attendance, draft.midterm, draft.final);
                    const isPassed = score10 >= 4.0;

                    return (
                      <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-slate-400 font-mono w-5">{idx + 1}.</span>
                            <div>
                              <p className="font-bold text-slate-900">{student.fullName}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{student.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Attendance 10% */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={draft.attendance}
                            onChange={e => handleGradeChange(student.id, 'attendance', Number(e.target.value))}
                            className="w-16 px-2 py-1 text-center font-semibold rounded border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* Midterm 30% */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={draft.midterm}
                            onChange={e => handleGradeChange(student.id, 'midterm', Number(e.target.value))}
                            className="w-16 px-2 py-1 text-center font-semibold rounded border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* Final Exam 60% */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={draft.final}
                            onChange={e => handleGradeChange(student.id, 'final', Number(e.target.value))}
                            className="w-16 px-2 py-1 text-center font-semibold rounded border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* Calculated 10 */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-sm text-slate-900">{score10}</span>
                        </td>

                        {/* Calculated 4 */}
                        <td className="py-3 px-3 text-center font-mono font-semibold text-blue-700">
                          {score4}
                        </td>

                        {/* Letter */}
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            letter === 'A' ? 'bg-emerald-100 text-emerald-800' :
                            letter.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            letter.startsWith('C') ? 'bg-indigo-100 text-indigo-800' :
                            letter === 'D' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {letter}
                          </span>
                        </td>

                        {/* Pass / Fail */}
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            <span>{isPassed ? 'Đạt' : 'Thi lại'}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Schedule */}
      {activeSection === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between text-xs">
            <div>
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Thời Khóa Biểu Giảng Dạy & Lịch Trực Xưởng Tuần Này</span>
              </h2>
              <p className="text-slate-500">Áp dụng cho học kỳ 1 năm học 2024 - 2025</p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In thời khóa biểu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map(sch => (
              <div key={sch.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-blue-700 text-sm bg-blue-50 px-2.5 py-1 rounded-lg">
                    {sch.dayOfWeek}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sch.timeSlot}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{sch.subjectName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mã môn: <span className="font-mono text-slate-700 font-semibold">{sch.subjectCode}</span> • Lớp: <span className="font-semibold text-blue-600">{sch.className}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{sch.room}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sch.type === 'Thực hành xưởng' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {sch.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Announcements */}
      {activeSection === 'announcements' && (
        <div className="space-y-4">
          {/* Post New Announcement Form */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Đăng Thông Báo & Dặn Dò Mới Cho Lớp {homeroomClass}</span>
            </h2>

            <form onSubmit={handleAddAnnouncement} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Lịch thi tay nghề thực hành xưởng CNC, hạn nộp học phí..."
                  value={newAnnounceTitle}
                  onChange={e => setNewAnnounceTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung thông báo chi tiết *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Dặn dò sinh viên về trang thiết bị bảo hộ, thời gian có mặt, tài liệu ôn thi..."
                  value={newAnnounceContent}
                  onChange={e => setNewAnnounceContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600">Mức độ ưu tiên:</span>
                  <select
                    value={newAnnouncePriority}
                    onChange={e => setNewAnnouncePriority(e.target.value as 'high' | 'normal')}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="high">Khẩn cấp / Quan trọng</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Phát hành thông báo</span>
                </button>
              </div>
            </form>
          </div>

          {/* Published Announcements List */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Các thông báo đã gửi ({announcements.length})
            </h3>

            {announcements.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    {item.priority === 'high' && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Quan trọng
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px]">{item.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{item.content}</p>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Gửi tới: <strong className="text-slate-700">Lớp {item.className}</strong></span>
                  <span>Người gửi: <strong className="text-slate-700">{item.teacherName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
