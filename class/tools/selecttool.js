import Vector from "../math/cartesian.js";
import Tool from "./tool.js";
import Path from "../utils/path.js";

export default class extends Tool {
    constructor(t) {
        super(t);
        this.p1 = new Vector(0,0),
        this.p2 = new Vector(0,0),
        this.addedObjects = [],
        this.selectedElements = [],
        this.selectedSectors = [],
        this.selectedSegments = [],
        this.dashOffset = 0
    }
    name = "Select";
    passive = !1;
    active = !1;
    p1 = null;
    p2 = null;
    travelDistance = 1;
    selectedElements = [];
    selectedSectors = [];
    selectedSegments = [];
    press() {
        var t = this.mouse.touch.real;
        this.passive = !1,
        this.active = !0,
        this.p1.x = t.x,
        this.p1.y = t.y,
        this.p2.x = t.x,
        this.p2.y = t.y
    }
    hold() {
        var t = this.mouse.touch.real;
        this.p2.x = t.x,
        this.p2.y = t.y
    }
    unselectElements() {
        this.selectedElements = [];
        this.selectedSectors = [];
        this.selectedSegments = [];
    }
    moveSelected(a) {
        var selectedSectors = this.selectedSectors;
        this.selectedSectors = [];
        for (const i of selectedSectors) {
            if (i.p2) {
                switch(a) {
                    case "ArrowUp":
                        i.p1.y-= this.travelDistance;
                        i.p2.y-= this.travelDistance;
                        break;
                    case "ArrowDown":
                        i.p1.y+= this.travelDistance;
                        i.p2.y+= this.travelDistance;
                        break;
                    case "ArrowLeft":
                        i.p1.x-= this.travelDistance;
                        i.p2.x-= this.travelDistance;
                        break;
                    case "ArrowRight":
                        i.p1.x+= this.travelDistance;
                        i.p2.x+= this.travelDistance;
                        break;
                }
                if (i.name) {
                    this.selectedSectors.push(this.scene.track.addPowerup(i));
                } else {
                    this.selectedSectors.push(this.scene.track[i.type == "physics" ? "addPhysicsLine" : "addSceneryLine"](i.p1.x, i.p1.y, i.p2.x, i.p2.y));
                }
                i.removeAllReferences();
            } else {
                switch(a) {
                    case "ArrowUp":
                        i.y-= this.travelDistance;
                        break;
                    case "ArrowDown":
                        i.y+= this.travelDistance;
                        break;
                    case "ArrowLeft":
                        i.x-= this.travelDistance;
                        break;
                    case "ArrowRight":
                        i.x+= this.travelDistance;
                }
                this.selectedSegments.push(this.scene.track.addPowerup(i));
            }
        }
    }
    fillSelected() {
        if (this.p1.y < this.p2.y) {
            for (let y = this.p1.y; y < this.p2.y; y++) {
                this.scene.track.addPhysicsLine(this.p1.x, y, this.p2.x, y);
            }
        } else {
            for(let y = this.p2.y; y < this.p1.y; y++) {
                this.scene.track.addPhysicsLine(this.p2.x, y, this.p1.x, y);
            }
        }
    }
    rotateSelected() {
        const x = (this.travelDistance || 0) * Math.PI / 180;
        var selectedSectors = this.selectedSectors;
        this.selectedSectors = [];
        for (const i of selectedSectors) {
            if (i.p2) {
                i.p1.x = Math.round(i.p1.x * Math.cos(x) + i.p1.y * Math.sin(x));
                i.p1.y = Math.round(i.p1.y * Math.cos(x) + i.p1.x * Math.sin(x));
                i.p2.x = Math.round(i.p2.x * Math.cos(x) + i.p2.y * Math.sin(x));
                i.p2.y = Math.round(i.p2.y * Math.cos(x) + i.p2.x * Math.sin(x));
                if (!i.name) {
                    this.selectedSectors.push(this.scene.track[i.type == "physics" ? "addPhysicsLine" : "addSceneryLine"](i.p1.x, i.p1.y, i.p2.x, i.p2.y));
                }
                i.removeAllReferences();
            }
        }
    }
    copyAndPasteSelected() {
        for (const i of this.selectedSectors) {
            if (i.type == "physics") {
                this.scene.track.addPhysicsLine(i.p1.x, i.p1.y, i.p2.x, i.p2.y)
            } else if(i.type == "scenery") {
                this.scene.track.addSceneryLine(i.p1.x, i.p1.y, i.p2.x, i.p2.y)
            }
        }
    }
    release() {
        this.unselectElements();
        for (var t = this.scene.track.select(this.p1, this.p2), e = t.length, i = [], s = 0; e > s; s++) {
            var n = t[s];
            this.intersectsLine(n.x ? n : n.p1, n.x ? n : n.p2) && (this.selectedSectors.push(n),
            i.push(n))
        }
        this.selectedElements = i,
        this.active = !1,
        this.passive = !0,
        document.onkeydown = e => {
            e.preventDefault();
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            switch(e.key) {
                case "=":
                case "+":
                    this.travelDistance++;
                    this.scene.message.show("Increased travel distance for the Select Tool - " + this.travelDistance, !1, "#000000", "#FFFFFF");
                    break;
                case "-":
                    this.travelDistance--;
                    this.scene.message.show("Decreased travel distance for the Select Tool - " + this.travelDistance, !1, "#000000", "#FFFFFF");
                    break;
                case "c":
                    this.copyAndPasteSelected(e.key)
                    this.scene.message.show("Copied selected area", !1, "#000000", "#FFFFFF");
                    break;
                case "Delete":
                    for (const t of this.selectedSegments) {
                        t.removeAllReferences()
                    }
                    this.reset();
                    this.scene.message.show("Deleted selected area", !1, "#000000", "#FFFFFF");
                    break;
                case "f":
                    if (confirm("Are you sure you would you like to fill the selected area?"))
                        this.fillSelected(),
                        this.scene.message.show("Filled selected area", !1, "#000000", "#FFFFFF");
                    break;
                case "r":
                    this.rotateSelected();
                    this.scene.message.show("Rotated selected area", !1, "#000000", "#FFFFFF");
                    break;
                case "ArrowUp":
                case "ArrowDown":
                case "ArrowLeft":
                case "ArrowRight":
                    this.moveSelected(e.key);
                    this.scene.message.show("Moved Selected Area", !1, "#000000", "#FFFFFF");
                    break;
                case "`":
                case "Escape":
                    this.reset()
            }
            this.timeout = setTimeout(() => this.scene.message.hide(), 1000);
        }
    }
    buildPaths(t) {
        for (var e = []; t.length > 0; ) {
            var i = new Path;
            i.build(t),
            e.push(i)
        }
    }
    intersectsLine(t, e) {
        var i = Math.min(this.p1.y, this.p2.y)
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
        var d = t.y
          , f = e.y
          , v = e.x - t.x;
        if (Math.abs(v) > 1e-7) {
            var g = (e.y - t.y) / v
              , m = t.y - g * t.x;
            d = g * u + m,
            f = g * p + m
        }
        if (d > f) {
            var y = f;
            f = d,
            d = y
        }
        return f > i + c && (f = i + c),
        i > d && (d = i),
        d > f ? !1 : !0
    }
    toScreen(t, e) {
        var i = this.scene.camera
          , s = this.scene.screen;
        return (t - i.position[e]) * i.zoom + s.center[e]
    }
    draw() {
        var t = this.scene
          , e = (t.game.canvas,
        t.game.canvas.getContext("2d"));
        if (this.active || this.passive) {
            var i = this.p1.toScreen(this.scene)
              , s = this.p2.toScreen(this.scene)
              , n = s.x - i.x
              , r = s.y - i.y;
            e.save(),
            this.active ? (e.beginPath(),
            e.rect(i.x, i.y, n, r),
            e.fillStyle = "rgba(24, 132, 207, 0.2)",
            e.fill(),
            e.lineWidth = 2,
            e.strokeStyle = "rgba(24, 132, 207, 0.7)",
            e.stroke()) : this.passive && (e.strokeStyle = "rgba(24, 132, 207, 0.7)",
            e.lineWidth = 2,
            e.strokeRect(i.x, i.y, n, r)),
            e.restore()
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
        for (var t = this.scene, e = t.camera, i = t.screen, s = t.game.canvas.getContext("2d"), n = e.zoom, r = e.position, o = t.screen.center, a = this.settings.drawSectorSize * n, h = r.x * n / a, l = r.y * n / a, c = i.width / a, u = i.height / a, p = u / 2, d = c / 2, f = h - d - 1, v = l - p - 1, g = h + d, m = l + p, y = this.totalSectors, w = y.length, x = 0; w > x; x++) {
            var _ = y[x]
              , b = _.row
              , T = _.column;
            if (T >= f && g >= T && b >= v && m >= b) {
                _.drawn === !1 && _.image === !1 && _.draw();
                var C = T * a - h * a + o.x
                  , k = b * a - l * a + o.y;
                C = 0 | C,
                k = 0 | k,
                _.image ? s.drawImage(_.image, C, k) : s.drawImage(_.canvas, C, k)
            } else
                _.drawn && _.clear()
        }
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