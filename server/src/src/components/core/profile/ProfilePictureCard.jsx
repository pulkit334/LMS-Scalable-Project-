/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ImageUploader } from "../../../services/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../Slices/profile";


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
        duration: 5000, // ⏱ stays for 5 sec
      });
    }
  };

  return (
    <div className="flex items-center gap-6 rounded-xl bg-[#161D29] p-6">
      <img
        src={
          preview ||
          user?.image?.url ||
          "https://api.dicebear.com/5.x/initials/svg?seed=User"
        }
        alt="profile"
        className="h-20 w-20 rounded-full object-cover"
      />

      <div>
        <p className="mb-2 font-medium">Change Profile Picture</p>

        <div className="flex gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleSelect}
            className="hidden"
            id="profilePic"
          />

          <label
            htmlFor="profilePic"
            className="cursor-pointer rounded-md bg-gray-700 px-4 py-2 text-sm"
          >
            Select
          </label>

          <button
            onClick={UploadFile}
            className="rounded-md bg-yellow-400 px-4 py-2 text-sm text-black"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureCard;
