import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

class TodoList extends LitElement {
    static get properties() {
        return {
            list: { type: Array },
        };
    }

    static get styles() {
        return css``;
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

    hydrateList() {
        // TODO: this part should be abstracted as well, but I don’t see where it falls yet
        const requestId = `todo:request:list:${Date.now()}`;

        window.addEventListener(requestId, this.updateList);
        window.dispatchEvent(new CustomEvent('todo:request:list', { detail: requestId }));
    }

    updateList = (event) => {
        const { detail: todos = {} } = event;
        this.list = todos;

        console.log('List updated with', todos);
    }

    get todosList() {
        const listItems = this.list.map(todo => html`<li class="todo-list-item">#${todo.id}: ${todo.task}</li>`);

        return html`<ul class="todo-list">${listItems}</ul>`;
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
