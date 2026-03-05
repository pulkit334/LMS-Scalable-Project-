import { useState } from "react";
// import { Eye, EyeOff} from "lucide-react";
import { Eye,EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendotp } from "../../../services/auth";
import { useDispatch } from "react-redux";
import { setSinupData } from "../../../Slices/authslice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  // FULL FORM STATE
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    accountType: "student",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      accountType: role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      dispatch(setSinupData(formData));

      //   await sendotp(formData.email);
      await sendotp({ email: formData.email });

      //   navigate("/verify-otp", { state: formData });
      navigate("/verify-otp");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT – FORM */}
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-semibold text-white mb-2">
              Create Account
            </h1>

            {/* ROLE SWITCH */}
            <div className="flex  bg-[#0f172a] rounded-full p-1 w-fit mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange("student")}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  formData.accountType === "student"
                    ? "bg-[#020617] text-white"
                    : "text-gray-400"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("instructor")}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  formData.accountType === "instructor"
                    ? "bg-[#020617] text-white"
                    : "text-gray-400"
                }`}
              >
                Instructor
              </button>
            </div>
            <div className=" text-white  rounded-full top-[-9vh] w-fit relative left-[60%]">
              {" "}
              <button
                onClick={() => {
                   window.location.href =
                    `${import.meta.env.VITE_API_URL}auth/google`;
                }}
                className="flex items-center justify-center gap-2 w-full border py-2 rounded"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="google"
                  className="h-5"
                />
                Continue with Google
              </button>
            </div>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="auth-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="auth-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="auth-input w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                name="contactNumber"
                placeholder="Contact Number"
                minLength={10}
                maxLength={10}
                className="auth-input w-full"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />

              {/* PASSWORD */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  minLength={6}
                  className="auth-input w-full pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {/* {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
                  {showPassword ? <EyeOff/> : <Eye/>}
                </button>
              </div>

              {/* CONFIRM */}
              <div className="relative">
                <input
                  name="confirmPassword"
                  required
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="auth-input w-full pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                {/* {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />} */}
                {/* {showConfirm ? <EyeOff/> : <Eye/>} */}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 py-2.5 rounded-md font-semibold text-black"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* RIGHT – YOUR EXACT IMAGE */}
          <div
            className="relative z-10 h-105 w-full rounded-3xl 
            border border-slate-600/60 
            bg-[#0b1220]/40 backdrop-blur-sm
            shadow-[0_0_40px_rgba(59,130,246,0.15)]
            flex items-center justify-center"
          >
            <div className="h-[90%] w-[90%] rounded-2xl overflow-hidden">
              <img
                src="/Images/aboutus2.webp"
                alt="Signup Visual"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
 
  );
};

export default Signup;
