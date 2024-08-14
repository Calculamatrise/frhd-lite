import DirectionalPowerup from "./directionalpoweruptool.js";
import GravityPowerup from "../../sector/powerups/gravity.js";

export default class Gravity extends DirectionalPowerup {
	color = 'rgba(162, 183, 210,0.2)';
	name = 'gravity';
	outline = '#A2B7D2';
	constructor(t) {
		super(t),
		this.powerup = new GravityPowerup(0, 0, 0, t.scene.track)
	}
}