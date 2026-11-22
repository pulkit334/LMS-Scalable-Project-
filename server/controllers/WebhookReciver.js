const SubSection = require("../models/subsection");
const Transcript = require("../models/transcription");
const { transcriptionQueue } = require("../service/transcription-queue-service");

exports.webHookEndPoint = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.public_id || !data?.secure_url) {
      return res.status(400).json({ message: "Missing Cloudinary webhook payload fields" });
    }

    const subsection = await SubSection.findOne({ cloudinaryId: data.public_id });
    if (!subsection) {
      return res.status(404).json({ message: "Subsection not found" });
    }

    // Idempotency guard: avoid duplicate transcription if createSubsection already queued it
    const existingTranscript = await Transcript.findOne({ subsectionId: subsection._id }).lean();
    if (
      existingTranscript ||
      ["TRANSCRIBING", "GENERATING_QUESTIONS", "READY"].includes(subsection.status)
    ) {
      return res.status(200).json({ received: true, skipped: true });
    }

    subsection.status = "TRANSCRIBING";
    subsection.notesStatus = "pending";
    await subsection.save();

    await transcriptionQueue.add(
      "transcribe",
      {
        subsectionId: String(subsection._id),
        cloudinaryUrl: data.secure_url,
        cloudinaryId: data.public_id,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 4000 },
      }
    );

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Cloudinary webhook error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
