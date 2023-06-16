import Tool from "./tool.js";
import r from "./vehiclepoweruptools/balloontool.js";
import o from "./vehiclepoweruptools/blobtool.js";
import s from "./vehiclepoweruptools/helicoptertool.js";
import n from "./vehiclepoweruptools/trucktool.js";

export default class extends Tool {
	name = "vehiclepowerup";
    powerupTools = null;
    constructor(t) {
        super(t);
        this.powerupTools = {};
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
        var t = this.options.selected;
        this.powerupTools[t].press()
    }
    hold() {
        var t = this.options.selected;
        this.powerupTools[t].hold()
    }
    release() {
        var t = this.options.selected;
        this.powerupTools[t].release()
    }
    draw() {
        this.powerupTools[this.options.selected].draw(this.scene.game.canvas.getContext("2d"))
    }
}