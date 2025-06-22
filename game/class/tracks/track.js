import o from "../math/bresenham.js";
import Vector from "../math/cartesian.js";
import PhysicsLine from "../sector/physicsline.js";
import Antigravity from "../sector/powerups/antigravity.js";
import Bomb from "../sector/powerups/bomb.js";
import Boost from "../sector/powerups/boost.js";
import Checkpoint from "../sector/powerups/checkpoint.js";
import Gravity from "../sector/powerups/gravity.js";
import Slowmo from "../sector/powerups/slowmo.js";
import Target from "../sector/powerups/target.js";
import Teleport from "../sector/powerups/teleport.js";
import SceneryLine from "../sector/sceneryline.js";
import Sector from "../sector/sector.js";
import Balloon from "../sector/vehiclepowerups/balloon.js";
import Blob from "../sector/vehiclepowerups/blob.js";
import Helicopter from "../sector/vehiclepowerups/helicopter.js";
import Truck from "../sector/vehiclepowerups/truck.js";
import CanvasPool from "../utils/canvaspool.js";

export default class {
	defaultLine = {
		p1: new Vector(-40,50),
		p2: new Vector(40,50)
	}
	camera = null;
	canvasPool = null;
	settings = null;
	physicsLines = [];
	sceneryLines = [];
	powerups = [];
	powerupsLookupTable = {};
	targets = [];
	targetCount = 0;
	sectors = {
		drawSectors: [],
		physicsSectors: []
	}
	totalSectors = [];
	allowedVehicles = ["MTB", "BMX"];
	dirty = !1;
	constructor(t) {
		Object.defineProperties(this, {
			scene: { value: t, writable: true },
			game: { value: t.game, writable: true }
		});
		this.settings = t.game.settings;
		if (!this.settings.track) {
			this.settings.track = { vehicle: this.settings.startVehicle };
		}
		this.camera = t.camera,
		this.canvasPool = new CanvasPool(t),
		this.createPowerupCache();
		if ('TrackRenderer' in window) {
			Object.defineProperty(this, '_boundRenderer', {
				configurable: true,
				value: this._handleRenderer.bind(this),
				writable: true
			});
			TrackRenderer.addEventListener('message', this._boundRenderer)
		}
	}
	_handleRenderer({ data }) {
		let t = this.sectors.drawSectors
		  , e = t[data.column];
		if (e === void 0) return;
		let i = e[data.row];
		if (i === void 0) return;
		if (i.initialRender && data.partial) return;
		!i.initialRender && data.partial === false && (i.initialRender = true);
		i.bitmap = data.bitmap
		i.canvas = data.bitmap
	}
	createPowerupCache() {
		let t = this.constructor.powerupCache;
		t.push(new Boost(0, 0, 0, this)),
		t.push(new Slowmo(0, 0, this)),
		t.push(new Bomb(0, 0, this)),
		t.push(new Gravity(0, 0, 0, this)),
		t.push(new Checkpoint(0, 0, this)),
		t.push(new Target(0, 0, this)),
		t.push(new Antigravity(0, 0, this)),
		t.push(new Teleport(0, 0, this)),
		t.push(new Helicopter(0, 0, 0, this)),
		t.push(new Truck(0, 0, 0, this)),
		t.push(new Balloon(0, 0, 0, this)),
		t.push(new Blob(0, 0, 0, this))
	}
	updatePowerups(t) {
		if (typeof t != 'function')
			throw new TypeError("'t' must be of type: function");
		for (let e of this.constructor.powerupCache)
			t(e);
		this.recachePowerups(Math.max(this.camera.zoom, 1))
	}
	recachePowerups(t) {
		for (const e of this.constructor.powerupCache)
			e.recache(t)
	}
	read(t) {
		var e = t.split("#")
		  , i = e.length > 0 && e[0].split(",")
		  , s = e.length > 1 && e[1].split(",")
		  , n = e.length > 2 && e[2].split(",");
		i && i.length > 0 && this.addLines(i, this.addPhysicsLine),
		s && s.length > 0 && this.addLines(s, this.addSceneryLine),
		n && n.length > 0 && this.addPowerups(n)
	}
	move(x = 0, y = 0) {
		for (const t in this.physicsLines)
			this.physicsLines[t].p1.x -= x,
			this.physicsLines[t].p1.y -= y,
			this.physicsLines[t].p2.x -= x,
			this.physicsLines[t].p2.y -= y,
			this.addPhysicsLineToTrack(this.physicsLines[t]),
			this.physicsLines.splice(i, 1); // remove from sectors
			// make removePhysicsLineFromTrack method
		for (const t in this.sceneryLines)
			this.sceneryLines[t].p1.x -= x,
			this.sceneryLines[t].p1.y -= y,
			this.sceneryLines[t].p2.x -= x,
			this.sceneryLines[t].p2.y -= y,
			this.addSceneryLineToTrack(t),
			this.sceneryLines.splice(i, 1);
		for (const t in this.powerups) {
			this.powerups[t].x -= x,
			this.powerups[t].y -= y;
			if (this.powerups[t].otherPortal)
				this.powerups[t].otherPortal.x -= x,
				this.powerups[t].otherPortal.y -= y;
			this.addPowerup(this.powerups[t]),
			this.powerups.splice(t, 1);
		}
		this.scene.redraw()
	}
	addPowerups(t) {
		for (var e = t.length, i = [], s = 0; e > s; s++)
			if (i = t[s].split(" "), i.length >= 2) {
				for (var n = [], r = i.length, o = 1; r > o; o++) {
					var a = parseInt(i[o], 32);
					n.push(a)
				}
				var h = Math.round(n[0])
				  , l = Math.round(n[1])
				  , p = null;
				switch (i[0]) {
				case "B":
					p = new Boost(h,l,n[2],this);
					break;
				case "S":
					p = new Slowmo(h,l,this);
					break;
				case "O":
					p = new Bomb(h,l,this);
					break;
				case "G":
					p = new Gravity(h,l,n[2],this);
					break;
				case "C":
					p = new Checkpoint(h,l,this);
					break;
				case "T":
					p = new Target(h,l,this),
					this.addTarget(p);
					break;
				case "A":
					p = new Antigravity(h,l,this);
					break;
				case "V":
					var d = n[2]
					  , P = n[3]
					  , M = this.settings.vehiclePowerup.minTime
					  , A = this.settings.vehiclePowerup.maxTime;
					P = P || M,
					P = Math.min(P, A),
					P = Math.max(P, M);
					switch (d) {
					case 1:
						p = new Helicopter(h,l,P,this);
						break;
					case 2:
						p = new Truck(h,l,P,this);
						break;
					case 3:
						p = new Balloon(h,l,P,this);
						break;
					case 4:
						p = new Blob(h,l,P,this);
						break;
					default:
						continue;
					}
					break;
				case "W":
					var D = n[0]
					  , I = n[1]
					  , E = n[2]
					  , O = n[3]
					  , z = new Teleport(D,I,this)
					  , j = new Teleport(E,O,this);
					z.addOtherPortalRef(j),
					j.addOtherPortalRef(z),
					this.addPowerup(z),
					this.addPowerup(j);
				default:
					continue;
				}
				this.addPowerup(p);
			}
	}
	addTarget(t) {
		this.dirty = !0,
		this.targetCount++;
		this.targets.push(t)
	}
	addPowerup(t) {
		if (window.hasOwnProperty('lite') && lite.storage.get('filterDuplicatePowerups')) {
			let e = this.powerups.filter(e => e.name === t.name && e.x == t.x && e.y == t.y)
			  , i = e.length > 0 && e[0];
			if (e.length > 0) {
				switch(t.prefix) {
				case 'B':
				case 'G':
					e = e.filter(e => e.angle == t.angle);
					i = e.length > 0 && e[0];
					if (e.length < 1)
						break;
					return i.multiplier++,
					i;
				case 'V':
					// i.multiplier++,
					// i.stack.push(t.time);
					// return i
					break;
				case 'W': // maybe limit to 2
					// also check other portal to see if it's identical
					// e = e.filter();
					// if (e.length > 2 * (1 + this.maxDuplicatePowerups))
					// 	return t;
					break;
				case 'T':
					this.dirty = !0,
					this.targets.pop()
				default:
					return i.multiplier++,
					i
				}
			}
		}
		this.addRef(t.x, t.y, t, this.constructor.types.POWERUPS, this.sectors.physicsSectors, this.settings.physicsSectorSize);
		let a = this.addRef(t.x, t.y, t, this.constructor.types.POWERUPS, this.sectors.drawSectors, this.settings.drawSectorSize);
		return a !== !1 && this.totalSectors.push(a), t !== null && (this.powerups.push(t), t.id && (this.powerupsLookupTable[t.id] = t)), t
	}
	addLines(t, e) {
		for (let i = t.length, s = 0; i > s; s++) {
			let n = t[s].split(" ")
			  , r = n.length;
			if (r > 3)
				for (let o = 0; r - 2 > o; o += 2) {
					let a = parseInt(n[o], 32)
					, h = parseInt(n[o + 1], 32)
					, l = parseInt(n[o + 2], 32)
					, c = parseInt(n[o + 3], 32)
					, u = a + h + l + c;
					isNaN(u) || e.call(this, a, h, l, c)
				}
		}
	}
	addPhysicsLine(t, e, i, s) {
		if (Math.sqrt(Math.pow(Math.round(i) - Math.round(t), 2) + Math.pow(Math.round(s) - Math.round(e), 2)) >= 2) {
			return this.addPhysicsLineToTrack(new PhysicsLine(Math.round(t), Math.round(e), Math.round(i), Math.round(s)))
		}
	}
	addPhysicsLineToTrack(t) {
		for (let l = o(t.p1.x, t.p1.y, t.p2.x, t.p2.y, this.settings.drawSectorSize, !0), p = 0; l.length > p; p += 2) {
			let v = this.addRef(l[p], l[p + 1], t, this.constructor.types.LINE, this.sectors.drawSectors, this.settings.drawSectorSize);
			v !== !1 && this.totalSectors.push(v)
		}
		for (let m = o(t.p1.x, t.p1.y, t.p2.x, t.p2.y, this.settings.physicsSectorSize), p = 0; m.length > p; p += 2) {
			this.addRef(m[p], m[p + 1], t, this.constructor.types.LINE, this.sectors.physicsSectors, this.settings.physicsSectorSize)
		}
		return this.physicsLines.push(t), t
	}
	addSceneryLine(t, e, i, s) {
		if (Math.sqrt(Math.pow(Math.round(i) - Math.round(t), 2) + Math.pow(Math.round(s) - Math.round(e), 2)) >= 2) {
			return this.addSceneryLineToTrack(new SceneryLine(Math.round(t), Math.round(e), Math.round(i), Math.round(s)))
		}
	}
	addSceneryLineToTrack(t) {
		for (let e = this.settings.drawSectorSize, i = t.p1, s = t.p2, n = i.x, r = i.y, a = s.x, h = s.y, l = o(n, r, a, h, e, !0), c = this.sectors.drawSectors, u = l.length, p = 0; u > p; p += 2) {
			let v = this.addRef(l[p], l[p + 1], t, this.constructor.types.LINE, c, e);
			v !== !1 && this.totalSectors.push(v)
		}
		return this.sceneryLines.push(t), t
	}
	addRef(t, e, i, s, n, r) {
		let o = Math.floor(t / r)
		  , h = Math.floor(e / r)
		  , c = !1;
		if (void 0 === n[o] && (n[o] = []), void 0 === n[o][h]) {
			let u = new Sector(o, h, this);
			n[o][h] = u,
			c = u
		}
		switch (s) {
		case this.constructor.types.LINE:
			n[o][h].addLine(i),
			i.addSectorReference(n[o][h]);
			break;
		case this.constructor.types.POWERUPS:
			n[o][h].addPowerup(i),
			i.addSectorReference(n[o][h])
		}
		return this.dirty = !0, c
	}
	cleanTrack() {
		this.cleanLines(),
		this.cleanPowerups()
	}
	cleanLines() {
		let t = this.physicsLines
		  , e = this.sceneryLines;
		for (let i of t.filter(t => t.remove))
			t.splice(t.indexOf(i), 1);
		for (let i of e.filter(t => t.remove))
			e.splice(e.indexOf(i), 1)
	}
	cleanPowerups() {
		let t = this.powerups
		  , e = this.targets;
		for (let i of t.filter(t => t.remove))
			t.splice(t.indexOf(i), 1);
		for (let i of e.filter(t => t.remove))
			e.splice(e.indexOf(i), 1);
		this.targetCount = this.targets.length
	}
	updatePowerupState(t) {
		this.resetPowerups(),
		this.setPowerupStates(t._powerupsConsumed.targets),
		this.setPowerupStates(t._powerupsConsumed.checkpoints),
		this.setPowerupStates(t._powerupsConsumed.misc)
	}
	setPowerupStates(t) {
		for (let e of t) {
			this.powerupsLookupTable[e].remove && this.powerupsLookupTable[e].id && (delete this.powerupsLookupTable[e], delete t[e]),
			this.powerupsLookupTable[e].hit = !0,
			this.powerupsLookupTable[e].sector.powerupCanvasDrawn = !1
		}
	}
	select(a, b) {
		const segments = [];
		let min = new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y))
		  , max = new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y));
		for (const i of [...this.physicsLines, ...this.sceneryLines, ...this.powerups].filter(t => !t.remove)) {
			if (i.p1 && i.p2) {
				if (((i.p1.x > min.x && i.p1.y > min.y) || (i.p2.x > min.x && i.p2.y > min.y)) && ((i.p1.x < max.x && i.p1.y < max.y) || (i.p2.x < max.x && i.p2.y < max.y))) {
					segments.push(i);
				}
			} else if (i.x > min.x && i.y > min.y && i.x < max.x && i.y < max.y) {
				segments.push(i);
			}
		}
		return segments
	}
	getCode() {
		this.cleanTrack();
		var t = this.powerups
		  , e = this.physicsLines
		  , i = this.sceneryLines
		  , s = "";
		if (e.length > 0) {
			for (var a of e)
				a.recorded || (s += a.p1.x.toString(32) + " " + a.p1.y.toString(32) + a.getCode(this) + ",");
			s = s.slice(0, -1);
			for (var a of e)
				a.recorded = !1
		}
		if (s += "#",
		i.length > 0) {
			for (var l of i)
				l.recorded || (s += l.p1.x.toString(32) + " " + l.p1.y.toString(32) + l.getCode(this) + ",");
			s = s.slice(0, -1);
			for (var l of i)
				l.recorded = !1
		}
		if (s += "#",
		t.length > 0) {
			for (var c of t.map(t => t.getCode()).filter(t => t))
				s += c + ",";
			s = s.slice(0, -1)
		}
		return s
	}
	resetPowerups() {
		for (let t of this.powerups.filter(t => t.hit && !t.remove))
			t.sector.powerupCanvasDrawn = t.hit = !1
	}
	addDefaultLine() {
		this.addPhysicsLine(this.defaultLine.p1.x, this.defaultLine.p1.y, this.defaultLine.p2.x, this.defaultLine.p2.y)
	}
	erase(t, e, i) {
		this.dirty = !0;
		for (var b = Math.floor(Math.min(t.x - e, t.x + e) / this.settings.drawSectorSize), _ = []; Math.floor(Math.max(t.x - e, t.x + e) / this.settings.drawSectorSize) >= b; b++)
			for (var T = Math.floor(Math.min(t.y - e, t.y + e) / this.settings.drawSectorSize); Math.floor(Math.max(t.y - e, t.y + e) / this.settings.drawSectorSize) >= T; T++)
				this.sectors.drawSectors[b] && this.sectors.drawSectors[b][T] && _.push(this.sectors.drawSectors[b][T].erase(t, e, i));
		return _.flat()
	}
	drawAndCache() {
		for (var t = performance.now(), e = this.totalSectors, i = e.length, s = 0; i > s; s++) {
			!function(t) {
				setTimeout(function() {
					t.draw(),
					t.cacheAsImage()
				}, 250 * s)
			}(e[s])
		}
		let r = performance.now();
		console.log("Track :: Time to draw entire track : " + (r - t) + "ms")
	}
	undraw() {
		for (let t of this.totalSectors.filter(t => t.drawn))
			t.clear(!0);
		this.recachePowerups(Math.max(this.camera.zoom, 1)),
		this.canvasPool.update()
	}
	collide(t) {
		let i = Math.floor(t.pos.x / this.settings.physicsSectorSize - .5)
		  , s = Math.floor(t.pos.y / this.settings.physicsSectorSize - .5);
		this.sectors.physicsSectors[i] && this.sectors.physicsSectors[i][s] && this.sectors.physicsSectors[i][s].resetCollided(),
		this.sectors.physicsSectors[i + 1] && this.sectors.physicsSectors[i + 1][s] && this.sectors.physicsSectors[i + 1][s].resetCollided(),
		this.sectors.physicsSectors[i + 1] && this.sectors.physicsSectors[i + 1][s + 1] && this.sectors.physicsSectors[i + 1][s + 1].resetCollided(),
		this.sectors.physicsSectors[i] && this.sectors.physicsSectors[i][s + 1] && this.sectors.physicsSectors[i][s + 1].resetCollided(),
		this.sectors.physicsSectors[i] && this.sectors.physicsSectors[i][s] && this.sectors.physicsSectors[i][s].collide(t),
		this.sectors.physicsSectors[i + 1] && this.sectors.physicsSectors[i + 1][s] && this.sectors.physicsSectors[i + 1][s].collide(t),
		this.sectors.physicsSectors[i + 1] && this.sectors.physicsSectors[i + 1][s + 1] && this.sectors.physicsSectors[i + 1][s + 1].collide(t),
		this.sectors.physicsSectors[i] && this.sectors.physicsSectors[i][s + 1] && this.sectors.physicsSectors[i][s + 1].collide(t)
	}
	getDrawSector(t, e) {
		let s = Math.floor(t / this.settings.drawSectorSize)
		  , n = Math.floor(e / this.settings.drawSectorSize);
		return typeof this.sectors.drawSectors[s] != "undefined" && typeof this.sectors.drawSectors[s][n] != "undefined" && (this.sectors.drawSectors[s][n])
	}
	draw(ctx) {
		const scene = this.scene
			, camera = scene.camera
			, settings = this.settings
			, size = settings.drawSectorSize * camera.zoom
			, g = camera.position.x / settings.drawSectorSize + scene.screen.width / (2 * size) | 0
			, m = camera.position.y / settings.drawSectorSize + scene.screen.height / (2 * size) | 0
			, f = camera.position.x / settings.drawSectorSize - scene.screen.width / (2 * size) - 1 | 0
			, v = camera.position.y / settings.drawSectorSize - scene.screen.height / (2 * size) - 1 | 0;
		for (const t of this.totalSectors) {
			if (t.dirty && t.cleanSector(), t.column >= f && g >= t.column && t.row >= v && m >= t.row) {
				t.drawn === !1 && t.draw(),
				t.hasPowerups && (t.powerupCanvasDrawn || t.cachePowerupSector());
				let S = (t.column * settings.drawSectorSize - camera.position.x) * camera.zoom + scene.screen.center.x | 0,
					P = (t.row * settings.drawSectorSize - camera.position.y) * camera.zoom + scene.screen.center.y | 0;
				ctx.drawImage(t.canvas, S, P, size, size);
				if (t.hasPowerups && t.powerupCanvasDrawn) {
					const powerupSectorSize = (settings.drawSectorSize + t.powerupCanvasOffset) * camera.zoom;
					ctx.drawImage(t.powerupCanvas, S - t.powerupCanvasOffset * camera.zoom / 2, P - t.powerupCanvasOffset * camera.zoom / 2, powerupSectorSize, powerupSectorSize)
				}
			} else
				t.drawn && t.clear()
		}
	}
	closeSectors() {
		for (const t of this.totalSectors)
			t.close()
	}
	close() {
		if ('TrackRenderer' in window)
			TrackRenderer.removeEventListener('message', this._boundRenderer),
			delete this._boundRenderer;
		this.scene = null,
		this.closeSectors(),
		this.totalSectors = null,
		this.canvasPool = null,
		this.sectors = null,
		this.physicsLines = null,
		this.sceneryLines = null,
		this.powerups = null,
		this.camera = null
	}

	static powerupCache = [];
	static types = {
		LINE: 1,
		POWERUPS: 2
	}
}