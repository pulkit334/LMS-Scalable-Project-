function convertSecondsToDuration(seconds) {
  if (!seconds || seconds <= 0) return "0 sec";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let duration = "";

  if (hours > 0) duration += `${hours} hr `;
  if (minutes > 0) duration += `${minutes} min `;
  if (remainingSeconds > 0 && hours === 0)
    duration += `${remainingSeconds} sec`;

  return duration.trim();
}
module.exports = convertSecondsToDuration