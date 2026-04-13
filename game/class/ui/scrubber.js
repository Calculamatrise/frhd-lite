export default class TrackScrubber extends HTMLElement {
	static styleSheet = (() => {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`
:host {
	--container-height: .85em;
	--value: attr(value, 0);
	align-items: center;
	box-sizing: border-box;
	display: flex;
	height: var(--container-height);
	padding: 0 .5em;
	pointer-events: stroke;
	position: relative;
	touch-action: none;
	user-select: none;
	width: 100%;
}

:host(:hover) { cursor: pointer }
:host([tooltip]:hover)::after {
	bottom: calc(100% + .5em);
	content: attr(tooltip);
	font-size: .85em;
	left: var(--offset-x);
	position: absolute;
}

:host > .bar {
	/* --value: 10; */ /* testing */
	background-color: hsl(0 0% 25% / 25%);
	border-radius: .5em;
	height: 35%;
	pointer-events: all;
	transition: height 120ms ease;
	user-select: none;
	width: 100%;
	will-change: height;
}

:host(:hover) > .bar { height: 50% }
.bar > .value {
	align-items: center;
	background-color: var(--accent);
	border-radius: inherit;
	display: flex;
	height: 100%;
	position: relative;
	width: calc(var(--value, 0) * 1%);
	transition: width 80ms;
}

.bar > .value::after {
	--size: .85em;
	aspect-ratio: 1;
	background-color: inherit;
	border-radius: 50%;
	box-sizing: border-box;
	content: "";
	/* height: 150%; */
	height: var(--size);
	position: absolute;
	right: calc(var(--size) / -2);
	transition: height 120ms ease, width 120ms ease, right 120ms ease;
}

:host(:hover) > .bar > .value::after { --size: 1em }
		`.trim());
		return sheet
	})();

	#pointerDown;
	#pointerMove;
	#pointerUp;

	max = 0;

	get value() { return parseFloat(this.getAttribute('value')) || 0 }
	set value(t) {
		if (this.value == t) return;
		this.setAttribute('value', t);
		this.dispatchEvent(new CustomEvent('change', { detail: t }))
	}

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.adoptedStyleSheets.push(this.constructor.styleSheet);

		const bar = document.createElement('div');
		bar.classList.add('bar');
		this.shadowRoot.appendChild(bar);

		const value = document.createElement('div');
		value.classList.add('value');
		bar.appendChild(value)
	}

	#getValue(event) {
		return Math.round(event.offsetX / parseInt(this.clientWidth) * parseInt(this.max))
	}

	#listen() {
		this.addEventListener('pointerdown', this.#pointerDown = function(event) {
			this.setPointerCapture(event.pointerId);
			this.dispatchEvent(new Event('seekStart'));
			this.seek(this.#getValue(event))
		}, { passive: true });
		this.addEventListener('pointermove', this.#pointerMove = function(event) {
			this.style.setProperty('--offset-x', event.offsetX + 'px');

			const value = this.#getValue(event);
			this.dispatchEvent(new CustomEvent('hover', {
				detail: {
					offset: {
						x: event.offsetX,
						y: event.offsetY
					},
					value
				}
			}));

			const isPointerDown = event.buttons & 1 == 1;
			if (!isPointerDown) return;

			this.seek(value)
		}, { passive: true });
		this.addEventListener('pointerup', this.#pointerUp = function(event) {
			this.releasePointerCapture(event.pointerId);
			this.dispatchEvent(new Event('seekEnd'))
		}, { passive: true })
	}

	#unlisten() {
		this.removeEventListener('pointerdown', this.#pointerDown);
		this.removeEventListener('pointermove', this.#pointerMove);
		this.removeEventListener('pointerup', this.#pointerUp)
	}

	connectedCallback() {
		this.#listen()
	}

	disconnectedCallback() {
		this.#unlisten()
	}

	seek(t) {
		this.value = t;
		this.dispatchEvent(new CustomEvent('seek', { detail: t }))
	}
}

customElements.define('track-scrubber', TrackScrubber);