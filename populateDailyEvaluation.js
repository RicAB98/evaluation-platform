const mysql = require('mysql');
const util = require('util');

const days = ['2021-01-06', '2021-01-07', '2021-01-08', '2021-01-09', '2021-01-10', '2021-01-11', '2021-01-12', '2021-01-13', '2021-01-14', '2021-01-15', '2021-01-16', '2021-01-17', '2021-01-18', '2021-01-19', '2021-01-20', '2021-01-21', '2021-01-22', '2021-01-23', '2021-01-24', '2021-01-25', '2021-01-26', '2021-01-27', '2021-01-28', '2021-01-29', '2021-01-30', '2021-01-31', '2021-02-01', '2021-02-02', '2021-02-03', '2021-02-04', '2021-02-05', '2021-02-06', '2021-02-07', '2021-02-08', '2021-02-09', '2021-02-10', '2021-02-11', '2021-02-12', '2021-02-13', '2021-02-14', '2021-02-15', '2021-02-16', '2021-02-17', '2021-02-18', '2021-02-19', '2021-02-20', '2021-02-21', '2021-02-22', '2021-02-23', '2021-02-24', '2021-02-25', '2021-02-26', '2021-02-27', '2021-02-28', '2021-03-01', '2021-03-02', '2021-03-03', '2021-03-04', '2021-03-05', '2021-03-06', '2021-03-07', '2021-03-08', '2021-03-09', '2021-03-10', '2021-03-11', '2021-03-12', '2021-03-13', '2021-03-14', '2021-03-15', '2021-03-16', '2021-03-17', '2021-03-18', '2021-03-19', '2021-03-20', '2021-03-21', '2021-03-22', '2021-03-23', '2021-03-24', '2021-03-25', '2021-03-26', '2021-03-27', '2021-03-28', '2021-03-29']

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'Password123#@!',
    database: 'zerozero'
});

  pool.getConnection((err, conn) => {
    const query = util.promisify(conn.query).bind(conn);

    for(let day of days)
    {
        let date = new Date (day)
        
        let popularQuery = `select search_string, count(*) as n from zzlog_search where 
            search_string <> '' and
            date = '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}' 
            group by search_string order by count(*) DESC LIMIT 10`

        let unsuccessfulQuery = `select search_string, count(*) as n from zzlog_search where 
            search_string <> '' and page_number > 5 and
            date = '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}' 
            group by search_string order by count(*) DESC LIMIT 10`

        date.setMonth(date.getMonth()+1)

        let formattedDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

        (async () => {
            try {
              const popular = await query(popularQuery);
              console.log("pop" + formattedDate)
              const unsuccessful = await query(unsuccessfulQuery);
              console.log("uns" + formattedDate)
              await query(`INSERT INTO daily_evaluation (popular, unsuccessful, date) VALUES 
              ('${JSON.stringify(popular)}', '${JSON.stringify(unsuccessful)}', '${formattedDate}')`)
              
            } finally {
                console.log("ins" + formattedDate)
            }
          })()

          continue;

        conn.query(popularQuery, (err, results1, fields) => {
            if (err) throw err
            console.log("pop ")

            conn.query(unsuccessfulQuery, (err, results2, fields) => {

                if (err) throw err
                console.log("uns ")
                conn.query(`INSERT INTO daily_evaluation (popular, unsuccessful, date) VALUES 
                ('${JSON.stringify(results1)}', '${JSON.stringify(results2)}', '${formattedDate}')`, (err, results2, fields) => {

                    if (err) throw err
                    console.log("ins " + formattedDate)
                    conn.release();
                });
            });
        });

        console.log("ins " + formattedDate)
    }   
    conn.release();
})