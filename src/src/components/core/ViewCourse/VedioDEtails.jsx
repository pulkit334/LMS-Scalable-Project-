import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const VedioDEtails = () => {
  const { courseSectionData } = useSelector((state) => state.viewCourse);
  const { subSectionId } = useParams();
  const [vedioActive, setVedioActive] = useState(false);

  let selectedSubSection = null;

  courseSectionData?.forEach((section) => {
    section?.subsection?.forEach((s) => {
      if (s._id === subSectionId) {
        selectedSubSection = s;
      }
    });
  });

  if (!selectedSubSection) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Video not found
      </div>
    );
  }

  return (
    /*  PAGE BACKGROUND GRADIENT */
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-r from-[#020617] via-[#161D29] to-[#020617] p-6">
      
      {/* VIDEO CONTAINER */}
      <div className="relative w-full max-w-5xl mx-auto bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        
        {!vedioActive && (
          <button
            onClick={() => setVedioActive(true)}
            className="absolute z-10 border border-white rounded-full px-6 py-6 text-white text-2xl bg-black/60 backdrop-blur-sm hover:scale-105 transition"
          >
            ▶
          </button>
        )}

        {vedioActive && (
          <video
            src={selectedSubSection.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/*  TITLE & DESCRIPTION */}
      <div className="max-w-5xl mx-auto mt-6">
        <h1 className="text-xl font-semibold text-white">
          {selectedSubSection.tittle}
        </h1>
        <p className="text-slate-400 mt-1">
          {selectedSubSection.description}
        </p>
      </div>
    </div>
  );
};

export default VedioDEtails;
