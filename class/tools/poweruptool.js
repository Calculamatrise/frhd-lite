import Tool from "./tool.js";
import l from "./poweruptools/antigravitytool.js";
import h from "./poweruptools/bombtool.js";
import r from "./poweruptools/boosttool.js";
import a from "./poweruptools/checkpointtool.js";
import n from "./poweruptools/goaltool.js";
import s from "./poweruptools/gravitytool.js";
import o from "./poweruptools/slowmotool.js";
import c from "./poweruptools/teleporttool.js";

export default class extends Tool {
    constructor(t) {
        super(t);
        this.powerupTools = {};
        this.registerPowerupTools();
        this.options = {
            selected: "goal"
        }
    }
    name = "Powerup";
    powerupTools = null;
    registerPowerupTools() {
        this.registerTool(new n(this.toolhandler)),
        this.registerTool(new r(this.toolhandler)),
        this.registerTool(new s(this.toolhandler)),
        this.registerTool(new o(this.toolhandler)),
        this.registerTool(new h(this.toolhandler)),
        this.registerTool(new a(this.toolhandler)),
        this.registerTool(new l(this.toolhandler)),
        this.registerTool(new c(this.toolhandler))
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
        var t = this.toolhandler.gamepad
          , e = (this.mouse,
        this.options);
        t.isButtonDown("opt1") && (e.selected = "goal",
        t.setButtonUp("opt1"),
        this.scene.stateChanged()),
        t.isButtonDown("opt2") && (e.selected = "boost",
        t.setButtonUp("opt2"),
        this.scene.stateChanged()),
        t.isButtonDown("opt3") && (e.selected = "gravity",
        t.setButtonUp("opt3"),
        this.scene.stateChanged()),
        t.isButtonDown("opt4") && (e.selected = "slowmo",
        t.setButtonUp("opt4"),
        this.scene.stateChanged()),
        t.isButtonDown("opt5") && (e.selected = "bomb",
        t.setButtonUp("opt5"),
        this.scene.stateChanged()),
        t.isButtonDown("opt6") && (e.selected = "checkpoint",
        t.setButtonUp("opt6"),
        this.scene.stateChanged()),
        t.isButtonDown("opt7") && (e.selected = "antigravity",
        t.setButtonUp("opt7"),
        this.scene.stateChanged()),
        t.isButtonDown("opt8") && Application.User.get("classic") && (e.selected = "teleport",
        t.setButtonUp("opt8"),
        this.scene.stateChanged()),
        super.update.bind(this);
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