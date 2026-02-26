import {
  createRoom,
  deleteRoom,
  generateToken,
} from "../service/livekit.service.js";
import Class from "../models/live.js";
import Course from "../models/course.js";
import { roomService } from "../config/livekit.js";
import { WebhookReceiver } from "livekit-server-sdk";
//create the class
export const createClass = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const cls = await Class.create({
      title,
      teacher: req.user.id,
      course: courseId,
      state: "SCHEDULED",
    });
    res.json({ success: true, class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create room
export const CreateRoom = async (req, res) => {
  try {
    //Id id
    const { classId } = req.params;
    const teacherId = req.user.id;

    const cls = await Class.findOne({ _id: classId, teacher: teacherId });
    if (!cls)
      return res
        .status(404)
        .json({ status: false, message: "Class Not Found" });
    if (cls.state == "LIVE")
      return res
        .status(400)
        .json({ success: false, message: "Class is Alerdy Started" });
    if (cls.state == "ENDED")
      return res
        .status(400)
        .json({ success: false, message: "Class  Alerady Finished" });

    await createRoom(String(classId));
    //generate karo ek Token ko Jo  share
    const token = await generateToken(String(classId), String(teacherId), true);
    cls.state = "LIVE";
    cls.startedAt = new Date();
    await cls.save();
    res.json({ token, host: process.env.LIVEKIT_URL });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Error",
      success: false,
    });
  }
};

// Join the class/
export const JoinRoom = async (req, res) => {
  try {
    //click on the join button -> Student Mera Is Course Me Enrolled  if Then -> Verify it -> Join kar dunga
    const { classId } = req.params;
    const StudentId = req.user.id;
    const cls = await Class.findById(classId);
    if (!cls)
      return res
        .status(404)
        .json({ success: false, message: "Failed to Join the Room" });
    if (cls.state !== "LIVE")
      return res.status(400).json({ message: "Class is not live" });

    const courseData = await Course.findById(cls.course).select(
      "studentEnrolled",
    );
    const isEnrolled = courseData.studentEnrolled.includes(StudentId);
    if (!isEnrolled)
      return res.status(403).json({ success: false, message: "Not enrolled" });
    if (!isEnrolled)
      return res
        .status(403)
        .json({ success: false, message: "Lack of credentials" });
    const token = await generateToken(
      String(classId),
      String(req.user.id),
      false,
    );

    res.json({ token, host: process.env.LIVEKIT_URL });
  } catch (err) {
    console.log("the erro was", err.message);
    return res.status(500).json({
      message: "Failed Try Again",
      success: false,
    });
  }
};
//Ended The Class
export const EndRoom = async (req, res) => {
  try {
    //click on the join button -> Student Mera Is Course Me Enrolled  if Then -> Verify it -> Join kar dunga
    const { classId } = req.params;
    const teacherId = req.user.id;

    const cls = await Class.findOne({ _id: classId, teacher: teacherId });
    if (!cls)
      return res
        .status(404)
        .json({ success: false, message: "Failed to End the Room" });
    if (cls.state !== "LIVE")
      return res.status(400).json({ message: "Class is not live" });

    await deleteRoom(String(classId));
    cls.state = "ENDED";
    cls.endedAt = new Date();
    await cls.save();

    res.json({ success: true, message: "Class ended" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Try Again",
      success: false,
    });
  }
};

export const getRoomParticipants = async (req, res) => {
  try {
    const { classId } = req.params;

    const participants = await roomService.listParticipants(String(classId));

    res.json({
      success: true,
      count: participants.length,
      participants: participants.map((p) => ({
        identity: p.identity,
        joinedAt: Number(p.joinedAt),
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET,
);

export const livekitWebhook = async (req, res) => {
  try {
    const event = receiver.receive(req.body, req.headers["authorization"]);
    console.log("LiveKit Event:", event.event);

    switch (event.event) {
      case "room_finished":
        await Class.findByIdAndUpdate(event.room.name, {
          state: "ENDED",
          endedAt: new Date(),
        });
      case "participant_joined":
        console.log("Someone joined:", event.participant.identity);
        break;
      case "participant_left":
        console.log("Someone left", event.participant.identity);
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.log("Webhook error:", err.message);
    res.status(400).json({ message: err.message });
  }
};
