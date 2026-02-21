require("dotenv").config();


const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL      = process.env.OLLAMA_MODEL || "llama3";

const CONFIG = {
  warmupRuns:      2,   // warm up model before testing
  benchmarkRuns:   10,  // actual benchmark runs
  concurrentUsers: 3,   // simultaneous requests
  timeoutMs:       120000,
};

// ── ANSI Colors & Styles ─────────────────────────────────────
const c = {
  reset:   "\x1b[0m",
  bold:    (t) => `\x1b[1m${t}\x1b[0m`,
  dim:     (t) => `\x1b[2m${t}\x1b[0m`,
  green:   (t) => `\x1b[32m${t}\x1b[0m`,
  red:     (t) => `\x1b[31m${t}\x1b[0m`,
  yellow:  (t) => `\x1b[33m${t}\x1b[0m`,
  blue:    (t) => `\x1b[34m${t}\x1b[0m`,
  magenta: (t) => `\x1b[35m${t}\x1b[0m`,
  cyan:    (t) => `\x1b[36m${t}\x1b[0m`,
  white:   (t) => `\x1b[37m${t}\x1b[0m`,
  bgGreen: (t) => `\x1b[42m\x1b[30m${t}\x1b[0m`,
  bgRed:   (t) => `\x1b[41m\x1b[37m${t}\x1b[0m`,
  bgBlue:  (t) => `\x1b[44m\x1b[37m${t}\x1b[0m`,
};

// ── Terminal helpers ─────────────────────────────────────────
const clearLine  = () => process.stdout.write("\r\x1b[K");
const moveCursor = (n) => process.stdout.write(`\x1b[${n}A`);
const write      = (t) => process.stdout.write(t);

function progressBar(current, total, width = 30) {
  const pct      = current / total;
  const filled   = Math.floor(pct * width);
  const empty    = width - filled;
  const bar      = "█".repeat(filled) + "░".repeat(empty);
  const percent  = (pct * 100).toFixed(0).padStart(3);
  return `[${c.cyan(bar)}] ${c.bold(percent + "%")}`;
}

function sparkline(values) {
  const chars  = ["▁","▂","▃","▄","▅","▆","▇","█"];
  const min    = Math.min(...values);
  const max    = Math.max(...values);
  const range  = max - min || 1;
  return values.map(v => {
    const idx = Math.floor(((v - min) / range) * (chars.length - 1));
    const char = chars[idx];
    return idx > 5 ? c.red(char) : idx > 2 ? c.yellow(char) : c.green(char);
  }).join("");
}

function formatTime(ms) {
  if (ms < 1000)  return c.green(`${ms}ms`);
  if (ms < 30000) return c.green(`${(ms/1000).toFixed(1)}s`);
  if (ms < 60000) return c.yellow(`${(ms/1000).toFixed(1)}s`);
  return c.red(`${(ms/1000).toFixed(1)}s`);
}

function ratingBar(value, max, width = 20) {
  const filled = Math.floor((value / max) * width);
  const empty  = width - filled;
  const color  = value / max > 0.7 ? c.green : value / max > 0.4 ? c.yellow : c.red;
  return color("█".repeat(filled)) + c.dim("░".repeat(empty));
}

// ── Test prompts ─────────────────────────────────────────────
const TESTS = [
  {
    name: "📝 Notes Generation",
    type: "notes",
    prompt: `You are an LMS notes generator. Generate study notes from this transcript.
Return ONLY valid JSON: {"title":"...","overview":"...","sections":[{"heading":"...","content":"...","keyPoints":["..."],"code":null}],"keyTakeaways":["..."]}
Transcript: JavaScript closures allow functions to access variables from their outer scope even after the outer function has returned. This creates powerful patterns like data privacy and function factories.`,
  },
  {
    name: "❓ Question Generation",
    type: "questions",
    prompt: `You are an LMS question generator. Generate 3 MCQs.
Return ONLY valid JSON array: [{"question":"...","options":["A","B","C","D"],"answer":"...","difficulty":"EASY"}]
Transcript: React hooks like useState and useEffect allow functional components to manage state and side effects without class components.`,
  },
  {
    name: "🧠 Concept Explanation",
    type: "concept",
    prompt: `Explain what a Promise is in JavaScript in exactly 3 sentences. Return as JSON: {"explanation":"...","example":"..."}`,
  },
];

