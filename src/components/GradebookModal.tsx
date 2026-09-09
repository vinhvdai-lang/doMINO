import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Printer, 
  Check, 
  Calculator,
  Award,
  BookOpen
} from 'lucide-react';
import { Student, SubjectGrade } from '../types';

interface GradebookModalProps {
  student: Student | null;
  onClose: () => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const GradebookModal: React.FC<GradebookModalProps> = ({
  student,
  onClose,
  onUpdateStudent
}) => {
  if (!student) return null;

  const [grades, setGrades] = useState<SubjectGrade[]>(student.grades || []);
  const [showAddForm, setShowAddForm] = useState(false);

  // New subject state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newAttendance, setNewAttendance] = useState(10);
  const [newMidterm, setNewMidterm] = useState(8);
  const [newFinal, setNewFinal] = useState(8.5);
  const [newSemester, setNewSemester] = useState('Kỳ 1 (2024-2025)');

  // Calculate score helper
  const calculateTotal = (att: number, mid: number, fin: number) => {
    // 10% attendance, 30% midterm, 60% final exam
    const score10 = Math.round((att * 0.1 + mid * 0.3 + fin * 0.6) * 10) / 10;
    let score4 = 0;
    let letter: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' = 'F';

    if (score10 >= 8.5) {
      score4 = 4.0;
      letter = 'A';
    } else if (score10 >= 8.0) {
      score4 = 3.5;
      letter = 'B+';
    } else if (score10 >= 7.0) {
      score4 = 3.0;
      letter = 'B';
    } else if (score10 >= 6.5) {
      score4 = 2.5;
      letter = 'C+';
    } else if (score10 >= 5.5) {
      score4 = 2.0;
      letter = 'C';
    } else if (score10 >= 4.0) {
      score4 = 1.0;
      letter = 'D';
    } else {
      score4 = 0;
      letter = 'F';
    }

    return { score10, score4, letter };
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    const { score10, score4, letter } = calculateTotal(newAttendance, newMidterm, newFinal);

    const newSubject: SubjectGrade = {
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      credits: Number(newCredits),
      attendanceScore: Number(newAttendance),
      midtermScore: Number(newMidterm),
      finalScore: Number(newFinal),
      totalScore10: score10,
      totalScore4: score4,
      letterGrade: letter,
      semester: newSemester
    };

    const updatedGrades = [...grades, newSubject];
    setGrades(updatedGrades);

    // Recalculate student GPA
    recalculateAndUpdateStudent(updatedGrades);

    // Reset form
    setNewCode('');
    setNewName('');
    setShowAddForm(false);
  };

  const handleDeleteSubject = (code: string) => {
    const updatedGrades = grades.filter(g => g.code !== code);
    setGrades(updatedGrades);
    recalculateAndUpdateStudent(updatedGrades);
  };

  const recalculateAndUpdateStudent = (currentGrades: SubjectGrade[]) => {
    if (currentGrades.length === 0) {
      onUpdateStudent({
        ...student,
        grades: [],
        gpa10: 0,
        gpa4: 0,
        academicRank: 'Yếu'
      });
      return;
    }

    const totalCredits = currentGrades.reduce((acc, g) => acc + g.credits, 0);
    const sumScore10 = currentGrades.reduce((acc, g) => acc + g.totalScore10 * g.credits, 0);
    const sumScore4 = currentGrades.reduce((acc, g) => acc + g.totalScore4 * g.credits, 0);

    const gpa10 = Math.round((sumScore10 / totalCredits) * 100) / 100;
    const gpa4 = Math.round((sumScore4 / totalCredits) * 100) / 100;

    let rank: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' = 'Trung bình';
    if (gpa10 >= 9.0) rank = 'Xuất sắc';
    else if (gpa10 >= 8.0) rank = 'Giỏi';
    else if (gpa10 >= 7.0) rank = 'Khá';
    else if (gpa10 >= 5.0) rank = 'Trung bình';
    else rank = 'Yếu';

    onUpdateStudent({
      ...student,
      grades: currentGrades,
      gpa10,
      gpa4,
      academicRank: rank,
      creditsEarned: totalCredits
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Bảng Điểm Học Tập & Học Bạ — {student.fullName}
              </h2>
              <p className="text-xs text-slate-400">
                Mã SV: <strong className="text-amber-400 font-mono">{student.id}</strong> • Lớp: <strong>{student.className}</strong> • Khoa: <strong>{student.facultyName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPA Summary bar */}
        <div className="bg-blue-50/60 border-b border-blue-100 p-4 px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-500 block">GPA Hệ 10:</span>
              <span className="text-lg font-bold text-slate-900">{student.gpa10}</span>
            </div>
            <div>
              <span className="text-slate-500 block">GPA Hệ 4:</span>
              <span className="text-lg font-bold text-blue-700 font-mono">{student.gpa4}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Xếp loại:</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {student.academicRank}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Tổng số tín chỉ:</span>
              <span className="text-sm font-bold text-purple-700">
                {grades.reduce((a, b) => a + b.credits, 0)} Tín chỉ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Hủy thêm môn' : 'Nhập điểm môn mới'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In bảng điểm</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Add Subject Form */}
          {showAddForm && (
            <form onSubmit={handleAddSubject} className="bg-slate-50 p-4 rounded-xl border border-blue-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Nhập Môn Học & Điểm Thi Mới</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Mã môn học *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: CK203, OTO102..."
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 uppercase font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Tên môn học / Mô-đun đào tạo *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Gia công Phay CNC, Lập trình Web..."
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Số tín chỉ</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCredits}
                    onChange={e => setNewCredits(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Chuyên cần (10%)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newAttendance}
                    onChange={e => setNewAttendance(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Giữa kỳ (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newMidterm}
                    onChange={e => setNewMidterm(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Thi cuối kỳ (60%)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newFinal}
                    onChange={e => setNewFinal(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Học kỳ</label>
                  <input
                    type="text"
                    value={newSemester}
                    onChange={e => setNewSemester(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Lưu môn học
                </button>
              </div>
            </form>
          )}

          {/* Grades Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Mã môn</th>
                  <th className="py-3 px-3">Tên môn học / Mô đun</th>
                  <th className="py-3 px-2 text-center">Tín chỉ</th>
                  <th className="py-3 px-2 text-center">Chuyên cần (10%)</th>
                  <th className="py-3 px-2 text-center">Giữa kỳ (30%)</th>
                  <th className="py-3 px-2 text-center">Cuối kỳ (60%)</th>
                  <th className="py-3 px-2 text-center">Hệ 10</th>
                  <th className="py-3 px-2 text-center">Hệ 4</th>
                  <th className="py-3 px-2 text-center">Điểm chữ</th>
                  <th className="py-3 px-3 text-right">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      Chưa có dữ liệu điểm môn học cho sinh viên này. Hãy bấm "Nhập điểm môn mới".
                    </td>
                  </tr>
                ) : (
                  grades.map(g => (
                    <tr key={g.code} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{g.code}</td>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-slate-900">{g.name}</p>
                        <p className="text-[10px] text-slate-400">{g.semester}</p>
                      </td>
                      <td className="py-2.5 px-2 text-center font-medium">{g.credits}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{g.attendanceScore}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{g.midtermScore}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{g.finalScore}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-900">{g.totalScore10}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-blue-700">{g.totalScore4}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          g.letterGrade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                          g.letterGrade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          g.letterGrade.startsWith('C') ? 'bg-indigo-100 text-indigo-800' :
                          g.letterGrade === 'D' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {g.letterGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteSubject(g.code)}
                          title="Xóa môn học này"
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Grading Scale Guide */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span><strong>Quy đổi:</strong> A (8.5 - 10 | 4.0) • B+ (8.0 - 8.4 | 3.5) • B (7.0 - 7.9 | 3.0) • C+ (6.5 - 6.9 | 2.5) • C (5.5 - 6.4 | 2.0) • D (4.0 - 5.4 | 1.0) • F (&lt; 4.0 | 0)</span>
            <span className="text-slate-400">Quy chế đào tạo theo hệ thống tín chỉ</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
