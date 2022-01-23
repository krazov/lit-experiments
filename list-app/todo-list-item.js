import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

const inputValue = (formElement) => formElement.querySelector('input').value;

class TodoListItem extends LitElement {
    static get properties() {
        return {
            id: { type: Number },
            task: { type: String },
            isDone: { type: Boolean, attribute: 'is-done' },
            isBeingEdited: { type: Boolean },
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .todo-list-item-task {
                display: inline;
            }

            .todo-list-item-done {
                cursor: pointer;
            }
        `;
    }

    constructor() {
        super();
        this.isBeingEdited = false;
    }

    get taskName() {
        return this.isBeingEdited
            ? html`
                <form class="todo-list-item-task" @submit=${this.updateName}>
                    <input value="${this.task}" @blur=${this.cancelEdit}>
                </span>`
            : html`<span class="todo-list-item-task" @click="${this.toggleEdit}">${this.task}</span>`
    }

    toggleEdit = () => {
        this.isBeingEdited = true;
    };

    /**
     * @param {SubmitEvent} event
     */
    updateName = (event) => {
        event.preventDefault();
        this.isBeingEdited = false;

        const { path: [formElement] } = event;
        const task = inputValue(formElement);

        if (task == this.task) return;

        this.dispatchEvent(new CustomEvent('update-todo', { detail: {
            id: this.id,
            task,
        } }));
    };

    updateStatus = () => {
        this.dispatchEvent(new CustomEvent('update-todo', { detail: {
            id: this.id,
            isDone: !this.isDone,
        } }));
    };

    cancelEdit = () => {
        this.isBeingEdited = false;
    };

    updated() {
        if (!this.isBeingEdited) return;

        const inputElement = this.shadowRoot.querySelector('form input');
        inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
        inputElement.focus();
    }

    render() {
        return html`
            <span class="todo-list-item-id">#${this.id}:</span>
            ${this.taskName}
            <span class="todo-list-item-done" @click="${this.updateStatus}">${this.isDone ? '☑' : '☐'}</span>
        `;
    }
}

customElements.define('todo-list-item', TodoListItem);
