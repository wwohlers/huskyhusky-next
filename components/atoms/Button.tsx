import React, { useMemo } from "react";

type ButtonProps = {
  type?: "primary" | "secondary";
};

const Button: React.FC<ButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  type = "primary",
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

  const disabledClasses = rest.disabled ? "opacity-50" : "hover:scale-105";

  return (
    <button
      className={
        "uppercase text-sm px-3 py-2 rounded-sm duration-150 focus:outline-none " +
        typeClasses +
        " " +
        disabledClasses
      }
      {...rest}
      type="button"
    />
  );
};

export default Button;
