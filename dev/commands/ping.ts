import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with the pong"),

  async execute(interaction: CommandInteraction) {
    const replyMsg = await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    });

    const message: string =
      `API latency is **${interaction.client.ws.ping}ms**\n` +
      `Client ping: **${
        replyMsg.createdTimestamp - interaction.createdTimestamp
      }ms**`;

    interaction.editReply({ content: message });
  },
};

export default command;
