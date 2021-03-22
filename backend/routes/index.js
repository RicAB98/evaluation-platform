var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/upload', function(req, res, next) {
  console.log(req.body)
  res.send("Received file");
});

router.post('/loadeval', function(req, res, next) {
  console.log(req.body)
  res.send("Loading eval");
});

module.exports = router;
