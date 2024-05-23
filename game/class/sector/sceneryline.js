import Vector from "../math/cartesian.js";

export default class {
	sectors = [];
	p1 = null;
	p2 = null;
	pp = null;
	len = 0;
	collided = !1;
	highlight = !1;
	recorded = !1;
	remove = !1;
	type = 'scenery';
	constructor(t, e, i, n) {
		Object.defineProperties(this, {
			recorded: { enumerable: false },
			remove: { enumerable: false },
			sectors: { enumerable: false }
		});
		this.p1 = new Vector(t, e);
		this.p2 = new Vector(i, n);
		this.pp = this.p2.sub(this.p1);
		this.len = this.pp.len();
	}
	move(t, e) {
		this.p1.x += parseInt(t) | 0;
		this.p1.y += parseInt(e) | 0;
		this.p2.x += parseInt(t) | 0;
		this.p2.y += parseInt(e) | 0;
		return this;
	}
	getCode(t) {
		this.recorded = !0;
		let e = this.p2
		  , i = " " + e.x.toString(32) + " " + e.y.toString(32)
		  , s = this.checkForConnectedLine(t, e);
		return s && (i += s.getCode(t)),
		i
	}
	checkForConnectedLine(t, e) {
		let i = t.settings.drawSectorSize
		  , s = t.sectors.drawSectors
		  , n = Math.floor(e.x / i)
		  , o = Math.floor(e.y / i);
		return s[n][o].searchForLine(this.type + "Lines", e)
	}
	erase(t, e) {
		let i = !1;
		if (!this.remove) {
			let s = this.p1
			  , r = this.p2
			  , h = r.sub(s)
			  , l = s.sub(t)
			  , c = h.dot(h)
			  , u = 2 * l.dot(h)
			  , p = l.dot(l) - e ** 2
			  , d = u * u - 4 * c * p;
			if (d > 0) {
				d = Math.sqrt(d);
				let f = (-u - d) / (2 * c)
				  , v = (-u + d) / (2 * c);
				f >= 0 && 1 >= f && (i = !0,
				this.removeAllReferences()),
				v >= 0 && 1 >= v && (i = !0,
				this.removeAllReferences())
			}
			this.intersects(this.p1.x, this.p1.y, t.x, t.y, e) ? (i = !0,
			this.removeAllReferences()) : this.intersects(this.p2.x, this.p2.y, t.x, t.y, e) && (i = !0,
			this.removeAllReferences())
		}
		return i
	}
	intersects(t, e, i, s, n) {
		let r = t - i
		  , o = e - s;
		return n ** 2 >= r ** 2 + o ** 2
	}
	addSectorReference(t) {
		this.sectors.push(t)
	}
	removeAllReferences() {
		this.remove = !0;
		for (let t of this.sectors)
			t.drawn = !1,
			t.dirty = !0;
		this.sectors = []
	}
}