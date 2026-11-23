// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import IconButton from "../common/iconButton";

// const MyProfile = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state?.profile?.user);

//   return (
//     <div>
//       <div className="mx-auto max-w-4xl space-y-6 text-white">
//         <h1 className="text-2xl font-semibold">My Profile</h1>
//         <h1 className="text-2xl font-semibold">Enrolled Courses</h1>
//         {/* PROFILE CARD */}
//         <div className="flex items-center justify-between rounded-xl bg-[#161D29] p-7">
//           <div className="flex items-center gap-4">
//             <img
//               src={user?.image?.url}
//               alt="Profile"
//               className="h-16 w-16 rounded-full object-cover"
//             />
//             <div>
//               <p className="text-lg font-semibold">
//                 {user?.firstName} {user?.lastName}
//               </p>
//               <p className="text-sm text-slate-400">{user?.email}</p>
//             </div>
//           </div>

//           <IconButton
//             text="Edit"
//             onClick={() => navigate("/dashboard/settings")}
//             coustomeclasses={
//               "flex items-center gap-2  bg-yellow-400 hover:bg-yellow-500   text-black font-medium  px-7 py-2.5 rounded-lg   text-sm   transition-colors cursor-pointer"
//             }
//           ></IconButton>
//         </div>

//         {/* ABOUT */}
//         <div className="rounded-xl bg-[#161D29] p-6">
//           <div className="mb-3 flex items-center justify-between">
//             <p className="text-lg font-semibold">About</p>
//             <IconButton
//               text="Edit"
//               onClick={() => navigate("/dashboard/settings")}
//               coustomeclasses={
//                 "flex items-center gap-2  bg-yellow-400 hover:bg-yellow-500   text-black font-medium  px-7 py-2.5 rounded-lg   text-sm   transition-colors cursor-pointer"
//               }
//             />
//           </div>
//           <p className="text-slate-400">
//             {user?.additionalDetails?.about || "Write Something About Yourself"}
//           </p>
//         </div>

//         {/* PERSONAL DETAILS */}
//         <div className="rounded-xl bg-[#161D29] p-6">
//           <div className="mb-6 flex items-center justify-between">
//             <p className="text-lg font-semibold">Personal Details</p>
//             <IconButton
//               text="Edit"
//               onClick={() => navigate("/dashboard/settings")}
//               coustomeclasses={
//                 "flex items-center gap-2  bg-yellow-400 hover:bg-yellow-500   text-black font-medium  px-7 py-2.5 rounded-lg   text-sm   transition-colors cursor-pointer"
//               }
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
//             <Detail label="First Name" value={user?.firstName} />
//             <Detail label="Last Name" value={user?.lastName} />
//             <Detail label="Email" value={user?.email} />
//             <Detail
//               label="Phone Number"
//               value={
//                 user?.additionalDetails?.contactNumber || "Add Contact Number"
//               }
//             />
//             <Detail
//               label="Gender"
//               value={user?.additionalDetails?.gender || "Add Gender"}
//             />
//             <Detail
//               label="Date of Birth"
//               value={
//                 user?.additionalDetails?.dateofBirth || "Add Date of Birth"
//               }
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mx-auto max-w-4xl space-y-6 text-white"></div>
//     </div>
//   );
// };

// const Detail = ({ label, value }) => (
//   <div>
//     <p className="text-slate-400">{label}</p>
//     <p className="font-medium">{value}</p>
//   </div>
// );

// export default MyProfile;
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconButton from "../common/iconButton";
import { Pencil } from "lucide-react";

const MyProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.profile?.user);

  return (
    <div
      className="mx-auto max-w-4xl space-y-5 text-white pb-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        .profile-card {
          background: #0f1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          border-radius: 16px;
          padding: 24px;
        }

        .edit-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(251,191,36,0.15);
          border: 1px solid rgba(251,191,36,0.4);
          color: #fbbf24;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .edit-btn:hover {
          background: rgba(251,191,36,0.25);
          border-color: rgba(251,191,36,0.7);
          box-shadow: 0 0 20px rgba(251,191,36,0.2);
        }

        .detail-item {
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent);
          margin-bottom: 20px;
        }
      `}</style>

      {/* Page Title */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "rgba(251,191,36,0.85)" }}
        >
          Account
        </p>
        <h1 className="text-2xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.02em" }}
        >
          My Profile
        </h1>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.image?.url}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
              style={{ border: "2px solid rgba(255,255,255,0.18)" }}
            />
            {/* online dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full"
              style={{ background: "#34d399", border: "2px solid #060d1a" }}
            />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: "#f0f4ff" }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              {user?.email}
            </p>
          </div>
        </div>

        <IconButton
          text="Edit"
          onClick={() => navigate("/dashboard/settings")}
          coustomeclasses="edit-btn"
        >
          <Pencil size={12} />
        </IconButton>
      </div>

      {/* ABOUT */}
      <div className="profile-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff" }}>About</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>A short bio about you</p>
          </div>
          <IconButton
            text="Edit"
            onClick={() => navigate("/dashboard/settings")}
            coustomeclasses="edit-btn"
          />
        </div>
        <div className="section-divider" />
        <p className="text-sm leading-relaxed"
          style={{ color: user?.additionalDetails?.about ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", fontStyle: user?.additionalDetails?.about ? "normal" : "italic" }}
        >
          {user?.additionalDetails?.about || "Write something about yourself"}
        </p>
      </div>

      {/* PERSONAL DETAILS */}
      <div className="profile-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff" }}>Personal Details</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Your account information</p>
          </div>
          <IconButton
            text="Edit"
            onClick={() => navigate("/dashboard/settings")}
            coustomeclasses="edit-btn"
          />
        </div>
        <div className="section-divider" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Detail label="First Name" value={user?.firstName} />
          <Detail label="Last Name" value={user?.lastName} />
          <Detail label="Email" value={user?.email} />
          <Detail
            label="Phone Number"
            value={user?.additionalDetails?.contactNumber || "Add Contact Number"}
          />
          <Detail
            label="Gender"
            value={user?.additionalDetails?.gender || "Add Gender"}
          />
          <Detail
            label="Date of Birth"
            value={user?.additionalDetails?.dateofBirth || "Add Date of Birth"}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 text-white"></div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="detail-item">
    <p className="text-xs font-semibold uppercase tracking-widest mb-1"
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      {label}
    </p>
    <p className="text-sm font-medium" style={{ color: value?.startsWith?.("Add") ? "rgba(255,255,255,0.3)" : "#f0f4ff" }}>
      {value}
    </p>
  </div>
);

export default MyProfile;
