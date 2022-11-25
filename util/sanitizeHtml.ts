import sanitize from "sanitize-html";

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      span: ["style"],
      div: ["style"],
      p: ["style"],
    },
  });
}
