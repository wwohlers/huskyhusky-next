import { MethodHandler } from "../../../util/api/createHandler";
import { createSchemaValidator, isEmail } from "../../../util/validation";
import { subscribe } from "../server";

type SubscribeRequest = {
  email: string;
}

const requestBodyValidator = createSchemaValidator<SubscribeRequest>({
  email: isEmail,
});

const subscribeHandler: MethodHandler<
  SubscribeRequest,
  void
> = async ({ req, conn }) => {
  const { email } = requestBodyValidator(req.body);
  await subscribe(conn, email);
}

export default subscribeHandler;