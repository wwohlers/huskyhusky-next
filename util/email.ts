import { string } from "deterrent";
import Nodemailer from "nodemailer";

export const subjectValidator = string({ name: "Email subject" }).minLength(1).maxLength(100);
export const bodyValidator = string({ name: "Email body" }).minLength(1).maxLength(100000);

export async function sendEmail(
  recipient: string,
  subject: string,
  content: string
) {
  const transporter = Nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_NAME,
      pass: process.env.GMAIL_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: `"The Husky Husky" <${process.env.GMAIL_NAME}>`,
    to: recipient,
    subject,
    html: content,
  });
  console.log("Message sent: %s \n\n %s", info.messageId);
}
