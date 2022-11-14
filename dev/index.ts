import { Client, Collection, IntentsBitField } from "discord.js";
import { TwitterApi } from "twitter-api-v2";
import { SlashCommand } from "./types";
import { Telegraf } from "telegraf";
import { readdirSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const discordClient = new Client({ intents: IntentsBitField.Flags.Guilds });
discordClient.commands = new Collection<string, SlashCommand>();
const telegramBot = new Telegraf(process.env.TELEGRAMTOKEN as string);
//@ts-ignore
const twitterClient = new TwitterApi(process.env.TWITTERTOKEN);

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
  require(`${handlersDir}/${handler}`)(
    telegramBot,
    discordClient,
    twitterClient
  );
});

discordClient.login(process.env.DISCORDTOKEN);
telegramBot.launch();
