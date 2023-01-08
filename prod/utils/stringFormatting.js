"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreMarkup = exports.extract = void 0;
function getUnique(hashtags) {
    return [...new Set(hashtags)];
}
function extract(string, options) {
    let hashtags = [];
    const { symbol = true, unique = false, caseSensitive = true } = options;
    if (!string || typeof string !== "string") {
        throw new Error("Invalid string");
    }
    !caseSensitive && (string = string.toLowerCase());
    if (symbol) {
        hashtags = string.match(/(?<=[\s>]|^)[#|＃](\w*[a-zA-Z0-9]+\w*)/gi) || [];
    }
    else {
        hashtags = string.match(/(?<=[#|＃])[\w]+/gi) || [];
    }
    return unique ? getUnique(hashtags) : hashtags;
}
exports.extract = extract;
function restoreMarkup(content, markups) {
    let prokatilo = 0;
    markups === null || markups === void 0 ? void 0 : markups.reverse().forEach((markup) => {
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
exports.restoreMarkup = restoreMarkup;
