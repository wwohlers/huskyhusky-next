import { DateTime } from "luxon";

const units: Intl.RelativeTimeFormatUnit[] = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
];

export const now = () => Math.floor(Date.now() / 1000);

export const timeAgo = (timestamp: number) => {
  const dt = DateTime.fromMillis(timestamp * 1000);
  const diff = dt.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

  const relativeFormatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};

export const formatDateTime = (timestamp: number) => {
  const dt = DateTime.fromMillis(timestamp * 1000);
  return dt.toFormat("LLLL d, yyyy");
};

export const getAllMonths = (start: DateTime, end: DateTime) => {
  let dt = start;
  const months = [];
  while (dt <= end) {
    months.push(dt.startOf("month"));
    dt = dt.plus({ month: 1 });
  }
  return months;
};
