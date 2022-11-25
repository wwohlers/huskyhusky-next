import React from "react";

type TextAreaProps = {
  value?: string;
  onChange?: (val: string) => void;
};

const TextArea: React.FC<
  TextAreaProps & React.HTMLProps<HTMLTextAreaElement>
> = ({ value, onChange, ...rest }) => {
  return (
    <textarea
      className="p-2 w-full outline-none bg-gray-200 rounded-sm border-gray-200 border focus:border-red-800 duration-150"
      onChange={onChange}
      {...rest}
    >
      {value}
    </textarea>
  );
};

export default TextArea;
