import PowerupTool from "./poweruptool.js";
import n from "../../sector/powerups/target.js";

export default class extends PowerupTool {
	name = "goal";
	constructor(t) {
		super(t);
		this.powerup = new n(0, 0, t.scene.track);
	}
	release() {
		let t = this.scene.track;
		t.addTarget(e),
		super.release()
	}
}