import React, { useState } from "react";
import { BiRename } from "react-icons/bi";
import { useForm } from "../../hooks/useForm";
import {
  commentContentValidator,
  commentNameValidator,
} from "../../services/articles/comment.interface";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";
import TextInput from "../atoms/TextInput";
import Form from "../forms/Form";

type NewCommentProps = {
  onSubmit: (name: string, content: string) => Promise<void>;
  onCancel: () => void;
};

type NewCommentForm = {
  name: string;
  content: string;
};

const NewComment: React.FC<NewCommentProps> = ({ onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, onFieldChange, hasErrors } = useForm<NewCommentForm>(
    {
      name: "",
      content: "",
    },
    {
      name: commentNameValidator.assert,
      content: commentContentValidator.assert,
    }
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(values.name, values.content);
    setIsLoading(false);
  };

  return (
    <Form>
      <Form.Item title="Name" error={errors.name}>
        <TextInput
          name="name"
          icon={<BiRename size={18} />}
          type="text"
          onChange={onFieldChange("name")}
        />
      </Form.Item>
      <Form.Item title="Comment" error={errors.content}>
        <TextArea name="content" onChange={onFieldChange("content")} />
      </Form.Item>
      <Form.Buttons>
        <Button onClick={onCancel} type="secondary">
          Cancel
        </Button>
        <Button disabled={hasErrors || isLoading} onClick={handleSubmit}>
          Submit
        </Button>
      </Form.Buttons>
    </Form>
  );
};

export default NewComment;
