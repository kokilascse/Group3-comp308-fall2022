const dotenv = require("dotenv").config;
const paths = require("./paths");

dotenv({ path: paths.envFile });

const isProduction = process.env.NODE_ENV === "production";

const port = process.env.PORT || 3001;

const db = process.env.DB || "mongodb+srv://admin:admin123@cluster1.dtodmta.mongodb.net/?retryWrites=true&w=majority";

const jwtSecret = process.env.JWT_SECRET || "eXaMpLeSeCrEt";

const jwtDuration = process.env.JWT_MAX_AGE || (isProduction ? "7d" : "1h");

module.exports = {
  isProduction,
  port,
  db,
  jwtSecret,
  jwtDuration,
};
