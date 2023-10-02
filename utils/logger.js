const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const date = new Date();


const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
const logDir = path.join(__dirname, "logs")
// create directory if not exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const logFile = path.join(__dirname, "logs", `${filename}`);


const logLevels = { debug: "DEBUG", info: "INFO", warning: "WARNING", error: "ERROR", };

const log = (level, message='', spanId = '') => {
    const timestamp = new Date();
    const id = spanId ? '...' : uuidv4();
    const logEntry = `${id} | ${timestamp} | ${level} | ${message} | `;
    fs.appendFile(logFile, logEntry + "\n", (err) => { if (err) { console.error(err); } });
};




module.exports = { log, logLevels };