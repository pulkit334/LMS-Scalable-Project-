const Question = require("../models/questionModal");

exports.GetAiRoute = async (req, res) => {
  try {
    const { lectureId } = req.params;
    console.log("subsectionId:", lectureId); // 

    const allQuestions = await Question.find({}).lean();
    console.log("Total questions in DB:", allQuestions.length);
    console.log("Sample subsectionId from DB:", allQuestions[0]?.subsectionId);


    const questions = await Question.find({ subsectionId: lectureId }).lean();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this lecture",
      });
    }

    return res.status(200).json({
      success: true,
      data: questions,
    });

  } catch (err) {
    console.log("Error fetching AI questions", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};