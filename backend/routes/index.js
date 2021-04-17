var express = require('express');
const db = require('../database/db.js');
var router = express.Router();

router.post('/runeval', function(req, res, next) {
  db.getConnection((err, conn) => {

    let name = req.body.name
    let type = req.body.type["name"]
    let period = req.body.period["name"]
    let startDate = new Date(req.body.startDate)
    let endDate = new Date(req.body.endDate)

    /*if(req.body.type == null || req.body.period == null)
    {
      res.send("Missing parameters")
      return
    }*/


    queryPop = `select search_string, count(*) as n from fourdays where 
    time > '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
    time < '${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
    group by search_string order by count(*) DESC LIMIT 10`

    queryUns = `select search_string, count(*) as n from fourdays where page_number > 5 and
    time > '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
    time < '${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
    group by search_string order by count(*) DESC LIMIT 10`

    let popResponse
    let UnsResponse
    let date = endDate.getFullYear() + "-" + endDate.getMonth() + 1 + "-" + endDate.getDate() + " " +  endDate.getHours() + ":" + endDate.getMinutes() + ":" + endDate.getSeconds();

    db.getConnection((err, conn) => {
      conn.query(queryPop, (error, results, fields) => {
        if (err) 
          throw err
  
        popResponse = results

        conn.query(queryUns, (error, results, fields) => {
          if (err) 
            throw err
        
          UnsResponse = results

          console.log(JSON.stringify(UnsResponse))

          conn.query(`INSERT INTO evaluation (name, type, period, popular, unsuccessful, date) VALUES 
          ('${name}', '${type}', '${period}', '${JSON.stringify(popResponse)}', '${JSON.stringify(UnsResponse)}', '${date}')`, (err, results, fields) => {
            if (err) 
              throw err

            let response = {
              popular: popResponse,
              unsuccessful: UnsResponse
            }

            res.send(response)
          });
        });
      });
     
      conn.release();

    })

  
    

    
    return;

    conn.query(`INSERT INTO Evaluation (name, type, period, popular, unsuccessful, date) VALUES ('${name}', '${type}', '${period}', '${popResponse}', '${UnsResponse}', '${date}')`, (error, results, fields) => {
      if (err) 
          throw err

      let response = {
        popular: popResponse,
        unsuccessful: unsuccessfulQueries
      }

      res.send()
      conn.release();
    });
  });
});

router.get('/loadeval', function(req, res, next) {
  let id = req.query.id

  db.getConnection((err, conn) => {
    conn.query(`SELECT popular, unsuccessful from evaluation where id = ${id}`, (err, results, fields) => {
      if (err) throw err

      res.send(results);
      conn.release();
    });
  });
});

router.get('/getevaluations', function(req, res, next) {
  db.getConnection((err, conn) => {
    conn.query('SELECT id,name from evaluation', (err, results, fields) => {
      if (err) throw err

      res.send(results);
      conn.release();
    });
  });
});

router.get('/topqueries', function(req, res, next) {

  let startDate = new Date(req.query.startDate)
  let query = `select search_string, count(*) as n from fourdays where 
                 date = '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}' 
                 group by search_string order by count(*) DESC LIMIT 10`
  

  if(req.query.endDate != null)
  {

    endDate = new Date(req.query.endDate)

    query = `select search_string, count(*) as n from fourdays where 
              time > '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
              time < '${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
              group by search_string order by count(*) DESC LIMIT 10`
  }
  
  db.getConnection((err, conn) => {
    conn.query(query, (error, results, fields) => {
      if (err) throw err

      res.send(results);
      conn.release();
    });
  })

});

router.get('/unsuccessfulqueries', function(req, res, next) {

  let startDate = new Date(req.query.startDate)

  let query = `select search_string, count(*) as n from fourdays where 
                 page_number > 5 and
                 date = '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}' 
                 group by search_string order by count(*) DESC LIMIT 10`
  
  if(req.query.endDate != null)
  {
    endDate = new Date(req.query.endDate)

    query = `select search_string, count(*) as n from fourdays where 
              page_number > 5 and
              time > '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
              time < '${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
              group by search_string order by count(*) DESC LIMIT 10`
  }

  db.getConnection((err, conn) => {
    conn.query(query, (error, results, fields) => {
      if (err) throw err

      res.send(results);
      conn.release();
    });
  })

});

router.get('/query', function(req, res, next) {

  let query = req.query.query;

  db.getConnection((err, conn) => {
    conn.query(`select date_format(date, "%d-%m") as x, count(*) as y from fourdays group by search_string,date having search_string like '${query}'`, (error, results, fields) => {
      if (err) throw err
      response = 
      [
      {
        id: query,
        color: "hsl(181, 70%, 50%)",
        data: results
      }
      ]

      res.send(response);
      conn.release();
    });
  });
});



module.exports = router;
