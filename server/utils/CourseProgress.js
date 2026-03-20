export function courseProgress(courseProgress = []) {
  const progressMap = new Map();
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
