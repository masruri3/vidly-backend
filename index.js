const config = require("config");
const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();

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
