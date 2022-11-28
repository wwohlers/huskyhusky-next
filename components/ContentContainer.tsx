import React from "react";

type ContentContainerProps = {
  className?: string;
  children: React.ReactNode;
};

const ContentContainer: React.FC<ContentContainerProps> = ({
  className = "",
  children,
}) => {
  return (
    <div
      className={
        "flex flex-col w-11/12 sm:[36rem] md:w-[42rem] lg:w-[60rem] xl:w-[72rem] " +
        className
      }
    >
      {children}
    </div>
  );
};

export default ContentContainer;
