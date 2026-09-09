import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Save, 
  Users,
  Filter
} from 'lucide-react';
import { Student, Faculty } from '../types';

interface AttendanceManagerProps {
  students: Student[];
  faculties: Faculty[];
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  students,
  faculties,
  onUpdateStudent
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionShift, setSessionShift] = useState<'Sáng' | 'Chiều'>('Sáng');
  const [sessionSubject, setSessionSubject] = useState('Thực hành xưởng kỹ thuật');

  // Extract unique classes
  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  // Filtered students for attendance
  const filteredStudents = students.filter(student => {
    const matchFaculty = selectedFaculty === 'ALL' || student.facultyId === selectedFaculty;
    const matchClass = selectedClass === 'ALL' || student.className === selectedClass;
    const matchSearch = !searchTerm || 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFaculty && matchClass && matchSearch;
  });

  // Local state for today's roll call
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'late' | 'excused' | 'unexcused'>>({});

  const handleSetStatus = (studentId: string, status: 'present' | 'late' | 'excused' | 'unexcused') => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'present' | 'late' | 'excused' | 'unexcused'> = {};
    filteredStudents.forEach(s => {
      updated[s.id] = 'present';
    });
    setAttendanceMap(prev => ({ ...prev, ...updated }));
  };

  const handleSaveAttendance = () => {
    let savedCount = 0;
    filteredStudents.forEach(student => {
      const status = attendanceMap[student.id];
      if (status) {
        const currentSummary = student.attendanceSummary || {
          totalSessions: 100,
          present: 95,
          late: 2,
          excused: 2,
          unexcused: 1,
          absentPercentage: 2
        };

        const newTotal = currentSummary.totalSessions + 1;
        const newPresent = currentSummary.present + (status === 'present' ? 1 : 0);
        const newLate = currentSummary.late + (status === 'late' ? 1 : 0);
        const newExcused = currentSummary.excused + (status === 'excused' ? 1 : 0);
        const newUnexcused = currentSummary.unexcused + (status === 'unexcused' ? 1 : 0);
        const absentPercent = Math.round(((newExcused + newUnexcused) / newTotal) * 1000) / 10;

        onUpdateStudent({
          ...student,
          attendanceSummary: {
            totalSessions: newTotal,
            present: newPresent,
            late: newLate,
            excused: newExcused,
            unexcused: newUnexcused,
            absentPercentage: absentPercent
          }
        });
        savedCount++;
      }
    });

    alert(`Đã lưu thành công kết quả điểm danh cho ${savedCount} sinh viên!`);
    setAttendanceMap({});
  };

  return (
    <div className="space-y-6">
      {/* Overview & Quick Attendance Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <span>Quản Lý Điểm Danh & Chuyên Cần Xưởng Thực Hành</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo quy chế thực hành kỹ thuật Việt - Đức: Sinh viên vắng quá 20% số buổi học sẽ bị cấm thi kết thúc môn.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              ✓ Điểm danh tất cả Có Mặt
            </button>
            <button
              onClick={handleSaveAttendance}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu sổ điểm danh</span>
            </button>
          </div>
        </div>

        {/* Attendance Session Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Ngày điểm danh</label>
            <input
              type="date"
              value={sessionDate}
              onChange={e => setSessionDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Ca học</label>
            <select
              value={sessionShift}
              onChange={e => setSessionShift(e.target.value as 'Sáng' | 'Chiều')}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="Sáng">Ca Sáng (07:30 - 11:30)</option>
              <option value="Chiều">Ca Chiều (13:00 - 17:00)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Môn học / Mô đun thực hành</label>
            <input
              type="text"
              value={sessionSubject}
              onChange={e => setSessionSubject(e.target.value)}
              placeholder="VD: Gia công Phay CNC, Bảo dưỡng Ô tô..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Khoa đào tạo</label>
            <select
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
            >
              <option value="ALL">Tất cả các Khoa</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Lớp sinh hoạt</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
            >
              <option value="ALL">Tất cả các Lớp</option>
              {uniqueClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Tìm kiếm sinh viên</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tên, mã sinh viên..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Danh sách điểm danh ({filteredStudents.length} sinh viên)
          </span>
          <span className="text-slate-500">
            Buổi học: <strong>{sessionSubject}</strong> ({sessionDate} - {sessionShift})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Mã SV & Họ tên</th>
                <th className="py-3 px-3">Lớp</th>
                <th className="py-3 px-3 text-center">Tổng buổi</th>
                <th className="py-3 px-3 text-center">Tỷ lệ vắng</th>
                <th className="py-3 px-3 text-center">Cảnh báo</th>
                <th className="py-3 px-4 text-center">Trạng thái buổi học hôm nay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const summary = student.attendanceSummary || {
                  totalSessions: 140,
                  present: 135,
                  late: 2,
                  excused: 2,
                  unexcused: 1,
                  absentPercentage: 2.1
                };

                const isWarning = summary.absentPercentage >= 15;
                const isDanger = summary.absentPercentage >= 20;

                const currentSessionStatus = attendanceMap[student.id] || 'present';

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.fullName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.fullName}</p>
                          <p className="text-[10px] font-mono text-slate-500">{student.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {student.className}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold text-slate-800">{summary.totalSessions}</span>
                      <span className="text-[10px] text-slate-400 block">
                        (Có mặt: {summary.present})
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`font-bold ${
                        isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-800'
                      }`}>
                        {summary.absentPercentage}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Vắng {summary.excused + summary.unexcused} buổi
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {isDanger ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Cấm thi xưởng
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Cảnh báo vàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Tốt
                        </span>
                      )}
                    </td>

                    {/* Attendance Radio / Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'present')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentSessionStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Có mặt
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'late')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentSessionStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Đi trễ
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'excused')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentSessionStatus === 'excused'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Có phép
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'unexcused')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentSessionStatus === 'unexcused'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Không phép
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
