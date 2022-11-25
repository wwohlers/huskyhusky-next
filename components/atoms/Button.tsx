import React from "react";

const Button: React.FC<React.HTMLProps<HTMLButtonElement>> = ({ ...rest }) => {
  return <button {...rest} />;
};

export default Button;
