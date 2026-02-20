// scripts/retriggerNotes.js
require("dotenv").config();
const { Queue }  = require("bullmq");
const IORedis    = require("ioredis");
const connection = new IORedis({ maxRetriesPerRequest: null });
const NotesQueue = new Queue("NotesGnQueue", { connection });

NotesQueue.add("generate-notes", { 
  subsectionId: "699891993531f4e7cabff192" 
});
console.log(" Job added");