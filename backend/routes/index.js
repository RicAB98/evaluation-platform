var express = require("express");
const db = require("../database/db.js");
var router = express.Router();
const queryUtil = require("../utils/query.js");
const { buildPageInformation } = require("../utils/utils");
const utils = require("../utils/utils");

router.post("/runeval", function (req, res, next) {
  /*if (req.body.period == null) {
    res.send("Missing parameters");
    return;
  }*/

  let name = req.body.name;
  //let type = req.body.type["name"]
  let type = "All";
  let startDate = new Date(req.body.startDate);
  let endDate = new Date(req.body.endDate);

  popularQueriesQuery = queryUtil.rangePopularQueries(startDate, endDate);
  unsuccessfulQuery = queryUtil.rangeUnsuccessful(startDate, endDate);
  popularPagesQuery = queryUtil.rangePopularPages(startDate, endDate);

  let popularQueriesResponse;
  let unsuccessfulResponse;
  let popularPagesResponse;

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds()
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    endDate.getSeconds()
  );

  if (name == "")
    name =
      "EVAL_" +
      startDate.getFullYear() +
      startDate.getMonth() +
      startDate.getDate() +
      "-" +
      startDate.getHours() +
      startDate.getMinutes() +
      startDate.getSeconds() +
      "_" +
      endDate.getFullYear() +
      endDate.getMonth() +
      endDate.getDate() +
      "-" +
      endDate.getHours() +
      endDate.getMinutes() +
      endDate.getSeconds();

  startDate =
    startDate.getFullYear() +
    "-" +
    startDate.getMonth() +
    "-" +
    startDate.getDate() +
    " " +
    startDate.getHours() +
    ":" +
    startDate.getMinutes() +
    ":" +
    startDate.getSeconds();

  endDate =
    endDate.getFullYear() +
    "-" +
    endDate.getMonth() +
    "-" +
    endDate.getDate() +
    " " +
    endDate.getHours() +
    ":" +
    endDate.getMinutes() +
    ":" +
    endDate.getSeconds();

  db.getConnection((err, conn) => {
    conn.query(popularQueriesQuery, (err, results, fields) => {
      if (err) throw err;

      popularQueriesResponse = results;

      conn.query(unsuccessfulQuery, (err, results, fields) => {
        if (err) throw err;

        unsuccessfulResponse = results;

        conn.query(popularPagesQuery, (err, results, fields) => {
          if (err) throw err;

          popularPagesResponse = results;

          insertQuery = queryUtil.insertEvaluation(
            name,
            type,
            popularQueriesResponse,
            unsuccessfulResponse,
            popularPagesResponse,
            startDate,
            endDate
          );

          conn.query(insertQuery, (err, results, fields) => {
            if (err) throw err;

            let response = {
              popularQueries: popularQueriesResponse,
              unsuccessfulQueries: unsuccessfulResponse,
              popularPages: popularPagesResponse,
            };

            res.send(response);
          });
        });
      });
    });

    conn.release();
  });
});

