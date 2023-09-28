import Tool from "./tool.js";
import r from "./vehiclepoweruptools/balloontool.js";
import o from "./vehiclepoweruptools/blobtool.js";
import s from "./vehiclepoweruptools/helicoptertool.js";
import n from "./vehiclepoweruptools/trucktool.js";

export default class extends Tool {
	name = "vehiclepowerup";
	powerupTools = {};
	constructor(t) {
		super(t);
		this.options = t.scene.settings.vehiclePowerup;
		this.registerPowerupTools();
	}
	registerPowerupTools() {
		this.registerTool(new s(this, this.toolhandler)),
		this.registerTool(new n(this, this.toolhandler)),
		this.registerTool(new r(this, this.toolhandler)),
		this.registerTool(new o(this, this.toolhandler))
	}
	registerTool(t) {
		this.powerupTools[t.name] = t
	}
	setOption(t, e) {
		this.options[t] = e
	}
	getOptions() {
		return this.options
	}
	press() {
		let t = this.options.selected;
		this.powerupTools[t].press()
	}
	hold() {
		let t = this.options.selected;
		this.powerupTools[t].hold()
	}
	release() {
		let t = this.options.selected;
		this.powerupTools[t].release()
	}
	draw(ctx) {
		this.powerupTools[this.options.selected].draw(ctx)
	}
}