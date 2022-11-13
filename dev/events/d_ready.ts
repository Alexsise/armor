import { Client } from "discord.js";
import { Event } from "../types";

const event: Event = {
  name: "ready",
  once: true,
  async execute(discordClient: Client) {
    const bot = discordClient.user;
    console.log(`Client is Ready! Logged in as ${bot!.tag}`);
  },
};

export default event;
