import Cartesian from "../math/cartesian.js";

export default class {
	static #styleSheet;
	static getStyleSheet() {
		if (this.#styleSheet) return this.#styleSheet;

		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(`
.race-progress {
	background-color: hsl(0 0 40% / 33%);
	border: 1px solid hsl(0 0 40% / 15%);
	border-bottom-color: transparent;
	border-radius: 1em;
	/* bottom: 10px; */
	font-family: 'helsinki';
	font-size: 11px;
	left: 0;
	line-height: 1em;
	margin-inline: auto;
	max-height: 24px;
	min-width: 150px;
	padding: .25em;
	pointer-events: none;
	position: absolute;
	right: 0;
	text-align: center;
	top: 8px;
	transition: opacity 200ms ease;
	user-select: none;
	width: 33%;
	z-index: 0;
}

.race-progress::before {
	--inset: 2px;
	background-color: hsl(53deg 95% 59% / 85%);
	border-radius: inherit;
	bottom: 0;
	content: "";
	height: calc(100% - var(--inset) * 2);
	/* inset: 1px; */
	left: 0;
	margin: var(--inset);
	position: absolute;
	top: 0;
	width: calc(1% * var(--progress, 0) - var(--inset) * 2);
	z-index: -1;
}

.race-progress::after { content: attr(data-distance) }
.race-progress[data-display=distance]::after { content: attr(data-distance) attr(unit, "M") }
.race-progress:not([data-distance]) { display: none }
		`);
		this.#styleSheet = styleSheet;
		return styleSheet
	}

	get enabled() { return window.lite?.storage.get('raceProgress') }
	set enabled(value) {
		if (value) this.element?.style.removeProperty('display');
		else this.element?.style.setProperty('display', 'none')
	}

	constructor(t) {
		Object.defineProperties(this, {
			scene: { value: t, writable: true },
			gui: { value: t.game.gui, writable: true }
		});
		this.init()
	}

	init() {
		if (this.element) return console.warn('[Game] Race progress already initialized!');

		const styleSheet = this.constructor.getStyleSheet();
		this.gui.insertStyleSheet(styleSheet);

		const container = this.gui.constructor.createElement('div.race-progress');
		this.element = container;

		if (!this.enabled) this.element.style.setProperty('display', 'none');

		this.gui.appendChild(this.element)
	}

	update(t) {
		if (!this.enabled) return;

		let e = this.scene.track
		  , i = t._powerupsConsumed.targets
		  , s = i.length / e.targetCount
		  , n = e.targets.find(t => t.id == i.at(-1)) || { x: 0, y: 0 }
		  , p = new Cartesian(n.x, n.y) // anchor point A
		  , x = e.targets.length <= 1 ? e.targets : Array(...(t._tempVehicle || t._baseVehicle).masses).map(t => e.targets.filter(t => !i.includes(t.id)).sort((a, b) => new Cartesian(a.x, a.y).sub(t.pos).len() - new Cartesian(b.x, b.y).sub(t.pos).len())[0])
		  , q = x.sort((a, b) => p.sub(new Cartesian(a.x, a.y).len()) - p.sub(new Cartesian(b.x, b.y).len()))[0] // next target
		  , v = q && new Cartesian(q.x, q.y)
		  , w = (q && p.sub(v).len()) ?? 0 // len from previous target
		  , y = (q && Math.min(...(t._tempVehicle || t._baseVehicle).masses.map(t => v.sub(t.pos).len() /* - ~~t.radius / 2*/).sort((a, b) => a - b))) ?? 0 // distance to next target
		  , d = Math.min(1, Math.max(0, (w - y) / w)) * 100 / e.targetCount
		  , m = i.length > 0 && Array(...(t._tempVehicle || t._baseVehicle).masses).map(t => new Cartesian(n.x, n.y).sub(t.pos).len()).sort((a, b) => a - b)[0];
		s += d / 100;
		this.oldDelta = m ?? null;
		this.element.style.setProperty('--progress', s * 100);

		const showDistance = y <= 500 && (!this.oldDelta || !(this.oldDelta <= 250));
		this.element.dataset.display = showDistance ? 'distance' : 'targets';

		const text = showDistance ? Math.floor(y) : (i.length + '/' + e.targetCount);
		if (text != this.element.dataset.distance) this.element.dataset.distance = text
	}
}