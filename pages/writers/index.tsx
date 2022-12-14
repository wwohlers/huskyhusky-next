import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { getPublicUsers } from "../../services/users/server";
import { PublicUser } from "../../services/users/user.interface";
import { FaPaw } from "react-icons/fa";
import { withDB } from "../../services/database";
import { DEFAULT_REVALIDATE_PERIOD, returnProps } from "../../util/next";

type WriterProps = {
  writers: PublicUser[];
};

export const getStaticProps: GetStaticProps<WriterProps> = async () => {
  const writers = await withDB((conn) => {
    return getPublicUsers(conn);
  });
  return returnProps({ writers }, DEFAULT_REVALIDATE_PERIOD);
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
            className="flex flex-row items-center space-x-4 hover:translate-x-[1px] hover:translate-y-[-1px] duration-150"
            href={"/writers/" + writer.name}
            key={writer._id}
          >
            <FaPaw size={20} />
            <div>
              <p className="text-lg font-semibold">{writer.name}</p>
              <p className="text-sm text-secondary line-clamp-3">
                {writer.bio}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Writers;
