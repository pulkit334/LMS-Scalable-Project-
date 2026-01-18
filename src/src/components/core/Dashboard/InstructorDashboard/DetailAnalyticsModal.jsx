
import { Radar } from "react-chartjs-2";

const DetailAnalyticsModal = ({ open, onClose, radarData, radarOptions }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose} //click outside close
    >
      <div
        className="w-[90%] max-w-175 bg-[#1F2937] p-6 rounded-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Detail Analytics
          </h2>

          <button
            onClick={onClose}
            className="text-white text-lg px-3 py-1 rounded-md bg-richblack-600 hover:bg-richblack-500"
          >
            ✕
          </button>
        </div>

        {/* Radar Chart */}
        <div className="w-full h-95">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
    </div>
  );
};

export default DetailAnalyticsModal;
