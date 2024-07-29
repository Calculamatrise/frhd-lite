import VehiclePowerupTool from "./vehiclepoweruptool.js";
import HelicopterPowerup from "../../sector/vehiclepowerups/helicopter.js";

export default class Helicopter extends VehiclePowerupTool {
	name = 'helicopter';
	constructor(t, e) {
		super(t, e),
		this.powerup = new HelicopterPowerup(0, 0, 0, e.scene.track)
	}
}