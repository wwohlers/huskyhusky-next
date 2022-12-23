import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import { MdTitle } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../components/atoms/Button";
import TextInput from "../components/atoms/TextInput";
import Label from "../components/atoms/Label";
import TextArea from "../components/atoms/TextArea";
import Section from "../components/Section";
import { withDB } from "../services/database";
import { IUser } from "../services/users/user.interface";
import { getUserIdFromReq } from "../util/jwt";
import { returnNotFound, returnProps, returnRedirect } from "../util/next";
import toastError from "../util/toastError";
import { editUser } from "./api/users";

type AccountProps = {
  user: IUser;
};

export const getServerSideProps: GetServerSideProps<AccountProps> = async ({
  req,
}) => {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return returnRedirect("/login");
  }
  const user = await withDB((conn) => {
    return conn.models.User.findById(userId).lean();
  });
  if (!user) {
    return returnNotFound();
  } else {
    return returnProps({ user });
  }
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

  const submitChanges = async (user: Partial<IUser>) => {
    setLoading(true);
    try {
      await editUser({
        admin: false,
        oldPassword,
        userUpdate: user,
      });
      toast.success("Changes saved");
    } catch (e) {
      toastError(e);
    } finally {
      setLoading(false);
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
              <TextInput
                icon={<MdTitle size={18} />}
                className="w-min"
                value={name}
                onChange={setName}
              />
              <div className="flex flex-row space-x-2 items-center">
                <Button
                  disabled={!name || loading}
                  onClick={() => submitChanges({ name })}
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
        <label className="my-4">
          <Label>Bio</Label>
          <TextArea
            value={bio}
            onChange={setBio}
            onBlur={() => submitChanges({ bio })}
          />
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
                <TextInput
                  value={email}
                  onChange={setEmail}
                  icon={<AiOutlineMail size={20} />}
                />
              </label>
              <label>
                <Label>Enter Your Password</Label>
                <TextInput
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  icon={<AiOutlineKey size={20} />}
                />
              </label>
              <div className="flex flex-row items-center space-x-2">
                <Button
                  disabled={!oldPassword || loading}
                  onClick={() => submitChanges({ email })}
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
                <TextInput
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                />
              </label>
              <label>
                <Label>Repeat New Password</Label>
                <TextInput
                  type="password"
                  value={repeatPassword}
                  onChange={setRepeatPassword}
                />
              </label>
              <label>
                <Label>Old Password</Label>
                <TextInput
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                />
              </label>
              <div className="flex flex-row items-center space-x-2">
                <Button
                  disabled={!newPassword || !oldPassword || loading}
                  onClick={() => submitChanges({ password: newPassword })}
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
