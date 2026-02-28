import { handleApiError } from "../../utils/handleAPiError";
import { LiveClassAPI } from "../apiconnnector";
const LiveUrl = {
  CREATE_URL: "/live/create",
  START_CLASS: "/live/:classId/start",
  END_CLASS: "/live/:classId/end",
  LIVEJOINCLASS: "/live/:classId/join",
  RECHECK: "/live/:courseId/re-checking",
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
    const results = await Promise.allSettled(  //  allSettled instead of all
      courseIds.map(id => LiveClassAPI.get(
        LiveUrl.RECHECK.replace(":courseId", id)
      ))
    )

    console.log("recheck results:", results)  //  now this will always print

    const liveMap = {}
    results.forEach((result, i) => {
      if (result.status === 'fulfilled' && result.value?.data?.isLive) {
        liveMap[courseIds[i]] = {
          classId: result.value.data.classId,
          title: result.value.data.title,
          course: courseIds[i]
        }
      }
      // 404s are just ignored 
    })

    console.log(" liveMap:", liveMap)
    return liveMap
  } catch (error) {
    console.log("RecheckLive error:", error)
    return {}  //  return empty map instead of crashing
  }
}