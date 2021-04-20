const query = {
    getEvaluations() {
      return `SELECT id, name from evaluation`;
    },
  
    //TODO change to main table and use dates
    getSeachesPerDay(string) {
      return `select date_format(date, "%d-%m") as x, count(*) as y from fourdays group by search_string,date having search_string like '${string}'`;
    },
  
    getStringClicks(string) {
      return `select page_number, mysql_id, count(*) as n from fourdays where search_string = '${string}' group by page_number, mysql_id order by page_number, mysql_id`;
    },
  
    loadDailyEvaluation(date) {
      return `SELECT popular, unsuccessful from daily_evaluation where 
                          date = '${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}'`;
    },
  
    loadEvaluation(id) {
      return `SELECT period, date, popular, unsuccessful from evaluation where id = ${id}`;
    },
  
    singleDayPopular(date) {
      return `select search_string, count(*) as n from fourdays where 
                                   date = '${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}' 
                                   group by search_string order by count(*) DESC LIMIT 10`;
    },
  
    rangePopular(startDate, endDate) {
      return `select search_string, count(*) as n from fourdays where 
                              time > '${startDate.getFullYear()}-${
        startDate.getMonth() + 1
      }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
                              time < '${endDate.getFullYear()}-${
        endDate.getMonth() + 1
      }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
                              group by search_string order by count(*) DESC LIMIT 10`;
    },
  
    singleDayUnsuccessful(date) {
      return `select search_string, count(*) as n from fourdays where 
                         page_number > 5 and
                         date = '${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}' 
                         group by search_string order by count(*) DESC LIMIT 10`;
    },
  
    rangeUnsuccessful(startDate, endDate) {
      return `select search_string, count(*) as n from fourdays where page_number > 5 and
                  time > '${startDate.getFullYear()}-${
        startDate.getMonth() + 1
      }-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}' and
                  time < '${endDate.getFullYear()}-${
        endDate.getMonth() + 1
      }-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}' 
                  group by search_string order by count(*) DESC LIMIT 10`;
    },
  
    insertEvaluation(name, type, period, popular, unsuccessful, date) {
      return `INSERT INTO evaluation (name, type, period, popular, unsuccessful, date) VALUES 
              ('${name}', '${type}', '${period}', '${JSON.stringify(
        popular
      )}', '${JSON.stringify(unsuccessful)}', '${date}')`;
    },
  };
  
  module.exports = query;
  