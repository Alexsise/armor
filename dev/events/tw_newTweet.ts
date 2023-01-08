import { ETwitterStreamEvent, TweetV2SingleStreamResult } from "twitter-api-v2";
import { Client } from "discord.js";
import { Event } from "../types";

const event: Event = {
  name: ETwitterStreamEvent.Data,
  once: true,
  async execute(tweet: TweetV2SingleStreamResult, discordClient: Client) {
    console.log(tweet);
  },
};

export default event;
