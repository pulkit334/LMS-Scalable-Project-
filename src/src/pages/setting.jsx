import ProfilePictureCard from "../components/core/profile/ProfilePictureCard";
import ProfileInfoForm from "../components/core/profile/ProfileInfoForm";
import PasswordChange from "../components/core/profile/PasswordChangeForm";
import  DeleteAccount  from "../components/core/profile/DeleteAccount";
const EditProfile = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 text-white">
      <h1 className="text-2xl font-semibold">Edit Profile</h1>
      <ProfilePictureCard />
      <ProfileInfoForm />
      <PasswordChange />
      <DeleteAccount />
    </div>
  );
};

export default EditProfile;
