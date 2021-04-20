const apiHost = "http://localhost:9000";

export function runEvaluation(name, type, period, startDate, endDate) {
  return fetch(apiHost + "/runeval", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      name: name,
      type: type,
      period: period,
      startDate: startDate,
      endDate: endDate,
    }),
  });
}

export function loadEvaluation(id) {
  return fetch(apiHost + "/loadeval/?id=" + id, {
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

  console.log(query)

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

export function queryGraph(string) {
  let query = apiHost + "/queryGraph?string=" + string;

  /*if(endDate != null)
        query = query + "&endDate=" + endDate*/

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function queryTable(string) {
  let query = apiHost + "/queryTable?string=" + string;

  /*if(endDate != null)
        query = query + "&endDate=" + endDate*/

  return fetch(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
