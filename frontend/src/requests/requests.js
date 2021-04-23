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

export function getClicksRanks(string) {
  let query = apiHost + "/clicksranks?string=" + string;

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

export function getPagesPerRank(page, mysql_id, string) {
  let query = apiHost + "/pagesperrank?page=" + page + "&mysql_id=" + mysql_id + "&string=" + string;

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

  export function getUnsuccessfulSessions(string) {
    let query = apiHost + "/unsuccessfulsessions?string=" + string;
  
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

  export function getSearchStringsPerPage(tp_item, fk_item) {
    let query = apiHost + "/stringsperpage?tp_item=" + tp_item + "&fk_item=" + fk_item;
  
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

  export function getPagesRank(tp_item, fk_item) {
    let query = apiHost + "/pagesrank?tp_item=" + tp_item + "&fk_item=" + fk_item;
  
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

