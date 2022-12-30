import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { MdSubject } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../components/atoms/Button";
import TextArea from "../components/atoms/TextArea";
import TextInput from "../components/atoms/TextInput";
import Form from "../components/forms/Form";
import Section from "../components/Section";
import { useConfirmationModal } from "../hooks/useConfirmationModal";
import { useForm } from "../hooks/useForm";
import { withDB } from "../services/database";
import { bodyValidator, subjectValidator } from "../util/email/validators";
import { getSubs } from "../services/subs/server";
import { ISub } from "../services/subs/sub.interface";
import { userIsAdmin } from "../services/users/server";
import { getUserIdFromReq } from "../util/jwt";
import { returnProps, returnNotFound } from "../util/next";
import toastError from "../util/toastError";
import { makeSendEmailRequest } from "./api/subs/sendEmail";

const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type SubscriptionsProps = {
  subs: ISub[];
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const userId = await getUserIdFromReq(req);
  return await withDB(async (conn) => {
    if (userId) {
      const isAdmin = await userIsAdmin(conn, userId);
      if (isAdmin) {
        const subs = await getSubs(conn);
        return returnProps({ subs });
      }
    }
    return returnNotFound();
  });
};

type SubscriptionsForm = {
  subject: string;
  body: string;
};

const Subscriptions: React.FC<SubscriptionsProps> = ({ subs }) => {
  const confirm = useConfirmationModal();
  const { values, onFieldChange, errors, hasErrors } =
    useForm<SubscriptionsForm>(
      {
        subject: "",
        body: "",
      },
      {
        subject: subjectValidator,
        body: bodyValidator,
      }
    );

  const onSubmit = async () => {
    const response = await confirm(
      "Send Email",
      "Send an email to all subscribers?"
    );
    if (response === "cancel") return;
    try {
      await makeSendEmailRequest({
        subject: values.subject,
        body: values.body,
      });
      toast.success("Email sent!");
    } catch (e) {
      toastError(e);
    }
  };

  return (
    <>
      <Head>
        <title>Subscriptions - The Husky Husky</title>
      </Head>
      <div className="w-full">
        <h1 className="text-3xl font-medium">Subscriptions</h1>
        <Section title="View Mailing List">
          <code className="bg-background-dark p-2 rounded-md h-64 overflow-y-scroll w-full block my-2">
            {subs.map((sub) => sub.email).join(",\n")}
          </code>
        </Section>
        <Section title="Send an Email to Subscribers">
          <Form>
            <Form.Item title="Subject" error={errors.subject}>
              <TextInput
                type="text"
                icon={<MdSubject size={20} />}
                onChange={onFieldChange("subject")}
              />
            </Form.Item>
            <Form.Item title="Body" error={errors.body}>
              <SimpleMDEEditor
                value={values.body}
                onChange={onFieldChange("body")}
              />
            </Form.Item>
            <Form.Buttons>
              <Button submit disabled={hasErrors} onClick={onSubmit}>
                Send Email
              </Button>
            </Form.Buttons>
          </Form>
        </Section>
      </div>
    </>
  );
};

export default Subscriptions;
