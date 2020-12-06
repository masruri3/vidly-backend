const config = require("config");
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console({
      level: "info",
      colorize: true,
      prettyPrint: true,
    })
  );
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
