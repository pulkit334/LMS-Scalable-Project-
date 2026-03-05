import React from "react";

const Asideinformation = () => {
  return (
    <aside className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 h-fit">
      <h3 className="font-semibold mb-4">⚡ Course Upload Tips</h3>
      <ul className="space-y-2 text-sm text-slate-300">
        <li>• Set the Course Price option or make it free.</li>
        <li>• Standard size for the course thumbnail is 1024×576.</li>
        <li>• Video section controls the course overview video.</li>
        <li>• Course Builder is where you create & organize a course.</li>
        <li>
          • Add topics in the Course Builder to create lessons, quizzes, and
          assignments.
        </li>
        <li>
          • Information from the Additional Data section appears on the course
          single page.
        </li>
        <li>
          • Make announcements to send important notes to all enrolled students
          at once.
        </li>
      </ul>
    </aside>
  );
};

export default Asideinformation;
