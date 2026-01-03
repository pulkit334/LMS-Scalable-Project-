
export const getVideoDuration = (file) => {

  // We return a Promise because reading video metadata is asynchronous
  return new Promise((resolve, reject) => {

    // Create a temporary HTML <video> element in memory
    // This element is NOT shown on the UI
    const video = document.createElement("video");

    // Tell the browser to load ONLY metadata (duration, width, height)
    video.preload= "metadata";

    // Convert the local file into a temporary browser URL (blob URL)
    // The video element cannot read files directly, it needs a URL
    video.src = URL.createObjectURL(file);

    // This event fires when metadata has finished loading
    // At this point, video.duration becomes available
    video.onloadedmetadata = () => {

      // Free up memory by removing the temporary blob URL
      // Very important when handling multiple uploads
      URL.revokeObjectURL(video.src);

      // video.duration is returned in SECONDS (can be decimal)
      // Math.floor removes decimals (e.g., 125.78 → 125)
      resolve(Math.floor(video.duration));
    };

    // If the browser fails to read the video file
    // (corrupt file, unsupported format, etc.)
    video.onerror = () => {
      reject("Failed to load video metadata");
    };
  });
};
