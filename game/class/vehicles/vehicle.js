import Cartesian from "../math/cartesian.js";
import Explosion from "./explosion.js";

export default class {
	color = '#'.padEnd(7, lite.storage.get('theme') == 'midnight' ? 'C' : lite.storage.get('theme') == 'dark' ? 'FB' : '0');
	masses = null;
	springs = null;
	slow = !1;
	constructor(t) {
		this.player = t,
		this.scene = t._scene,
		this.gamepad = t._gamepad,
		this.settings = t._settings,
		this.gravity = new Cartesian(0,.3),
		this.complete = !1,
		this.alive = !0,
		this.crashed = !1,
		this.dir = 1,
		this.ghost = !1,
		this.ragdoll = !1,
		this.explosion = !1,
		this.speed = 0,
		this.powerupsEnabled = !0,
		this.createCosmetics()
	}
	explode() {
		this.scene.sound.play("bomb_sound", 1),
		this.explosion = new Explosion(this.masses[0].pos,this.scene),
		this.dead()
	}
	createCosmetics() {
		this.cosmetics = this.player._user.cosmetics;
	}
	updateSpeed() {
		this.speed = Math.abs(Math.round(this.focalPoint.vel.x + this.focalPoint.vel.y))
	}
	close() {
		this.scene = null,
		this.settings = null,
		this.gravity = null,
		this.speed = null,
		this.cosmetics = null,
		this.explosion = null,
		this.ragdoll = null,
		this.ghost = null,
		this.crashed = null,
		this.alive = null,
		this.gamepad = null
	}
	dead() {
		this.stopSounds(),
		this.player.dead(),
		this.crashed = !0,
		this.alive = !1
	}
	moveVehicle(t, e) {
		for (var i = this.masses, s = i.length, n = s - 1; n >= 0; n--)
			i[n].pos.x += t,
			i[n].pos.y += e,
			i[n].old.x += t,
			i[n].old.y += e
	}
	stopSounds() {}
}