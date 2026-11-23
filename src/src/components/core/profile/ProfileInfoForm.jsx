/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ProfileUpdater } from "../../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../Slices/profile";
import Input from "./Input";
import Select from "./select";

const ProfileInfoForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateofBirth: "",
      gender: "Other",
      contactNumber: "",
      about: "",
    },
  });

  //  Sync Redux → RHF
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateofBirth: user.dateofBirth || "",
        gender: user.gender || "Other",
        contactNumber: user.contactNumber || "",
        about: user.about || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating profile...");

    try {
      //  Send ONLY changed fields
      const payload = {};
      Object.keys(dirtyFields).forEach((key) => {
        payload[key] = data[key];
      });

      const response = await ProfileUpdater(payload);
      const updatedProfileData = response.data;

      dispatch(
        setUser({
          ...user,
          ...updatedProfileData,
        })
      );

      toast.success("Profile updated successfully", { id: toastId });
    } catch (error) {
      toast.error("Error while updating profile", { id: toastId });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="mb-6">
        <h2 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}>
          Profile Information
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Update your personal details</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Input
          label="First Name *"
          error={errors.firstName}
          {...register("firstName")}
        />
        <Input
          label="Last Name *"
          error={errors.lastName}
          {...register("lastName")}
        />

        <Input
          label="Date of Birth *"
          type="date"
          error={errors.dateofBirth}
          {...register("dateofBirth")}
        />

        <Select
          label="Gender *"
          error={errors.gender}
          {...register("gender")}
        />

        <Input
          label="Contact Number *"
          error={errors.contactNumber}
          {...register("contactNumber", {
            minLength: { value: 10, message: "Invalid number" },
          })}
        />

        <Input
          label="About *"
          error={errors.about}
          {...register("about", {
            maxLength: { value: 150, message: "Max 150 characters" },
          })}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!isDirty}
          className="px-6 py-2 rounded-lg text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            color: "#000",
            boxShadow: "0 4px 16px rgba(251,191,36,0.2)",
            opacity: isDirty ? 1 : 0.4,
            cursor: isDirty ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileInfoForm;
