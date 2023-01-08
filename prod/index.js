"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const twitter_api_v2_1 = require("twitter-api-v2");
const telegraf_1 = require("telegraf");
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discordClient = new discord_js_1.Client({ intents: discord_js_1.IntentsBitField.Flags.Guilds });
discordClient.commands = new discord_js_1.Collection();
const telegramBot = new telegraf_1.Telegraf(process.env.TELEGRAMTOKEN);
//@ts-ignore
const twitterClient = new twitter_api_v2_1.TwitterApi(process.env.TWITTERTOKEN);
const handlersDir = (0, path_1.join)(__dirname, "./handlers");
(0, fs_1.readdirSync)(handlersDir).forEach((handler) => {
    require(`${handlersDir}/${handler}`)(telegramBot, discordClient, twitterClient);
});
discordClient.login(process.env.DISCORDTOKEN);
telegramBot.launch();
