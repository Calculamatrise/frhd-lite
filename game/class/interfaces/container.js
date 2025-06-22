import Component from "./component.js";

export default class extends Component {
	children = [];
	gap = 0;
	inline = null;
	constructor(options, container) {
		super(options, container),
		Object.assign(this, options);
		for (let i of this.children)
			i.container = this
	}
	_applyProperties(...args) {
		for (let i in args) {
			this.padding && (args[i] += 2 * this.padding);
		}
		if (args.length > 0) {
			return args
		}
		return args[0]
	}
	_caclulateActual(property) {
		let initial = super._caclulateActual(...arguments);
		if (this.children.length > 0 && this.overflow) {
			let sum = 0
			  , axis = property === 'height' ? 'y' : 'x';
			if (axis === 'x' && this.inline) {
				for (let child of this.children) {
					sum += child._calculateInheritance(axis) * child._calculateScale(axis) + child._caclulateActual(property),
					this.gap && 0 < this.children.indexOf(child) && (sum += this.gap);
				}
			} else {
				for (let child of this.children) {
					sum = Math.max(sum, child._calculateInheritance(axis) * child._calculateScale(axis) + child._caclulateActual(property));
				}
			}
			initial = Math.max(initial, sum)
		}
		return initial
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
			super.cache.call(this, scale),
			t.imageSmoothingEnabled = false;
			for (let e in this.children) {
				let i = this.children[e]
				  , s = Boolean(this.inline)
				  , n = this.children.slice(0, e)
				  , a = n.reduce((t, e) => t += (e.image ? e.width : e.actualWidth) + e.x, 0) * scale
				  , h = n.reduce((t, e) => t += (e.image ? e.height : e.actualHeight) + e.y, 0) * scale;
				i.cached || i.cache(scale),
				i.draw(t, s && (a + (e > 0 && this.gap)), 0 /* s || h */);
			}
			this.cached = !0
		}
	}
	draw(t, e = 0, i = 0) {
		if (!this.visible) return;
		let s = window.devicePixelRatio;
		this.cached || this.cache(s);
		let n = this.canvas
		  , a = this.scale.x !== 1 && (n.width - this._calculateInheritance('width') /* this.actualWidth */)
		  , h = this.scale.y !== 1 && (n.height - this._calculateInheritance('height') /* this.actualHeight */);
		this.horizontalAlign !== 'left' && (a /= 2),
		this.verticalAlign !== 'bottom' && (h /= 2),
		n.width > 0 && n.height > 0 && t.drawImage(n, e + (this.x - a) * s, i + (this.y - h) * s, n.width, n.height)
	}
	setDirty() {
		super.setDirty();
		for (let t of this.children.filter(t => !t.image))
			t.setDirty()
	}
}