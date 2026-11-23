import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { changePassword } from "../../../services/auth"; // adjust path
import Input from "./Input";
import { KeyRound } from "lucide-react";

const PasswordChangeForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <KeyRound size={15} style={{ color: "#fbbf24" }} />
        </div>
        <div>
          <h2 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff", letterSpacing: "-0.01em" }}>
            Password
          </h2>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Update your password</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
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
          Update Password
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
