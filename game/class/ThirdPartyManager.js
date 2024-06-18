import EventEmitter from "./EventEmitter.js";

export default class ThirdPartyManager extends EventEmitter {
	#loaded = !1;
	#cache = new Map();
	#parent = null;
	constructor(parent) {
		super(),
		parent.thirdParty = this,
		parent.on('stateChange', state => {
			if (state.preloading === !1 && this.#loaded === !1)
				this.#loaded = (this.emit('ready', parent.game), !0);
			this.#loaded && this.emit('stateChange', state)
		}),
		this.#parent = parent,
		window.hasOwnProperty('navigation') && navigation.addEventListener('navigate', () => this.#loaded = !1, { passive: true })
	}

	hook(instance, { name, overwrite } = {}) {
		name ??= instance.name ?? instance._name;
		if (overwrite || !this.#cache.has(name)) {
			this.#cache.set(name, instance);
			if (!this.hasOwnProperty(name)) {
				this[name] = instance;
			}
		}
		return this.#cache.get(name)
	}

	includes(name) {
		return this.#cache.has(name)
	}
}

let GameManager = window.GameManager;
let start = Date.now();
while (!GameManager) {
	GameManager = window.GameManager;
	if (Date.now() - start > 5e3)
		console.warn('GameManager load timed out.');
		break;
}

GameManager && (window.ModManager ||= new ThirdPartyManager(GameManager))