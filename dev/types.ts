import {
  Collection,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export interface SlashCommand {
  data: SlashCommandBuilder | any;
  execute: (interaction: CommandInteraction) => void;
}

export interface Event {
  name: string;
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
      GUILDID: string;
      DEFAULTCHANNELID: string;
      NEWSCHANNELID: string;
      STREAMCHANNELID: string;
      YOUTUBECHANNELID: string;
    }
  }
}
