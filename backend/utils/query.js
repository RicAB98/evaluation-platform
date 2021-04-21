const query = {
  getEvaluations() {
    return `SELECT id, name FROM evaluation`;
  },

  //TODO change to main table AND use dates
  getSearchesPerDay(string) {
    return `SELECT date_format(date, "%d-%m") as x, count(*) as y FROM fourdays GROUP BY search_string, date HAVING search_string = '${string}'`;
  },

  getStringClicks(string) {
    return `SELECT page_number, mysql_id, count(*) as n FROM fourdays WHERE mysql_id <> 0 AND search_string = '${string}' GROUP BY page_number, mysql_id ORDER BY page_number, mysql_id`;
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
                         page_number > 5 AND
                         date = '${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}' 
                         GROUP BY search_string ORDER BY count(*) DESC LIMIT 10`;
  },

  rangeUnsuccessful(startDate, endDate) {
    return `SELECT search_string, count(*) as n FROM fourdays WHERE mysql_id = 0 AND
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
