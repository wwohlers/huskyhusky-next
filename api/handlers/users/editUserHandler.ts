import mongoose from "mongoose";
import {
  adminUpdateUser,
  selfUpdateUser,
  comparePassword,
} from "../../../services/users/server";
import { IUser } from "../../../services/users/user.interface";
import { MethodHandler } from "../../createHandler";
import requireAuth from "../../guards/requireAuth";
import { NotFoundError } from "../../handleError";

type EditUserRequest =
  | {
      admin: true;
      userUpdate: {
        _id: string;
        name: string;
        admin: boolean;
        removed: boolean;
      };
    }
  | {
      admin: false;
      oldPassword?: string;
      userUpdate: {
        name: string;
        bio: string;
        email: string;
        password: string;
      };
    };
type EditUserResponse = IUser;

const editUserHandler: MethodHandler<
  EditUserRequest,
  EditUserResponse
> = async ({ conn, userId, req }) => {
  let user: (mongoose.Document & IUser) | null = await requireAuth(
    conn,
    userId,
    req.body.admin
  );
  if (req.body.admin) {
    user = await conn.models.User.findById(req.body.userUpdate._id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user = await adminUpdateUser(user, {
      name: req.body.userUpdate.name,
      admin: req.body.userUpdate.admin,
      removed: req.body.userUpdate.removed,
    });
  } else {
    if (req.body.userUpdate.email || req.body.userUpdate.password) {
      if (!req.body.oldPassword) {
        throw new NotFoundError("Invalid password");
      }
      const validPassword = await comparePassword(user, req.body.oldPassword);
      if (!validPassword) {
        throw new NotFoundError("Invalid password");
      }
    }
    user = await selfUpdateUser(user, {
      name: req.body.userUpdate.name,
      bio: req.body.userUpdate.bio,
      email: req.body.userUpdate.email,
      password: req.body.userUpdate.password,
    });
  }
  return user;
};

export default editUserHandler;
