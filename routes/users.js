const express = require("express");
const router = express.Router();

const { User, validate } = require("../models/user");

router.post("/", async (req, res) => {
  const genre;

  res.send(genre);
});

module.exports = router;
