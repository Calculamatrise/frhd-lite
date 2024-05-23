import s from "../math/cartesian.js";

export default class {
	pos = null;
	old = null;
	vel = null;
	parent = null;
	radius = 0;
	friction = 0;
	collide = !0;
	contact = !1;
	scene = null;
	constructor(t, e) {
		Object.defineProperty(this, 'scene', { enumerable: false });
		this.pos = new s,
		this.old = new s,
		this.vel = new s(0,0),
		this.radius = 10,
		this.parent = e,
		this.scene = e.scene,
		this.pos.equ(t),
		this.old.equ(t)
	}
	drive(t, e) {
		let i = this.friction
		  , s = -(t * this.vel.x + e * this.vel.y) * i;
		t *= s,
		e *= s,
		this.pos.x += t,
		this.pos.y += e,
		this.contact = !0
	}
	fixedUpdate() {
		let e = this.parent.gravity;
		this.vel.inc(e);
		(0 != e.x || 0 != e.y) && this.vel.factorSelf(.99),
		this.pos.inc(this.vel),
		this.contact = !1,
		this.collide && this.scene.track.collide(this),
		this.vel.equ(this.pos.sub(this.old)),
		this.old.equ(this.pos)
	}
	draw(e) {
		let t = this.pos.toScreen(this.scene)
		  , i = this.scene.camera.zoom;
		e.beginPath(),
		e.fillStyle = "rgba(0,0,0,1)",
		e.arc(t.x, t.y, this.radius * i, 0, 2 * Math.PI, !1),
		e.fill()
	}
}