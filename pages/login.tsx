import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Label from "../components/atoms/Label";
import { toast } from "react-toastify";
import { apiClient } from "../util/client";
import { useSWRConfig } from "swr";

const Login: React.FC = () => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = async () => {
    const result = await apiClient.post("/auth/signIn", {
      email,
      password,
    });
    if (result.success) {
      mutate("/auth");
      router.push("/");
    } else {
      toast(result.error);
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
              />
            </label>
            <div className="flex flex-row justify-end items-center">
              <Button submit onClick={onSubmit}>
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
