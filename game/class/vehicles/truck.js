import s from "../math/cartesian.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";
import h from "./wheel.js";

let d = {
	TRUCK_GROUND: "truck_idle"
}

export default class extends Vehicle {
	vehicleName = "TRUCK";
	pedala = 0;
	swapped = !1;
	constructor(t, e, i) {
		super(t);
		this.createMasses(e);
		this.createSprings();
		this.stopSounds();
		this.updateCameraFocalPoint();
		-1 === i && this.swap();
	}
	createMasses(t) {
		this.masses = [],
		this.masses.push(new n(new s(t.x - 15,t.y + 7), this)),
		this.masses.push(new n(new s(t.x + 15,t.y + 7), this)),
		this.masses[0].friction = .1,
		this.masses[1].friction = .1,
		this.masses.push(new h(new s(t.x - 20,t.y + 35),this)),
		this.masses.push(new h(new s(t.x + 20,t.y + 35),this)),
		this.masses[2].radius = this.masses[3].radius = 14,
		this.masses[0].radius = this.masses[1].radius = 7,
		this.head = this.masses[0],
		this.backMass = this.masses[1],
		this.rearWheel = this.masses[2],
		this.frontWheel = this.masses[3]
	}
	createSprings() {
		this.springs = [];
		var t = this.masses;
		this.springs.push(new r(t[0],t[1],this)),
		this.springs.push(new r(t[0],t[2],this)),
		this.springs.push(new r(t[1],t[3],this)),
		this.springs.push(new r(t[0],t[3],this)),
		this.springs.push(new r(t[1],t[2],this)),
		this.springs.push(new r(t[2],t[3],this)),
		this.springs[0].leff = this.springs[0].lrest = 30,
		this.springs[1].leff = this.springs[1].lrest = 30,
		this.springs[2].leff = this.springs[2].lrest = 30,
		this.springs[3].leff = this.springs[3].lrest = 45,
		this.springs[4].leff = this.springs[4].lrest = 45;
		for (var e in this.springs)
			this.springs[e].springConstant = .3
	}
	updateCameraFocalPoint() {}
	fixedUpdate() {
		if (this.crashed === !1 && (this.updateSound(),
		this.control()),
		this.explosion)
			this.explosion.fixedUpdate();
		else {
			for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
				t[i].fixedUpdate();
			for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
				s[r].fixedUpdate();
			if (this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1),
			this.slow === !1) {
				this.crashed === !1 && this.control();
				for (var i = e - 1; i >= 0; i--)
					t[i].fixedUpdate();
				for (var r = n - 1; r >= 0; r--)
					s[r].fixedUpdate()
			}
			this.updateDrawHeadAngle(),
			this.updateCameraFocalPoint()
		}
	}
	update(progress) {
		for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
			s[r].fixedUpdate();
	}
	updateSound() {
		if (this.player.isInFocus()) {
			var t = this.scene.sound;
			if (this.rearWheel.contact) {
				var e = Math.min(this.rearWheel.motor, 1);
				t.play(d.TRUCK_GROUND, e)
			} else if (this.frontWheel.contact) {
				var e = Math.min(this.frontWheel.motor, 1);
				t.play(d.TRUCK_GROUND, e)
			} else
				t.stop(d.TRUCK_GROUND)
		}
	}
	updateCameraFocalPoint() {
		this.focalPoint = 1 === this.dir ? this.head : this.backMass
	}
	stopSounds() {
		var t = this.scene.sound;
		t.stop(d.TRUCK_GROUND)
	}
	updateDrawHeadAngle() {
		var t = this.frontWheel.pos
			, e = this.rearWheel.pos
			, i = t.x
			, s = t.y
			, n = e.x
			, r = e.y
			, o = i - n
			, a = s - r;
		this.drawHeadAngle = -(Math.atan2(o, a) - Math.PI / 2)
	}
	swap() {
		this.dir = -1 * this.dir,
		this.springs[0].swap(),
		this.springs[5].swap()
	}
	control() {
		var t = this.gamepad
			, e = t.isButtonDown("up")
			, i = t.isButtonDown("down")
			, s = t.isButtonDown("left")
			, n = t.isButtonDown("right")
			, r = t.isButtonDown("z");
		r && !this.swapped && (this.swap(),
		this.swapped = !0),
		r || (this.swapped = !1);
		var o = e ? 1 : 0
			, a = this.rearWheel
			, h = this.frontWheel;
		a.motor += (.8 * o - a.motor) / 10,
		h.motor += (.8 * o - h.motor) / 10,
		a.brake = i,
		h.brake = i;
		var l = s ? 1 : 0;
		l += n ? -1 : 0;
		var c = this.springs;
		c[0].rotate(l / 8),
		c[5].rotate(l / 8)
	}
	draw(t) {
		if (this.explosion)
			this.explosion.draw(1);
		else {
			if (this.scene.ticks > 0 && !this.player.isGhost()) {
				if (!this.scene.state.playing) {
					let t = window.lite.storage.get("snapshots");
					if (t > 0) {
						for (let i in this.player._checkpoints) {
							if (i <= this.player._checkpoints.length - (parseInt(t) + 1) || !this.player._checkpoints[i] || !this.player._checkpoints[i]._tempVehicle) continue;
							t.globalAlpha = t / 3e2 * parseInt(i) % 1,
							this.drawTruck.call(Object.assign({}, this, JSON.parse(this.player._checkpoints[i]._tempVehicle), {tire: this.tire}), t),
							t.globalAlpha = 1
						}

						for (let i in this.player._cache) {
							if (i <= this.player._cache.length - (parseInt(t) + 1) || !this.player._cache[i] || !this.player._cache[i]._tempVehicle) continue;
							t.globalAlpha = t / 3e2 * parseInt(i) % 1,
							this.drawTruck.call(Object.assign({}, this, JSON.parse(this.player._cache[i]._tempVehicle), {tire: this.tire}), t),
							t.globalAlpha = 1
						}
					}
				}

				if (window.lite.storage.get("playerTrail")) {
					for (let i in window.lite.snapshots) {
						if (!window.lite.snapshots[i] || !window.lite.snapshots[i]._tempVehicle) continue;
						t.globalAlpha = window.lite.snapshots.length / (window.lite.snapshots.length * 200) * parseInt(i) % 1,
						this.drawTruck.call(Object.assign({}, this, JSON.parse(window.lite.snapshots[i]._tempVehicle), {tire: this.tire}), t),
						t.globalAlpha = 1
					}
				}
			}

			if (t.imageSmoothingEnabled = !0,
			t.mozImageSmoothingEnabled = !0,
			t.webkitImageSmoothingEnabled = !0,
			this.settings.developerMode)
				for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
					e[s].draw();
			t.globalAlpha = this.player._opacity,
			this.drawTruck(t),
			t.globalAlpha = 1
		}
	}
	drawTruck(t) {
		var e = this.scene
			, i = e.camera.zoom
			, n = GameInventoryManager.getItem(this.cosmetics.head)
			, r = this.drawHeadAngle
			, o = this.dir
			, a = new s(this.frontWheel.pos.x, this.frontWheel.pos.y).toScreen(e)
			, h = new s(this.rearWheel.pos.x, this.rearWheel.pos.y).toScreen(e)
			, l = new s(this.head.pos.x, this.head.pos.y).toScreen(e)
			, c = new s(this.backMass.pos.x, this.backMass.pos.y).toScreen(e)
			, d = (this.backMass.pos.x - this.head.pos.x) * i
			, f = (this.backMass.pos.y - this.head.pos.y) * i
			, v = (.5 * (this.head.pos.x + this.backMass.pos.x) - .5 * (this.rearWheel.pos.x + this.frontWheel.pos.x)) * i
			, g = (.5 * (this.head.pos.y + this.backMass.pos.y) - .5 * (this.rearWheel.pos.y + this.frontWheel.pos.y)) * i;
		t.lineWidth = 3 * i;
		var m = c.x - l.x
			, y = c.y - l.y
			, w = Math.sqrt(Math.pow(m, 2) + Math.pow(y, 2))
			, x = m / w
			, _ = y / w;
		n.draw(t, c.x - .5 * x * i * 20, c.y - _ * i * 20 * .5, r, .45 * i, o),
		t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#aaa" : window.lite.storage.get("theme") === "dark" ? "#bbb" : "#444",
		t.beginPath(),
		t.moveTo(l.x - .4 * d - .9 * v, l.y - .4 * f - .9 * g),
		t.lineTo(l.x + .8 * d - .9 * v, l.y + .8 * f - .9 * g),
		t.stroke(),
		t.closePath(),
		t.save(),
		t.fillStyle = window.lite.storage.get("theme") === "midnight" ? "#999" : window.lite.storage.get("theme") === "dark" ? "#888" : "#777",
		t.beginPath(),
		t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
		t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
		t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
		t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
		t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
		t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
		t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
		t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
		t.closePath(),
		t.fill(),
		t.save(),
		t.lineWidth = 2 * i,
		t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#aaa" : window.lite.storage.get("theme") === "dark" ? "#bbb" : "#444",
		t.beginPath(),
		t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
		t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
		t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
		t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
		t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
		t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
		t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
		t.closePath(),
		t.stroke(),
		t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#aaa" : window.lite.storage.get("theme") === "dark" ? "#bbb" : "#444",
		t.lineWidth = i,
		t.beginPath(),
		t.moveTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
		t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
		t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
		t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
		t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
		t.closePath(),
		t.stroke(),
		t.beginPath(),
		this.tire(t, h.x, h.y, 10 * i, i, this.rearWheel.angle),
		t.closePath(),
		t.beginPath(),
		this.tire(t, a.x, a.y, 10 * i, i, this.frontWheel.angle),
		t.closePath(),
		t.restore()
	}
	tire(t, e, i, s, n, r) {
		let a;
		for (t.beginPath(),
		t.arc(e, i, 10 * n, 0, 2 * Math.PI, !1),
		t.fillStyle = "#888888",
		t.fill(),
		t.lineWidth = 5.9 * n,
		t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000",
		t.closePath(),
		t.stroke(),
		t.beginPath(),
		t.lineWidth = 2 * n,
		t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000",
		a = 0,
		s += 3 * n; a++ < 8; )
			t.moveTo(e + s * Math.cos(r + 6.283 * a / 8), i + s * Math.sin(r + 6.283 * a / 8)),
			t.lineTo(e + s * Math.cos(r + 6.283 * (a + .5) / 8), i + s * Math.sin(r + 6.283 * (a + .5) / 8));
		for (t.stroke(),
		t.closePath(),
		t.beginPath(),
		t.lineWidth = 2 * n,
		t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000",
		a = 0,
		s += -9 * n; a++ < 5; )
			t.moveTo(e + s * Math.cos(r + 6.283 * a / 5), i + s * Math.sin(r + 6.283 * a / 5)),
			t.lineTo(e + s * Math.cos(r + 6.283 * (a + .2) / 5), i + s * Math.sin(r + 6.283 * (a + .2) / 5));
		t.closePath(),
		t.stroke()
	}
}