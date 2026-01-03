import { type } from "os";
import React, { Children } from "react";

const iconButton = ({
  text,
  onClick,
  disabled,
  Children,
  outlinefalse,
  coustomeclasses,
  Type,
  svg,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      svg={svg}
      type={type}
      className={`${coustomeclasses}`}
      outlinefalse={outlinefalse}
      Type={Type}
    >
      {Children ? (
        <>
          <span>{text}</span>
          {Children}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default iconButton;
