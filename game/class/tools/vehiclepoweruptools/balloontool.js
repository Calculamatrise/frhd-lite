import VehiclePowerupTool from "./vehiclepoweruptool.js";
import BalloonPowerup from "../../sector/vehiclepowerups/balloon.js";

export default class Balloon extends VehiclePowerupTool {
	name = 'balloon';
	constructor(t, e) {
		super(t, e),
		this.powerup = new BalloonPowerup(0, 0, 0, e.scene.track)
	}
}