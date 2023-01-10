import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import { toast } from "react-toastify";
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import Form from "../../components/forms/Form";
import { useForm } from "@bswohlers/lightform";
import { verifyJWT } from "../../util/jwt";
import { returnNotFound, returnProps } from "../../util/next";
import toastError from "../../util/toastError";
import { newPasswordValidator } from "../../util/validation";
import { makeResetPasswordRequest } from "../api/users/resetPassword";

type ResetPasswordProps =
  | {
      expired: true;
    }
  | {
      expired: false;
      token: string;
      email: string;
    };

export const getServerSideProps: GetServerSideProps<
  ResetPasswordProps
> = async ({ params }) => {
  const token = params?.token;
  if (!token || typeof token !== "string") {
    return returnNotFound();
  }
  try {
    const { email } = verifyJWT(token);
    if (!email || typeof email !== "string") {
      throw new Error("Invalid token");
    }
    return returnProps({
      expired: false,
      token,
      email,
    });
  } catch (e) {
    return returnProps({
      expired: true,
    });
  }
};

type PasswordResetForm = {
  password: string;
  repeatPassword: string;
};

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { values, errors, hasErrors, onFieldChange } =
    useForm<PasswordResetForm>(
      {
        password: "",
        repeatPassword: "",
      },
      {
        password: newPasswordValidator.assert,
      }
    );

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await makeResetPasswordRequest({
        token: props.expired ? "" : props.token,
        password: values.password,
      });
      toast.success("Password reset successfully");
      router.push("/login");
    } catch (e) {
      toastError(e);
    }
    setIsLoading(false);
  };

  const repeatPasswordError = useMemo(() => {
    return values.password !== values.repeatPassword
      ? "Passwords do not match"
      : "";
  }, [values]);

  return (
    <>
      <Head>
        <title>Reset Password - The Husky Husky</title>
      </Head>
      <div className="w-full flex flex-row justify-center items-center">
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <h1 className="text-2xl font-semibold text-center mb-4">
            {props.expired ? "Link Expired" : "Reset Password"}
          </h1>
          {props.expired ? (
            <p>
              The link you used has expired. Please{" "}
              <Link href="/forgot-password" className="underline">
                request another link
              </Link>
              .
            </p>
          ) : (
            <Form>
              <Form.Item title="Email">
                <TextInput
                  name="email"
                  disabled
                  type="text"
                  icon={<AiOutlineMail size={18} />}
                  value={props.expired ? "" : props.email}
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
              <Form.Item title="Repeat Password" error={repeatPasswordError}>
                <TextInput
                  name="password"
                  type="password"
                  icon={<AiOutlineKey size={18} />}
                  onChange={onFieldChange("repeatPassword")}
                />
              </Form.Item>
              <Form.Buttons>
                <Button
                  type="primary"
                  onClick={onSubmit}
                  disabled={hasErrors || !!repeatPasswordError || isLoading}
                >
                  Submit
                </Button>
              </Form.Buttons>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
