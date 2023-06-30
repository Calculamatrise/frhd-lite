import s from "./physicsline.js";
import n from "./sceneryline.js";

export default class {
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
            blobs: [],
            gliders: []
        }
    }
    addLine(t) {
        t instanceof s && this.physicsLines.push(t),
        t instanceof n && this.sceneryLines.push(t),
        this.lineCount++,
        this.drawn = !1
    }
    searchForLine(t, e) {
        for (const n in this[t]) {
            if (this[t][n].p1.x === e.x && this[t][n].p1.y === e.y && this[t][n].recorded === !1 && this[t][n].remove === !1) return this[t][n];
        }
    }
    addPowerup(t) {
        this.powerups.all.push(t);
        if (["goal", "gravity", "slowmo", "boost", "checkpoint", "bomb", "antigravity", "teleport", "helicopter", "truck", "balloon", "blob", "glider"].includes(t.name)) {
            this.powerups[t.name + "s"].push(t);
        }
        this.powerupsCount++,
        this.hasPowerups = !0,
        this.powerupCanvasDrawn = !1
    }
    erase(t, e, i) {
        var s = [...this.physicsLines.map(i.physics === !0 ? (s => (s.erase(t, e), s)) : (t => t)), ...this.sceneryLines.map(i.scenery === !0 ? (s => (s.erase(t, e), s)) : (t => t))];
        if (i.powerups === !0)
            for (const n of this.powerups.all) {
                let g = n.erase(t, e);
                g !== !1 && s.push.apply(s, g)
            }
        return s
    }
    cleanSector() {
        this.cleanSectorType("physicsLines"),
        this.cleanSectorType("sceneryLines"),
        this.cleanSectorType("powerups", "all");
        if (this.powerups.all.length === 0) {
            if (this.hasPowerups = !1, this.powerupCanvas) {
                this.canvasPool.releaseCanvas(this.powerupCanvas),
                this.powerupCanvas = null;
            }
        } else {
            this.hasPowerups = !0,
            this.dirty = !1;
        }
    }
    cleanSectorType(t, e) {
        let i = this[t];
        e && (i = i[e]);
        for (const s in i) {
            i[s].remove && i.splice(s, 1);
        }
    }
    draw() {
        this.canvas = this.canvasPool.getCanvas(),
        this.canvas.width = this.drawSectorSize * this.scene.camera.zoom | 0,
        this.canvas.height = this.drawSectorSize * this.scene.camera.zoom | 0;
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
        ctx.beginPath(),
        ctx.lineWidth = 2 * this.scene.camera.zoom > .5 ? 2 * this.scene.camera.zoom : .5,
        ctx.lineCap = "round",
        ctx.strokeStyle = this.settings.sceneryLineColor,
        this.drawLines(this.sceneryLines, this.scene.camera.zoom, ctx),
        ctx.stroke(),
        ctx.beginPath(),
        ctx.strokeStyle = this.settings.physicsLineColor,
        this.drawLines(this.physicsLines, this.scene.camera.zoom, ctx),
        ctx.stroke(),
        this.settings.developerMode && (ctx.beginPath(),
        ctx.strokeStyle = "blue",
        ctx.rect(0, 0, this.drawSectorSize * this.scene.camera.zoom | 0, this.drawSectorSize * this.scene.camera.zoom | 0),
        ctx.stroke()),
        this.drawn = !0
    }
    drawLine(t, e) {
        if (!this.canvas) {
            this.canvas = this.canvasPool.getCanvas(),
            this.canvas.width = this.drawSectorSize * this.scene.camera.zoom | 0,
            this.canvas.height = this.drawSectorSize * this.scene.camera.zoom | 0
        }
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath(),
        ctx.lineWidth = 2 * this.scene.camera.zoom > .5 ? 2 * this.scene.camera.zoom : .5,
        ctx.lineCap = "round",
        ctx.strokeStyle = e,
        ctx.moveTo((t.p1.x - this.x) * this.scene.camera.zoom, (t.p1.y - this.y) * this.scene.camera.zoom),
        ctx.lineTo((t.p2.x - this.x) * this.scene.camera.zoom, (t.p2.y - this.y) * this.scene.camera.zoom),
        ctx.stroke()
    }
    cachePowerupSector() {
        this.powerupCanvasDrawn = !0;
        if (this.powerups.all.length > 0) {
            this.powerupCanvas = this.canvasPool.getCanvas();
            this.powerupCanvas.width = (this.drawSectorSize * this.scene.camera.zoom | 0) + this.powerupCanvasOffset * this.scene.camera.zoom,
            this.powerupCanvas.height = (this.drawSectorSize * this.scene.camera.zoom | 0) + this.powerupCanvasOffset * this.scene.camera.zoom;
            const ctx = this.powerupCanvas.getContext("2d");
            ctx.clearRect(0, 0, this.powerupCanvas.width, this.powerupCanvas.height),
            this.drawPowerups(this.powerups.slowmos, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.checkpoints, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.boosts, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.gravitys, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.bombs, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.goals, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.antigravitys, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.teleports, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.helicopters, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.trucks, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.balloons, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.blobs, this.scene.camera.zoom, ctx),
            this.drawPowerups(this.powerups.gliders, this.scene.camera.zoom, ctx),
            this.settings.developerMode && (ctx.beginPath(),
            ctx.strokeStyle = "red",
            ctx.rect(0, 0, this.powerupCanvas.width, this.powerupCanvas.height),
            ctx.stroke())
        }
    }
    update() {
        this.realX = this.x * this.camera.zoom | 0,
        this.realY = this.y * this.camera.zoom | 0,
        this.zoom = this.camera.zoom
    }
    resetCollided() {
        for (let i = this.physicsLines.length - 1; i >= 0; i--)
            this.physicsLines[i] && (this.physicsLines[i].collided = !1)
    }
    collide(t) {
        for (let n = this.physicsLines.length - 1; n >= 0; n--)
            if (this.physicsLines[n]) {
                this.physicsLines[n].remove ? this.physicsLines.splice(n, 1) : this.physicsLines[n].collide(t)
            }
        if (t.parent.powerupsEnabled)
            for (let h = this.powerups.all.length - 1; h >= 0; h--) {
                this.powerups.all[h].remove ? this.powerups.all.splice(h, 1) : this.powerups.all[h].collide(t)
            }
    }
    drawLines(t, e, i) {
        for (const s in t) {
            if (t[s].remove) t.splice(s, 1);
            else i.moveTo((t[s].p1.x - this.x) * e, (t[s].p1.y - this.y) * e),
            i.lineTo((t[s].p2.x - this.x) * e, (t[s].p2.y - this.y) * e);
        }
    }
    drawPowerups(t, e, i) {
        for (const s in t) {
            if (t[s].remove)
                t.splice(s, 1);
            else {
                t[s].draw((t[s].x - this.x) * e + this.powerupCanvasOffset * e / 2, (t[s].y - this.y) * e + this.powerupCanvasOffset * e / 2, e, i)
            }
        }
    }
    drawBackground(ctx, e, i) {
        ctx.beginPath(),
        ctx.rect(0, 0, this.drawSectorSize * e | 0, this.drawSectorSize * e | 0),
        ctx.fillStyle = i,
        ctx.fill()
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