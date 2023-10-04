export default class {
	alpha = null;
	background = null;
	cached = !1;
	canvas = null;
	color = null;
	container = null;
	font = { size: null };
	scale = { x: 1, y: 1 };
	text = null;
	image = null;
	x = 0;
	y = 0;
	visible = true;
	constructor(options, container) {
		Object.assign(this, options),
		container && container.addChild(this)
	}
	createCanvas() {
		let t = this.canvas;
		t || (t = document.createElement('canvas'),
		this.canvas = t);
		return t
	}
	cache(t = window.devicePixelRatio) {
		if (!this.cached && !this.image) {
			let e = this.createCanvas()
			  , i = e.getContext('2d');
			i.clearRect(0, 0, e.width, e.height);
			if (this.text !== null) {
				let s = (this.font.size ?? (this.container && this.container.font.size) ?? 16) + 'px ' + (this.font.family || 'helsinki');
				i.font = s;
				let n = i.measureText(this.text);
				e.width = Math.ceil(Math.max(n.width, n.actualBoundingBoxLeft + n.actualBoundingBoxRight)),
				e.height = Math.abs(n.actualBoundingBoxAscent) + Math.abs(n.actualBoundingBoxDescent), // bad
				this.radius && (n = this.radius,
				e.width = Math.max(e.width, 2 * this.scale.x * n),
				e.height = Math.max(e.height, 2 * this.scale.y * n)),
				this.width = e.width,
				this.height = e.height,
				this.alpha && (i.globalAlpha = this.alpha),
				this.background && (i.save(),
				this.border === 'round' && i.arc(e.height / 2, e.height / 2, n, 0, 2 * Math.PI),
				i.fillStyle = this.background,
				i.fill(),
				i.restore()),
				this.color && (i.fillStyle = this.color) || this.container && this.container.color && (i.fillStyle = this.color),
				i.font = s,
				this.textAlign && (i.textAlign = this.textAlign) || this.container && this.container.textAlign && (i.textAlign = this.container.textAlign),
				i.textBaseline = this.textBaseline || (this.container && this.container.textBaseline) || 'top',
				i.fillText(this.text, i.textAlign === 'center' ? this.width / 2 : 0, i.textBaseline === 'middle' ? this.height / 2 : 0)
			}
			this.cached = !0;
		}
	}
	draw(t, e = 0, i = 0) {
		if (this.visible) {
			let s = window.devicePixelRatio
			  , n = s * this.scale.x
			  , r = s * this.scale.y;
			if (this.image)
				t.imageSmoothingEnabled = true,
				t.drawImage(this.image.canvas, this.image.x, this.image.y, this.image.width, this.image.height, e + this.x * s, i + this.y * s, this.width * n, this.height * r),
				t.imageSmoothingEnabled = false;
			else
				this.cached || this.cache(s),
				t.drawImage(this.canvas, e + this.x * s, i + this.y * s, this.width * n, this.height * r);
		}
	}
	setDirty() {
		this.cached = !1,
		this.container && (this.container.cached = !1)
	}
}