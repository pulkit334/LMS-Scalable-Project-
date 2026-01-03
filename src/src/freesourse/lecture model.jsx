// import { X, Upload } from "lucide-react";

// const AddLectureModal = ({ isOpen, onClose, sectionId }) => {
//   if (!isOpen) return null;

//   const handleSave = async () => {
//     // 🔴 API CALL WILL GO HERE
//     // POST /subsection/create
//     // needs: sectionId, video, title, description

//     console.log("Saving lecture for section:", sectionId);

//     // after success
//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-[#0A0F1C]/90 flex items-center justify-center"
//       onClick={onClose} //  click outside closes modal
//     >
//       <div
//         className="w-full max-w-lg bg-[#0C1427] rounded-xl border border-[#1E2A44] p-6"
//         onClick={(e) => e.stopPropagation()} // prevent close on modal click
//       >
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#1E2A44]">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-6 bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-full"></div>
//             <h2 className="text-white text-lg font-bold">
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6FF] to-[#0072FF]">Study Notion </span>
//               <span className="text-white">X</span> | Adding Lecture
//             </h2>
//           </div>
//           <button onClick={onClose}>
//             <X className="text-slate-400 hover:text-white" />
//           </button>
//         </div>

//         {/* VIDEO */}
//         <div className="mb-6">
//           <label className="text-sm font-medium text-white mb-3 block">
//             Lecture Video *
//           </label>
//           <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#1E2A44] rounded-xl p-8 cursor-pointer hover:border-[#00C6FF]/50 transition-colors">
//             <div className="p-3 rounded-lg bg-gradient-to-br from-[#00C6FF]/10 to-[#0072FF]/10 mb-4">
//               <Upload className="text-[#00C6FF]" />
//             </div>
//             <p className="text-sm text-slate-400">
//               Drag and drop a video, or{" "}
//               <span className="text-[#00C6FF] font-medium">Browse</span>
//             </p>
//             <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
//               <span>Agreed ratio: 15:9</span>
//               <span>•</span>
//               <span>Recommended size: 1024×576</span>
//             </div>
//             <input type="file" accept="video/*" hidden />
//           </label>
//         </div>

//         {/* TITLE */}
//         <div className="mb-6">
//           <label className="text-sm font-medium text-white mb-2 block">
//             Lecture Title *
//           </label>
//           <input
//             className="w-full h-11 bg-[#0A0F1C] border border-[#1E2A44] rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00C6FF] transition-colors"
//             placeholder="Enter Lecture Title"
//           />
//         </div>

//         {/* DESCRIPTION */}
//         <div className="mb-8">
//           <label className="text-sm font-medium text-white mb-2 block">
//             Lecture Description *
//           </label>
//           <textarea
//             rows={4}
//             className="w-full bg-[#0A0F1C] border border-[#1E2A44] rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00C6FF] transition-colors"
//             placeholder="Enter Lecture Description"
//           />
//         </div>

//         {/* SAVE */}
//         <div className="flex justify-end">
//           <button
//             onClick={handleSave}
//             className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddLectureModal;