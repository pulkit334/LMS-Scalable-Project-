import { AiApi } from "../apiconnnector";

const AIService = {
  AIService: "/GetQuestions/:lectureId/questions",
  AINotes: "/GetNotes/:subsectionId/notes",
};

export const GetAiQuestions = async (lectureId) => {
  const response = await AiApi.get(
    AIService.AIService.replace(":lectureId", lectureId)
  );
  return {
    status: response?.data?.status || (response.status === 202 ? "transcribing" : "ready"),
    message: response?.data?.message || "",
    data: response?.data?.data ?? [],
    modelUsed: response?.data?.modelUsed || null,
  };
};

export const GetAiNotes = async (subsectionId) => {
  const response = await AiApi.post(
    AIService.AINotes.replace(":subsectionId", subsectionId)
  );
  return response?.data;
};

export const DownloadAiNotes = async (subsectionId) => {
  const response = await AiApi.get(`/DownloadNotes/${subsectionId}`, {
    responseType: "blob",
  });
  return response.data;
};
