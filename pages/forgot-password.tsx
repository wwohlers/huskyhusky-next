import Head from "next/head";
import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { toast } from "react-toastify";
import Button from "../components/atoms/Button";
import TextInput from "../components/atoms/TextInput";
import Form from "../components/forms/Form";
import { useForm } from "../hooks/useForm";
import toastError from "../util/toastError";
import { emailValidator } from "../util/validation";
import { makeForgotPasswordRequest } from "./api/users/resetPassword";

type ForgotPasswordForm = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, hasErrors, onFieldChange } =
    useForm<ForgotPasswordForm>(
      {
        email: "",
      },
      {
        email: emailValidator.assert,
      }
    );

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await makeForgotPasswordRequest({ email: values.email });
      toast.success("Email sent");
    } catch (e) {
      toastError(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Forgot Password - The Husky Husky</title>
      </Head>
      <div className="w-full flex flex-row justify-center items-center">
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Forgot Password
          </h1>
          <p className="text-center text-sm mb-2">
            We&apos;ll email you a link to reset your password.
          </p>
          <Form>
            <Form.Item title="Email" error={errors.email}>
              <TextInput
                name="email"
                type="text"
                icon={<AiOutlineMail size={18} />}
                onChange={onFieldChange("email")}
              />
            </Form.Item>
            <Form.Buttons>
              <Button
                submit
                disabled={hasErrors || isLoading}
                onClick={onSubmit}
              >
                Next
              </Button>
            </Form.Buttons>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
