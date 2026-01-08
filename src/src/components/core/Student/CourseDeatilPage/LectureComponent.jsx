// eslint-disable-next-line react-refresh/only-export-components
const Lecture = ({ lecture }) => {
  return (
    <div className="flex justify-between items-center px-10 py-3 text-sm text-gray-300 border-t border-gray-800">
      <div className="flex items-center gap-3">
        ▶ {lecture.tittle}
      </div>
      <span>{lecture.timeduration}s</span>
    </div>
  );
};

export default Lecture;
