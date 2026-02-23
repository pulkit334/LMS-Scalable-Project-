import ProfilePictureCard from "../components/core/profile/ProfilePictureCard";
import ProfileInfoForm from "../components/core/profile/ProfileInfoForm";
import PasswordChange from "../components/core/profile/PasswordChangeForm";
import DeleteAccount from "../components/core/profile/DeleteAccount";

const EditProfile = () => {
  return (
    <div
      className="mx-auto max-w-4xl space-y-6 text-white pb-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
      `}</style>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "rgba(251,191,36,0.6)" }}
        >
          Account
        </p>
        <h1 className="text-2xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.02em" }}
        >
          Edit Profile
        </h1>
      </div>

      <ProfilePictureCard />
      <ProfileInfoForm />
      <PasswordChange />
      <DeleteAccount />
    </div>
  );
};

export default EditProfile;
