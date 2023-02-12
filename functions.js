const firebaseURL = process.env['database']
import fetch from 'node-fetch'
export async function data(x, y) {
    let method = y !== null ? 'PATCH' : 'DELETE'
    try {
   console.log(`[ Firebase ] write (${x}) : (${y})`)
   fetch(`${firebaseURL}/${encodeURI(x)}.json`, {
      body: JSON.stringify(y),
      method
      }).then((err) => {
        if (err.error) console.log(err.error)
      })
    } catch(e) {
console.log(e)
    }
  }
export async function get(x) {
 return new Promise((promise) => {
        fetch(`${firebaseURL}/${encodeURI(x)}.json`).then(data => data.json()).then(data => {
            if (data && typeof data === 'string' && isNaN(Number(data))) promise(data.slice(1, -1))
            else if (data === 'null') promise(null)
             else if (!isNaN(Number(data))) promise(Number(data))
             
              else promise(data)
           
            })
        
            })
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
                }

export async function objectEquals(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    if (x.constructor !== y.constructor) { return false; }
    if (x instanceof Function) { return x === y; 
    }
    if (x instanceof RegExp) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }
    if (x instanceof Date) { return false; }
    if (!(y instanceof Object)) { return false; }
    var p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
        p.every(function (i) { return objectEquals(x[i], y[i]); });
}

    function accessId() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4());
                }