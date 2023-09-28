import PowerupTool from "./poweruptool.js";
import Slowmo from "../../sector/powerups/slowmo.js";

export default class extends PowerupTool {
	name = "slowmo";
	constructor(t) {
		super(t);
		this.powerup = new Slowmo(0, 0, t.scene.track);
	}
}