import Cartesian from "../math/cartesian.js";
import a from "./canopy.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";

export default class extends Vehicle {
	static Sounds = { BalloonOn: 'balloon_on' };
	basket = null;
	head = null;
	outline = "#999";
	vehicleName = "BALLOON";
	constructor(t, e) {
		super(t),
		this.createMasses(e),
		this.createSprings(),
		this.stopSounds(),
		this.focalPoint = this.head
	}
	createMasses(t) {
		let e = new a(t.x, t.y - 10, this);
		e.radius = 30;
		let i = new n(new Cartesian(t.x,t.y + 35), this);
		i.friction = .1,
		this.masses.push(e),
		this.masses.push(i),
		this.head = this.masses[0],
		this.basket = this.masses[1];
		this.head.drive = this.explode.bind(this)
	}
	updateCameraFocalPoint() {}
	createSprings() {
		var t = new r(this.head,this.basket,this);
		t.springConstant = .2,
		t.dampConstant = .2,
		t.lrest = t.leff = 45,
		this.springs.push(t)
	}
	fixedUpdate() {
		if (super.fixedUpdate()) return;
		this.head.wind = !this.basket.contact,
		this.slow = !1;
		for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
			t[i].fixedUpdate();
		for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
			s[r].fixedUpdate();
		// for (var i = e - 1; i >= 0; i--)
		// 	t[i].fixedUpdate();
		// for (var r = n - 1; r >= 0; r--)
		// 	s[r].fixedUpdate()
	}
	updateSound() {
		if (this.player.isInFocus()) {
			var t = this.scene.sound
				, e = this.gamepad;
			e.isButtonDown("up") ? t.play(this.constructor.Sounds.BalloonOn, .6) : e.isButtonDown("up") || t.stop(this.constructor.Sounds.BalloonOn)
		}
	}
	draw(t) {
		if (super.draw(...arguments)) return;
		if (this.scene.ticks > 0 && !this.player.isGhost()) {
			if (!this.scene.state.playing) {
				let e = window.lite && parseInt(lite.storage.get("snapshots"));
				if (e > 0) {
					for (let i of this.player._checkpoints.filter((i, s, n) => s > n.length - (e + 1) && i._tempVehicle)) {
						t.globalAlpha = e / 3e2 * this.player._checkpoints.indexOf(i) % 1,
						this.drawBalloon.call(Object.assign({}, this, { player: this.player, scene: this.scene }, JSON.parse(i._tempVehicle)), t)
					}

					for (let i of this.player._cache.filter((i, s, n) => s > n.length - (e + 1) && i._tempVehicle)) {
						t.globalAlpha = t / 3e2 * this.player._cache.indexOf(i) % 1,
						this.drawBalloon.call(Object.assign({}, this, { player: this.player, scene: this.scene }, JSON.parse(i._tempVehicle)), t)
					}
				}
			}

			if (window.lite && lite.storage.get("playerTrail"))
				for (let e of lite.snapshots.filter(t => t._tempVehicle)) {
					t.globalAlpha = lite.snapshots.length / (lite.snapshots.length * 200) * lite.snapshots.indexOf(e) % 1,
					this.drawBalloon.call(Object.assign({}, this, { player: this.player, scene: this.scene }, JSON.parse(e._tempVehicle)), t)
				}
		}

		if (this.settings.developerMode)
			for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
				e[s].draw();
		t.globalAlpha = this.player._opacity,
		this.drawBalloon(t),
		t.globalAlpha = 1
	}
	drawBalloon(t) {
		var e = this.scene
			, i = new Cartesian(this.basket.displayPos.x, this.basket.displayPos.y).toScreen(e)
			, m = new Cartesian(this.head.displayPos.x, this.head.displayPos.y).toScreen(e)
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
		let head = new a(this.head.displayPos.x, this.head.displayPos.y, this);
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