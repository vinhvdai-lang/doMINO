import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Award, 
  Briefcase, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Student } from '../types';

interface AIAssistantModalProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  students,
  selectedStudent,
  onSelectStudent
}) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(selectedStudent || students[0] || null);
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState('Đánh giá học tập & Nhận xét học bạ');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleQuickPrompt = (type: string, customPrompt: string) => {
    setTaskType(type);
    setPrompt(customPrompt);
    sendAIRequest(customPrompt, type);
  };

  const sendAIRequest = async (userPrompt: string, selectedTaskType: string) => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch('/api/gemini/student-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userPrompt,
          studentData: currentStudent,
          taskType: selectedTaskType
        })
      });

      const data = await response.json();
      if (data.result) {
        setAiResponse(data.result);
      } else if (data.error) {
        setAiResponse(`Thông báo: ${data.error}`);
      } else {
        setAiResponse('Không nhận được phản hồi từ máy chủ AI.');
      }
    } catch (err: any) {
      console.error(err);
      setAiResponse(
        `Lưu ý: Không thể kết nối với máy chủ AI (${err.message || 'Lỗi mạng'}). Vui lòng kiểm tra cấu hình GEMINI_API_KEY.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                Trợ Lý AI Cố Vấn Học Vụ & Đào Tạo Nghề Việt Đức
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Tự động đánh giá học bạ, cảnh báo học vụ, tư vấn lộ trình thực tập chuẩn Đức & giải đáp quy chế đào tạo
              </p>
            </div>
          </div>

          {/* Student Selector */}
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 px-3 rounded-xl border border-indigo-400/30 text-xs">
            <span className="text-indigo-300">Chọn sinh viên:</span>
            <select
              value={currentStudent?.id || ''}
              onChange={e => {
                const s = students.find(item => item.id === e.target.value);
                if (s) {
                  setCurrentStudent(s);
                  onSelectStudent(s);
                  setAiResponse(null);
                }
              }}
              className="bg-slate-900 text-white font-semibold rounded-lg px-2.5 py-1 border border-slate-700 focus:ring-1 focus:ring-amber-400 text-xs"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.id} - {s.className})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls / Right Chat Response */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student summary + Quick prompts */}
        <div className="space-y-4">
          {/* Selected Student Info Card */}
          {currentStudent && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.fullName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentStudent.fullName}</h3>
                  <p className="text-[11px] text-slate-500">{currentStudent.id} • {currentStudent.className}</p>
                  <p className="text-[11px] text-blue-600 font-medium">{currentStudent.major}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">GPA Hệ 10</span>
                  <strong className="text-sm font-bold text-slate-900">{currentStudent.gpa10}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Xếp loại</span>
                  <strong className="text-xs font-bold text-blue-700">{currentStudent.academicRank}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Điểm rèn luyện</span>
                  <strong className="text-xs font-bold text-emerald-700">{currentStudent.conductScore}/100</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Tỷ lệ vắng mặt</span>
                  <strong className={`text-xs font-bold ${
                    (currentStudent.attendanceSummary?.absentPercentage || 0) > 15 ? 'text-red-600' : 'text-slate-700'
                  }`}>
                    {currentStudent.attendanceSummary?.absentPercentage || 0}%
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Quick AI Prompts */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Kịch Bản Cố Vấn Tự Động
            </h4>

            <button
              onClick={() => handleQuickPrompt(
                'Nhận xét học bạ',
                `Hãy viết bản nhận xét học vụ và rèn luyện chính thức cho sinh viên ${currentStudent?.fullName}, nêu rõ ưu điểm về điểm các môn chuyên ngành thực hành, tinh thần kỷ luật và đề xuất khen thưởng hoặc định hướng kỳ tới.`
              )}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-start gap-2.5 group"
            >
              <Award className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-bold text-slate-800">Nhận xét học bạ & Đánh giá</p>
                <p className="text-[10px] text-slate-500">Soạn thảo lời nhận xét chính thức cho sổ liên lạc và học bạ</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickPrompt(
                'Cảnh báo học vụ & Cải thiện GPA',
                `Dựa vào điểm số và chuyên cần của sinh viên ${currentStudent?.fullName}, hãy phân tích các môn có nguy cơ phải thi lại/học lại, cảnh báo số tiết vắng và lập kế hoạch 4 bước giúp sinh viên cải thiện kết quả học tập trong 6 tuần tới.`
              )}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-start gap-2.5 group"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-bold text-slate-800">Cảnh báo học vụ & Lộ trình học</p>
                <p className="text-[10px] text-slate-500">Kế hoạch khắc phục môn nợ & giảm thiểu nguy cơ cấm thi</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickPrompt(
                'Tư vấn thực tập & Nghề nghiệp',
                `Hãy tư vấn các cơ hội thực tập nghề và việc làm phù hợp cho sinh viên ngành ${currentStudent?.major} của Cao đẳng Việt Đức tại các doanh nghiệp đối tác lớn (Samsung, Foxconn, VinFast hoặc chương trình tu nghiệp CHLB Đức). Nêu rõ các kỹ năng nghề và chứng chỉ cần bổ sung.`
              )}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all flex items-start gap-2.5 group"
            >
              <Briefcase className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-bold text-slate-800">Tư vấn việc làm & Thực tập Đức</p>
                <p className="text-[10px] text-slate-500">Định hướng đầu ra theo chuẩn kỹ năng nghề DIHK</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickPrompt(
                'Tạo đơn sinh viên',
                `Hãy soạn thảo mẫu 'Đơn Xin Xác Nhận Sinh Viên Đang Theo Học' tại Trường Cao đẳng Y tế và Trang thiết bị Việt Đức đầy đủ quy chuẩn hành chính để sinh viên ${currentStudent?.fullName} nộp xin vay vốn ngân hàng chính sách xã hội hoặc tạm hoãn nghĩa vụ quân sự.`
              )}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-start gap-2.5 group"
            >
              <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-bold text-slate-800">Soạn Đơn / Giấy xác nhận SV</p>
                <p className="text-[10px] text-slate-500">Mẫu đơn vay vốn, tạm hoãn nghĩa vụ, xác nhận học tập</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: AI Output & Custom Input Box */}
        <div className="lg:col-span-2 space-y-4">
          {/* Output Display Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[380px] flex flex-col justify-between overflow-hidden">
            {/* Output Header */}
            <div className="p-3 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-800">Phản hồi của Cố vấn AI</span>
                {taskType && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                    {taskType}
                  </span>
                )}
              </div>

              {aiResponse && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép nhận xét</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Output Content */}
            <div className="p-6 flex-1 text-xs sm:text-sm text-slate-800 overflow-y-auto leading-relaxed whitespace-pre-line">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16 space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="font-medium text-xs">Trợ lý AI đang phân tích dữ liệu học vụ và chuẩn bị lời khuyên...</p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-3">
                  <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 text-slate-800 leading-relaxed font-sans">
                    {aiResponse}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16 space-y-2 text-center">
                  <Sparkles className="w-10 h-10 text-slate-300" />
                  <p className="font-semibold text-slate-600">Chọn một kịch bản bên trái hoặc nhập câu hỏi bên dưới</p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Trợ lý AI được huấn luyện theo quy chế đào tạo nghề tín chỉ và hợp tác đào tạo song hành CHLB Đức của Trường Cao đẳng Y tế và Trang thiết bị Việt Đức.
                  </p>
                </div>
              )}
            </div>

            {/* Prompt Input Form */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  sendAIRequest(prompt, 'Yêu cầu tùy chỉnh');
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Hỏi AI về quy chế đào tạo, tư vấn học bổng, hay viết nhận xét cho sinh viên..."
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi AI</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
