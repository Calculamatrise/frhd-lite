import Vector from "../math/cartesian.js";
import bike from "./bike.js";
import n from "./mass.js";
import a from "./wheel.js";

export default class extends bike {
	vehicleName = "BMX";
	constructor(t, e, i, s) {
		super(t);
		this.createMasses(e, s);
		this.createSprings();
		this.updateCameraFocalPoint();
		this.stopSounds();
		-1 === i && this.swap();
	}
	createMasses(t, e) {
		this.masses = [];
		var i = new n(new Vector(t.x,t.y - 36), this)
		  , r = new a(new Vector(t.x + 21,t.y + 3), this)
		  , o = new a(new Vector(t.x + -21,t.y + 3), this);
		i.drive = this.createRagdoll.bind(this),
		o.radius = 11.7,
		r.radius = 11.7,
		i.radius = 14,
		i.vel.equ(e),
		o.vel.equ(e),
		r.vel.equ(e),
		this.masses.push(i),
		this.masses.push(o),
		this.masses.push(r),
		this.head = i,
		this.frontWheel = r,
		this.rearWheel = o
	}
	createSprings() {
		super.createSprings(),
		this.chasse.lrest = 42,
		this.chasse.leff = 42,
		this.chasse.springConstant = .35,
		this.chasse.dampConstant = .3,
		this.rearSpring.lrest = 45,
		this.rearSpring.leff = 45,
		this.rearSpring.springConstant = .35,
		this.rearSpring.dampConstant = .3,
		this.frontSpring.lrest = 45,
		this.frontSpring.leff = 45,
		this.frontSpring.springConstant = .35,
		this.frontSpring.dampConstant = .3
	}
	control() {
		var t = this.gamepad
			, e = t.isButtonDown("up")
			, i = t.isButtonDown("down")
			, s = t.isButtonDown("left")
			, n = t.isButtonDown("right")
			, r = t.isButtonDown("z")
			, o = e ? 1 : 0
			, a = this.rearWheel;
		a.motor += (o - a.motor) / 10,
		r && !this.swapped && (this.swap(),
		this.swapped = !0),
		r || (this.swapped = !1),
		e && (this.pedala += this.rearWheel.speed / 5),
		a.brake = i,
		i && this.frontSpring.contract(-10, 10),
		this.frontWheel.brake = this.dir > 0 && n && i ? !0 : this.dir < 0 && s && i ? !0 : !1;
		var h = s ? 1 : 0;
		h += n ? -1 : 0,
		this.rearSpring.contract(5 * h * this.dir, 5),
		this.frontSpring.contract(5 * -h * this.dir, 5),
		this.chasse.rotate(h / 6),
		!h && e && (this.rearSpring.contract(-7, 5),
		this.frontSpring.contract(7, 5))
	}
	drawBikeFrame(u, r = this.player._opacity) {
		let t = this.scene
		  , rearWheel = new Vector(this.rearWheel.pos.x, this.rearWheel.pos.y)
		  , frontWheel = new Vector(this.frontWheel.pos.x, this.frontWheel.pos.y)
		  , head = new Vector(this.head.pos.x, this.head.pos.y)
		  , e = rearWheel.toScreen(t)
		  , i = frontWheel.toScreen(t)
		  , n = head.toScreen(t)
		  , o = i.sub(e)
		  , l = this.dir
		  , a = new Vector((i.y - e.y) * l, (e.x - i.x) * l)
		  , h = this.pedala
		  , c = t.camera.zoom
		  , q = t.settings.physicsLineColor;
		u.globalAlpha = r,
		u.strokeStyle = q,
		u.lineWidth = 3 * c,
		u.beginPath(),
		u.fillStyle = t.settings.sceneryLineColor.padEnd(7, t.settings.sceneryLineColor.slice(1, 4)) + '33', // "rgba(200,200,200,0.2)",
		u.arc(i.x, i.y, 10.5 * c, 0, 2 * Math.PI, !1),
		u.fill(),
		u.stroke(),
		u.beginPath(),
		u.arc(e.x, e.y, 10.5 * c, 0, 2 * Math.PI, !1),
		u.fill(),
		u.stroke();
		let p = e.add(o.factor(.3)).add(a.factor(.25))
		  , d = e.add(o.factor(.4)).add(a.factor(.05))
		  , f = e.add(o.factor(.84)).add(a.factor(.42))
		  , v = e.add(o.factor(.84)).add(a.factor(.37));
		u.beginPath(),
		u.strokeStyle = this.color,
		u.moveTo(e.x, e.y),
		u.lineTo(p.x, p.y),
		u.lineTo(f.x, f.y),
		u.moveTo(v.x, v.y),
		u.lineTo(d.x, d.y),
		u.lineTo(e.x, e.y),
		u.stroke(),
		u.beginPath(),
		u.strokeStyle = this.color,
		u.lineWidth = Math.max(1 * c, .5),
		u.arc(d.x, d.y, 3 * c, 0, 2 * Math.PI, !1),
		u.stroke();
		let g = new Vector(6 * Math.cos(h) * c,6 * Math.sin(h) * c)
		  , m = d.add(g)
		  , y = d.sub(g);
		u.beginPath(),
		u.moveTo(m.x, m.y),
		u.lineTo(y.x, y.y),
		u.stroke();
		let w = e.add(o.factor(.25)).add(a.factor(.4))
		  , x = e.add(o.factor(.17)).add(a.factor(.38))
		  , _ = e.add(o.factor(.3)).add(a.factor(.45));
		u.beginPath(),
		u.strokeStyle = this.color,
		u.lineWidth = 3 * c,
		u.moveTo(x.x, x.y),
		u.lineTo(_.x, _.y),
		u.moveTo(d.x, d.y),
		u.lineTo(w.x, w.y);
		let b = e.add(o.factor(1)).add(a.factor(0))
		  , T = e.add(o.factor(.97)).add(a.factor(0))
		  , C = e.add(o.factor(.8)).add(a.factor(.48));
		u.moveTo(b.x, b.y),
		u.lineTo(T.x, T.y),
		u.lineTo(C.x, C.y);
		let k = e.add(o.factor(.86)).add(a.factor(.5))
		  , S = e.add(o.factor(.82)).add(a.factor(.65))
		  , P = e.add(o.factor(.78)).add(a.factor(.67));
		u.lineTo(k.x, k.y),
		u.lineTo(S.x, S.y),
		u.lineTo(P.x, P.y),
		u.stroke();
		if (this.crashed) {
			this.ragdoll && this.ragdoll.draw(u);
		} else {
			a = n.sub(e.add(o.factor(.5)));
			let M = p.add(o.factor(-.1)).add(a.factor(.3))
			  , A = m.sub(M)
			  , D = new Vector(A.y * l,-A.x * l);
			D = D.factor(c * c);
			let I = M.add(A.factor(.5)).add(D.factor(200 / A.lenSqr()))
			  , E = m.add(A.factor(.12)).add(D.factor(50 / A.lenSqr()));
			A = y.sub(M),
			D = new Vector(A.y * l,-A.x * l),
			D = D.factor(c * c);
			let O = M.add(A.factor(.5)).add(D.factor(200 / A.lenSqr()))
			  , z = y.add(A.factor(.12)).add(D.factor(50 / A.lenSqr()));
			u.strokeStyle = q.padEnd(7, q.slice(1, 4)) + Math.min(255, Math.round(255 * .5 * r)).toString(16)
			u.lineWidth = 6 * c,
			u.beginPath(),
			u.moveTo(y.x, y.y),
			u.lineTo(O.x, O.y),
			u.lineTo(M.x, M.y),
			u.stroke(),
			u.lineWidth = 4 * c,
			u.beginPath(),
			u.moveTo(y.x, y.y),
			u.lineTo(z.x, z.y),
			u.stroke(),
			u.lineWidth = 6 * c,
			u.strokeStyle = q,
			u.beginPath(),
			u.moveTo(M.x, M.y),
			u.lineTo(I.x, I.y),
			u.lineTo(m.x, m.y),
			u.lineTo(E.x, E.y),
			u.stroke();
			let j = p.add(o.factor(.05)).add(a.factor(.9));
			u.lineWidth = 8 * c,
			u.beginPath(),
			u.moveTo(M.x, M.y),
			u.lineTo(j.x, j.y),
			u.stroke();
			let L = p.add(o.factor(.15)).add(a.factor(1.05));
			o = j.sub(P),
			a = new Vector(o.y * l,-o.x * l),
			a = a.factor(c * c);
			let B = P.add(o.factor(.4)).add(a.factor(130 / o.lenSqr()));
			u.lineWidth = 5 * c,
			u.beginPath(),
			u.moveTo(j.x, j.y),
			u.lineTo(B.x, B.y),
			u.lineTo(P.x, P.y),
			u.stroke();
			let R = GameInventoryManager.getItem(this.cosmetics.head);
			R.draw(u, L.x, L.y, this.drawHeadAngle, c, this.dir),
			u.globalAlpha = 1
		}
	}
}