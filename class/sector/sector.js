import s from "./physicsline.js";
import n from "./sceneryline.js";

export default class {
    constructor(t, e, i) {
        this.track = i;
        this.scene = i.scene;
        this.settings = i.settings;
        this.drawSectorSize = this.settings.drawSectorSize;
        this.row = e;
        this.column = t;
        this.camera = i.camera;
        this.zoom = i.camera.zoom;
        this.canvasPool = i.canvasPool;
        this.x = t * this.drawSectorSize;
        this.y = e * this.drawSectorSize;
        this.realX = this.x * this.zoom;
        this.realY = this.y * this.zoom;
        this.lineCount = 0;
        this.powerupsCount = 0;
        this.drawn = !1;
        this.dirty = !1;
        this.physicsLines = [];
        this.sceneryLines = [];
        this.hasPowerups = !1;
        this.powerups = {
            all: [],
            goals: [],
            gravitys: [],
            boosts: [],
            slowmos: [],
            checkpoints: [],
            bombs: [],
            antigravitys: [],
            teleports: [],
            helicopters: [],
            trucks: [],
            balloons: [],
            blobs: []
        }
    }
    image = !1;
    scene = null;
    settings = null;
    drawSectorSize = null;
    row = 0;
    column = 0;
    camera = null;
    zoom = 0;
    x = 0;
    y = 0;
    realX = 0;
    realY = 0;
    lineCount = 0;
    powerupsCount = 0;
    drawn = !1;
    physicsLines = [];
    sceneryLines = [];
    powerups = [];
    canvasPool = null;
    canvas = null;
    powerupCanvas = null;
    powerupCanvasOffset = 30;
    powerupCanvasDrawn = !1;
    dirty = !1;
    addLine(t) {
        t instanceof s && this.physicsLines.push(t),
        t instanceof n && this.sceneryLines.push(t),
        this.lineCount++,
        this.drawn = !1
    }
    searchForLine(t, e) {
        var i = this[t]
            , s = !1;
        for (var n in i) {
            var r = i[n];
            r.p1.x === e.x && r.p1.y === e.y && r.recorded === !1 && r.remove === !1 && (s = r)
        }
        return s
    }
    addPowerup(t) {
        var e = this.powerups
            , i = null;
        switch (t.name) {
        case "goal":
            i = e.goals;
            break;
        case "gravity":
            i = e.gravitys;
            break;
        case "slowmo":
            i = e.slowmos;
            break;
        case "boost":
            i = e.boosts;
            break;
        case "checkpoint":
            i = e.checkpoints;
            break;
        case "bomb":
            i = e.bombs;
            break;
        case "antigravity":
            i = e.antigravitys;
            break;
        case "teleport":
            i = e.teleports;
            break;
        case "helicopter":
            i = e.helicopters;
            break;
        case "truck":
            i = e.trucks;
            break;
        case "balloon":
            i = e.balloons;
            break;
        case "blob":
            i = e.blobs
        }
        e.all.push(t),
        i.push(t),
        this.powerupsCount++,
        this.hasPowerups = !0,
        this.powerupCanvasDrawn = !1
    }
    erase(t, e, i) {
        var s = [];
        if (i.physics === !0)
            for (var n = this.physicsLines, r = n.length, o = r - 1; o >= 0; o--) {
                var a = n[o];
                a.erase(t, e) && s.push(a)
            }
        if (i.scenery === !0)
            for (var h = this.sceneryLines, l = h.length, c = l - 1; c >= 0; c--) {
                var u = h[c];
                u.erase(t, e) && s.push(u)
            }
        if (i.powerups === !0)
            for (var p = this.powerups.all, d = p.length, f = d - 1; f >= 0; f--) {
                var v = p[f]
                    , g = v.erase(t, e);
                g !== !1 && s.push.apply(s, g)
            }
        return s
    }
    cleanSector() {
        this.cleanSectorType("physicsLines"),
        this.cleanSectorType("sceneryLines"),
        this.cleanSectorType("powerups", "all"),
        0 === this.powerups.all.length ? (this.hasPowerups = !1,
        this.powerupCanvas && (this.canvasPool.releaseCanvas(this.powerupCanvas),
        this.powerupCanvas = null)) : this.hasPowerups = !0,
        this.dirty = !1
    }
    cleanSectorType(t, e) {
        var i = this[t];
        e && (i = i[e]);
        for (var s = i.length, n = s - 1; n >= 0; n--) {
            var r = i[n];
            r.remove && i.splice(n, 1)
        }
    }
    draw() {
        var t = this.scene.camera
            , e = t.zoom
            , i = this.physicsLines
            , s = this.sceneryLines
            , n = this.drawSectorSize * e | 0
            , r = this.canvasPool.getCanvas();
        r.width = n,
        r.height = n;
        var o = r.getContext("2d");
        o.clearRect(0, 0, r.width, r.height);
        var a = 2 * e > .5 ? 2 * e : .5
            , h = this.settings.sceneryLineColor
            , l = this.settings.physicsLineColor;
        o.save(),
        o.beginPath(),
        o.lineWidth = a,
        o.lineCap = "round",
        o.strokeStyle = h,
        this.drawLines(s, e, o),
        o.stroke(),
        o.beginPath(),
        o.lineWidth = a,
        o.lineCap = "round",
        o.strokeStyle = l,
        this.drawLines(i, e, o),
        o.stroke(),
        this.settings.developerMode && (o.beginPath(),
        o.strokeStyle = "blue",
        o.rect(0, 0, n, n),
        o.stroke()),
        this.canvas = r,
        this.drawn = !0
    }
    drawLine(t, e) {
        var i, s, n, r, o, a, h = this.canvas, l = this.scene.camera, c = l.zoom, u = 2 * c > .5 ? 2 * c : .5, p = !1, d = this.x, f = this.y;
        if (!h) {
            var v = this.drawSectorSize * c | 0;
            h = this.canvasPool.getCanvas(),
            h.width = v,
            h.height = v,
            p = h.getContext("2d")
        }
        p || (p = h.getContext("2d")),
        o = t.p1,
        a = t.p2,
        i = (o.x - d) * c,
        s = (o.y - f) * c,
        n = (a.x - d) * c,
        r = (a.y - f) * c,
        p.save(),
        p.beginPath(),
        p.lineWidth = u,
        p.lineCap = "round",
        p.strokeStyle = e,
        p.moveTo(i, s),
        p.lineTo(n, r),
        p.stroke()
    }
    cachePowerupSector() {
        this.powerupCanvasDrawn = !0;
        var t = this.powerups.all;
        if (t.length > 0) {
            var e = this.scene.camera
                , i = e.zoom
                , s = this.drawSectorSize * i | 0
                , n = this.powerupCanvasOffset
                , r = this.canvasPool.getCanvas();
            r.width = s + n * i,
            r.height = s + n * i;
            var o = r.getContext("2d");
            o.clearRect(0, 0, r.width, r.height),
            this.drawPowerups(this.powerups.slowmos, i, o),
            this.drawPowerups(this.powerups.checkpoints, i, o),
            this.drawPowerups(this.powerups.boosts, i, o),
            this.drawPowerups(this.powerups.gravitys, i, o),
            this.drawPowerups(this.powerups.bombs, i, o),
            this.drawPowerups(this.powerups.goals, i, o),
            this.drawPowerups(this.powerups.antigravitys, i, o),
            this.drawPowerups(this.powerups.teleports, i, o),
            this.drawPowerups(this.powerups.helicopters, i, o),
            this.drawPowerups(this.powerups.trucks, i, o),
            this.drawPowerups(this.powerups.balloons, i, o),
            this.drawPowerups(this.powerups.blobs, i, o),
            this.powerupCanvas = r,
            this.settings.developerMode && (o.beginPath(),
            o.strokeStyle = "red",
            o.rect(0, 0, r.width, r.height),
            o.stroke())
        }
    }
    update() {
        var t = this.camera.zoom;
        this.realX = this.x * t | 0,
        this.realY = this.y * t | 0,
        this.zoom = t
    }
    resetCollided() {
        for (var t = this.physicsLines, e = t.length, i = e - 1; i >= 0; i--)
            t[i] && (t[i].collided = !1)
    }
    collide(t) {
        for (var e = t.parent, i = this.physicsLines, s = i.length, n = s - 1; n >= 0; n--)
            if (i[n]) {
                var r = i[n];
                r.remove ? i.splice(n, 1) : r.collide(t)
            }
        if (e.powerupsEnabled)
            for (var o = this.powerups.all, a = o.length, h = a - 1; h >= 0; h--) {
                var l = o[h];
                l.remove ? o.splice(h, 1) : o[h].collide(t)
            }
    }
    drawLines(t, e, i) {
        for (var s, n, r, o, a, h, l, c = this.x, u = this.y, p = t.length, d = p - 1; d >= 0; d--) {
            var a = t[d];
            a.remove ? t.splice(d, 1) : (h = a.p1,
            l = a.p2,
            s = (h.x - c) * e,
            n = (h.y - u) * e,
            r = (l.x - c) * e,
            o = (l.y - u) * e,
            i.moveTo(s, n),
            i.lineTo(r, o))
        }
    }
    drawPowerups(t, e, i) {
        for (var t = t, s = t.length, n = this.x, r = this.y, o = this.powerupCanvasOffset * e / 2, a = s - 1; a >= 0; a--) {
            var h = t[a];
            if (h.remove)
                t.splice(a, 1);
            else {
                var l = (h.x - n) * e + o
                    , c = (h.y - r) * e + o;
                h.draw(l, c, e, i)
            }
        }
    }
    drawBackground(t, e, i) {
        var s = this.drawSectorSize * e | 0;
        t.beginPath(),
        t.rect(0, 0, s, s),
        t.fillStyle = i,
        t.fill()
    }
    clear() {
        this.drawn = !1,
        this.powerupCanvasDrawn = !1,
        this.canvas && (this.canvas = null,
        this.canvasPool.releaseCanvas(this.canvas)),
        this.powerupCanvas && (this.canvasPool.releaseCanvas(this.powerupCanvas),
        this.powerupCanvas = null)
    }
    close() {
        this.track = null,
        this.scene = null,
        this.settings = null,
        this.drawSectorSize = null,
        this.row = null,
        this.column = null,
        this.camera = null,
        this.zoom = null,
        this.canvasPool = null,
        this.x = null,
        this.y = null,
        this.realX = null,
        this.realY = null,
        this.lineCount = null,
        this.drawn = null,
        this.physicsLines = null,
        this.sceneryLines = null,
        this.canvas = null
    }
}