import Mass from "./mass.js";

export default class extends Mass {
	angle = 0;
	brake = !1;
	motor = 0;
	rotationSpeed = 0;
	speed = 0;
	drive(t, e) {
		let i = this.pos
		  , s = this.motor * this.parent.dir
		  , n = s * t
		  , r = s * e;
		if (i.x += n,
		i.y += r,
		this.brake) {
			let o = .3 * -(t * this.vel.x + e * this.vel.y)
			  , a = t * o
			  , h = e * o;
			i.x += a,
			i.y += h
		}
		this.speed = (t * this.vel.x + e * this.vel.y) / this.radius,
		this.rotationSpeed = this.speed,
		this.angle += this.speed,
		this.contact = !0
	}
	fixedUpdate() {
		super.fixedUpdate(),
		this.rotationSpeed = .999 * this.rotationSpeed
	}
}