/**
 * This file exists because, at the time of development, articles were written in HTML.
 * 
 * This file is used to transition articles from HTML to Markdown, which involves a few steps:
 *  1. Check if the article is in HTML.
 *  2. If reading the article, determine whether to setInnerHTML or use a Markdown parser to render the article.
 *  3. If writing the article, and the article is in HTML, convert it to Markdown.
 */

import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from "node-html-markdown";

/**
 * Roughly detects whether some text is HTML. This is not a perfect test, but it's good enough for our purposes.
 * @param text 
 * @returns 
 */
export function isHTML(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

export function convertHTMLToMarkdown(html: string): string {
  return NodeHtmlMarkdown.translate(html);
}