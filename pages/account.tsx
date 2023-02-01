import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import { MdTitle } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../components/atoms/Button";
import Label from "../components/atoms/Label";
import TextArea from "../components/atoms/TextArea";
import TextInput from "../components/atoms/TextInput";
import Form from "../components/forms/Form";
import Section from "../components/Section";
import { useValidatedState } from "../hooks/useValidatedState";
import { withDB } from "../services/database";
import { IUser, userNameValidator } from "../services/users/user.interface";
import { getUserIdFromReq } from "../util/jwt";
import { returnNotFound, returnProps, returnRedirect } from "../util/next";
import toastError from "../util/toastError";
import {
  emailValidator,
  enteredPasswordValidator,
  newPasswordValidator,
} from "../util/validation";
import { makeEditUserRequest } from "./api/users";

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
  const user = await withDB(async (conn) => {
    return await conn.models.User.findById(userId).lean();
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
  const [name, setName, nameError] = useValidatedState(
    user.name,
    userNameValidator.assert
  );
  const [bio, setBio, bioError] = useValidatedState(
    user.bio,
    userNameValidator.assert
  );
  const [email, setEmail, emailError] = useValidatedState(
    user.email,
    emailValidator.assert
  );
  const [newPassword, setNewPassword, newPasswordError] = useValidatedState(
    "",
    newPasswordValidator.assert
  );
  const [repeatPassword, setRepeatPassword] = useState("");
  const [oldPassword, setOldPassword, oldPasswordError] = useValidatedState(
    "",
    enteredPasswordValidator.assert
  );

  const submitChanges = async (user: Partial<IUser>) => {
    setLoading(true);
    try {
      const result = await makeEditUserRequest({
        admin: false,
        oldPassword: oldPassword !== "" ? oldPassword : undefined,
        userUpdate: user,
      });
      setUser(result);
      setEditMode(EditMode.None);
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
      {user.admin && (
        <p className="text-sm text-secondary font-medium">Admin</p>
      )}
      <Section title="Profile">
        <div className="my-4">
          <Form.Item
            title="Name"
            error={editMode === EditMode.Name ? nameError : ""}
          >
            {editMode !== EditMode.Name ? (
              <p
                className="cursor-pointer font-medium"
                onClick={() => setEditMode(EditMode.Name)}
              >
                {user.name}
              </p>
            ) : (
              <TextInput
                icon={<MdTitle size={18} />}
                disabled={loading}
                className="w-64"
                value={name}
                onChange={setName}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !nameError) {
                    submitChanges({ name });
                  }
                }}
                onBlur={() => setEditMode(EditMode.None)}
              />
            )}
          </Form.Item>
        </div>
        <Form.Item title="Bio" error={bioError}>
          <TextArea
            value={bio}
            onChange={setBio}
            onBlur={() => !bioError && submitChanges({ bio })}
          />
        </Form.Item>
      </Section>
      <Section title="Authentication">
        <div className="my-4 w-64">
          <Label>Email</Label>
          {editMode !== EditMode.Email ? (
            <p
              className="cursor-pointer font-medium"
              onClick={() => setEditMode(EditMode.Email)}
            >
              {user.email}
            </p>
          ) : (
            <Form className="w-64">
              <Form.Item title="" error={emailError}>
                <TextInput
                  value={email}
                  onChange={setEmail}
                  icon={<AiOutlineMail size={20} />}
                />
              </Form.Item>
              <Form.Item title="Enter Your Password" error={oldPasswordError}>
                <TextInput
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  icon={<AiOutlineKey size={20} />}
                />
              </Form.Item>
              <Form.Buttons>
                <Button
                  type="secondary"
                  onClick={() => setEditMode(EditMode.None)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!!emailError || !!oldPasswordError || loading}
                  onClick={() => submitChanges({ email })}
                >
                  Save
                </Button>
              </Form.Buttons>
            </Form>
          )}
        </div>
        <div className="my-4">
          <Label>Password</Label>
          {editMode !== EditMode.Password ? (
            <div
              className="cursor-pointer text-sm italic font-medium text-secondary"
              onClick={() => setEditMode(EditMode.Password)}
            >
              Click here to change your password
            </div>
          ) : (
            <Form className="w-64">
              <Form.Item title="" error={newPasswordError}>
                <TextInput
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  icon={<AiOutlineKey size={20} />}
                />
              </Form.Item>
              <Form.Item
                title="Repeat New Password"
                error={
                  repeatPassword !== newPassword ? "Passwords must match" : ""
                }
              >
                <TextInput
                  type="password"
                  value={repeatPassword}
                  onChange={setRepeatPassword}
                  icon={<AiOutlineKey size={20} />}
                />
              </Form.Item>
              <Form.Item title="Old Password" error={oldPasswordError}>
                <TextInput
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  icon={<AiOutlineKey size={20} />}
                />
              </Form.Item>
              <Form.Buttons>
                <Button
                  type="secondary"
                  onClick={() => setEditMode(EditMode.None)}
                >
                  Cancel
                </Button>
                <Button
                  submit
                  disabled={!newPassword || !oldPassword || loading}
                  onClick={() => submitChanges({ password: newPassword })}
                >
                  Save
                </Button>
              </Form.Buttons>
            </Form>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Account;
