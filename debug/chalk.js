const chalk = require("chalk");

const error = chalk.bold.red;
const warning = chalk.keyword("orange");
const log = chalk.bgWhite.black();

module.exports = { error, warning, log };
