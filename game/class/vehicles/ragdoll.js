import Vector from "../math/cartesian.js";
import n from "./mass.js";
import r from "./spring.js";

export default class {
	constructor(t, e) {
		Object.defineProperty(this, 'parent', { value: e });
		let i, o, a, h, l, c, u, p, d, f, v = [], g = [], m = new Vector(0,0);
		i = new n(m, e),
		o = new n(m, e),
		a = new n(m, e),
		h = new n(m, e),
		c = new n(m, e),
		l = new n(m, e),
		u = new n(m, e),
		p = new n(m, e),
		d = new n(m, e),
		f = new n(m, e),
		v.push(i),
		v.push(o),
		v.push(a),
		v.push(h),
		v.push(c),
		v.push(l),
		v.push(u),
		v.push(p),
		v.push(d),
		v.push(f),
		g.push(new r(i,o,this)),
		g.push(new r(i,a,this)),
		g.push(new r(a,c,this)),
		g.push(new r(i,h,this)),
		g.push(new r(h,l,this)),
		g.push(new r(o,u,this)),
		g.push(new r(u,d,this)),
		g.push(new r(o,p,this)),
		g.push(new r(p,f,this));
		for (let y in v)
			v[y].friction = .05,
			v[y].radius = 3;
		i.radius = o.radius = 8;
		for (var y in g)
			g[y].dampConstant = .7,
			g[y].springConstant = .4;
		this.masses = v,
		this.springs = g,
		this.head = i,
		this.waist = o,
		this.lElbow = a,
		this.rElbow = h,
		this.rHand = l,
		this.lHand = c,
		this.lKnee = u,
		this.rKnee = p,
		this.lFoot = d,
		this.rFoot = f;
		for (var y in t)
			this[y].pos.equ(t[y])
	}
	zero(t, e) {
		t = t.factor(.7),
		e = e.factor(.7);
		let i = this.springs
		  , s = this.masses;
		for (let n in i) {
			let r = i[n].m2.pos.sub(i[n].m1.pos).len();
			i[n].lrest = r,
			i[n].leff = r
		}
		for (let n = 1; 4 >= n; n++)
			i[n].lrest = 13,
			i[n].leff = 13;
		for (let n in i.filter(t => t.leff > 20))
			i[n].lrest = 20,
			i[n].leff = 20;
		let o = [this.head, this.lElbow, this.rElbow, this.lHand, this.rHand]
		  , a = [this.waist, this.lKnee, this.rKnee, this.lFoot, this.rFoot];
		for (let n in o)
			o[n].old = o[n].pos.sub(t);
		for (let n in a)
			a[n].old = a[n].pos.sub(e);
		for (let n in s)
			s[n].vel.equ(s[n].pos.sub(s[n].old)),
			s[n].vel.x += 1 * (Math.random() - Math.random()),
			s[n].vel.y += 1 * (Math.random() - Math.random())
	}
	draw(d) {
		let t = this.head
		  , e = this.waist
		  , i = this.lElbow
		  , s = this.rElbow
		  , n = this.rHand
		  , r = this.lHand
		  , o = this.lKnee
		  , a = this.rKnee
		  , h = this.lFoot
		  , l = this.rFoot
		  , c = this.parent.scene
		  , u = c.camera
		  , p = u.zoom
		  , f = this.parent.alpha ?? 1
		  , q = c.settings.physicsLineColor
		  , j = q.padEnd(7, q.slice(1, 4));
		d.strokeStyle = j + Math.min(255, Math.round(255 * .5 * f)).toString(16),
		d.lineWidth = 5 * p;
		let v = t.pos.toScreen(c)
		d.beginPath(),
		d.moveTo(v.x, v.y);
		let g = i.pos.toScreen(c)
		d.lineTo(g.x, g.y);
		let m = r.pos.toScreen(c)
		d.lineTo(m.x, m.y),
		d.stroke(),
		d.strokeStyle = j + Math.min(255, Math.round(255 * f)).toString(16),
		d.beginPath(),
		d.moveTo(v.x, v.y);
		let y = s.pos.toScreen(c)
		d.lineTo(y.x, y.y);
		let w = n.pos.toScreen(c)
		d.lineTo(w.x, w.y),
		d.stroke(),
		d.lineWidth = 8 * p,
		d.beginPath(),
		d.moveTo(v.x, v.y);
		let x = e.pos.toScreen(c)
		d.lineTo(x.x, x.y),
		d.stroke(),
		d.lineWidth = 5 * p,
		d.beginPath(),
		d.moveTo(x.x, x.y);
		let _ = o.pos.toScreen(c)
		d.lineTo(_.x, _.y);
		let b = h.pos.toScreen(c)
		d.lineTo(b.x, b.y);
		let T = o.pos.sub(e.pos).normalize();
		T.factorSelf(4),
		T.inc(h.pos);
		let C = T.toScreen(c);
		d.lineTo(C.x, C.y),
		d.stroke(),
		d.strokeStyle = j + Math.min(255, Math.round(255 * .5 * f)).toString(16),
		d.lineWidth = 5 * p,
		d.beginPath(),
		d.moveTo(x.x, x.y);
		let k = a.pos.toScreen(c)
		d.lineTo(k.x, k.y);
		let S = a.pos.sub(e.pos).normalize();
		S = S.factor(4).add(l.pos);
		let P = l.pos.toScreen(c)
		d.lineTo(P.x, P.y);
		let M = S.toScreen(c);
		d.lineTo(M.x, M.y),
		d.stroke(),
		v.inc(v.sub(x).factor(.25));
		let D = GameInventoryManager.getItem(this.parent.cosmetics.head)
		  , I = this.drawHeadAngle;
		D.draw(d, v.x, v.y, I, p, this.dir, 1)
	}
	fixedUpdate() {
		for (let t of this.springs)
			t.fixedUpdate();
		for (let t of this.masses)
			t.fixedUpdate();
		this.updateDrawHeadAngle()
	}
	update(progress) {
		for (let t of this.masses)
			t.update(progress);
	}
	updateDrawHeadAngle() {
		let t = this.head.pos
		  , e = this.waist.pos;
		this.dir < 0 && ([t, e] = [e, t]);
		let i = t.x
		  , s = t.y
		  , n = e.x
		  , r = e.y
		  , o = i - n
		  , h = s - r;
		this.drawHeadAngle = -(Math.atan2(o, h) + Math.PI)
	}
}