import PowerupTool from "./poweruptool.js";
import n from "../../sector/powerups/target.js";

export default class extends PowerupTool {
	name = "goal";
	constructor(t) {
		super(t);
		this.powerup = new n(0, 0, t.scene.track);
	}
	release() {
		let t = this.scene.track
		  , e = new this.powerup.constructor(this.p1.x,this.p1.y,t);
		t.addTarget(e),
		t.addPowerup(e),
		this.active = !1,
		this.toolhandler.addActionToTimeline({
			type: "add",
			objects: [e]
		})
	}
}