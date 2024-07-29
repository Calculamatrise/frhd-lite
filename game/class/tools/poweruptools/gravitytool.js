import Cartesian from "../../math/cartesian.js";
import PowerupTool from "./poweruptool.js";
import GravityPowerup from "../../sector/powerups/gravity.js";

export default class Gravity extends PowerupTool {
	name = 'gravity';
	p2 = null;
	constructor(t) {
		super(t),
		this.p2 = new Cartesian(0, 0),
		this.powerup = new GravityPowerup(0, 0, 0, t.scene.track)
	}
	press() {
		let t = this.mouse.touch
		  , e = t.real;
		this.p1.x = e.x,
		this.p1.y = e.y,
		this.p2.x = e.x,
		this.p2.y = e.y,
		this.active = !0
	}
	hold() {
		let t = this.mouse.touch
		  , e = t.real;
		this.p2.x = e.x,
		this.p2.y = e.y
	}
	release() {
		let t = this.scene.track
		  , e = new this.powerup.constructor(this.p1.x,this.p1.y,this.powerup.angle - 180,t);
		t.addPowerup(e),
		this.active = !1,
		this.toolhandler.addActionToTimeline({
			type: "add",
			objects: [e]
		})
	}
	draw(t) {
		var e = this.mouse.touch
		  , i = this.camera.zoom
		  , s = this.scene.screen
		  , n = this.scene.settings.device;
		if (this.active === !0) {
			var a = s.realToScreen(this.p1.x, "x")
			, h = s.realToScreen(this.p1.y, "y")
			, l = this.p1
			, c = this.p2
			, u = l.y - c.y
			, p = l.x - c.x
			, d = Math.atan2(l.y - c.y, l.x - c.x);
			0 === p && 0 === u && (d = Math.PI - Math.PI / 2),
			0 > d && (d += 2 * Math.PI),
			this.drawPathToMouse(t, d),
			this.powerup.angle = d * (180 / Math.PI) + 90 | 0,
			this.powerup.draw(a, h, i, t)
		} else if ("desktop" === n) {
			t.globalAlpha = .8,
			this.powerup.angle = 180;
			var a = s.realToScreen(e.real.x, "x")
			, h = s.realToScreen(e.real.y, "y");
			this.powerup.draw(a, h, i, t),
			t.globalAlpha = 1
		}
	}
	drawPathToMouse(t, e) {
		let i = this.p1
		  , s = this.p2
		  , n = this.scene.screen
		  , o = this.scene.camera.zoom
		  , u = n.realToScreen(i.x, "x")
		  , p = n.realToScreen(i.y, "y")
		  , d = n.realToScreen(s.x, "x")
		  , f = n.realToScreen(s.y, "y")
		  , v = Math.sqrt(Math.pow(d - u, 2) + Math.pow(f - p, 2));
		30 * o > v && (v = 30 * o),
		t.strokeStyle = "#A2B7D2",
		t.lineWidth = Math.max(1, 2 * o),
		t.beginPath(),
		t.moveTo(u + v, p),
		t.lineTo(u, p),
		t.lineTo(d, f),
		t.stroke();
		let g = e + 180 * (Math.PI / 180)
		  , m = Math.min(v, 50 * o);
		t.beginPath(),
		t.moveTo(u, p),
		t.arc(u, p, m, g, 0, !1),
		t.stroke(),
		t.fillStyle = "rgba(162, 183, 210,0.2)",
		t.fill()
	}
}