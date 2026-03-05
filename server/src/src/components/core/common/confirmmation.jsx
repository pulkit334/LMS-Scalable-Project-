import React from "react";

const Confirmation = ({ modalData, loading }) => {
  return (
    // BACKDROP
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* MODAL CARD */}
      <div className="w-[90%] max-w-md rounded-xl bg-[#161D29] p-7 shadow-xl border border-white/10">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-red-500" />
          </div>
        )}
        {/* TITLE */}
        <h2 className="text-xl font-semibold text-white">{modalData?.text1}</h2>

        {/* SUBTEXT */}
        <p className="mt-2 text-sm text-gray-400">{modalData?.text2}</p>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">
          {/* PRIMARY (Logout / Account Delete button) */}
          <button
            onClick={modalData?.btn1handler}
            className={`rounded-lg cursor-pointer px-4 py-2 text-sm font-medium transition ${
              modalData?.flagAccountDelete
                ? "bg-red-700 text-white"
                : "bg-yellow-400 hover:bg-yellow-500 text-black"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : modalData.btn1text}
          </button>

          {/* SECONDARY (Cancel) */}
          <button
            onClick={modalData?.btn2handler}
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm  cursor-pointer font-medium text-white hover:bg-gray-500 transition"
          >
            {modalData?.btn2text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
