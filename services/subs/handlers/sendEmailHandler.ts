import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { getSubs } from "../server";
import * as Showdown from "showdown";
import {
  bodyValidator,
  sendEmail,
  subjectValidator,
} from "../../../util/email";
import { object } from "deterrent";

const converter = new Showdown.Converter();

type SendEmailRequest = {
  subject: string;
  body: string;
};

const requestBodyValidator = object().schema<SendEmailRequest>({
  subject: subjectValidator,
  body: bodyValidator,
});

const sendEmailHandler: MethodHandler<SendEmailRequest, void> = async ({
  req,
  conn,
  userId,
}) => {
  requireAuth(conn, userId, true);
  const { body, subject } = requestBodyValidator.assert(req.body);
  const subs = await getSubs(conn);
  await Promise.all(
    subs.map(({ email, uuid }) => {
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
