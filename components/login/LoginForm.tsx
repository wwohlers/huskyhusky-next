import { useState } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import { useForm } from "../../hooks/useForm";
import { useRefreshUser } from "../../hooks/useUser";
import { makeSignInRequest } from "../../pages/api/users/signIn";
import { IUser } from "../../services/users/user.interface";
import {
  createEmailValidator,
  createEnteredPasswordValidator,
} from "../../util/validation";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";
import Form from "../forms/Form";

type LoginFormProps = {
  onSuccess: (user: IUser) => void;
  onError: (error: Error) => void;
};

type LoginForm = {
  email: string;
  password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const refreshUser = useRefreshUser();
  const { values, errors, hasErrors, onFieldChange } = useForm<LoginForm>(
    {
      email: "",
      password: "",
    },
    {
      email: createEmailValidator(),
      password: createEnteredPasswordValidator(),
    }
  );

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      console.log(1);
      const user = await makeSignInRequest({
        email: values.email,
        password: values.password,
      });
      console.log(3);
      refreshUser();
      onSuccess(user);
    } catch (e) {
      if (e instanceof Error) {
        onError(e);
      }
    }
    setIsLoading(false);
  };

  return (
    <Form>
      <Form.Item title="Email" error={errors.email}>
        <TextInput
          name="email"
          type="text"
          icon={<AiOutlineMail size={18} />}
          onChange={onFieldChange("email")}
        />
      </Form.Item>
      <Form.Item title="Password" error={errors.password}>
        <TextInput
          name="password"
          type="password"
          icon={<AiOutlineKey size={18} />}
          onChange={onFieldChange("password")}
        />
      </Form.Item>
      <Form.Buttons>
        <Button submit onClick={onSubmit} disabled={hasErrors || isLoading}>
          Submit
        </Button>
      </Form.Buttons>
    </Form>
  );
};

export default LoginForm;
