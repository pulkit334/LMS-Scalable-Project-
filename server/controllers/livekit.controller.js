import {
  createRoom,
  deleteRoom,
  generateToken,
} from "../service/livekit.service.js";
import Class from "../models/live.js";
import Course from "../models/course.js";
import { roomService } from "../config/livekit.js";
import { WebhookReceiver } from "livekit-server-sdk";
import { getIO } from "../config/socket.js";
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
    return res.json({ success: true, class: cls });
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

    const teacherName = req.user?.email?.split("@")[0] || "Instructor";
    const token = await generateToken(String(classId), String(teacherId), true, `${teacherName} (Host)`);
    cls.state = "LIVE";
    cls.startedAt = new Date();
   const saved =  await cls.save();

    const io = getIO();
    io.to(`course:${cls.course}`).emit("class:live", {
      classId: classId,
      title: cls.title,
      course: cls.course,
    });

    return res.json({ token, host: process.env.LIVEKIT_URL });
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
    const isEnrolled = Boolean(
      courseData?.studentEnrolled?.some(
        (id) => String(id) === String(StudentId),
      ),
    );
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }
    const studentName = req.user?.email?.split("@")[0] || "Student";
    const token = await generateToken(
      String(classId),
      String(req.user.id),
      false,
      studentName,
    );

    return res.json({ token, host: process.env.LIVEKIT_URL });
  } catch (err) {
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

    return res.json({ success: true, message: "Class ended" });
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

    return res.json({
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
  

    switch (event.event) {
      case "room_finished":
        await Class.findByIdAndUpdate(event.room.name, {
          state: "ENDED",
          endedAt: new Date(),
        });
      case "participant_joined":
break;
      case "participant_left":
break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//keep pollign
export const getLiveSignal = async (req, res) => {
  try {
    const { courseId } = req.params;

    const liveClass = await Class.findOne({ 
      course: courseId,  
      state: "LIVE" 
    });

    if (!liveClass)
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });

    const rooms = await roomService.listRooms([String(liveClass._id)])
    const isActuallyLive = rooms.length > 0

    if (!isActuallyLive) {
      // use updateOne instead of save() — avoids validation error
      await Class.updateOne(
        { _id: liveClass._id },
        { state: "ENDED" }
      )
    }

    return res.status(200).json({
      success: true,
      isLive: isActuallyLive,
      classId: liveClass._id,
      course: courseId,
      title: liveClass.title,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};