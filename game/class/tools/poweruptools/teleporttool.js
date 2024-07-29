import Cartesian from "../../math/cartesian.js";
import PowerupTool from "./poweruptool.js";
import TeleportPowerup from "../../sector/powerups/teleport.js";

export default class Teleport extends PowerupTool {
	name = 'teleport';
	p2 = null;
	constructor(t) {
		super(t),
		this.p2 = new Cartesian(0, 0),
		this.powerup = new TeleportPowerup(0, 0, t.scene.track)
	}
	press() {
		super.press(),
		this.portal1 = new this.powerup.constructor(this.p1.x,this.p1.y,this.scene.track)
	}
	hold() {
		let t = this.mouse.touch
		  , e = t.real;
		this.p2.x = e.x,
		this.p2.y = e.y
	}
	release() {
		let t = Math.abs(this.p2.x - this.p1.x)
		  , e = Math.abs(this.p2.y - this.p1.y);
		if (t > 40 || e > 40) {
			let i = this.scene.track;
			this.portal2 = new this.powerup.constructor(this.p2.x,this.p2.y,i),
			this.portal1.addOtherPortalRef(this.portal2),
			this.portal2.addOtherPortalRef(this.portal1),
			i.addPowerup(this.portal1),
			i.addPowerup(this.portal2),
			this.toolhandler.addActionToTimeline({
				type: "add",
				objects: [this.portal1, this.portal2]
			})
		} else
			this.portal1 = null;
		this.active = !1
	}
	draw(t) {
		let e = this.mouse.touch
		  , i = this.camera.zoom
		  , s = this.scene.screen
		  , n = this.scene.settings.device;
		if (this.active === !0) {
			let a = s.realToScreen(this.p1.x, "x")
			  , h = s.realToScreen(this.p1.y, "y")
			  , l = s.realToScreen(this.p2.x, "x")
			  , c = s.realToScreen(this.p2.y, "y")
			  , u = this.p1
			  , p = this.p2
			  , d = u.y - p.y
			  , f = u.x - p.x
			  , v = Math.atan2(u.y - p.y, u.x - p.x);
			0 === f && 0 === d && (v = Math.PI - Math.PI / 2),
			0 > v && (v += 2 * Math.PI),
			this.drawPathToMouse(t, v),
			this.portal1.draw(a, h, i, t),
			this.powerup.draw(l, c, i, t)
		} else if ("desktop" === n) {
			t.globalAlpha = .8;
			let g = s.realToScreen(e.real.x, "x")
			  , m = s.realToScreen(e.real.y, "y");
			this.powerup.draw(g, m, i, t),
			t.globalAlpha = 1
		}
	}
	drawPathToMouse(t) {
		let e = this.p1
		  , i = this.p2
		  , s = this.scene.screen
		  , n = this.scene.camera.zoom
		  , r = s.realToScreen(e.x, "x")
		  , o = s.realToScreen(e.y, "y")
		  , c = s.realToScreen(i.x, "x")
		  , u = s.realToScreen(i.y, "y")
		  , p = Math.sqrt(Math.pow(c - r, 2) + Math.pow(u - o, 2));
		30 * n > p && (p = 30 * n),
		t.strokeStyle = "#dd45ec",
		t.lineWidth = Math.max(1, 2 * n),
		t.beginPath(),
		t.moveTo(r, o),
		t.lineTo(c, u),
		t.stroke(),
		t.closePath()
	}
}