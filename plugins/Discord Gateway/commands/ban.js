const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { getPlayerByID } = require('../../../modules/utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .addNumberOption(option => 
            option.setName('id')
                .setDescription('The player ID')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for banning the user')
                .setRequired(false)),
    async execute(interaction) {
        const id = interaction.options.getUser('id');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const player = getPlayerByID(id);

        // TODO: Implement banning
    }
}