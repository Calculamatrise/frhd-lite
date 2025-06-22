import s from "../math/cartesian.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";
import h from "./wheel.js";

export default class extends Vehicle {
	static Sounds = { TruckGround: 'truck_idle' };
	color = "#444";
	swapped = !1;
	vehicleName = "TRUCK";
	constructor(t, e, i) {
		super(t);
		this.createMasses(e);
		this.createSprings();
		this.stopSounds();
		this.updateCameraFocalPoint();
		-1 === i && this.swap()
	}
	createMasses(t) {
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
		let t = this.masses;
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
		for (let e in this.springs)
			this.springs[e].springConstant = .3
	}
	updateCameraFocalPoint() {}
	fixedUpdate() {
		if (super.fixedUpdate()) return;
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
	updateSound() {
		if (this.player.isInFocus()) {
			let t = this.scene.sound;
			if (this.rearWheel.contact) {
				let e = Math.min(this.rearWheel.motor, 1);
				t.play(this.constructor.Sounds.TruckGround, e)
			} else if (this.frontWheel.contact) {
				let e = Math.min(this.frontWheel.motor, 1);
				t.play(this.constructor.Sounds.TruckGround, e)
			} else
				t.stop(this.constructor.Sounds.TruckGround)
		}
	}
	updateCameraFocalPoint() {
		this.focalPoint = 1 === this.dir ? this.head : this.backMass
	}
	updateDrawHeadAngle() {
		let t = this.frontWheel.displayPos
		  , e = this.rearWheel.displayPos
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
		let t = this.gamepad
		  , e = t.isButtonDown("up")
		  , i = t.isButtonDown("down")
		  , s = t.isButtonDown("left")
		  , n = t.isButtonDown("right")
		  , r = t.isButtonDown("z");
		r && !this.swapped && (this.swap(),
		this.swapped = !0),
		r || (this.swapped = !1);
		let o = e ? 1 : 0
		  , a = this.rearWheel
		  , h = this.frontWheel;
		a.motor += (.8 * o - a.motor) / 10,
		h.motor += (.8 * o - h.motor) / 10,
		a.brake = i,
		h.brake = i;
		let l = s ? 1 : 0;
		l += n ? -1 : 0;
		let c = this.springs;
		c[0].rotate(l / 8),
		c[5].rotate(l / 8)
	}
	draw(t) {
		if (super.draw(...arguments)) return;
		if (this.scene.ticks > 0 && !this.player.isGhost()) {
			if (!this.scene.state.playing) {
				let e = window.lite.storage.get("snapshots");
				if (e > 0) {
					for (let i of this.player._checkpoints.filter((i, s, n) => s > n.length - (e + 1) && i._tempVehicle)) {
						t.globalAlpha = e / 3e2 * this.player._checkpoints.indexOf(i) % 1,
						this.drawTruck.call(Object.assign({}, this, { player: this.player, scene: this.scene }, JSON.parse(i._tempVehicle), {tire: this.tire}), t)
					}

					for (let i of this.player._cache.filter((i, s, n) => s > n.length - (e + 1) && i._tempVehicle)) {
						t.globalAlpha = e / 3e2 * this.player._cache.indexOf(i) % 1,
						this.drawTruck.call(Object.assign({}, this, { player: this.player, scene: this.scene }, JSON.parse(i._tempVehicle), {tire: this.tire}), t)
					}
				}
			}

			if (window.lite && lite.storage.get("playerTrail"))
				for (let e of lite.snapshots.filter(t => t._tempVehicle)) {
					t.globalAlpha = lite.snapshots.length / (lite.snapshots.length * 200) * lite.snapshots.indexOf(e) % 1,
					this.drawTruck.call(Object.assign({}, this, { player: this.player, scene: this.scene }, JSON.parse(e._tempVehicle), {tire: this.tire}), t)
				}
		}

		if (t.imageSmoothingEnabled = !0,
		t.mozImageSmoothingEnabled = !0,
		t.webkitImageSmoothingEnabled = !0,
		this.settings.developerMode)
			for (let e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
				e[s].draw();
		t.globalAlpha = this.player._opacity,
		this.drawTruck(t),
		t.globalAlpha = 1
	}
	drawTruck(t) {
		let e = this.scene
		  , i = e.camera.zoom
		  , n = GameInventoryManager.getItem(this.cosmetics.head)
		  , r = this.drawHeadAngle
		  , o = this.dir
		  , a = new s(this.frontWheel.displayPos.x, this.frontWheel.displayPos.y).toScreen(e)
		  , h = new s(this.rearWheel.displayPos.x, this.rearWheel.displayPos.y).toScreen(e)
		  , l = new s(this.head.displayPos.x, this.head.displayPos.y).toScreen(e)
		  , c = new s(this.backMass.displayPos.x, this.backMass.displayPos.y).toScreen(e)
		  , d = (this.backMass.displayPos.x - this.head.displayPos.x) * i
		  , f = (this.backMass.displayPos.y - this.head.displayPos.y) * i
		  , v = (.5 * (this.head.displayPos.x + this.backMass.displayPos.x) - .5 * (this.rearWheel.displayPos.x + this.frontWheel.displayPos.x)) * i
		  , g = (.5 * (this.head.displayPos.y + this.backMass.displayPos.y) - .5 * (this.rearWheel.displayPos.y + this.frontWheel.displayPos.y)) * i
		  , q = '#'.padEnd(7, /^(darker|midnight)$/.test(window.lite.storage.get('theme')) ? 'a' : lite.storage.get('theme') === 'dark' ? 'b' : '4');
		t.lineWidth = 3 * i;
		let m = c.x - l.x
		  , y = c.y - l.y
		  , w = Math.sqrt(m ** 2 + y ** 2)
		  , x = m / w
		  , _ = y / w;
		n.draw(t, c.x - .5 * x * i * 20, c.y - _ * i * 20 * .5, r, .45 * i, o),
		t.strokeStyle = q,
		t.beginPath(),
		t.moveTo(l.x - .4 * d - .9 * v, l.y - .4 * f - .9 * g),
		t.lineTo(l.x + .8 * d - .9 * v, l.y + .8 * f - .9 * g),
		t.stroke(),
		t.closePath(),
		t.save(),
		t.fillStyle = "#808080",
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
		t.strokeStyle = q,
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
		t.lineWidth = i,
		t.beginPath(),
		t.moveTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
		t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
		t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
		t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
		t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
		t.closePath(),
		t.stroke(),
		t.strokeStyle = e.settings.physicsLineColor,
		this.tire(t, h.x, h.y, 10 * i, i, this.rearWheel.angle),
		this.tire(t, a.x, a.y, 10 * i, i, this.frontWheel.angle),
		t.restore()
	}
	tire(t, e, i, s, n, r) {
		t.beginPath(),
		t.arc(e, i, 10 * n, 0, 2 * Math.PI, !1),
		t.fillStyle = "#888888",
		t.fill(),
		t.lineWidth = 5.9 * n,
		t.closePath(),
		t.stroke(),
		t.beginPath(),
		t.lineWidth = 2 * n,
		s += 3 * n;
		let a = 0
		  , p = 2 * Math.PI;
		while (a++ < 8)
			t.moveTo(e + s * Math.cos(r + p * a / 8), i + s * Math.sin(r + p * a / 8)),
			t.lineTo(e + s * Math.cos(r + p * (a + .5) / 8), i + s * Math.sin(r + p * (a + .5) / 8));
		t.stroke(),
		t.closePath(),
		t.beginPath(),
		a = 0;
		s += -9 * n;
		while (a++ < 5)
			t.moveTo(e + s * Math.cos(r + p * a / 5), i + s * Math.sin(r + p * a / 5)),
			t.lineTo(e + s * Math.cos(r + p * (a + .2) / 5), i + s * Math.sin(r + p * (a + .2) / 5));
		t.closePath(),
		t.stroke()
	}
}