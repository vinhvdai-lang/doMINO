import { UserAccount, ScheduleItem, ClassAnnouncement } from '../types';

export const DEMO_USERS: (UserAccount & { password: string })[] = [
  {
    id: 'GV-CK-01',
    name: 'ThS. Nguyễn Văn Đức',
    email: 'duc.nv@vietduc.edu.vn',
    password: '123',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    title: 'Trưởng Khoa Cơ khí • GVCN Lớp CĐ-CK23A',
    facultyId: 'co-khi',
    facultyName: 'Khoa Cơ khí & Chế tạo máy',
    homeroomClass: 'CĐ-CK23A',
    teachingSubjects: [
      'Gia công Phay - Tiện CNC tiêu chuẩn Đức (CK202)',
      'Vẽ kỹ thuật cơ khí & SolidWorks (CK101)',
      'Dung sai đo lường & Kiểm định kỹ thuật (CK301)'
    ],
    phone: '0988 123 456'
  },
  {
    id: 'GV-OTO-02',
    name: 'TS. Phạm Minh Tuấn',
    email: 'tuan.pm@vietduc.edu.vn',
    password: '123',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    title: 'Giảng viên chính Khoa Ô tô • GVCN Lớp CĐ-OTO23B',
    facultyId: 'o-to',
    facultyName: 'Khoa Công nghệ Ô tô',
    homeroomClass: 'CĐ-OTO23B',
    teachingSubjects: [
      'Hệ thống Điện & Điều khiển trên ô tô (OTO201)',
      'Nguyên lý Động cơ đốt trong (OTO101)',
      'Thực hành bảo dưỡng gầm xe ô tô (OTO202)'
    ],
    phone: '0912 345 789'
  },
  {
    id: 'GV-CNTT-03',
    name: 'ThS. Đỗ Quang Huy',
    email: 'huy.dq@vietduc.edu.vn',
    password: '123',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    title: 'Phó Trưởng Khoa CNTT • GVCN Lớp CĐ-CNTT23',
    facultyId: 'cntt',
    facultyName: 'Khoa Công nghệ Thông tin',
    homeroomClass: 'CĐ-CNTT23',
    teachingSubjects: [
      'Thiết kế & Lập trình Web Frontend (IT201)',
      'Lập trình C/C++ và Cấu trúc dữ liệu (IT101)',
      'Hệ quản trị CSDL MySQL & SQL Server (IT202)'
    ],
    phone: '0977 889 900'
  },
  {
    id: 'ADMIN-01',
    name: 'Phòng Đào tạo & Quản lý Học sinh Sinh viên',
    email: 'admin@vietduc.edu.vn',
    password: 'admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    title: 'Quản trị viên Hệ thống • Ban Giám Hiệu',
    phone: '0208 3862 123'
  }
];

