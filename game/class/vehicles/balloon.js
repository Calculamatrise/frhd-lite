import Cartesian from "../math/cartesian.js";
import a from "./canopy.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";

let h = {
	BALLOON_ON: "balloon_on"
}

export default class extends Vehicle {
	basket = null;
	head = null;
	outline = "#999";
	vehicleName = "BALLOON";
	constructor(t, e) {
		super(t);
		this.createMasses(e);
		this.createSprings();
		this.stopSounds();
		this.focalPoint = this.head;
	}
	createMasses(t) {
		this.masses = [];
		let e = new a(t.x, t.y - 10, this);
		e.radius = 30;
		let i = new n(new Cartesian(t.x,t.y + 35), this);
		i.friction = .1,
		this.masses.push(e),
		this.masses.push(i),
		this.head = this.masses[0],
		this.basket = this.masses[1];
		let r = this;
		this.head.drive = function() {
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
					let e = window.lite && parseInt(lite.storage.get("snapshots"));
					if (e > 0) {
						for (let i in this.player._checkpoints.filter((i, s, n) => s > n.length - (e + 1) && i._tempVehicle)) {
							t.globalAlpha = e / 3e2 * i % 1,
							this.drawBalloon.call(Object.assign({}, this, JSON.parse(this.player._checkpoints[i]._tempVehicle)), t)
						}

						for (let i in this.player._cache.filter((i, s, n) => s > n.length - (e + 1) && i._tempVehicle)) {
							t.globalAlpha = t / 3e2 * i % 1,
							this.drawBalloon.call(Object.assign({}, this, JSON.parse(this.player._cache[i]._tempVehicle)), t)
						}
					}
				}

				if (window.lite && lite.storage.get("playerTrail"))
					for (let e in lite.snapshots.filter(t => t._tempVehicle)) {
						t.globalAlpha = lite.snapshots.length / (lite.snapshots.length * 200) * e % 1,
						this.drawBalloon.call(Object.assign({}, this, JSON.parse(lite.snapshots[e]._tempVehicle)), t)
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
			, l = -o;
		t.save(),
		t.strokeStyle = window.lite.storage.get("theme") === "dark" ? "#666" : this.outline,
		t.lineWidth = 1,
		t.beginPath(),
		t.moveTo(i.x + .1 * l, i.y + .1 * r),
		t.lineTo(i.x + .5 * r + .39 * l, i.y + .5 * o + .39 * r),
		t.moveTo(i.x - .1 * l, i.y - .1 * r),
		t.lineTo(i.x + .5 * r - .39 * l, i.y + .5 * o - .39 * r),
		t.moveTo(i.x + .1 * l, i.y + .1 * r),
		t.lineTo(i.x + .4 * r + .21 * l, i.y + .4 * o + .21 * r),
		t.moveTo(i.x - .1 * l, i.y - .1 * r),
		t.lineTo(i.x + .4 * r - .21 * l, i.y + .4 * o - .21 * r),
		t.closePath(),
		t.stroke();
		let head = new a(this.head.pos.x, this.head.pos.y, this);
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
		t.fillStyle = this.color,
		t.moveTo(i.x + .1 * l, i.y + .1 * r),
		t.lineTo(i.x - .1 * l, i.y - .1 * r),
		t.lineTo(i.x - .22 * r - .1 * l, i.y - .22 * o - .1 * r),
		t.lineTo(i.x - .22 * r + .1 * l, i.y - .22 * o + .1 * r),
		t.lineTo(i.x + .1 * l, i.y + .1 * r),
		t.closePath(),
		t.fill(),
		t.restore()
	}
}