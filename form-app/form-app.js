import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

class FormApp extends LitElement {
    static get properties() {
        return {
            legend: { type: String },
        }
    }

    constructor() {
        super();
        this.legend = 'Add a todo';
    }

    static get styles() {
        return css``;
    }

    submit(event) {
        event.preventDefault();

        // note: in a full-fledged app, some sort of abstraction would have to be build, but for now it’s fine
        const input = this.shadowRoot.querySelector('form input[name="task"]');
        const task = input.value;
        input.value = '';

        if (task) {
            window.dispatchEvent(new CustomEvent('todo:add', { detail: { task } }));
        }
    }

    render() {
        return html`
            <form @submit="${this.submit}">
                <fieldset>
                    <legend>${this.legend}</legend>
                    <label>Task:</label>
                    <input name="task" type="text">
                    <button>Add</button>
                </fieldset>
            </form>
        `;
    }
}

customElements.define('form-app', FormApp);
