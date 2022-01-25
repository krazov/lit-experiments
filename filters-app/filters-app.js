import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit-if-defined';
import { request } from '../util/request.util.js';
import { emit } from '../util/emit.util.js';

class TabsApp extends LitElement {
    static get properties() {
        return {
            title: { type: String },
            modes: { type: Object },
            mode: { type: String },
            orders: { type: Object },
            order: { type: String },
        }
    }

    static get styles() {
        return css`
            :host {
                background-color: gainsboro;
                display: flex;
                justify-content: space-evenly;
                margin: 10px 0;
                padding: 10px;
            }

            div {
                display: flex;
                justify-content: space-evenly;
                width: 40%;
            }

            span:hover {
                cursor: pointer;
                text-decoration: underline;
            }

            .is-active {
                font-weight: bold;
            }
        `;
    }

    constructor() {
        super();
        request('request:list:all').then(payload => {
            const {
                modes,
                mode,
                orders,
                order,
            } = payload;

            this.modes = modes;
            this.mode = mode;
            this.orders = orders;
            this.order = order;
        });
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('list:mode:has-updated', this.updateMode);
        window.addEventListener('list:order:has-updated', this.updateOrder);
    }

    disconnectedCallback() {
        window.removeEventListener('list:mode:has-updated', this.updateMode);
        window.removeEventListener('list:order:has-updated', this.updateOrder);
        super.disconnectedCallback();
    }

    setMode = (event) => {
        const { path: [element] } = event;
        const mode = element.dataset.mode;
        emit('list:mode:update', mode);
    };

    updateMode = (event) => {
        const { detail: mode } = event;
        this.mode = mode;
    };

    setOrder = (event) => {
        const { path: [element] } = event;
        const order = element.dataset.order;
        emit('list:order:update', order);
    };

    updateOrder = (event) => {
        const { detail: order } = event;
        this.order = order;
    };

    get modesTemplate() {
        return [...this.modes].map(([value, label]) => html`
            <span
                data-mode="${value}"
                class="${ifDefined(value == this.mode ? 'is-active' : undefined)}"
                @click="${this.setMode}"
            >${label}</span>`);
    }

    get ordersTemplate() {
        return [...this.orders].map(([value, label]) => html`
            <span
                data-order="${value}"
                class="${ifDefined(value == this.order ? 'is-active' : undefined)}"
                @click="${this.setOrder}"
            >${label}</span>`);
    }

    render() {
        return html`
            <div class="modes">${this.modesTemplate}</div>
            <div class="orders">${this.ordersTemplate}</div>
        `;
    }
}

customElements.define('filters-app', TabsApp);
