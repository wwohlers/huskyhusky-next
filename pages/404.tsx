import Head from "next/head";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <>
      <Head>
        <title>Not Found - The Husky Husky</title>
      </Head>
      <div className="max-w-lg">
        <h1 className="text-4xl font-semibold text-center">
          That&apos;s a 404.
        </h1>
        <p className="my-2 text-center">
          Or maybe we deleted this page just so you wouldn&apos;t see it.
        </p>
      </div>
    </>
  );
};

export default NotFound;
