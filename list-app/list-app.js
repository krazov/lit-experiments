import { LitElement, html, css } from 'https://unpkg.com/lit/index.js?module';
import { request } from '../util/request.util.js';

import './todo-list-item.js';

class TodoList extends LitElement {
    static get properties() {
        return {
            list: { type: Array },
            mode: { type: String },
            order: { type: String },
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .is-done {
                color: gainsboro;
            }

            .is-pending {}
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
        window.addEventListener('list:mode:has-updated', this.updateMode);
        window.addEventListener('list:order:has-updated', this.updateOrder);
    }

    disconnectedCallback() {
        window.removeEventListener('todo:list-updated', this.updateList);
        window.removeEventListener('list:mode:has-updated', this.updateMode);
        window.removeEventListener('list:order:has-updated', this.updateOrder);
        super.disconnectedCallback();
    }

    async hydrateList() {
        const [todos, mode, order] = await Promise.all([
            request('todo:request:list'),
            request('request:list:mode'),
            request('request:list:order'),
        ]);

        this.list = todos;
        this.mode = mode;
        this.order = order;
    }

    updateList = (event) => {
        const { detail: todos = {} } = event;
        this.list = todos;

        console.log('List updated with', todos);
    }

    updateMode = (event) => {
        const { detail: mode } = event;
        this.mode = mode;
    };

    updateOrder = (event) => {
        const { detail: order } = event;
        this.order = order;
    };

    updateTodo = (event) => {
        const { detail: { id, task, isDone } } = event;

        window.dispatchEvent(new CustomEvent('todo:update', { detail: {
            id,
            ...typeof task =='string' && { task },
            ...typeof isDone == 'boolean' && { isDone },
        }}));
    };

    get todosList() {
        const listItems = this.list
            .filter(todo => {
                switch (this.mode) {
                    case 'all':
                        return true;
                    case 'pending':
                        return !todo.isDone;
                    case 'done':
                        return todo.isDone;
                    default:
                        throw Error('Wrong mode value.');
                }
            })
            .sort((todo1, todo2) => {
                switch (this.order) {
                    case 'by-id':
                        return todo1.id - todo2.id;
                    case 'pending-first':
                        return todo1.isDone && todo2.isDone ? 0 : !todo1.isDone && todo2.isDone ? -1 : 1;
                    case 'done-first':
                        return todo1.isDone && todo2.isDone ? 0 : !todo1.isDone && todo2.isDone ? 1 : -1;
                    default:
                        throw Error('Wrong order value.');
                }
            })
            .map(todo =>
                html`
                    <todo-list-item
                        class="${todo.isDone ? 'is-done' : 'is-pending'}"
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
