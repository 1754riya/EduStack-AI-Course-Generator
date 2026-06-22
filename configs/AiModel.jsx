import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
});

// Wraps generateContent so callers can use the same .sendMessage(prompt) interface
const makeSession = () => ({
  sendMessage: async (prompt) => model.generateContent(prompt),
});

export const GenerateCourseLayout_AI = makeSession();
export const GenerateChapterContent_AI = makeSession();
