import {
  Collection,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { ETwitterStreamEvent } from "twitter-api-v2";

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void;
}

export interface Event {
  name: string | ETwitterStreamEvent;
  once?: boolean | false;
  execute: (...args: any) => void;
}

export interface hashTagOptions {
  symbol?: boolean;
  unique?: boolean;
  caseSensitive?: boolean;
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORDTOKEN: string;
      TELEGRAMTOKEN: string;
      TWITTERTOKEN: string;
      GUILDID: string;
      CLIENTID: string;
      DEFAULTCHANNELID: string;
      NEWSCHANNELID: string;
      STREAMCHANNELID: string;
      YOUTUBECHANNELID: string;
    }
  }
}

