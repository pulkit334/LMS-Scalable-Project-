import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { persistor } from "../../../../store/store";
import { logout } from "../../../../Slices/authslice";
import { useEffect } from "react";
import { clearUser } from "../../../../Slices/profile";
import { ACCOUNT_TYPE } from "../../../../utils/constants";
import { Check, LogOut, User } from "lucide-react";

export const ProfileMenu = () => {
  const { user } = useSelector((state) => state?.profile);
  const dispatch = useDispatch();

  const isAdmin = user?.accountType?.toLowerCase() === ACCOUNT_TYPE.ADMIN;

  useEffect(() => {
    if (!user) {
      dispatch(clearUser());
      dispatch(logout());
    }
  }, [user, dispatch]);

  return (
    <div className="absolute right-0 top-12 z-50 w-[300px] rounded-2xl bg-[#0f172a] border border-white/10 text-slate-100 shadow-2xl shadow-black/60 overflow-hidden">
      <div className="px-4 pt-3.5 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Signed in as
      </div>

      {/* USER INFO */}
      <div className="mx-2 flex items-center justify-between rounded-xl p-2.5 bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              user?.image?.url ||
              `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName || "User"}`
            }
            className="h-11 w-11 rounded-full object-cover ring-1 ring-white/15 shrink-0"
            alt="profile"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/25 my-0.5">
              {user?.accountType}
            </span>
            <p className="text-xs text-slate-400 truncate max-w-[175px]">
              {user?.email}
            </p>
          </div>
        </div>
        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
      </div>

      <div className="my-2 border-t border-white/10" />

      <div className="px-2 pb-2 space-y-1">
        {!isAdmin && (
          <Link
            to="/dashboard/my-profile"
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/[0.06] hover:text-amber-300 transition-colors"
          >
            <User className="w-4 h-4" />
            Go to profile
          </Link>
        )}

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            persistor.purge();
            dispatch(logout());
          }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
};
