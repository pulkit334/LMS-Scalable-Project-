require("dotenv").config();

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// 10-model unified fallback chain on OpenRouter (Opus 4.5 first when credits exist,
// seamlessly falling back across top free models and OpenRouter auto-routers)
const DEFAULT_OPENROUTER_MODELS = [
  "anthropic/claude-opus-4.5",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "inclusionai/ling-3.2-flash:free",
  "baidu/ernie-5.5-flash-preview:free",
  "particle-ai/particle-1:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-3.5-lightning:free",
  "openrouter/free",
  "openrouter/auto",
];

// Short in-memory cooldown so models returning 402/404/429 don't slow down subsequent requests
const modelCooldownUntil = new Map();

function isModelCoolingDown(model) {
  const until = modelCooldownUntil.get(model);
  if (!until) return false;
  if (Date.now() >= until) {
    modelCooldownUntil.delete(model);
    return false;
  }
  return true;
}

function setModelCooldown(model, statusCode) {
  if (statusCode === 402) {
    modelCooldownUntil.set(model, Date.now() + 5 * 60 * 1000); // 5 min for insufficient credits
  } else if (statusCode === 404) {
    modelCooldownUntil.set(model, Date.now() + 10 * 60 * 1000); // 10 min for unavailable slug
  } else if (statusCode === 429) {
    modelCooldownUntil.set(model, Date.now() + 60 * 1000); // 1 min for rate limit
  }
}

function getModelChain(customModels) {
  if (Array.isArray(customModels) && customModels.length > 0) {
    return customModels;
  }
  if (process.env.OPENROUTER_MODELS) {
    const parsed = process.env.OPENROUTER_MODELS.split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (parsed.length > 0) return parsed;
  }
  return DEFAULT_OPENROUTER_MODELS;
}

function sanitizeText(text) {
  if (typeof text !== "string") return "";
  const banned = [
    /\bgoogle\b/gi,
    /\bgemini\b/gi,
    /\bopenrouter\b/gi,
    /\blarge language model\b/gi,
    /\bai model\b/gi,
    /\bdeveloped by\b/gi,
  ];
  let clean = text;
  for (const pattern of banned) {
    clean = clean.replace(pattern, "");
  }
  return clean.replace(/\s{2,}/g, " ").trim();
}

/**
 * Extracts a JSON object or array from an LLM response that may include
 * markdown fences, thinking tags, or leading/trailing commentary.
 */
function extractJson(rawText, expectedType = "any") {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty model response");
  }

  // Strip <think>...</think> reasoning blocks if present
  let cleaned = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Strip markdown code fences
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    cleaned = fenceMatch[1].trim();
  }

  // Direct parse attempt
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // Fall through to bracket extraction
  }

  // Extract outermost JSON array or object
  const preferArray = expectedType === "array";
  const pairs = preferArray
    ? [
        ["[", "]"],
        ["{", "}"],
      ]
    : [
        ["{", "}"],
        ["[", "]"],
      ];

  for (const [open, close] of pairs) {
    const start = cleaned.indexOf(open);
    const end = cleaned.lastIndexOf(close);
    if (start !== -1 && end !== -1 && end > start) {
      const slice = cleaned.slice(start, end + 1);
      try {
        return JSON.parse(slice);
      } catch (_) {
        // Try next pair
      }
    }
  }

  throw new Error("Could not extract valid JSON from model response");
}

/**
 * Core OpenRouter chat completion with automatic 6-model fallback chain.
 * If a model errors, times out, returns empty text, or fails JSON/schema validation,
 * the next model in the chain is tried immediately.
 */
