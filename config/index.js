const ENV_dev = require("./env.dev.js");
const ENV_prod = require("./env.prod.js");

if (process.env.NODE_ENV === "PRODUCTION") {
    module.exports = ENV_prod;
} else {
    module.exports = ENV_dev;
}