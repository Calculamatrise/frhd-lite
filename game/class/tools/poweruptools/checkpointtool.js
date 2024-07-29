import PowerupTool from "./poweruptool.js";
import CheckpointPowerup from "../../sector/powerups/checkpoint.js";

export default class Checkpoint extends PowerupTool {
	name = 'checkpoint';
	constructor(t) {
		super(t),
		this.powerup = new CheckpointPowerup(0, 0, t.scene.track)
	}
}