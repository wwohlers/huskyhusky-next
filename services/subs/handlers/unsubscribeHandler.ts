import { MethodHandler } from "../../../util/api/createHandler";
import { createSchemaValidator, isString } from "../../../util/validation";
import { unsubscribe } from "../server";

type UnsubscribeRequest = {
  uuid: string;
}

const requestBodyValidator = createSchemaValidator<UnsubscribeRequest>({
  uuid: isString,
});

const unsubscribeHandler: MethodHandler<
  UnsubscribeRequest,
  void
> = async ({ req, conn }) => {
  const { uuid } = requestBodyValidator(req.body);
  await unsubscribe(conn, uuid);
}

export default unsubscribeHandler;