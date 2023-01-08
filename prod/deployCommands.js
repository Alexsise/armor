"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path = __importStar(require("node:path"));
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("node:fs"));
dotenv.config();
const commands = [];
const commandPath = path.join(__dirname, "commands");
const commandsFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".ts"));
for (const file of commandsFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath).default;
    commands.push(command.data.toJSON());
}
const rest = new discord_js_1.REST({ version: "9" }).setToken(process.env.DISCORDTOKEN);
rest
    .put(discord_js_1.Routes.applicationCommands(process.env.CLIENTID), { body: commands })
    .then(() => console.log("Successfully registered application commands"))
    .catch(console.error);
