import i from "../math/cartesian.js";
import Tool from "./tool.js";
import n from "../utils/path.js";
import r from "../sector/physicsline.js";
import o from "../sector/sceneryline.js";

export default class extends Tool {
    constructor(t) {
        super();
        this.toolInit(t);
        this.p1 = new i(0, 0);
        this.p2 = new i(0, 0);
        this.selectedElements = [];
        this.dashOffset = 0;
    }
    toolInit = this.init;
    name = "Select";
    passive = !1;
    active = !1;
    p1 = null;
    p2 = null;
    selectedElements = [];
    dashOffset = 0;
    selectedSectors = [];
    press() {
        let t = this.mouse.touch.real;
        this.passive = !1,
        this.active = !0,
        this.p1.x = t.x,
        this.p1.y = t.y,
        this.p2.x = t.x,
        this.p2.y = t.y
    }
    hold() {
        let t = this.mouse.touch.real;
        this.p2.x = t.x,
        this.p2.y = t.y
    }
    unselectElements() {
        for (let t = this.selectedElements, e = t.length, i = 0; e > i; i++) {
            let s = t[i];
            s instanceof r && s.highlightLine(!1),
            s instanceof o && s.highlightLine(!1)
        }
    }
    release() {
        this.unselectElements();
        for (let t = (performance.now(),
        this.scene.track.select(this.p1, this.p2)), e = t.length, i = [], s = 0; e > s; s++) {
            let n = t[s];
            this.intersectsLine(n.p1, n.p2) && (n.removeAllReferences(),
            i.push(n))
        }
        this.selectedElements = i,
        this.active = !1,
        this.passive = !0
    }
    buildPaths(t) {
        for (let e = []; t.length > 0; ) {
            let i = new n;
            i.build(t),
            e.push(i)
        }
    }
    intersectsLine(t, e) {
        let i = Math.min(this.p1.y, this.p2.y)
          , s = Math.min(this.p1.x, this.p2.x)
          , n = Math.max(this.p1.y, this.p2.y)
          , r = Math.max(this.p1.x, this.p2.x)
          , o = Math.abs(r - s)
          , c = Math.abs(i - n)
          , u = t.x
          , p = e.x;
        if (t.x > e.x && (u = e.x,
        p = t.x),
        p > s + o && (p = s + o),
        s > u && (u = s),
        u > p)
            return !1;
        let d = t.y
          , f = e.y
          , v = e.x - t.x;
        if (Math.abs(v) > 1e-7) {
            let g = (e.y - t.y) / v
              , m = t.y - g * t.x;
            d = g * u + m,
            f = g * p + m
        }
        if (d > f) {
            let y = f;
            f = d,
            d = y
        }
        return f > i + c && (f = i + c),
        i > d && (d = i),
        d > f ? !1 : !0
    }
    toScreen(t, e) {
        let i = this.scene.camera
          , s = this.scene.screen;
        return (t - i.position[e]) * i.zoom + s.center[e]
    }
    draw() {
        let t = this.scene
          , e = (t.game.canvas,
        t.game.canvas.getContext("2d"));
        if (this.drawText(e),
        this.active || this.passive) {
            let i = this.p1.toScreen(this.scene)
              , s = this.p2.toScreen(this.scene)
              , n = s.x - i.x
              , r = s.y - i.y;
            e.save(),
            e.setLineDash && (e.setLineDash([6]),
            e.lineDashOffset = this.dashOffset),
            this.active ? (e.beginPath(),
            e.rect(i.x, i.y, n, r),
            e.fillStyle = "rgba(24, 132, 207, 0.3)",
            e.fill(),
            e.lineWidth = 2,
            e.strokeStyle = "rgba(24, 132, 207, 0.7)",
            e.stroke()) : this.passive && (e.strokeStyle = "rgba(24, 132, 207, 0.7)",
            e.lineWidth = 2,
            e.strokeRect(i.x, i.y, n, r)),
            e.restore(),
            this.dashOffset > 22 && (this.dashOffset = 0),
            this.dashOffset++
        }
    }
    reset() {
        this.p1.x = 0,
        this.p1.y = 0,
        this.p2.x = 0,
        this.p2.y = 0,
        this.active = !1,
        this.passive = !1,
        this.unselectElements()
    }
    drawSectors() {
        for (let t = this.scene, e = t.camera, i = t.screen, s = t.game.canvas.getContext("2d"), n = e.zoom, r = e.position, o = t.screen.center, a = this.settings.drawSectorSize * n, h = r.x * n / a, l = r.y * n / a, c = i.width / a, u = i.height / a, p = u / 2, d = c / 2, f = h - d - 1, v = l - p - 1, g = h + d, m = l + p, y = this.totalSectors, w = y.length, x = 0; w > x; x++) {
            let _ = y[x]
              , b = _.row
              , T = _.column;
            if (T >= f && g >= T && b >= v && m >= b) {
                _.drawn === !1 && _.image === !1 && _.draw();
                let C = T * a - h * a + o.x
                  , k = b * a - l * a + o.y;
                C = 0 | C,
                k = 0 | k,
                _.image ? s.drawImage(_.image, C, k) : s.drawImage(_.canvas, C, k)
            } else
                _.drawn && _.clear()
        }
    }
    drawText(t) {
        {
            let e = this.name
              , i = this.game.pixelRatio
              , s = this.scene;
            s.game.canvas,
            this.radius
        }
        t.save(),
        t.fillStyle = "#000000",
        t.font = 12 * i + "pt arial",
        t.fillText(e, 10 * i, 20 * i),
        t.font = 8 * i + "pt arial"
    }
    close() {
        this.dashOffset = 0,
        this.selectedElements = [],
        this.mouse = null,
        this.camera = null,
        this.scene = null,
        this.toolHandler = null,
        this.p2 = null,
        this.p1 = null,
        this.active = !1,
        this.passive = !1
    }
}