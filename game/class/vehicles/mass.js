import s from "../math/cartesian.js";

export default class {
	pos = new s;
	old = new s;
	vel = new s;
	displayPos = this.pos;
	// lastFixedPos = Object.defineProperties(new s, {
	// 	recorded: { value: true, writable: true },
	// 	rendered: { value: false, writable: true }
	// });
	lastFixedPos = Object.assign(new s, {
		recorded: true,
		rendered:  false
	});
	collide = true;
	contact = false;
	friction = 0;
	radius = 10;
	constructor(t, e) {
		Object.defineProperties(this, {
			parent: { value: e, writable: true },
			scene: { value: e.scene, writable: true }
		});
		this.pos.equ(t),
		this.old.equ(t),
		this.lastFixedPos.equ(t)
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
		// this.pos.inc(this.parent.slow ? this.vel.factor(.5) : this.vel),
		this.pos.inc(this.vel),
		this.contact = !1,
		this.collide && this.scene.track.collide(this),
		this.vel.equ(this.pos.sub(this.old)),
		this.lastFixedPos.recorded && (this.lastFixedPos.equ(this.old),
		this.lastFixedPos.recorded = false,
		this.lastFixedPos.rendered = false,
		this.lastTime = 0),
		this.old.equ(this.pos),
		this.displayPos = this.pos
	}
	lastTime = -1;
	update(delta) {
		if (this.lastFixedPos.rendered) return;
		if (delta < this.lastTime) {
			this.lastFixedPos.equ(this.pos);
			this.lastFixedPos.rendered = true;
			this.lastTime = 0;
			return;
		}

		this.displayPos = this.lastFixedPos.lerp(this.pos, delta);
		this.lastTime = delta
	}
	lateUpdate() {
		this.lastFixedPos.recorded || (// this.lastFixedPos.equ(this.pos),
		this.lastFixedPos.recorded = true)
	}
	translate(x, y) {
		const inc = { x, y };
		this.pos.inc(inc);
		this.old.inc(inc);
		this.displayPos.inc(inc);
		this.lastFixedPos.inc(inc)
	}
	draw(t) {
		const e = this.displayPos.toScreen(this.scene)
			, i = this.scene.camera.zoom;
		// this.scene.settings.developerMode
		t.beginPath(),
		t.arc(e.x, e.y, this.radius * i - t.lineWidth / 2, 0, 2 * Math.PI, !1),
		this.fill && (t.fillStyle = this.fill,
		t.fill()),
		this.stroke && (t.strokeStyle = this.stroke,
		t.stroke())
	}
}