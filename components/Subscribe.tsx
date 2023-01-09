import { AiOutlineMail } from "react-icons/ai";
import { toast } from "react-toastify";
import { useValidatedState } from "../hooks/useValidatedState";
import { makeSubscribeRequest } from "../pages/api/subs";
import toastError from "../util/toastError";
import { emailValidator } from "../util/validation";
import Button from "./atoms/Button";
import TextInput from "./atoms/TextInput";
import Form from "./forms/Form";

const Subscribe: React.FC = () => {
  const [email, setEmail, error] = useValidatedState("", emailValidator.assert);

  const onSubmit = async () => {
    try {
      await makeSubscribeRequest({ email });
      toast.success("Subscribed!");
    } catch (e) {
      toastError(e);
    }
  };

  return (
    <div className="py-8 px-8 w-full bg-background-dark flex justify-center items-center">
      <div className="w-full max-w-md">
        <p className="text-2xl font-medium mb-1">Stay up to date</p>
        <p>
          Never miss a publication from Northeastern&apos;s finest news source.
        </p>
        <Form>
          <Form.Item title="Enter your Email" error={error}>
            <TextInput icon={<AiOutlineMail />} onChange={setEmail} />
          </Form.Item>
          <Form.Buttons>
            <Button submit onClick={onSubmit}>
              Subscribe
            </Button>
          </Form.Buttons>
        </Form>
      </div>
    </div>
  );
};

export default Subscribe;
