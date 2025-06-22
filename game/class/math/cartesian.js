export default class {
	x = 0;
	y = 0;
	constructor(t, e) {
		isFinite(t) && (this.x = t),
		isFinite(e) && (this.y = e)
	}
	toReal(t) {
		let e = t.camera
		  , s = t.screen
		  , n = (this.x - s.center.x) / e.zoom + e.position.x
		  , r = (this.y - s.center.y) / e.zoom + e.position.y;
		return new this.constructor(n, r)
	}
	toScreen(t) {
		let e = t.camera
		  , s = t.screen
		  , n = (this.x - e.position.x) * e.zoom + s.center.x
		  , r = (this.y - e.position.y) * e.zoom + s.center.y;
		return new this.constructor(n, r)
	}
	lenSqr() {
		return this.dot(this)
	}
	len() {
		return Math.sqrt(this.lenSqr())
	}
	delta(t) {
		return this.sub(t).len()
	}
	dot(t) {
		return this.x * t.x + this.y * t.y
	}
	factor(t) {
		return new this.constructor(this.x * t, this.y * t)
	}
	factorSelf(t) {
		this.x *= t,
		this.y *= t
	}
	factorOut(t, e) {
		e.x = this.x * t,
		e.y = this.y * t
	}
	add(t) {
		return new this.constructor(this.x + t.x, this.y + t.y)
	}
	inc(t) {
		this.x += t.x,
		this.y += t.y
	}
	addOut(t, e) {
		e.x = this.x + t.x,
		e.y = this.y + t.y
	}
	sub(t) {
		return new this.constructor(this.x - t.x, this.y - t.y)
	}
	subOut(t, e) {
		e.x = this.x - t.x,
		e.y = this.y - t.y
	}
	subSelf(t) {
		this.x -= t.x,
		this.y -= t.y
	}
	equ(t) {
		this.x = t.x,
		this.y = t.y
	}
	lerp(to, alpha) {
		return new this.constructor(
			this.x + (to.x - this.x) * alpha,
			this.y + (to.y - this.y) * alpha
		)
	}
	lerpTo(target, alpha) {
		this.x += (target.x - this.x) * alpha;
    	this.y += (target.y - this.y) * alpha
	}
	normalize() {
		let t = this.len();
		if (t === 0) return new this.constructor(0, 0);
		return new this.constructor(this.x / t, this.y / t)
	}
	getAngleInDegrees(t) {
		let e = t.sub(this)
		  , i = Math.atan2(e.x, -e.y)
		  , s = i * (180 / Math.PI);
		return s < 0 && (s += 360),
		s
	}
	getAngleInRadians(t) {
		let e = t.sub(this);
		return Math.atan2(e.x, -e.y)
	}
	static max(...args) {
		return args.length > 0 && args.sort((a, b) => a.dot(1) - b.dot(1))[0] || new this(-Infinity, -Infinity)
	}
	static min(...args) {
		return args.length > 0 && args.sort((a, b) => b.dot(1) - a.dot(1))[0] || new this(Infinity, Infinity)
	}
}