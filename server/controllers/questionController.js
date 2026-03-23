const Question = require("../models/questionModal");
const Subsection = require("../models/subsection");
const Transcript = require("../models/transcription");
const IORedis  = require("ioredis");
exports.GetAiRoute = async (req, res) => {
  try {
    const { lectureId } = req.params;
// ✅ Check Redis cache first
    const cacheKey = `questions:${lectureId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
return res.status(200).json({
        success: true,
        data: JSON.parse(cached),
      });
    }

    const allQuestions = await Question.find({}).lean();
console.log("Sample subsectionId from DB:", allQuestions[0]?.subsectionId);

    const questions = await Question.find({ subsectionId: lectureId }).lean();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this lecture",
      });
    }

    // ✅ Cache for 24hrs
    await redis.setex(cacheKey, 86400, JSON.stringify(questions));
return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (err) {
return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.GetAiNotesRoute = async (req, res) => {
  try {
    const { subsectionId } = req.params;

    const subsection = await Subsection.findById(subsectionId).lean();
    if (!subsection) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    //  Only check notesStatus — no notesUrl needed
    if (subsection.notesStatus === "done") {
      return res.status(200).json({
        success: true,
        status: "done",
      });
    }

    if (subsection.notesStatus === "pending") {
      return res.status(200).json({
        success: true,
        status: "pending",
        message: "Notes are being generated...",
      });
    }

    return res.status(200).json({
      success: false,
      status: "failed",
      message: "Notes not available yet.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.DownloadNotes = async (req, res) => {
  try {
    const { subsectionId } = req.params;

    //  Check Redis cache first
    const cached = await redis.getBuffer(`notes:${subsectionId}`);
    if (cached) {
res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="lecture-notes.pdf"`,
      );
      return res.send(cached);
    }

    //  Not cached — generate fresh
    const transcript = await Transcript.findOne({ subsectionId }).lean();
    if (!transcript?.rawText) {
      return res
        .status(404)
        .json({ success: false, message: "Transcript not found" });
    }

    const prompt = `
You are an LMS notes generator.
Generate full detailed study notes from this transcript.
Return ONLY valid JSON, no markdown, no extra text.

Format:
{
  "title": "Lecture title here",
  "overview": "2-3 sentence summary",
  "sections": [
    {
      "heading": "Section name",
      "content": "Detailed explanation",
      "keyPoints": ["point 1", "point 2"],
      "code": null
    }
  ],
  "keyTakeaways": ["takeaway 1", "takeaway 2"]
}

Transcript:
${transcript.rawText}
`;

    const response = await fetch("http://15.207.110.11/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        options: { temperature: 0.2,num_predict: 800 },
      }),
    });

    const data = await response.json();
    const clean = data.message.content.replace(/```json|```/g, "").trim();
    const notes = JSON.parse(clean);

    const generatePDF = require("../utils/GeneratePdf");
    const pdfBuffer = await generatePDF(notes);

    //  Save to Redis with 24hr expiry
    await redis.setex(`notes:${subsectionId}`, 86400, pdfBuffer);
res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="lecture-notes.pdf"`,
    );
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
