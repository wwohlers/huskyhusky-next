import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import Button from "../components/atoms/Button";
import CreateUser from "../components/users/CreateUser";
import EditUserName from "../components/users/EditUserName";
import { useConfirmationModal } from "../hooks/useConfirmationModal";
import { withDB } from "../services/database";
import { getAdminUsers, userIsAdmin } from "../services/users/server";
import { AdminUser } from "../services/users/user.interface";
import { formatDateTime } from "../util/datetime";
import { getUserIdFromReq } from "../util/jwt";
import { returnProps, returnRedirect } from "../util/next";
import toastError from "../util/toastError";
import { makeEditUserRequest } from "./api/users";

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
  const confirm = useConfirmationModal();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editNameUser, setEditNameUser] = useState<AdminUser | undefined>();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  const editUser = async (userId: string, newValues: Partial<AdminUser>) => {
    try {
      const user = await makeEditUserRequest({
        admin: true,
        userUpdate: {
          _id: userId,
          ...newValues,
        },
      });
      setUsers((users) => {
        return users.map((u) => (u._id === user._id ? user : u));
      });
      toast.success(`Updated ${user.name}`);
    } catch (e) {
      toastError(e);
    }
  };

  const onToggleAdmin = async (user: AdminUser) => {
    const newValue = !user.admin;
    const prompt = `Are you sure you want to ${
      newValue ? "promote" : "demote"
    } ${user.name}?`;
    const response = await confirm(
      `${newValue ? "Promote" : "Demote"} ${user.name}?`,
      prompt
    );
    if (response === "cancel") return;
    await editUser(user._id, { admin: newValue });
  };

  const onToggleRemove = async (user: AdminUser) => {
    const newValue = !user.removed;
    const prompt = `Are you sure you want to ${
      newValue ? "remove" : "un-remove"
    } ${user.name}?`;
    const response = await confirm(
      `${newValue ? "Remove" : "Un-remove"} ${user.name}?`,
      prompt
    );
    if (response === "cancel") return;
    await editUser(user._id, { removed: newValue });
  };

  const onCreateUser = (user: AdminUser) => {
    setUsers((users) => [...users, user]);
    setShowCreateUser(false);
  };

  const onSubmitRename = (name: string) => {
    if (!editNameUser) return;
    editUser(editNameUser._id, { name });
    setEditNameUser(undefined);
  };

  return (
    <div className="w-full">
      <Head>
        <title>Manage Users - The Husky Husky</title>
      </Head>
      <EditUserName
        user={editNameUser}
        onSubmit={onSubmitRename}
        onCancel={() => setEditNameUser(undefined)}
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
          <tr className="text-sm uppercase text-secondary">
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
                onClick={() => setEditNameUser(user)}
                className="py-1 text-center cursor-pointer"
              >
                {user.name}
              </td>
              <td className="text-center">{user.email}</td>
              <td
                onClick={() => onToggleAdmin(user)}
                className="text-center cursor-pointer"
              >
                {user.admin ? "Y" : "N"}
              </td>
              <td
                onClick={() => onToggleRemove(user)}
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
