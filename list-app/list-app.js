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
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('todo:list-updated', this.updateList);
    }

    disconnectedCallback() {
        window.removeEventListener('todo:list-updated', this.updateList);
        super.disconnectedCallback();
    }

    updateList = (event) => {
        const { detail: todos = {} } = event;
        this.list = [...todos.values()];
        console.log(this.list);
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