// ── Stats ────────────────────────────────────────────────────
const results = {
  warmup:    [],
  benchmark: [],
  byTest:    {},
  tokens:    [],
};

// ── Live dashboard ───────────────────────────────────────────
let dashboardLines = 0;

function clearDashboard() {
  if (dashboardLines > 0) {
    moveCursor(dashboardLines);
    for (let i = 0; i < dashboardLines; i++) {
      clearLine();
      if (i < dashboardLines - 1) write("\n");
    }
    moveCursor(dashboardLines - 1);
  }
}

function drawDashboard(phase, current, total, recentTimes, activeRequests) {
  clearDashboard();

  const lines = [];

  lines.push(`  Phase: ${c.bold(c.cyan(phase))}  ${progressBar(current, total)}`);
  lines.push(`  Requests: ${c.bold(current)}/${c.bold(total)}  Active: ${c.yellow(activeRequests)}`);

  if (recentTimes.length > 0) {
    const avg = recentTimes.reduce((a,b) => a+b, 0) / recentTimes.length;
    lines.push(`  Latest: ${formatTime(recentTimes[recentTimes.length-1])}  Avg: ${formatTime(avg)}`);
    if (recentTimes.length > 1) {
      lines.push(`  Trend:  ${sparkline(recentTimes)}`);
    }
  }

  write(lines.join("\n"));
  write("\n");
  dashboardLines = lines.length + 1;
}

// ── Single request ───────────────────────────────────────────
async function runRequest(test, id) {
  const start      = Date.now();
  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), CONFIG.timeoutMs);

  try {
    const response = await fetch(OLLAMA_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body: JSON.stringify({
        model:    MODEL,
        messages: [{ role: "user", content: test.prompt }],
        stream:   false,
        options:  { temperature: 0.2 },
      }),
    });

    clearTimeout(timeout);
    const data     = await response.json();
    const duration = Date.now() - start;
    const content  = data.message?.content || "";

    // Validate JSON
    let valid = false;
    try {
      const clean = content.replace(/```json|```/g, "").trim();
      const match = clean.match(/[\[{][\s\S]*[\]}]/);
      if (match) { JSON.parse(match[0]); valid = true; }
    } catch {}

    // Estimate tokens (rough: 4 chars = 1 token)
    const tokens = Math.floor(content.length / 4);

    return { success: true, duration, valid, tokens, test: test.name };

  } catch (err) {
    clearTimeout(timeout);
    const duration = Date.now() - start;
    return { success: false, duration, valid: false, tokens: 0, error: err.message, test: test.name };
  }
}

// ── Warmup phase ─────────────────────────────────────────────
async function runWarmup() {
  console.log("\n" + c.bold(c.yellow("  ⚡ WARMUP PHASE")));
  console.log(c.dim("  Warming up model to get accurate benchmarks...\n"));

  dashboardLines = 0;

  for (let i = 0; i < CONFIG.warmupRuns; i++) {
    drawDashboard("WARMUP", i, CONFIG.warmupRuns, results.warmup.map(r => r.duration), 1);
    const result = await runRequest(TESTS[0], i);
    results.warmup.push(result);
    const icon = result.success ? c.green("✓") : c.red("✗");
    clearDashboard();
    dashboardLines = 0;
    console.log(`  ${icon} Warmup ${i+1}/${CONFIG.warmupRuns} — ${formatTime(result.duration)}`);
  }
}

// ── Benchmark phase ──────────────────────────────────────────
async function runBenchmark() {
  console.log("\n" + c.bold(c.cyan("  🔥 BENCHMARK PHASE")));
  console.log(c.dim(`  Running ${CONFIG.benchmarkRuns} requests across ${TESTS.length} test types...\n`));

  dashboardLines = 0;
  const allTimes = [];
  let completed  = 0;

  // Init per-test stats
  TESTS.forEach(t => { results.byTest[t.name] = []; });

  // Create all jobs
  const jobs = [];
  for (let i = 0; i < CONFIG.benchmarkRuns; i++) {
    jobs.push(TESTS[i % TESTS.length]);
  }

  // Run in batches
  const batches = [];
  for (let i = 0; i < jobs.length; i += CONFIG.concurrentUsers) {
    batches.push(jobs.slice(i, i + CONFIG.concurrentUsers));
  }

  for (const batch of batches) {
    drawDashboard("BENCHMARK", completed, CONFIG.benchmarkRuns, allTimes, batch.length);

    const batchResults = await Promise.all(
      batch.map((test, idx) => runRequest(test, completed + idx))
    );

    clearDashboard();
    dashboardLines = 0;

    batchResults.forEach(result => {
      completed++;
      results.benchmark.push(result);
      results.byTest[result.test].push(result);
      if (result.success) allTimes.push(result.duration);

      const icon   = result.success ? c.green("✓") : c.red("✗");
      const valid  = result.valid   ? c.green("JSON✓") : c.yellow("JSON?");
      const tokens = c.dim(`~${result.tokens}tok`);
      console.log(`  ${icon} [${completed.toString().padStart(2)}/${CONFIG.benchmarkRuns}] ${result.test.padEnd(25)} ${formatTime(result.duration).padEnd(15)} ${valid} ${tokens}`);
    });
  }
}

