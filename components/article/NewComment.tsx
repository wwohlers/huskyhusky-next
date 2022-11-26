import React, { useMemo, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Label from "../atoms/Label";
import TextArea from "../atoms/TextArea";

type NewCommentProps = {
  onSubmit: (name: string, content: string) => void;
  onCancel: () => void;
};

enum InvalidReasons {
  SHORT_NAME = "Name must be at least 3 letters, excluding spaces",
  NO_CONTENT = "Please enter some content",
}

const NewComment: React.FC<NewCommentProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const invalidReasons = useMemo(() => {
    let result: InvalidReasons[] = [];
    if (name.trim().length < 3) {
      result.push(InvalidReasons.SHORT_NAME);
    }
    if (content.trim().length < 1) {
      result.push(InvalidReasons.NO_CONTENT);
    }
    return result;
  }, [name, content]);

  const isValid = useMemo(() => {
    return invalidReasons.length === 0;
  }, [invalidReasons]);

  return (
    <div className="my-6">
      <label className="block my-4">
        <Label>Name</Label>
        <Input value={name} onChange={setName} />
      </label>
      <label className="block my-4">
        <Label>Comment</Label>
        <TextArea value={content} onChange={setContent} />
      </label>
      <div className="flex flex-row justify-end space-x-4 items-center">
        <Button onClick={onCancel} type="secondary">
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={() => onSubmit(name, content)}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default NewComment;
