import { Document } from "mongoose";

export interface ISub {
  _id: string;
  email: string;
  uuid: string;
  createdAt: number;
}