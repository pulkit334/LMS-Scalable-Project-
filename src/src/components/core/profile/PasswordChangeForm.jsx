import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { changePassword } from "../../../services/auth"; // adjust path
import Input from "./Input";

const PasswordChangeForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating password...");

    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password updated successfully", { id: toastId });
      reset(); 
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
        { id: toastId }
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl bg-[#161D29] p-6"
    >
      <h2 className="mb-6 font-semibold">Password</h2>

      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Current Password *"
          error={errors.oldPassword}
          {...register("oldPassword", {
            required: "Current password is required",
          })}
        />

        <Input
          label="New Password *"
          error={errors.newPassword}
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-gray-700 px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!isDirty}
          className="rounded-md bg-yellow-400 px-4 py-2 text-black disabled:opacity-50"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;

