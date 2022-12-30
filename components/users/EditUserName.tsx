import React, { useEffect } from "react";
import { BiRename } from "react-icons/bi";
import { useValidatedState } from "../../hooks/useValidatedState";
import { AdminUser, isUserName } from "../../services/users/user.interface";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";
import Form from "../forms/Form";
import Modal from "../modals/Modal";

export type EditUserProps = {
  user?: AdminUser;
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

const EditUserName: React.FC<EditUserProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const [newName, setNewName, newNameError] = useValidatedState("", isUserName);

  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user, setNewName]);

  if (!user) return null;

  return (
    <Modal title={`Rename ${user.name}`} onClose={onCancel}>
      <Form>
        <Form.Item title="" error={newNameError}>
          <TextInput
            icon={<BiRename size={18} />}
            value={newName}
            onChange={setNewName}
          />
        </Form.Item>
        <Form.Buttons>
          <Button type="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            submit
            onClick={() => onSubmit(newName)}
            disabled={!!newNameError}
          >
            OK
          </Button>
        </Form.Buttons>
      </Form>
    </Modal>
  );
};

export default EditUserName;
