import React, { ChangeEvent, KeyboardEvent } from "react";

export type TextInputProps = {
  value?: string;
  onChange?: (val: string) => void;
  icon?: React.ReactNode;
  className?: string;
  onEnter?: () => void;
};

const TextInput: React.FC<
  Omit<React.HTMLProps<HTMLInputElement>, "onChange"> & TextInputProps
> = ({ value, onChange, icon, className, onEnter, ...rest }) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onEnter) onEnter();
  };

  return (
    <div
      className={
        "flex flex-row justify-center items-stretch rounded-md overflow-hidden border border-[#EAEAEA] focus-within:border-red-800 duration-150 bg-white " +
        className
      }
    >
      <div className="px-2 bg-[#EAEAEA] flex flex-row justify-center items-center cursor-pointer">
        {icon}
      </div>
      <input
        className="p-1.5 px-2 flex-1 outline-none bg-transparent text-gray-800 font-medium placeholder-gray-400"
        type="text"
        value={value}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    </div>
  );
};

export default TextInput;
