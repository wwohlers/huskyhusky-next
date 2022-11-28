import React from "react";

type LabelProps = {
  className?: string;
  children: React.ReactNode;
};

const Label: React.FC<LabelProps> = ({ className = "", children }) => {
  return (
    <p className={"text-sm uppercase text-red-800 font-bold " + className}>
      {children}
    </p>
  );
};

export default Label;
