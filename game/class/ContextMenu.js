export default class ContextMenu extends HTMLElement {
	#pointerdownListener = null;
	options = [];
	constructor() {
		super(),
		this.constructor.contextMenu = this,
		this.addEventListener('contextmenu', event => event.preventDefault()),
		Object.defineProperty(this, '_removeListener', { value: this.remove.bind(this), writable: true });
		if (!this.constructor.debug) {
			this.addEventListener('click', this.remove, { once: true, passive: true }),
			this.addEventListener('mousewheel', event => this.clientHeight >= this.scrollHeight && event.preventDefault()),
			window.addEventListener('blur', this._removeListener, { once: true, passive: true }),
			window.addEventListener('scroll', this._removeListener, { once: true, passive: true }),
			window.addEventListener('pointerdown', this.#pointerdownListener = event => {
				if (null !== event.target.closest('context-menu')) return window.addEventListener('pointerdown', this.#pointerdownListener, { passive: true, once: true });
				this.remove()
			}, { passive: true, once: true });
		}
		window.navigation && navigation.addEventListener('navigatesuccess', this._removeListener, { once: true, passive: true })
	}

	_updateSubMenuPositions({ clientX, clientY } = {}) {
		for (let subMenu of this.querySelectorAll('.sub-menu')) {
			subMenu.removeAttribute('style'),
			subMenu.style.setProperty(clientX + subMenu.parentElement.offsetLeft + subMenu.parentElement.clientWidth + subMenu.clientWidth > window.innerWidth ? 'right' : 'left', '100%'),
			subMenu.style.setProperty(clientY + subMenu.parentElement.offsetTop + subMenu.clientHeight > window.innerHeight ? 'bottom' : 'top', 0)
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
		// add sub-menu type option
		let type = typeof data.type == 'string' && data.type.toLowerCase() || 'button';
		let element = this.appendChild(document.createElement(type));
		this.options && this.options.push(data);
		if (/^(b|h)r$/i.test(type)) return element;
		element.innerText = data.name;
		for (let key in data) {
			if (typeof data[key] == 'undefined') continue;
			if (typeof data[key] == 'function' && element['on' + key] !== undefined) {
				element.addEventListener(key, data[key], { passive: !/\.preventDefault\(\)/g.test(data[key].toString()) });
				continue;
			}
			switch(key) {
			case 'disabled':
				element[key] = data[key];
				break;
			case 'options':
				element.dataset.type = 'sub-menu';
				let container = document.createElement('div');
				container.classList.add(element.dataset.type);
				for (let option of data[key]) {
					this.addOption.call(container, option);
				}
				element.appendChild(container);
				break;
			case 'styles':
				if (typeof data[key][Symbol.iterator] != 'function') continue;
				element.classList.add(...Array.from(data[key].values()))
			}
		}
		typeof data.callback == 'function' && data.callback(element);
		return element
	}

	clear() {
		this.options.splice(0),
		this.replaceChildren()
	}

	setPosition({ clientX, clientY, pageX, pageY } = {}) {
		this._updateSubMenuPositions(...arguments),
		clientX + this.clientWidth > window.innerWidth && (pageX -= this.clientWidth),
		clientY + this.clientHeight > window.innerHeight && (pageY -= this.clientHeight),
		this.style.setProperty('left', pageX + 'px'),
		this.style.setProperty('top', pageY + 'px');
		return { pageX, pageY }
	}

	remove(event) {
		if (null === this.constructor.contextMenu) return;
		window.removeEventListener('blur', this._removeListener),
		window.removeEventListener('scroll', this._removeListener),
		window.removeEventListener('pointerdown', this.#pointerdownListener),
		window.navigation && navigation.removeEventListener('navigatesuccess', this._removeListener),
		super.remove(),
		this.constructor.contextMenu = null,
		this.dispatchEvent(new CustomEvent('close', {
			detail: event && event.target.innerText && event.target.innerText.toLowerCase()
		}))
	}

	static contextMenu = null;
	static debug = false;
	static create(options, event) {
		if (!this.contextMenu) {
			this.contextMenu = new this();
		} else {
			this.contextMenu.clear();
		}

		for (let option of options.filter(option => option instanceof Object)) {
			this.contextMenu.addOption(option);
		}

		document.body.appendChild(this.contextMenu),
		this.contextMenu.setPosition(event);
		return this.contextMenu
	}
}

customElements.define('context-menu', ContextMenu);