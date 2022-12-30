import mongoose from "mongoose";
import { MethodHandler } from "../../../util/api/createHandler";
import requireAuth from "../../../util/api/guards/requireAuth";
import { NotFoundError } from "../../../util/api/handleError";
import { comparePassword } from "../../../util/bcrypt";
import {
  allowUndefined,
  createIdValidator,
  createOneOfValidator,
  createSchemaValidator,
  isBoolean,
  isEmail,
  isNewPassword,
  isString
} from "../../../util/validation";
import { adminUpdateUser, selfUpdateUser } from "../server";
import {
  isUserBio,
  isUserName,
  IUser
} from "../user.interface";

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

const adminEditUserValidator = createSchemaValidator<AdminEditUserRequest>({
  admin: (value) => {
    if (value !== true) {
      throw new Error("Invalid admin value");
    }
    return value;
  },
  userUpdate: createSchemaValidator<AdminEditUserRequest["userUpdate"]>({
    _id: createIdValidator(),
    name: allowUndefined(isUserName),
    admin: allowUndefined(isBoolean),
    removed: allowUndefined(isBoolean),
  }),
});

const selfEditUserValidator = createSchemaValidator<SelfEditUserRequest>({
  admin: (value) => {
    if (value !== false) {
      throw new Error("Invalid admin value");
    }
    return value;
  },
  oldPassword: allowUndefined(isString),
  userUpdate: createSchemaValidator<SelfEditUserRequest["userUpdate"]>({
    name: allowUndefined(isUserName),
    bio: allowUndefined(isUserBio),
    email: allowUndefined(isEmail),
    password: allowUndefined(isNewPassword),
  }),
});

const requestBodyValidator = createOneOfValidator<EditUserRequest>(
  adminEditUserValidator,
  selfEditUserValidator
);

const editUserHandler: MethodHandler<
  EditUserRequest,
  EditUserResponse
> = async ({ conn, userId, req }) => {
  const body = requestBodyValidator(req.body);
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
