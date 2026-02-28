// ============================================================
// generate-test-users.js
// Generates virtual student tokens + identities for load testing
// Run: node generate-test-users.js
// ============================================================

import { AccessToken } from "livekit-server-sdk";
import fs from "fs";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

// ============================================================
// CONFIG
// ============================================================

const CONFIG = {
  LIVEKIT_API_KEY: "APIZVZUKM6efYit",
  LIVEKIT_API_SECRET: "OlehGD8g7DlOHDwgGVPC817EhzqeoVR57uOeNcPZhczA",
  CLASS_ID: "69a1d24ebe277d23c6383c23", // Put this in your .env
  TOTAL_USERS: 1000,
  OUTPUT_FILE: "test-users.json",
};

// ============================================================

async function generateAllTokens() {
  // Validate config
  if (!CONFIG.LIVEKIT_API_KEY) {
    console.error("❌ LIVEKIT_API_KEY missing in .env");
    process.exit(1);
  }

  if (!CONFIG.LIVEKIT_API_SECRET) {
    console.error("❌ LIVEKIT_API_SECRET missing in .env");
    process.exit(1);
  }

  if (!CONFIG.CLASS_ID) {
    console.error("❌ CLASS_ID missing in .env");
    process.exit(1);
  }

  console.log(`🚀 Generating ${CONFIG.TOTAL_USERS} tokens`);
  console.log(`📚 Room: ${CONFIG.CLASS_ID}\n`);

  const users = [];
  const start = Date.now();

  for (let i = 1; i <= CONFIG.TOTAL_USERS; i++) {
    const identity = `load-test-student-${i}`;
    const name = `Load Test Student ${i}`;

    const token = new AccessToken(
      CONFIG.LIVEKIT_API_KEY,
      CONFIG.LIVEKIT_API_SECRET,
      { identity, name },
    );

    token.addGrant({
      roomJoin: true,
      room: CONFIG.CLASS_ID,
      canPublish: false,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    users.push({
      index: i,
      identity,
      name,
      token: jwt,
      classId: CONFIG.CLASS_ID,
    });

    if (i % 100 === 0) {
      console.log(`Generated ${i}/${CONFIG.TOTAL_USERS} tokens...`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  // Save full data
  fs.writeFileSync(CONFIG.OUTPUT_FILE, JSON.stringify(users, null, 2));

  // Save slim version
  const slim = users.map((u) => ({
    identity: u.identity,
    token: u.token,
  }));

  fs.writeFileSync("test-users-slim.json", JSON.stringify(slim, null, 2));

  console.log("\n Done!");
  console.log(`⏱ Time taken: ${elapsed}s`);
  console.log("📁 Files created:");
  console.log("   - test-users.json");
  console.log("   - test-users-slim.json");
}

generateAllTokens().catch((err) => {
  console.error(" Error:", err);
  process.exit(1);
});
