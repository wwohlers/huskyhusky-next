export default function stringifyIds(obj: any) {
  for (const key in obj) {
    if (key === "_id" && obj[key]?.toString) {
      obj[key] = obj[key].toString();
    } else if (typeof obj[key] === "object") {
      stringifyIds(obj[key]);
    }
  }
}
