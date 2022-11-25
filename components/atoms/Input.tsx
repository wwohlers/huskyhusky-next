import React from "react";

type InputProps = {
  value?: string;
  onChange?: (val: string) => void;
  icon?: React.ReactNode;
  className?: string;
};

const Input: React.FC<InputProps & React.HTMLProps<HTMLInputElement>> = ({
  value,
  onChange,
  icon,
  className,
  ...rest
}) => {
  return (
    <label
      className={
        "flex flex-row justify-center items-center bg-gray-200 p-2 rounded-sm border border-gray-200 focus-within:border-red-800 duration-150 " +
        className
      }
    >
      {icon}
      {!!icon && <div style={{ width: "4px" }} />}
      <input
        className="flex-1 outline-none bg-transparent text-gray-800"
        type="text"
        value={value}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
};

export default Input;
