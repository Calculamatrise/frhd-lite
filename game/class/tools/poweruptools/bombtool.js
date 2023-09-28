import PowerupTool from "./poweruptool.js";
import n from "../../sector/powerups/bomb.js";

export default class extends PowerupTool {
	name = "bomb";
	constructor(t) {
		super(t);
		this.powerup = new n(0, 0, t.scene.track);
	}
}