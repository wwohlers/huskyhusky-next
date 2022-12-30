import Nodemailer from "nodemailer";

export async function sendEmail(
  recipient: string,
  subject: string,
  content: string
) {
  const testAccount = await Nodemailer.createTestAccount();
  const transporter = Nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const info = await transporter.sendMail({
    from: `"The Husky Husky" <${process.env.GMAIL_NAME}>`,
    to: "bswohlers@gmail.com",
    subject,
    html: content,
  });
  console.log("Message sent: %s \n\n %s", info.messageId, content);
  // https://www.npmjs.com/package/nodemailer-markdown
}
