import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import {
  bodyValidator,
  subjectValidator,
} from "../../../util/email/validators";
import { createSchemaValidator } from "../../../util/validation";
import { getSubs } from "../server";
import * as Showdown from "showdown";
import { sendEmail } from "../../../util/email/server";

const converter = new Showdown.Converter();

type SendEmailRequest = {
  subject: string;
  body: string;
};

const requestBodyValidator = createSchemaValidator<SendEmailRequest>({
  subject: subjectValidator,
  body: bodyValidator,
});

const sendEmailHandler: MethodHandler<SendEmailRequest, void> = async ({
  req,
  conn,
  userId,
}) => {
  requireAuth(conn, userId, true);
  const { body, subject } = requestBodyValidator(req.body);
  const subs = await getSubs(conn);
  await Promise.all(
    subs
      .filter((sub) => sub.email === "bswohlers@gmail.com")
      .map(({ email, uuid }) => {
        const bodyHtml = converter.makeHtml(body);
        const bodyWithUnsubscribe = `${bodyHtml} 
          <br /><br /> 
          <p>
            You received this email because you're subscribed to The Husky Husky. 
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe/${uuid}">Unsubscribe</a>
          </p>
        `;
        return sendEmail(email, subject, bodyWithUnsubscribe);
      })
  );
};

export default sendEmailHandler;
