import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { RecheckLive } from "../../services/Live/Live-Services";
import { handleApiError } from "../../utils/handleAPiError";

export const useLiveStatus = (courseIds = []) => {
  const [liveMap, setLiveMap] = useState({});
  const courseKey = courseIds.join(",");

  useEffect(() => {
    if (!courseIds.length) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", async () => {
      courseIds.forEach((id) => socket.emit("join:course", id));

      try {
        const initialMap = await RecheckLive(courseIds);
        if (initialMap && Object.keys(initialMap).length > 0) {
          setLiveMap((prev) => ({ ...prev, ...initialMap }));
        }
      } catch (error) {
        handleApiError(error);
      }
    });

    socket.on("class:live", (data) => {
      setLiveMap((prev) => ({
        ...prev,
        [data.course]: data,
      }));
    });

    socket.on("class:ended", (data) => {
      setLiveMap((prev) => {
        if (!prev[data.course]) return prev;
        const next = { ...prev };
        delete next[data.course];
        return next;
      });
    });

    return () => socket.disconnect();
  }, [courseKey]);

  return liveMap;
};
