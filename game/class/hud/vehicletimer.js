export default class {
	static #styleSheet;
	static getStyleSheet() {
		if (this.#styleSheet) return this.#styleSheet;

		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(`
.vehicle-timer {
	background-color: rgba(242,144,66,.5);
	border: 3px solid rgba(242,144,66,1);
	border-radius: .75em;
	bottom: 10px;
	font-family: 'helsinki';
	font-size: 17.5px;
	left: 0;
	line-height: 1em;
	margin-inline: auto;
	max-height: 40%;
	padding: .25em 1.25em;
	pointer-events: none;
	position: absolute;
	right: 0;
	transition: opacity 200ms ease;
	user-select: none;
	width: fit-content;
}

.vehicle-timer:hover { opacity: .5 }
		`);
		this.#styleSheet = styleSheet;
		return styleSheet
	}

	get visible() { return this.element?.style.getPropertyValue('display') == 'none' }
	set visible(value) { this.element?.style.setProperty('display', value ? 'block' : 'none') }

	settings = null;
	constructor(t) {
		Object.defineProperties(this, {
			scene: { value: t, writable: true },
			gui: { value: t.game.gui, writable: true }
		});
		this.settings = t.settings;
		this.removePlayer()
	}

	init() {
		if (this.element) return;

		const styleSheet = this.constructor.getStyleSheet();
		this.gui.insertStyleSheet(styleSheet);

		const container = this.gui.constructor.createElement('div.vehicle-timer');
		container.textContent = "00:00";
		this.element = container;
		this.gui.appendChild(this.element)
	}

	setPlayer(t) {
		this.player = t
	}

	removePlayer() {
		this.player = null
	}

	playerAddedTime(t) {
		this.player === t && this.init()
	}

	fixedUpdate() {
		this.player?._tempVehicleTicks > 0 ? this.updateTime() : this.visible = false
	}

	updateTime() {
		let e = this.player._tempVehicleTicks
		  , i = this.scene.settings.drawFPS
		  , s = (e / i).toFixed(2)
		  , n = 10 > s ? '0' : '';
		n += s;
		if (n !== this.element.textContent) this.element.textContent = n;
		this.visible = true
	}

	close() {
		this.player = null;
		this.scene = null;
		this.settings = null
	}
}