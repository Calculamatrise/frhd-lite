import Tool from "./tool.js";

export default class BasePowerupTool extends Tool {
	name = '';
	powerupTools = {};
	registerTool(t) {
		this.powerupTools[this.toolhandler.constructor.parseToolName(t.name)] = t
	}
	setOption(t, e) {
		this.options[t] = e
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
	draw(t) {
		super.draw(t),
		this.powerupTools[this.options.selected].draw(t)
	}
}