import React from "react";

const Input = React.forwardRef(
  ({ label, type = "text", error, ...rest }, ref) => (
    <div>
      <label className="mb-1 block text-sm text-gray-300">
        {label}
      </label>

      <input
        ref={ref}
        type={type}
        {...rest}
        className="w-full rounded-md bg-[#2C333F] px-3 py-2 outline-none"
      />

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error.message}
        </p>
      )}
    </div>
  )
);

export default Input;
