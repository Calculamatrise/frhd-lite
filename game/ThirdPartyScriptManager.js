{
	const Events = {
		ButtonDown: 'game:buttonDown',
		ButtonUp: 'game:buttonUp',
		CheckpointCreate: 'game:checkpointCreate',
		Draw: 'game:draw',
		GameReady: 'game:ready',
		GameStateChange: 'game:stateChange',
		ModHook: 'mod:hook',
		PlayerUpdate: 'game:playerUpdate',
		// RaceStart: 'game:initialKeypress',
		Tick: 'game:tick'
	};

	class ThirdPartyScriptManager extends EventTarget {
		static Events = Events;

		#cache = new Map();
		#loaded = !1;
		#parent = null;
		constructor(parent = null) {
			super();
			// Property name options: externalScripts, mods,
			// thirdPartyScripts, scriptManager, modManager
			Object.defineProperty(parent, 'mods', { value: this, writable: true });
			parent.on('stateChange', state => {
				if (state.preloading === !1 && this.#loaded === !1)
					this.#loaded = (this.dispatchEvent(new CustomEvent(Events.GameReady, { detail: parent.game })), !0);
				this.#loaded && this.dispatchEvent(new CustomEvent(Events.GameStateChange, { detail: state }))
			});
			this.#parent = parent;
			self.hasOwnProperty('navigation') && navigation.addEventListener('navigate', e => e.navigationType != 'replace' && (this.#loaded = !1), { passive: true })
		}

		get game() { return this.#parent.game }

		hook(instance, { name, overwrite } = {}) {
			name ??= instance.name ?? instance._name;
			if (overwrite || !this.#cache.has(name)) {
				this.#cache.set(name, instance);
				if (!this.hasOwnProperty(name)) {
					Object.defineProperty(this, name, {
						configurable: true,
						value: instance
					});
					this.dispatchEvent(new CustomEvent(Events.ModHook, { detail: name }));
				}
			}
			return this.#cache.get(name)
		}

		includes(name) {
			return this.#cache.has(name)
		}
	}

	self.ThirdPartyScriptManager || Object.defineProperty(self, 'ThirdPartyScriptManager', {
		value: ThirdPartyScriptManager,
		writable: true
	});

	self.ModManager || Object.defineProperty(self, 'ModManager', {
		value: new ThirdPartyScriptManager(GameManager),
		writable: true
	});
}