const config = require("config");
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
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
};
