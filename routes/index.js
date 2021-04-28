var express = require("express");
var threeToFive = require("../data/three-to-five");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Questionaire", threeToFive });
});

module.exports = router;
