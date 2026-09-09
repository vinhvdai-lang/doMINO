import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  LogIn, 
  UserCheck, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';
import { UserAccount } from '../types';
import { DEMO_USERS } from '../data/authData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const user = DEMO_USERS.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
    );

    if (user) {
      const { password: _, ...userAccount } = user;
      onLoginSuccess(userAccount);
      onClose();
    } else {
      setError('Email hoặc mật khẩu không chính xác. Bạn có thể bấm chọn tài khoản mẫu bên dưới để đăng nhập ngay!');
    }
  };

  const handleQuickLogin = (demoUser: typeof DEMO_USERS[0]) => {
    const { password: _, ...userAccount } = demoUser;
    onLoginSuccess(userAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-lg">
                <span className="text-red-500">V</span>
                <span className="text-amber-400">Đ</span>
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Cổng Đăng Nhập Giảng Viên & Cán Bộ</h2>
              <p className="text-xs text-slate-300 mt-0.5">Trường Cao đẳng Y tế và Trang thiết bị Việt Đức</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Giảng viên / Tài khoản quản trị
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="giaovien@vietduc.edu.vn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Mật khẩu đăng nhập
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Hệ Thống</span>
            </button>
          </form>

          {/* Quick 1-click accounts */}
          <div className="pt-2 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Đăng nhập nhanh tài khoản mẫu (1-Click Login):</span>
            </p>

            <div className="space-y-2">
              {DEMO_USERS.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-700 text-xs">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {u.title}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {u.role === 'teacher' ? 'Giáo viên' : 'Quản trị'} →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 px-6 text-[11px] text-slate-500 text-center">
          Hệ thống xác thực nội bộ Trường Cao đẳng Y tế và Trang thiết bị Việt Đức
        </div>
      </div>
    </div>
  );
};
