import { boolean, object, oneOf, optional } from "deterrent";
import mongoose from "mongoose";
import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { NotFoundError } from "../../../util/api/handleError";
import { comparePassword } from "../../../util/bcrypt";
import {
  emailValidator,
  enteredPasswordValidator,
  idValidator,
  newPasswordValidator,
} from "../../../util/validation";
import { adminUpdateUser, selfUpdateUser } from "../server";
import { IUser, userBioValidator, userNameValidator } from "../user.interface";

type AdminEditUserRequest = {
  admin: true;
  userUpdate: {
    _id: string;
    name?: string;
    admin?: boolean;
    removed?: boolean;
  };
};
type SelfEditUserRequest = {
  admin: false;
  oldPassword?: string;
  userUpdate: {
    name?: string;
    bio?: string;
    email?: string;
    password?: string;
  };
};
type EditUserRequest = AdminEditUserRequest | SelfEditUserRequest;
type EditUserResponse = IUser;

const adminEditUserValidator = object().schema<AdminEditUserRequest>({
  admin: boolean().true(),
  userUpdate: object().schema<AdminEditUserRequest["userUpdate"]>({
    _id: idValidator,
    name: optional(userNameValidator, { allowNull: false }),
    admin: optional(boolean(), { allowNull: false }),
    removed: optional(boolean(), { allowNull: false }),
  }),
});

const selfEditUserValidator = object().schema<SelfEditUserRequest>({
  admin: boolean().false(),
  oldPassword: optional(enteredPasswordValidator, {
    allowNull: false,
  }),
  userUpdate: object().schema<SelfEditUserRequest["userUpdate"]>({
    name: optional(userNameValidator),
    bio: optional(userBioValidator),
    email: optional(emailValidator),
    password: optional(newPasswordValidator),
  }),
});

const requestBodyValidator = oneOf([
  adminEditUserValidator,
  selfEditUserValidator,
]);

const editUserHandler: MethodHandler<
  EditUserRequest,
  EditUserResponse
> = async ({ conn, userId, req }) => {
  const body = requestBodyValidator.assert(req.body);
  let user: (mongoose.Document & IUser) | null = await requireAuth(
    conn,
    userId,
    body.admin
  );
  if (body.admin) {
    user = await conn.models.User.findById(body.userUpdate._id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user = await adminUpdateUser(user, {
      name: body.userUpdate.name,
      admin: body.userUpdate.admin,
      removed: body.userUpdate.removed,
    });
  } else {
    if (body.userUpdate.email || body.userUpdate.password) {
      if (!body.oldPassword) {
        throw new NotFoundError("Invalid password");
      }
      const validPassword = await comparePassword(
        body.oldPassword,
        user.password
      );
      if (!validPassword) {
        throw new NotFoundError("Invalid password");
      }
    }
    user = await selfUpdateUser(user, {
      name: body.userUpdate.name,
      bio: body.userUpdate.bio,
      email: body.userUpdate.email,
      password: body.userUpdate.password,
    });
  }
  return user.toObject();
};

export default editUserHandler;
