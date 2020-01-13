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
}

export function allSettled() {
}

export function race() {
}
