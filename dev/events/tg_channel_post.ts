import { MessageEntity, Update } from "telegraf/typings/core/types/typegram";
import { extract, restoreMarkup } from "../utils/stringFormatting";
import { Context, Telegraf } from "telegraf";
import ogs from "ts-open-graph-scraper";
import { Event } from "../types";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Guild,
  TextChannel,
} from "discord.js";

const event: Event = {
  name: "channel_post",
  async execute(
    ctx: Context<Update>,
    telegramBot: Telegraf,
    discordClient: Client
  ) {
    if ("channel_post" in ctx.update) {
      const postUrl = `https://t.me/c/${ctx.update.channel_post.chat.id
        .toString()
        .slice(4)}/${ctx.update.channel_post.message_id}`;
      let urlButton: ActionRowBuilder | undefined = undefined;
      let markups: MessageEntity[] = new Array();
      let hashtagFooter = "Telegram •";
      let postContent = "";
      let videoURL = "";
      let postTitle;

      if ("text" in ctx.update.channel_post) {
        postContent = ctx.update.channel_post.text ?? "";
        markups = ctx.update.channel_post.entities as MessageEntity[];
      } else if ("caption" in ctx.update.channel_post) {
        postContent = ctx.update.channel_post.caption ?? "";
        markups = ctx.update.channel_post.caption_entities as MessageEntity[];
      }

      const embed = new EmbedBuilder();
      const guild = discordClient.guilds.cache.find(
        (guild) => guild.id === process.env.GUILDID
      ) as Guild;
      const firstSentenceRegex = /^(.*?)[.?!]\s/;
      let channel: TextChannel;

      postContent = restoreMarkup(postContent, markups);

      if ((postTitle = firstSentenceRegex.exec(postContent)) !== null) {
        embed.setTitle(postTitle[0]);
        if (postTitle[0].includes("](")) {
          const fixedTitle =
            embed.data.title!.slice(0, embed.data.title!.indexOf("[")) +
            embed.data.title!.slice(
              embed.data.title!.indexOf("[") + 1,
              embed.data.title!.indexOf("](")
            ) +
            embed.data.title!.slice(embed.data.title!.indexOf(")") + 1);
          videoURL = embed.data.title!.slice(
            embed.data.title!.indexOf("](") + 2,
            embed.data.title!.indexOf(")")
          );
          embed.setTitle(fixedTitle);
        }
        postContent = postContent.slice(postTitle[0].length);
      }

      if ("photo" in ctx.update.channel_post) {
        const photos = ctx.update?.channel_post?.photo;
        if (photos) {
          const photo = photos.slice(-1).pop()!.file_id;
          const url = await telegramBot.telegram.getFileLink(photo);
          embed.setImage(url.href);
        }
      }

      const hashtags = extract(postContent, {
        symbol: false,
        unique: true,
      });
      let channelHashTag =
        hashtags[
          hashtags.findIndex((hashtag) => hashtag.startsWith("armored"))
        ];

      hashtags.forEach((hashtag) => (hashtagFooter += ` #${hashtag}`));
      embed.setFooter({
        text: hashtagFooter,
        iconURL:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1280px-Telegram_2019_Logo.svg.png",
      });
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
      } else {
        channel = guild.channels.cache.find(
          (channel) => channel.id === process.env.DEFAULTCHANNELID
        ) as TextChannel;
        embed.setColor(0x6722f0);
      }

      hashtags.forEach(
        (hasttag) =>
          (postContent =
            postContent.slice(0, postContent.indexOf(hasttag) - 3) +
            postContent.slice(postContent.indexOf(hasttag) + hasttag.length))
      );

      var pattern = /\B@[a-z0-9_-]+/gi;
      const mention = postContent.match(pattern);
      if (mention)
        postContent = postContent.slice(
          0,
          postContent.indexOf(mention.toString())
        );

      postContent = postContent.replace(
        "youtube • tiktok • telegram",
        "[youtube](https://www.youtube.com/c/PROJECTARMOR) • [tiktok](https://www.tiktok.com/@project_armor) • [telegram](https://t.me/projectarmor)"
      );

      embed.setDescription(postContent);

      if (!embed.data.image && videoURL !== "") {
        const data = await ogs(videoURL);
        if (data.ogImage) embed.setImage(data.ogImage[0].url);
        urlButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Watch")
            .setStyle(ButtonStyle.Link)
            .setURL(videoURL)
        );
      }
      // else {
      //   embed.setURL(postUrl);
      // }

      //@ts-ignore
      if (urlButton) channel.send({ embeds: [embed], components: [urlButton] });
      else channel.send({ embeds: [embed] });
    }
  },
};

export default event;
