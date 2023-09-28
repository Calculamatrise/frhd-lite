import VehiclePowerupTool from "./vehiclepoweruptool.js";
import Helicopter from "../../sector/vehiclepowerups/helicopter.js";

export default class extends VehiclePowerupTool {
	name = "helicopter";
	constructor(t, e) {
		super(t, e);
		this.powerup = new Helicopter(0, 0, 0, e.scene.track);
	}
}