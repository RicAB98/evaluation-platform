var express = require("express");
const db = require("../database/db.js");
var router = express.Router();
const queryUtil = require("../utils/query.js");

router.post("/runeval", function (req, res, next) {
  if (req.body.period == null) {
    res.send("Missing parameters");
    return;
  }

  let name = req.body.name;
  //let type = req.body.type["name"]
  let type = "All";
  let period = req.body.period["name"].replace("Last", "Previous");
  let startDate = new Date(req.body.startDate);
  let endDate = new Date(req.body.endDate);

  popularQuery = queryUtil.rangePopular(startDate, endDate);
  unsuccessfulQuery = queryUtil.rangeUnsuccessful(startDate, endDate);

  let popResponse;
  let UnsResponse;
  let date =
    endDate.getFullYear() +
    "-" +
    endDate.getMonth() +
    1 +
    "-" +
    endDate.getDate() +
    " " +
    endDate.getHours() +
    ":" +
    endDate.getMinutes() +
    ":" +
    endDate.getSeconds();

  db.getConnection((err, conn) => {
    conn.query(popularQuery, (err, results, fields) => {
      if (err) throw err;

      popResponse = results;

      conn.query(unsuccessfulQuery, (err, results, fields) => {
        if (err) throw err;

        UnsResponse = results;

        insertQuery = queryUtil.insertEvaluation(
          name,
          type,
          period,
          popResponse,
          UnsResponse,
          date
        );

        conn.query(insertQuery, (err, results, fields) => {
          if (err) throw err;

          let response = {
            popular: popResponse,
            unsuccessful: UnsResponse,
          };

          res.send(response);
        });
      });
    });

    conn.release();
  });
});

router.get("/loaddailyeval", function (req, res, next) {
  let date = new Date(req.query.date);

  let query = queryUtil.loadDailyEvaluation(date);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/loadeval", function (req, res, next) {
  let id = req.query.id;

  let query = queryUtil.loadEvaluation(id);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/getevaluations", function (req, res, next) {
  let query = queryUtil.getEvaluations();

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/topqueries", function (req, res, next) {
  let startDate = new Date(req.query.startDate);
  let query = queryUtil.singleDayPopular(startDate);

  if (req.query.endDate != null) {
    endDate = new Date(req.query.endDate);

    query = queryUtil.rangePopular(startDate, endDate);
  }

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/unsuccessfulqueries", function (req, res, next) {
  
  let startDate = new Date(req.query.startDate);

  let query = queryUtil.singleDayUnsuccessful(startDate);

  if (req.query.endDate != null) {
    endDate = new Date(req.query.endDate);

    query = queryUtil.rangeUnsuccessful(startDate, endDate);
  }

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/queryGraph", function (req, res, next) {
  let string = req.query.string;

  let query = queryUtil.getSeachesPerDay(string);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;
      response = [
        {
          id: string,
          color: "hsl(181, 70%, 50%)",
          data: results,
        },
      ];

      res.send(response);
      conn.release();
    });
  });
});

router.get("/queryTable", function (req, res, next) {
  let string = req.query.string;

  query = queryUtil.getStringClicks(string);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      let sum = 0;
      let processedResults = [];

      for (r of results) {
        if (r.page_number <= 1) processedResults.push(r);
        else sum += r.n;
      }

      processedResults.push({ page_number: "20+", mysql_id: "", n: sum });

      res.send(processedResults);
      conn.release();
    });
  });
});

module.exports = router;
