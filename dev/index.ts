import { Client, IntentsBitField } from "discord.js";
import { Telegraf } from "telegraf";
import { readdirSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const discordClient = new Client({ intents: IntentsBitField.Flags.Guilds });
const telegramBot = new Telegraf(process.env.TELEGRAMTOKEN as string);

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
  require(`${handlersDir}/${handler}`)(telegramBot, discordClient);
});

discordClient.login(process.env.DISCORDTOKEN);
telegramBot.launch();
