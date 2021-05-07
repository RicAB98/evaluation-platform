const apiHost = "http://localhost:9000";

export function runEvaluation(startDate, endDate) {
  return fetch(apiHost + "/runeval2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      startDate: startDate,
      endDate: endDate,
    }),
  });
}

export function loadEvaluation(type, startDate, endDate) {

  let query = apiHost + "/loadeval?type=" + type + "&startDate=" + startDate;

  if (endDate != null) query += "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function loadDailyEvaluation(date) {
  return fetch(apiHost + "/loaddailyeval?date=" + date, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getEvaluations() {
  return fetch(apiHost + "/getevaluations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function topQueries(startDate, endDate) {
  let query = apiHost + "/topqueries?startDate=" + startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function unsuccessfulQueries(startDate, endDate) {
  let query = apiHost + "/unsuccessfulqueries?startDate=" + startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function topPages(startDate, endDate) {
  let query = apiHost + "/toppages?startDate=" + startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function queryGraph(string, startDate, endDate) {
  let query =
    apiHost +
    "/querygraph?string=" +
    string +
    "&startDate=" +
    startDate +
    "&endDate=" +
    endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getQuerySummary(string, startDate, endDate) {
  let query =
    apiHost + "/querysummary?string=" + string + "&startDate=" + startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getClicksRanks(string, startDate, endDate) {
  let query =
    apiHost + "/clicksranks?string=" + string + "&startDate=" + startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getPagesPerRank(page, mysql_id, string, startDate, endDate) {
  let query =
    apiHost +
    "/pagesperrank?page=" +
    page +
    "&mysql_id=" +
    mysql_id +
    "&string=" +
    string +
    "&startDate=" +
    startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getUnsuccessfulSessions(string, startDate, endDate) {
  let query =
    apiHost +
    "/unsuccessfulsessions?string=" +
    string +
    "&startDate=" +
    startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function pageGraph(tp_item, fk_item, startDate, endDate) {
  let query =
    apiHost +
    "/pagegraph?tp_item=" +
    tp_item +
    "&fk_item=" +
    fk_item +
    "&startDate=" +
    startDate +
    "&endDate=" +
    endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getPagesRank(tp_item, fk_item, startDate, endDate) {
  let query =
    apiHost +
    "/pagesrank?tp_item=" +
    tp_item +
    "&fk_item=" +
    fk_item +
    "&startDate=" +
    startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getPageSummary(tp_item, fk_item, startDate, endDate) {
  let query =
    apiHost + "/pagesummary?tp_item=" + tp_item + "&fk_item=" + fk_item + "&startDate=" + startDate;

  if (endDate != null) query = query + "&endDate=" + endDate;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getStringsPerRank(page, mysql_id, tp_item, fk_item, startDate, endDate) {
  let query =
    apiHost +
    "/stringsperrank?tp_item=" +
    tp_item +
    "&fk_item=" +
    fk_item +
    "&page=" +
    page +
    "&mysql_id=" +
    mysql_id +
    "&startDate=" +
    startDate;

  if(endDate != null)
        query = query + "&endDate=" + endDate

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getHotQueries(startDate, minimum) {
  let query = apiHost + "/hotqueries?startDate=" +  startDate + "&minimum= " + minimum;

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function getHotPages(startDate, minimum) {
  let query = apiHost + "/hotpages?startDate=" +  startDate + "&minimum= " + minimum;
  
  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

