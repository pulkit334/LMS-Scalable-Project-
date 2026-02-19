const SubSection = require("../models/subsection")
const {transcriptionQueue} = require("../service/transcription-queue-service")

exports.webHookEndPoint = async (req, res) => {
  try {
    const data = req.body
console.log("Webhook public_id:", data.public_id)
const subsection = await SubSection.findOne({ cloudinaryId: data.public_id })
console.log("Found subsection:", subsection)
    if (!subsection) return res.status(404).json({ message: "Subsection not found" })

    subsection.status = "TRANSCRIBING"
    await subsection.save()

    await transcriptionQueue.add("transcribe", {
      subsectionId: subsection._id,
      cloudinaryUrl: data.secure_url,
      cloudinaryId: data.public_id
    })

    return res.status(200).json({ received: true })

  } catch (err) {
    console.log("hello teh backedn Failed Error data Would be ",err)
    return res.status(500).json({ message: "Internal Server Error", error: err.message })
  }
}