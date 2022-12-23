import React, { useEffect, useMemo, useState } from "react";
import { BiRename } from "react-icons/bi";
import { toast } from "react-toastify";
import { editUser } from "../../pages/api/users";
import {
  AdminUser,
  createUserNameValidator,
} from "../../services/users/user.interface";
import toastError from "../../util/toastError";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";
import Form from "../forms/Form";
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user]);

  const handleNameChange = (value: string) => {
    try {
      createUserNameValidator()(value);
      setError("");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
    setNewName(value);
  };

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
    setIsLoading(true);
    try {
      const data = await editUser({
        admin: true,
        userUpdate: newUser,
      });
      onFinish(data);
    } catch (e) {
      toastError(e);
    }
    setIsLoading(false);
  };

  return (
    <Modal title={title} onClose={() => onFinish(user)}>
      <Form>
        <Form.Item title="" error={error}>
          {editMode === UserEditMode.NAME ? (
            <TextInput
              icon={<BiRename size={18} />}
              value={newName}
              onChange={handleNameChange}
            />
          ) : (
            <p>{`Are you sure you want to ${title.toLowerCase()}?`}</p>
          )}
        </Form.Item>
        <Form.Buttons>
          <Button type="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button submit onClick={onConfirm} disabled={!!error || isLoading}>
            OK
          </Button>
        </Form.Buttons>
      </Form>
    </Modal>
  );
};

export default EditUser;
