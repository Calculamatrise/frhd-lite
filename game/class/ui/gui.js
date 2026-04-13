export default class {
	static #styleSheet;
	static getStyleSheet() {
		if (this.#styleSheet) return this.#styleSheet;

		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(`
:host {
	--accent: hsl(192 50% 60%);
	accent-color: var(--accent);
	/* color: hsl(180 4% 91%); */
	color: var(--color, currentColor);
	position: relative;
}

:host(.editor) > :not(slot) { margin-block: 45px }

.overlay, .hud {
	inset: 0;
	pointer-events: none;
	position: absolute;
}

.hud {
	display: flex;
	flex-direction: column;
}
		`);
		this.#styleSheet = styleSheet;
		return styleSheet
	}

	_container = null;
	_root = null;
	styleSheet = this.constructor.getStyleSheet();
	constructor(t) {
		Object.defineProperties(this, {
			_container: { enumerable: false },
			_root: { enumerable: false }
		});
		this._container = t;
		const shadowRoot = t.shadowRoot || t.attachShadow({ mode: 'open' });
		shadowRoot.children.length === 0 && shadowRoot.appendChild(document.createElement('slot'));
		this._root = shadowRoot;
		this.insertStyleSheet(this.styleSheet)
	}

	appendChild(node) {
		this._root.appendChild(node)
	}

	insertStyleSheet(styleSheet) {
		this._root.adoptedStyleSheets.push(styleSheet)
	}

	static createElement(type, options = {}) {
		const callback = arguments[arguments.length - 1];
		const element = document.createElement(type.replace(/[\.#].+/g, ''));
		const matchId = type.match(/(?<=#)([^\.]+((?<=\\)\.)?)+/);
		null !== matchId && (element.setAttribute('id', matchId[0].replace(/\\/g, '')),
		type = type.replace('#' + matchId[0], ''));
		const classList = type.match(/(?<=\.)([^\.#]+((?<=\\)\.)?)+/g);
		null !== classList && element.classList.add(...classList.map(name => name.replace(/\\/g, '')));
		if ('innerText' in options) {
			element.innerText = options.innerText,
			delete options.innerText;
		}

		for (const attribute in options) {
			if (typeof options[attribute] == 'object') {
				if (options[attribute] instanceof Array) {
					if (/^children$/i.test(attribute)) {
						element.append(...options[attribute]);
					} else if (/^classlist$/i.test(attribute))
						element.classList.add(...options[attribute]);
				} else if (/^(dataset|style)$/i.test(attribute))
					Object.assign(element[attribute.toLowerCase()], options[attribute]);
				else continue;
			} else if (typeof options[attribute] == 'function') {
				if (/^mutation$/i.test(attribute)) {
					typeof options['MutationObserverOptions'] == 'object' && (new MutationObserver(options[attribute]).observe(element, options['MutationObserverOptions']),
					delete options['MutationObserverOptions']);
				} else if (element['on' + attribute] !== undefined)
					element.addEventListener(attribute, options[attribute], { passive: !/\.preventDefault\(\)/g.test(options[attribute].toString()) });
				else continue;
			} else continue;
			delete options[attribute]
		}

		Object.assign(element, options);
		typeof callback == 'function' && callback(element);
		return element
	}
}