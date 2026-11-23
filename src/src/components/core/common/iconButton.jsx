

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
