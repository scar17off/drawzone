module.exports = {
    install: function() {
        const app = require("express")();
        const OJS = require("./OJS.js");
        const { getWorldByName } = require("../../modules/world/worldManager.js");
        const chunkManager = require("../../modules/world/chunkManager.js");
        const wsUrl = "wss://b18ba020-1709-4f86-a87d-ac796cd5d2ef-00-5zbgiz9oh807.riker.replit.dev/";// "wss://ourworldofpixels.com/ws";
        const originUrl = "https://b18ba020-1709-4f86-a87d-ac796cd5d2ef-00-5zbgiz9oh807.riker.replit.dev/";// "https://ourworldofpixels.com";

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'https://ourworldofpixels.com');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-token');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            next();
        });

        const settings = {
            crossChunks: {
                radius: 2,
            },
            worldName: "main"
        }

        const world = getWorldByName(settings.worldName);
        const bot = new OJS.Client({
            ws: wsUrl,
            origin: originUrl,
            world: settings.worldName
        });

        bot.on("pixel", (x, y, color) => {
            chunkManager.set_pixel(settings.worldName, x, y, color);
            getWorldByName(settings.worldName).addUpdate({ type: "newPixel", x, y, color });
        });

        bot.on("update", async player => {
            world.addUpdate({ type: "playerMoved", id: player.id, x: player.x, y: player.y });

            const chunkX = Math.floor(player.x / 16);
            const chunkY = Math.floor(player.y / 16);

            const chunkData = {};
            for (let dx = -settings.crossChunks.radius; dx <= settings.crossChunks.radius; dx++) {
                for (let dy = -settings.crossChunks.radius; dy <= settings.crossChunks.radius; dy++) {
                    const chunk = await bot.world.requestChunk(player.x + dx * 16, player.y + dy * 16, true);
                    const formattedChunk = Array.from({ length: 16 }, (_, i) => 
                        Array.from({ length: 16 }, (_, j) => {
                            const index = (j * 16 + i) * 3;
                            return [chunk[index], chunk[index + 1], chunk[index + 2]];
                        })
                    );
                    const chunkKey = `${chunkX + dx},${chunkY + dy}`;
                    chunkData[chunkKey] = { data: formattedChunk, protected: chunkManager.get_protection("main", chunkX + dx, chunkY + dy) };

                    chunkManager.set_chunkdata(settings.worldName, chunkX + dx, chunkY + dy, formattedChunk);
                }
            }

            world.addUpdate({ type: "chunkLoaded", updates: chunkData });
        });

        app.get("/", (req, res) => {
            const xToken = req.headers['x-token'];

            bot.net.ws.send("CaptchA" + xToken);
        });

        app.listen(8080);
    },
    name: "OWOP Crossplay",
    version: "1.0.0"
}

/*

OWOP CAPTCHA SCRIPT

Run this script in browser after running the server:

const renderCaptcha = () => {
    return new Promise(resolve => {
        const captchaContainer = document.createElement('div');
        captchaContainer.style.position = 'fixed';
        captchaContainer.style.top = '50%';
        captchaContainer.style.left = '50%';
        captchaContainer.style.transform = 'translate(-50%, -50%)';
        captchaContainer.style.zIndex = '101';
        captchaContainer.style.backgroundColor = '#333';
        captchaContainer.style.padding = '20px';
        captchaContainer.style.borderRadius = '10px';
        document.body.appendChild(captchaContainer);

        if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.render === 'function') {
            grecaptcha.render(captchaContainer, {
                theme: 'dark',
                sitekey: '6LcgvScUAAAAAARUXtwrM8MP0A0N70z4DHNJh-KI',
                callback: token => {
                    fetch('http://localhost:8080', {
                        method: 'GET',
                        headers: {
                            'x-token': token
                        }
                    })
                    resolve(token);
                }
            });
        } else {
            console.error('grecaptcha is not defined or grecaptcha.render is not a function');
        }
    });
}

*/