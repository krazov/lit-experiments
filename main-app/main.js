import { LitElement, html, css } from 'lit';

import 'todo-service';
import 'list-service';

import 'form-app';
import 'filters-app';
import 'list-app';

class MainApp extends LitElement {
    static get properties() {
        return {
            title: { type: String }
        }
    }

    static get styles() {
        return css`
            .app-title {
                font-variant: small-caps;
            }
        `;
    }

    constructor() {
        super();
        this.title = "An app";
    }

    render() {
        return html`
            <div class="app">
                <h1 class="app-title">${this.title}</h1>
                <form-app></form-app>
                <filters-app></filters-app>
                <todo-list></todo-list>
            </div>
        `;
    }
}

customElements.define('main-app', MainApp);
