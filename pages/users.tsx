import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { connectToDB } from "../services/database";
import { getAdminUsers } from "../services/users";
import { AdminUser, IUser } from "../services/users/user.interface";
import getUserIdFromReq from "../util/api/getUserIdFromReq";
import stringifyIds from "../util/stringifyIds";

type UsersProps = {
  users: AdminUser[];
};

export const getServerSideProps: GetServerSideProps<UsersProps> = async ({
  req,
}) => {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const conn = await connectToDB();
  const users = await getAdminUsers(conn);
  conn.close();
  stringifyIds(users);
  return {
    props: {
      users,
    },
  };
};

const Users: React.FC<UsersProps> = ({ users }) => {
  return (
    <div className="w-full">
      <Head>
        <title>Manage Users - The Husky Husky</title>
      </Head>
      <h1 className="text-3xl font-semibold">Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Removed</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.admin}</td>
              <td>{user.removed}</td>
              <td>{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
