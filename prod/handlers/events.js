"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
module.exports = (telegramBot, discordClient, twitterClient) => __awaiter(void 0, void 0, void 0, function* () {
    // const stream = await twitterClient.v2.searchStream({
    //   "tweet.fields": ["referenced_tweets", "author_id"],
    //   expansions: ["referenced_tweets.id"],
    // });
    // stream.autoReconnect = true;
    const eventsFolderPath = (0, path_1.join)(__dirname, "../events");
    const eventsFiles = (0, fs_1.readdirSync)(eventsFolderPath);
    for (const file of eventsFiles) {
        const filePath = (0, path_1.join)(eventsFolderPath, file);
        const event = require(filePath).default;
        if (file.startsWith("d_")) {
            if (event.once)
                discordClient.once(event.name, (...args) => event.execute(...args));
            else
                discordClient.on(event.name, (...args) => event.execute(...args));
        }
        else if (file.startsWith("tg_")) {
            telegramBot.on(event.name, (ctx) => event.execute(ctx, telegramBot, discordClient));
        }
        else if (file.startsWith("tw_")) {
            // stream.on(event.name as ETwitterStreamEvent, (...args) =>
            //   event.execute(...args, discordClient)
            // );
        }
    }
});
