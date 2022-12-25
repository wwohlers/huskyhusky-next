import mongoose from "mongoose";
import {
  adminUpdateUser,
  selfUpdateUser,
} from "../../../users/server";
import {
  createUserBioValidator,
  createUserNameValidator,
  IUser,
} from "../../../users/user.interface";
import { comparePassword } from "../../../../util/bcrypt";
import {
  allowUndefined,
  createEmailValidator,
  createIdValidator,
  createNewPasswordValidator,
  createSchemaValidator,
  isBoolean,
  isString,
  createOneOfValidator,
} from "../../../../util/validation";
import { MethodHandler } from "../../createHandler";
import requireAuth from "../../guards/requireAuth";
import { NotFoundError } from "../../handleError";

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
    name: allowUndefined(createUserNameValidator()),
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
    name: allowUndefined(createUserNameValidator()),
    bio: allowUndefined(createUserBioValidator()),
    email: allowUndefined(createEmailValidator()),
    password: allowUndefined(createNewPasswordValidator()),
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
