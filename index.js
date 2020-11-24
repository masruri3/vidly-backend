const express = require("express");
const joi = require("joi");
const mongoose = require("mongoose");

const genres = require("./routes/genres");

const app = express();

app.use(express.json());

app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
