export default class {
	x = 0;
	y = 0;
	constructor(t, e) {
		isFinite(t) && (this.x = parseFloat(t)),
		isFinite(e) && (this.y = parseFloat(e))
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
		this.x = t.x ?? t[0];
		this.y = t.y ?? t[1]
	}

	set(x, y) {
		this.x = x
		this.y = y
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

	toJSON() {
		return { x: this.x, y: this.y }
	}

	toArray() {
		return [this.x, this.y]
	}

	static max(...args) {
		return args.length > 0 && args.sort((a, b) => a.dot(1) - b.dot(1))[0] || new this(-Infinity, -Infinity)
	}

	static min(...args) {
		return args.length > 0 && args.sort((a, b) => b.dot(1) - a.dot(1))[0] || new this(Infinity, Infinity)
	}

	static lenSqr(t) { return this.dot(t, t) }
	static len(t) { return Math.sqrt(this.lenSqr(t)) }
	static delta(t, e) { return this.len(this.sub(t, e)) }
	static dot(t, e) { return t.x * e.x + t.y * e.y }
	// static factor(t) { return new this.constructor(this.x * t, this.y * t) }
	static factor(t) { return { x: this.x * t, y: this.y * t } }
	static factorSelf(t, e) {
		t.x *= e,
		t.y *= e
	}

	static factorOut(t, e, i) {
		i.x = t.x * e,
		i.y = t.y * e
	}

	// static add(t, e) { return new this.constructor(t.x + e.x, t.y + e.y) }
	static add(t, e) { return { x: t.x + e.x, y: t.y + e.y } }
	static inc(t, e) {
		t.x += e.x,
		t.y += e.y
	}

	static addOut(t, e, i) {
		i.x = t.x + e.x,
		i.y = t.y + e.y
	}

	// static sub(t, e) { return new this.constructor(t.x - e.x, t.y - e.y) }
	static sub(t, e) { return { x: t.x - e.x, y: t.y - e.y } }
	static subOut(t, e, i) {
		i.x = t.x - e.x,
		i.y = t.y - e.y
	}

	static subSelf(t, e) {
		t.x -= e.x,
		t.y -= e.y
	}
}