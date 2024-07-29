import PowerupTool from "./poweruptool.js";
import AntigravityPowerup from "../../sector/powerups/antigravity.js";

export default class Antigravity extends PowerupTool {
	name = 'antigravity';
	constructor(t) {
		super(t),
		this.powerup = new AntigravityPowerup(0, 0, t.scene.track)
	}
	press() {
		let t = this.mouse.touch
		  , e = t.real;
		this.p1.x = e.x,
		this.p1.y = e.y;
		let i = this.scene.track
		  , s = new this.powerup.constructor(this.p1.x,this.p1.y,i);
		i.addPowerup(s),
		this.toolhandler.addActionToTimeline({
			type: "add",
			objects: [s]
		})
	}
	release() {}
}