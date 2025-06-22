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
		super.fixedUpdate();
		this.rotationSpeed = .999 * this.rotationSpeed
	}
	draw(t) {
		const e = this.displayPos.toScreen(this.scene)
			, i = this.scene.camera.zoom;
		// this.scene.settings.developerMode && super.draw(t);
		t.beginPath(),
		t.arc(e.x, e.y, this.radius * i - t.lineWidth / 2, 0, 2 * Math.PI, !1),
		this.fill && (t.fillStyle = this.fill,
		t.fill()),
		this.stroke && (t.strokeStyle = this.stroke,
		t.stroke())
	}
}