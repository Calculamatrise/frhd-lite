import n from "../math/cartesian.js";
import r from "./mass.js";
import o from "./wheel.js";
import a from "./spring.js";
import Vehicle from "./vehicle.js";

let l = {
	BLOB: "blob_sound"
}

export default class extends Vehicle {
	vehicleName = "Blob";
	constructor(t, e) {
		super(t);
		this.createMasses(e);
		this.createSprings();
		this.stopSounds();
	}
	createMasses(t) {
		var e = [];
		e.push(new o(new n(t.x + 15,t.y + 40),this)),
		e.push(new o(new n(t.x + -15,t.y + 40),this)),
		e.push(new o(new n(t.x + -15,t.y + 10),this)),
		e.push(new o(new n(t.x + 15,t.y + 10),this));
		var i = new r(new n(0,0), this);
		i.vel = new n(0,0),
		this.m0 = e[0],
		this.m1 = e[1],
		this.m2 = e[2],
		this.m3 = e[3],
		this.head = i,
		this.masses = e,
		this.focalPoint = this.head
	}
	createSprings() {
		let t = this.masses
		  , e = []
		  , i = this.spring0 = new a(t[0],t[1],this)
		  , s = this.spring1 = new a(t[1],t[2],this)
		  , n = this.spring2 = new a(t[2],t[3],this)
		  , r = this.spring3 = new a(t[3],t[0],this)
		  , o = this.spring4 = new a(t[0],t[2],this)
		  , h = this.spring5 = new a(t[1],t[3],this);
		e.push(i),
		e.push(s),
		e.push(n),
		e.push(r),
		e.push(o),
		e.push(h);
		for (var l in e)
			e[l].springConstant = .2,
			e[l].dampConstant = .2;
		this.springs = e
	}
	fixedUpdate() {
		if (this.crashed === !1 && (this.updateSound(),
		this.control()),
		this.explosion)
			this.explosion.fixedUpdate();
		else {
			let t = this.masses
			  , e = t.length
			  , i = this.springs
			  , n = i.length;
			for (var s = n - 1; s >= 0; s--)
				i[s].fixedUpdate();
			for (var m = e - 1; m >= 0; m--)
				t[m].fixedUpdate();
			if ((t[0].contact || t[1].contact || t[2].contact || t[3].contact) && (this.slow = !1),
			!this.slow) {
				for (this.control(),
				s = n - 1; s >= 0; s--)
					i[s].fixedUpdate();
				for (m = e - 1; m >= 0; m--)
					t[m].fixedUpdate()
			}
			let r = 0,
				o = 0;
			for (const t of this.masses)
				r += t.pos.x,
				o += t.pos.y;
			let a = this.head;
			a.pos.x = .25 * r,
			a.pos.y = .25 * o,
			a.vel = t[0].vel
		}
	}
	update(progress) {
		for (var t = this.masses, e = t.length, m = e - 1; m >= 0; m--)
			t[m].update(progress);
	}
	updateSound() {
		if (this.player.isInFocus()) {
			var t = this.scene.sound;
			t.play(l.BLOB, .4)
		}
	}
	stopSounds() {
		var t = this.scene.sound;
		t.stop(l.BLOB)
	}
	updateCameraFocalPoint() {}
	control() {
		var t, e, i = this.player.getGamepad(), s = i.isButtonDown("up"), n = i.isButtonDown("down"), r = i.isButtonDown("left"), o = i.isButtonDown("right"), a = i.isButtonDown("z"), h = this.masses, l = this.springs, c = h.length, u = l.length, p = this.dir;
		p = o ? 1 : -1;
		var d = o || r ? 1 : 0;
		for (n && (d = 0),
		t = c - 1; t >= 0; t--)
			h[t].motor += (d * p * 1 - h[t].motor) / 10,
			0 == d && (h[t].motor = 0),
			h[t].brake = n;
		var f = r ? 1 : 0;
		if (f += o ? -1 : 0,
		l[4].rotate(f / 9),
		l[5].rotate(f / 9),
		a || s)
			for (e = u - 1; e >= 0; e--)
				l[e].contract(30, 10);
		else
			for (e = u - 1; e >= 0; e--)
				l[e].contract(0, 1.5)
	}
	draw(ctx) {
		if (this.explosion)
			this.explosion.draw(ctx, 1);
		else {
			if (this.scene.ticks > 0 && !this.player.isGhost()) {
				if (!this.scene.state.playing) {
					let t = window.lite.storage.get("snapshots");
					if (t > 0) {
						for (let i in this.player._checkpoints) {
							if (i <= this.player._checkpoints.length - (parseInt(t) + 1) || !this.player._checkpoints[i] || !this.player._checkpoints[i]._tempVehicle) continue;
							this.drawBlob.call(Object.assign({}, this, JSON.parse(this.player._checkpoints[i]._tempVehicle)), ctx, t / 3e2 * parseInt(i) % 1);
						}

						for (let i in this.player._cache) {
							if (i <= this.player._cache.length - (parseInt(t) + 1) || !this.player._cache[i] || !this.player._cache[i]._tempVehicle) continue;
							this.drawBlob.call(Object.assign({}, this, JSON.parse(this.player._cache[i]._tempVehicle)), ctx, t / 3e2 * ++e % 1);
						}
					}
				}

				if (window.lite.storage.get("playerTrail")) {
					for (let i in window.lite.snapshots) {
						if (!window.lite.snapshots[i] || !window.lite.snapshots[i]._tempVehicle) continue;
						this.drawBlob.call(Object.assign({}, this, JSON.parse(window.lite.snapshots[i]._tempVehicle)), ctx, window.lite.snapshots.length / (window.lite.snapshots.length * 200) * parseInt(i) % 1);
					}
				}
			}

			this.drawBlob(ctx);
		}
	}

	drawBlob(t, alpha = this.player._opacity) {
		var i = this.scene
		, s = i.camera.zoom
		, m = new n(this.m0.pos.x, this.m0.pos.y).toScreen(i)
		, r = new n(this.m1.pos.x, this.m1.pos.y).toScreen(i)
		, o = new n(this.m2.pos.x, this.m2.pos.y).toScreen(i)
		, a = new n(this.m3.pos.x, this.m3.pos.y).toScreen(i);
		t.globalAlpha = alpha,
		t.beginPath(),
		t.fillStyle = t.strokeStyle,
		t.lineWidth = 20 * s,
		t.lineCap = "round",
		t.moveTo(m.x, m.y),
		t.lineTo(r.x, r.y),
		t.lineTo(o.x, o.y),
		t.lineTo(a.x, a.y),
		t.lineTo(m.x, m.y),
		t.fill(),
		t.stroke(),
		t.globalAlpha = 1
	}
}