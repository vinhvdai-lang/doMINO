import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  DollarSign, 
  Receipt,
  FileCheck
} from 'lucide-react';
import { Student } from '../types';

interface TuitionManagerProps {
  students: Student[];
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const TuitionManager: React.FC<TuitionManagerProps> = ({
  students,
  onUpdateStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedReceiptStudent, setSelectedReceiptStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchSearch = !searchTerm ||
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.className.toLowerCase().includes(searchTerm.toLowerCase());

    // Check tuition status of current/latest semester
    const latestTuition = s.tuition[s.tuition.length - 1];
    const status = latestTuition ? latestTuition.status : 'paid';

    const matchStatus = filterStatus === 'ALL' || status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Toggle or mark tuition as paid
  const handleMarkPaid = (student: Student, tuitionIndex: number) => {
    const updatedTuitions = [...student.tuition];
    const item = updatedTuitions[tuitionIndex];
    if (!item) return;

    item.status = 'paid';
    item.paidAmount = item.finalFee;
    item.paymentDate = new Date().toISOString().slice(0, 10);
    item.receiptNumber = `BL-VD-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;

    onUpdateStudent({
      ...student,
      tuition: updatedTuitions
    });

    alert(`Đã cập nhật trạng thái Đã Nộp Học Phí cho ${student.fullName} (Mã biên lai: ${item.receiptNumber})`);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner on Decree 81 */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white shadow border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-400/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chính sách Nghị định 81/2021/NĐ-CP & Quyết định Thủ tướng Chính phủ</span>
            </div>
            <h2 className="text-lg font-bold">
              Quản Lý Học Phí & Chế Độ Miễn Giảm Nghề Kỹ Thuật Việt Đức
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Trường áp dụng giảm 70% học phí đối với các nghề nặng nhọc độc hại (Cắt gọt kim loại CNC chuẩn Đức, Công nghệ Hàn 6G, Điện tử công nghiệp, Công nghệ ô tô) và miễn 100% đối với sinh viên thuộc diện hộ nghèo, con gia đình chính sách.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-lg border border-white/10 text-xs">
            <div>
              <span className="text-purple-200 block text-[10px]">Học phí gốc chuẩn</span>
              <span className="font-bold text-white text-sm">6.500.000 đ</span>
            </div>
            <div className="h-6 w-[1px] bg-white/20" />
            <div>
              <span className="text-purple-200 block text-[10px]">Sau hỗ trợ 70%</span>
              <span className="font-bold text-amber-300 text-sm">1.950.000 đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, mã SV, lớp học..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Tình trạng nộp:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs"
            >
              <option value="ALL">Tất cả</option>
              <option value="paid">Đã hoàn thành</option>
              <option value="unpaid">Còn nợ học phí</option>
              <option value="partial">Nộp một phần</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In sổ thu học phí</span>
          </button>
        </div>
      </div>

      {/* Tuition Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Sinh viên</th>
                <th className="py-3 px-3">Lớp & Ngành</th>
                <th className="py-3 px-3">Học kỳ</th>
                <th className="py-3 px-3 text-right">Mức gốc</th>
                <th className="py-3 px-3 text-center">Chính sách giảm</th>
                <th className="py-3 px-3 text-right">Phải nộp</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Biên lai / Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const latest = student.tuition[student.tuition.length - 1] || {
                  semester: 'Kỳ 1',
                  academicYear: '2024-2025',
                  originalFee: 6500000,
                  discountPercentage: 70,
                  discountReason: 'Nghề NĐ 81',
                  finalFee: 1950000,
                  paidAmount: 1950000,
                  status: 'paid',
                  dueDate: '2024-10-15',
                  receiptNumber: 'BL-VD-24-001'
                };

                const tuitionIndex = student.tuition.length - 1;

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{student.fullName}</p>
                      <p className="text-[10px] font-mono text-slate-500">{student.id}</p>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{student.className}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{student.major}</p>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700">{latest.semester}</span>
                      <span className="text-[10px] text-slate-400 block">{latest.academicYear}</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {latest.originalFee.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        latest.discountPercentage === 100 ? 'bg-emerald-100 text-emerald-800' :
                        latest.discountPercentage > 0 ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {latest.discountPercentage > 0 ? `Giảm ${latest.discountPercentage}%` : 'Không giảm'}
                      </span>
                      {latest.discountReason && (
                        <span className="text-[9px] text-slate-400 block truncate max-w-[130px] mx-auto mt-0.5">
                          {latest.discountReason}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {latest.finalFee.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        latest.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        latest.status === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {latest.status === 'paid' ? 'Đã hoàn thành' : latest.status === 'partial' ? 'Nợ một phần' : 'Chưa nộp'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {latest.status === 'paid' ? (
                        <button
                          onClick={() => setSelectedReceiptStudent(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                        >
                          <Receipt className="w-3.5 h-3.5 text-blue-600" />
                          <span>Biên lai ({latest.receiptNumber || 'Xem'})</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkPaid(student, tuitionIndex)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Thu tiền ngay</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceiptStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Biên Lai Thu Học Phí Điện Tử</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-center font-bold text-slate-900 text-sm uppercase">
                TRƯỜNG CAO ĐẲNG Y TẾ VÀ TRANG THIẾT BỊ VIỆT ĐỨC
              </p>
              <p className="text-center text-[10px] text-slate-500">Phòng Kế toán - Tài vụ</p>
              <div className="h-[1px] bg-slate-200 my-2" />

              <div className="flex justify-between">
                <span>Họ và tên:</span>
                <strong className="text-slate-900">{selectedReceiptStudent.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Mã sinh viên:</span>
                <span className="font-mono font-bold text-blue-700">{selectedReceiptStudent.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Lớp:</span>
                <span>{selectedReceiptStudent.className}</span>
              </div>
              <div className="flex justify-between">
                <span>Khoa:</span>
                <span>{selectedReceiptStudent.facultyName}</span>
              </div>
              <div className="flex justify-between">
                <span>Khoản thu:</span>
                <span>Học phí {selectedReceiptStudent.tuition[selectedReceiptStudent.tuition.length - 1]?.semester} ({selectedReceiptStudent.tuition[selectedReceiptStudent.tuition.length - 1]?.academicYear})</span>
              </div>
              <div className="flex justify-between">
                <span>Miễn giảm chính sách:</span>
                <strong className="text-purple-700">{selectedReceiptStudent.tuition[selectedReceiptStudent.tuition.length - 1]?.discountPercentage}% (NĐ 81)</strong>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 text-slate-900">
                <span>Số tiền đã thu:</span>
                <span className="text-emerald-600 font-mono">
                  {selectedReceiptStudent.tuition[selectedReceiptStudent.tuition.length - 1]?.finalFee.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Mã giao dịch: {selectedReceiptStudent.tuition[selectedReceiptStudent.tuition.length - 1]?.receiptNumber}</span>
                <span>Ngày thu: {selectedReceiptStudent.tuition[selectedReceiptStudent.tuition.length - 1]?.paymentDate}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In biên lai</span>
              </button>
              <button
                onClick={() => setSelectedReceiptStudent(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
