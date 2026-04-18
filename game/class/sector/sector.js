import PhysicsLine from "./physicsline.js";
import SceneryLine from "./sceneryline.js";

export default class {
	physicsLines = [];
	sceneryLines = [];
	canvas = null;
	ctx = null;
	dirty = !1;
	drawn = !1;
	hasPowerups = !1;
	lineCount = 0;
	powerupCanvas = null;
	powerupCanvasOffset = 35;
	powerupCanvasDrawn = !1;
	powerups = {
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
	};
	powerupsCount = 0;
	constructor(t, e, i) {
		Object.defineProperties(this, {
			track: { value: i, writable: true },
			scene: { value: i.scene, writable: true }
		});
		this.settings = i.settings,
		this.drawSectorSize = i.settings.drawSectorSize,
		this.row = e,
		this.column = t,
		this.camera = i.camera,
		this.zoom = i.camera.zoom,
		this.canvasPool = i.canvasPool,
		this.x = t * this.drawSectorSize,
		this.y = e * this.drawSectorSize,
		this.realX = this.x * this.zoom,
		this.realY = this.y * this.zoom
	}

	#post(cmd, data, ...args) {
		TrackRenderer.postMessage(Object.assign({
			type: cmd,
			sector: {
				column: this.column,
				row: this.row
			}
		}, data), ...args)
	}

	addLine(t) {
		t instanceof PhysicsLine && this.physicsLines.push(t) || t.constructor === SceneryLine && this.sceneryLines.push(t);
		if (this.settings.multiThreadedRendering && 'TrackRenderer' in window) {
			const buf = t.toBuffer();
			this.#post('ADD_LINE', Object.assign({}, t instanceof PhysicsLine && {
				physicsLines: [buf]
			}, t.constructor === SceneryLine && {
				sceneryLines: [buf]
			}), [buf.buffer]);
		}

		this.lineCount++,
		this.drawn = !1
	}
	searchForLine(t, e) {
		return this[t].find(item => item.p1.x === e.x && item.p1.y === e.y && !item.recorded && !item.remove)
	}
	addPowerup(t) {
		this.powerups.all.push(t),
		this.powerups.hasOwnProperty(t.name + 's') && this.powerups[t.name + "s"].push(t),
		this.powerupsCount++,
		this.hasPowerups = !0,
		this.powerupCanvasDrawn = !1
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
	createCanvas() {
		if (this.settings.multiThreadedRendering && 'TrackRenderer' in window) {
			const physicsBuffer = new Int32Array(this.physicsLines.length * 4);
			let i = 0
			for (const { p1, p2 } of this.physicsLines) {
				physicsBuffer[i++] = p1.x
				physicsBuffer[i++] = p1.y
				physicsBuffer[i++] = p2.x
				physicsBuffer[i++] = p2.y
			}

			const sceneryBuffer = new Int32Array(this.sceneryLines.length * 4);
			i = 0;
			for (const { p1, p2 } of this.sceneryLines) {
				sceneryBuffer[i++] = p1.x
				sceneryBuffer[i++] = p1.y
				sceneryBuffer[i++] = p2.x
				sceneryBuffer[i++] = p2.y
			}

			this.#post('CREATE_SECTOR', {
				sector: {
					column: this.column,
					row: this.row,
					size: this.drawSectorSize,
					x: this.x,
					y: this.y
				},
				physicsBuf: physicsBuffer,
				sceneryBuf: sceneryBuffer,
				settings: {
					physicsLineColor: this.settings.physicsLineColor,
					sceneryLineColor: this.settings.sceneryLineColor
				},
				zoom: this.scene.camera.zoom
			}, [physicsBuffer.buffer, sceneryBuffer.buffer]);
			return;
		}

		this.canvas = this.canvasPool.getCanvas();
		let size = this.drawSectorSize * this.scene.camera.zoom | 0
		  , cleared = this.canvas.width !== size || this.canvas.height !== size;
		this.canvas.width = size,
		this.canvas.height = size,
		this.ctx = this.canvas.getContext("2d"),
		this.ctx.lineCap = 'round',
		this.ctx.lineWidth = Math.max(2 * this.scene.camera.zoom, .5),
		!cleared && this.ctx.clearRect(0, 0, size, size)
	}
	cleanSector() {
		this.cleanSectorType("physicsLines"),
		this.cleanSectorType("sceneryLines"),
		this.cleanSectorType("powerups", "all");
		this.powerups.all.length === 0 ? (this.hasPowerups = !1,
		this.powerupCanvas && (this.canvasPool.releaseCanvas(this.powerupCanvas),
		this.powerupCanvas = null)) : this.hasPowerups = !0,
		this.dirty = !1
	}
	cleanSectorType(t, e) {
		let i = this[t];
		e && (i = i[e]);
		// for (let n of i.filter(s => s.remove))
		// 	i.splice(i.indexOf(n), 1)
		for (let n of i.filter(s => s.remove)) {
			i.splice(i.indexOf(n), 1);

			if (t.endsWith('Lines') && this.settings.multiThreadedRendering && 'TrackRenderer' in window) {
				const buf = n.toBuffer();
				this.#post('REMOVE_LINE', Object.assign({}, n instanceof PhysicsLine && {
					physicsLines: [buf]
				}, n.constructor === SceneryLine && {
					sceneryLines: [buf]
				}), [buf.buffer])
			}
		}
	}
	draw() {
		!this.canvas && this.createCanvas();
		if (this.settings.multiThreadedRendering && 'TrackRenderer' in window) {
			this.#post('CACHE_SECTOR', {
				sector: {
					column: this.column,
					row: this.row,
					size: this.drawSectorSize,
					x: this.x,
					y: this.y
				},
				// physicsLines: this.physicsLines,
				// sceneryLines: this.sceneryLines,
				settings: {
					physicsLineColor: this.settings.physicsLineColor,
					sceneryLineColor: this.settings.sceneryLineColor
				},
				zoom: this.scene.camera.zoom
			});
		} else {
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
			this.ctx.rect(0, 0, this.canvas.width, this.canvas.height),
			this.ctx.stroke());
		}
		this.drawn = !0
	}
	drawLine(t, e) {
		!this.canvas && this.createCanvas(),
		this.ctx.beginPath(),
		this.ctx.strokeStyle = e,
		this.ctx.moveTo((t.p1.x - this.x) * this.scene.camera.zoom, (t.p1.y - this.y) * this.scene.camera.zoom),
		this.ctx.lineTo((t.p2.x - this.x) * this.scene.camera.zoom, (t.p2.y - this.y) * this.scene.camera.zoom),
		this.ctx.stroke()
	}
	erase(t, e, i) {
		let s = [];
		if (i.physics === !0)
			for (let n of this.physicsLines.filter(n => n.erase(t, e))) {
				s.push(n);

				if (this.settings.multiThreadedRendering && 'TrackRenderer' in window) {
					const buf = n.toBuffer();
					this.#post('REMOVE_LINE', { physicsLines: [buf] }, [buf.buffer]);
				}
			}
		if (i.scenery === !0)
			for (let n of this.sceneryLines.filter(n => n.erase(t, e))) {
				s.push(n);

				if (this.settings.multiThreadedRendering && 'TrackRenderer' in window) {
					const buf = n.toBuffer();
					this.#post('REMOVE_LINE', { sceneryLines: [buf] }, [buf.buffer]);
				}
			}
		if (i.powerups === !0)
			for (let n of this.powerups.all.map(n => n.erase(t, e)).filter(n => n))
				s.push(...n);
		return s
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
			physicsLines[n].remove ? this.physicsLines.splice(this.physicsLines.indexOf(physicsLines[n]), 1) : physicsLines[n].collide(t);
		if (t.parent.powerupsEnabled) {
			let i = t.parent.player
			  , s = this.powerups.all.filter(item => -1 === i._powerupsConsumed.misc.indexOf(item.id));
			!i.isGhost() && (s = s.filter(item => !item.hit));
			for (let h = s.length - 1; h >= 0; h--)
				s[h].remove ? this.powerups.all.splice(this.powerups.all.indexOf(s[h]), 1) : s[h].collide(t)
		}
	}
	drawLines(t, e, i) {
		for (const { p1: s, p2: n } of t)
			i.moveTo((s.x - this.x) * e, (s.y - this.y) * e),
			i.lineTo((n.x - this.x) * e, (n.y - this.y) * e)
	}
	drawPowerups(t, e, i) {
		let n = t.reduce((e, i) => { // filter overlapping powerups
			let n = e.filter(s => s.name === i.name && s.x === i.x && s.y === i.y);
			switch(i.prefix) {
			case 'B':
			case 'G':
				n = n.filter(s => s.angle === i.angle);
				break;
			case 'C':
			case 'O':
			case 'T':
			case 'V':
				n = n.filter(s => s.hit === i.hit)
			}
			n.length > 0 || e.push(i);
			return e
		}, []);
		for (let s of n) {
			if (s.remove)
				t.splice(t.indexOf(s), 1);
			else {
				s.draw((s.x - this.x) * e + this.powerupCanvasOffset * e / 2, (s.y - this.y) * e + this.powerupCanvasOffset * e / 2, e, i)
			}
		}
	}
	drawBackground(ctx, e, i) {
		ctx.fillStyle = i,
		ctx.fillRect(0, 0, this.drawSectorSize * e | 0, this.drawSectorSize * e | 0)
	}
	clear() {
		this.drawn = !1,
		this.powerupCanvasDrawn = !1,
		this.canvas && ((this.settings.multiThreadedRendering && 'TrackRenderer' in window) ? this.#post('CLEAR_SECTOR') : (this.canvasPool.releaseCanvas(this.canvas),
		this.canvas = null,
		this.ctx = null)),
		this.powerupCanvas && (this.canvasPool.releaseCanvas(this.powerupCanvas),
		this.powerupCanvas = null)
	}
	[Symbol.dispose]() {
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