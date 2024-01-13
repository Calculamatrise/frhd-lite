import s from "../math/cartesian.js";
import Mass from "./mass.js";
import Spring from "./spring.js";
import Vehicle from "./vehicle.js";
import Prop from "./prop.js";

let c = {
	HELICOPTER: "helicopter"
}

export default class extends Vehicle {
	swapped = !1;
	vehicleName = "Helicopter";
	constructor(t, e, i) {
		super(t);
		this.createMasses(e);
		this.createSprings();
		this.createCockpit();
		this.updateCameraFocalPoint();
		this.stopSounds();
		-1 === i && this.swap()
	}
	createCockpit() {
		let t = document.createElement('canvas');
		this.canvasCockpit = t,
		this.ctx = t.getContext('2d'),
		this.ctx.fillStyle = this.color,
		this.ctx.strokeStyle = this.color
	}
	createMasses(t) {
		var e = [];
		e.push(new Prop(new s(t.x + 0,t.y + 18),this));
		var i = new Mass(new s(t.x + -17,t.y + 42), this)
		, r = new Mass(new s(t.x + 17,t.y + 42), this)
		, o = new Mass(new s(t.x + -40,t.y + 15), this)
		, h = new Mass(new s(t.x + 40,t.y + 15), this);
		e.push(i),
		e.push(r),
		e.push(o),
		e.push(h),
		e[0].radius = 18,
		e[1].radius = 8,
		e[2].radius = 8,
		e[3].grav = !1,
		e[4].grav = e[4].collide = !1,
		e[1].friction = .2,
		e[2].friction = .2,
		this.head = e[0],
		this.mass2 = e[1],
		this.mass3 = e[2],
		this.mass4 = e[3],
		this.rotor = 0,
		this.rotor2 = 0,
		this.dir = 1;
		let l = this;
		e[3].drive = this.head.drive = function() {
			l.explode()
		}
		this.focalPoint = e[0],
		this.masses = e
	}
	createSprings() {
		let t = this.masses
		  , e = [];
		e.push(new Spring(t[0],t[1],this)),
		e.push(new Spring(t[2],t[0],this)),
		e.push(new Spring(t[2],t[1],this)),
		e.push(new Spring(t[0],t[3],this)),
		e.push(new Spring(t[1],t[3],this)),
		e.push(new Spring(t[0],t[4],this)),
		e.push(new Spring(t[2],t[4],this)),
		this.spring1 = e[0],
		this.spring2 = e[1],
		this.spring3 = e[2],
		this.spring4 = e[3],
		this.spring5 = e[4],
		this.spring6 = e[5],
		this.spring7 = e[6],
		e[0].leff = e[4].lrest = 30,
		e[1].leff = e[4].lrest = 30,
		e[2].leff = e[4].lrest = 35,
		e[4].leff = e[4].lrest = 35,
		e[6].leff = e[4].lrest = 35;
		for (let i in e)
			e[i].dampConstant = .4;
		for (let i in e)
			e[i].springConstant = .5;
		this.springs = e
	}
	drawCockpit() {
		let t = this.canvasCockpit
		  , i = this.scene
		  , s = i.camera.zoom
		  , r = 50 * s
		  , o = 50 * s
		  , l = Math.max(2 * s, 1)
		  , c = this.ctx;
		if (r !== t.width || o !== t.height ||
		c.fillStyle !== this.color ||
		c.strokeStyle !== this.color ||
		c.lineWidth !== l) {
			t.width = r,
			t.height = o;
			var e = this.masses
			  , n = e[0].radius * s * .9;
			c.save(),
			c.translate(r / 2, o / 2),
			c.scale(1.3, 1),
			c.beginPath(),
			c.arc(0, 0, n, 0, 1.5 * Math.PI, !1),
			c.lineTo(0, 0),
			c.lineTo(n, 0),
			c.closePath(),
			c.restore(),
			c.fillStyle = this.color,
			c.fill(),
			c.lineWidth = l,
			c.strokeStyle = this.color,
			c.stroke(),
			c.save(),
			c.translate(r / 2, o / 2),
			c.scale(1.3, 1),
			c.beginPath(),
			c.arc(0, 0, n, 0, 1.5 * Math.PI, !0),
			c.restore(),
			c.stroke()
		}

		return t
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
			if ((this.masses[1].contact || this.masses[2].contact) && (this.slow = !1),
			this.slow === !1) {
				this.crashed === !1 && this.control();
				for (var i = e - 1; i >= 0; i--)
					t[i].fixedUpdate();
				for (var r = n - 1; r >= 0; r--)
					s[r].fixedUpdate()
			}
			this.updateCockpitAngle()
		}
	}
	update(progress) {
		for (let s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
			s[r].update(progress)
	}
	updateSound() {
		if (this.player.isInFocus()) {
			let t = this.scene.sound
			  , e = Math.min(this.head.motor, 1);
			t.play(c.HELICOPTER, e)
		}
	}
	stopSounds() {
		let t = this.scene.sound;
		t.stop(c.HELICOPTER)
	}
	swap() {
		let t = this.dir
		  , e = this.springs
		  , i = this.masses;
		t = -1 * t,
		e[2].swap();
		let n = new s(0,0)
		  , r = new s(0,0)
		  , o = new s(0,0);
		n.equ(i[3].pos),
		r.equ(i[3].old),
		o.equ(i[3].vel),
		i[3].pos.equ(i[4].pos),
		i[3].old.equ(i[4].old),
		i[3].vel.equ(i[4].vel),
		i[4].pos.equ(n),
		i[4].old.equ(r),
		i[4].vel.equ(o),
		this.dir = t
	}
	control() {
		let t = this.player.getGamepad()
		  , e = t.isButtonDown("up")
		  , i = t.isButtonDown("back")
		  , s = t.isButtonDown("left")
		  , n = t.isButtonDown("right")
		  , r = t.isButtonDown("z")
		  , o = this.masses
		  , a = this.springs;
		r && !this.swapped && (this.swap(),
		this.swapped = !0),
		r || (this.swapped = !1);
		let h = o[1].pos.add(o[2].pos).factor(.5);
		h = o[0].pos.sub(h),
		h = h.factor(1 / h.len()),
		o[0].angle.equ(h);
		let l = e ? 1 : 0;
		o[0].motor += (l - o[0].motor) / 10;
		let c = s ? 1 : 0;
		c += n ? -1 : 0,
		a[2].rotate(c / 6),
		i && (this.scene.restartTrack = !0)
	}
	updateCockpitAngle() {
		let t = this.masses
		  , e = t[0].pos
		  , i = t[3].pos
		  , s = e.x
		  , n = e.y
		  , r = i.x
		  , o = i.y
		  , a = s - r
		  , l = n - o;
		this.cockpitAngle = -(Math.atan2(a, l) - Math.PI / 2)
		this.rotor += .5 * this.head.motor + .05,
		this.rotor > 6.2831 && (this.rotor -= 6.2831),
		this.rotor2 += .5,
		this.rotor2 > 6.2831 && (this.rotor2 -= 6.2831)
	}
	draw(ctx) {
		if (this.explosion)
			this.explosion.draw(ctx, 1);
		else {
			ctx.imageSmoothingEnabled = !0,
			ctx.webkitImageSmoothingEnabled = !0,
			ctx.mozImageSmoothingEnabled = !0;
			if (this.scene.ticks > 0 && !this.player.isGhost()) {
				if (!this.scene.state.playing) {
					let t = window.lite && parseInt(lite.storage.get("snapshots"));
					if (t > 0) {
						for (let e in this.player._checkpoints.filter((e, i, s) => i > s.length - (t + 1) && e._tempVehicle)) {
							let i = document.createElement('canvas');
							this.drawHelicopter.call(Object.assign({}, this, JSON.parse(this.player._checkpoints[e]._tempVehicle), {canvasCockpit: i, ctx: i.getContext('2d'), drawCockpit: this.drawCockpit}), ctx, t / 3e2 * e % 1);
						}

						for (let e in this.player._cache.filter((e, i, s) => i > s.length - (t + 1) && e._tempVehicle)) {
							let i = document.createElement('canvas');
							this.drawHelicopter.call(Object.assign({}, this, JSON.parse(this.player._cache[e]._tempVehicle), {canvasCockpit: i, ctx: i.getContext('2d'), drawCockpit: this.drawCockpit}), ctx, t / 3e2 * e % 1);
						}
					}
				}

				if (window.lite && lite.storage.get("playerTrail")) {
					for (let e in lite.snapshots.filter(t => t._tempVehicle)) {
						let i = document.createElement('canvas');
						this.drawHelicopter.call(Object.assign({}, this, JSON.parse(lite.snapshots[e]._tempVehicle), {canvasCockpit: i, ctx: i.getContext('2d'), drawCockpit: this.drawCockpit}), ctx, lite.snapshots.length / (lite.snapshots.length * 200) * parseInt(e) % 1);
					}
				}
			}

			this.drawHelicopter(ctx);
		}
	}
	drawHelicopter(t, alpha = this.player._opacity) {
		t.globalAlpha = alpha;
		let i = this.dir
		  , n = this.rotor
		  , r = this.rotor2
		  , o = this.scene
		  , a = o.camera.zoom
		  , q = new s(this.head.pos.x, this.head.pos.y)
		  , m = new s(this.mass2.pos.x, this.mass2.pos.y).add(this.mass3.pos).factor(.5)
		  , h = q.sub(m).factor(a)
		  , l = new s(-h.y * i,h.x * i)
		  , c = q.toScreen(o);
		t.strokeStyle = this.color,
		t.lineWidth = 5 * a,
		t.beginPath(),
		t.moveTo(c.x + .5 * h.x, c.y + .5 * h.y),
		t.lineTo(c.x + .8 * h.x, c.y + .8 * h.y),
		t.stroke(),
		t.lineWidth = 3 * a,
		t.beginPath();
		var u = .9 * Math.cos(n);
		t.moveTo(c.x + .9 * h.x + l.x * u, c.y + .8 * h.y + l.y * u),
		t.lineTo(c.x + .9 * h.x - l.x * u, c.y + .8 * h.y - l.y * u),
		t.stroke();
		var p = new s(this.mass2.pos.x, this.mass2.pos.y).toScreen(o)
		  , d = new s(this.mass3.pos.x, this.mass3.pos.y).toScreen(o);
		t.lineWidth = 3 * a,
		t.strokeStyle = '#'.padEnd(7, window.lite.storage.get('theme') === "midnight" ? '8' : window.lite.storage.get('theme') === 'dark' ? '9' : '6'),
		t.beginPath(),
		t.moveTo(p.x - .2 * h.x, p.y - .2 * h.y),
		t.lineTo(c.x, c.y),
		t.lineTo(d.x - .2 * h.x, d.y - .2 * h.y),
		t.stroke(),
		t.lineWidth = 4 * a,
		t.beginPath(),
		t.moveTo(p.x - .2 * l.x - .1 * h.x, p.y - .2 * l.y - .1 * h.y),
		t.lineTo(p.x - .25 * h.x, p.y - .25 * h.y),
		t.lineTo(d.x - .25 * h.x, d.y - .25 * h.y),
		t.lineTo(d.x + .2 * l.x - .1 * h.x, d.y + .2 * l.y - .1 * h.y),
		t.stroke(),
		t.lineWidth = 6 * a,
		t.strokeStyle = this.color,
		t.beginPath();
		var f = new s(this.mass4.pos.x, this.mass4.pos.y).toScreen(o);
		t.moveTo(c.x, c.y),
		t.lineTo(f.x, f.y),
		t.lineTo(c.x - .1 * h.x, c.y - .3 * h.y),
		t.stroke(),
		t.lineWidth = 2 * a,
		t.strokeStyle = this.color,
		t.beginPath();
		var v = 7 * a
		  , g = new s(v * Math.sin(-r),v * Math.cos(-r));
		t.moveTo(f.x + g.x, f.y + g.y),
		t.lineTo(f.x - g.x, f.y - g.y),
		t.moveTo(f.x - g.y, f.y + g.x),
		t.lineTo(f.x + g.y, f.y - g.x),
		t.stroke(),
		t.beginPath(),
		t.lineWidth = 2 * a,
		t.arc(f.x, f.y, this.mass4.radius * a, 0, 2 * Math.PI, !1),
		t.stroke();
		m = this.drawCockpit()
		var y = m.width
		  , w = m.height
		  , x = c.x + 5 * a * this.dir
		  , _ = c.y + 2 * a
		  , S = -y / 2
		  , P = -w / 2
		  , M = this.cockpitAngle
		  , A = -1 === i
		  , D = this.cosmetics
		  , I = GameInventoryManager.getItem(D.head)
		  , E = this.cockpitAngle;
		I.draw(t, x + 5 * a * i, _ - 5 * a, E, .7 * a, i),
		t.translate(x, _),
		t.rotate(M),
		A && t.scale(1, -1),
		t.drawImage(m, S, P, y, w),
		A && t.scale(1, -1),
		t.rotate(-M),
		t.translate(-x, -_),
		t.globalAlpha = 1
	}
}