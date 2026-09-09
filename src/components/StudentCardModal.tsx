import React, { useState } from 'react';
import { X, Printer, Download, CreditCard, ShieldCheck, QrCode } from 'lucide-react';
import { Student } from '../types';

interface StudentCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  student,
  onClose
}) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Top */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">Thẻ Sinh Viên Điện Tử — Cao Đẳng Việt Đức</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview Container */}
        <div className="p-8 bg-slate-100 flex flex-col items-center gap-6 overflow-y-auto">
          {/* Card Front */}
          <div className="w-full max-w-[460px] aspect-[1.586/1] bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden border border-blue-400/30 flex flex-col justify-between print:shadow-none print:border-slate-400">
            {/* Background watermark/patterns */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 via-yellow-500 to-blue-600 p-0.5 flex items-center justify-center shadow">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-black text-xs">
                    <span className="text-red-500">V</span>
                    <span className="text-amber-400">Đ</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-extrabold uppercase tracking-wide text-white leading-tight">
                    TRƯỜNG CAO ĐẲNG Y TẾ VÀ TRANG THIẾT BỊ VIỆT ĐỨC
                  </h3>
                  <p className="text-[9px] text-amber-300 font-medium tracking-wider">
                    VIET DUC VOCATIONAL COLLEGE • DIHK PARTNER
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
                THẺ SINH VIÊN
              </span>
            </div>

            {/* Main content: Photo + info */}
            <div className="flex items-center gap-4 my-auto pt-2">
              <div className="relative flex-shrink-0">
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 rounded-lg object-cover border-2 border-white/40 shadow"
                />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-bold px-1 rounded text-white shadow">
                  {student.cohort.split(' ')[0]}
                </div>
              </div>

              <div className="space-y-1 text-left flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-extrabold text-amber-300 truncate uppercase">
                  {student.fullName}
                </h4>
                <p className="text-[11px] text-slate-200">
                  Mã SV: <strong className="font-mono text-white text-xs">{student.id}</strong>
                </p>
                <p className="text-[10px] text-slate-300 truncate">
                  Lớp: <strong className="text-white">{student.className}</strong> • Hệ: {student.trainingSystem.includes('Chuẩn Đức') ? 'Chuẩn Đức' : 'Chính quy'}
                </p>
                <p className="text-[10px] text-blue-200 truncate">
                  Ngành: <strong className="text-white">{student.major}</strong>
                </p>
                <p className="text-[9px] text-slate-400">
                  Khoa: {student.facultyName}
                </p>
              </div>
            </div>

            {/* Bottom Bar: Barcode / QR Simulation & Expiry */}
            <div className="border-t border-white/15 pt-2 flex items-center justify-between text-[9px] text-slate-300">
              <div className="flex items-center gap-2 font-mono tracking-widest text-[10px] text-slate-400">
                <span>||||| ||| |||| ||||| |||</span>
                <span className="text-white">{student.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-slate-400">Giá trị đến: </span>
                <strong className="text-amber-300">30/09/2026</strong>
              </div>
            </div>
          </div>

          {/* Card Back Info */}
          <div className="w-full max-w-[460px] aspect-[1.586/1] bg-white rounded-2xl p-5 text-slate-800 shadow-md border border-slate-300 flex flex-col justify-between text-[10px]">
            <div>
              <h4 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 text-center">
                QUY ĐỊNH SỬ DỤNG THẺ
              </h4>
              <ul className="list-disc list-inside space-y-1 mt-2 text-slate-600 text-[9px]">
                <li>Thẻ sinh viên có giá trị sử dụng trong khuôn viên và thư viện trường.</li>
                <li>Sinh viên phải đeo thẻ khi đến giảng đường, xưởng thực hành công nghệ Đức.</li>
                <li>Không được cho người khác mượn thẻ. Mất thẻ phải báo ngay cho Phòng Đào tạo.</li>
                <li>Website: <strong className="text-blue-600">vietduc.edu.vn</strong> • Hotline: 0208 3862 123</li>
              </ul>
            </div>

            <div className="flex items-end justify-between pt-2 border-t border-slate-200">
              <div className="text-[8px] text-slate-400">
                <p>Số CCCD: {student.idCard}</p>
                <p>Ngày cấp: 15/10/2023</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-slate-800 uppercase">HIỆU TRƯỞNG</p>
                <div className="w-16 h-8 mx-auto my-1 flex items-center justify-center text-red-600 text-[9px] border border-red-300 border-dashed rounded font-serif italic">
                  (Đã ký & đóng dấu)
                </div>
                <p className="text-[8px] font-semibold text-slate-700">PGS.TS. Hiệu Trưởng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Hỗ trợ in màu thẻ kích thước chuẩn ATM (85.6mm x 53.98mm)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Thẻ Sinh Viên</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
