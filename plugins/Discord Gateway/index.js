const { getPlayersInWorld } = require("../../modules/player/players.js");

module.exports = {
    install: function() {
        const { Client, GatewayIntentBits, Events } = require("discord.js");
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        const utils = require("../../modules/utils.js");
        global.server.discord = client;

        const worlds = {
            "main": "1243967546034618542"
        }

        client.on(Events.ClientReady, () => {
            server.events.on("message", (message, client, rank) => {
                const channelID = worlds[client.world || "main"];

                if (channelID) {
                    function formatMessage(client, rank, message) {
                        const chatPrefix = rank.chatPrefix ? `${rank.chatPrefix} ` : '';
                        const senderInfo = client.nickname ? `${rank.revealID ? `[${client.id}]` : ''}${chatPrefix}${client.nickname}` : `${rank.revealID ? `[${client.id}]` : ''}${chatPrefix}<span class="id">Unknown</span>`;
                        
                        return `${senderInfo}: ${utils.sanitizeXSS(message)}`;
                    }

                    const formattedMessage = formatMessage(client, rank, message);

                    server.discord.channels.fetch(channelID).then(channel => {
                        if (channel) {
                            channel.send(`${formattedMessage}`);
                        }
                    }).catch(error => console.error(`Failed to fetch channel: ${error}`));
                }
            });
        });

        client.on(Events.MessageCreate, message => {
            if(message.author.bot) return;
            const worldKey = Object.keys(worlds).find(key => worlds[key] === message.channelId);

            if (worldKey) {
                let discordMessage = `<span class="discord">[D] ${message.author.username}</span>: `;
                if (message.content.trim() !== '') {
                    discordMessage += `${message.content}`;
                }

                if (message.attachments.size > 0) {
                    const attachments = Array.from(message.attachments.values()).map(attachment => `<img src="${attachment.url}" alt="Discord Attachment" style="max-width: 100%; height: auto;">`).join('');
                    discordMessage += `<details><summary>View ${message.attachments.size} Attachment(s)</summary>${attachments}</details>`;
                }

                if (discordMessage.trim() !== `<span class="discord">[D] ${message.author.username}</span>: `) {
                    server.io.to(worldKey).emit("message", discordMessage);
                }
            }
        });

        client.login(process.env.DISCORD_BOT_TOKEN);
    },
    name: "Discord Gateway",
    version: "1.0.0",
}