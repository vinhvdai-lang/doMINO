import React from 'react';
import { 
  Users, 
  GraduationCap, 
  AlertTriangle, 
  Award, 
  Percent, 
  Home, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  BookOpenCheck,
  Building2
} from 'lucide-react';
import { Student, Faculty } from '../types';

interface DashboardStatsProps {
  students: Student[];
  faculties: Faculty[];
  onSelectStudent: (student: Student) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  faculties,
  onSelectStudent,
  onNavigateToTab
}) => {
  const total = students.length;
  const active = students.filter(s => s.status === 'Đang học').length;
  const graduated = students.filter(s => s.status === 'Tốt nghiệp').length;
  const reserved = students.filter(s => s.status === 'Bảo lưu').length;
  const warned = students.filter(s => s.status === 'Cảnh cáo học vụ').length;

  const scholarshipCount = students.filter(s => s.scholarship).length;
  const dormCount = students.filter(s => s.dormitory).length;
  const policyCount = students.filter(s => s.policyCategory && s.policyCategory !== 'Không').length;

  // Academic rank distribution
  const rankCounts = {
    'Xuất sắc': students.filter(s => s.academicRank === 'Xuất sắc').length,
    'Giỏi': students.filter(s => s.academicRank === 'Giỏi').length,
    'Khá': students.filter(s => s.academicRank === 'Khá').length,
    'Trung bình': students.filter(s => s.academicRank === 'Trung bình').length,
    'Yếu': students.filter(s => s.academicRank === 'Yếu').length,
  };

  // Calculate average GPA
  const avgGpa = total > 0 
    ? (students.reduce((acc, s) => acc + s.gpa10, 0) / total).toFixed(2)
    : '0.00';

  // Calculate average attendance
  const avgAttendance = total > 0
    ? (students.reduce((acc, s) => acc + (100 - (s.attendanceSummary?.absentPercentage || 0)), 0) / total).toFixed(1)
    : '100';

  // Faculty distribution
  const facultyStats = faculties.map(f => {
    const count = students.filter(s => s.facultyId === f.id).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { ...f, studentCount: count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-blue-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
              <span>Đào tạo kỹ thuật chuẩn CHLB Đức & Quốc gia</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Báo Cáo Tổng Quan Học Vụ & Rèn Luyện Sinh Viên
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Dữ liệu quản lý hồ sơ, bảng điểm kỹ thuật thực hành xưởng, tiến độ nộp học phí theo chính sách Nghị định 81/2021/NĐ-CP và theo dõi chuyên cần toàn trường.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToTab('students')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white text-blue-900 hover:bg-blue-50 shadow transition-all active:scale-95"
            >
              Xem danh sách chi tiết
            </button>
            <button
              onClick={() => onNavigateToTab('ai')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/40 shadow transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Phân tích bằng AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng sinh viên & đang học */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tổng số sinh viên
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{total}</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {active} đang học
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tốt nghiệp: <strong className="text-slate-800">{graduated}</strong></span>
            <span>Bảo lưu: <strong className="text-amber-600">{reserved}</strong></span>
          </div>
        </div>

        {/* Card 2: Điểm TB & Học lực */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              GPA Điểm TB Toàn Trường
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{avgGpa}</span>
            <span className="text-xs text-slate-500">/ 10.0</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Xuất sắc & Giỏi:</span>
            <span className="font-semibold text-blue-600">
              {rankCounts['Xuất sắc'] + rankCounts['Giỏi']} sinh viên ({total > 0 ? Math.round(((rankCounts['Xuất sắc'] + rankCounts['Giỏi']) / total) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Card 3: Tỷ lệ chuyên cần */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tỷ lệ chuyên cần
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{avgAttendance}%</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Thực hành chuẩn
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cảnh cáo học vụ:</span>
            <span className={`font-bold ${warned > 0 ? 'text-red-600' : 'text-slate-700'}`}>
              {warned} trường hợp
            </span>
          </div>
        </div>

        {/* Card 4: Chế độ chính sách NĐ 81 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Chế độ NĐ 81 & Học bổng
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{policyCount}</span>
            <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
              Miễn giảm học phí
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Học bổng: <strong>{scholarshipCount}</strong></span>
            <span>Ở KTX: <strong>{dormCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Breakdown Section: Faculties and Academic Ranks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Distribution by Faculty */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Phân Bổ Sinh Viên Theo Khoa Chuyên Môn</h3>
              <p className="text-xs text-slate-500">Các ngành trọng điểm nghề kỹ thuật công nghệ tiêu chuẩn Việt - Đức</p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {faculties.length} Khoa đào tạo
            </span>
          </div>

          <div className="space-y-4">
            {facultyStats.map(f => (
              <div key={f.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{f.name}</span>
                    <span className="text-[11px] text-slate-400">({f.code})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700">{f.studentCount} sinh viên</span>
                    <span className="text-slate-400 w-10 text-right">{f.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(f.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Academic Ranks & Quick Alerts */}
        <div className="space-y-6">
          {/* Academic Ranks Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Xếp Loại Học Lực</h3>
            <p className="text-xs text-slate-500 mb-4">Thang điểm 10 theo quy chế đào tạo nghề</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-900">Xuất sắc (9.0 - 10)</span>
                </div>
                <span className="text-xs font-bold text-emerald-800">{rankCounts['Xuất sắc']}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-blue-900">Giỏi (8.0 - 8.9)</span>
                </div>
                <span className="text-xs font-bold text-blue-800">{rankCounts['Giỏi']}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-900">Khá (7.0 - 7.9)</span>
                </div>
                <span className="text-xs font-bold text-indigo-800">{rankCounts['Khá']}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-amber-900">Trung bình (5.0 - 6.9)</span>
                </div>
                <span className="text-xs font-bold text-amber-800">{rankCounts['Trung bình']}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/60 border border-red-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs font-semibold text-red-900">Yếu / Kém (&lt; 5.0)</span>
                </div>
                <span className="text-xs font-bold text-red-800">{rankCounts['Yếu']}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Students & Action Required Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Outstanding Students */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Sinh Viên Tiêu Biểu & Xuất Sắc</h3>
            </div>
            <span className="text-[11px] text-slate-400">GPA cao nhất</span>
          </div>

          <div className="divide-y divide-slate-100">
            {students
              .slice()
              .sort((a, b) => b.gpa10 - a.gpa10)
              .slice(0, 3)
              .map(student => (
                <div 
                  key={student.id} 
                  onClick={() => onSelectStudent(student)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={student.avatar} 
                      alt={student.fullName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{student.fullName}</p>
                      <p className="text-[11px] text-slate-500">{student.id} • {student.className}</p>
                      <p className="text-[11px] text-blue-600 truncate max-w-[200px]">{student.major}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      GPA {student.gpa10}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">ĐRL: {student.conductScore}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Warning / Needs Attention Students */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-slate-900">Cần Lưu Ý Học Vụ & Chuyên Cần</h3>
            </div>
            <span className="text-[11px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
              Hỗ trợ kịp thời
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {students
              .filter(s => s.status === 'Cảnh cáo học vụ' || s.gpa10 < 5.5 || s.attendanceSummary?.absentPercentage > 10)
              .slice(0, 3)
              .map(student => (
                <div 
                  key={student.id} 
                  onClick={() => onSelectStudent(student)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={student.avatar} 
                      alt={student.fullName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-red-200" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-800">{student.fullName}</p>
                        <span className="text-[9px] bg-red-100 text-red-700 font-semibold px-1.5 py-0.2 rounded">
                          {student.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{student.id} • {student.className}</p>
                      <p className="text-[11px] text-red-600">Vắng: {student.attendanceSummary?.absentPercentage}% tiết học</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                      GPA {student.gpa10}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">ĐRL: {student.conductScore}</p>
                  </div>
                </div>
              ))}
            {students.filter(s => s.status === 'Cảnh cáo học vụ' || s.gpa10 < 5.5).length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">Không có sinh viên nào trong danh sách cảnh báo học vụ.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
