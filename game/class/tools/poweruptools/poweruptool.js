import Cartesian from "../../math/cartesian.js";
import Tool from "../tool.js";

export default class BasePowerupTool extends Tool {
	active = !1;
	p1 = new Cartesian;
	powerup = null;
	draw(t) {
		let e = this.mouse.touch
		  , i = this.camera.zoom
		  , s = this.scene.settings.device
		  , n = this.scene.screen;
		if (this.active === !0) {
			let r = n.realToScreen(this.p1.x, "x")
			  , o = n.realToScreen(this.p1.y, "y");
			t.globalAlpha = .4,
			this.powerup.draw(r, o, i, t),
			t.globalAlpha = 1
		} else if ("desktop" === s) {
			let r = n.realToScreen(e.real.x, "x")
			  , o = n.realToScreen(e.real.y, "y");
			t.globalAlpha = .8,
			this.powerup.draw(r, o, i, t),
			t.globalAlpha = 1
		}
	}
	press() {
		let t = this.mouse.touch
		  , e = t.real;
		this.p1.x = e.x,
		this.p1.y = e.y,
		this.active = !0
	}
	release() {
		let t = this.scene.track
		  , e = new this.powerup.constructor(this.p1.x,this.p1.y,t);
		t.addPowerup(e),
		this.active = !1,
		this.toolhandler.addActionToTimeline({
			type: "add",
			objects: [e]
		})
	}
}