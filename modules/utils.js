const chalk = require("chalk");

/**
 * Extends Date prototype to format the current date as DD-MM-YYYY.
 * @returns {string} - The formatted date string.
 */
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
}

/**
 * Extends Date prototype to format the current time as HH:MM:SS.
 * @returns {string} - The formatted time string.
 */
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

/**
 * Sanitizes input to prevent XSS attacks by escaping HTML special characters.
 * @param {string} input - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
const sanitizeXSS = input => !input ? input : input.replace(/[&<>"'/]/g, (match) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'})[match] || match);
/**
 * Converts seconds to a formatted string.
 * @param {number} seconds - The number of seconds to convert.
 * @returns {string} - The formatted string.
 */
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

/**
 * Formats a message with the sender's information and the message itself.
 * @param {object} client - The client object.
 * @param {object} rank - The rank object.
 * @param {string} message - The message to format.
 * @param {boolean} [html=true] - Whether to include HTML in the output.
 * @returns {string} - The formatted message.
 */
function formatMessage(client, rank, message, html = true) {
    const chatPrefix = rank.chatPrefix ? `${rank.chatPrefix} ` : '';
    const idDisplay = rank.revealID ? `[${client.id}] ` : '';
    const senderInfo = client.nickname ? `${idDisplay}${chatPrefix}${client.nickname}` : `${idDisplay}${chatPrefix}`;
    
    if (html) {
        const senderHtml = `<span class="rank-${rank.id}">${senderInfo}</span>`;
        return `${senderHtml}: ${sanitizeXSS(message)}`;
    } else {
        return `${senderInfo}: ${message}`;
    }
}

module.exports = {
    sanitizeXSS,
    convertTime,
    log,
    formatMessage
}