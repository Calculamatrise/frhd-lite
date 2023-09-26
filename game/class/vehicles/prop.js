import s from "../math/cartesian.js";
import Mass from "./mass.js";

export default class extends Mass {
	motor = 0;
	angle = 0;
	speed = 0;
	constructor(t, e) {
		super(t, e);
		this.motor = 0;
		this.angle = new s(0, 0);
		this.radius = 10;
		this.speed = 0;
	}
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
		this.vel = i.sub(s),
		s.equ(i)
	}
}