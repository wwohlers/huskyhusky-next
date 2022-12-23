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

const FormSection: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="flex flex-col space-y-2 my-4">{children}</div>;
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
  children: React.ReactNode;
}> & {
  Item: typeof FormItem;
  Section: typeof FormSection;
  Buttons: typeof FormButtons;
} = ({ children }) => {
  return (
    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
      {children}
    </form>
  );
};

Form.Item = FormItem;
Form.Section = FormSection;
Form.Buttons = FormButtons;

export default Form;
