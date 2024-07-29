import PowerupTool from "./poweruptool.js";
import BombPowerup from "../../sector/powerups/bomb.js";

export default class Bomb extends PowerupTool {
	name = 'bomb';
	constructor(t) {
		super(t),
		this.powerup = new BombPowerup(0, 0, t.scene.track)
	}
}