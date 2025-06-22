import Vector from "../math/cartesian.js";
import h from "./ragdoll.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";

export default class extends Vehicle {
	static Sounds = {
		BikeAir: 'bike_air',
		BikeFall: type => `bike_fall_${type}`,
		BikeGround: 'bike_ground'
	};
	cosmeticHead = null;
	cosmeticRearWheel = null;
	cosmeticFrontWheel = null;
	pedala = 0;
	swapped = !1;
	ragdoll = null;
	createSprings() {
		let t = new r(this.head,this.rearWheel,this)
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
		let t = this.scene.sound
		  , e = Math.min(this.speed / 50, 1)
		  , i = Math.ceil(3 * Math.random());
		t.play(this.constructor.Sounds.BikeFall(i), e)
	}
	updateCameraFocalPoint() {
		this.focalPoint = this.ragdoll ? this.ragdoll.head : this.head
	}
	updateSpeed() {
		this.speed = Math.abs(Math.round(this.focalPoint.vel.x + this.focalPoint.vel.y))
	}
	getStickMan() {
		let t = this.dir
		  , e = this.head
		  , i = this.frontWheel
		  , n = this.rearWheel
		  , r = this.pedala
		  , o = i.displayPos.sub(n.displayPos)
		  , a = e.displayPos.sub(i.displayPos.add(n.displayPos).factor(.5))
		  , h = new Vector(o.y * t,-o.x * t)
		  , l = {};
		l.head = n.displayPos.add(o.factor(.35)).add(a.factor(1.2)),
		l.lHand = l.rHand = n.displayPos.add(o.factor(.8)).add(h.factor(.68));
		var c = l.head.sub(l.lHand);
		c = new Vector(c.y * t,-c.x * t),
		l.lElbow = l.rElbow = l.head.add(l.lHand).factor(.5).add(c.factor(130 / c.lenSqr())),
		l.waist = n.displayPos.add(o.factor(.2)).add(h.factor(.5));
		var u = new Vector(6 * Math.cos(r),6 * Math.sin(r));
		return l.lFoot = n.displayPos.add(o.factor(.4)).add(h.factor(.05)).add(u),
		c = l.waist.sub(l.lFoot),
		c = new Vector(-c.y * t,c.x * t),
		l.lKnee = l.waist.add(l.lFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
		l.rFoot = n.displayPos.add(o.factor(.4)).add(h.factor(.05)).sub(u),
		c = l.waist.sub(l.rFoot),
		c = new Vector(-c.y * t,c.x * t),
		l.rKnee = l.waist.add(l.rFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
		l
	}
	fixedUpdate() {
		if (!super.fixedUpdate()) {
			// To compensate -- For it not to look choppy
			// Call this.update(this.scene.game.lastTime - performance.now() / this.scene.game.updateInterval?)
			// if (this.slow !== false && (this._slowState = 1 - Boolean(this._slowState)) === 1) return; // return this.update()
			let t = this.springs
			  , e = this.masses;
			for (let e = t.length, i = e - 1; i >= 0; i--)
				t[i].fixedUpdate();
			for (let n = e.length, r = n - 1; r >= 0; r--)
				e[r].fixedUpdate();
			this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1);
			if (this.slow === !1) {
				this.crashed === !1 && this.control();
				for (let e = t.length, i = e - 1; i >= 0; i--)
					t[i].fixedUpdate();
				for (let n = e.length, r = n - 1; r >= 0; r--)
					e[r].fixedUpdate();
			}
			this.ragdoll && this.ragdoll.fixedUpdate()
		}
		this.updateCameraFocalPoint()
	}
	update() {
		(this.scene.game.interpolation || this.scene.camera.playerFocus?.isGhost() || !this.scene.camera.playerFocus?.isAlive()) && super.update(...arguments);
		this.ragdoll ? this.ragdoll.update(...arguments) : this.updateDrawHeadAngle()
	}
	lateUpdate() {
		super.lateUpdate(...arguments);
		this.ragdoll && this.ragdoll.lateUpdate(...arguments)
	}
	updateSound() {
		if (this.player.isInFocus()) {
			this.updateSpeed();
			let t = Math.min(this.speed / 50, 1)
			  , e = this.scene.sound;
			this.rearWheel.contact || this.frontWheel.contact ? (e.play(this.constructor.Sounds.BikeGround, t),
			e.stop(this.constructor.Sounds.BikeAir)) : (e.play(this.constructor.Sounds.BikeAir, t),
			e.stop(this.constructor.Sounds.BikeGround))
		}
	}
	swap() {
		this.dir = -1 * this.dir,
		this.chasse.swap();
		let t = this.rearSpring.leff;
		this.rearSpring.leff = this.frontSpring.leff,
		this.frontSpring.leff = t
	}
	draw(ctx) {
		if (super.draw(...arguments)) return;
		if (this.scene.game.emit(this.scene.game.constructor.Events.PlayerBaseVehicleDraw, this)) return;
		ctx.imageSmoothingEnabled = !0,
		ctx.mozImageSmoothingEnabled = !0,
		ctx.webkitImageSmoothingEnabled = !0;
		this.drawBikeFrame(ctx)
	}
	drawBikeFrame(t, alpha) {
		const e = this.scene
			, i = e.camera.zoom
			, s = e.settings.physicsLineColor;
		t.globalAlpha = alpha ?? this.player._opacity,
		t.strokeStyle = this.frontWheel.color || s,
		t.lineWidth = 3 * i
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
	close() {
		super.close();
		this.ragdoll = null
	}
}