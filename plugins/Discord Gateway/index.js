module.exports = {
    install: function() {
        const formatMessage = require("../../modules/utils.js").formatMessage;
        const fs = require("fs");
        const { Client, GatewayIntentBits, Events } = require("discord.js");
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        global.server.discord = client;

        const commandFiles = fs.readdirSync("./plugins/Discord Gateway/commands", { recursive: true }).filter(file => file.endsWith(".js"));    
        const commands = new Map();
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            commands.set(command.data.name, command);
        }

        const worlds = {
            "main": "1243967546034618542"
        }

        client.on(Events.ClientReady, () => {
            server.events.on("message", (message, client, rank) => {
                const channelID = worlds[client.world];

                if(channelID) {
                    const formattedMessage = formatMessage(client, rank, message, false);

                    server.discord.channels.fetch(channelID).then(channel => {
                        if(channel) {
                            channel.send(`${formattedMessage}`);
                        }
                    }).catch(error => console.error(`Failed to fetch channel: ${error}`));
                }
            });
        });

        client.on(Events.MessageCreate, message => {
            if(message.author.bot) return;
            const worldKey = Object.keys(worlds).find(key => worlds[key] === message.channelId);

            if(worldKey) {
                let discordMessage = `<span class="discord">[D] ${message.author.username}</span>: `;
                if(message.content.trim() !== '') {
                    discordMessage += `${message.content}`;
                }

                if(message.attachments.size > 0) {
                    const attachments = Array.from(message.attachments.values()).map(attachment => `<img src="${attachment.url}" alt="Discord Attachment" style="max-width: 100%; height: auto;">`).join('');
                    discordMessage += `<details><summary>View ${message.attachments.size} Attachment(s)</summary>${attachments}</details>`;
                }

                if(discordMessage.trim() !== `<span class="discord">[D] ${message.author.username}</span>: `) {
                    server.io.to(worldKey).emit("message", discordMessage);
                }
            }
        });

        client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isCommand()) return;
            
            const { commandName } = interaction;

            const command = commands.get(commandName);
            if (!command) return;

            await command.execute(interaction);
        });

        client.login(process.env.DISCORD_BOT_TOKEN);
    },
    name: "Discord Gateway",
    version: "1.0.0",
}