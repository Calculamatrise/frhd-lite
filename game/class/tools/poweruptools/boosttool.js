import DirectionalPowerup from "./directionalpoweruptool.js";
import BoostPowerup from "../../sector/powerups/boost.js";

export default class Boost extends DirectionalPowerup {
	color = 'rgba(173, 207, 125,0.2)';
	name = 'boost';
	outline = '#ADCF7D';
	constructor(t) {
		super(t),
		this.powerup = new BoostPowerup(0, 0, 0, t.scene.track)
	}
}