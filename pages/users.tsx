import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Button from "../components/atoms/Button";
import CreateUser from "../components/users/CreateUser";
import EditUser, {
  EditUserProps,
  UserEditMode,
} from "../components/users/EditUser";
import { withDB } from "../services/database";
import { getAdminUsers, userIsAdmin } from "../services/users/server";
import { AdminUser } from "../services/users/user.interface";
import { formatDateTime } from "../util/datetime";
import { getUserIdFromReq } from "../util/jwt";
import { returnProps, returnRedirect } from "../util/next";

type UsersProps = {
  users: AdminUser[];
};

export const getServerSideProps: GetServerSideProps<UsersProps> = async ({
  req,
}) => {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return returnRedirect("/login");
  }
  const res = await withDB(async (conn) => {
    const isAdmin = await userIsAdmin(conn, userId);
    if (!isAdmin) {
      return returnRedirect("/login");
    }
    const users = await getAdminUsers(conn);
    return returnProps({ users });
  });
  return res;
};

const Users: React.FC<UsersProps> = ({ users: initialUsers }) => {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [editUserState, setEditUserState] = useState<
    Pick<EditUserProps, "editMode" | "user">
  >({
    editMode: UserEditMode.NONE,
  });

  const onFinish = (user: AdminUser) => {
    setEditUserState({
      editMode: UserEditMode.NONE,
    });
    setUsers((users) => {
      const index = users.findIndex((u) => u._id === user._id);
      if (index === -1) return users;
      const newUsers = [...users];
      newUsers[index] = user;
      return newUsers;
    });
  };

  const onCreateUser = (user: AdminUser) => {
    setUsers((users) => [...users, user]);
    setShowCreateUser(false);
  };

  return (
    <div className="w-full">
      <Head>
        <title>Manage Users - The Husky Husky</title>
      </Head>
      <EditUser
        editMode={editUserState.editMode}
        user={editUserState.user}
        onFinish={onFinish}
      />
      <CreateUser
        active={showCreateUser}
        onCancel={() => setShowCreateUser(false)}
        onFinish={onCreateUser}
      />
      <h1 className="text-3xl font-semibold">Manage Users</h1>
      <div className="my-4">
        <Button
          className="flex flex-row items-center space-x-2"
          onClick={() => setShowCreateUser(true)}
        >
          <FiPlus size={18} />
          <span>New User</span>
        </Button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-sm uppercase text-gray-500">
            <th className="py-2 font-medium">Name</th>
            <th className="font-medium">Email</th>
            <th className="font-medium">Admin</th>
            <th className="font-medium">Removed</th>
            <th className="font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className={
                (user.removed ? "opacity-30" : "") +
                " " +
                (user.admin ? "font-bold" : "font-medium")
              }
            >
              <td
                onClick={() =>
                  setEditUserState({
                    editMode: UserEditMode.NAME,
                    user,
                  })
                }
                className="py-1 text-center cursor-pointer"
              >
                {user.name}
              </td>
              <td className="text-center">{user.email}</td>
              <td
                onClick={() =>
                  setEditUserState({
                    editMode: UserEditMode.ADMIN,
                    user,
                  })
                }
                className="text-center cursor-pointer"
              >
                {user.admin ? "Y" : "N"}
              </td>
              <td
                onClick={() =>
                  setEditUserState({
                    editMode: UserEditMode.REMOVED,
                    user,
                  })
                }
                className="text-center cursor-pointer"
              >
                {user.removed ? "Y" : "N"}
              </td>
              <td className="text-center">{formatDateTime(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
