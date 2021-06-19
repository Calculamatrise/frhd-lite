import Tool from "./tool.js";
import r from "./vehiclepoweruptools/balloontool.js";
import o from "./vehiclepoweruptools/blobtool.js";
import s from "./vehiclepoweruptools/helicoptertool.js";
import n from "./vehiclepoweruptools/trucktool.js";

export default class extends Tool {
    constructor(t) {
        super(t);
        this.powerupTools = {};
        this.options = t.scene.settings.vehiclePowerup;
        this.registerPowerupTools();
    }
    name = "vehiclepowerup";
    powerupTools = null;
    registerPowerupTools() {
        this.registerTool(new s(this,this.toolhandler)),
        this.registerTool(new n(this,this.toolhandler)),
        this.registerTool(new r(this,this.toolhandler)),
        this.registerTool(new o(this,this.toolhandler))
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
    update() {
        this.toolhandler.gamepad,
        this.mouse,
        this.options;
        super.update();
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
        var t = this.scene
          , e = (t.game.canvas,
        t.game.canvas.getContext("2d"))
          , i = this.options;
        this.powerupTools[i.selected].draw(e)
    }
}