import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconButton from "../common/iconButton";

const MyProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.profile?.user);

  return (
    <div>
      <div className="mx-auto max-w-4xl space-y-6 text-white">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <h1 className="text-2xl font-semibold">Enrolled Courses</h1>
        {/* PROFILE CARD */}
        <div className="flex items-center justify-between rounded-xl bg-[#161D29] p-7">
          <div className="flex items-center gap-4">
            <img
              src={user?.image?.url}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>

          <IconButton
            text="Edit"
            onClick={() => navigate("/dashboard/settings")}
            coustomeclasses={
              "flex items-center gap-2  bg-yellow-400 hover:bg-yellow-500   text-black font-medium  px-7 py-2.5 rounded-lg   text-sm   transition-colors cursor-pointer"
            }
          ></IconButton>
        </div>

        {/* ABOUT */}
        <div className="rounded-xl bg-[#161D29] p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-lg font-semibold">About</p>
            <IconButton
              text="Edit"
              onClick={() => navigate("/dashboard/settings")}
              coustomeclasses={
                "flex items-center gap-2  bg-yellow-400 hover:bg-yellow-500   text-black font-medium  px-7 py-2.5 rounded-lg   text-sm   transition-colors cursor-pointer"
              }
            />
          </div>
          <p className="text-slate-400">
            {user?.additionalDetails?.about || "Write Something About Yourself"}
          </p>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="rounded-xl bg-[#161D29] p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-lg font-semibold">Personal Details</p>
            <IconButton
              text="Edit"
              onClick={() => navigate("/dashboard/settings")}
              coustomeclasses={
                "flex items-center gap-2  bg-yellow-400 hover:bg-yellow-500   text-black font-medium  px-7 py-2.5 rounded-lg   text-sm   transition-colors cursor-pointer"
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
            <Detail label="First Name" value={user?.firstName} />
            <Detail label="Last Name" value={user?.lastName} />
            <Detail label="Email" value={user?.email} />
            <Detail
              label="Phone Number"
              value={
                user?.additionalDetails?.contactNumber || "Add Contact Number"
              }
            />
            <Detail
              label="Gender"
              value={user?.additionalDetails?.gender || "Add Gender"}
            />
            <Detail
              label="Date of Birth"
              value={
                user?.additionalDetails?.dateofBirth || "Add Date of Birth"
              }
            />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-6 text-white"></div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-slate-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default MyProfile;