router.post("/runeval2", function (req, res, next) {
  let startDate = new Date(req.body.startDate);
  let endDate = new Date(req.body.endDate);
  let formatedStartDate = null;

  if (endDate.getFullYear() == 1970) {
    startDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      0,
      0,
      0
    );

    formatedStartDate =
      startDate.getFullYear() +
      "-" +
      startDate.getMonth() +
      "-" +
      startDate.getDate() +
      " 00:00:00";
  } else {
    startDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
      0
    );

    formatedStartDate =
      startDate.getFullYear() +
      "-" +
      startDate.getMonth() +
      "-" +
      startDate.getDate() +
      " " +
      startDate.getHours() +
      ":" +
      startDate.getMinutes() +
      ":00";
  }

  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  formatedEndDate =
    endDate.getFullYear() +
    "-" +
    endDate.getMonth() +
    "-" +
    endDate.getDate() +
    " " +
    endDate.getHours() +
    ":" +
    endDate.getMinutes() +
    ":00";

  let getEvaluationQuery = queryUtil.loadEvaluationByDate(startDate, endDate);
  let popularQueriesQuery = queryUtil.popularQueries(startDate, endDate, 10);
  let unsuccessfulQuery = queryUtil.unsuccessfulQueries(startDate, endDate, 10);
  let popularPagesQuery = queryUtil.popularPages(startDate, endDate, 10);

  db.getConnection((err, conn) => {
    conn.query(getEvaluationQuery, (err, results, fields) => {
      if (err) throw err;

      if (results.length != 0) {
        res.send({
          id: results[0].id,
          popularQueries: JSON.parse(results[0].popularQueries),
          unsuccessfulQueries: JSON.parse(results[0].unsuccessfulQueries),
          popularPages: JSON.parse(results[0].popularPages),
        });
        return;
      }

      conn.query(
        `${popularQueriesQuery}; ${unsuccessfulQuery}; ${popularPagesQuery}`,
        (err, results) => {
          if (err) throw err;

          let popularQueriesResponse = results[0];
          let unsuccessfulResponse = results[1];
          let popularPagesResponse = results[2];

          let temporaryArray = new Array();

          for (let r of popularPagesResponse)
            temporaryArray.push(buildPageInformation(r));

          popularPagesResponse = temporaryArray;

          insertQuery = queryUtil.insertEvaluation(
            popularQueriesResponse,
            unsuccessfulResponse,
            popularPagesResponse,
            formatedStartDate,
            formatedEndDate
          );

          conn.query(insertQuery, (err, results) => {
            if (err) throw err;

            res.send({
              id: results.insertedId,
              popularQueries: popularQueriesResponse,
              unsuccessfulQueries: unsuccessfulResponse,
              popularPages: popularPagesResponse,
            });
          });
        }
      );
    });
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
  let type = req.query.type;
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  switch (type) {
    case "1":
      getDataQuery = queryUtil.popularQueries(startDate, endDate, 10000000000);
      break;

    case "2":
      getDataQuery = queryUtil.unsuccessfulQueries(
        startDate,
        endDate,
        10000000000
      );
      break;

    case "3":
      getDataQuery = queryUtil.popularPages(startDate, endDate, 10000000000);
      break;
  }

  db.getConnection((err, conn) => {
    conn.query(getDataQuery, (err, results, fields) => {
      if (err) throw err;

      if (type == "3") {
        let temporaryArray = new Array();

        for (let r of results) temporaryArray.push(buildPageInformation(r));

        results = temporaryArray;
      }

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
  let query = queryUtil.singleDayPopularQueries(startDate);

  if (req.query.endDate != null) {
    endDate = new Date(req.query.endDate);

    query = queryUtil.rangePopularQueries(startDate, endDate);
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

router.get("/toppages", function (req, res, next) {
  let startDate = new Date(req.query.startDate);
  let query = queryUtil.singleDayPopularPages(startDate);

  if (req.query.endDate != null) {
    endDate = new Date(req.query.endDate);

    query = queryUtil.rangePopularPages(startDate, endDate);
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
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  let query = queryUtil.getSearchesPerDay(string, startDate, endDate);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      dates = new Array();
      clicks = new Array();

      for (r of results) {
        dates.push(r.x);
        clicks.push(r.y);
      }

      response = {
        string: string,
        color: "hsl(181, 70%, 50%)",
        dates: dates,
        clicks: clicks,
      };

      res.send(response);
      conn.release();
    });
  });
});

router.get("/clicksranks", function (req, res, next) {
  let string = req.query.string;
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  query = queryUtil.getClickRanks(string, startDate, endDate);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      let processedResults = [];
      let firstPage = new Array(10).fill(0);
      let secondPage = [];
      let otherPagesClicks = 0;

      for (r of results) {
        if (r.page_number <= 1) firstPage[r.mysql_id - 1] += r.n;
        else if (r.page_number == 2) secondPage.push(r);
        else otherPagesClicks += r.n;
      }

      for (s in firstPage) {
        if (firstPage[s] != 0)
          processedResults.push({
            page_number: 1,
            mysql_id: Number(s) + 1,
            n: firstPage[s],
          });
      }

      processedResults = processedResults.concat(secondPage);

      if (otherPagesClicks > 0)
        processedResults.push({
          page_number: "20+",
          mysql_id: "",
          n: otherPagesClicks,
        });

      res.send(processedResults);
      conn.release();
    });
  });
});

