export default class {
	_cachedRect = null;
	_layoutDirty = true;
	actualHeight = 0;
	actualWidth = 0;
	alpha = 1;
	aspectRatio = null;
	background = null;
	cached = !1;
	canvas = null;
	color = null;
	container = null;
	// dominantAxis = null;
	font = { size: null };
	height = 0;
	overflow = true;
	padding = 0;
	scale = { x: 1, y: 1 };
	text = null;
	image = null;
	visible = true;
	width = 0;
	x = 0;
	y = 0;

	/**
	 * 
	 * @param {object} [options]
	 * @param {number} [options.alpha]
	 * @param {number} [options.aspectRatio]
	 * @param {string} [options.background] Hexadecimal colour value
	 * @param {string} [options.borderColor] Hexadecimal colour value
	 * @param {string} [options.color] Hexadecimal colour value
	 * @param {object} [options.font] Font properties
	 * @param {string} [options.font.family]
	 * @param {number} [options.font.size]
	 * @param {(number|string)} [options.height]
	 * @param {boolean} [options.overflow]
	 * @param {number} [options.padding]
	 * @param {object} [options.scale]
	 * @param {string} [options.text]
	 * @param {unknown} [options.image]
	 * @param {(number|string)} [options.width]
	 * @param {number|string} [options.x]
	 * @param {number|string} [options.y]
	 * @param {Container} [container]
	 */
	constructor(options = null, container = null) {
		Object.defineProperties(this, {
			cached: { enumerable: false },
			canvas: { enumerable: false },
			container: { enumerable: false },
			data: { value: null, writable: true }
		});
		if (options instanceof Object) {
			for (const key in options) {
				if (!Object.hasOwn(this, key)) continue;
				this[key] = options[key];
			}
		}
		this.setParent(container)
	}
	_calculateInheritance(property) {
		let component = this
		  , value = component[property]
		  , base;

		switch (property) {
		case 'x': base = component.actualWidth; break;
		case 'y': base = component.actualHeight; break;
		default: base = component.container?.['actual' + this.constructor._capitalize(property)] ?? 0
		}

		while (typeof value === 'string' && /\d+%/.test(value)) {
			component = component.container;
			base = component?.['actual' + this.constructor._capitalize(property)] ?? 0;
			value = this.constructor.parsePropertyValue(value, base)
		}

		return parseFloat(value) || 0
	}
	_calculateScale(axis) {
		const scale = this.constructor.inheritScale(this);
		return scale[axis] ?? 1
	}
	_calculateRelativeFontSize({ height, initial, max, min, padding, width } = {}) {
		let e = this.getProperty('font')
		  , i = initial ?? 16
		  , s;
		while (!s || (isFinite(height) && s.actualHeight > (height - (padding ?? height * .1))) || (isFinite(width) && s.actualWidth > (width - (padding ?? width * .1)))) {
			s = this.constructor.measureText(this.text, i-- * this.scale.y + 'px ' + (e.family || 'helsinki')),
			// s.actualHeight = s.actualBoundingBoxAscent + s.actualBoundingBoxDescent,
			// s.actualWidth = s.actualBoundingBoxLeft + s.actualBoundingBoxRight,
			s.actualHeight = s.fontBoundingBoxAscent + s.fontBoundingBoxDescent,
			s.actualWidth = s.actualBoundingBoxLeft + s.actualBoundingBoxRight,
			this.textOutline && (s.actualWidth += 2, // outline size
			s.actualHeight += 2);
			if (i < (min ?? 3)) {
				break;
			}
		}
		return i
	}
	_calculateTextMetrics() {
		let e = Object.assign({}, this.getProperty('font'));
		e.size ??= this._calculateRelativeFontSize(...arguments);
		e = Object.assign(this.constructor.measureText(this.text, e.size * this.scale.y + 'px ' + (e.family || 'helsinki')), e),
		// e.actualHeight = e.actualBoundingBoxAscent + e.actualBoundingBoxDescent;
		e.actualHeight = e.fontBoundingBoxAscent + e.fontBoundingBoxDescent,
		e.actualWidth = e.actualBoundingBoxLeft + e.actualBoundingBoxRight;
		// if there is text outline, add half of lineWidth to each dimension
		// e.actualWidth += 2,
		// e.actualHeight += 2;
		return e
	}
	_calculateActual(property) {
		let initial = this._calculateInheritance(property);
		let t = this.radius ?? this.size;
		t && (t = Math.round(2 * (parseFloat(t) || 0)),
		initial = Math.max(initial, t));
		this.text && (t = this._calculateTextMetrics({ [property]: initial }),
		initial = Math.max(initial, Math.ceil(t['actual' + property.replace(/^\w/, c => c.toUpperCase())]))),
		this.padding && (initial += 2 * this.padding),
		typeof this[property] == 'string' && (initial = this.constructor.parsePropertyValue(this[property], initial));
		return Math.floor(initial * this._calculateScale(property === 'height' ? 'y' : 'x'))
	}
	_getBoundingClientRect() {
		if (!this._layoutDirty && this._cachedRect)
			return this._cachedRect;

		let x = this._calculateInheritance('x') * this._calculateScale('x'),
			y = this._calculateInheritance('y') * this._calculateScale('y'),
			width = this._calculateActual('width'),
			height = this._calculateActual('height');

		if (this.container && this.container.inline && this.container.gap && this.container.children.indexOf(this) > 0)
			x += this.gap;

		this._cachedRect = {
			bottom: y + height,
			height,
			left: x,
			right: x + width,
			top: y,
			width,
			x, y
		};
		this._layoutDirty = false;
		return this._cachedRect
	}
	_drawText(t, i) {
		let args = [i, t.textAlign === 'center' ? this.actualWidth / 2 : 0, t.textBaseline === 'middle' ? this.actualHeight / 2 : 0];
		this.textOutline && t.strokeText(...args),
		t.fillText(...args)
	}
	_setSize(t, e) {
		let n = this._getBoundingClientRect();
		n.width > 0 && n.width !== t.width && (t.width = n.width,
		this.actualWidth = n.width),
		n.height > 0 && n.height !== t.height && (t.height = n.height,
		this.actualHeight = n.height),
		isFinite(this.alpha) && this.alpha < 1 && (e.globalAlpha = this.alpha),
		t = this.getProperty('color'),
		this.background && (e.fillStyle = this.background),
		t && (e.strokeStyle = t,
		!this.background && (e.fillStyle = t)),
		this.text && (t = this.getProperty('font'),
		e.font = (t.size ?? this._calculateRelativeFontSize(n)) /* (t.size ?? 16) */ * this.scale.y + 'px ' + (t.family || 'helsinki'),
		t = this.getProperty('textAlign'),
		t && (e.textAlign = t),
		t = this.getProperty('textBaseline') || 'top',
		t && (e.textBaseline = t))
	}
	createCanvas() {
		let t = this.canvas;
		t || (t = document.createElement('canvas'),
		this.canvas = t);
		return t
	}
	cache(dpr = window.devicePixelRatio) {
		if (this.cached || this.image) return;
		let e = this.createCanvas()
		  , i = e.getContext('2d');
		i.clearRect(0, 0, e.width, e.height),
		this._setSize(e, i),
		this.background && (i.roundRect(0, 0, e.width, e.height, (/%$/.test(this.borderRadius) ? Math.floor(Math.min(e.width, e.height) / 2 * (parseFloat(this.borderRadius) / 100)) : parseFloat(this.borderRadius)) || 0),
		i.fill(),
		this.borderColor && (i.save(),
		this.borderWidth && (i.lineWidth = this.borderWidth),
		i.strokeStyle = this.borderColor,
		i.stroke(),
		i.restore()),
		e = this.getProperty('color'),
		e && (i.fillStyle = e)),
		this.text && this._drawText(i, this.text),
		this.cached = !0
	}
	draw(t, e = 0, i = 0, { padding = 0 } = {}) {
		if (!this.visible) return;
		let s = window.devicePixelRatio
		  , n = this.actualWidth * s
		  , r = this.actualHeight * s;
		padding > 0 && (e += padding,
		i += padding /* ,
		n -= 2 * padding,
		r -= 2 * padding */);
		if (this.image)
			t.imageSmoothingEnabled = true,
			t.drawImage(this.image.canvas, this.image.x, this.image.y, this.image.width, this.image.height, e + this.x * s, i + this.y * s, this.width, this.height),
			t.imageSmoothingEnabled = false;
		else if (n > 0 && r > 0)
			this.cached || this.cache(s),
			this.canvas.width > 0 && this.canvas.height > 0 && t.drawImage(this.canvas, e + this.x * this._calculateScale('x') * s, i + this.y * this._calculateScale('y') * s, n, r)
	}
	getProperty(name) {
		return this.constructor.inheritProperty(this, name)
	}
	setDirty() {
		this.cached = !1;
		this._layoutDirty = true;
		this.container && (this.container.cached = !1)
	}
	setParent(component) {
		component && component.addChild(this);
		this.container = component || null
	}
	static #textMetricCalculator = null;
	static get _textMetricCalculator() {
		let offscreen = this.#textMetricCalculator;
		if (!offscreen) {
			offscreen = new OffscreenCanvas(1, 1).getContext('2d');
			this.#textMetricCalculator = offscreen;
		}
		return offscreen
	}
	static _capitalize(name) {
		return name.charAt(0).toUpperCase() + name.slice(1)
	}
	static inheritProperty(component, targetProperty) {
		let e = component[targetProperty];
		while ((!e || e instanceof Object) && (component = component.container))
			e = e instanceof Object ? Object.assign({}, component[targetProperty], Object.fromEntries(Object.entries(e).filter(([, value]) => value !== null))) : component[targetProperty];
		return e ?? null
	}
	static inheritScale(component) {
		let scale = { ...component.scale };
		while (component = component.container)
			for (const axis in component.scale)
				scale[axis] *= component.scale?.[axis] ?? 1;
		return scale
	}
	static measureText(text, font = null) {
		const ctx = this._textMetricCalculator;
		font && (ctx.font = font);
		const metrics = ctx.measureText(text);
		return Object.assign(metrics, {
			actualHeight: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
			actualWidth: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
		})
	}
	static parsePropertyValue(value, relativeValue = 0) {
		if (typeof value === 'string') {
			const match = value.match(/^(\d+)%([\+\-\*\/]\d+(\.\d+)?)?$/);
			if (match) {
				const percent = parseFloat(match[1]);
				const op = match[2] || '';
				let result = relativeValue * (percent / 100);
				if (op) {
					const operator = op[0];
					const operand = parseFloat(op.slice(1));
					switch (operator) {
					case '+': result += operand; break;
					case '-': result -= operand; break;
					case '*': result *= operand; break;
					case '/': result /= operand; break
					}
				}
				return isNaN(result) ? 0 : Math.floor(result);
			}
		}
		return parseFloat(value)
	}
}