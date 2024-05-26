const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { getPlayerByID } = require("../../../modules/player/players.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
        .addNumberOption(option => 
            option.setName("id")
                .setDescription("The player ID")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for kicking the user")
                .setRequired(false)),
    async execute(interaction) {
        const id = interaction.options.getNumber("id");
        const reason = interaction.options.getString("reason") || "N/A";

        const player = getPlayerByID(id);

        if(player) {
            player.send(`You have been kicked from the server for reason: ${reason}`);
            player.kick(reason);

            const embed = new EmbedBuilder()
                .setColor(0xA312ED)
                .setDescription(`Successfully kicked ${id} for reason: ${reason}`);
            return interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xA312ED)
                .setDescription("Player not found.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}