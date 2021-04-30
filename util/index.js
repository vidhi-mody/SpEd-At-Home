const adhd = require("../data/adhd");
const threeToFive = require("../data/three-to-five");
const sixToEight = require("../data/six-to-eight");
const nineToTwelve = require("../data/nine-to-twelve");

const getQuestionsByAge = (age) => {
  let questions;

  switch (age) {
    case "3-5":
      questions = threeToFive;
      break;
    case "6-8":
      questions = sixToEight;
      break;
    case "9-12":
      questions = nineToTwelve;
      break;
    default:
      questions = threeToFive;
  }

  return {
    ...questions,
    ...adhd,
  };
};

const populateAnswers = (age, academics, body) => {
  const score = {
    math: 0,
    reading: 0,
    handwriting: 0,
    spelling: 0,
    oral: 0,
    inattentive: 0,
    hyperactiveImpulsive: 0,
  };

  const answers = {};
  const questions = getQuestionsByAge(age);

  if (academics.has("adhd-add")) {
    academics.add("inattentive");
    academics.add("hyperactiveImpulsive");
    academics.delete("adhd-add");
  }

  if (academics.has("language")) {
    academics.add("oral");
    academics.add("spelling");
    academics.add("reading");
    academics.delete("language");
  }

  for (const el of academics) {
    answers[el] = [];

    for (let i = 0; i < questions[el].length; i++) {
      if (questions[el][i] !== threeToFive.handwriting[0]) {
        if (el === "hyperactiveImpulsive" || el === "inattentive") {
          score[el] += body[`${el}-${i + 1}`] === "Yes" ? 1 : 0;
        } else {
          score[el] += body[`${el}-${i + 1}`] === "Yes" ? 0 : 1;
        }
      }

      answers[el].push({
        question: questions[el][i],
        response: body[`${el}-${i + 1}`] == "Yes",
      });
    }
  }

  return { score, answers };
};

module.exports = {
  getQuestionsByAge,
  populateAnswers,
};
