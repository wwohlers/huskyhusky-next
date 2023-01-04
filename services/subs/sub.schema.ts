import * as mongoose from "mongoose";
import { now } from "../../util/datetime";
import { ISub } from "./sub.interface";

/**
 * Represents a subscription (basically an email that a user has entered into the subscription box).
 */
export const SubSchema = new mongoose.Schema<ISub>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
    default: now,
  },
});
