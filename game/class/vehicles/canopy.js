import Mass from "./mass.js";
import n from "../math/cartesian.js";

export default class extends Mass {
	wind = !0;
	constructor(t, e, i) {
		super(new n(t, e), i);
	}
	drive(t, e) {
		this.pos.x += .05 * t * -t * (t * this.vel.x + e * this.vel.y),
		this.contact = !0
	}
	fixedUpdate() {
		let t = this.vel
		  , e = this.pos
		  , i = this.old
		  , s = this.parent.gravity
		  , n = this.parent.gamepad
		  , r = n.isButtonDown("up")
		  , o = n.isButtonDown("left")
		  , a = n.isButtonDown("right");
		(0 !== s.x || 0 !== s.y) && (t.x = .9 * t.x,
		t.y = .99 * t.y),
		o && (e.x += -.05),
		a && (e.x += .05),
		(0 !== s.x || 0 !== s.y) && (e.y += -.1),
		r && (e.y += -.5),
		this.wind && (e.x += .3),
		e.x += t.x,
		e.y += t.y,
		this.contact = !1,
		this.collide && this.scene.track.collide(this),
		(0 !== s.x || 0 !== s.y) && (t.x = e.x - i.x,
		t.y = e.y - i.y),
		i.x = e.x,
		i.y = e.y
	}
	draw(t) {
		let e = this.scene
		  , i = this.pos.toScreen(e)
		  , s = this.radius * e.camera.zoom;
		t.beginPath(),
		t.fillStyle = this.scene.settings.physicsLineColor,
		t.arc(i.x, i.y, s, 0, 2 * Math.PI, !1),
		t.closePath(),
		t.fill()
	}
}