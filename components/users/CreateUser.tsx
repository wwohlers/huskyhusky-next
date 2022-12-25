import React, { useEffect, useState } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { toast } from "react-toastify";
import { makeCreateUserRequest } from "../../pages/api/users/createUser";
import {
  AdminUser,
  createUserNameValidator,
  IUser,
} from "../../services/users/user.interface";
import toastError from "../../util/toastError";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";
import Label from "../atoms/Label";
import Modal from "../Modal";
import { useForm } from "../../hooks/useForm";
import {
  createEmailValidator,
  createNewPasswordValidator,
} from "../../util/validation";
import Form from "../forms/Form";

type CreateUserProps = {
  active: boolean;
  onCancel: () => void;
  onFinish: (user: AdminUser) => void;
};

type CreateUserForm = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const CreateUser: React.FC<CreateUserProps> = ({
  active,
  onCancel,
  onFinish,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { values, errors, hasErrors, onFieldChange } = useForm<CreateUserForm>(
    {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    {
      name: createUserNameValidator(),
      email: createEmailValidator(),
      password: createNewPasswordValidator(),
    }
  );

  useEffect(() => {
    setPasswordsMatch(values.password === values.repeatPassword);
  }, [values]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const data = await makeCreateUserRequest({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("User created");
      onFinish(data);
    } catch (e) {
      toastError(e);
    }
    setIsLoading(false);
  };

  if (!active) return null;
  return (
    <Modal title="Create a User" onClose={onCancel}>
      <Form>
        <Form.Item title="Name" error={errors.name}>
          <TextInput
            icon={<BiRename size={18} />}
            onChange={onFieldChange("name")}
          />
        </Form.Item>
        <Form.Item title="Email" error={errors.email}>
          <TextInput
            icon={<AiOutlineMail size={18} />}
            type="email"
            onChange={onFieldChange("email")}
          />
        </Form.Item>
        <Form.Item title="Temporary Password" error={errors.password}>
          <TextInput
            icon={<AiOutlineKey size={18} />}
            type="password"
            onChange={onFieldChange("password")}
          />
        </Form.Item>
        <Form.Item
          title="Repeat Temporary Password"
          error={!passwordsMatch ? "Passwords do not match" : ""}
        >
          <TextInput
            icon={<AiOutlineKey size={18} />}
            type="password"
            onChange={onFieldChange("repeatPassword")}
          />
        </Form.Item>
        <Form.Buttons>
          <Button type="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            submit
            disabled={hasErrors || !passwordsMatch || isLoading}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Form.Buttons>
      </Form>
    </Modal>
  );
};

export default CreateUser;
