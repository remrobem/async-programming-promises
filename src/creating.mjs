import setText from './results.mjs';
import { appendText } from './results.mjs';

export function timeout() {

    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve("TimeOut")
        }, 1500)
    });


    wait.then(text => setText(text));
}

export function interval() {
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log(`Interval Counter ${counter}`)
            resolve(`Interval ${++counter}`)
        }, 1500)
    });


    wait.then(text => setText(text));
    wait.finally(() => appendText(`Finally Done at ${counter}`))
}

export function clearIntervalChain() {
    let counter = 0;
    let interval;
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log(`Interval Counter ${counter}`)
            resolve(`Interval ${++counter}`)
        }, 1500)
    });
    wait.then(text => setText(text));
    wait.finally(() => {
        // console.log(`Interval: ${interval}`)
        clearInterval(interval)
    })
}

export function xhr() {
    let request = new Promise((resolve, reject) => {
        console.log('in request');
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/1");
        xhr.onload = () => {
            console.log('in onload');
            // non-200 is not an error (onerror)
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                console.log(xhr)
                reject(`Request Failed: ${xhr}`);
            }
        };
        xhr.onerror = () => reject("Request Failed");
        xhr.send();
    });

    console.log('before execute request')
    request
        .then((result) => {
            setText(result);
        })
        .catch((reason) => {
            setText(reason)
        })

}

export function allPromises() {

    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    // this fails
    let addressTypes = axios.get('http://localhost:3000/addressTypes');
    // promise settled when all success or 1 fail
    Promise.all([categories, statuses, userTypes, addressTypes])
        .then(([cat, stat, type, address]) => {
            setText("");
            appendText(`cat data: ${JSON.stringify(cat.data)}`);
            appendText(`stat data: ${JSON.stringify(stat.data)}`);
            appendText(`type data: ${JSON.stringify(type.data)}`);
            appendText(`address data: ${JSON.stringify(address.data)}`);
        })
        .catch(reasons => {
            setText(reasons);
        })

}

export function allSettled() {
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    // this fails
    let addressTypes = axios.get('http://localhost:3000/addressTypes');
    
    Promise.allSettled([categories, statuses, userTypes, addressTypes])
        .then((values) => {
            console.log(`${JSON.stringify(values)}`)
            setText(values.map((value) => {
                return value.status == "fulfilled" ? `${value.status}: ${JSON.stringify(value.value.data[0]) } `
                : `${value.status}: ${value.reason.message} `;
            })
            );

        })
        // not needed for allSettled but recommended
        .catch(reasons => {
            setText(reasons);
        })
}

export function race() {
    // first one to cpmplete, even if error, settles the promise
    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    Promise.race([users,backup])
    .then(users => setText(JSON.stringify(users.data)))
    .catch(reason => setText(reason))
}
