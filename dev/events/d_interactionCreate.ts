import { Event, SlashCommand } from "../types";
import { Interaction } from "discord.js";

const event: Event = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      const command: SlashCommand = interaction.client.commands.get(
        interaction.commandName
      )!;

      command.execute(interaction);
    }
  },
};

export default event;
