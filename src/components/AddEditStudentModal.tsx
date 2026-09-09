import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Student, Faculty } from '../types';

interface AddEditStudentModalProps {
  isOpen: boolean;
  student: Student | null; // null for add mode, student object for edit mode
  faculties: Faculty[];
  onClose: () => void;
  onSave: (studentData: Student) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
];

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  student,
  faculties,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const isEdit = !!student;

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    id: '',
    fullName: '',
    gender: 'Nam',
    dob: '2005-01-01',
    facultyId: faculties[0]?.id || 'co-khi',
    facultyName: faculties[0]?.name || 'Khoa Cơ khí & Chế tạo máy',
    major: faculties[0]?.majors[0] || '',
    className: 'CĐ-CK24A',
    cohort: 'Khóa 50 (2024-2027)',
    trainingSystem: 'Chương trình Chuẩn Đức (DIHK)',
    status: 'Đang học',
    email: '',
    phone: '',
    idCard: '',
    address: 'Thái Nguyên',
    parentName: '',
    parentPhone: '',
    avatar: SAMPLE_AVATARS[0],
    dormitory: false,
    scholarship: false,
    policyCategory: 'Hỗ trợ 70% học phí nghề nặng nhọc độc hại (NĐ 81)',
    gpa10: 7.5,
    gpa4: 3.0,
    academicRank: 'Khá',
    conductScore: 85,
    conductRank: 'Tốt',
    creditsEarned: 30,
    totalCredits: 95,
    grades: [],
    tuition: [],
    attendanceSummary: {
      totalSessions: 120,
      present: 116,
      late: 2,
      excused: 2,
      unexcused: 0,
      absentPercentage: 1.6
    },
    notes: ''
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      // Generate unique ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newId = `VD-2024-${randomNum}`;
      setFormData(prev => ({
        ...prev,
        id: newId,
        avatar: SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)]
      }));
    }
  }, [student]);

  const handleFacultyChange = (facultyId: string) => {
    const selected = faculties.find(f => f.id === facultyId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        facultyId: selected.id,
        facultyName: selected.name,
        major: selected.majors[0] || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.id) return;

    // Recalculate rank
    const gpa10 = Number(formData.gpa10) || 7.0;
    let rank: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' = 'Khá';
    if (gpa10 >= 9.0) rank = 'Xuất sắc';
    else if (gpa10 >= 8.0) rank = 'Giỏi';
    else if (gpa10 >= 7.0) rank = 'Khá';
    else if (gpa10 >= 5.0) rank = 'Trung bình';
    else rank = 'Yếu';

    const gpa4 = Math.round((gpa10 / 10) * 4 * 10) / 10;

    const email = formData.email || `${formData.id.toLowerCase().replace('-', '')}@vietduc.edu.vn`;

    const finalStudent: Student = {
      ...(formData as Student),
      gpa10,
      gpa4,
      academicRank: rank,
      email
    };

    onSave(finalStudent);
    onClose();
  };

  const currentFaculty = faculties.find(f => f.id === formData.facultyId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold">
              {isEdit ? `Chỉnh Sửa Hồ Sơ Sinh Viên — ${student.fullName}` : 'Thêm Sinh Viên Mới Vào Hệ Thống'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
              1. Thông Tin Định Danh & Cá Nhân
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Mã sinh viên *</label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                  placeholder="VD: VD-2024-0012"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Họ và tên sinh viên *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="VD: Nguyễn Văn Nam"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Số CCCD / Định danh</label>
                <input
                  type="text"
                  value={formData.idCard}
                  onChange={e => setFormData({ ...formData, idCard: e.target.value })}
                  placeholder="0382..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0984..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Email sinh viên</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sinhvien@vietduc.edu.vn"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Hộ khẩu / Thường trú</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Thái Nguyên, Nghệ An, Hà Tĩnh..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Chuyên ngành & Đào tạo */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
              2. Đào Tạo & Khoa Chuyên Môn
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Khoa đào tạo *</label>
                <select
                  value={formData.facultyId}
                  onChange={e => handleFacultyChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Chuyên ngành đào tạo *</label>
                <select
                  value={formData.major}
                  onChange={e => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {currentFaculty?.majors.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Lớp sinh hoạt</label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={e => setFormData({ ...formData, className: e.target.value.toUpperCase() })}
                  placeholder="VD: CĐ-CK24A"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Khóa học</label>
                <select
                  value={formData.cohort}
                  onChange={e => setFormData({ ...formData, cohort: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Khóa 50 (2024-2027)">Khóa 50 (2024-2027)</option>
                  <option value="Khóa 49 (2023-2026)">Khóa 49 (2023-2026)</option>
                  <option value="Khóa 48 (2022-2025)">Khóa 48 (2022-2025)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Hệ đào tạo</label>
                <select
                  value={formData.trainingSystem}
                  onChange={e => setFormData({ ...formData, trainingSystem: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Chương trình Chuẩn Đức (DIHK)">Chuẩn Đức (DIHK)</option>
                  <option value="Cao đẳng nghề chính quy">Chính quy thường</option>
                  <option value="Liên thông - Vừa làm vừa học">Liên thông - VLVH</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Trạng thái học</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Tốt nghiệp">Tốt nghiệp</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                  <option value="Cảnh cáo học vụ">Cảnh cáo học vụ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Chính sách & Gia đình */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
              3. Chế Độ Chính Sách & Thông Tin Gia Đình
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Họ tên phụ huynh</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Họ tên bố/mẹ"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">SĐT liên hệ phụ huynh</label>
                <input
                  type="text"
                  value={formData.parentPhone}
                  onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="0912..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Chế độ miễn giảm / Nghị định 81</label>
              <select
                value={formData.policyCategory}
                onChange={e => setFormData({ ...formData, policyCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Hỗ trợ 70% học phí nghề nặng nhọc độc hại (NĐ 81)">Hỗ trợ 70% học phí nghề nặng nhọc độc hại (NĐ 81)</option>
                <option value="Hộ nghèo / Cận nghèo (Miễn 100%)">Hộ nghèo / Cận nghèo (Miễn 100%)</option>
                <option value="Con thương binh, liệt sĩ (Miễn 100%)">Con thương binh, liệt sĩ (Miễn 100%)</option>
                <option value="Dân tộc thiểu số vùng đặc biệt khó khăn">Dân tộc thiểu số vùng đặc biệt khó khăn</option>
                <option value="Không">Không thuộc diện chính sách</option>
              </select>
            </div>

            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dormitory}
                  onChange={e => setFormData({ ...formData, dormitory: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Ở Ký túc xá trường</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.scholarship}
                  onChange={e => setFormData({ ...formData, scholarship: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Học bổng khuyến khích</span>
              </label>
            </div>
          </div>

          {/* Section 4: Ảnh đại diện & Ghi chú */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
              4. Ảnh Thẻ & Nhận Xét Ban Đầu
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Chọn ảnh đại diện / ảnh thẻ</label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {SAMPLE_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      formData.avatar === url ? 'border-blue-600 ring-2 ring-blue-400 scale-105' : 'border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="avatar option" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Ghi chú học vụ / Nhận xét của cố vấn</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Nhận xét ý thức thực hành, tham gia phong trào, khen thưởng..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Cập Nhật Hồ Sơ' : 'Lưu Sinh Viên Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
