require('dotenv').config();
const express = require("express");
const joi = require("joi");
const mongoose = require("mongoose");

const customer = require('./routes/customers');
const genres = require("./routes/genres");

const app = express();

mongoose
  .connect(
    process.env['mongoURI'],
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());

app.use('/api/customers', customer);
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
