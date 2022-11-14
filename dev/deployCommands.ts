import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "./types";
import * as path from "node:path";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
dotenv.config();

const commands = [];
const commandPath = path.join(__dirname, "commands");
const commandsFiles = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandsFiles) {
  const filePath = path.join(commandPath, file);
  const command: SlashCommand = require(filePath).default;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORDTOKEN);

rest
  .put(Routes.applicationCommands(process.env.CLIENTID), { body: commands })
  .then(() => console.log("Successfully registered application commands"))
  .catch(console.error);
