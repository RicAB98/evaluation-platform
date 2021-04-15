const apiHost = 'http://localhost:9000';

export function getTestAPI (){
    return fetch(apiHost + "/testAPI", {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        }
    });
}

export function postFile (file){
    return fetch(apiHost + "/file/upload", {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify({
            "file": file,
        })
    });
}

export function runEvaluation (name, type, period){
    return fetch(apiHost + "/runeval", {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify({
            "name": name,
            "type": type,
            "period": period
        })
    });
}


export function loadEvaluation (id){
    return fetch(apiHost + "/loadeval/" + id, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        }
    });
}

export function getEvaluations (){
    return fetch(apiHost + "/geteval", {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        }
    });
}

export function topQueries (startDate, endDate){

    let query = apiHost + "/topqueries?startDate=" + startDate

    if(endDate != null)
        query = query + "&endDate=" + endDate

    return fetch(query, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        }
    });
}

export function unsuccessfulQueries (startDate, endDate){

    let query = apiHost + "/unsuccessfulqueries?startDate=" + startDate

    if(endDate != null)
        query = query + "&endDate=" + endDate

    return fetch(query, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        }
    });
}

export function queryEvolution (string){

    let query = apiHost + "/query?query=" + string

    /*if(endDate != null)
        query = query + "&endDate=" + endDate*/

    return fetch(query, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*' 
        }
    });
}