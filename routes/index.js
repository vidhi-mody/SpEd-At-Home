const express = require("express");
const User = require("../models/user");
const util = require("../util");
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
  const user = req.session.user;
  const { partnerOrganization, referee, firstName, lastName, age, reasonForReferral } = req.body;

  await User.updateOne(
    { userId: user.userId },
    {
      partnerOrganization,
      referee,
      firstName,
      lastName,
      age,
      reasonForReferral,
    }
  );

  if (reasonForReferral.includes("academic")) {
    res.redirect("/academic");
  } else {
    res.redirect("/parent-proficiency");
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

  let questions = util.getQuestionsByAge(user.age);

  res.render("academic-details", {
    ...context,
    user,
    questions,
    academic: new Set(user.academic),
  });
});

router.post("/academic-details", async (req, res, next) => {
  const { user } = req.session;
  const academic = new Set(user.academic);

  const { score, answers } = util.populateAnswers(user.age, academic, req.body);

  await User.updateOne(
    { userId: user.userId },
    {
      score,
      answers,
    }
  );

  res.redirect("/parent-proficiency");
});

router.get("/thank-you", async (req, res, next) => {
  req.session.destroy();
  res.render("thank-you", {
    ...context,
  });
});

router.get("/parent-proficiency", async (req, res, next) => {
  const { user } = req.session;

  res.render("parent-proficiency", {
    ...context,
    user,
  });
});

router.post("/parent-proficiency", async (req, res, next) => {
  const { user } = req.session;

  await User.updateOne(
    {
      userId: user.userId,
    },
    {
      parent: {
        ...req.body,
      },
      completed: true
    }
  );

  res.redirect("/thank-you");
});

module.exports = router;
