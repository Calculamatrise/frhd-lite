import PowerupTool from "../poweruptools/poweruptool.js";

export default class extends PowerupTool {
	name = "vehiclepowerup";
	options = null;
	constructor(t, e) {
		super(e);
		this.options = t.options;
	}
	release() {
		let t = this.scene.track
		  , e = new this.powerup.constructor(this.p1.x,this.p1.y,this.options.time,t);
		t.addPowerup(e),
		this.active = !1,
		this.toolhandler.addActionToTimeline({
			type: "add",
			objects: [e]
		})
	}
}