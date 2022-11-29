import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { connectToDB } from "../../services/database";
import { getPublicUsers } from "../../services/users";
import { PublicUser } from "../../services/users/user.interface";
import stringifyIds from "../../util/stringifyIds";

type WriterProps = {
  writers: PublicUser[];
};

export const getStaticProps: GetStaticProps<WriterProps> = async () => {
  const conn = await connectToDB();
  const writers = await getPublicUsers(conn);
  conn.close();
  stringifyIds(writers);
  return {
    props: {
      writers,
    },
  };
};

const Writers: React.FC<WriterProps> = ({ writers }) => {
  return (
    <div className="w-full">
      <Head>
        <title>Writers - The Husky Husky</title>
        <meta
          name="description"
          content="View all writers on The Husky Husky."
        />
      </Head>
      <div className="flex flex-col space-y-8">
        {writers.map((writer) => (
          <Link
            className="block"
            href={"/writers/" + writer.name}
            key={writer._id}
          >
            <p className="text-lg font-semibold">{writer.name}</p>
            <p className="text-sm text-gray-400 line-clamp-3">{writer.bio}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Writers;
