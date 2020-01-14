import setText, { appendText } from './results.mjs';

export async function get() {
    // use await on function that returns promise but async must still be specified
    const { data } = await axios.get('http://localhost:3000/orders/1');
    setText(JSON.stringify(data));
}

export async function getCatch() {
    // try/catch block is not just for async/await. Std JS stuff
    try {
        const { data } = await axios.get('http://localhost:3000/orders/123');
        setText(JSON.stringify(data));
    } catch (error) {
        setText(error)
    }
}

export async function chain() {
    setText("");

    appendText(" waiting on orders ");
    const { data } = await axios.get('http://localhost:3000/orders/1');
    appendText(JSON.stringify(data));

    console.log(`Data: ${JSON.stringify(data)}`);

    appendText(" waiting on status ");
    const { data: address } = await axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
    console.log(`Address: ${JSON.stringify(address)}`);
    appendText(`City: ${address.city}`)

}

export async function concurrent() {
    // 2 axios calls started, then await for each to finish
    const orderStatus = axios.get('http://localhost:3000/orderStatuses');
    const orders = axios.get('http://localhost:3000/orders');

    setText("");
    appendText(" waiting on orders ");
    const { data: order } = await orders;
    appendText(" waiting on status ");
    const { data: statuses } = await orderStatus;


    appendText(JSON.stringify(statuses))
    appendText(JSON.stringify(order[0]))
}

export async function parallel() {
    setText("");
    // Promise all with anonymouse function IIFE's for each item in promise array
    await Promise.all([
        (async () => {
            appendText(" waiting on status ");
            const { data: statuses } = await axios.get('http://localhost:3000/orderStatuses');
            appendText(` Status: ${JSON.stringify(statuses)}`)
        })(),
        (async () => {
            appendText(" waiting on orders ");
            const { data: orders } = await axios.get('http://localhost:3000/orders');
            appendText(` Orders: ${JSON.stringify(orders)}`)
        })(),
    ])
}


