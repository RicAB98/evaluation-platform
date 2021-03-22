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

router.get('/geteval', function(req, res, next) {
  res.send([
    [1, "Niger"],
    [2, "Curaçao"],
    [3, "Netherlands"],
    [4, "Korea, South"],
    [5, "Malawi"],
    [6, "Chile"]
  ]);
});


module.exports = router;