// ── Final report ─────────────────────────────────────────────
function printReport() {
  const successful = results.benchmark.filter(r => r.success);
  const failed     = results.benchmark.filter(r => !r.success);
  const times      = successful.map(r => r.duration);
  const avg        = times.reduce((a,b) => a+b, 0) / times.length;
  const min        = Math.min(...times);
  const max        = Math.max(...times);
  const p50        = times.sort((a,b)=>a-b)[Math.floor(times.length * 0.5)];
  const p90        = times[Math.floor(times.length * 0.9)];
  const p99        = times[Math.floor(times.length * 0.99)] || max;
  const successRate = (successful.length / results.benchmark.length) * 100;
  const totalTokens = results.benchmark.reduce((a,r) => a + r.tokens, 0);
  const tokensPerSec = totalTokens / (times.reduce((a,b)=>a+b,0) / 1000);

  const W = 58;
  const line  = "═".repeat(W);
  const dline = "─".repeat(W);

  console.log("\n\n" + c.cyan(line));
  console.log(c.bold(c.cyan("        🤖 ML MODEL BENCHMARK REPORT")));
  console.log(c.cyan(line));

  // Model info
  console.log(`  ${c.bold("Model:")}        ${c.cyan(MODEL)}`);
  console.log(`  ${c.bold("Hardware:")}     Intel i7 (your machine)`);
  console.log(`  ${c.bold("Test Runs:")}    ${CONFIG.benchmarkRuns} requests`);
  console.log(`  ${c.bold("Concurrency:")}  ${CONFIG.concurrentUsers} simultaneous`);
  console.log(c.dim(dline));

  // Success metrics
  console.log(`\n  ${c.bold("📊 RELIABILITY")}`);
  console.log(`  Success Rate   ${ratingBar(successRate, 100)}  ${successRate >= 90 ? c.green(successRate.toFixed(1)+"%") : c.red(successRate.toFixed(1)+"%")}`);
  console.log(`  Valid JSON     ${ratingBar(successful.filter(r=>r.valid).length, successful.length, 20)}  ${c.green(successful.filter(r=>r.valid).length + "/" + successful.length)}`);
  console.log(`  Failed Reqs    ${c.red(failed.length)} ${failed.length > 0 ? c.dim("(" + failed.map(r=>r.error?.slice(0,30)).join(", ") + ")") : c.green("none ✓")}`);

  // Latency
  console.log(`\n  ${c.bold("⏱  LATENCY")}`);
  console.log(`  Average     ${formatTime(avg)}`);
  console.log(`  Minimum     ${formatTime(min)}`);
  console.log(`  Maximum     ${formatTime(max)}`);
  console.log(`  P50         ${formatTime(p50)}   ${c.dim("(50% of requests faster than this)")}`);
  console.log(`  P90         ${formatTime(p90)}   ${c.dim("(90% of requests faster than this)")}`);
  console.log(`  P99         ${formatTime(p99)}   ${c.dim("(worst case)")}`);

  // Throughput
  console.log(`\n  ${c.bold("🚀 THROUGHPUT")}`);
  const reqPerMin = (60000 / avg).toFixed(1);
  const reqPerHr  = Math.floor(60000 / avg * 60);
  console.log(`  Requests/min   ${c.cyan(reqPerMin)}`);
  console.log(`  Requests/hr    ${c.cyan(reqPerHr)}`);
  console.log(`  Tokens/sec     ${c.cyan(tokensPerSec.toFixed(1))}`);
  console.log(`  Total tokens   ${c.cyan(totalTokens)}`);

  // Per test breakdown
  console.log(`\n  ${c.bold("📋 BY TEST TYPE")}`);
  TESTS.forEach(test => {
    const testResults = results.byTest[test.name]?.filter(r => r.success) || [];
    if (testResults.length === 0) return;
    const testAvg = testResults.reduce((a,r) => a + r.duration, 0) / testResults.length;
    console.log(`  ${test.name.padEnd(28)} avg: ${formatTime(testAvg)}`);
  });

  // Sparkline history
  if (times.length > 1) {
    console.log(`\n  ${c.bold("📈 RESPONSE TIME HISTORY")}`);
    console.log(`  ${sparkline(times)}  ${c.dim("(left=first, right=last)")}`);
  }

  // i7 Rating
  console.log(`\n  ${c.bold("🏆 PERFORMANCE RATING FOR i7")}`);
  console.log(c.dim(dline));

  let rating, advice;
  if      (avg < 10000) { rating = c.bgGreen(" 🚀 BLAZING FAST ");  advice = "Your i7 dominates this model. Increase batch size."; }
  else if (avg < 20000) { rating = c.bgGreen(" ✅ EXCELLENT ");      advice = "Great performance. Safe for 5+ concurrent users."; }
  else if (avg < 40000) { rating = c.bgBlue(  " 👍 GOOD ");          advice = "Acceptable. Run 2-3 workers max on i7."; }
  else if (avg < 60000) { rating = c.bgRed(   " ⚠️  SLOW ");          advice = "Consider: llama3:8b or mistral:7b for better speed."; }
  else                  { rating = c.bgRed(   " ❌ TOO SLOW ");       advice = "Switch to smaller model. i7 is struggling."; }

  console.log(`  ${rating}`);
  console.log(`  ${c.dim(advice)}`);

  // Recommendations
  console.log(`\n  ${c.bold("💡 RECOMMENDATIONS")}`);
  if (avg > 30000) {
    console.log(`  • Try: ${c.cyan("ollama pull llama3:8b")} for 2x speed`);
    console.log(`  • Try: ${c.cyan("ollama pull mistral")} for fastest responses`);
    console.log(`  • Close Chrome/VS Code to free RAM for model`);
  } else {
    console.log(`  • ${c.green("Your model runs well on i7")} ✅`);
    console.log(`  • Safe concurrent workers: ${c.cyan(Math.min(4, Math.floor(30000/avg * CONFIG.concurrentUsers)))}`);
    console.log(`  • Max students/min: ${c.cyan(reqPerMin)}`);
  }

  console.log(c.cyan("\n" + line));
  console.log(c.bold(c.cyan("             Benchmark Complete! 🎉")));
  console.log(c.cyan(line) + "\n");
}

