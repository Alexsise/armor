import { ETwitterStreamEvent, TwitterApi } from "twitter-api-v2";
import { Update } from "telegraf/typings/core/types/typegram";
import { Telegraf, Context } from "telegraf";
import { Client } from "discord.js";
import { readdirSync } from "fs";
import { Event } from "../types";
import { join } from "path";
import { UpdateType } from "telegraf/typings/telegram-types";

module.exports = async (
  telegramBot: Telegraf,
  discordClient: Client,
  twitterClient: TwitterApi
) => {
  // const stream = await twitterClient.v2.searchStream({
  //   "tweet.fields": ["referenced_tweets", "author_id"],
  //   expansions: ["referenced_tweets.id"],
  // });
  // stream.autoReconnect = true;

  const eventsFolderPath = join(__dirname, "../events");
  const eventsFiles = readdirSync(eventsFolderPath);

  for (const file of eventsFiles) {
    const filePath = join(eventsFolderPath, file);
    const event: Event = require(filePath).default;

    if (file.startsWith("d_")) {
      if (event.once)
        discordClient.once(event.name, (...args) => event.execute(...args));
      else discordClient.on(event.name, (...args) => event.execute(...args));
    } else if (file.startsWith("tg_")) {
      telegramBot.on(event.name as UpdateType, (ctx: Context<Update>) =>
        event.execute(ctx, telegramBot, discordClient)
      );
    } else if (file.startsWith("tw_")) {
      // stream.on(event.name as ETwitterStreamEvent, (...args) =>
      //   event.execute(...args, discordClient)
      // );
    }
  }
};
