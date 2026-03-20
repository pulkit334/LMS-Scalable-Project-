import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/apiconnnector";
import { useDispatch, useSelector } from "react-redux";
import { restoreUser } from "../utils/restore";
import { setToken } from "../Slices/authslice";
import toast from "react-hot-toast";
import { ProfileDropDown } from "../components/core/Auth_frontend/ProfileDropDown";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ready = useSelector((state) => state.profile.ready);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
const restoreUsers = async () => {  
      if (!token) return;

      try {
        // 1️ Save token
        localStorage.setItem("token", token);

        // 2️ Update redux token (IMPORTANT)
        dispatch(setToken(token));

        // 3️ Update axios
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 4️ RESTORE USER (PASS DISPATCH )
        await restoreUser(dispatch);
        if (!ready) {
          return toast.error("Error With Sign");
        }
        <ProfileDropDown />;

        navigate("/", { replace: true });
      } catch (err) {
        console.error("Google auth restore failed", err);
        navigate("/login");
      }
    };

    restoreUsers();
  }, [navigate, dispatch]);

  return <p>Signing you in...</p>;
};

export default GoogleAuth;
