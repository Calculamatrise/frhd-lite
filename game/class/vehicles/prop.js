import s from "../math/cartesian.js";
import Mass from "./mass.js";

export default class extends Mass {
	motor = 0;
	angle = new s;
	speed = 0;
	fixedUpdate() {
		let t = this.vel
		  , e = this.angle
		  , i = this.pos
		  , s = this.old
		  , n = this.motor;
		t.inc(e.factor(2 * n)),
		i.inc(t.factor(.99)),
		this.contact = !1,
		this.collide && this.scene.track.collide(this),
		this.vel.equ(i.sub(s)),
		this.lastFixedPos.recorded && (this.lastFixedPos.equ(s),
		this.lastFixedPos.recorded = false,
		this.lastFixedPos.rendered = false,
		this.lastTime = 0),
		s.equ(i)
	}
}