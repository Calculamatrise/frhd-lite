export default class {
	actualHeight = 0;
	actualWidth = 0;
	alpha = null;
	aspectRatio = null;
	aspectRatioLock = !1;
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
	 * @param {boolean} [options.aspectRatioLock]
	 * @param {string} [options.background] Hexadecimal colour value
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
	 */
	constructor(options, container) {
		Object.defineProperty(this, 'cached', { enumerable: false }),
		Object.defineProperty(this, 'canvas', { enumerable: false }),
		Object.defineProperty(this, 'container', { enumerable: false }),
		Object.defineProperty(this, 'data', { value: null, writable: true }),
		Object.assign(this, options),
		container && container.addChild(this)
	}
	_calculateInheritance(t) {
		self = this;
		let e = self[t];
		switch (t) {
		// case 'width':
		case 'x':
			t = 'actualWidth';
			break;
		// case 'height':
		case 'y':
			t = 'actualHeight'
		}
		let i;
		while (/^\d+%/.test(e)) {
			self = self.container,
			i = (self && self[t]) ?? 0;
			// e = Math.floor(eval(e.replace(/\d+%/, i * (parseFloat(e) / 100))));
			e = Math.floor(i * (parseFloat(e) / 100));
		}
		return e ?? 0
	}
	_calculateScale(t) {
		self = this;
		let e = self.scale[t];
		while (self = self.container)
			e *= self.scale[t];
		return e ?? 1
	}
	_calculateRelativeFontSize({ height, initial, max, min, padding, width } = {}) {
		let t = new OffscreenCanvas(1, 1).getContext('2d')
		  , e = this._inherit('font')
		  , i = initial ?? 16
		  , s;
		while (!s || (isFinite(height) && s.actualHeight > (height - (padding ?? height * .1))) || (isFinite(width) && s.actualWidth > (width - (padding ?? width * .1)))) {
			t.font = i-- * this.scale.y + 'px ' + (e.family || 'helsinki');
			s = t.measureText(this.text),
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
		let t = new OffscreenCanvas(1, 1).getContext('2d')
		  , e = Object.assign({}, this._inherit('font'));
		e.size ??= this._calculateRelativeFontSize(...arguments);
		t.font = e.size * this.scale.y + 'px ' + (e.family || 'helsinki'),
		e = Object.assign(t.measureText(this.text), e),
		// e.actualHeight = e.actualBoundingBoxAscent + e.actualBoundingBoxDescent;
		e.actualHeight = e.fontBoundingBoxAscent + e.fontBoundingBoxDescent,
		e.actualWidth = e.actualBoundingBoxLeft + e.actualBoundingBoxRight;
		// if there is text outline, add half of lineWidth to each dimension
		// e.actualWidth += 2,
		// e.actualHeight += 2;
		return e
	}
	_caclulateActual(property) {
		let initial = this._calculateInheritance(property);
		let t = this.radius ?? this.size;
		t && (t = Math.round(2 * (parseFloat(t) || 0)),
		initial = Math.max(initial, t));
		this.text && (t = this._calculateTextMetrics({ [property]: initial }),
		initial = Math.max(initial, Math.ceil(t['actual' + property.replace(/^\w/, c => c.toUpperCase())]))),
		this.padding && (initial += 2 * this.padding),
		/^\d+%.+/.test(this[property]) && (initial = Math.floor(eval(this[property].replace(/\d+%/, initial))));
		return Math.floor(initial * this._calculateScale(property === 'height' ? 'y' : 'x'))
	}
	_getBoundingClientRect() {
		let x = this._calculateInheritance('x') * this._calculateScale('x')
		  , y = this._calculateInheritance('y') * this._calculateScale('y')
		  , width = this._caclulateActual('width')
		  , height = this._caclulateActual('height');
		this.container && this.container.inline && this.container.gap && this.container.children.indexOf(this) > 0 && (x += this.gap);
		return {
			bottom: y + height,
			height,
			left: x,
			right: x + width,
			top: y,
			width,
			x, y
		}
	}
	_inherit(property) {
		self = this;
		let e = this[property];
		while ((!e || e instanceof Object) && (self = self.container))
			e = e instanceof Object ? Object.assign({}, self[property], Object.fromEntries(Object.entries(e).filter(([, value]) => value !== null))) : self[property];
		return e ?? null
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
		this.alpha && (e.globalAlpha = this.alpha),
		t = this._inherit('color'),
		this.background && (e.fillStyle = this.background),
		t && (e.strokeStyle = t,
		!this.background && (e.fillStyle = t)),
		this.text && (t = this._inherit('font'),
		e.font = (t.size ?? this._calculateRelativeFontSize(n)) /* (t.size ?? 16) */ * this.scale.y + 'px ' + (t.family || 'helsinki'),
		t = this._inherit('textAlign'),
		t && (e.textAlign = t),
		t = this._inherit('textBaseline') || 'top',
		t && (e.textBaseline = t))
	}
	createCanvas() {
		let t = this.canvas;
		t || (t = document.createElement('canvas'),
		this.canvas = t);
		return t
	}
	cache(t = window.devicePixelRatio) {
		if (this.cached || this.image) return;
		let e = this.createCanvas()
		  , i = e.getContext('2d');
		i.clearRect(0, 0, e.width, e.height),
		this._setSize(e, i),
		this.background && (i.roundRect(0, 0, e.width, e.height, (/%$/.test(this.borderRadius) ? Math.floor(Math.min(e.width, e.height) / 2 * (parseFloat(this.borderRadius) / 100)) : parseFloat(this.borderRadius)) || 0),
		i.fill(),
		e = this._inherit('color'),
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
	setDirty() {
		this.cached = !1,
		this.container && (this.container.cached = !1)
	}
}