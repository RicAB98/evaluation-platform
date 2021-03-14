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