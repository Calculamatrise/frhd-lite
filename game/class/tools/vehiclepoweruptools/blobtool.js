import VehiclePowerupTool from "./vehiclepoweruptool.js";
import BlobPowerup from "../../sector/vehiclepowerups/blob.js";

export default class Blob extends VehiclePowerupTool {
	name = 'blob';
	constructor(t, e) {
		super(t, e),
		this.powerup = new BlobPowerup(0, 0, 0, e.scene.track)
	}
}