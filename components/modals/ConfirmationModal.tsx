import { useAtom } from "jotai";
import { confirmationModalDataAtom } from "../../hooks/useConfirmationModal";
import Button from "../atoms/Button";
import Form from "../forms/Form";
import Modal from "./Modal";

const ConfirmationModal: React.FC = () => {
  const [modalData, setModalData] = useAtom(confirmationModalDataAtom);

  const onCancel = () => {
    setModalData({ ...modalData!, response: "cancel" });
  };

  const onConfirm = () => {
    setModalData({ ...modalData!, response: "confirm" });
  };

  if (!modalData) {
    return null;
  }
  return (
    <Modal title={modalData.title} onClose={onCancel}>
      <p>{modalData.message}</p>
      <Form.Buttons>
        <Button type="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </Form.Buttons>
    </Modal>
  );
};

export default ConfirmationModal;
