import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Server-side AI Assistant endpoint using Gemini 3.8 Flash
  app.post('/api/gemini/student-ai', async (req, res) => {
    try {
      const { prompt, studentData, taskType } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({
          error: 'Chưa cấu hình GEMINI_API_KEY trên hệ thống.',
          result: 'Không thể kết nối dịch vụ AI: Thiếu API Key.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = 
        'Bạn là Cố Vấn Học Vụ & Quản Lý Đào Tạo AI của Trường Cao đẳng Y tế và Trang thiết bị Việt Đức. ' +
        'Bạn có kiến thức sâu rộng về giáo dục nghề nghiệp y tế, thiết bị y tế kỹ thuật cao chuẩn quốc tế và CHLB Đức, quy chế tín chỉ, điểm rèn luyện, ' +
        'chế độ chính sách Nghị định 81/2021/NĐ-CP (miễn giảm học phí đối với các chuyên ngành theo quy định), ' +
        'và cơ hội thực tập, việc làm tại các bệnh viện, viện nghiên cứu, doanh nghiệp thiết bị y tế. ' +
        'Hãy đưa ra câu trả lời chi tiết, thực tế, ân cần, mang tính định hướng cao bằng tiếng Việt trang trọng, tích cực.';

      let fullPrompt = prompt;
      if (studentData) {
        fullPrompt = 
          `Dữ liệu học tập sinh viên:\n` +
          `- Mã SV: ${studentData.id}\n` +
          `- Họ và tên: ${studentData.fullName} (Giới tính: ${studentData.gender})\n` +
          `- Khoa: ${studentData.facultyName} | Ngành: ${studentData.major}\n` +
          `- Lớp: ${studentData.className} | Niên khóa: ${studentData.cohort}\n` +
          `- Hệ đào tạo: ${studentData.trainingSystem}\n` +
          `- Trạng thái: ${studentData.status}\n` +
          `- Điểm TB tích lũy (GPA): ${studentData.gpa10}/10 (Hệ 4: ${studentData.gpa4})\n` +
          `- Xếp loại học tập: ${studentData.academicRank} | Điểm rèn luyện: ${studentData.conductScore}/100 (${studentData.conductRank})\n` +
          `- Tỷ lệ vắng mặt: ${studentData.attendanceSummary?.absentPercentage || 0}%\n` +
          `- Chế độ chính sách: ${studentData.policyCategory || 'Không'}\n` +
          `- Ghi chú hiện tại: ${studentData.notes || 'Không'}\n\n` +
          `Yêu cầu thực hiện [${taskType || 'Phân tích'}] : ${prompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error('Error generating AI response:', err);
      res.status(500).json({
        error: err.message || 'Lỗi xử lý yêu cầu AI',
        result: 'Đã xảy ra sự cố khi trao đổi với AI Cố vấn học vụ. Vui lòng thử lại sau.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Quản lý Sinh viên Cao đẳng Việt Đức running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
