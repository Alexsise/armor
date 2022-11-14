import { MessageEntity } from "telegraf/typings/core/types/typegram";
import { hashTagOptions } from "../types";

function getUnique(hashtags: string[]) {
  return [...new Set(hashtags)];
}

export function extract(string: string, options: hashTagOptions) {
  let hashtags = [];
  const { symbol = true, unique = false, caseSensitive = true } = options;

  if (!string || typeof string !== "string") {
    throw new Error("Invalid string");
  }

  !caseSensitive && (string = string.toLowerCase());

  if (symbol) {
    hashtags = string.match(/(?<=[\s>]|^)[#|＃](\w*[a-zA-Z0-9]+\w*)/gi) || [];
  } else {
    hashtags = string.match(/(?<=[#|＃])[\w]+/gi) || [];
  }

  return unique ? getUnique(hashtags) : hashtags;
}

export function restoreMarkup(
  content: string,
  markups: MessageEntity[]
): string {
  let prokatilo = 0;
  markups?.reverse().forEach((markup) => {
    if (prokatilo < 3) {
      prokatilo++;
      return;
    }
    let separator;
    const offset = markup.offset;
    const length = markup.length;
    switch (markup.type) {
      case "italic":
        separator = "_";
        break;
      case "underline":
        separator = "__";
        break;
      case "strikethrough":
        separator = "~~";
        break;
      case "pre":
        separator = "`";
        break;
      case "spoiler":
        separator = "||";
        break;
      case "text_link":
        const url = markup.url;
        // if (
        //   url.includes("t.me") ||
        //   url.includes("tiktok") ||
        //   url.includes("youtube")
        // )
        //   break;
        content =
          content.slice(0, offset + length) +
          `](${url})` +
          content.slice(offset + length);
        content = content.slice(0, offset) + "[" + content.slice(offset);
        break;
      default:
        break;
    }

    content =
      content.slice(0, offset + length) +
      (separator ? separator : "") +
      content.slice(offset + length);
    content =
      content.slice(0, offset) +
      (separator ? separator : "") +
      content.slice(offset);
  });

  return content;
}
