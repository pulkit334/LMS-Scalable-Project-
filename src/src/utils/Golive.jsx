/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CreateLiveClassAPI } from "../services/Live/Live-Services";
import toast from "react-hot-toast";

export const GoLive = ({ courses, onClose, PUBLISHED }) => {
  const navigate = useNavigate();
  const [liveTitle, setLiveTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);

 const handleStartLive = async () => {
  setLoading(true)
  try {
    const data = await CreateLiveClassAPI(liveTitle, selectedCourse)
    const classId = data.class._id
    onClose()
    navigate(`/live/${classId}/start`)
  } catch (err) {
    toast.error(err.message)  // ← shows proper toast not ugly alert
  } finally {
    setLoading(false)
  }
}
return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="text-white text-xl font-bold">Start Live Class</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block uppercase tracking-widest">
            Class Title
          </label>
          <input
            value={liveTitle}
            onChange={(e) => setLiveTitle(e.target.value)}
            placeholder="eg. Today's Live Lecture"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition"
          />
        </div>

        {/* Select Course */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block uppercase tracking-widest">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition"
          >
            <option value="">-- Select a course --</option>
            {courses
              .filter(
                (course) => course?.status?.toLowerCase() !== PUBLISHED.DRAFT,
              )
              .map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStartLive}
            disabled={!liveTitle || !selectedCourse || loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white py-3 rounded-xl text-sm font-semibold transition"
          >
            {loading ? "Creating..." : "🔴 Start Live"}
          </button>
        </div>
      </div>
    </div>
  );
};
