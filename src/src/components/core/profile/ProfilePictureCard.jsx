/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ImageUploader } from "../../../services/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../Slices/profile";
import { Camera, Upload } from "lucide-react";

const ProfilePictureCard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // select image
  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // upload image
  const UploadFile = async () => {
    if (!selectedFile) {
      return toast.error("Select an image first");
    }

    const toastId = toast.loading("Uploading image...");
    try {
      const formdata = new FormData();
      formdata.append("image", selectedFile);

      const response = await ImageUploader(formdata);

      if (!response?.image) {
        throw new Error("Image URL missing");
      }

      // UPDATE REDUX WITH BACKEND IMAGE URL
      dispatch(
        setUser({
          ...user,
          image: {
            url: response.image,
            publicId: "", // optional for now
          },
        })
      );

      toast.success(response.message || "Image uploaded successfully", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to upload image. Try again.", {
        id: toastId,
        duration: 5000,
      });
    }
  };

  return (
    <div
      className="flex items-center gap-6 rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={
            preview ||
            user?.image?.url ||
            "https://api.dicebear.com/5.x/initials/svg?seed=User"
          }
          alt="profile"
          className="h-20 w-20 rounded-full object-cover"
          style={{ border: "2px solid rgba(255,255,255,0.1)" }}
        />
        <label
          htmlFor="profilePic"
          className="absolute -bottom-1 -right-1 cursor-pointer flex items-center justify-center rounded-full"
          style={{
            width: 26, height: 26,
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            boxShadow: "0 2px 8px rgba(251,191,36,0.4)",
          }}
        >
          <Camera size={13} color="#000" />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
          id="profilePic"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold text-sm mb-0.5" style={{ color: "#f0f4ff" }}>
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          {preview ? "New photo selected — click Upload to save" : "JPG, PNG or WEBP recommended"}
        </p>

        <div className="flex gap-3">
          <label
            htmlFor="profilePic"
            className="cursor-pointer text-xs font-medium px-4 py-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              transition: "all 0.2s",
            }}
          >
            Select Photo
          </label>

          <button
            onClick={UploadFile}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "#000",
              boxShadow: "0 4px 16px rgba(251,191,36,0.2)",
              transition: "all 0.2s",
            }}
          >
            <Upload size={13} /> Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureCard;
