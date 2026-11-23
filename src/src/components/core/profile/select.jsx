import React from "react";

const Select = React.forwardRef(
  ({ label, error, ...rest }, ref) => (
    <div>
      <label
        className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {label}
      </label>

      <select
        ref={ref}
        {...rest}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#e2e8f0",
          transition: "border-color 0.2s ease",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={e => {
          e.target.style.borderColor = "rgba(251,191,36,0.45)";
          e.target.style.background = "rgba(255,255,255,0.06)";
        }}
        onBlur={e => {
          e.target.style.borderColor = "rgba(255,255,255,0.08)";
          e.target.style.background = "rgba(255,255,255,0.04)";
        }}
      >
        <option value="Other">Other</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      {error && (
        <p className="mt-1 text-xs" style={{ color: "#f87171" }}>
          This field is required
        </p>
      )}
    </div>
  )
);

export default Select;
