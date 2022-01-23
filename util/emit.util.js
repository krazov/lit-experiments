/**
 * Emits a CustomEvent with a potential payload.
 * @param {string} eventName
 * @param {*} payload
 */
export function emit(eventName, payload) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
    console.log(`Emitted ${eventName} with payload:`, payload);
}
