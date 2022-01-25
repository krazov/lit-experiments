// source: https://vanillajstoolkit.com/helpers/randomstring/
function generateRandomString () {
	var array = new Uint32Array(28);
	window.crypto.getRandomValues(array);
	return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// TODO: consider setting a timeout after which the request fails

/**
 * A wrapper for one-time request returning a promise with the response.
 * @param {string} eventName - A name of event that will be listened to somewhere, you don’t know where.
 * @returns {Promise<any>} Event’s `detail` property
 */
export function request(eventName) {
    const requestId = `request:${generateRandomString()}`;

    console.log(`Requesting ${eventName} with id: ${requestId}`);

    return new Promise((resolve) => {
        const handleRequest = (event => {
            resolve(event?.detail);
            window.removeEventListener(requestId, handleRequest);
        });

        window.addEventListener(requestId, handleRequest);
        window.dispatchEvent(new CustomEvent(eventName, { detail: requestId }));
    });
}

/**
 * Returns request id from the event.
 * @param {CustomEvent} event
 * @returns {string} Request id
 */
export function requestId(event) {
    if (typeof event?.detail != 'string') throw Error('Incorrect or missing request id!');

    return event.detail;
}
