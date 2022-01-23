import { emit } from '../util/emit.util.js';
import { requestId } from '../util/request.util.js';

const modes = new Map([
    ['all', 'All'],
    ['pending', 'Pending'],
    ['done', 'Done'],
]);

const orders = new Map([
    ['by-id', 'By id'],
    ['pending-first', 'Pending first'],
    ['done-first', 'Done first'],
]);

let mode = 'all';

let order = 'pending-first';

window.addEventListener('list:mode:update', (event) => {
    const { detail: updatedMode } = event;
    mode = updatedMode;
    emit('list:mode:has-updated', mode);
});

window.addEventListener('list:order:update', (event) => {
    const { detail: updatedOrder } = event;
    order = updatedOrder;
    emit('list:order:has-updated', order);
});

window.addEventListener('request:list:all', (event) => {
    emit(requestId(event), {
        modes: [...modes],
        mode,
        orders: [...orders],
        order,
    });
});

window.addEventListener('request:list:modes', (event) => {
    emit(requestId(event), [...modes]);
});

window.addEventListener('request:list:mode', (event) => {
    emit(requestId(event), mode);
});

window.addEventListener('request:list:orders', (event) => {
    emit(requestId(event), [...orders]);
});

window.addEventListener('request:list:order', (event) => {
    emit(requestId(event), order);
});