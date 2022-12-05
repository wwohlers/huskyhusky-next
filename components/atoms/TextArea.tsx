import React, { ChangeEvent } from "react";

type TextAreaProps = {
  value?: string;
  onChange?: (val: string) => void;
};

const TextArea: React.FC<
  TextAreaProps & Omit<React.HTMLProps<HTMLTextAreaElement>, "onChange">
> = ({ value, onChange, ...rest }) => {
  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(event.target.value);
  };
  return (
    <textarea
      className="p-2 w-full outline-none rounded-md bg-inherit border-[#EAEAEA] border focus:border-red-800 duration-150 text-sm font-medium"
      onChange={handleOnChange}
      value={value}
      {...rest}
    ></textarea>
  );
};

export default TextArea;
