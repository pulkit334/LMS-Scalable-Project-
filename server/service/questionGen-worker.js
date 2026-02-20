require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const Transcript = require("../models/transcription");
const Question = require("../models/questionModal");
const SubSection = require("../models/subsection");

const connection = new IORedis({ maxRetriesPerRequest: null });

function sanitizeAIOutput(text) {
  const banned = [
    /google/gi,
    /gemini/gi,
    /large language model/gi,
    /ai model/gi,
    /developed by/gi,
  ];
  let clean = text;
  for (const pattern of banned) {
    clean = clean.replace(pattern, "");
  }
  return clean;
}

const worker = new Worker(
  "QuestionQueue",
  async (job) => {
    const { subsectionId } = job.data;

    try {
      const transcript = await Transcript.findOne({ subsectionId });

      if (!transcript?.rawText) {
        throw new Error("Transcript not found or empty");
      }

      const prompt = `
You are an LMS question generator.
Generate EXACTLY 5 multiple-choice questions from the transcript.
Return ONLY a valid JSON array, no markdown, no extra text.

Format:
[
  {
    "question": "...",
    "options": ["A","B","C","D"],
    "answer": "...",
    "explanation": "...",
    "difficulty": "EASY || MEDIUM || HARD"
  }
]

Transcript:
${transcript.rawText }
`;

      const response = await fetch(`http://localhost:11434/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL,
          messages: [{ role: "user", content: prompt }],
          stream: false,
          options: {
            temperature: 0.3,
          },
        }),
      });

      const data = await response.json();
      console.log("Ollama raw response:", JSON.stringify(data, null, 2));

      if (!data.message?.content) {
        throw new Error(`Ollama returned no content: ${JSON.stringify(data)}`);
      }

      let text = data.message.content;
      text = sanitizeAIOutput(text);

      let questions = [];
      try {
        const clean = text.replace(/```json|```/g, "").trim();
        questions = JSON.parse(clean);
      } catch (err) {
        console.error("JSON parse failed:", text);
        throw new Error("AI returned invalid JSON");
      }

      await Question.insertMany(questions.map((q) => ({ ...q, subsectionId })));

      await SubSection.findByIdAndUpdate(subsectionId, { status: "READY" });
      console.log("Questions generated successfully!");

    } catch (err) {
      await SubSection.findByIdAndUpdate(subsectionId, { status: "FAILED" });
      console.error("Worker failed:", err);
      throw err;
    }
  },
  { connection },
);

worker.on("completed", (job) => console.log("Questions done:", job.id));
worker.on("failed", (job, err) => console.error("Failed:", job?.id, err));