import { handleApiError } from "../../utils/handleAPiError";
import { LiveClassAPI } from "../apiconnnector";
const LiveUrl = {
  CREATE_URL: "/live/create",
  START_CLASS: "/live/:classId/start",
  END_CLASS: "/live/:classId/end",
  LIVEJOINCLASS: "/live/:classId/join",
};
export const CreateLiveClassAPI = async (title, courseId) => {
  try {
    const response = await LiveClassAPI.post(LiveUrl.CREATE_URL, {
      title,
      courseId,
    });
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const StartLiveClass = async (classId) => {
  try {
    const response = await LiveClassAPI.post(
      LiveUrl.START_CLASS.replace(":classId", classId),
    );
    console.log("the start class REsposne is this ", response);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const EndLiveClass = async (classId) => {
  try {
    const response = await LiveClassAPI.post(
      LiveUrl.END_CLASS.replace(":classId", classId),
    );

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const JoinLiveClass = async (classId) => {
  try {
    const response = await LiveClassAPI.post(
      LiveUrl.LIVEJOINCLASS.replace(":classId", classId),
    );
    console.log("the Join Live Class ", response);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};
