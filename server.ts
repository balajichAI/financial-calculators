import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for Google Search Grounded Financial Query
  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query is required" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
          systemInstruction: "You are WealthCalc Copilot, an elite professional financial assistant. Answer the user's financial queries precisely and objectively, utilizing Google Search results to provide up-to-date and accurate context (interest rates, tax slabs, top mutual funds, market indicators). Always structure the response using clear Markdown formatting, bullet points, or tables to make it highly readable.",
          tools: [{ googleSearch: {} }],
        },
      });

      // Extract text answer and grounding metadata
      const text = response.text;
      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;

      // Extract search queries and sources
      const searchQueries = groundingMetadata?.webSearchQueries || [];
      const chunks = groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          title: c.web.title,
          uri: c.web.uri,
        }));

      res.json({
        answer: text,
        searchQueries,
        sources,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "An error occurred during search" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
