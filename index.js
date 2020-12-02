require("express-async-errors");
const config = require("config");
const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const winston = require("winston");
require("winston-mongodb");

const app = express();

require("./startup/routes")(app);
require("./startup/db")();

process.on("uncaughtException", (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: config.get("mongoURI"),
    level: "error",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  })
);

if (!config.has("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

if (!config.has("mongoURI")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
