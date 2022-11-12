import { Client, EmbedBuilder, Guild, TextChannel } from "discord.js";
import { Update } from "telegraf/typings/core/types/typegram";
import { extract } from "../utils/stringFormatting";
import { getLinkPreview } from "link-preview-js";
import { Context, Telegraf } from "telegraf";
import { Event } from "../types";

const event: Event = {
  name: "channel_post",
  async execute(
    ctx: Context<Update.ChannelPostUpdate>,
    telegramBot: Telegraf,
    discordClient: Client
  ) {
    let content: string = "";
    let videoUrl: string = "";
    let firstSentence;
    let markups;

    if ("text" in ctx.update.channel_post) {
      content = ctx.update.channel_post.text ?? "";
      markups = ctx.update.channel_post.entities;
    } else if ("caption" in ctx.update.channel_post) {
      content = ctx.update.channel_post.caption ?? "";
      markups = ctx.update.channel_post.caption_entities;
    }

    const embed = new EmbedBuilder();
    const guild = discordClient.guilds.cache.find(
      (guild) => guild.id === process.env.GUILDID
    ) as Guild;
    const firstSentenceRegex = /^(.*?)[.?!]\s/;
    let channel: TextChannel;

    markups?.reverse().forEach((markup) => {
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

    if ((firstSentence = firstSentenceRegex.exec(content)) !== null) {
      embed.setTitle(firstSentence[0]);
      if (firstSentence[0].includes("](")) {
        const fixedTitle =
          embed.data.title!.slice(0, embed.data.title!.indexOf("[")) +
          embed.data.title!.slice(
            embed.data.title!.indexOf("[") + 1,
            embed.data.title!.indexOf("](")
          ) +
          embed.data.title!.slice(embed.data.title!.indexOf(")") + 1);
        videoUrl = embed.data.title!.slice(
          embed.data.title!.indexOf("](") + 2,
          embed.data.title!.indexOf(")")
        );
        embed.setTitle(fixedTitle);
      }
      content = content.slice(firstSentence[0].length);
    }

    if ("photo" in ctx.update.channel_post) {
      const photos = ctx.update?.channel_post?.photo;
      if (photos) {
        const photo = photos.slice(-1).pop()!.file_id;
        const url = await telegramBot.telegram.getFileLink(photo);
        embed.setImage(url.href);
      }
    }

    const hasttags = extract(content, {
      symbol: false,
      unique: true,
    });
    let channelHashTag =
      hasttags[hasttags.findIndex((hashtag) => hashtag.startsWith("armored"))];
    if (channelHashTag) {
      switch (channelHashTag) {
        case "armorednews":
          channel = guild.channels.cache.find(
            (channel) => channel.id === process.env.NEWSCHANNELID
          ) as TextChannel;
          embed.setColor(0xf5f5f5);
          break;
        case "armoredstream":
          channel = guild.channels.cache.find(
            (channel) => channel.id === process.env.STREAMCHANNELID
          ) as TextChannel;
          embed.setColor(0x6441a5);
          break;
        case "armoredyoutube":
          channel = guild.channels.cache.find(
            (channel) => channel.id === process.env.YOUTUBECHANNELID
          ) as TextChannel;
          embed.setColor(0xd11114);
          break;
        default:
          channel = guild.channels.cache.find(
            (channel) => channel.id === process.env.DEFAULTCHANNELID
          ) as TextChannel;
          embed.setColor(0x6722f0);
          break;
      }
      content =
        content.slice(0, content.indexOf(channelHashTag) - 3) +
        content.slice(content.indexOf(channelHashTag) + channelHashTag.length);
    } else {
      channel = guild.channels.cache.find(
        (channel) => channel.id === process.env.DEFAULTCHANNELID
      ) as TextChannel;
      embed.setColor(0x6722f0);
    }

    content = content
      .replace("youtube", "[youtube](https://www.youtube.com/c/PROJECTARMOR)")
      .replace("tiktok", "[tiktok](https://www.tiktok.com/@project_armor)")
      .replace("telegram", "[telegram](https://t.me/projectarmor)");

    embed.setDescription(content);
    if (!embed.data.image && videoUrl !== "") {
      const data = await getLinkPreview(videoUrl);
      if ("images" in data) embed.setImage(data.images[0]);
      embed.setURL("https://discord.js.org/");
    }

    channel.send({ embeds: [embed] });
  },
};

export default event;
