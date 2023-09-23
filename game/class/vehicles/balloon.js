import Cartesian from "../math/cartesian.js";
import a from "./canopy.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";

let h = {
	BALLOON_ON: "balloon_on"
}

export default class extends Vehicle {
	vehicleName = "BALLOON";
	head = null;
	basket = null;
	constructor(t, e) {
		super(t);
		this.createMasses(e);
		this.createSprings();
		this.stopSounds();
		this.focalPoint = this.head;
	}
	createMasses(t) {
		this.masses = [];
		var e = new a(t.x, t.y - 10, this);
		e.radius = 30;
		var i = new n(new Cartesian(t.x,t.y + 35), this);
		i.friction = .1,
		this.masses.push(e),
		this.masses.push(i),
		this.head = this.masses[0],
		this.basket = this.masses[1];
		var r = this;
		this.masses[0].drive = this.head.drive = function() {
			r.explode()
		}
	}
	updateCameraFocalPoint() {}
	createSprings() {
		this.springs = [];
		var t = new r(this.head,this.basket,this);
		t.springConstant = .2,
		t.dampConstant = .2,
		t.lrest = t.leff = 45,
		this.springs.push(t)
	}
	fixedUpdate() {
		if (this.crashed === !1 && this.updateSound(),
		this.explosion)
			this.explosion.fixedUpdate();
		else {
			this.head.wind = !this.basket.contact,
			this.slow = !1;
			for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
				t[i].fixedUpdate();
			for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
				s[r].fixedUpdate();
			for (var i = e - 1; i >= 0; i--)
				t[i].fixedUpdate();
			for (var r = n - 1; r >= 0; r--)
				s[r].fixedUpdate()
		}
	}
	update(progress) {
		for (var t = this.masses, e = t.length, m = e - 1; m >= 0; m--)
			t[m].update(progress);
	}
	updateSound() {
		if (this.player.isInFocus()) {
			var t = this.scene.sound
				, e = this.gamepad;
			e.isButtonDown("up") ? t.play(h.BALLOON_ON, .6) : e.isButtonDown("up") || t.stop(h.BALLOON_ON)
		}
	}
	stopSounds() {
		var t = this.scene.sound;
		t.stop(h.BALLOON_ON)
	}
	draw(t) {
		if (this.explosion)
			this.explosion.draw(t, 1);
		else {
			if (this.scene.ticks > 0 && !this.player.isGhost()) {
				if (!this.scene.state.playing) {
					let t = window.lite.storage.get("snapshots");
					if (t > 0) {
						for (let i in this.player._checkpoints) {
							if (i <= this.player._checkpoints.length - (parseInt(t) + 1) || !this.player._checkpoints[i] || !this.player._checkpoints[i]._tempVehicle) continue;
							t.globalAlpha = t / 3e2 * parseInt(i) % 1,
							this.drawBalloon.call(Object.assign({}, this, JSON.parse(this.player._checkpoints[i]._tempVehicle)), t),
							t.globalAlpha = 1
						}

						for (let i in this.player._cache) {
							if (i <= this.player._cache.length - (parseInt(t) + 1) || !this.player._cache[i] || !this.player._cache[i]._tempVehicle) continue;
							t.globalAlpha = t / 3e2 * parseInt(i) % 1,
							this.drawBalloon.call(Object.assign({}, this, JSON.parse(this.player._cache[i]._tempVehicle)), t),
							t.globalAlpha = 1
						}
					}
				}

				if (window.lite.storage.get("playerTrail")) {
					for (let i in window.lite.snapshots) {
						if (!window.lite.snapshots[i] || !window.lite.snapshots[i]._tempVehicle) continue;
						t.globalAlpha = window.lite.snapshots.length / (window.lite.snapshots.length * 200) * parseInt(i) % 1,
						this.drawBalloon.call(Object.assign({}, this, JSON.parse(window.lite.snapshots[i]._tempVehicle)), t),
						t.globalAlpha = 1
					}
				}
			}

			if (this.settings.developerMode)
				for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
					e[s].draw();
			t.globalAlpha = this.player._opacity,
			this.drawBalloon(t),
			t.globalAlpha = 1
		}
	}
	drawBalloon(t) {
		var e = this.scene
			, i = new Cartesian(this.basket.pos.x, this.basket.pos.y).toScreen(e)
			, m = new Cartesian(this.head.pos.x, this.head.pos.y).toScreen(e)
			, n = e.camera.zoom
			, r = m.x - i.x
			, o = m.y - i.y
			, l = -o
			, h = r;
		t.save(),
		t.strokeStyle = window.lite.storage.get("theme") === "dark" ? "#666" : "#999",
		t.lineWidth = 1,
		t.beginPath(),
		t.moveTo(i.x + .1 * l, i.y + .1 * h),
		t.lineTo(i.x + .5 * r + .4 * l, i.y + .5 * o + .4 * h),
		t.moveTo(i.x - .1 * l, i.y - .1 * h),
		t.lineTo(i.x + .5 * r - .4 * l, i.y + .5 * o - .4 * h),
		t.moveTo(i.x + .1 * l, i.y + .1 * h),
		t.lineTo(i.x + .36 * r + .2 * l, i.y + .36 * o + .2 * h),
		t.moveTo(i.x - .1 * l, i.y - .1 * h),
		t.lineTo(i.x + .36 * r - .2 * l, i.y + .36 * o - .2 * h),
		t.closePath(),
		t.stroke();
		const head = new a(this.head.pos.x, this.head.pos.y, this);
		head.radius = 30,
		head.draw(t),
		this.gamepad.isButtonDown("up") && (t.beginPath(),
		t.strokeStyle = "#FFFF00",
		t.lineWidth = 8 * n,
		t.moveTo(i.x, i.y),
		t.lineTo(i.x + .1 * r, i.y + .1 * o),
		t.closePath(),
		t.stroke(),
		t.beginPath(),
		t.strokeStyle = "#FFAA00",
		t.lineWidth = 3 * n,
		t.moveTo(i.x, i.y),
		t.lineTo(i.x + .1 * r, i.y + .1 * o),
		t.closePath(),
		t.stroke()),
		t.beginPath(),
		t.fillStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000",
		t.moveTo(i.x + .1 * l, i.y + .1 * h),
		t.lineTo(i.x - .1 * l, i.y - .1 * h),
		t.lineTo(i.x - .22 * r - .1 * l, i.y - .22 * o - .1 * h),
		t.lineTo(i.x - .22 * r + .1 * l, i.y - .22 * o + .1 * h),
		t.lineTo(i.x + .1 * l, i.y + .1 * h),
		t.closePath(),
		t.fill(),
		t.restore()
	}
}