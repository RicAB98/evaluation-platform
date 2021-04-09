var express = require('express');
//const { response } = require('../app.js');
const db = require('../database/db.js');
var router = express.Router();

/* GET home page. */
router.post('/upload', function(req, res, next) {
  console.log(req.body)
  res.send("Received file");
});

router.post('/runeval', function(req, res, next) {
  console.log(req.body)
  res.send("Loading eval");
});

router.get('/loadeval/:id', function(req, res, next) {
  let id = req.params.id

  res.send([
    [id, "Niger"],
    [id, "Curaçao"],
    [id, "Netherlands"],
    [id, "Korea, South"],
    [id, "Malawi"],
    [id, "Chile"]
  ]);
});

router.get('/geteval', function(req, res, next) {
  db.getConnection((err, conn) => {
    conn.query('select * from Evaluation', (error, results, fields) => {
      if (err) throw err
  
      evaluations = []

      for (r of results)
       evaluations.push([r["id"], r["name"]])

      res.send(evaluations);
      conn.release();
    });
  });

});


module.exports = router;
