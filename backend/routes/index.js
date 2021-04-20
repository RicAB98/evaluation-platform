var express = require("express");
const db = require("../database/db.js");
var router = express.Router();

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

  queryPop = `select search_string, count(*) as n from fourdays where 
    time > '${startDate.getFullYear()}-${
    startDate.getMonth() + 1
  }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
    time < '${endDate.getFullYear()}-${
    endDate.getMonth() + 1
  }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
    group by search_string order by count(*) DESC LIMIT 10`;

  queryUns = `select search_string, count(*) as n from fourdays where page_number > 5 and
    time > '${startDate.getFullYear()}-${
    startDate.getMonth() + 1
  }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
    time < '${endDate.getFullYear()}-${
    endDate.getMonth() + 1
  }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
    group by search_string order by count(*) DESC LIMIT 10`;

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
    conn.query(queryPop, (err, results, fields) => {
      if (err) throw err;

      popResponse = results;

      conn.query(queryUns, (err, results, fields) => {
        if (err) throw err;

        UnsResponse = results;

        conn.query(
          `INSERT INTO evaluation (name, type, period, popular, unsuccessful, date) VALUES 
          ('${name}', '${type}', '${period}', '${JSON.stringify(
            popResponse
          )}', '${JSON.stringify(UnsResponse)}', '${date}')`,
          (err, results, fields) => {
            if (err) throw err;

            let response = {
              popular: popResponse,
              unsuccessful: UnsResponse,
            };

            res.send(response);
          }
        );
      });
    });

    conn.release();
  });
});

router.get("/loaddailyeval", function (req, res, next) {
  let date = new Date(req.query.date);
  let query = `SELECT popular, unsuccessful from daily_evaluation where 
                date = '${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}'`;

  console.log(query);

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

  db.getConnection((err, conn) => {
    conn.query(
      `SELECT period, date, popular, unsuccessful from evaluation where id = ${id}`,
      (err, results, fields) => {
        if (err) throw err;

        res.send(results);
        conn.release();
      }
    );
  });
});

router.get("/getevaluations", function (req, res, next) {
  db.getConnection((err, conn) => {
    conn.query("SELECT id,name from evaluation", (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/topqueries", function (req, res, next) {
  let startDate = new Date(req.query.startDate);
  let query = `select search_string, count(*) as n from fourdays where 
                 date = '${startDate.getFullYear()}-${
    startDate.getMonth() + 1
  }-${startDate.getDate()}' 
                 group by search_string order by count(*) DESC LIMIT 10`;

  if (req.query.endDate != null) {
    endDate = new Date(req.query.endDate);

    query = `select search_string, count(*) as n from fourdays where 
              time > '${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
              time < '${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
              group by search_string order by count(*) DESC LIMIT 10`;
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

  let query = `select search_string, count(*) as n from fourdays where 
                 page_number > 5 and
                 date = '${startDate.getFullYear()}-${
    startDate.getMonth() + 1
  }-${startDate.getDate()}' 
                 group by search_string order by count(*) DESC LIMIT 10`;

  if (req.query.endDate != null) {
    endDate = new Date(req.query.endDate);

    query = `select search_string, count(*) as n from fourdays where 
              page_number > 5 and
              time > '${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
              time < '${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
              group by search_string order by count(*) DESC LIMIT 10`;
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
  let query = req.query.query;

  db.getConnection((err, conn) => {
    conn.query(
      `select date_format(date, "%d-%m") as x, count(*) as y from fourdays group by search_string,date having search_string like '${query}'`,
      (err, results, fields) => {
        if (err) throw err;
        response = [
          {
            id: query,
            color: "hsl(181, 70%, 50%)",
            data: results,
          },
        ];

        res.send(response);
        conn.release();
      }
    );
  });
});

router.get("/queryTable", function (req, res, next) {
  let query = req.query.query;

  db.getConnection((err, conn) => {
    conn.query(
      `select page_number, mysql_id, count(*) as n from fourdays where search_string = '${query}' group by page_number, mysql_id order by page_number, mysql_id`,
      (err, results, fields) => {
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
      }
    );
  });
});

module.exports = router;
