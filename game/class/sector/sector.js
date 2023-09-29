import s from "./physicsline.js";
import n from "./sceneryline.js";

export default class {
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
	physicsLines = [];
	sceneryLines = [];
	canvasPool = null;
	canvas = null;
	ctx = null;
	dirty = !1;
	drawn = !1;
	hasPowerups = !1;
	lineCount = 0;
	powerupCanvas = null;
	powerupCanvasOffset = 35;
	powerupCanvasDrawn = !1;
	powerups = null;
	powerupsCount = 0;
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
	addLine(t) {
		t instanceof s && this.physicsLines.push(t),
		t instanceof n && this.sceneryLines.push(t),
		this.lineCount++,
		this.drawn = !1
	}
	searchForLine(t, e) {
		return this[t].find(item => item.p1.x === e.x && item.p1.y === e.y && !item.recorded && !item.remove);
	}
	addPowerup(t) {
		this.powerups.all.push(t);
		if (["goal", "gravity", "slowmo", "boost", "checkpoint", "bomb", "antigravity", "teleport", "helicopter", "truck", "balloon", "blob"].includes(t.name)) {
			this.powerups[t.name + "s"].push(t);
		}
		this.powerupsCount++,
		this.hasPowerups = !0,
		this.powerupCanvasDrawn = !1
	}
	erase(t, e, i) {
		let s = [];
		if (i.physics === !0)
			for (let n of this.physicsLines.filter(n => n.erase(t, e)))
				s.push(n);
		if (i.scenery === !0)
			for (let n of this.sceneryLines.filter(n => n.erase(t, e)))
				s.push(n);
		if (i.powerups === !0)
			for (let n of this.powerups.all) {
				let g = n.erase(t, e);
				g && s.push(...g)
			}
		return s
	}
	cleanSector() {
		this.cleanSectorType("physicsLines"),
		this.cleanSectorType("sceneryLines"),
		this.cleanSectorType("powerups", "all");
		this.powerups.all.length === 0 ? (this.hasPowerups = !1,
		this.powerupCanvas && (this.canvasPool.releaseCanvas(this.powerupCanvas),
		this.powerupCanvas = null)) : this.hasPowerups = !0,
		this.dirty = !1;
	}
	cleanSectorType(t, e) {
		let i = this[t];
		e && (i = i[e]);
		for (let s = i.length, n = s - 1; n >= 0; n--) {
			let r = i[n];
			r.remove && i.splice(n, 1)
		}
	}
	draw() {
		this.canvas = this.canvasPool.getCanvas(),
		this.canvas.width = this.drawSectorSize * this.scene.camera.zoom | 0,
		this.canvas.height = this.drawSectorSize * this.scene.camera.zoom | 0,
		this.ctx = this.canvas.getContext('2d'),
		this.ctx.lineCap = 'round',
		this.ctx.lineWidth = Math.max(2 * this.scene.camera.zoom, .5);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
		this.ctx.beginPath(),
		this.ctx.strokeStyle = this.settings.sceneryLineColor,
		this.drawLines(this.sceneryLines, this.scene.camera.zoom, this.ctx),
		this.ctx.stroke(),
		this.ctx.beginPath(),
		this.ctx.strokeStyle = this.settings.physicsLineColor,
		this.drawLines(this.physicsLines, this.scene.camera.zoom, this.ctx),
		this.ctx.stroke(),
		this.settings.developerMode && (this.ctx.beginPath(),
		this.ctx.strokeStyle = 'blue',
		this.ctx.rect(0, 0, this.drawSectorSize * this.scene.camera.zoom | 0, this.drawSectorSize * this.scene.camera.zoom | 0),
		this.ctx.stroke()),
		this.drawn = !0
	}
	drawLine(t, e) {
		if (!this.canvas) {
			this.canvas = this.canvasPool.getCanvas(),
			this.canvas.width = this.drawSectorSize * this.scene.camera.zoom | 0,
			this.canvas.height = this.drawSectorSize * this.scene.camera.zoom | 0,
			this.ctx = this.canvas.getContext("2d"),
			this.ctx.lineCap = 'round',
			this.ctx.lineWidth = Math.max(2 * this.scene.camera.zoom, .5);
		}
		this.ctx.beginPath(),
		this.ctx.strokeStyle = e,
		this.ctx.moveTo((t.p1.x - this.x) * this.scene.camera.zoom, (t.p1.y - this.y) * this.scene.camera.zoom),
		this.ctx.lineTo((t.p2.x - this.x) * this.scene.camera.zoom, (t.p2.y - this.y) * this.scene.camera.zoom),
		this.ctx.stroke()
	}
	cachePowerupSector() {
		this.powerupCanvasDrawn = !0;
		if (this.powerups.all.length > 0) {
			this.powerupCanvas = this.canvasPool.getCanvas();
			this.powerupCanvas.width = (this.drawSectorSize * this.scene.camera.zoom) + this.powerupCanvasOffset * this.scene.camera.zoom | 0,
			this.powerupCanvas.height = (this.drawSectorSize * this.scene.camera.zoom) + this.powerupCanvasOffset * this.scene.camera.zoom | 0;
			let ctx = this.powerupCanvas.getContext("2d");
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
		let physicsLines = this.physicsLines.filter(item => item.collided);
		for (let i = physicsLines.length - 1; i >= 0; i--)
			physicsLines[i].collided = !1
	}
	collide(t) {
		let physicsLines = this.physicsLines.filter(item => !item.collided);
		for (let n = physicsLines.length - 1; n >= 0; n--)
			physicsLines[n].remove ? this.physicsLines.splice(this.physicsLines.indexOf(physicsLines[n], n), 1) : physicsLines[n].collide(t)
		if (t.parent.powerupsEnabled)
			for (let h = this.powerups.all.length - 1; h >= 0; h--) {
				this.powerups.all[h].remove ? this.powerups.all.splice(h, 1) : this.powerups.all[h].collide(t)
			}
	}
	drawLines(t, e, i) {
		for (let s in t) {
			if (t[s].remove) t.splice(s, 1);
			else i.moveTo((t[s].p1.x - this.x) * e, (t[s].p1.y - this.y) * e),
			i.lineTo((t[s].p2.x - this.x) * e, (t[s].p2.y - this.y) * e);
		}
	}
	maxOverlapPowerups = 0;
	drawPowerups(t, e, i) {
		let n = t;
		window.hasOwnProperty('lite') && lite.storage.get('experiments').filterOverlappingPowerups && (n = t.reduce((e, i) => {
			let n = e.filter(s => i.x === s.x && i.y === s.y);
			n.length > this.maxOverlapPowerups || e.push(i);
			return e
		}, []));
		for (let s of n) {
			if (s.remove)
				t.splice(t.indexOf(s), 1);
			else {
				s.draw((s.x - this.x) * e + this.powerupCanvasOffset * e / 2, (s.y - this.y) * e + this.powerupCanvasOffset * e / 2, e, i)
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
		this.canvas && (this.canvasPool.releaseCanvas(this.canvas),
		this.canvas = null,
		this.ctx = null),
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
		this.canvas = null,
		this.ctx = null
	}
}