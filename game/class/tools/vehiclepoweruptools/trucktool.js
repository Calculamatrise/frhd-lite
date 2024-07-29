import VehiclePowerupTool from "./vehiclepoweruptool.js";
import TruckPowerup from "../../sector/vehiclepowerups/truck.js";

export default class Truck extends VehiclePowerupTool {
	name = 'truck';
	constructor(t, e) {
		super(t, e),
		this.powerup = new TruckPowerup(0, 0, 0, e.scene.track)
	}
}