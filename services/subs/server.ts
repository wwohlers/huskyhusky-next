import { v4 as uuidv4 } from "uuid";
import { HuskyHuskyDB } from "../database";

export function getSubs(conn: HuskyHuskyDB) {
  return conn.models.Sub.find().lean();
}

export function subscribe(conn: HuskyHuskyDB, email: string) {
  return conn.models.Sub.create({
    email,
    uuid: uuidv4(),
  });
}

export function unsubscribe(conn: HuskyHuskyDB, uuid: string) {
  return conn.models.Sub.deleteOne({
    uuid,
  });
}
