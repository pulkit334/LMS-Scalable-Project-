import {AiApi} from "../apiconnnector"
const AIService = {
  AIService: "/GetQuestions/:lectureId/questions",
    AINotes: "/GetNotes/:subsectionId/notes", 
};

export const GetAiQuestions = async (data) => {
  const response = await AiApi.get(AIService.AIService.replace(":lectureId",data));
  console.log("the response woukld be ", response);
  return response?.data?.data ?? []
};

export const GetAiNotes = async (subsectionId) => {
  const response = await AiApi.post(AIService.AINotes.replace(":subsectionId", subsectionId));
      console.log("Notes response:", response);
  return response?.data;
};
export const DownloadAiNotes = async (subsectionId) => {
  const response = await AiApi.get(
    `/DownloadNotes/${subsectionId}`,
    { responseType: "blob" }
  );
  return response.data;
};