import React, { useState } from "react";
import { AiOutlineKey, AiOutlineMail } from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { toast } from "react-toastify";
import { AdminUser, IUser } from "../../services/users/user.interface";
import { apiClient } from "../../util/client";
import { passwordRequirements, validatePassword } from "../../util/validate";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Label from "../atoms/Label";
import Modal from "../Modal";

type CreateUserProps = {
  active: boolean;
  onCancel: () => void;
  onFinish: (user: AdminUser) => void;
};

const CreateUser: React.FC<CreateUserProps> = ({
  active,
  onCancel,
  onFinish,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onSubmit = async () => {
    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      return;
    } else if (!validatePassword(password)) {
      toast.error(passwordRequirements);
      return;
    } else if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    const user: Pick<IUser, "name" | "email" | "password"> = {
      name,
      email,
      password,
    };
    const res = await apiClient.post<AdminUser>("/auth/createUser", user);
    if (res.success) {
      toast.success("User created");
      onFinish(res.data);
    } else {
      toast.error(res.error);
    }
  };

  if (!active) return null;
  return (
    <Modal title="Create a User" onClose={onCancel}>
      <label className="block my-4">
        <Label>Name</Label>
        <Input icon={<BiRename size={18} />} value={name} onChange={setName} />
      </label>
      <label className="block my-4">
        <Label>Email</Label>
        <Input
          icon={<AiOutlineMail size={18} />}
          type="email"
          value={email}
          onChange={setEmail}
        />
      </label>
      <label className="block my-4">
        <Label>Temporary Password</Label>
        <Input
          icon={<AiOutlineKey size={18} />}
          type="password"
          value={password}
          onChange={setPassword}
        />
      </label>
      <label className="block my-4">
        <Label>Repeat Temporary Password</Label>
        <Input
          icon={<AiOutlineKey size={18} />}
          type="password"
          value={repeatPassword}
          onChange={setRepeatPassword}
        />
      </label>
      <div className="my-2 flex flex-row justify-end items-center space-x-2">
        <Button type="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </Modal>
  );
};

export default CreateUser;
