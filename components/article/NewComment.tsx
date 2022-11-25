import React from "react";
import Input from "../atoms/Input";
import Label from "../atoms/Label";
import TextArea from "../atoms/TextArea";

type NewCommentProps = {
  onSubmit: (name: string, content: string) => void;
};

const NewComment: React.FC<NewCommentProps> = ({ onSubmit }) => {
  return (
    <div className="my-6">
      <label className="block my-4">
        <Label>Name</Label>
        <Input />
      </label>
      <label className="block my-4">
        <Label>Comment</Label>
        <TextArea />
      </label>
    </div>
  );
};

export default NewComment;
