import Cartesian from "../math/cartesian.js";
import Explosion from "./explosion.js";

export default class {
	static Sounds = {};
	alive = true;
	color = '#000000';
	complete = false;
	cosmetics = null;
	crashed = false;
	dir = 1;
	explosion = false;
	gravity = new Cartesian(0, .3);
	masses = [];
	powerupsEnabled = true;
	speed = 0;
	springs = [];
	slow = false;
	constructor(t) {
		Object.defineProperty(this, 'player', { value: t, writable: true }),
		Object.defineProperty(this, 'scene', { value: t._scene, writable: true }),
		this.gamepad = t._gamepad,
		this.settings = t._settings,
		this.createCosmetics()
	}
	createCosmetics() {
		this.cosmetics = this.player._user.cosmetics
	}
	dead() {
		this.stopSounds(),
		this.player.dead(),
		this.crashed = !0,
		this.alive = !1
	}
	explode() {
		this.scene.sound.play('bomb_sound', 1),
		this.explosion = new Explosion(this.masses[0].displayPos,this.scene),
		this.dead()
	}
	fixedUpdate() {
		this.crashed === !1 && (this.updateSound(),
		this.control?.());
		return this.explosion && (this.explosion.fixedUpdate(), !0)
	}
	update() {
		for (let e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
			e[s].update(...arguments)
	}
	lateUpdate() {
		for (let e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
			e[s].lateUpdate(...arguments)
	}
	draw(t) {
		if (this.scene.game.emit(this.scene.game.constructor.Events.PlayerVehicleDraw, this)) return !0;
		return this.explosion && (this.explosion.draw(t, 1), !0)
	}
	moveVehicle(t, e) {
		for (var i = this.masses, s = i.length, n = s - 1; n >= 0; n--)
			i[n].move(t, e)
	}
	stopSounds() {
		for (const key in this.constructor.Sounds) {
			const sound = this.constructor.Sounds[key];
			if (typeof sound != 'string') continue;
			this.scene.sound.stop(sound)
		}
	}
	close() {
		this.scene = null,
		this.settings = null,
		this.gravity = null,
		this.speed = null,
		this.cosmetics = null,
		this.explosion = null,
		this.crashed = null,
		this.alive = null,
		this.gamepad = null
	}
}