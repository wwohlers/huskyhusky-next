import React, { ChangeEvent, KeyboardEvent } from "react";

type InputProps = {
  value?: string;
  onChange?: (val: string) => void;
  icon?: React.ReactNode;
  className?: string;
  onEnter?: () => void;
};

const Input: React.FC<
  Omit<React.HTMLProps<HTMLInputElement>, "onChange"> & InputProps
> = ({ value, onChange, icon, className, onEnter, ...rest }) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onEnter) onEnter();
  };

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
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    </label>
  );
};

export default Input;
