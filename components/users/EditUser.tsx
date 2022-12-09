import React, { useEffect, useMemo, useState } from "react";
import { BiRename } from "react-icons/bi";
import { MdTitle } from "react-icons/md";
import { toast } from "react-toastify";
import { AdminUser, IUser } from "../../services/users/user.interface";
import { apiClient } from "../../util/client";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Modal from "../Modal";

export enum UserEditMode {
  NONE,
  NAME,
  ADMIN,
  REMOVED,
}

export type EditUserProps = {
  editMode: UserEditMode;
  user?: AdminUser;
  onFinish: (user: AdminUser) => void;
};

const EditUser: React.FC<EditUserProps> = ({ editMode, user, onFinish }) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user]);

  const title = useMemo(() => {
    if (!user) return "";
    switch (editMode) {
      case UserEditMode.NAME:
        return `Edit ${user.name}'s Name`;
      case UserEditMode.ADMIN:
        if (user.admin) return `Demote ${user.name} to User`;
        return `Promote ${user.name} to Admin`;
      case UserEditMode.REMOVED:
        if (user.removed) return `Restore ${user.name}`;
        return `Remove ${user.name}`;
      default:
        return "";
    }
  }, [editMode, user]);

  if (!user || editMode === UserEditMode.NONE) return null;

  const onCancel = () => {
    onFinish(user);
  };

  const onConfirm = async () => {
    let newUser = user;
    switch (editMode) {
      case UserEditMode.NAME:
        if (!newName.trim()) {
          toast.error("Name cannot be empty");
          return;
        }
        newUser.name = newName;
        break;
      case UserEditMode.ADMIN:
        newUser.admin = !newUser.admin;
        break;
      case UserEditMode.REMOVED:
        newUser.removed = !newUser.removed;
        break;
    }
    const res = await apiClient.patch<{ user: AdminUser }>("/user/admin", {
      user: newUser,
    });
    if (res.success) {
      onFinish(res.data.user);
      toast.success(`Successfully updated ${newUser.name}`);
    } else {
      toast.error(res.error ?? "An unknown error occurred");
    }
  };

  return (
    <Modal title={title} onClose={() => onFinish(user)}>
      <div className="my-4">
        {editMode === UserEditMode.NAME ? (
          <Input
            icon={<BiRename size={18} />}
            value={newName}
            onChange={setNewName}
          />
        ) : (
          <p>{`Are you sure you want to ${title.toLowerCase()}?`}</p>
        )}
      </div>
      <div className="flex flex-row mt-2 justify-end items-center space-x-2">
        <Button type="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>OK</Button>
      </div>
    </Modal>
  );
};

export default EditUser;
