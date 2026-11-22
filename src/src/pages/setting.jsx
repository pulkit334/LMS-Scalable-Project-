import ProfilePictureCard from "../components/core/profile/ProfilePictureCard";
import ProfileInfoForm from "../components/core/profile/ProfileInfoForm";
import PasswordChangeForm from "../components/core/profile/PasswordChangeForm";
import DeleteAccount from "../components/core/profile/DeleteAccount";

const Settings = () => {
  return (
    <div className="min-h-screen w-full px-2 py-4 sm:px-4 lg:px-8">
      {/* Page Header */}
      <div className="mx-auto max-w-3xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your profile photo, personal details, password, and account preferences
        </p>
      </div>

      {/* Cards Stack */}
      <div className="mx-auto max-w-3xl space-y-6">
        <ProfilePictureCard />
        <ProfileInfoForm />
        <PasswordChangeForm />
        <DeleteAccount />
      </div>
    </div>
  );
};

export default Settings;
