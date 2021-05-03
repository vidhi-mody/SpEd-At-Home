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
  score: {
    math: Number,
    oral: Number,
    spelling: Number,
    handwriting: Number,
    inattentive: Number,
    hyperactiveImpulsive: Number,
  },
  parent: {
    childName: String,
    email: String,
    school: String,
    mobile: String,
    currentLearningEnvironment: {
      type: String,
      enum: ["Online", "Offline"],
    },
    applicationsLaptop: String,
    hasMSApplications: {
      type: String,
      enum: ["Yes", "No"],
    },
    facebook: {
      type: String,
      enum: ["Yes", "No"],
    },
    whatsapp: {
      type: String,
      enum: ["Yes", "No"],
    },
    applicationsPhone: String,
    proficiencyInstagram: String,
    englishLanguage: {
      type: String,
      enum: ["Both", "Oral", "Written"],
    },
    technologicalAvailability: String,
    internetAvailability: String,
    parentalAvailability: String,
    parentalAvailabilitySource: String,
    parentalProficiency: String,
    parentalProficiencyHours: String,
    childProficiency: String,
    currentIssues: String,
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
