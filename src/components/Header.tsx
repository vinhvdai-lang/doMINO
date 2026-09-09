import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  Sparkles, 
  PlusCircle, 
  RotateCcw,
  CheckCircle2,
  LogIn,
  LogOut,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  totalStudents: number;
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onResetData,
  totalStudents,
  currentUser,
  onOpenLogin,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner / Identity Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-900/40 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-lg tracking-wider text-white">
                <span className="text-red-500">V</span>
                <span className="text-amber-400">Đ</span>
              </div>
            </div>
            {/* Small flag pin */}
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-slate-900 text-amber-300">
              V-D
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                TRƯỜNG CAO ĐẲNG Y TẾ VÀ TRANG THIẾT BỊ VIỆT ĐỨC
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Chuẩn DIHK Đức
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Hệ thống Quản lý Sinh viên & Học vụ Điện tử</span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline text-slate-400">Niên khóa 2024 - 2025</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-medium">{totalStudents} Sinh viên đã ghi danh</span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons & User Profile */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            id="btn-add-student"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm Sinh Viên</span>
          </button>

          <button
            id="btn-reset-data"
            onClick={onResetData}
            title="Khôi phục lại dữ liệu mẫu gốc"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dữ liệu mẫu</span>
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-slate-600"
                />
                <div className="text-left hidden lg:block">
                  <p className="font-bold text-white text-[11px] leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[9px] text-amber-400">
                    {currentUser.role === 'teacher' ? 'Giáo viên' : 'Quản trị viên'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-xs text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {currentUser.title}
                    </span>
                  </div>

                  {currentUser.role === 'teacher' && (
                    <button
                      onClick={() => {
                        setActiveTab('teacher-workspace');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Vào Cổng Làm Việc Giáo Viên</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Đổi tài khoản đăng nhập</span>
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all focus:outline-none active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {/* Teacher Workspace Tab */}
          {currentUser && currentUser.role === 'teacher' && (
            <button
              id="tab-teacher-workspace"
              onClick={() => setActiveTab('teacher-workspace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'teacher-workspace'
                  ? 'bg-amber-500 text-slate-950 shadow font-bold'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Cổng Giảng Viên ({currentUser.homeroomClass || 'Lớp CN'})</span>
            </button>
          )}

          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tổng quan & Báo cáo</span>
          </button>

          <button
            id="tab-students"
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'students'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Hồ sơ Sinh viên</span>
          </button>

          <button
            id="tab-grades"
            onClick={() => setActiveTab('grades')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'grades'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Bảng điểm & Học bạ</span>
          </button>

          <button
            id="tab-attendance"
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'attendance'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Điểm danh & Chuyên cần</span>
          </button>

          <button
            id="tab-tuition"
            onClick={() => setActiveTab('tuition')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'tuition'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Học phí & Chính sách (NĐ 81)</span>
          </button>

          <button
            id="tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-indigo-300 border border-indigo-500/40 font-semibold shadow-inner'
                : 'text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Trợ lý AI Cố Vấn</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
