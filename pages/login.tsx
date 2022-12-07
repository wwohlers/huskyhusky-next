import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Label from "../components/atoms/Label";
import { toast } from "react-toastify";
import { apiClient } from "../util/client";
import { useSWRConfig } from "swr";
import { validateEmail } from "../util/validate";

enum InvalidReasons {
  INVALID_EMAIL = "Please enter a valid email address",
  SHORT_PASSWORD = "Please enter your password",
}

const Login: React.FC = () => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const invalidReasons = useMemo(() => {
    let result: InvalidReasons[] = [];
    if (!validateEmail(email)) {
      result.push(InvalidReasons.INVALID_EMAIL);
    }
    if (password.length < 1) {
      result.push(InvalidReasons.SHORT_PASSWORD);
    }
    return result;
  }, [email, password]);

  const isValid = useMemo(() => {
    return invalidReasons.length === 0;
  }, [invalidReasons]);

  const onSubmit = async () => {
    if (!isValid) return;
    const result = await apiClient.post("/auth/signIn", {
      email,
      password,
    });
    if (result.success) {
      mutate("/auth");
      router.push("/");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <Head>
        <title>Log In - The Husky Husky</title>
      </Head>
      <div className="w-full flex flex-row justify-center items-center">
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <h1 className="text-2xl font-semibold text-center mb-4">Log In</h1>
          <form className="flex flex-col space-y-4">
            <label className="flex flex-col space-y-1">
              <Label>Email</Label>
              <Input
                className=""
                icon={<AiOutlineMail size={20} />}
                type="email"
                value={email}
                onChange={setEmail}
                name="email"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <Label>Password</Label>
              <Input
                className=""
                icon={<AiOutlineKey size={20} />}
                type="password"
                value={password}
                onChange={setPassword}
                name="password"
              />
            </label>
            <div className="flex flex-row justify-end items-center">
              <Button disabled={!isValid} submit onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
