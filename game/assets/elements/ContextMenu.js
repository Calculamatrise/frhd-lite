class ContextMenu extends HTMLElement {
	static styleSheet = (() => {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`
			:host, .sub-menu {
				-webkit-user-select: none;
				align-items: start;
				background-color: var(--background-color, hsl(0 0% 6%));
				border: 1px solid var(--border-color, hsl(0 0% 50% / 5%));
				border-radius: .4em;
				box-shadow: 0 0 .75em 0 hsl(0 0% 0% / 35%);
				display: flex;
				flex-direction: column;
				min-width: 100px;
				padding: .2em;
				position: fixed;
				text-align: left;
				touch-action: pan-y;
				user-select: none;
				z-index: 1001;
			}

			:host:not(:has(.sub-menu)) { overflow: hidden auto }

			@media (prefers-color-scheme: light) {
				:host { background-color: hsl(0 0% 95%) }
			}

			hr {
				background-color: var(--border-color, hsl(0 0% 50% / 15%));
				border: none;
				height: 1px;
				width: 90%;
			}

			:not(br, div, hr) {
				border-radius: .3em;
				color: var(--color, currentColor);
				padding: .6em .7em;
				padding-right: 1.25em;
				text-align: left;
			}

			button {
				background: none;
				border: none;
				min-width: max-content;
				outline-color: transparent;
				transition: background-color 80ms, outline .2s;
				width: 100%;
				will-change: background-color, outline;
			}

			.danger { color: var(--danger-color, hsl(0, 75%, 50%)) }
			@media (hover: hover) {
				button:not(:disabled):hover { background-color: var(--hover-color, hsl(0 0% 40% / 10%)) }
				button:not(:disabled, :has(> .sub-menu)):hover:active { outline: 1px solid var(--hover-active-color, hsl(0 0% 40% / 25%)) }
			}

			@media (hover: none) {
				button:not(:disabled, :has(> .sub-menu)):active { background-color: var(--hover-color, hsl(0 0% 40% / 10%)) }
			}

			:has(> .sub-menu) { position: relative }
			:has(> .sub-menu)::after {
				color: hsl(0deg 0% 50% / 75%);
				content: "❯";
				display: inline-block;
				font-size: .75em;
				height: 100%;
				line-height: 100%;
				margin-left: 2.25em;
				vertical-align: middle;
			}

			/* .sub-menu {
				left: 100%;
				top: 0;
			} */

			:not(:hover) > .sub-menu:not(:hover, [visible], :has([visible])) { display: none }
			:not(:hover) > .sub-menu:not(:hover) {
				pointer-events: none;
				visibility: hidden;
			}
		`);
		return sheet
	})();

	#boundRemove = null;
	#handlePointerDown = null;
	options = null;
	constructor(options) {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.adoptedStyleSheets = [this.constructor.styleSheet];
		const handler = {
			set: (t, p, value, r) => {
				if (value instanceof Object)
					value = new Proxy(value, handler);
				const returnValue = Reflect.set(t, p, value, r);
				this.handleOptionsChanged(t, p, value, r, returnValue);
				return returnValue
			}
		};
		this.options = new Proxy([], handler);
		if (options instanceof Object && typeof options[Symbol.iterator] == 'function') {
			this.setOptions(options)
		}
	}

	_addCloseListeners() {
		window.addEventListener('blur', this.#boundRemove = this.remove.bind(this), { once: true, passive: true });
		window.addEventListener('pointerdown', this.#handlePointerDown = ({ target }) => {
			if (null !== target.closest(this.localName)) return;
			this.remove()
		}, { passive: true });
		window.addEventListener('scroll', this.#boundRemove, { once: true, passive: true });
		window.navigation && navigation.addEventListener('navigatesuccess', this.#boundRemove, { once: true, passive: true })
	}

	_removeCloseListeners() {
		window.removeEventListener('blur', this.#boundRemove);
		window.removeEventListener('pointerdown', this.#handlePointerDown);
		window.removeEventListener('scroll', this.#boundRemove);
		window.navigation && navigation.removeEventListener('navigatesuccess', this.#boundRemove);
		this.#boundRemove = null
	}

	connectedCallback() {
		this.addEventListener('contextmenu', event => event.preventDefault());
		this.addEventListener('click', this.remove, { once: true, passive: true });
		this._addCloseListeners()
	}

	disconnectedCallback() {
		this._removeCloseListeners()
	}

	handleOptionsChanged() {
		this.render()
	}

	_updateSubMenuPositions() {
		for (const subMenu of this.shadowRoot.querySelectorAll('.sub-menu')) {
			const parentContainer = subMenu.parentElement.closest('.sub-menu') || this;
			subMenu.toggleAttribute('visible', true);
			requestAnimationFrame(() => {
				const parentRect = parentContainer.getBoundingClientRect()
					, endX = parentRect.right + subMenu.clientWidth
					, endY = parentRect.top + subMenu.clientHeight;
				subMenu.toggleAttribute('visible', false);
				subMenu.removeAttribute('style');
				subMenu.style.setProperty(endX > window.innerWidth ? 'right' : 'left', '100%');
				subMenu.style.setProperty(endY > window.innerHeight ? 'bottom' : 'top', 0)
			})
		}
	}

	/**
	 * Add options
	 * @param {object} data
	 * @param {string} data.name
	 * @param {Array} [data.styles]
	 * @param {string} [data.type]
	 */
	addOption(data) {
		const element = this.constructor._createOption(data);
		this.shadowRoot.appendChild(element);
		this.options.push(data)
	}

	clear() {
		this.shadowRoot.replaceChildren(),
		this.options.splice(0)
	}

	render() {
		this.shadowRoot.replaceChildren();
		for (const option of this.options) {
			const element = this.constructor._createOption(option);
			this.shadowRoot.appendChild(element)
		}
	}

	setOptions(options) {
		if (!(options instanceof Object) || typeof options[Symbol.iterator] != 'function')
			throw new TypeError("First positional argument: options must be of type: object (iterable)");
		for (const option of options.filter(option => option instanceof Object))
			this.addOption(option)
	}

	setPosition({ clientX, clientY } = {}) {
		clientX + this.clientWidth > window.innerWidth && (clientX -= this.clientWidth);
		clientY + this.clientHeight > window.innerHeight && (clientY - this.clientHeight < 0 && this.style.setProperty('max-height', this.clientHeight + (clientY - this.clientHeight) + 'px'),
		clientY -= this.clientHeight);
		this.style.setProperty('left', clientX + 'px');
		this.style.setProperty('top', clientY + 'px');
		this._updateSubMenuPositions();
		return { clientX, clientY }
	}

	show(event = null) {
		!document.body.contains(this) && document.body.appendChild(this);
		event instanceof Object && this.setPosition(event)
	}

	static create(options, event) {
		let contextMenu = document.querySelector('body > context-menu');
		if (!contextMenu) {
			contextMenu = new this();
		} else {
			contextMenu.clear();
		}

		contextMenu.setOptions(options);
		contextMenu.show(event);
		event || console.warn("No event object was passed. Unable to set relative position.");
		return contextMenu
	}

	static _createOption(data) {
		if (typeof data != 'object' || data === null)
			throw new TypeError("First positional argument must be of type: object");
		const type = typeof data.type == 'string' && data.type.toLowerCase() || 'button'
			, element = document.createElement(type);
		if (/^(b|h)r$/i.test(type)) return element;
		element.textContent = data.name || "Unknown action";
		for (let key in data) {
			if (typeof data[key] == 'undefined' || data[key] === null) continue;
			else if (typeof data[key] == 'function' && element['on' + key] !== undefined) {
				element.addEventListener(key, data[key], { passive: !/\.preventDefault\(\)/g.test(data[key].toString()) });
				continue;
			}
			switch(key) {
			case 'disabled':
				element[key] = data[key];
				break;
			case 'options':
				element.dataset.type = 'sub-menu';
				const container = document.createElement('div');
				container.classList.add(element.dataset.type);
				for (const option of data[key])
					container.appendChild(this._createOption(option));
				element.appendChild(container);
				break;
			case 'styles':
				if (typeof data[key][Symbol.iterator] != 'function') continue;
				element.classList.add(...Array.from(data[key].values()));
				break;
			}
		}
		typeof data.callback == 'function' && data.callback(element);
		return element
	}
}

Object.defineProperty(self, 'ContextMenu', {
	value: ContextMenu,
	writable: true
});
customElements.define('context-menu', ContextMenu);