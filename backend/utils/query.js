const query = {
  getEvaluations() {
    return `SELECT id, name FROM evaluation2`;
  },

  //TODO change to main table AND use dates
  getQuerySearchesPerDay(string, startDate, endDate) {
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
            WHERE fk_item <> 0 AND search_string = '${string}' 
            AND ${timeConditions} GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id`;
  },

  getQuerySummary(string, startDate, endDate, nextDay, last24Hours, last7Days) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date")
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} 
                      ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                      AND time < '${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} 
                      ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    startDate = `'${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}'`;            
    nextDay = `'${nextDay.getFullYear()}-${nextDay.getMonth() + 1}-${nextDay.getDate()}'`;
    last24Hours = `'${last24Hours.getFullYear()}-${last24Hours.getMonth() + 1}-${last24Hours.getDate()}'`;
    last7Days = `'${last7Days.getFullYear()}-${last7Days.getMonth() + 1}-${last7Days.getDate()}'`;

    return `select coalesce(sumRank,0) as sumRank, coalesce(oneCount,0) as oneCount, coalesce(totalClicks,0) as totalClicks, coalesce(totalLast24h,0) as totalLast24h, coalesce(totalPrevious24h,0) as totalPrevious24h, coalesce(totalLast7days,0) as totalLast7days, coalesce(average7days,0) as average7days FROM 
    (select search_string, sum(case when page_number = 0 then mysql_id else page_number * mysql_id end) as sumRank, count(*) as totalClicks from fourdays where date > ${last7Days} and date < ${nextDay} and fk_item <> 0 and search_string = '${string}') as ranking left join
    (select search_string, count(*) as totalLast7days, count(*)/7 as average7days from fourdays where date > ${last7Days} and date < ${startDate} and search_string = '${string}') as 7days on ranking.search_string = 7days.search_string left join 
    (select search_string, count(*) as totalPrevious24h from fourdays where date = ${last24Hours} and search_string = '${string}') as 24hours on ranking.search_string = 24hours.search_string left join
    (select search_string, count(*) as totalLast24h from fourdays where ${timeConditions} and search_string = '${string}') as day on ranking.search_string = day.search_string left join
    (select search_string, count(*) as oneCount from fourdays where date > ${last7Days} and date < ${nextDay} and mysql_id = 1 and (page_number = 1 or page_number = 0) and fk_item <> 0 and search_string = '${string}') as firstOption on ranking.search_string = firstOption.search_string
    `;
  },

  getPageSearchesPerDay(tp_item, fk_item, startDate, endDate) {
    timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                    ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                    AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                    ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    return `SELECT date_format(date, "%Y-%c-%d") as x, count(*) as y FROM fourdays
            WHERE ${timeConditions} GROUP BY tp_item, fk_item, date HAVING tp_item = ${tp_item} and fk_item = ${fk_item}`;
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

  getPageSummary(tp_item, fk_item, startDate, endDate, nextDay, last24Hours, last7Days) {
    let timeConditions = `date = '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;

    if (endDate != "Invalid Date")
      timeConditions = `time > '${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()} 
                      ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}'
                      AND time < '${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()} 
                      ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}'`;

    startDate = `'${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;            
    nextDay = `'${nextDay.getFullYear()}-${nextDay.getMonth()}-${nextDay.getDate()}'`;
    last24Hours = `'${last24Hours.getFullYear()}-${last24Hours.getMonth()}-${last24Hours.getDate()}'`;
    last7Days = `'${last7Days.getFullYear()}-${last7Days.getMonth()}-${last7Days.getDate()}'`;

    return `select coalesce(sumRank,0) as sumRank, coalesce(oneCount,0) as oneCount, coalesce(totalClicks,0) as totalClicks, coalesce(totalLast24h,0) as totalLast24h, coalesce(totalPrevious24h,0) as totalPrevious24h, coalesce(totalLast7days,0) as totalLast7days, coalesce(average7days,0) as average7days FROM 
    (select tp_item, fk_item, sum(case when page_number = 0 then mysql_id else page_number * mysql_id end) as sumRank, count(*) as totalClicks from fourdays where date > ${last7Days} and date < ${nextDay} and fk_item <> 0 and tp_item = ${tp_item} and fk_item = ${fk_item}) as ranking left join
    (select tp_item, fk_item, count(*) as totalLast7days, count(*)/7 as average7days from fourdays where date > ${last7Days} and date < ${startDate} and tp_item = ${tp_item} and fk_item = ${fk_item}) as 7days on ranking.tp_item = 7days.tp_item and ranking.fk_item = 7days.fk_item left join 
    (select tp_item, fk_item, count(*) as totalPrevious24h from fourdays where date = ${last24Hours} and tp_item = ${tp_item} and fk_item = ${fk_item}) as 24hours on ranking.tp_item = 24hours.tp_item and ranking.fk_item = 24hours.fk_item left join
    (select tp_item, fk_item, count(*) as totalLast24h from fourdays where ${timeConditions} and tp_item = ${tp_item} and fk_item = ${fk_item}) as day on ranking.tp_item = day.tp_item and ranking.fk_item = day.fk_item left join
    (select tp_item, fk_item, count(*) as oneCount from fourdays where date > ${last7Days} and date < ${nextDay} and mysql_id = 1 and (page_number = 1 or page_number = 0) and fk_item <> 0 and tp_item = ${tp_item} and fk_item = ${fk_item}) as firstOption on ranking.tp_item = firstOption.tp_item and ranking.fk_item = firstOption.fk_item
    `;
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
      FROM fourdays f WHERE page_number = ${page} AND mysql_id = ${mysql_id} AND fk_item <> 0 
      AND ${timeConditions} AND search_string='${string}' GROUP BY tp_item, fk_item ORDER BY n DESC`;
    else
      return `SELECT tp_item, fk_item, count(*) as n, (select distinct page from fourdays f2 where f.tp_item=f2.tp_item and f.fk_item=f2.fk_item order by method desc limit 1) as link   
      FROM fourdays f WHERE page_number > 2 AND fk_item <> 0 
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

  getHotQueries(minimum, startDate, nextDay, last24Hours, last7Days) {
    startDate = `'${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;
    nextDay = `'${nextDay.getFullYear()}-${nextDay.getMonth()}-${nextDay.getDate()}'`;
    last24Hours = `'${last24Hours.getFullYear()}-${last24Hours.getMonth()}-${last24Hours.getDate()}'`;
    last7Days = `'${last7Days.getFullYear()}-${last7Days.getMonth()}-${last7Days.getDate()}'`;

    return `select day.search_string as search_string, coalesce(sumRank,0) as sumRank, coalesce(oneCount,0) as oneCount, coalesce(totalClicks,0) as totalClicks, coalesce(totalLast24h,0) as totalLast24h, coalesce(totalPrevious24h,0) as totalPrevious24h, coalesce(totalLast7days,0) as totalLast7days, coalesce(average7days,0) as average7days, dates, searches from  
    (select search_string, count(*) as totalLast24h from fourdays where date = ${startDate} and search_string <> '' group by search_string having count(*) >= ${minimum}) as day left join
    (select search_string, sum(case when page_number = 0 then mysql_id else page_number * mysql_id end) as sumRank, count(*) as totalClicks from fourdays where date > ${last7Days} and date < ${nextDay} and fk_item <> 0 group by search_string) as ranking on day.search_string = ranking.search_string left join 
    (select search_string, count(*) as totalLast7days, count(*)/7 as average7days from fourdays where date > ${last7Days} and date < ${startDate} group by search_string) as 7days on day.search_string = 7days.search_string left join 
    (select search_string, count(*) as totalPrevious24h from fourdays where date = ${last24Hours} group by search_string) as 24hours on day.search_string = 24hours.search_string left join
    (select search_string, count(*) as oneCount from fourdays where date > ${last7Days} and date < ${nextDay} and mysql_id = 1 and (page_number = 1 or page_number = 0) and fk_item <> 0 group by search_string) as firstOption on day.search_string = firstOption.search_string left join
    (select search_string, group_concat(date order by date) as dates, group_concat (count order by date) as searches from (select search_string, date, count(*) as count from fourdays where date > ${last7Days} and date < ${nextDay} group by search_string, date order by date) as aux group by search_string) as searchesPerDay on day.search_string = searchesPerDay.search_string
    order by totalLast24h DESC;`;
  },

  getHotPages(minimum, startDate, nextDay, last24Hours, last7Days) {
    startDate = `'${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}'`;
    nextDay = `'${nextDay.getFullYear()}-${nextDay.getMonth()}-${nextDay.getDate()}'`;
    last24Hours = `'${last24Hours.getFullYear()}-${last24Hours.getMonth()}-${last24Hours.getDate()}'`;
    last7Days = `'${last7Days.getFullYear()}-${last7Days.getMonth()}-${last7Days.getDate()}'`;

    return `select day.tp_item, day.fk_item, coalesce(sumRank,0) as sumRank, coalesce(oneCount,0) as oneCount, coalesce(totalClicks,0) as totalClicks, coalesce(totalLast24h,0) as totalLast24h, coalesce(totalPrevious24h,0) as totalPrevious24h, coalesce(totalLast7days,0) as totalLast7days, coalesce(average7days,0) as average7days, dates, searches from 
    (select tp_item, fk_item, count(*) as totalLast24h from fourdays where date = ${startDate} and fk_item <> 0 group by tp_item, fk_item having count(*) >= ${minimum}) as day left join  
    (select tp_item, fk_item, count(*) as totalLast7days, count(*)/7 as average7days from fourdays where date > ${last7Days} and date < ${startDate} and fk_item <> 0 and fk_item <> 0 group by tp_item, fk_item) as 7days on day.tp_item = 7days.tp_item and day.fk_item = 7days.fk_item left join 
    (select tp_item, fk_item, count(*) as totalPrevious24h from fourdays where date = ${last24Hours} and fk_item <> 0 group by tp_item, fk_item) as 24hours on day.tp_item = 24hours.tp_item and day.fk_item = 24hours.fk_item left join  
    (select tp_item, fk_item, sum(case when page_number = 0 then mysql_id else page_number * mysql_id end) as sumRank, count(*) as totalClicks from fourdays where date > ${last7Days} and date < ${nextDay} and fk_item <> 0 group by tp_item, fk_item) as ranking on day.tp_item = ranking.tp_item and day.fk_item = ranking.fk_item left join
    (select tp_item, fk_item, count(*) as oneCount from fourdays where date > ${last7Days} and date < ${nextDay} and mysql_id = 1 and page_number = 1 and fk_item <> 0 group by tp_item, fk_item) as firstOption on day.tp_item = firstOption.tp_item and day.fk_item = firstOption.fk_item left join
    (select tp_item, fk_item, group_concat(date order by date) as dates, group_concat (count order by date) as searches from (select tp_item, fk_item, date, count(*) as count from fourdays where date > ${last7Days} and date < ${nextDay} group by tp_item, fk_item, date order by date) as aux group by tp_item, fk_item) as searchesPerDay on day.tp_item = searchesPerDay.tp_item and day.fk_item = searchesPerDay.fk_item 
    order by totalLast24h DESC;`;
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
