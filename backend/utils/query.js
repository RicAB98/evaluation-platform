const query = {
  getEvaluations() {
    return `SELECT id, name FROM evaluation2`;
  },

  //TODO change to main table AND use dates
  getSearchesPerDay(string, startDate, endDate) {
    timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                    ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                    AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                    ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT date_format(date, "%Y-%c-%d") as x, count(*) as y FROM fourdays
            WHERE ${timeConditions} GROUP BY search_string, date HAVING search_string = '${string}'`;
  },

  //Returns list of the rank of the clicked options
  getClickRanks(string, startDate, endDate) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date")
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                      ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                      AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                      ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT page_number, mysql_id, count(*) as n FROM fourdays 
            WHERE mysql_id <> 0 AND fk_item <> 0 AND search_string = '${string}' 
            AND ${timeConditions} GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id`;
  },

  //Returns list of position clicked to reach a certain page
  getPagesRank(tp_item, fk_item, startDate, endDate) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date")
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                      ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                      AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                      ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT page_number, mysql_id, count(*) as n, (select distinct page from fourdays where tp_item = ${tp_item} and fk_item=${fk_item} order by method desc limit 1) as link
    FROM fourdays WHERE tp_item = ${tp_item} AND fk_item = ${fk_item} AND ${timeConditions} GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id`;
  },

  //Returns list of pages where user clicked on a specific rank
  getPagesByStringRank(page, mysql_id, string, startDate, endDate) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date")
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                    ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                    AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                    ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    if (page == 1)
      return `SELECT tp_item, fk_item, count(*) as n, (select distinct page from fourdays f2 where f.tp_item=f2.tp_item and f.fk_item=f2.fk_item order by method desc limit 1) as link
      FROM fourdays f WHERE (page_number = ${page} OR page_number = 0 ) AND mysql_id = ${mysql_id} AND fk_item <> 0 
      AND ${timeConditions} AND search_string='${string}' GROUP BY tp_item, fk_item ORDER BY n DESC`;
    else if (page == 2)
      return `SELECT tp_item, fk_item, count(*) as n, (select distinct page from fourdays f2 where f.tp_item=f2.tp_item and f.fk_item=f2.fk_item order by method desc limit 1) as link
      FROM fourdays WHERE page_number = ${page} AND mysql_id = ${mysql_id} AND fk_item <> 0 
      AND ${timeConditions} AND search_string='${string}' GROUP BY tp_item, fk_item ORDER BY n DESC`;
    else
      return `SELECT tp_item, fk_item, count(*) as n, (select distinct page from fourdays f2 where f.tp_item=f2.tp_item and f.fk_item=f2.fk_item order by method desc limit 1) as link   
      FROM fourdays WHERE page_number > 2 AND fk_item <> 0 
      AND ${timeConditions} AND search_string='${string}' GROUP BY tp_item, fk_item ORDER BY n DESC`;
  },

  //Returns list of strings that were more used to reach a certain page on a specific rank
  getStringsPerRank(page, mysql_id, tp_item, fk_item, startDate, endDate) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date")
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                      ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                      AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                      ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    if (page == 1)
      return `SELECT search_string, count(*) as n FROM fourdays 
      WHERE (page_number = ${page} OR page_number = 0 ) AND mysql_id = ${mysql_id} AND tp_item = ${tp_item} 
      AND fk_item = '${fk_item}' AND ${timeConditions} GROUP BY search_string ORDER BY n DESC`;
    else if (page == 2)
      return `SELECT search_string, count(*) as n FROM fourdays
      WHERE page_number = ${page} AND mysql_id = ${mysql_id} AND tp_item = ${tp_item} 
      AND fk_item = '${fk_item}' AND ${timeConditions} GROUP BY search_string ORDER BY n DESC`;
    else
      return `SELECT search_string, count(*) as n FROM fourdays
       WHERE page_number > 2 AND tp_item = ${tp_item} 
       AND fk_item = '${fk_item}' AND ${timeConditions} GROUP BY search_string ORDER BY n DESC`;
  },

  //Returns number of search sessions that resulted in no further click
  getUnsuccessfulSessions(string, startDate, endDate) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date")
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                    ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                    AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                    ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT count(*) as n FROM fourdays WHERE fk_item = 0 AND search_string='${string}' AND ${timeConditions}`;
  },

  //Returns list of ranks that a string appeared in while trying to reach a certain page
  getSearchStringRank(tp_item, fk_item, string) {
    return `SELECT page_number, mysql_id FROM fourdays WHERE tp_item = ${tp_item} AND fk_item = ${fk_item} AND search_string='${string} GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id DESC;`;
  },

  loadEvaluationByDate(startDate, endDate) {
    let timeConditions = `startDate = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
    ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' `;

    if (endDate.getFullYear() != 1970)
      timeConditions = `startDate = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                          ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                          AND endDate = '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                          ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT id, popularQueries, unsuccessfulQueries, popularPages FROM evaluation WHERE 
            ${timeConditions} limit 1`;
  },

  loadEvaluationById(id) {
    return `SELECT startDate, endDate FROM evaluation WHERE id = ${id}`;
  },

  popularQueries(startDate, endDate, limit) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date" && endDate.getFullYear() != 1970)
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                          ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                          AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                          ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT search_string, count(*) as n, concat('/admin/query?search_string=', search_string) as url FROM fourdays WHERE search_string <> '' AND 
              ${timeConditions} GROUP BY search_string ORDER BY count(*) DESC LIMIT ${limit}`;
  },

  unsuccessfulQueries(startDate, endDate, limit) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date" && endDate.getFullYear() != 1970)
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                          ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                          AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                          ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT search_string, count(*) as n, concat('/admin/query?search_string=', search_string) as url FROM fourdays WHERE search_string <> '' AND fk_item = 0 AND
              ${timeConditions} GROUP BY search_string ORDER BY count(*) DESC LIMIT ${limit}`;
  },

  popularPages(startDate, endDate, limit) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date" && endDate.getFullYear() != 1970)
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                          ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                          AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                          ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT tp_item as tp_item, fk_item, count(*) as n, (select distinct page from fourdays f2 where f.tp_item=f2.tp_item and f.fk_item=f2.fk_item order by method desc limit 1) as link
            FROM fourdays f WHERE fk_item <> 0 AND ${timeConditions} GROUP BY tp_item, fk_item ORDER BY count(*) DESC LIMIT ${limit}`;
  },

  insertEvaluation(
    popularQueries,
    unsuccessfulQueries,
    popularPages,
    startDate,
    endDate
  ) {
    return `INSERT INTO evaluation (popularQueries, unsuccessfulQueries, popularPages, startDate, endDate) VALUES 
              ('${JSON.stringify(popularQueries)}', 
              '${JSON.stringify(unsuccessfulQueries)}', 
              '${JSON.stringify(popularPages)}', 
              '${startDate}', '${endDate}')`;
  },
};

module.exports = query;