// ── Header ───────────────────────────────────────────────────
function printHeader() {
  console.clear();
  console.log(c.cyan("╔══════════════════════════════════════════════════════╗"));
  console.log(c.cyan("║") + c.bold("        🤖 OLLAMA ML MODEL BENCHMARK v1.0             ") + c.cyan("║"));
  console.log(c.cyan("║") + c.dim("        Professional Load Testing for LMS AI           ") + c.cyan("║"));
  console.log(c.cyan("╚══════════════════════════════════════════════════════╝"));
  console.log();
  console.log(`  ${c.bold("Model:")}    ${c.cyan(MODEL)}`);
  console.log(`  ${c.bold("Warmup:")}   ${CONFIG.warmupRuns} runs`);
  console.log(`  ${c.bold("Benchmark:")} ${CONFIG.benchmarkRuns} runs @ ${CONFIG.concurrentUsers} concurrent`);
  console.log();
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  printHeader();

  // Check Ollama is running
  try {
    const check = await fetch("http://localhost:11434/api/tags");
    if (!check.ok) throw new Error("Not OK");
    console.log(c.green("  ✓ Ollama is running\n"));
  } catch {
    console.log(c.red("  ✗ Ollama is not running!"));
    console.log(c.yellow("  Run: ollama serve\n"));
    process.exit(1);
  }

  await runWarmup();
  await runBenchmark();
  printReport();

  process.exit(0);
}

main().catch(err => {
  console.error(c.red("\n  Fatal error:"), err.message);
  process.exit(1);
});
