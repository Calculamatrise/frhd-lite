import Component from "./component.js";

export default class extends Component {
	get width() {
		return (this.inline ? this.children.reduce((t, e) => t += e.width + e.x, 0) : this.children.reduce((t, e) => t = Math.max(t, e.width + e.x), 0));
	}
	get height() {
		return this.children.reduce((t, e) => t = Math.max(t, e.height + e.y), 0)
	}
	children = [];
	font = { size: 16 };
	inline = null;
	constructor(options, container) {
		super(options, container),
		Object.assign(this, options);
		for (let i of this.children)
			i.container = this
	}
	addChild() {
		let t = arguments
		  , e = this.children;
		for (let e of t)
			e.container = this;
		e.push(...Array.prototype.filter.call(t, t => e.indexOf(t) === -1));
		return t
	}
	cache(scale = window.devicePixelRatio) {
		if (!this.cached) {
			let t = (this.createCanvas(),
			this.canvas.getContext('2d'));
			t.clearRect(0, 0, t.canvas.width, t.canvas.height),
			this.width > 0 && (t.canvas.width = this.width * window.devicePixelRatio),
			this.height > 0 && (t.canvas.height = this.height * window.devicePixelRatio),
			this.alpha && (t.globalAlpha = this.alpha),
			t.imageSmoothingEnabled = false;
			for (let e in this.children) {
				let i = this.children[e]
				  , s = this.inline
				  , q = this.children.slice(0, e)
				  , a = q.reduce((t, e) => t += e.width + e.x, 0) * window.devicePixelRatio
				  , h = q.reduce((t, e) => t += e.height + e.y, 0) * window.devicePixelRatio;
				i.cached || i.cache(scale),
				i.draw(t, s && (this.gap ?? a)/*, s || h */);
			}
			this.cached = !0
		}
	}
	draw(t, e = 0, i = 0) {
		if (this.visible) {
			let s = window.devicePixelRatio;
			this.cached || this.cache(s);
			let n = this.canvas;
			t.drawImage(n, e + this.x * s, i + this.y * s, n.width * this.scale.x, n.height * this.scale.y)
		}
	}
	setDirty() {
		this.cached = !1;
		for (let t of this.children.filter(t => !t.image))
			t.setDirty()
	}
}