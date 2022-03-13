const mongoose = require("mongoose");

const analysisShema = new mongoose.Schema({
  login: [
    {
      type: Date,
    },
  ],
  post: [
    {
      type: Date,
    },
  ],
  comment: [
    {
      type: Date,
    },
  ],
  like: [
    {
      type: Date,
    },
  ],
});

module.exports = mongoose.model("Analysis", analysisShema);
