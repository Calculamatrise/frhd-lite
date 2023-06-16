import i from "../../math/cartesian.js";
import Tool from "../tool.js";
import n from "../../sector/vehiclepowerups/helicopter.js";

export default class extends Tool {
    constructor(t, e) {
        super(e);
        this.powerup = new n(0, 0, 0, e.scene.track);
        this.p1 = new i(0, 0);
        this.p2 = new i(0, 0);
        this.options = t.options;
        this.active = !1;
    }
    powerup = null;
    name = "helicopter";
    p1 = null;
    p2 = null;
    active = !1;
    draw(t) {
        var e = this.mouse.touch
          , i = e.pos
          , s = this.camera.zoom
          , n = this.scene.settings.device;
        if (("desktop" === n || this.active) && (t.globalAlpha = .8,
        this.powerup.draw(i.x, i.y, s, t),
        t.globalAlpha = 1),
        this.active === !0) {
            var r = this.scene.screen
              , o = r.realToScreen(this.p1.x, "x")
              , a = r.realToScreen(this.p1.y, "y");
            t.globalAlpha = .4,
            this.powerup.draw(o, a, s, t),
            t.globalAlpha = 1
        }
    }
    press() {
        var t = this.mouse.touch
          , e = t.real;
        this.p1.x = e.x,
        this.p1.y = e.y,
        this.p2.x = e.x,
        this.p2.y = e.y,
        this.active = !0
    }
    hold() {
        var t = this.mouse.touch
          , e = t.real;
        this.p2.x = e.x,
        this.p2.y = e.y
    }
    release() {
        var t = (this.scene.screen,
        this.scene.track)
          , e = new n(this.p1.x,this.p1.y,this.options.time,t);
        t.addPowerup(e),
        this.active = !1,
        this.toolhandler.addActionToTimeline({
            type: "add",
            objects: [e]
        })
    }
}