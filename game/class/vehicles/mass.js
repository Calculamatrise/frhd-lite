import s from "../math/cartesian.js";

export default class {
	pos = null;
	old = null;
	vel = null;
	parent = null;
	radius = 0;
	friction = 0;
	collide = !1;
	contact = !1;
	scene = null;
	drawPos = null;
	constructor(t, e) {
		this.pos = new s,
		this.old = new s,
		this.vel = new s(0,0),
		this.drawPos = new s(0,0),
		this.radius = 10,
		this.friction = 0,
		this.parent = e,
		this.collide = !0,
		this.contact = !1,
		this.scene = e.scene,
		this.pos.equ(t),
		this.old.equ(t),
		this.drawPos = this.pos
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
		let t = this.vel;
		t.inc(this.parent.gravity);
		let e = this.parent.gravity;
		(0 != e.x || 0 != e.y) && (t.x = .99 * t.x,
		t.y = .99 * t.y),
		this.pos.inc(this.vel),
		this.contact = !1,
		this.collide && this.scene.track.collide(this),
		t.x = this.pos.x - this.old.x,
		t.y = this.pos.y - this.old.y,
		this.old.equ(this.pos),
		this.drawPos = this.pos
	}
	update(progress) {
		this.drawPos = this.pos.add(this.vel.factor(progress));
	}
	draw(e) {
		let t = this.pos.toScreen(this.scene)
		  , i = this.scene.camera.zoom;
		e.beginPath(),
		e.fillStyle = "rgba(0,0,0,1)",
		e.arc(t.x, t.y, this.radius * i, 0, 2 * Math.PI, !1),
		e.fill(),
		e.closePath()
	}
}