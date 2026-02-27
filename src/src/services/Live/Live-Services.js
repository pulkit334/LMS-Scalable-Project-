import { handleApiError } from "../../utils/handleAPiError";
import { LiveClassAPI } from "../apiconnnector";
const LiveUrl = {
  CREATE_URL: "/live/create",
  START_CLASS: "/live/:classId/start",
  END_CLASS: "/live/:classId/end",
  LIVEJOINCLASS: "/live/:classId/join",
  RECHECK: "/live/:classId/re-checking",
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
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

// export const RecheckLive = async (courseIds) => {
//   try {
//     const results = await Promise.all(
//       courseIds.map((id) =>
//         LiveClassAPI.get(LiveUrl.RECHECK.replace(":classId", id)),
//       {
//         headers: {'Cache-Control'}
//       }
//       ),
//     );
//     const liveMap = {};
//     results.forEach((res, i) => {
//       if (res?.data?.isLive) {
//         liveMap[courseIds[i]] = {
//           classId: courseIds[i],
//           state: res.data.state,
//         };
//       }
//     });

//     return liveMap;
//   } catch (error) {
//     handleApiError(error);
//   }
// };


export const RecheckLive = async (courseIds) => {
  try {
    const results = await Promise.all(
      courseIds.map(id => LiveClassAPI.get(
        LiveUrl.RECHECK.replace(":classId", id),
        {
          headers: { 'Cache-Control': 'no-cache' }  
        }
      ))
    )

    console.log("the repsosne of the recheck live api would be ",results);
        const liveMap = {}
    results.forEach((res, i) => {
      if (res?.data?.isLive) {
        liveMap[courseIds[i]] = {
          classId: res.data.classId,
          state: res.data.state
        }
      }
    })
 

    return liveMap
  } catch (error) {
    handleApiError(error)
  }
}