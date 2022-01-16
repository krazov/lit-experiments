const todos = new Map();

let id = 0;

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

window.addEventListener('todo:edit', (event) => {
    const current = todos.get(id);
    const { detail: {
        id,
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
    window.dispatchEvent(new CustomEvent('todo:list-updated', { detail: [...todos.values()] }));
}
