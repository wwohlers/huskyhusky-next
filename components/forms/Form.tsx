import { IoMdAlert } from "react-icons/io";
import Label from "../atoms/Label";

const FormItem: React.FC<{
  title: string;
  error?: string;
  children: React.ReactNode;
}> = ({ title, error = "", children }) => {
  return (
    <label className="block my-2">
      <Label className="mb-px">{title}</Label>
      {children}
      {error && (
        <div className="flex items-center space-x-px text-sm font-medium my-1 text-red-800">
          <IoMdAlert size={16} />
          <span>{error}</span>
        </div>
      )}
    </label>
  );
};

const FormButtons: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex my-2 space-x-2 justify-end items-center">
      {children}
    </div>
  );
};

const Form: React.FC<{
  className?: string;
  children: React.ReactNode;
}> & {
  Item: typeof FormItem;
  Buttons: typeof FormButtons;
} = ({ className = "", children }) => {
  return (
    <form
      className={"flex flex-col " + className}
      onSubmit={(e) => e.preventDefault()}
    >
      {children}
    </form>
  );
};

Form.Item = FormItem;
Form.Buttons = FormButtons;

export default Form;
