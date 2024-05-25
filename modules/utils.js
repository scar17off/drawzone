const chalk = require("chalk");

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
}
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

const sanitizeXSS = input => !input ? input : input.replace(/[&<>"'/]/g, (match) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'})[match] || match);

function convertTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    let hours = Math.floor(minutes / 60);
    minutes %= 60;
    let days = Math.floor(hours / 24);
    hours %= 24;
    let milliseconds = Math.floor((seconds % 1) * 1000);

    return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${sec ? `${sec}s` : ""}${milliseconds ? ` ${milliseconds}ms` : ""}`;
}

/**
 * Logs messages with a specified type.
 * @param {string} type - The type of the log (INFO, WARN, ERROR, DEBUG, AUTH, USERS).
 * @param {...string} message - The messages to log.
 */
function log(type, ...message) {
    type = type.toUpperCase();

    const date = new Date();
    let typeColor;
    switch (type) {
        case "INFO":
            typeColor = chalk.blue;
            break;
        case "WARN":
            typeColor = chalk.yellow;
            break;
        case "ERROR":
            typeColor = chalk.red;
            break;
        default:
            typeColor = chalk.blue;
            break;
    }

    const formattedMessage = message.join(' ');
    const logMessage = `${typeColor(`[${date.timeNow()} ${type}]:`)} ${chalk.white(formattedMessage)}`;

    console.log(logMessage);
}

module.exports = {
    sanitizeXSS,
    convertTime,
    log
}