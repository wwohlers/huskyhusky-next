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
      className="p-2 w-full outline-none bg-gray-200 rounded-sm border-gray-200 border focus:border-red-800 duration-150"
      onChange={handleOnChange}
      {...rest}
    >
      {value}
    </textarea>
  );
};

export default TextArea;
