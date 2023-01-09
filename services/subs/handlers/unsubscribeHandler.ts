import { object, string } from "deterrent";
import { MethodHandler } from "../../../util/api/createHandler";
import { unsubscribe } from "../server";

type UnsubscribeRequest = {
  uuid: string;
};

const requestBodyValidator = object().schema<UnsubscribeRequest>({
  uuid: string(),
});

const unsubscribeHandler: MethodHandler<UnsubscribeRequest, void> = async ({
  req,
  conn,
}) => {
  const { uuid } = requestBodyValidator.assert(req.body);
  await unsubscribe(conn, uuid);
};

export default unsubscribeHandler;
