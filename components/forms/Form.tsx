import { IoMdAlert } from "react-icons/io";
import Label from "../atoms/Label";
import { twMerge } from "tailwind-merge";

const FormItem: React.FC<{
  title: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, error = "", className = "", children }) => {
  return (
    <label className={twMerge("block my-2", className)}>
      <Label className="mb-px">{title}</Label>
      {children}
      {error && (
        <div className="flex items-center space-x-px text-sm font-medium my-1 text-theme">
          <IoMdAlert size={16} />
          <span>{error}</span>
        </div>
      )}
    </label>
  );
};

const FormButtons: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={twMerge(
        "flex my-2 space-x-2 justify-end items-center",
        className
      )}
    >
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
      className={twMerge("flex flex-col", className)}
      onSubmit={(e) => e.preventDefault()}
    >
      {children}
    </form>
  );
};

Form.Item = FormItem;
Form.Buttons = FormButtons;

export default Form;
