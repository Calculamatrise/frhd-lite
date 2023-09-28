import PowerupTool from "./poweruptool.js";
import n from "../../sector/powerups/antigravity.js";

export default class extends PowerupTool {
	name = "antigravity";
	constructor(t) {
		super(t);
		this.powerup = new n(0, 0, t.scene.track);
	}
	press() {
		let t = this.mouse.touch
		  , e = t.real;
		this.p1.x = e.x,
		this.p1.y = e.y;
		let i = this.scene.track
		  , s = new n(this.p1.x,this.p1.y,i);
		i.addPowerup(s),
		this.toolhandler.addActionToTimeline({
			type: "add",
			objects: [s]
		})
	}
	release() {}
}