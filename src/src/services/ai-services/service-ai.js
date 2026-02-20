import {AiApi} from "../apiconnnector"
const AIService = {
  AIService: "/GetQuestions/:lectureId/questions",
};

export const GetAiQuestions = async (data) => {
  const response = await AiApi.get(AIService.AIService.replace(":lectureId",data));
  console.log("the response woukld be ", response);
  return response?.data?.data;
};
