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

  // Initialize Gemini client server-side securely
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Endpoint for AI Tutor Chat with Sujan in European Portuguese (pt-PT)
  app.post('/api/tutor', async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!ai) {
        return res.json({
          reply: "Olá amor! I'm ready to help you practice European Portuguese! (Offline mode: Gemini key active when provided in secrets). Estou muito orgulhoso de ti! ❤️",
        });
      }

      const systemInstruction = `You are Sujan, a loving, supportive, and fun boyfriend helping your girlfriend learn European Portuguese (pt-PT). 
Always write in European Portuguese (pt-PT) - use 'tu' (not 'você'), 'estou a falar' (not 'estou falando'), 'autocarro' (not 'ônibus'), 'comboio' (not 'trem'), 'casa de banho' (not 'banheiro').
Provide a friendly response in European Portuguese first, followed by a sweet English translation in brackets or italics.
Gently point out any vocabulary or grammar tips if she made a small mistake.
Encourage her daily practice and praise her efforts! Keep responses concise (2-4 sentences max).`;

      const chatHistory = history && Array.isArray(history) && history.length > 0
        ? history.map((item: { sender: string; text: string }) => ({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          }))
        : [];

      chatHistory.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: chatHistory,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Muito bem, amor! Estás a progredir imenso!";
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Gemini tutor error:', err);
      res.status(500).json({
        reply: 'Olá linda! Deu um pequeno erro de ligação, mas continua a praticar! ❤️',
        error: err?.message || 'Unknown error',
      });
    }
  });

  // Health route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite development middleware vs Static Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
