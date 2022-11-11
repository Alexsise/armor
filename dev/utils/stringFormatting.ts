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
