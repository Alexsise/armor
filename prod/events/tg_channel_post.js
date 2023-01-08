"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stringFormatting_1 = require("../utils/stringFormatting");
const ts_open_graph_scraper_1 = __importDefault(require("ts-open-graph-scraper"));
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const event = {
    name: "channel_post",
    execute(ctx, telegramBot, discordClient) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if ("channel_post" in ctx.update) {
                const postUrl = `https://t.me/c/${ctx.update.channel_post.chat.id
                    .toString()
                    .slice(4)}/${ctx.update.channel_post.message_id}`;
                let urlButton = undefined;
                let markups = [];
                let hashtagFooter = "Telegram •";
                let hasOriginalImage = false;
                let postContent = "";
                let videoURL = "";
                let postTitle;
                if ("text" in ctx.update.channel_post) {
                    postContent = (_a = ctx.update.channel_post.text) !== null && _a !== void 0 ? _a : "";
                    markups = ctx.update.channel_post.entities;
                }
                else if ("caption" in ctx.update.channel_post) {
                    postContent = (_b = ctx.update.channel_post.caption) !== null && _b !== void 0 ? _b : "";
                    markups = ctx.update.channel_post.caption_entities;
                }
                const embed = new discord_js_1.EmbedBuilder();
                const guild = discordClient.guilds.cache.find((guild) => guild.id === process.env.GUILDID);
                const firstSentenceRegex = /^(.*?)[.?!]\s/;
                let channel;
                postContent = (0, stringFormatting_1.restoreMarkup)(postContent, markups);
                //#region Title Formatting
                if ((postTitle = firstSentenceRegex.exec(postContent)) !== null) {
                    embed.setTitle(postTitle[0]);
                    if (postTitle[0].includes("](")) {
                        const fixedTitle = embed.data.title.slice(0, embed.data.title.indexOf("[")) +
                            embed.data.title.slice(embed.data.title.indexOf("[") + 1, embed.data.title.indexOf("](")) +
                            embed.data.title.slice(embed.data.title.indexOf(")") + 1);
                        videoURL = embed.data.title.slice(embed.data.title.indexOf("](") + 2, embed.data.title.indexOf(")"));
                        embed.setTitle(fixedTitle);
                    }
                    postContent = postContent.slice(postTitle[0].length);
                }
                //#endregion
                console.log(videoURL);
                const hashtags = (0, stringFormatting_1.extract)(postContent, {
                    symbol: false,
                    unique: true,
                });
                let channelHashTag = hashtags[hashtags.findIndex((hashtag) => hashtag.startsWith("armored"))];
                //#region Channel Selection
                if (channelHashTag) {
                    switch (channelHashTag) {
                        case "armorednews":
                            channel = guild.channels.cache.find((channel) => channel.id === process.env.NEWSCHANNELID);
                            embed.setColor(0xf5f5f5);
                            break;
                        case "armoredstream":
                            channel = guild.channels.cache.find((channel) => channel.id === process.env.STREAMCHANNELID);
                            embed.setColor(0x6441a5);
                            break;
                        case "armoredyoutube":
                            channel = guild.channels.cache.find((channel) => channel.id === process.env.YOUTUBECHANNELID);
                            embed.setColor(0xd11114);
                            break;
                        default:
                            channel = guild.channels.cache.find((channel) => channel.id === process.env.DEFAULTCHANNELID);
                            embed.setColor(0x171515);
                            break;
                    }
                }
                else {
                    channel = guild.channels.cache.find((channel) => channel.id === process.env.DEFAULTCHANNELID);
                    embed.setColor(0x171515);
                }
                //#endregion
                //#region String Formatting
                hashtags.forEach((hashtag) => (postContent =
                    postContent.slice(0, postContent.indexOf(hashtag) - 3) +
                        postContent.slice(postContent.indexOf(hashtag) + hashtag.length)));
                var pattern = /\B@[a-z0-9_-]+/gi;
                const mention = postContent.match(pattern);
                if (mention)
                    postContent = postContent.slice(0, postContent.indexOf(mention.toString()));
                postContent = postContent.replace("youtube • tiktok • telegram", "[youtube](https://www.youtube.com/c/PROJECTARMOR) • [tiktok](https://www.tiktok.com/@project_armor) • [telegram](https://t.me/projectarmor)");
                embed.setDescription(postContent);
                hashtags.forEach((hashtag) => (hashtagFooter += ` #${hashtag}`));
                embed.setFooter({
                    text: hashtagFooter,
                    iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1280px-Telegram_2019_Logo.svg.png",
                });
                //#endregion
                if ("photo" in ctx.update.channel_post) {
                    const photos = (_d = (_c = ctx.update) === null || _c === void 0 ? void 0 : _c.channel_post) === null || _d === void 0 ? void 0 : _d.photo;
                    if (photos) {
                        const photo = photos.slice(-1).pop().file_id;
                        const url = yield telegramBot.telegram.getFileLink(photo);
                        const response = yield (0, axios_1.default)({
                            method: "get",
                            url: url.href,
                            responseType: "arraybuffer",
                        });
                        const image = Buffer.from(response.data, "base64");
                        var attachment = new discord_js_1.AttachmentBuilder(image, { name: "image.jpg" });
                        embed.setImage(`attachment://${attachment.name}`);
                        hasOriginalImage = true;
                    }
                }
                if (!embed.data.image && videoURL !== "") {
                    const data = yield (0, ts_open_graph_scraper_1.default)(videoURL);
                    console.log(100);
                    console.log(data.ogImage);
                    if (data.ogImage)
                        embed.setImage(data.ogImage[0].url);
                    urlButton = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setLabel("Watch")
                        .setStyle(discord_js_1.ButtonStyle.Link)
                        .setURL(videoURL));
                }
                if (hasOriginalImage && urlButton)
                    //@ts-ignore
                    channel.send({
                        embeds: [embed],
                        //@ts-ignore
                        components: [urlButton],
                        //@ts-ignore
                        files: [attachment],
                    });
                else if (hasOriginalImage && !urlButton)
                    //@ts-ignore
                    channel.send({
                        embeds: [embed],
                        //@ts-ignore
                        files: [attachment],
                    });
                else if (!hasOriginalImage && urlButton)
                    //@ts-ignore
                    channel.send({ embeds: [embed], components: [urlButton] });
                else if (!hasOriginalImage && !urlButton)
                    channel.send({ embeds: [embed] });
            }
        });
    },
};
exports.default = event;
