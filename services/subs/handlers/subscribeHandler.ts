import { object } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import { emailValidator } from "../../../util/validation";
import { subscribe } from "../server";

type SubscribeRequest = {
  email: string;
};

const requestBodyValidator = object().schema<SubscribeRequest>({
  email: emailValidator,
});

const subscribeHandler: MethodHandler<SubscribeRequest, void> = async ({
  req,
  conn,
}) => {
  const { email } = requestBodyValidator.assert(req.body);
  await subscribe(conn, email);
};

export default subscribeHandler;
