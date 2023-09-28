import VehiclePowerupTool from "./vehiclepoweruptool.js";
import Balloon from "../../sector/vehiclepowerups/balloon.js";

export default class extends VehiclePowerupTool {
	name = "balloon";
	constructor(t, e) {
		super(t, e);
		this.powerup = new Balloon(0, 0, 0, e.scene.track);
	}
}