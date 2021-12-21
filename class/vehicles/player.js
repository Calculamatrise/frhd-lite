import s from "../math/cartesian.js";
import n from "../utils/gamepad.js";
import c from "./balloon.js";
import u from "./blob.js";
import o from "./bmx.js";
import r from "./explosion.js";
import a from "./helicopter.js";
import l from "./mtb.js";
import h from "./truck.js";

let g = 0;
let v = {
    BMX: o,
    MTB: l,
    HELI: a,
    TRUCK: h,
    BALLOON: c,
    BLOB: u
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
    constructor(t, e) {
        this.id = g++;
        this._scene = t;
        this._game = t.game;
        this._user = e;
        this._settings = t.settings;
        let i = t.settings.startVehicle;
        t.settings.track && (i = t.settings.track.vehicle);
        this._baseVehicleType = i;
        this._gamepad = new n(t);
        this._ghost = !1;
        this._color = e.color ? e.color : "#000000";
        this.setDefaults();
        this.createBaseVehicle(new s(0,35), 1, new s(0,0));
    }
    getCheckpointCount() {
        return this._checkpoints.length
    }
    setDefaults() {
        this._baseVehicle = !1,
        this._tempVehicleType = null,
        this._tempVehicle = !1,
        this._tempVehicleTicks = 0,
        this._temp_vehicle_options = null,
        this._addCheckpoint = !1,
        this._checkpoints = [],
        this._cache = [],
        this._crashed = !1,
        this._effect = !1,
        this._effectTicks = 0,
        this._opacity = 1,
        this.complete = !1,
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
            var t = this._scene
              , e = t.settings
              , i = t.message;
            t.state.playerAlive = this.isAlive(),
            this._checkpoints.length > 0 ? e.mobile ? i.show("Tap to go to checkpoint!", !1, "#000000", "#FFFFFF") : i.show("Press Enter For Checkpoint", !1, "#000000", "#FFFFFF") : e.mobile ? i.show("Tap to Restart!", !1, "#000000", "#FFFFFF") : i.show("Press Enter To Restart", !1, "#000000", "#FFFFFF")
        }
    }
    setAsGhost() {
        this._ghost = !0
    }
    isGhost() {
        return this._ghost
    }
    isAlive() {
        return !this._crashed
    }
    getTargetsHit() {
        return this._powerupsConsumed.targets.length
    }
    getGamepad() {
        return this._gamepad
    }
    setBaseVehicle(t) {
        this._baseVehicleType = t,
        this.reset()
    }
    createBaseVehicle(t, e, i) {
        this._tempVehicle && this._tempVehicle.stopSounds(),
        this._baseVehicle = new v[this._baseVehicleType](this, t, e, i),
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
        this._effect = new r(i,this._scene),
        this._effectTicks = 45,
        this._tempVehicleType = t,
        this._tempVehicle = new v[t](this,i,s),
        this._tempVehicleTicks = e)
    }
    update() {
        if (this.complete === !1) {
            let t = this._baseVehicle, e = {};
            this._temp_vehicle_options && this.createTempVehicle(),
            this._tempVehicleTicks > 0 && (t = this._tempVehicle,
            this._crashed === !1 && this._tempVehicleTicks--,
            this._tempVehicleTicks <= 0 && this._crashed === !1 && (this._effectTicks = 45,
            this._effect = new r(this._tempVehicle.focalPoint.pos,this._scene),
            this.createBaseVehicle(this._tempVehicle.focalPoint.pos, this._tempVehicle.dir, this._tempVehicle.masses[0].vel),
            t = this._baseVehicle)),
            this._effectTicks > 0 && (this._effectTicks--,
            this._effect.update()),
            this.isGhost() || window.hasOwnProperty("lite") && window.lite.storage.get("trail") && (e = {},
            this._tempVehicleTicks > 0 ? (e._tempVehicleType = this._tempVehicleType,
            e._tempVehicle = JSON.stringify(this._tempVehicle, this._snapshotFilter),
            e._tempVehicleTicks = this._tempVehicleTicks) : (e._baseVehicleType = this._baseVehicleType,
            e._baseVehicle = JSON.stringify(this._baseVehicle, this._snapshotFilter)),
            e._stickMan = this._baseVehicle && this._baseVehicle.getStickMan(),
            e._powerupsConsumed = JSON.stringify(this._powerupsConsumed),
            e._crashed = this._crashed,
            window.lite.snapshots.push(e)),
            t.update(),
            this._addCheckpoint && (this._createCheckpoint(),
            this._addCheckpoint = !1)
        }
    }
    isInFocus() {
        let e = !1;
        return this._scene.camera.playerFocus && this._scene.camera.playerFocus === this && (e = !0),
        e
    }
    updateOpacity() {
        let t = 1;
        if (this._scene.camera.playerFocus && this._scene.camera.playerFocus !== this) {
            var i = this.getDistanceBetweenPlayers(this._scene.camera.playerFocus);
            1200 > i && (t = Math.min(i / 500, 1))
        }
        this._opacity = t
    }
    drawName() {
        const ctx = this._scene.game.canvas.getContext("2d")
          , l = this.getActiveVehicle()
          , c = l.focalPoint.pos.toScreen(this._scene);
        ctx.globalAlpha = this._opacity,
        ctx.beginPath(),
        ctx.fillStyle = this._color,
        ctx.moveTo(c.x, c.y - 40 * this._scene.camera.zoom),
        ctx.lineTo(c.x - 5 * this._scene.camera.zoom, c.y - 50 * this._scene.camera.zoom),
        ctx.lineTo(c.x + 5 * this._scene.camera.zoom, c.y - 50 * this._scene.camera.zoom),
        ctx.lineTo(c.x, c.y - 40 * this._scene.camera.zoom),
        ctx.fill();
        ctx.font = (9 * this._scene.game.pixelRatio * Math.max(this._scene.camera.zoom, 1)) + "pt helsinki",
        ctx.textAlign = "center",
        ctx.fillStyle = this._color,
        ctx.fillText(this._user.d_name, c.x, c.y - 60 * this._scene.camera.zoom),
        ctx.globalAlpha = 1
    }
    draw() {
        this.updateOpacity();
        let t = this._baseVehicle;
        this._tempVehicleTicks > 0 && (t = this._tempVehicle),
        this._effectTicks > 0 && this._effect.draw(this._effectTicks / 100),
        this.isGhost() || this._scene.ticks > 0 && this._scene.state.playing == !1 && t.clone(),
        t.draw(),
        this.isGhost() && this.drawName()
    }
    checkKeys() {
        var t = this._gamepad
          , e = this._ghost
          , i = this._scene;
        if (!t.isButtonDown("enter") && !t.isButtonDown("backspace") && t.areKeysDown()) {
            if (this._cache.length > 0) {
                this._cache = [];
            }
        }
        if (t.isButtonDown("shift") && t.isButtonDown("enter")) {
            var s = t.getButtonDownOccurances("enter");
            this.returnToCheckpoint(s),
            t.setButtonUp("enter")
        }
        if (e === !1 && (t.areKeysDown() && !this._crashed && i.play(),
        t.isButtonDown("restart") && (i.restartTrack = !0,
        t.setButtonUp("restart")),
        (t.isButtonDown("up") || t.isButtonDown("down") || t.isButtonDown("left") || t.isButtonDown("right")) && i.camera.focusOnMainPlayer()),
        t.isButtonDown("enter") && (this.gotoCheckpoint(),
        t.setButtonUp("enter")),
        t.isButtonDown("backspace")) {
            var s = t.getButtonDownOccurances("backspace");
            this.removeCheckpoint(s),
            t.setButtonUp("backspace")
        }
    }
    getDistanceBetweenPlayers(t) {
        var e = t.getActiveVehicle()
          , i = this.getActiveVehicle()
          , s = e.focalPoint.pos.x - i.focalPoint.pos.x
          , n = e.focalPoint.pos.y - i.focalPoint.pos.y;
        return Math.sqrt(Math.pow(s, 2) + Math.pow(n, 2))
    }
    getActiveVehicle() {
        var t = this._baseVehicle;
        return this._tempVehicleTicks > 0 && (t = this._tempVehicle),
        t
    }
    _createCheckpoint() {
        let t = {};
        this._tempVehicleTicks > 0 ? (t._tempVehicleType = this._tempVehicleType,
        t._tempVehicle = JSON.stringify(this._tempVehicle, this._snapshotFilter),
        t._tempVehicleTicks = this._tempVehicleTicks) : (t._baseVehicleType = this._baseVehicleType,
        t._baseVehicle = JSON.stringify(this._baseVehicle, this._snapshotFilter)),
        t._powerupsConsumed = JSON.stringify(this._powerupsConsumed),
        t._crashed = this._crashed,
        this._checkpoints.push(t)
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
        var t = this._gamepad
          , e = t.replaying
          , i = this._scene;
        if (this._checkpoints.length > 0) {
            var s = this._checkpoints[this._checkpoints.length - 1];
            if (s._tempVehicle) {
                this._baseVehicle.stopSounds();
                var n = this._tempVehicle;
                this._tempVehicleType !== s._tempVehicleType && (n = new v[s._tempVehicleType](this,{
                    x: 0,
                    y: 0
                }));
                var r = JSON.parse(s._tempVehicle);
                m(n, r),
                this._tempVehicle = n,
                this._tempVehicleType = s._tempVehicleType,
                this._tempVehicleTicks = s._tempVehicleTicks,
                n.updateCameraFocalPoint()
            } else {
                var n = this._baseVehicle
                  , r = JSON.parse(s._baseVehicle);
                m(n, r),
                this._tempVehicle && this._tempVehicle.stopSounds(),
                this._baseVehicle = n,
                this._tempVehicleTicks = 0,
                this._tempVehicleType = !1,
                n.updateCameraFocalPoint()
            }
            if (this._powerupsConsumed = JSON.parse(s._powerupsConsumed),
            this._crashed = s._crashed,
            e === !1) {
                var o = i.settings;
                i.state.playerAlive = this.isAlive(),
                i.settings.mobile ? i.message.show("Tap to resume", 5, "#826cdc", "#FFFFFF") : i.message.show("Press Backspace To Go Back Further", 5, "#826cdc", "#FFFFFF"),
                i.track.updatePowerupState(this),
                o.waitAtCheckpoints && (i.state.playing = !1),
                i.camera.focusOnMainPlayer()
            }
            i.camera.playerFocus === this && i.camera.fastforward()
        } else
            e === !1 && this.restartScene()
    }
    restartScene() {
        var t = this._gamepad
          , e = t.replaying;
        e === !1 && (this._scene.restartTrack = !0)
    }
    removeCheckpoint(t) {
        if (this._checkpoints.length > 1) {
            for (var e = 0; t > e; e++)
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
        this._tempVehicle && this._tempVehicle.stopSounds(),
        this._baseVehicle.stopSounds(),
        this.setDefaults(),
        this.createBaseVehicle(new s(0,35), 1, new s(0,0)),
        this._gamepad.reset(),
        this._scene.state.playerAlive = this.isAlive()
    }
}