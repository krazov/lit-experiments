import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

class TodoListItem extends LitElement {
    static get properties() {
        return {
            id: { type: Number },
            task: { type: String },
            isDone: { type: Boolean, attribute: 'is-done' },
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .todo-list-item-done {
                cursor: pointer;
            }
        `;
    }

    updateStatus = () => {
        this.dispatchEvent(new CustomEvent('update-todo', { detail: {
            id: this.id,
            isDone: !this.isDone,
        } }));
    };

    render() {
        return html`
            <span class="todo-list-item-id">#${this.id}:</span>
            <span class="todo-list-item-task" data-action="edit">${this.task}</span>
            <span class="todo-list-item-done" @click="${this.updateStatus}">${this.isDone ? '☑' : '☐'}</span>
        `;
    }
}

customElements.define('todo-list-item', TodoListItem);
