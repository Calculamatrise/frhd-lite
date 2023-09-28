import VehiclePowerupTool from "./vehiclepoweruptool.js";
import Truck from "../../sector/vehiclepowerups/truck.js";

export default class extends VehiclePowerupTool {
	name = "truck";
	constructor(t, e) {
		super(t, e);
		this.powerup = new Truck(0, 0, 0, e.scene.track);
	}
}