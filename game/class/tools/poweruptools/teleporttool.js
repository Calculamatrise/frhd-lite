import i from "../../math/cartesian.js";
import Tool from "../tool.js";
import n from "../../sector/powerups/teleport.js";

export default class extends Tool {
    constructor(t) {
        super(t);
        this.powerup = new n(0, 0, t.scene.track);
        this.p1 = new i(0, 0);
        this.p2 = new i(0, 0);
        this.active = !1;
    }
    powerup = null;
    name = "teleport";
    p1 = null;
    p2 = null;
    active = !1;
    press() {
        var t = this.mouse.touch
          , e = t.real
          , i = (this.scene.screen,
        this.scene.track);
        this.p1.x = e.x,
        this.p1.y = e.y,
        this.portal1 = new n(this.p1.x,this.p1.y,i),
        this.active = !0
    }
    hold() {
        var t = this.mouse.touch
          , e = t.real;
        this.p2.x = e.x,
        this.p2.y = e.y
    }
    release() {
        var t = Math.abs(this.p2.x - this.p1.x)
          , e = Math.abs(this.p2.y - this.p1.y);
        if (t > 40 || e > 40) {
            var i = this.scene.track;
            this.portal2 = new n(this.p2.x,this.p2.y,i),
            this.portal1.addOtherPortalRef(this.portal2),
            this.portal2.addOtherPortalRef(this.portal1),
            i.addPowerup(this.portal1),
            i.addPowerup(this.portal2),
            this.toolhandler.addActionToTimeline({
                type: "add",
                objects: [this.portal1, this.portal2]
            }),
            this.active = !1
        } else
            this.active = !1,
            this.portal1 = null
    }
    draw(t) {
        var e = this.mouse.touch
          , i = (e.pos,
        this.camera.zoom)
          , s = this.scene.screen
          , n = this.scene.settings.device;
        if (this.active === !0) {
            var a = s.realToScreen(this.p1.x, "x")
              , h = s.realToScreen(this.p1.y, "y")
              , l = s.realToScreen(this.p2.x, "x")
              , c = s.realToScreen(this.p2.y, "y")
              , u = this.p1
              , p = this.p2
              , d = u.y - p.y
              , f = u.x - p.x
              , v = Math.atan2(u.y - p.y, u.x - p.x);
            0 === f && 0 === d && (v = Math.PI - Math.PI / 2),
            0 > v && (v += 2 * Math.PI),
            this.drawPathToMouse(t, v),
            this.portal1.draw(a, h, i, t),
            this.powerup.draw(l, c, i, t)
        } else if ("desktop" === n) {
            t.globalAlpha = .8;
            var g = s.realToScreen(e.real.x, "x")
              , m = s.realToScreen(e.real.y, "y");
            this.powerup.draw(g, m, i, t),
            t.globalAlpha = 1
        }
    }
    drawPathToMouse(t) {
        var e = this.p1
          , i = this.p2
          , s = this.scene.screen
          , n = this.scene.camera.zoom
          , r = s.realToScreen(e.x, "x")
          , o = s.realToScreen(e.y, "y")
          , c = s.realToScreen(i.x, "x")
          , u = s.realToScreen(i.y, "y")
          , p = Math.sqrt(Math.pow(c - r, 2) + Math.pow(u - o, 2));
        30 * n > p && (p = 30 * n),
        t.strokeStyle = "#dd45ec",
        t.lineWidth = Math.max(1, 2 * n),
        t.beginPath(),
        t.moveTo(r, o),
        t.lineTo(c, u),
        t.stroke(),
        t.closePath()
    }
}