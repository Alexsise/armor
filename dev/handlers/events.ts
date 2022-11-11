import { Update } from "telegraf/typings/core/types/typegram";
import { Telegraf, Context } from "telegraf";
import { Client } from "discord.js";
import { readdirSync } from "fs";
import { Event } from "../types";
import { join } from "path";

module.exports = (telegramBot: Telegraf, discordClient: Client) => {
  const eventsFolderPath = join(__dirname, "../events");

  const eventsFiles = readdirSync(eventsFolderPath);

  for (const file of eventsFiles) {
    const filePath = join(eventsFolderPath, file);
    const event: Event = require(filePath).default;

    if (file.startsWith("d_")) {
      if (event.once)
        discordClient.once(event.name, (...args) => event.execute(...args));
      else discordClient.on(event.name, (...args) => event.execute(...args));
    } else if (file.startsWith("t_")) {
      //@ts-ignore
      telegramBot.on(event.name, (ctx: Context<Update.ChannelPostUpdate>) =>
        event.execute(ctx, telegramBot, discordClient)
      );
    }
  }
};
