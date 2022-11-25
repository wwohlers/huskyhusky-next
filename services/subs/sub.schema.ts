import * as mongoose from "mongoose";
import { ISub } from "./sub.interface";

const now = () => Math.floor(Date.now() / 1000);

/**
 * Represents a subscription (basically an email that a user has entered into the subscription box).
 */
export const SubSchema = new mongoose.Schema<ISub>({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
    default: now,
  },
});