async function callOpenRouterWithFallback({
  messages,
  temperature = 0.3,
  maxTokens = 3000,
  timeoutMs = 45000,
  expectJson = false,
  expectedJsonType = "any",
  validate = null,
  models = null,
}) {
  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is missing in environment variables. Please add it to server/.env"
    );
  }

  const rawChain = getModelChain(models);
  // Prefer non-cooled-down models first, then fall back to cooled-down ones if all failed
  const activeModels = rawChain.filter((m) => !isModelCoolingDown(m));
  const cooledModels = rawChain.filter((m) => isModelCoolingDown(m));
  const modelChain = activeModels.length > 0 ? [...activeModels, ...cooledModels] : rawChain;
  const errors = [];

  for (let i = 0; i < modelChain.length; i++) {
    const model = modelChain[i];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log(
        `[OpenRouter] Attempt ${i + 1}/${modelChain.length} using model: ${model}`
      );

      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": process.env.OPENROUTER_APP_NAME || "Notion-X LMS",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      clearTimeout(timer);

      const rawBody = await response.text();
      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch (_) {
        payload = null;
      }

      if (!response.ok) {
        const errMsg =
          payload?.error?.message ||
          rawBody.slice(0, 250) ||
          `HTTP ${response.status}`;

        // Fail fast on invalid API key — retrying other models won't fix 401
        if (response.status === 401) {
          throw Object.assign(
            new Error(`OpenRouter authentication failed (401): ${errMsg}`),
            { fatal: true }
          );
        }

        setModelCooldown(model, response.status);
        throw new Error(`HTTP ${response.status}: ${errMsg}`);
      }

      const content = payload?.choices?.[0]?.message?.content;
      if (!content || typeof content !== "string" || !content.trim()) {
        setModelCooldown(model, 429);
        throw new Error("Model returned empty content");
      }

      if (!expectJson) {
        console.log(`[OpenRouter] Success with model: ${model}`);
        return {
          data: content.trim(),
          rawText: content,
          modelUsed: model,
          attempt: i + 1,
        };
      }

      const parsed = extractJson(content, expectedJsonType);
      const validated = validate ? validate(parsed) : parsed;

      console.log(`[OpenRouter] JSON success with model: ${model}`);
      return {
        data: validated,
        rawText: content,
        modelUsed: model,
        attempt: i + 1,
      };
    } catch (err) {
      clearTimeout(timer);

      if (err?.fatal) {
        throw err;
      }

      const reason =
        err.name === "AbortError"
          ? `Timeout after ${timeoutMs}ms`
          : err.message || String(err);

      console.warn(
        `[OpenRouter] Model "${model}" failed (attempt ${i + 1}/${modelChain.length}): ${reason}`
      );
      errors.push({ model, reason });
    }
  }

  const summary = errors.map((e) => `${e.model} -> ${e.reason}`).join(" | ");
  throw new Error(
    `All ${modelChain.length} OpenRouter fallback models failed: ${summary}`
  );
}

/**
 * Normalizes and validates quiz questions into the exact Question Mongoose schema
 * expected by models/questionModal.js and AIQuizButton.jsx:
 *   { question: string, options: string[4], answer: string (exact match in options),
 *     explanation: string, difficulty: "EASY" | "MEDIUM" | "HARD" }
 */
function normalizeQuestions(parsed) {
  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.questions)
      ? parsed.questions
      : null;

  if (!list || list.length === 0) {
    throw new Error("Model did not return a questions array");
  }

  const LETTER_MAP = { A: 0, B: 1, C: 2, D: 3 };
  const VALID_DIFFS = new Set(["EASY", "MEDIUM", "HARD"]);
  const normalized = [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;

    const questionText = sanitizeText(String(item.question || "").trim());
    if (!questionText) continue;

    // Normalize options whether returned as array or { A, B, C, D } object
    let options = [];
    if (Array.isArray(item.options)) {
      options = item.options
        .map((o) => sanitizeText(String(o || "").trim()))
        .filter(Boolean);
    } else if (item.options && typeof item.options === "object") {
      options = ["A", "B", "C", "D"]
        .map((k) => item.options[k] ?? item.options[k.toLowerCase()])
        .filter((v) => v != null)
        .map((o) => sanitizeText(String(o).trim()))
        .filter(Boolean);
    }

    if (options.length < 4) continue;
    options = options.slice(0, 4);

    // Resolve answer to an exact element in options[]
    let rawAnswer = item.answer ?? item.correct ?? item.correctAnswer ?? "";
    rawAnswer = sanitizeText(String(rawAnswer).trim());

    let resolvedAnswer = options.find((o) => o === rawAnswer);

    if (!resolvedAnswer) {
      // Check case-insensitive exact match
      resolvedAnswer = options.find(
        (o) => o.toLowerCase() === rawAnswer.toLowerCase()
      );
    }

    if (!resolvedAnswer) {
      // Check letter index ("A", "B", "C", "D" or "Option A" or "A) ...")
      const letterMatch = rawAnswer.match(/^(?:option\s*)?([A-D])(?:\)|\.|:|\s|$)/i);
      if (letterMatch) {
        const idx = LETTER_MAP[letterMatch[1].toUpperCase()];
        if (idx !== undefined && options[idx]) {
          resolvedAnswer = options[idx];
        }
      }
    }

    if (!resolvedAnswer) {
      // Check substring match
      resolvedAnswer = options.find(
        (o) =>
          o.toLowerCase().includes(rawAnswer.toLowerCase()) ||
          rawAnswer.toLowerCase().includes(o.toLowerCase())
      );
    }

    if (!resolvedAnswer) continue;

    const rawDiff = String(item.difficulty || "MEDIUM").toUpperCase().trim();
    const difficulty = VALID_DIFFS.has(rawDiff) ? rawDiff : "MEDIUM";
    const explanation = sanitizeText(
      String(item.explanation || "Review this concept carefully.").trim()
    );

    normalized.push({
      question: questionText,
      options,
      answer: resolvedAnswer,
      explanation,
      difficulty,
    });
  }

  if (normalized.length < 3) {
    throw new Error(
      `Only ${normalized.length} valid MCQ(s) extracted after normalization`
    );
  }

  return normalized.slice(0, 5);
}

/**
 * Normalizes and validates lecture notes JSON expected by utils/GeneratePdf.js
 */
