const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  age: {
    type: String,
    enum: ["3-5", "6-8", "9-12"],
  },
  reasonForReferral: [
    {
      type: String,
      enum: ["academic", "behavioural", "speech"],
    },
  ],
  academic: [
    {
      type: String,
    },
  ],
  answers: mongoose.Schema.Types.Mixed,
  score: Number,
  parentProficiency: {
    childName: String,
    email: String,
    school: String,
    mobile: String,
  },
});

module.exports = mongoose.model("User", userSchema);
