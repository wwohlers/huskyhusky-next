import React from "react";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={"my-8 " + className}>
      <p className="text-lg font-semibold border-b border-gray-200">{title}</p>
      {children}
    </div>
  );
};

export default Section;
