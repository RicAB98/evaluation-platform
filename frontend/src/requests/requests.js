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