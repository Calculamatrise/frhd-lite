import Vector from "../math/cartesian.js";
import h from "./ragdoll.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";

let d = {
	BIKE_GROUND: "bike_ground",
	BIKE_AIR: "bike_air",
	BIKE_FALL_1: "bike_fall_1",
	BIKE_FALL_2: "bike_fall_2",
	BIKE_FALL_3: "bike_fall_3"
}

export default class extends Vehicle {
	color = "#".padEnd(7, lite.storage.get("theme") == "midnight" ? "C" : lite.storage.get("theme") == "dark" ? "FB" : "0");
	cosmeticHead = null;
	cosmeticRearWheel = null;
	cosmeticFrontWheel = null;
	pedala = 0;
	swapped = !1;
	ragdoll = null;
	createSprings() {
		this.springs = [];
		var t = new r(this.head,this.rearWheel,this)
		, e = new r(this.rearWheel,this.frontWheel,this)
		, i = new r(this.frontWheel,this.head,this);
		this.springs.push(t),
		this.springs.push(e),
		this.springs.push(i),
		this.rearSpring = t,
		this.chasse = e,
		this.frontSpring = i
	}
	createRagdoll() {
		this.ragdoll = new h(this.getStickMan(),this),
		this.ragdoll.zero(this.head.vel, this.rearWheel.vel),
		this.ragdoll.dir = this.dir,
		this.rearWheel.motor = 0,
		this.rearWheel.brake = !1,
		this.frontWheel.brake = !1,
		this.head.collide = !1,
		this.updateCameraFocalPoint(),
		this.player.isInFocus() && this.playBailSound(),
		this.dead()
	}
	playBailSound() {
		var t = this.scene.sound
			, e = Math.min(this.speed / 50, 1)
			, i = Math.floor(3 * Math.random()) + 1;
		switch (i) {
			case 1:
				t.play(d.BIKE_FALL_1, e);
				break;
			case 2:
				t.play(d.BIKE_FALL_2, e);
				break;
			case 3:
				t.play(d.BIKE_FALL_3, e)
		}
	}
	updateCameraFocalPoint() {
		this.focalPoint = this.ragdoll ? this.ragdoll.head : this.head
	}
	getStickMan() {
		var t = this.dir
			, e = this.head
			, i = this.frontWheel
			, n = this.rearWheel
			, r = this.pedala
			, o = i.pos.sub(n.pos)
			, a = e.pos.sub(i.pos.add(n.pos).factor(.5))
			, h = new Vector(o.y * t,-o.x * t)
			, l = {};
		l.head = n.pos.add(o.factor(.35)).add(a.factor(1.2)),
		l.lHand = l.rHand = n.pos.add(o.factor(.8)).add(h.factor(.68));
		var c = l.head.sub(l.lHand);
		c = new Vector(c.y * t,-c.x * t),
		l.lElbow = l.rElbow = l.head.add(l.lHand).factor(.5).add(c.factor(130 / c.lenSqr())),
		l.waist = n.pos.add(o.factor(.2)).add(h.factor(.5));
		var u = new Vector(6 * Math.cos(r),6 * Math.sin(r));
		return l.lFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).add(u),
		c = l.waist.sub(l.lFoot),
		c = new Vector(-c.y * t,c.x * t),
		l.lKnee = l.waist.add(l.lFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
		l.rFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).sub(u),
		c = l.waist.sub(l.rFoot),
		c = new Vector(-c.y * t,c.x * t),
		l.rKnee = l.waist.add(l.rFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
		l
	}
	fixedUpdate() {
		if (this.scene.game.ups < 60) return this.nativeUpdate();
		if (this.crashed === !1 && (this.updateSound(),
		this.control()),
		this.explosion)
			this.explosion.fixedUpdate();
		else {
			if (this.slow && (this.slowParity = 1 - this.slowParity),
			this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1,
			this.slowParity = 0),
			this.slowParity === 0) {
				for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
					t[i].fixedUpdate();
				for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
					s[r].fixedUpdate()
			}
			this.ragdoll ? this.ragdoll.fixedUpdate() : this.updateDrawHeadAngle()
		}
		this.updateCameraFocalPoint()
	}
	update(progress) {
		if (this.explosion)
			this.explosion.update(progress);
		else {
			for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
				s[r].update(progress);
			this.ragdoll && this.ragdoll.update(progress) // : this.updateDrawHeadAngle()
		}
	}
	nativeUpdate() {
		if (this.crashed === !1 && (this.updateSound(),
		this.control()),
		this.explosion)
			this.explosion.fixedUpdate();
		else {
			for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
				t[i].fixedUpdate();
			for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
				s[r].fixedUpdate()
			if (this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1),
			this.slow === !1) {
				this.crashed === !1 && this.control()
				for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
					t[i].fixedUpdate();
				for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
					s[r].fixedUpdate()
			}
			this.ragdoll ? this.ragdoll.fixedUpdate() : this.updateDrawHeadAngle()
		}
		this.updateCameraFocalPoint()
	}
	updateSound() {
		if (this.player.isInFocus()) {
			this.updateSpeed();
			var t = Math.min(this.speed / 50, 1)
				, e = this.scene.sound;
			this.rearWheel.contact || this.frontWheel.contact ? (e.play(d.BIKE_GROUND, t),
			e.stop(d.BIKE_AIR)) : (e.play(d.BIKE_AIR, t),
			e.stop(d.BIKE_GROUND))
		}
	}
	stopSounds() {
		var t = this.scene.sound;
		t.stop(d.BIKE_AIR),
		t.stop(d.BIKE_GROUND)
	}
	swap() {
		this.dir = -1 * this.dir,
		this.chasse.swap();
		var t = this.rearSpring.leff;
		this.rearSpring.leff = this.frontSpring.leff,
		this.frontSpring.leff = t
	}
	draw(ctx) {
		if (this.explosion)
			this.explosion.draw(1);
		else {
			if (this.scene.ticks > 0 && !this.player.isGhost()) {
				if (!this.scene.state.playing) {
					let t = window.lite.storage.get("snapshots");
					if (t > 0) {
						for (let i in this.player._checkpoints) {
							if (i <= this.player._checkpoints.length - (parseInt(t) + 1) || !this.player._checkpoints[i] || !this.player._checkpoints[i]._baseVehicle) continue;
							this.drawBikeFrame.call(Object.assign({}, this, JSON.parse(this.player._checkpoints[i]._baseVehicle)), ctx, t / 3e2 * parseInt(i) % 1);
						}

						for (let i in this.player._cache) {
							if (i <= this.player._cache.length - (parseInt(t) + 1) || !this.player._cache[i] || !this.player._cache[i]._baseVehicle) continue;
							this.drawBikeFrame.call(Object.assign({}, this, JSON.parse(this.player._cache[i]._baseVehicle)), ctx, t / 3e2 * ++e % 1);
						}
					}
				}

				if (window.lite.storage.get("playerTrail")) {
					for (let i in window.lite.snapshots) {
						if (!window.lite.snapshots[i] || !window.lite.snapshots[i]._baseVehicle) continue;
						this.drawBikeFrame.call(Object.assign({}, this, JSON.parse(window.lite.snapshots[i]._baseVehicle)), ctx, window.lite.snapshots.length / (window.lite.snapshots.length * 200) * parseInt(i) % 1);
					}
				}
			}

			if (ctx.imageSmoothingEnabled = !0,
			ctx.mozImageSmoothingEnabled = !0,
			ctx.webkitImageSmoothingEnabled = !0,
			this.settings.developerMode)
				for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
					e[s].draw(ctx);

			this.drawBikeFrame(ctx)
		}
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
}