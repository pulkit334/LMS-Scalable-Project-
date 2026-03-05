

export default function AccountDeactivated() {
  const handleReactivate = () => {
    window.location.href = "/support/reactivate-account";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1c2d] px-6 text-white">
      <div className="w-full max-w-md rounded-xl bg-[#12263a] p-8 text-center shadow-2xl">
        
        {/* Icon */}
        <div className="mb-4 text-5xl">⚠️</div>

        {/* Title */}
        <h1 className="mb-3 text-xl font-semibold">
          Account Deactivation In Progress
        </h1>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          A request has been submitted to delete your account.
          Your account will be permanently deleted within{" "}
          <span className="font-semibold text-white">
            2 working days
          </span>.
        </p>

        <p className="mb-7 text-sm leading-relaxed text-slate-400">
          If this request was made by mistake, you can reactivate your
          account before the deletion is completed.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleReactivate}
          className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Reactivate Account
        </button>

        {/* Footer */}
        <p className="mt-5 text-xs text-slate-400">
          Need help? Contact support before deletion is finalized.
        </p>
      </div>
    </div>
  );
}
