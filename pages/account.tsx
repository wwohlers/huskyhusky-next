import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { AiOutlineMail, AiOutlineKey } from "react-icons/ai";
import { MdTitle } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Label from "../components/atoms/Label";
import TextArea from "../components/atoms/TextArea";
import Section from "../components/Section";
import { connectToDB } from "../services/database";
import { IUser } from "../services/users/user.interface";
import getUserIdFromReq from "../util/api/getUserIdFromReq";
import { apiClient } from "../util/client";
import stringifyIds from "../util/stringifyIds";
import {
  passwordRequirements,
  validateEmail,
  validatePassword,
} from "../util/validate";
import { EditUserResponse } from "./api/user/bio";

type AccountProps = {
  user: IUser;
};

export const getServerSideProps: GetServerSideProps<AccountProps> = async ({
  req,
}) => {
  const conn = await connectToDB();
  const userId = getUserIdFromReq(req);
  if (!userId) {
    conn.close();
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const user = await conn.models.User.findById<IUser>(userId).lean();
  conn.close();
  stringifyIds(user);
  if (!user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user,
    },
  };
};

enum EditMode {
  None,
  Name,
  Email,
  Password,
}

const Account: React.FC<AccountProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>(EditMode.None);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const submitName = async () => {
    setLoading(true);
    const res = await apiClient.patch<IUser>("/user/name", { name });
    setLoading(false);
    if (res.success) {
      console.log(res.data);
      setUser(res.data);
      setEditMode(EditMode.None);
      toast.success("Name updated");
    } else {
      toast.error(res.error);
    }
  };

  const submitBio = async () => {
    setLoading(true);
    const res = await apiClient.patch<IUser>("/user/bio", { bio });
    setLoading(false);
    if (res.success) {
      setUser(res.data);
      setEditMode(EditMode.None);
      toast.success("Bio updated");
    } else {
      toast.error(res.error);
    }
  };

  const submitEmail = async () => {
    setLoading(true);
    const res = await apiClient.patch<IUser>("/user/email", {
      email,
      password: oldPassword,
    });
    setLoading(false);
    if (res.success) {
      setUser(res.data);
      setEditMode(EditMode.None);
      toast.success("Email updated");
    } else {
      toast.error(res.error);
    }
  };

  const submitPassword = async () => {
    if (newPassword !== repeatPassword) {
      return toast.error("Passwords do not match");
    }
    if (!validatePassword(newPassword)) {
      return toast.error(passwordRequirements);
    }
    setLoading(true);
    const res = await apiClient.patch<IUser>("/user/password", {
      oldPassword,
      newPassword,
    });
    setLoading(false);
    if (res.success) {
      setUser(res.data);
      setEditMode(EditMode.None);
      toast.success("Password updated");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="w-full">
      <Head>
        <title>My Account - The Husky Husky</title>
      </Head>
      <h1 className="text-3xl mb-1 font-semibold">My Account</h1>
      {user.admin && <p className="text-sm text-gray-400 font-medium">Admin</p>}
      <Section title="Profile">
        <div className="my-4">
          <Label>Name</Label>
          {editMode !== EditMode.Name ? (
            <p
              className="cursor-pointer font-medium"
              onClick={() => setEditMode(EditMode.Name)}
            >
              {user.name}
            </p>
          ) : (
            <div className="flex flex-col space-y-2">
              <Input
                icon={<MdTitle size={18} />}
                className="w-min"
                value={name}
                onChange={setName}
              />
              <div className="flex flex-row space-x-2 items-center">
                <Button disabled={!name || loading} onClick={submitName}>
                  Save
                </Button>
                <Button
                  type="secondary"
                  onClick={() => setEditMode(EditMode.None)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <label className="my-4">
          <Label>Bio</Label>
          <TextArea value={bio} onChange={setBio} onBlur={submitBio} />
        </label>
      </Section>
      <Section title="Authentication">
        <div className="my-4">
          <Label>Email</Label>
          {editMode !== EditMode.Email ? (
            <p
              className="cursor-pointer font-medium"
              onClick={() => setEditMode(EditMode.Email)}
            >
              {user.email}
            </p>
          ) : (
            <div className="flex flex-col space-y-2">
              <label>
                <Input
                  value={email}
                  onChange={setEmail}
                  icon={<AiOutlineMail size={20} />}
                />
              </label>
              <label>
                <Label>Enter Your Password</Label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  icon={<AiOutlineKey size={20} />}
                />
              </label>
              <div className="flex flex-row items-center space-x-2">
                <Button
                  disabled={!validateEmail(email) || !oldPassword || loading}
                  onClick={submitEmail}
                >
                  Save
                </Button>
                <Button
                  type="secondary"
                  onClick={() => setEditMode(EditMode.None)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="my-4">
          <Label>Password</Label>
          {editMode !== EditMode.Password ? (
            <i
              className="cursor-pointer font-medium text-gray-400"
              onClick={() => setEditMode(EditMode.Password)}
            >
              Click here to change your password
            </i>
          ) : (
            <div className="flex flex-col space-y-2">
              <label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                />
              </label>
              <label>
                <Label>Repeat New Password</Label>
                <Input
                  type="password"
                  value={repeatPassword}
                  onChange={setRepeatPassword}
                />
              </label>
              <label>
                <Label>Old Password</Label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                />
              </label>
              <div className="flex flex-row items-center space-x-2">
                <Button
                  disabled={!newPassword || !oldPassword || loading}
                  onClick={submitPassword}
                >
                  Save
                </Button>
                <Button
                  type="secondary"
                  onClick={() => setEditMode(EditMode.None)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Account;
