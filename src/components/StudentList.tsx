import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  GraduationCap, 
  CreditCard, 
  Sparkles, 
  IdCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { Student, Faculty } from '../types';

interface StudentListProps {
  students: Student[];
  faculties: Faculty[];
  onSelectStudent: (student: Student) => void;
  onOpenEditModal: (student: Student) => void;
  onOpenGradesModal: (student: Student) => void;
  onOpenCardModal: (student: Student) => void;
  onOpenAIModal: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenAddModal: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  faculties,
  onSelectStudent,
  onOpenEditModal,
  onOpenGradesModal,
  onOpenCardModal,
  onOpenAIModal,
  onDeleteStudent,
  onOpenAddModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [selectedCohort, setSelectedCohort] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRank, setSelectedRank] = useState('ALL');
  const [selectedPolicy, setSelectedPolicy] = useState('ALL');

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search term filter
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = 
        !term ||
        student.fullName.toLowerCase().includes(term) ||
        student.id.toLowerCase().includes(term) ||
        student.className.toLowerCase().includes(term) ||
        student.major.toLowerCase().includes(term) ||
        student.phone.toLowerCase().includes(term) ||
        student.idCard.toLowerCase().includes(term);

      // Faculty filter
      const matchFaculty = selectedFaculty === 'ALL' || student.facultyId === selectedFaculty;

      // Cohort filter
      const matchCohort = selectedCohort === 'ALL' || student.cohort.includes(selectedCohort);

      // Status filter
      const matchStatus = selectedStatus === 'ALL' || student.status === selectedStatus;

      // Rank filter
      const matchRank = selectedRank === 'ALL' || student.academicRank === selectedRank;

      // Policy filter
      const matchPolicy = 
        selectedPolicy === 'ALL' ||
        (selectedPolicy === 'POLICY' && student.policyCategory && student.policyCategory !== 'Không') ||
        (selectedPolicy === 'DORM' && student.dormitory) ||
        (selectedPolicy === 'SCHOLARSHIP' && student.scholarship);

      return matchSearch && matchFaculty && matchCohort && matchStatus && matchRank && matchPolicy;
    });
  }, [students, searchTerm, selectedFaculty, selectedCohort, selectedStatus, selectedRank, selectedPolicy]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Mã SV',
      'Họ và Tên',
      'Giới tính',
      'Ngày sinh',
      'Khoa',
      'Chuyên ngành',
      'Lớp',
      'Khóa',
      'Hệ đào tạo',
      'Trạng thái',
      'Điểm GPA 10',
      'Điểm GPA 4',
      'Xếp loại',
      'Điểm rèn luyện',
      'Chính sách',
      'Số ĐT',
      'CCCD',
      'Địa chỉ'
    ];

    const rows = filteredStudents.map(s => [
      `"${s.id}"`,
      `"${s.fullName}"`,
      `"${s.gender}"`,
      `"${s.dob}"`,
      `"${s.facultyName}"`,
      `"${s.major}"`,
      `"${s.className}"`,
      `"${s.cohort}"`,
      `"${s.trainingSystem}"`,
      `"${s.status}"`,
      s.gpa10,
      s.gpa4,
      `"${s.academicRank}"`,
      s.conductScore,
      `"${s.policyCategory}"`,
      `"${s.phone}"`,
      `"${s.idCard}"`,
      `"${s.address}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Danh_sach_sinh_vien_VietDuc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search & Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-students-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã sinh viên, họ tên, lớp, ngành học, CCCD..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Xuất CSV</span>
            </button>

            <button
              id="btn-list-add-student"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Faculty filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Khoa đào tạo</label>
            <select
              id="filter-faculty"
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="ALL">Tất cả các Khoa ({faculties.length})</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Cohort filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Niên khóa</label>
            <select
              id="filter-cohort"
              value={selectedCohort}
              onChange={e => setSelectedCohort(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="ALL">Tất cả các Khóa</option>
              <option value="Khóa 50">Khóa 50 (2024-2027)</option>
              <option value="Khóa 49">Khóa 49 (2023-2026)</option>
              <option value="Khóa 48">Khóa 48 (2022-2025)</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Tình trạng học</label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="ALL">Tất cả tình trạng</option>
              <option value="Đang học">Đang học</option>
              <option value="Tốt nghiệp">Tốt nghiệp</option>
              <option value="Bảo lưu">Bảo lưu</option>
              <option value="Cảnh cáo học vụ">Cảnh cáo học vụ</option>
            </select>
          </div>

          {/* Rank filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Xếp loại học tập</label>
            <select
              id="filter-rank"
              value={selectedRank}
              onChange={e => setSelectedRank(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="ALL">Tất cả học lực</option>
              <option value="Xuất sắc">Xuất sắc</option>
              <option value="Giỏi">Giỏi</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Yếu">Yếu / Kém</option>
            </select>
          </div>

          {/* Policy filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Chính sách & KTX</label>
            <select
              id="filter-policy"
              value={selectedPolicy}
              onChange={e => setSelectedPolicy(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="ALL">Tất cả chế độ</option>
              <option value="POLICY">Miễn giảm NĐ 81 / Chính sách</option>
              <option value="SCHOLARSHIP">Học bổng khuyến khích</option>
              <option value="DORM">Nội trú KTX trường</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Summary */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <p>
          Tìm thấy <strong className="text-slate-800">{filteredStudents.length}</strong> / {students.length} sinh viên
        </p>
        {(searchTerm || selectedFaculty !== 'ALL' || selectedCohort !== 'ALL' || selectedStatus !== 'ALL' || selectedRank !== 'ALL' || selectedPolicy !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFaculty('ALL');
              setSelectedCohort('ALL');
              setSelectedStatus('ALL');
              setSelectedRank('ALL');
              setSelectedPolicy('ALL');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium underline text-xs"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Sinh viên</th>
                <th className="py-3.5 px-3">Khoa / Ngành đào tạo</th>
                <th className="py-3.5 px-3">Lớp & Khóa</th>
                <th className="py-3.5 px-3 text-center">GPA (10/4)</th>
                <th className="py-3.5 px-3 text-center">Xếp loại</th>
                <th className="py-3.5 px-3 text-center">Chuyên cần</th>
                <th className="py-3.5 px-3 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm">Không tìm thấy sinh viên phù hợp với điều kiện tìm kiếm.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedFaculty('ALL');
                        setSelectedCohort('ALL');
                        setSelectedStatus('ALL');
                        setSelectedRank('ALL');
                        setSelectedPolicy('ALL');
                      }}
                      className="mt-2 text-xs text-blue-600 hover:underline"
                    >
                      Bỏ lọc để xem toàn bộ danh sách
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Student Info & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.fullName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <button
                              onClick={() => onSelectStudent(student)}
                              className="font-bold text-slate-900 hover:text-blue-600 text-left transition-colors flex items-center gap-1.5"
                            >
                              <span>{student.fullName}</span>
                              {student.trainingSystem.includes('Chuẩn Đức') && (
                                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1 py-0.2 rounded">
                                  DIHK
                                </span>
                              )}
                            </button>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono text-slate-600">{student.id}</span>
                              <span className="mx-1">•</span>
                              <span>{student.gender}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Faculty / Major */}
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800 text-[11px]">{student.major}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{student.facultyName}</p>
                      </td>

                      {/* Class & Cohort */}
                      <td className="py-3 px-3">
                        <span className="inline-block font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {student.className}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1">{student.cohort.split(' ')[0]}</p>
                      </td>

                      {/* GPA */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-slate-900 text-xs">
                          {student.gpa10.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          ({student.gpa4.toFixed(2)})
                        </span>
                      </td>

                      {/* Academic Rank */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          student.academicRank === 'Xuất sắc' ? 'bg-emerald-100 text-emerald-800' :
                          student.academicRank === 'Giỏi' ? 'bg-blue-100 text-blue-800' :
                          student.academicRank === 'Khá' ? 'bg-indigo-100 text-indigo-800' :
                          student.academicRank === 'Trung bình' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.academicRank}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ĐRL: {student.conductScore}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-3 text-center">
                        <span className={`font-semibold text-[11px] ${
                          (student.attendanceSummary?.absentPercentage || 0) > 15 
                            ? 'text-red-600 font-bold' 
                            : 'text-slate-700'
                        }`}>
                          {(100 - (student.attendanceSummary?.absentPercentage || 0)).toFixed(0)}%
                        </span>
                        {(student.attendanceSummary?.absentPercentage || 0) > 15 && (
                          <span className="block text-[9px] text-red-500">Nguy cơ cấm thi</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          student.status === 'Đang học' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          student.status === 'Tốt nghiệp' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          student.status === 'Bảo lưu' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100">
                          {/* Profile detail */}
                          <button
                            id={`btn-view-${student.id}`}
                            onClick={() => onSelectStudent(student)}
                            title="Xem chi tiết hồ sơ"
                            className="p-1.5 rounded-md hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Gradebook */}
                          <button
                            id={`btn-grade-${student.id}`}
                            onClick={() => onOpenGradesModal(student)}
                            title="Xem bảng điểm & học bạ"
                            className="p-1.5 rounded-md hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                          >
                            <GraduationCap className="w-4 h-4" />
                          </button>

                          {/* Student Card */}
                          <button
                            id={`btn-card-${student.id}`}
                            onClick={() => onOpenCardModal(student)}
                            title="In thẻ sinh viên Cao đẳng Việt Đức"
                            className="p-1.5 rounded-md hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>

                          {/* AI Advisor */}
                          <button
                            id={`btn-ai-${student.id}`}
                            onClick={() => onOpenAIModal(student)}
                            title="Trợ lý AI đánh giá & tư vấn"
                            className="p-1.5 rounded-md hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            id={`btn-edit-${student.id}`}
                            onClick={() => onOpenEditModal(student)}
                            title="Chỉnh sửa thông tin"
                            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            id={`btn-delete-${student.id}`}
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên ${student.fullName} (${student.id})?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            title="Xóa sinh viên"
                            className="p-1.5 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
  );
};
