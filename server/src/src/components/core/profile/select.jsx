import React from "react";

const Select = React.forwardRef(
  ({ label, error, ...rest }, ref) => (
    <div>
      <label className="mb-1 block text-sm text-gray-300">
        {label}
      </label>

      <select
        ref={ref}
        {...rest}
        className="w-full rounded-md bg-[#2C333F] px-3 py-2"
      >
        <option value="Other">Other</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-400">
          This field is required
        </p>
      )}
    </div>
  )
);

export default Select;
