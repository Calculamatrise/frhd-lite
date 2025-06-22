import Cartesian from "../math/cartesian.js";
import Gamepad from "../utils/gamepad.js";
import BALLOON from "./balloon.js";
import BLOB from "./blob.js";
import BMX from "./bmx.js";
import Explosion from "./explosion.js";
import HELI from "./helicopter.js";
import MTB from "./mtb.js";
import TRUCK from "./truck.js";

let g = 0
  , v = {
	BMX,
	MTB,
	HELI,
	TRUCK,
	BALLOON,
	BLOB
}

function m(t, e) {
	for (var i in e)
		try {
			t[i] = e[i].constructor == Object ? m(t[i], e[i]) : e[i]
		} catch (s) {
			t[i] = e[i]
		}
	return t
}

export default class {
	_ghost = !1;
	color = '#000000';
	id = g++;
	constructor(t, e) {
		Object.defineProperties(this, {
			_scene: { value: t, writable: true },
			_game: { value: t.game, writable: true }
		});
		this._user = e,
		this._settings = t.settings;
		let i = t.settings.startVehicle;
		t.settings.track && (i = t.settings.track.vehicle),
		this._baseVehicleType = i,
		this._gamepad = new Gamepad(t),
		e.color && (this._color = e.color),
		this.setDefaults(),
		this.createBaseVehicle(new Cartesian(0, 35), 1, new Cartesian(0, 0))
	}
	getCheckpointCount() {
		return this._checkpoints.length
	}
	setDefaults() {
		this._baseVehicle = !1;
		this._tempVehicleType = null;
		this._tempVehicle = !1;
		this._tempVehicleTicks = 0;
		this._temp_vehicle_options = null;
		this._addCheckpoint = !1;
		this._checkpoints = [];
		this._cache = [];
		this._crashed = !1;
		this._effect = !1;
		this._effectTicks = 0;
		this._opacity = 1;
		this.complete = !1;
		this._powerupsConsumed = {
			checkpoints: [],
			targets: [],
			misc: []
		}
	}
	hasCheckpoints() {
		return this._checkpoints.length > 0
	}
	setColor(t) {
		this._color = t
	}
	dead() {
		if (this._crashed = !0,
			this._ghost === !1) {
			let t = this._scene
			  , i = t.message;
			t.state.playerAlive = this.isAlive(),
			i.show(this._checkpoints.length > 0 ? "Press Enter For Checkpoint" : "Press Enter To Restart!", !1)
		}
	}
	setAsGhost() {
		this._ghost = !0
		this._replayIterator = this.createReplayIterator()
	}
	isGhost() {
		return this._ghost
	}
	isAlive() {
		return !this._crashed
	}
	getTargetsHit() {
		return this._scene.track.targets.filter(t => this._powerupsConsumed.targets.includes(t.id)).reduce((sum, t) => sum += t.multiplier, 0)
		// return this._powerupsConsumed.targets.length
	}
	getGamepad() {
		return this._gamepad
	}
	setBaseVehicle(t) {
		this._baseVehicleType !== t && (this._baseVehicleType = t,
		this.reset())
	}
	createBaseVehicle(t, e, i) {
		this._tempVehicle && this._tempVehicle.stopSounds(),
		this._baseVehicle = new v[this._baseVehicleType](this, t, e, i);
		this._game.emit('baseVehicleCreate', this._baseVehicle),
		this._tempVehicle = !1,
		this._tempVehicleType = !1,
		this._tempVehicleTicks = 0
	}
	setTempVehicle(t, e, i, s) {
		this._temp_vehicle_options && this._temp_vehicle_options.type === t && (e = this._temp_vehicle_options.ticks + e),
		this._temp_vehicle_options = {
			type: t,
			ticks: e,
			position: i,
			direction: s
		}
	}
	createTempVehicle(t, e, i, s) {
		if (this._temp_vehicle_options) {
			let n = this._temp_vehicle_options;
			t = n.type,
			e = n.ticks,
			i = n.position,
			s = n.direction,
			this._temp_vehicle_options = null
		}
		this._tempVehicleType === t ? this._tempVehicleTicks += e : (this.getActiveVehicle().stopSounds(),
		this._effect = new Explosion(i, this._scene),
		this._effectTicks = 45,
		this._tempVehicleType = t,
		this._tempVehicle = new v[t](this, i, s),
		this._game.emit('tempVehicleCreate', this._tempVehicle),
		this._tempVehicleTicks = e)
	}
	fixedUpdate() {
		// When game is at 60 UPS, player.fixedUpdate should still only occur at 30 UPS
		// Only the second/last (n + 1) fixedUpdate should be recognized at 60 UPS
		// First of the pair of updates should be ignored
		// const skip = !Number.isInteger(this._gamepad.playbackTicks ?? (this._scene.ticks / (this._game.config.tickRate / 30)));
		let t = this._baseVehicle;
		/* !skip && */ this._temp_vehicle_options && this.createTempVehicle(),
		this._tempVehicleTicks > 0 && (t = this._tempVehicle,
		this._crashed === !1 && this._tempVehicleTicks--,
		this._tempVehicleTicks <= 0 && this._crashed === !1 && (this._effectTicks = 45,
		this._effect = new Explosion(this._tempVehicle.focalPoint.displayPos, this._scene),
		this.createBaseVehicle(this._tempVehicle.focalPoint.pos, this._tempVehicle.dir, this._tempVehicle.masses[0].vel),
		t = this._baseVehicle)),
		this._effectTicks > 0 && (this._effectTicks--,
		this._effect.fixedUpdate()),
		window.hasOwnProperty('lite') && lite.storage.get('playerTrail') && this.isGhost() || this.isAlive() && lite.snapshots.push(this._createSnapshot()),
		t.fixedUpdate();
		/* !skip && */ this._addCheckpoint && (this._createCheckpoint(),
		this._addCheckpoint = !1)
	}
	update() {
		const e = this.getActiveVehicle();
		e.update(...arguments)
	}
	lateUpdate() {
		const e = this.getActiveVehicle();
		e.lateUpdate(...arguments)
	}
	*createReplayIterator(nextTick = 0) {
		const snapshots = new Map();
		this._gamepad.playbackTicks = 0;
		while (this.complete === !1) {
			snapshots.has(this._gamepad.playbackTicks) || this.isAlive() && snapshots.set(this._gamepad.playbackTicks, {
				downButtons: Object.assign({}, this._gamepad.downButtons),
				snapshot: this._createSnapshot()
			});
			if (this._gamepad.playbackTicks >= nextTick) {
				const value = yield this._gamepad.playbackTicks;
				if (isFinite(value)) {
					if (snapshots.has(value)) {
						let { downButtons, snapshot } = snapshots.get(value);
						this._checkpoints.push(snapshot);
						this.gotoCheckpoint();
						this._checkpoints.pop();
						this._gamepad.playbackTicks = value;
						this._gamepad.downButtons = Object.assign({}, downButtons);
					} else if (value < nextTick) {
						this.reset();
					}

					this._scene.camera.focusIndex = this._scene.playerManager._players.indexOf(this);
					this._scene.camera.focusOnPlayer();
					nextTick = value;
					continue;
				} else {
					nextTick = this._gamepad.playbackTicks + 1 / (this._game.config.tickRate / 30) // this._gamepad.playbackTicks + 1;
				}
			}

			this._gamepad.update(),
			this.checkKeys(),
			this.fixedUpdate(),
			!this.complete && (this._gamepad.playbackTicks += 1 / (this._game.config.tickRate / 30)), /* this._gamepad.playbackTicks++; */
			this.isInFocus() && this._game.emit('replayTick', this._gamepad.playbackTicks)
		}

		// this.loop = true;
		this.loop && (this.reset(),
		this._replayIterator = this.createReplayIterator())
		return snapshots
	}
	isInFocus() {
		return this._scene.camera.playerFocus && this._scene.camera.playerFocus === this
	}
	updateOpacity() {
		let t = 1;
		if (this._scene.camera.playerFocus && this._scene.camera.playerFocus !== this) {
			var i = this.getDistanceBetweenPlayers(this._scene.camera.playerFocus);
			1200 > i && (t = Math.min(i / 500, 1))
		}
		this._opacity = t
	}
	drawName(ctx) {
		let l = this.getActiveVehicle()
		  , c = l.focalPoint.displayPos.toScreen(this._scene);
		ctx.globalAlpha = this._opacity;
		ctx.textAlign = "center";
		if (this._user.badges && this._user.badges.size > 0) {
			ctx.font = (10 * this._scene.game.pixelRatio * this._scene.camera.zoom) + "pt helsinki",
			ctx.strokeText(Array.from(this._user.badges)[0], c.x, c.y - 40 * this._scene.camera.zoom);
		} else {
			ctx.beginPath(),
			ctx.fillStyle = this._color,
			ctx.moveTo(c.x, c.y - 40 * this._scene.camera.zoom),
			ctx.lineTo(c.x - 5 * this._scene.camera.zoom, c.y - 50 * this._scene.camera.zoom),
			ctx.lineTo(c.x + 5 * this._scene.camera.zoom, c.y - 50 * this._scene.camera.zoom),
			ctx.lineTo(c.x, c.y - 40 * this._scene.camera.zoom),
			ctx.fill();
		}
		ctx.font = (9 * this._scene.game.pixelRatio * Math.max(this._scene.camera.zoom, 1)) + "pt helsinki";
		let y = c.y - 60 * this._scene.camera.zoom;
		if (this._user.gradient && this._user.gradient.length > 0) {
			let measurement = ctx.measureText(this._user.d_name);
			let gradient = ctx.createLinearGradient(measurement.width / 2, y - (measurement.fontBoundingBoxAscent + measurement.fontBoundingBoxDescent) / 2, measurement.width / 2, y + (measurement.fontBoundingBoxAscent + measurement.fontBoundingBoxDescent) / 2);
			for (let i in this._user.gradient)
				gradient.addColorStop(i, this._user.gradient[i]);
			gradient.addColorStop(this._user.gradient.length, this._color),
			ctx.fillStyle = gradient;
			ctx.save(),
			ctx.lineWidth = .8 * this._scene.game.pixelRatio * Math.max(this._scene.camera.zoom, 1),
			ctx.strokeStyle = this._color,
			ctx.strokeText(this._user.d_name, c.x, y),
			ctx.restore();
		} else
			ctx.fillStyle = this._color;
		ctx.fillText(this._user.d_name, c.x, y),
		ctx.globalAlpha = 1
	}
	draw(ctx) {
		this.updateOpacity();
		let t = this._baseVehicle;
		this._tempVehicleTicks > 0 && (t = this._tempVehicle),
		this._effectTicks > 0 && this._effect.draw(ctx, this._effectTicks / 100),
		t.draw(ctx),
		window.hasOwnProperty('lite') && lite.storage.get('confirmRestart') && this._gamepad.isButtonDown('restart') && this.drawRestart(ctx),
		this.isGhost() && this.drawName(ctx)
	}
	drawRestart(ctx) {
		let l = this.getActiveVehicle()
		  , c = l.focalPoint.displayPos.toScreen(this._scene)
		  , delta = this._scene.ticks - this._restartTimeout
		  , fontSize = 16 * this._scene.camera.zoom;
		ctx.save(),
		ctx.fillStyle = this._settings.UITextColor || this._settings.physicsLineColor,
		ctx.font = fontSize + 'px Helsinki',
		ctx.globalAlpha !== 1 && (ctx.globalAlpha = 1),
		ctx.lineWidth = fontSize / 2.5,
		ctx.strokeStyle = this._settings.UITextColor || this._settings.physicsLineColor,
		ctx.textAlign = 'center',
		ctx.textBaseline = 'bottom',
		ctx.fillText('R', c.x, c.y - 50 * this._scene.camera.zoom),
		ctx.beginPath(),
		ctx.arc(c.x, c.y - fontSize / 1.6 - 50 * this._scene.camera.zoom, 1.25 * fontSize, 0, 2 * Math.PI * ((12 - delta) / 12), !0),
		ctx.globalAlpha = Math.min(1, Math.max(0.1, delta / 12)),
		ctx.stroke(),
		ctx.restore()
	}
	checkKeys() {
		let t = this._gamepad
		  , e = this._ghost
		  , i = this._scene
		  , s;
		!t.isButtonDown("enter") && !t.isButtonDown("backspace") && t.areKeysDown() && this._cache.length > 0 && (this._cache = []);
		if (t.isButtonDown("shift") && t.isButtonDown("enter")) {
			s = t.getButtonDownOccurances("enter");
			this.returnToCheckpoint(s),
			t.setButtonUp("enter")
		}
		if (e === !1 && (t.areKeysDown() && !this._crashed && i.play(),
		t.isButtonDown("restart") ? (!window.hasOwnProperty('lite') || !lite.storage.get('confirmRestart') || !(this._restartTimeout ?? (i.ticks > 0 && Object.defineProperty(this, '_restartTimeout', { value: i.ticks, writable: true })))) && (i.restartTrack = !0,
		t.setButtonUp("restart")) : this._restartTimeout = null,
		(t.isButtonDown("up") || t.isButtonDown("down") || (!i.camera.focusIndex || ((s = i.camera.playerFocus) && s._gamepad.playbackTicks < 1)) && (t.isButtonDown("left") || t.isButtonDown("right"))) && i.camera.focusOnMainPlayer()),
		t.isButtonDown("enter") && (this.gotoCheckpoint(),
		t.setButtonUp("enter")),
		t.isButtonDown("backspace")) {
			s = t.getButtonDownOccurances("backspace");
			this.removeCheckpoint(s),
			t.setButtonUp("backspace")
		}
	}
	getDistanceBetweenPlayers(t) {
		const e = t.getActiveVehicle()
			, i = this.getActiveVehicle();
		return e.focalPoint.displayPos.sub(i.focalPoint.displayPos).len()
	}
	getActiveVehicle() {
		return this._tempVehicleTicks > 0 ? this._tempVehicle : this._baseVehicle
	}
	_createCheckpoint() {
		this._checkpoints.push(this._createSnapshot())
	}
	_createSnapshot() {
		let t = {};
		this._tempVehicleTicks > 0 ? (t._tempVehicleType = this._tempVehicleType,
		t._tempVehicle = JSON.stringify(this._tempVehicle, this._snapshotFilter),
		t._tempVehicleTicks = this._tempVehicleTicks) : (t._baseVehicleType = this._baseVehicleType,
		t._baseVehicle = JSON.stringify(this._baseVehicle, this._snapshotFilter)),
		t._powerupsConsumed = JSON.stringify(this._powerupsConsumed),
		t._crashed = this._crashed;
		return t
	}
	_snapshotFilter(t, e) {
		switch (t) {
		case "parent":
		case "player":
		case "scene":
		case "settings":
		case "masses":
		case "springs":
		case "focalPoint":
		case "gamepad":
			return void 0;
		case "explosion":
			return !1;
		default:
			return e
		}
	}
	setCheckpointOnUpdate() {
		this._addCheckpoint = !0
	}
	crashed() {
		this._crashed = !0
	}
	gotoCheckpoint() {
		let t = this._gamepad
		  , e = t.replaying
		  , i = this._scene;
		if (this._checkpoints.length > 0) {
			let s = this._checkpoints[this._checkpoints.length - 1];
			if (s._tempVehicle) {
				this._baseVehicle.stopSounds();
				let n = this._tempVehicle;
				this._tempVehicleType !== s._tempVehicleType && (n = new v[s._tempVehicleType](this, {
					x: 0,
					y: 0
				}));
				let r = JSON.parse(s._tempVehicle);
				m(n, r),
				this._tempVehicle = n,
				this._tempVehicleType = s._tempVehicleType,
				this._tempVehicleTicks = s._tempVehicleTicks,
				n.updateCameraFocalPoint()
			} else {
				let n = this._baseVehicle
				  , r = JSON.parse(s._baseVehicle);
				m(n, r);
				// for (const m of n.masses)
				// 	m.lastFixedPos.equ(m.pos);
				this._tempVehicle && this._tempVehicle.stopSounds(),
				this._tempVehicleTicks = 0,
				this._tempVehicleType = !1,
				n.updateCameraFocalPoint()
			}
			if (this._powerupsConsumed = JSON.parse(s._powerupsConsumed),
				this._crashed = s._crashed,
				e === !1) {
				let o = i.settings;
				i.state.playerAlive = this.isAlive(),
				i.message.show("Press Backspace To Go Back Further", 5, "#826cdc", "#FFFFFF"),
				i.track.updatePowerupState(this),
				o.waitAtCheckpoints && (i.state.playing = !1),
				i.camera.focusOnMainPlayer()
			}
			i.camera.playerFocus === this && i.camera.fastforward()
		} else
			e === !1 && this.restartScene()
	}
	restartScene() {
		let t = this._gamepad
		  , e = t.replaying;
		e === !1 && (this._scene.restartTrack = !0)
	}
	removeCheckpoint(t) {
		if (this._checkpoints.length > 1) {
			for (let e = 0; t > e; e++)
				this._cache.push(this._checkpoints.pop());
			this.gotoCheckpoint()
		} else
			this.restartScene()
	}
	returnToCheckpoint(t) {
		if (this._cache.length > 0) {
			for (var e = 0; t > e; e++)
				this._checkpoints.push(this._cache.pop());
			this.gotoCheckpoint()
		}
	}
	close() {
		this.id = null,
		this._scene = null,
		this._game = null,
		this._user = null,
		this._settings = null,
		this._baseVehicleType = null,
		this._gamepad.close(),
		this._gamepad = null,
		this._baseVehicle = null,
		this._tempVehicleType = null,
		this._tempVehicle = null,
		this._tempVehicleTicks = null,
		this._addCheckpoint = null,
		this._checkpoints = null,
		this._cache = null,
		this._crashed = null,
		this._effect = null,
		this._effectTicks = null,
		this._powerupsConsumed = null
	}
	reset() {
		this._restartTimeout = null,
		this._tempVehicle && this._tempVehicle.stopSounds(),
		this._baseVehicle.stopSounds(),
		this.setDefaults(),
		this.createBaseVehicle(new Cartesian(0, 35), 1, new Cartesian(0, 0)),
		this._gamepad.reset(),
		this._scene.state.playerAlive = this.isAlive(),
		this._game.emit('playerReset', this)
	}
}