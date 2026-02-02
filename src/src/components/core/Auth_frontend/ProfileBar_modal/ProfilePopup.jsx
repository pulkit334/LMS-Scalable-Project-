import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { persistor } from "../../../../store/store";
import { logout } from "../../../../Slices/authslice";
import { useEffect } from "react";
import { clearUser } from "../../../../Slices/profile";
import { ACCOUNT_TYPE } from "../../../../utils/constants";

export const ProfileMenu = () => {
  const { user } = useSelector((state) => state?.profile);
  const dispatch = useDispatch();

  const isAdmin = user?.accountType === ACCOUNT_TYPE.ADMIN;

  useEffect(() => {
    if (!user) {
      dispatch(clearUser());
      dispatch(logout());
    }
  }, [user, dispatch]);

  return (
    <div className="absolute right-0 top-12 z-50 w-[320px] rounded-2xl bg-white shadow-2xl border border-gray-200">
      <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
        Currently in
      </div>

      {/* USER INFO */}
      <div className="mx-2 flex items-center justify-between rounded-xl p-3 hover:bg-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={user?.image?.url}
            className="h-12 w-12 rounded-full"
            alt="profile"
          />
          <div>
            <p className="font-semibold">{user?.firstName}</p>
            <p className="text-sm text-gray-900">{user?.accountType}</p>
            <p className="text-xs text-black truncate max-w-45">
              {user?.email}
            </p>
          </div>
        </div>
        <span>✓</span>
      </div>

      <div className="my-2 border-t" />


      {!isAdmin && (
        <>
          <Link to="/dashboard/my-profile">
            <button className="w-full px-6 py-3 text-left hover:bg-gray-100">
              Go to profile
            </button>
          </Link>

          <button className="w-full px-6 py-3 text-left hover:bg-gray-100">
            Convert to business
          </button>
        </>
      )}

      {/* LOGOUT (FOR EVERYONE) */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          persistor.purge();
          dispatch(logout());
        }}
        className="w-full px-6 py-3 text-left text-red-600 hover:bg-red-50"
      >
        Log out
      </button>
    </div>
  );
};