export const INITIAL_SCHEDULES: Record<string, ScheduleItem[]> = {
  'GV-CK-01': [
    {
      id: 'SCH-01',
      dayOfWeek: 'Thứ 2',
      timeSlot: '07:30 - 11:30',
      subjectName: 'Gia công Phay - Tiện CNC tiêu chuẩn Đức',
      subjectCode: 'CK202',
      className: 'CĐ-CK23A',
      room: 'Xưởng CNC Công nghệ cao Đức (Xưởng X1)',
      type: 'Thực hành xưởng'
    },
    {
      id: 'SCH-02',
      dayOfWeek: 'Thứ 3',
      timeSlot: '13:00 - 16:30',
      subjectName: 'Vẽ kỹ thuật cơ khí & SolidWorks',
      subjectCode: 'CK101',
      className: 'CĐ-CK23A',
      room: 'Phòng Máy tính CAD/CAM A3-102',
      type: 'Lý thuyết kỹ thuật'
    },
    {
      id: 'SCH-03',
      dayOfWeek: 'Thứ 5',
      timeSlot: '07:30 - 11:30',
      subjectName: 'Dung sai đo lường & Kiểm định kỹ thuật',
      subjectCode: 'CK301',
      className: 'CĐ-CK23A',
      room: 'Phòng Thí nghiệm Đo lường X2-201',
      type: 'Thực hành xưởng'
    },
    {
      id: 'SCH-04',
      dayOfWeek: 'Thứ 6',
      timeSlot: '14:00 - 16:00',
      subjectName: 'Sinh hoạt lớp chủ nhiệm & Đánh giá rèn luyện',
      subjectCode: 'SHL',
      className: 'CĐ-CK23A',
      room: 'Giảng đường A2-205',
      type: 'Lý thuyết kỹ thuật'
    }
  ],
  'GV-OTO-02': [
    {
      id: 'SCH-05',
      dayOfWeek: 'Thứ 2',
      timeSlot: '07:30 - 11:30',
      subjectName: 'Hệ thống Điện & Điều khiển trên ô tô',
      subjectCode: 'OTO201',
      className: 'CĐ-OTO23B',
      room: 'Xưởng Chẩn đoán Điện Ô tô X4',
      type: 'Thực hành xưởng'
    },
    {
      id: 'SCH-06',
      dayOfWeek: 'Thứ 4',
      timeSlot: '13:00 - 17:00',
      subjectName: 'Thực hành bảo dưỡng gầm xe ô tô',
      subjectCode: 'OTO202',
      className: 'CĐ-OTO23B',
      room: 'Xưởng Cơ dưỡng Gầm X5',
      type: 'Thực hành xưởng'
    }
  ],
  'GV-CNTT-03': [
    {
      id: 'SCH-07',
      dayOfWeek: 'Thứ 3',
      timeSlot: '07:30 - 11:30',
      subjectName: 'Thiết kế & Lập trình Web Frontend',
      subjectCode: 'IT201',
      className: 'CĐ-CNTT23',
      room: 'Phòng Lab CNTT A1-401',
      type: 'Thực hành xưởng'
    },
    {
      id: 'SCH-08',
      dayOfWeek: 'Thứ 5',
      timeSlot: '13:00 - 17:00',
      subjectName: 'Hệ quản trị CSDL MySQL & SQL Server',
      subjectCode: 'IT202',
      className: 'CĐ-CNTT23',
      room: 'Phòng Lab CNTT A1-402',
      type: 'Thực hành xưởng'
    }
  ]
};

export const INITIAL_ANNOUNCEMENTS: ClassAnnouncement[] = [
  {
    id: 'TB-01',
    title: 'Lịch kiểm tra đánh giá kỹ năng tay nghề mô-đun Phay CNC',
    content: 'Yêu cầu toàn bộ sinh viên lớp CĐ-CK23A có mặt đúng 7h30 tại Xưởng Đức X1 mang theo bảo hộ lao động đầy đủ để thi thực hành tay nghề.',
    date: '2025-03-01',
    className: 'CĐ-CK23A',
    teacherName: 'ThS. Nguyễn Văn Đức',
    priority: 'high'
  },
  {
    id: 'TB-02',
    title: 'Nhắc nhở hoàn thiện hồ sơ miễn giảm học phí NĐ 81',
    content: 'Các bạn sinh viên thuộc diện chính sách và nghề nặng nhọc độc hại khẩn trương nộp bản sao công chứng CCCD và giấy xác nhận về văn phòng Khoa trước ngày 15.',
    date: '2025-02-28',
    className: 'CĐ-CK23A',
    teacherName: 'ThS. Nguyễn Văn Đức',
    priority: 'normal'
  },
  {
    id: 'TB-03',
    title: 'Kế hoạch tham quan kiến tập tại Nhà máy VinFast Hải Phòng',
    content: 'Đoàn trường và Khoa Công nghệ Ô tô tổ chức chuyến đi thực tế doanh nghiệp 02 ngày vào cuối tháng cho các bạn sinh viên đạt ĐRL tốt trở lên.',
    date: '2025-03-02',
    className: 'CĐ-OTO23B',
    teacherName: 'TS. Phạm Minh Tuấn',
    priority: 'high'
  }
];
