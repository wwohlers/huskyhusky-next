import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import LoginForm from "../components/login/LoginForm";
import { withDB } from "../services/database";
import { IUser } from "../services/users/user.interface";
import { getUserIdFromReq } from "../util/jwt";
import { returnProps, returnRedirect } from "../util/next";
import toastError from "../util/toastError";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const userId = getUserIdFromReq(req);
  if (userId) {
    const user = await withDB((conn) => {
      return conn.models.User.findById(userId).select("name").lean();
    });
    if (user) {
      return returnRedirect("/writers/" + user.name);
    }
  }
  return returnProps({});
};

const Login: React.FC = () => {
  const router = useRouter();

  const onSuccess = (user: IUser) => {
    router.push("/writers/" + user.name);
  };

  const onError = (error: Error) => {
    toastError(error);
  };

  return (
    <>
      <Head>
        <title>Log In - The Husky Husky</title>
      </Head>
      <div className="w-full flex flex-row justify-center items-center">
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <h1 className="text-2xl font-semibold text-center mb-4">Log In</h1>
          <LoginForm onSuccess={onSuccess} onError={onError} />
        </div>
      </div>
    </>
  );
};

export default Login;
