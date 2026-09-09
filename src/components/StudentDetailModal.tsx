import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Printer, 
  Sparkles, 
  IdCard,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onOpenCardModal: (student: Student) => void;
  onOpenAIModal: (student: Student) => void;
  onOpenGradesModal: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onOpenCardModal,
  onOpenAIModal,
  onOpenGradesModal
}) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={student.avatar}
              alt={student.fullName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/20 shadow-lg flex-shrink-0"
            />
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold">{student.fullName}</h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  student.status === 'Đang học' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  student.status === 'Tốt nghiệp' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                  student.status === 'Bảo lưu' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {student.status}
                </span>
                {student.trainingSystem.includes('Chuẩn Đức') && (
                  <span className="text-[11px] font-semibold bg-red-950/60 text-red-300 border border-red-700/50 px-2 py-0.5 rounded-full">
                    Chuẩn DIHK CHLB Đức
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300">
                Mã SV: <span className="font-mono font-bold text-amber-400">{student.id}</span> • Lớp: <span className="font-semibold text-white">{student.className}</span>
              </p>
              <p className="text-xs text-blue-300">
                {student.major} — {student.facultyName}
              </p>
              <p className="text-xs text-slate-400">
                {student.cohort} • Hệ: {student.trainingSystem}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Academic Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">Điểm GPA hệ 10</span>
              <span className="text-lg font-bold text-slate-900">{student.gpa10}</span>
              <span className="text-[10px] text-slate-400 block font-mono">Hệ 4: {student.gpa4}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Xếp loại học tập</span>
              <span className="text-sm font-bold text-blue-700 mt-1 block">{student.academicRank}</span>
              <span className="text-[10px] text-slate-400 block">Theo quy chế tín chỉ</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Điểm rèn luyện</span>
              <span className="text-lg font-bold text-emerald-700">{student.conductScore}/100</span>
              <span className="text-[10px] text-emerald-600 block font-semibold">{student.conductRank}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Tín chỉ tích lũy</span>
              <span className="text-lg font-bold text-purple-700">{student.creditsEarned} / {student.totalCredits}</span>
              <span className="text-[10px] text-slate-400 block">
                {Math.round((student.creditsEarned / student.totalCredits) * 100)}% hoàn thành
              </span>
            </div>
          </div>

          {/* Section 1: Thông tin cá nhân & Liên lạc */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Thông Tin Nhân Thân & Gia Đình</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Giới tính:</span>
                  <span className="font-semibold text-slate-800">{student.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ngày sinh:</span>
                  <span className="font-semibold text-slate-800">{student.dob}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Số CCCD:</span>
                  <span className="font-mono font-semibold text-slate-800">{student.idCard}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-semibold text-blue-600">{student.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email trường cấp:</span>
                  <span className="font-mono text-slate-800 truncate max-w-[200px]">{student.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hộ khẩu / Thường trú:</span>
                  <span className="font-semibold text-slate-800 text-right">{student.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Họ tên phụ huynh:</span>
                  <span className="font-semibold text-slate-800">{student.parentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SĐT phụ huynh:</span>
                  <span className="font-semibold text-blue-600">{student.parentPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Chỗ ở hiện tại:</span>
                  <span className="font-semibold text-slate-800">
                    {student.dormitory ? 'Ký túc xá Trường Cao đẳng Việt Đức' : 'Ngoại trú / Nhà riêng'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Học bổng khuyến khích:</span>
                  <span className={`font-semibold ${student.scholarship ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {student.scholarship ? 'Có (Đạt tiêu chuẩn xét HB)' : 'Không'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Chế độ chính sách & Nghị định 81 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Chế Độ Chính Sách & Hỗ Trợ Học Phí</span>
            </h3>

            <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-purple-950 text-xs">{student.policyCategory}</p>
                <p className="text-[11px] text-purple-800 mt-0.5 leading-relaxed">
                  Trường Cao đẳng Y tế và Trang thiết bị Việt Đức thực hiện hỗ trợ 70% hoặc 100% học phí theo Nghị định 81/2021/NĐ-CP đối với các nghề nặng nhọc, độc hại (như Hàn 6G, Cắt gọt kim loại CNC, Vận hành thiết bị cơ giới...) và sinh viên thuộc hộ nghèo/cận nghèo, dân tộc thiểu số.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Bảng điểm tóm tắt */}
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Các Môn Học Đã Đăng Ký ({student.grades.length} môn)</span>
              </h3>
              <button
                onClick={() => onOpenGradesModal(student)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
              >
                Xem chi tiết học bạ →
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Môn học</th>
                    <th className="py-2 px-2 text-center">Tín chỉ</th>
                    <th className="py-2 px-2 text-center">Hệ 10</th>
                    <th className="py-2 px-2 text-center">Điểm chữ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.grades.map(g => (
                    <tr key={g.code}>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-800">{g.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{g.code} • {g.semester}</span>
                      </td>
                      <td className="py-2 px-2 text-center">{g.credits}</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-900">{g.totalScore10}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="font-bold text-blue-700">{g.letterGrade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Ghi chú & Nhận xét */}
          {student.notes && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-700 text-xs mb-1">Ghi chú học vụ / Rèn luyện:</p>
              <p className="text-slate-600 text-xs leading-relaxed">{student.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCardModal(student)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-sm"
            >
              <IdCard className="w-3.5 h-3.5 text-purple-600" />
              <span>In Thẻ SV</span>
            </button>

            <button
              onClick={() => onOpenAIModal(student)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tư vấn AI</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Hồ Sơ</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
