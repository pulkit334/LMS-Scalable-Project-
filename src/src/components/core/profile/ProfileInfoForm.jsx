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
    formState: { errors, isDirty, dirtyFields,isSubmitSuccessful },
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
      className="rounded-xl bg-[#161D29] p-6"
    >
      <h2 className="mb-6 font-semibold">Profile Information</h2>

      <div className="grid grid-cols-2 gap-6">
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
        <button type="button" className="rounded-md bg-gray-700 px-4 py-2">
          Cancel
        </button>

        <button
          type="submit"
          disabled={!isDirty}
          className="rounded-md bg-yellow-400 px-4 py-2 text-black disabled:opacity-50"
        >
          Save
        </button>
      </div>  
    </form>
  );
};
export default ProfileInfoForm;
