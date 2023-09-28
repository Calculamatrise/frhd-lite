import VehiclePowerupTool from "./vehiclepoweruptool.js";
import Blob from "../../sector/vehiclepowerups/blob.js";

export default class extends VehiclePowerupTool {
	name = "blob";
	constructor(t, e) {
		super(t, e);
		this.powerup = new Blob(0, 0, 0, e.scene.track);
	}
}