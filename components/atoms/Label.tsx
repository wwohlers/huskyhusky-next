import React from "react";

type LabelProps = {
  children: React.ReactNode;
};

const Label: React.FC<LabelProps> = ({ children }) => {
  return <p className="text-sm uppercase text-red-800 font-bold">{children}</p>;
};

export default Label;
