import setText, { appendText, showWaiting, hideWaiting } from "./results.mjs";

//using axios which is promise based 

export function get() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            console.log(`data: ${JSON.stringify(data)}`);
            setText(JSON.stringify(data));
        });
}

export function getCatch() {
    axios.get("http://localhost:3000/orders/a")
        .then(result => {
            console.log(`data: ${JSON.stringify(result)}`);
            setText(JSON.stringify(result.data));
        })
        .catch(error => {
            console.log(`Error: ${error}`)
            setText(error)
        });
}

export function chain() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
        })
        .then(({ data }) => {
            console.log(`Address Data: ${JSON.stringify(data)}`)
            setText(`City: ${data.city}`)
        })
}

export function chainCatch() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            // missing return
            axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
        })
        .then(({ data }) => {
            console.log(`Address Data: ${JSON.stringify(data)}`)
            setText(`City: ${data.city}`)
        })
        .catch((error) => setText(error))
}

export function final() {
    showWaiting();
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
        })
        .then(({ data }) => {
            console.log(`Address Data: ${JSON.stringify(data)}`)
            setText(`City: ${data.city}`)
        })
        .catch((error) => setText(error))
        .finally(() => {
            // hideWaiting()
            setTimeout(() => {
                hideWaiting()
            }, 1500);
            appendText("--Done Waiting--")
        })
}