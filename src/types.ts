export interface SubjectGrade {
  code: string;
  name: string;
  credits: number;
  attendanceScore: number; // 10%
  midtermScore: number;    // 30%
  finalScore: number;      // 60%
  totalScore10: number;    // Hệ 10
  totalScore4: number;     // Hệ 4
  letterGrade: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  semester: string;
}

export interface AttendanceRecord {
  date: string;
  session: 'Sáng' | 'Chiều';
  subject: string;
  status: 'present' | 'late' | 'excused' | 'unexcused'; // Có mặt, Đi trễ, Vắng có phép, Vắng không phép
  note?: string;
}

export interface TuitionRecord {
  semester: string;
  academicYear: string;
  originalFee: number;
  discountPercentage: number; // 0, 70 (theo NĐ 81 nghề nặng nhọc độc hại), 100
  discountReason?: string;
  finalFee: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  dueDate: string;
  paymentDate?: string;
  receiptNumber?: string;
}

export interface Student {
  id: string;             // VD: VD-2023-0102
  fullName: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  facultyId: string;
  facultyName: string;
  major: string;
  className: string;
  cohort: string;        // Khóa 48 (2022-2025), K49 (2023-2026), K50 (2024-2027)
  trainingSystem: 'Chương trình Chuẩn Đức (DIHK)' | 'Cao đẳng nghề chính quy' | 'Liên thông - Vừa làm vừa học';
  status: 'Đang học' | 'Bảo lưu' | 'Tốt nghiệp' | 'Cảnh cáo học vụ';
  email: string;
  phone: string;
  idCard: string;        // Số CCCD
  address: string;
  parentName: string;
  parentPhone: string;
  avatar: string;
  dormitory: boolean;    // KTX
  scholarship: boolean;  // Nhận học bổng khuyến khích
  policyCategory: string; // Diện chính sách (Con TB/LS, Hộ nghèo, Nghề đặc thù NĐ81, Không)
  
  // Học tập & Điểm số
  gpa10: number;
  gpa4: number;
  academicRank: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';
  conductScore: number;  // Điểm rèn luyện
  conductRank: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  creditsEarned: number;
  totalCredits: number;

  // Chi tiết
  grades: SubjectGrade[];
  tuition: TuitionRecord[];
  attendanceSummary: {
    totalSessions: number;
    present: number;
    late: number;
    excused: number;
    unexcused: number;
    absentPercentage: number;
  };
  notes?: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  iconName: string;
  dean: string;
  majors: string[];
}

export type UserRole = 'teacher' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string; // VD: ThS. Giảng viên Khoa Cơ khí
  facultyId?: string;
  facultyName?: string;
  homeroomClass?: string; // Lớp chủ nhiệm (VD: CĐ-CK23A)
  teachingSubjects?: string[];
  phone?: string;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: string; // Thứ 2, Thứ 3...
  timeSlot: string;  // 07:30 - 11:30, 13:00 - 17:00
  subjectName: string;
  subjectCode: string;
  className: string;
  room: string; // Xưởng CNC Chuẩn Đức X1, Giảng đường A2-203, Xưởng Ô tô X3
  type: 'Thực hành xưởng' | 'Lý thuyết kỹ thuật';
}

export interface ClassAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  className: string;
  teacherName: string;
  priority: 'high' | 'normal';
}

