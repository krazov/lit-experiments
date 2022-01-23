import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

import './todo-list-item.js';

class TodoList extends LitElement {
    static get properties() {
        return {
            list: { type: Array },
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    constructor() {
        super();
        this.list = [];

        this.hydrateList();
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('todo:list-updated', this.updateList);
    }

    disconnectedCallback() {
        window.removeEventListener('todo:list-updated', this.updateList);
        super.disconnectedCallback();
    }

    async hydrateList() {
        // TODO: this part should be abstracted as well, but I don’t see where it falls yet
        const requestId = `todo:request:list:${Date.now()}`;
        const handleList = (function (event) {
            const { detail: todos = {} } = event;
            this.list = todos;

            console.log('List hydrated with:', todos);

            window.removeEventListener(requestId, handleList);
        }).bind(this);

        window.addEventListener(requestId, handleList);
        window.dispatchEvent(new CustomEvent('todo:request:list', { detail: requestId }));
    }

    updateList = (event) => {
        const { detail: todos = {} } = event;
        this.list = todos;

        console.log('List updated with', todos);
    }

    updateTodo = (event) => {
        const { detail: { id, task, isDone } } = event;

        window.dispatchEvent(new CustomEvent('todo:update', { detail: {
            id,
            ...typeof task =='string' && { task },
            ...typeof isDone == 'boolean' && { isDone },
        }}));
    };

    get todosList() {
        const listItems = this.list.map(todo =>
            html`
                <todo-list-item
                    id="${todo.id}"
                    task="${todo.task}"
                    ?is-done=${todo.isDone}
                    @update-todo="${this.updateTodo}"
                ></todo-list-item>`
        );

        return html`${listItems}`;
    }

    get emptyListMessage() {
        return html`<p class="todo-message">The list is currently empty. Try adding some todos.</p>`;
    }

    render() {
        return this.list.length
            ? this.todosList
            : this.emptyListMessage;
    }
}

customElements.define('todo-list', TodoList);
