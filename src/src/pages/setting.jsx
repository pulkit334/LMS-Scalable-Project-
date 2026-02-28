const Settings = () => {
  return (
    <div
      className="min-h-screen w-full px-4 py-8 sm:px-6 lg:px-10"
      style={{ background: "#0f1520" }}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "#f0f4ff",
            letterSpacing: "-0.02em",
          }}
        >
          Settings
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Manage your account preferences
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
