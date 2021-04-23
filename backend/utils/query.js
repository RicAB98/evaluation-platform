const query = {
  getEvaluations() {
    return `SELECT id, name FROM evaluation`;
  },

  //TODO change to main table AND use dates
  getSearchesPerDay(string) {
    return `SELECT date_format(date, "%Y-%c-%d") as x, count(*) as y FROM fourdays GROUP BY search_string, date HAVING search_string = '${string}'`;
  },

  //Returns list of the rank of the clicked options
  getClickRanks(string) {
    return `SELECT page_number, mysql_id, count(*) as n FROM fourdays WHERE mysql_id <> 0 AND fk_item <> 0 AND search_string = '${string}' GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id`;
  },

  //Returns list of position clicked to reach a certain page
  getPagesRank(tp_item, fk_item)  {
    return `SELECT page_number, mysql_id, count(*) as n FROM fourdays WHERE tp_item = ${tp_item} AND fk_item = ${fk_item} GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id`
  },

  //Returns list of pages where user clicked on a specific rank
  getPagesPerRank(page, mysql_id, string) {
    if (page == 1)
      return `SELECT tp_item, fk_item, count(*) as n FROM fourdays WHERE (page_number = ${page} OR page_number = 0 ) AND mysql_id = ${mysql_id} AND fk_item <> 0 AND search_string='${string}' GROUP BY tp_item, fk_item ORDER BY n DESC`;
    else if (page == 2)
      return `SELECT tp_item, fk_item, count(*) as n FROM fourdays WHERE page_number = ${page} AND mysql_id = ${mysql_id} AND fk_item <> 0 AND search_string='${string}' GROUP BY tp_item, fk_item ORDER BY n DESC`;
    else
      return `SELECT tp_item, fk_item, count(*) as n FROM fourdays WHERE page_number > 2 AND fk_item <> 0 AND search_string='${string}' GROUP BY tp_item, fk_item ORDER BY n DESC`;
  },

  //Returns number of search sessions that resulted in no further click
  getUnsuccessfulSessions(string) {
    return `SELECT count(*) as n FROM fourdays WHERE fk_item = 0 AND search_string='${string}'`;
  },

  //Returns list of strings that were more used to reach a certain page PODE SER APAGADO?
  getSearchStringsPerPage(tp_item, fk_item) {
    return `SELECT search_string, count(*) as n FROM fourdays WHERE tp_item= ${tp_item} and fk_item= ${fk_item} GROUP BY search_string ORDER BY count(*) DESC LIMIT 20`;
  },

  //Returns list of ranks that a string appeared in while trying to reach a certain page
  getSearchStringRank(tp_item, fk_item, string) {
    return `SELECT page_number, mysql_id FROM fourdays WHERE tp_item = ${tp_item} AND fk_item = ${fk_item} AND search_string='${string} GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id DESC;` 
  },

  loadDailyEvaluation(date) {
    return `SELECT popular, unsuccessful FROM daily_evaluation WHERE 
                          date = '${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}'`;
  },

  loadEvaluation(id) {
    return `SELECT startDate, endDate, popular, unsuccessful FROM evaluation WHERE id = ${id}`;
  },

  singleDayPopular(date) {
    return `SELECT search_string, count(*) as n FROM fourdays WHERE 
                                   search_string <> '' AND
                                   date = '${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}' 
                                   GROUP BY search_string ORDER BY count(*) DESC LIMIT 10`;
  },

  rangePopular(startDate, endDate) {
    return `SELECT search_string, count(*) as n FROM fourdays WHERE 
                              search_string <> '' AND
                              time > '${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' AND
                              time < '${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
                              GROUP BY search_string ORDER BY count(*) DESC LIMIT 10`;
  },

  singleDayUnsuccessful(date) {
    return `SELECT search_string, count(*) as n FROM fourdays WHERE 
                         search_string <> '' AND
                         fk_item = 0 AND
                         date = '${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}' 
                         GROUP BY search_string ORDER BY count(*) DESC LIMIT 10`;
  },

  rangeUnsuccessful(startDate, endDate) {
    return `SELECT search_string, count(*) as n FROM fourdays WHERE fk_item = 0 AND
                  search_string <> '' AND
                  time > '${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' AND
                  time < '${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
                  GROUP BY search_string ORDER BY count(*) DESC LIMIT 10`;
  },

  insertEvaluation(name, type, popular, unsuccessful, startDate, endDate) {
    return `INSERT INTO evaluation (name, type, popular, unsuccessful, startDate, endDate) VALUES 
              ('${name}', '${type}', '${JSON.stringify(
      popular
    )}', '${JSON.stringify(unsuccessful)}', '${startDate}', '${endDate}')`;
  },
};

module.exports = query;
