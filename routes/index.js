const express = require("express");
const threeToFive = require("../data/three-to-five");
const SixToEight = require("../data/six-to-eight");
const User = require("../models/user");
const sixToEight = require("../data/six-to-eight");
const router = express.Router();

const context = {
  title: "Questionaire",
};

/* GET home page. */
router.get("/", function (req, res, next) {
  const { user } = req.session;
  res.render("index", { ...context, user });
});

router.post("/general", async function (req, res, next) {
  console.log(req.body);
  const user = req.session.user;
  const { firstName, lastName, age, reasonForReferral } = req.body;

  await User.updateOne(
    { userId: user.userId },
    {
      firstName,
      lastName,
      age,
      reasonForReferral,
    }
  );

  if (reasonForReferral.includes("academic")) {
    res.redirect("/academic");
  } else {
    res.redirect("/thank-you");
  }
});

router.get("/academic", (req, res, next) => {
  res.render("academic", {
    ...context,
  });
});

router.post("/academic", async (req, res, next) => {
  const { user } = req.session;
  const { academic } = req.body;

  await User.updateOne(
    { userId: user.userId },
    {
      academic,
    }
  );

  res.redirect("/academic-details");
});

router.get("/academic-details", async (req, res, next) => {
  const { user } = req.session;

  let questions = threeToFive;

  switch (user.age) {
    case "3-5":
      questions = threeToFive;
      break;
    case "6-8":
      questions = sixToEight;
      break;
  }

  res.render("academic-details", {
    ...context,
    user,
    questions,
    academic: new Set(user.academic),
  });
});

module.exports = router;
