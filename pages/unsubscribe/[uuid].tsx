import { GetServerSideProps } from "next";
import Head from "next/head";
import { withDB } from "../../services/database";
import { unsubscribe } from "../../services/subs/server";
import { returnProps, returnNotFound } from "../../util/next";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const uuid = params?.uuid;
  if (uuid) {
    await withDB(async (conn) => {
      await unsubscribe(conn, uuid as string);
    });
    return returnProps({});
  }
  return returnNotFound();
};

const Unsubscribe: React.FC = () => {
  return (
    <>
      <Head>
        <title>Unsubscribe - The Husky Husky</title>
      </Head>
      <div className="w-full">
        <h1 className="text-3xl font-medium text-center mb-1">
          We&apos;re sorry to see you go
        </h1>
        <p className="text-center font-medium">
          You&apos;ve been successfully unsubscribed from the Husky Husky.
        </p>
      </div>
    </>
  );
};

export default Unsubscribe;
