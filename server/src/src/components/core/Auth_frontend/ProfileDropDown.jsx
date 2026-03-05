import { useSelector } from "react-redux";
import { ProfileMenu } from "./ProfileBar_modal/ProfilePopup";
import { useEffect, useRef, useState } from "react";
export const ProfileDropDown = () => {
  const user = useSelector((state) => state.profile.user);
  const ready = useSelector((state) => state.profile.ready);
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!ready) return null;

  return (
    <div ref={popupRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full p-1 cursor-pointer hover:bg-gray-200"
      >
        <img
          src={
            user?.image?.url ||
            "https://api.dicebear.com/5.x/initials/svg?seed=User"
          }
          alt="profile"
          className="h-8 w-8 rounded-full object-cover"
        />

        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && <ProfileMenu />}
    </div>
  );
};
