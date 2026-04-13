export default class {
	static #styleSheet;
	static getStyleSheet() {
		if (this.#styleSheet) return this.#styleSheet;

		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(`
.message {
	color: var(--color, currentColor);
	font-family: 'helsinki';
	font-size: 12pt;
	left: 0;
	margin: 0 auto;
	max-width: 75%;
	opacity: .975;
	overflow: hidden;
	pointer-events: none;
	position: absolute;
	right: 0;
	text-align: center;
	top: clamp(2em, 100px, 15%);
	width: fit-content;
}

.message[outline]::before {
	-webkit-text-stroke: 2px var(--outline, transparent);
	content: attr(outline);
	position: absolute;
	z-index: -1;
}
		`);
		this.#styleSheet = styleSheet;
		return styleSheet
	}

	color = "#000";
	element = null;
	message = null;
	constructor(t) {
		Object.defineProperties(this, {
			gui: { value: t.game.gui, writable: true },
			timeout: { value: false, writable: true }
		});
		this.init()
	}

	init() {
		if (this.element) return console.warn('[Game] MessageManager already initialized!');

		const styleSheet = this.constructor.getStyleSheet();
		this.gui.insertStyleSheet(styleSheet);

		this.element = this.gui.constructor.createElement('p.message');
		this.gui.appendChild(this.element)
	}

	show(t, e, i, s) {
		if (!this.element) this.init();

		this.hide();
		this.element.textContent = t;
		this.message = t;
		this.timeout = e;
		i && (this.color = i,
		this.element.style.setProperty('--color', i));
		s && (this.outline = s,
		this.element.setAttribute('outline', t),
		this.element.style.setProperty('--outline', s))
	}

	hide() {
		if (!this.element) return;

		this.element.textContent = null;
		this.element.style.removeProperty('--color');
		this.element.removeAttribute('outline');
		this.element.style.removeProperty('--outline');
		this.message = null;
		this.color = !1;
		this.outline = !1
	}

	onStateChange(oldState, newState) {
		if (oldState.paused === newState.paused) return;
		if (newState.paused) {
			this.element.style.removeProperty('--color');
			this.element.removeAttribute('outline');
			this.element.style.removeProperty('--outline');
		} else {
			this.color && this.element.style.setProperty('--color', this.color);
			this.outline && (this.element.setAttribute('outline', this.message),
			this.element.style.setProperty('--outline', this.outline));
		}
		this.element.textContent = newState.paused ? 'Paused - Press Spacebar to Continue' : this.message;
	}

	update() {
		this.timeout !== !1 && --this.timeout <= 0 && this.hide()
	}
}