import React, { useMemo } from "react";

type ButtonProps = {
  submit?: boolean;
  type?: "primary" | "secondary";
  onClick: () => void;
};

const Button: React.FC<ButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  type = "primary",
  submit = false,
  onClick,
  ...rest
}) => {
  const typeClasses = useMemo(() => {
    if (type === "primary") {
      return "bg-red-900 text-white font-bold";
    } else if (type === "secondary") {
      return "font-medium bg-gray-200";
    }
    return "";
  }, [type]);

  const disabledClasses = rest.disabled ? "opacity-50" : "hover:scale-[1.03]";

  const _onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button
      className={
        "uppercase text-sm px-3 py-2 rounded-sm duration-150 focus:outline-none " +
        typeClasses +
        " " +
        disabledClasses
      }
      {...rest}
      onClick={_onClick}
      type={submit ? "submit" : "button"}
    />
  );
};

export default Button;
