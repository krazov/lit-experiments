import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

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

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('main-app-title-updated', this.updateTitle);
    }

    disconnectedCallback() {
        window.removeEventListener('main-app-title-updated', this.updateTitle);
        super.disconnectedCallback();
    }

    updateTitle = (event) => {
        const { detail: { title } = {} } = event;
        if (title === undefined) return;
        this.title = title;
    }

    render() {
        return html`
            <div class="app">
                <h1 class="app-title">${this.title}</h1>
                <div>Test</div>
            </div>
        `;
    }
}

customElements.define('main-app', MainApp);