router.get("/querysummary", function (req, res, next) {

  let string = req.query.string;
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes()
  );
  
  let nextDay = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  nextDay.setDate(startDate.getDate() + 1);

  let last24Hours = new Date(startDate - 60000 * 60 * 24);
  let last7Days = new Date(startDate - 60000 * 60 * 24 * 8);

  if (endDate != "Invalid Date")
  {
    endDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()    
    );

    nextDay = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

    nextDay.setDate(endDate.getDate() + 1);
  }

  let query = queryUtil.getQuerySummary(
    string, 
    startDate,
    endDate,
    nextDay,
    last24Hours,
    last7Days
  );

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/pagesperrank", function (req, res, next) {
  let page = req.query.page;
  let mysql_id = req.query.mysql_id;
  let string = req.query.string;
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  let query = queryUtil.getPagesByStringRank(
    page,
    mysql_id,
    string,
    startDate,
    endDate
  );

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      for (r in results) {
        let row = results[r];

        results[r] = utils.buildPageInformation(row);
      }

      res.send(results);

      conn.release();
    });
  });
});

router.get("/unsuccessfulsessions", function (req, res, next) {
  let string = req.query.string;
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  let query = queryUtil.getUnsuccessfulSessions(string, startDate, endDate);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results[0]);
      conn.release();
    });
  });
});

router.get("/pagesrank", function (req, res, next) {
  let tp_item = req.query.tp_item;
  let fk_item = req.query.fk_item;
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  let query = queryUtil.getPagesRank(tp_item, fk_item, startDate, endDate);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      let link =
        "https://www.zerozero.pt/" + utils.tp_item_list[tp_item] + fk_item;

      let processedResults = [];
      let firstPage = new Array(10).fill(0);
      let secondPage = [];
      let otherPagesClicks = 0;

      for (r of results) {
        if (r.page_number <= 1) firstPage[r.mysql_id - 1] += r.n;
        else if (r.page_number == 2) secondPage.push(r);
        else otherPagesClicks += r.n;
      }

      for (s in firstPage) {
        if (firstPage[s] != 0)
          processedResults.push({
            page_number: 1,
            mysql_id: Number(s) + 1,
            n: firstPage[s],
          });
      }

      processedResults = processedResults.concat(secondPage);

      if (otherPagesClicks > 0)
        processedResults.push({
          page_number: "20+",
          mysql_id: "",
          n: otherPagesClicks,
        });

      tp_item == 18 && results.length != 0 && (link = results[0].link);

      let response = {
        link: link,
        rank: processedResults,
      };

      res.send(response);
      conn.release();
    });
  });
});

router.get("/stringsperrank", function (req, res, next) {
  let page = req.query.page;
  let mysql_id = req.query.mysql_id;
  let tp_item = req.query.tp_item;
  let fk_item = req.query.fk_item;
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  let query = queryUtil.getStringsPerRank(
    page,
    mysql_id,
    tp_item,
    fk_item,
    startDate,
    endDate
  );

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      for (r in results) {
        let row = results[r];

        results[r] = {
          search_string: row.search_string,
          n: row.n,
          localLink: "/admin/query?search_string=" + row.search_string,
          link:
            "https://www.zerozero.pt/search.php?search_string=" +
            row.search_string,
        };
      }

      res.send(results);
      conn.release();
    });
  });
});

router.get("/hotqueries", function (req, res, next) {
  let startDate = new Date(req.query.startDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate()
  );
  let nextDay = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  nextDay.setDate(startDate.getDate() + 1);
  let last24Hours = new Date(startDate - 60000 * 60 * 24);
  let last7Days = new Date(startDate - 60000 * 60 * 24 * 8);

  let query = queryUtil.getHotQueries(
    startDate,
    nextDay,
    last24Hours,
    last7Days
  );

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

router.get("/hotpages", function (req, res, next) {
  let startDate = new Date(req.query.startDate);

  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );
  let nextDay = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate()
  );
  nextDay.setDate(startDate.getDate() + 1);
  let last24Hours = new Date(startDate - 60000 * 60 * 24);
  let last7Days = new Date(startDate - 60000 * 60 * 24 * 8);

  let query = queryUtil.getHotPages(startDate, nextDay, last24Hours, last7Days);

  db.getConnection((err, conn) => {
    conn.query(query, (err, results, fields) => {
      if (err) throw err;

      res.send(results);
      conn.release();
    });
  });
});

module.exports = router;
