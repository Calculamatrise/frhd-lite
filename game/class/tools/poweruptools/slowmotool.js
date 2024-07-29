import PowerupTool from "./poweruptool.js";
import SlowmoPowerup from "../../sector/powerups/slowmo.js";

export default class Slowmo extends PowerupTool {
	name = 'slowmo';
	constructor(t) {
		super(t),
		this.powerup = new SlowmoPowerup(0, 0, t.scene.track)
	}
}