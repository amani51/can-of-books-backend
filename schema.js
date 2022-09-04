"use strict";
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
});

const Book = mongoose.model("Book", BookSchema);

module.exports=Book