import BasePowerupTool from "./basepoweruptool.js";
import r from "./vehiclepoweruptools/balloontool.js";
import o from "./vehiclepoweruptools/blobtool.js";
import s from "./vehiclepoweruptools/helicoptertool.js";
import n from "./vehiclepoweruptools/trucktool.js";

export default class VehiclePowerup extends BasePowerupTool {
	name = 'vehiclepowerup';
	constructor(t) {
		super(t),
		this.options = t.scene.settings.vehiclePowerup,
		this.registerPowerupTools()
	}
	registerPowerupTools() {
		this.registerTool(new s(this, this.toolhandler)),
		this.registerTool(new n(this, this.toolhandler)),
		this.registerTool(new r(this, this.toolhandler)),
		this.registerTool(new o(this, this.toolhandler))
	}
}