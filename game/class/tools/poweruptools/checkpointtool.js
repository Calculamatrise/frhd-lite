import PowerupTool from "./poweruptool.js";
import n from "../../sector/powerups/checkpoint.js";

export default class extends PowerupTool {
	name = "checkpoint";
	constructor(t) {
		super(t);
		this.powerup = new n(0, 0, t.scene.track);
	}
}