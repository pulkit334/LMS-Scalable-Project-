export function courseProgress(courseProgress = []) {
  const progressMap = new Map();

  courseProgress.forEach((progress) => {
    progressMap.set(
      progress.courseId.toString(),
      progress.completedVideos.length
    );
  });

  return progressMap;
}
// calculate the length
export function courseLengthCalculate(course) {
  let totalLecture = 0;

  course.courseContent.forEach((Section) => {
    if (Array.isArray(Section.subsection)) {
      totalLecture += Section.subsection.length;
    }
  });
  return totalLecture;
}
