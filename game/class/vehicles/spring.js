import i from "../math/cartesian.js";

export default class {
	m1 = null;
	m2 = null;
	lrest = 40;
	leff = 40;
	dampConstant = .5;
	springConstant = .7;
	constructor(t, e, i) {
		Object.defineProperty(this, 'parent', { value: i });
		this.m1 = t;
		this.m2 = e
	}
	swap() {
		let t = new i
		  , e = this.m1
		  , s = this.m2;
		t.equ(e.pos),
		e.pos.equ(s.pos),
		s.pos.equ(t),
		t.equ(e.old),
		e.old.equ(s.old),
		s.old.equ(t),
		t.equ(e.vel),
		e.vel.equ(s.vel),
		s.vel.equ(t),
		t = e.angle,
		e.angle = s.angle,
		s.angle = t
	}
	fixedUpdate() {
		let e = this.m1
		  , s = this.m2
		  , n = e.pos
		  , r = s.pos
		  , o = e.vel
		  , a = s.vel
		  , t = new i(r.x - n.x, r.y - n.y);
		let h = t.len();
		if (!(1 > h)) {
			let l = 1 / h;
			t.x *= l,
			t.y *= l;
			let c = (h - this.leff) * this.springConstant
			  , u = {
				  x: t.x * c,
				  y: t.y * c
			  }
			  , p = a.x - o.x
			  , d = a.y - o.y
			  , f = p * t.x + d * t.y
			  , v = f * this.dampConstant
			  , g = t.x * v
			  , m = t.y * v;
			u.x += g,
			u.y += m,
			a.x += -u.x,
			a.y += -u.y,
			o.x += u.x,
			o.y += u.y
		}
	}
	rotate(t) {
		let e = this.m1
		  , i = this.m2
		  , s = i.pos.x - e.pos.x
		  , n = i.pos.y - e.pos.y
		  , r = -n / this.leff
		  , o = s / this.leff;
		e.pos.x += r * t,
		e.pos.y += o * t,
		i.pos.x += r * -t,
		i.pos.y += o * -t
	}
	contract(t, e) {
		this.leff += (this.lrest - t - this.leff) / e
	}
	setMasses(t, e) {
		this.m1 = t,
		this.m2 = e
	}
}