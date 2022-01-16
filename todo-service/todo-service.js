const todos = restoredTodos();
const todosArray = () => [...todos.values()];

let id = Math.max(0, ...todos.keys());

window.addEventListener('todo:request:list', (event) => {
    const { detail: requestId } = event;
    window.dispatchEvent(new CustomEvent(requestId, { detail: todosArray() }));

    console.log('Responded to', requestId);
});

window.addEventListener('todo:add', (event) => {
    const { detail: { task } = {} } = event;

    if (!task) {
        console.error('Missing task!');
        return;
    }

    id++;

    todos.set(id, {
        id,
        task,
        isDone: false,
    });

    listUpdated();
});

window.addEventListener('todo:update', (event) => {
    const { detail: { id } } = event;
    const current = todos.get(id);
    const { detail: {
        task = current.task,
        isDone = current.isDone,
    } } = event;

    todos.set(id, {
        ...current,
        task,
        isDone,
    });

    listUpdated();
});

window.addEventListener('todo:remove', (event) => {
    const { detail: { id } } = event;

    todos.delete(id);

    listUpdated();
});

function listUpdated() {
    const valuesArray = todosArray();

    window.localStorage.setItem('todos', JSON.stringify(valuesArray));
    window.dispatchEvent(new CustomEvent('todo:list-updated', { detail: valuesArray }));
}

function restoredTodos() {
    const todos = JSON.parse(window.localStorage.getItem('todos')) || [];
    return new Map(todos.map(item => [item.id, item]));
}