function normalizeNotes(parsed, fallbackTitle = "Lecture Study Notes") {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Model did not return a JSON object for notes");
  }

  const title =
    sanitizeText(String(parsed.title || "").trim()) || fallbackTitle;
  const overview = sanitizeText(String(parsed.overview || "").trim());

  const rawSections = Array.isArray(parsed.sections) ? parsed.sections : [];
  const sections = rawSections
    .filter((s) => s && typeof s === "object" && (s.heading || s.content))
    .map((s) => ({
      heading: sanitizeText(String(s.heading || "Key Concept").trim()),
      content: sanitizeText(String(s.content || "").trim()),
      keyPoints: Array.isArray(s.keyPoints)
        ? s.keyPoints
            .map((p) => sanitizeText(String(p || "").trim()))
            .filter(Boolean)
        : [],
      code:
        typeof s.code === "string" && s.code.trim().length > 0
          ? s.code.trim()
          : null,
    }));

  if (sections.length === 0) {
    throw new Error("Notes response contained no valid sections");
  }

  const keyTakeaways = Array.isArray(parsed.keyTakeaways)
    ? parsed.keyTakeaways
        .map((t) => sanitizeText(String(t || "").trim()))
        .filter(Boolean)
    : [];

  return {
    title,
    overview:
      overview || "Comprehensive study notes covering the core concepts of this lecture.",
    sections,
    keyTakeaways,
  };
}

/**
 * Generate 5 conceptual MCQs from a lecture transcript via OpenRouter fallback chain
 */
async function generateQuizQuestions(transcriptText) {
  if (!transcriptText || !transcriptText.trim()) {
    throw new Error("Transcript text is empty");
  }

  // Cap overly long transcripts so every fallback model stays well within limits
  const trimmedTranscript = transcriptText.trim().slice(0, 24000);

  const systemPrompt =
    "You are an expert technical educator and interview coach for an LMS platform. You always respond with strict, valid JSON only — no markdown fences, no commentary.";

  const userPrompt = `Generate EXACTLY 5 conceptual multiple-choice questions based on the concepts taught in the lecture below.

Rules:
- Questions must test DEEP conceptual understanding and interview-ready reasoning, not trivial wording recall.
- Never mention "the transcript", "the video", or "the speaker".
- Mix difficulties across EASY, MEDIUM, and HARD.
- Each question MUST have an array of 4 distinct option strings in "options".
- "answer" MUST be the EXACT string matching one of the 4 items in "options".
- Write "explanation" clearly like a teacher explaining to a student: explain why the correct answer is right and briefly why the other options are wrong.

Return ONLY a valid JSON array matching this exact schema:
[
  {
    "question": "Conceptual question text?",
    "options": ["First option", "Second option", "Third option", "Fourth option"],
    "answer": "Second option",
    "explanation": "Second option is correct because ... The other options are incorrect because ...",
    "difficulty": "EASY"
  }
]

Lecture Content:
${trimmedTranscript}`;

  return callOpenRouterWithFallback({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.35,
    maxTokens: 2500,
    expectJson: true,
    expectedJsonType: "array",
    validate: normalizeQuestions,
  });
}

/**
 * Generate structured study notes from a lecture transcript via OpenRouter fallback chain
 */
async function generateLectureNotes(transcriptText, { lectureTitle = "" } = {}) {
  if (!transcriptText || !transcriptText.trim()) {
    throw new Error("Transcript text is empty");
  }

  const trimmedTranscript = transcriptText.trim().slice(0, 28000);

  const systemPrompt =
    "You are an expert LMS study-notes author. You always respond with strict, valid JSON only — no markdown fences, no extra text.";

  const userPrompt = `Create comprehensive, well-structured, exam-ready study notes from the lecture content below.${
    lectureTitle ? `\nLecture Title Hint: ${lectureTitle}` : ""
  }

Rules:
- Organize into 3 to 6 logical sections with clear headings, thorough explanations, and concise bullet keyPoints.
- Include a short, clean code snippet in "code" ONLY when the lecture discusses programming/code; otherwise set "code": null.
- Never refer to "the transcript" or "the video".
- Include 4 to 6 actionable "keyTakeaways".

Return ONLY a valid JSON object matching this exact schema:
{
  "title": "Clear Lecture Title",
  "overview": "2-3 sentence executive summary of what this lecture covers and why it matters.",
  "sections": [
    {
      "heading": "Section Heading",
      "content": "Detailed conceptual explanation.",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
      "code": null
    }
  ],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}

Lecture Content:
${trimmedTranscript}`;

  return callOpenRouterWithFallback({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.25,
    maxTokens: 3500,
    expectJson: true,
    expectedJsonType: "object",
    validate: (parsed) =>
      normalizeNotes(parsed, lectureTitle || "Lecture Study Notes"),
  });
}

module.exports = {
  DEFAULT_OPENROUTER_MODELS,
  getModelChain,
  callOpenRouterWithFallback,
  generateQuizQuestions,
  generateLectureNotes,
  extractJson,
  normalizeQuestions,
  normalizeNotes,
};
