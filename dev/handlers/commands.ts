import { TwitterApi } from "twitter-api-v2";
import { SlashCommand } from "../types";
import { Telegraf } from "telegraf";
import { Client } from "discord.js";
import { join } from "path";
import * as fs from "fs";

module.exports = (
  telegramBot: Telegraf,
  discordClient: Client
) => {
  const commandsDir = join(__dirname, "../commands");
  const commandsFiles = fs.readdirSync(commandsDir);

  for (const commandFile of commandsFiles) {
    const filePath = join(commandsDir, commandFile);
    const command: SlashCommand = require(filePath).default;

    discordClient.commands.set(command.data.name, command);
  }
};
