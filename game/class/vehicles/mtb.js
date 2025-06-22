import "../cosmetics/heads/head.js";
import "../cosmetics/heads/forward_cap.js";

import s from "../math/cartesian.js";
import Bike from "./bike.js";
import n from "./mass.js";
import a from "./wheel.js";

export default class extends Bike {
	vehicleName = "MTB";
	constructor(t, e, i, s) {
		super(t);
		this.createMasses(e, s);
		this.createSprings();
		this.updateCameraFocalPoint();
		this.stopSounds();
		-1 === i && this.swap()
	}
	createMasses(t, e) {
		var i = new n(new s(t.x + 2, t.y + -38), this)
		, r = new a(new s(t.x + 23, t.y), this)
		, o = new a(new s(t.x + -23, t.y), this);
		i.drive = this.createRagdoll.bind(this),
		o.radius = 14,
		r.radius = 14,
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
		this.chasse.lrest = 45,
		this.chasse.leff = 45,
		this.chasse.springConstant = .2,
		this.chasse.dampConstant = .3,
		this.rearSpring.lrest = 47,
		this.rearSpring.leff = 47,
		this.rearSpring.springConstant = .2,
		this.rearSpring.dampConstant = .3,
		this.frontSpring.lrest = 45,
		this.frontSpring.leff = 45,
		this.frontSpring.springConstant = .2,
		this.frontSpring.dampConstant = .3
	}
	control() {
		let t = this.gamepad
		  , e = t.isButtonDown("up")
		  , i = t.isButtonDown("down")
		  , s = t.isButtonDown("left")
		  , n = t.isButtonDown("right")
		  , r = t.isButtonDown("z")
		  , a = this.rearWheel;
		a.motor += (e - a.motor) / 10,
		r && !this.swapped && (this.swap(),
		this.swapped = !0),
		r || (this.swapped = !1),
		e && (this.pedala += this.rearWheel.speed / 5),
		a.brake = i,
		this.frontWheel.brake = this.dir > 0 && n && i ? !0 : this.dir < 0 && s && i ? !0 : !1;
		let h = s - n;
		this.rearSpring.contract(5 * h * this.dir, 5),
		this.frontSpring.contract(5 * -h * this.dir, 5),
		this.chasse.rotate(h / 8),
		!h && e && (this.rearSpring.contract(-7, 5),
		this.frontSpring.contract(7, 5))
	}
	drawBikeFrame(o, a = this.player._opacity) {
		let t = this.scene
		  , frontWheel = new s(this.frontWheel.displayPos.x, this.frontWheel.displayPos.y)
		  , rearWheel = new s(this.rearWheel.displayPos.x, this.rearWheel.displayPos.y)
		  , head = new s(this.head.displayPos.x, this.head.displayPos.y)
		  , e = frontWheel.toScreen(t)
		  , i = rearWheel.toScreen(t)
		  , n = head.toScreen(t)
		  , r = t.camera.zoom
		  , h = e.sub(i)
		  , l = new s(e.y - i.y, i.x - e.x)
		  , c = h.factor(.5)
		  , q = t.settings.physicsLineColor
		  , y = t.settings.sceneryLineColor
		  , z = y.padEnd(7, y.slice(1, 4));
		l.factorSelf(this.dir),
		i.addOut(c, c),
		n.subOut(c, c),
		super.drawBikeFrame(...arguments);
		o.fillStyle = z + '33', // "rgba(200,200,200,0.2)",
		this.frontWheel.draw(o),
		this.frontWheel.fill || o.fill(),
		this.frontWheel.stroke || o.stroke(),
		this.rearWheel.draw(o),
		this.rearWheel.fill || o.fill(),
		this.rearWheel.stroke || o.stroke(),
		o.strokeStyle = "rgba(128,128,128,0.8)", // "rgba(153, 153, 153,1)",
		o.fillStyle = y, // "rgba(204, 204, 204,1)",
		o.lineWidth = 1,
		o.beginPath(),
		o.arc(e.x, e.y, 6 * r, 0, 2 * Math.PI, !1),
		o.fill(),
		o.stroke(),
		o.beginPath(),
		o.arc(i.x, i.y, 6 * r, 0, 2 * Math.PI, !1),
		o.fill(),
		o.stroke(),
		o.beginPath(),
		o.strokeStyle = this.color,
		o.lineWidth = 5 * r,
		o.moveTo(i.x, i.y),
		o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
		o.moveTo(i.x + .72 * h.x + .64 * c.x, i.y + .72 * h.y + .64 * c.y),
		o.lineTo(i.x + .46 * h.x + .4 * c.x, i.y + .46 * h.y + .4 * c.y),
		o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
		o.stroke(),
		o.beginPath(),
		o.lineWidth = 2 * r,
		o.moveTo(i.x + .72 * h.x + .64 * c.x, i.y + .72 * h.y + .64 * c.y),
		o.lineTo(i.x + .43 * h.x + .05 * l.x, i.y + .43 * h.y + .05 * l.y),
		o.stroke(),
		o.beginPath(),
		o.lineWidth = 1 * r,
		o.moveTo(i.x + .46 * h.x + .4 * c.x, i.y + .46 * h.y + .4 * c.y),
		o.lineTo(i.x + .28 * h.x + .5 * c.x, i.y + .28 * h.y + .5 * c.y),
		o.stroke(),
		o.beginPath(),
		o.lineWidth = 2 * r,
		o.moveTo(i.x + .45 * h.x + .3 * c.x, i.y + .45 * h.y + .3 * c.y),
		o.lineTo(i.x + .3 * h.x + .4 * c.x, i.y + .3 * h.y + .4 * c.y),
		o.lineTo(i.x + .25 * h.x + .6 * c.x, i.y + .25 * h.y + .6 * c.y),
		o.moveTo(i.x + .17 * h.x + .6 * c.x, i.y + .17 * h.y + .6 * c.y),
		o.lineTo(i.x + .3 * h.x + .6 * c.x, i.y + .3 * h.y + .6 * c.y),
		o.stroke(),
		o.beginPath(),
		o.lineWidth = 3 * r,
		o.moveTo(e.x, e.y),
		o.lineTo(i.x + .71 * h.x + .73 * c.x, i.y + .71 * h.y + .73 * c.y),
		o.lineTo(i.x + .73 * h.x + .77 * c.x, i.y + .73 * h.y + .77 * c.y),
		o.lineTo(i.x + .7 * h.x + .8 * c.x, i.y + .7 * h.y + .8 * c.y),
		o.stroke(),
		o.beginPath(),
		o.lineWidth = 1 * r;
		let u = new s(6 * Math.cos(this.pedala) * r,6 * Math.sin(this.pedala) * r);
		o.moveTo(i.x + .43 * h.x + .05 * l.x + u.x, i.y + .43 * h.y + .05 * l.y + u.y),
		o.lineTo(i.x + .43 * h.x + .05 * l.x - u.x, i.y + .43 * h.y + .05 * l.y - u.y),
		o.stroke();
		if (this.crashed)
			this.ragdoll && this.ragdoll.draw && this.ragdoll.draw(o);
		else {
			h.factorOut(.5, l),
			i.addOut(l, l),
			n.subOut(l, l);
			let p = h.factor(.3);
			p.x = i.x + p.x + .25 * l.x,
			p.y = i.y + p.y + .25 * l.y;
			let d = h.factor(.4);
			d.x = i.x + d.x + .05 * l.x,
			d.y = i.y + d.y + .05 * l.y;
			let f = d.add(u)
			, v = d.sub(u)
			, g = h.factor(.67);
			g.x = i.x + g.x + .8 * l.x,
			g.y = i.y + g.y + .8 * l.y;
			let m = h.factor(-.05);
			m.x = p.x + m.x + .42 * l.x,
			m.y = p.y + m.y + .42 * l.y;
			let y = f.sub(m)
			, w = y.lenSqr();
			c.x = y.y * this.dir,
			c.y = -y.x * this.dir,
			c.factorSelf(r ** 2);
			let x = y.factor(.5);
			x.x = m.x + x.x + c.x * (200 / y.lenSqr()),
			x.y = m.y + x.y + c.y * (200 / y.lenSqr());
			let _ = y.factor(.12);
			_.x = f.x + _.x + c.x * (50 / w),
			_.y = f.y + _.y + c.y * (50 / w),
			v.subOut(m, y),
			w = y.lenSqr(),
			c.x = y.y * this.dir,
			c.y = -y.x * this.dir,
			c.factorSelf(r * r);
			let b = y.factor(.5);
			b.x = m.x + b.x + c.x * (200 / w),
			b.y = m.y + b.y + c.y * (200 / w);
			let T = y.factor(.12);
			T.x = v.x + T.x + c.x * (50 / w),
			T.y = v.y + T.y + c.y * (50 / w);
			z = this.player && this.player.color || z,
			o.strokeStyle = z + Math.min(255, Math.round(255 * .5 * a)).toString(16).padStart(Math.floor(z.length / 3), 0),
			o.lineWidth = 6 * r,
			o.beginPath(),
			o.moveTo(v.x, v.y),
			o.lineTo(b.x, b.y),
			o.lineTo(m.x, m.y),
			o.stroke(),
			o.lineWidth = 4 * r,
			o.beginPath(),
			o.moveTo(v.x, v.y),
			o.lineTo(T.x, T.y),
			o.stroke(),
			o.lineWidth = 6 * r,
			o.strokeStyle = q,
			o.beginPath(),
			o.moveTo(f.x, f.y),
			o.lineTo(x.x, x.y),
			o.lineTo(m.x, m.y),
			o.stroke(),
			o.lineWidth = 4 * r,
			o.beginPath(),
			o.moveTo(f.x, f.y),
			o.lineTo(_.x, _.y),
			o.stroke();
			let C = h.factor(.1);
			C.x = p.x + C.x + .95 * l.x,
			C.y = p.y + C.y + .95 * l.y,
			o.lineWidth = 8 * r,
			o.beginPath(),
			o.moveTo(m.x, m.y),
			o.lineTo(C.x, C.y),
			o.stroke();
			let k = h.factor(.2);
			k.x = p.x + k.x + 1.09 * l.x,
			k.y = p.y + k.y + 1.09 * l.y,
			o.beginPath(),
			o.lineWidth = 2 * r,
			C.subOut(g, h);
			let S = h.lenSqr();
			l.x = h.y * this.dir,
			l.y = -h.x * this.dir,
			l.factorSelf(r * r);
			let P = h.factor(.3);
			P.x = g.x + P.x + l.x * (80 / S),
			P.y = g.y + P.y + l.y * (80 / S),
			o.lineWidth = 5 * r,
			o.beginPath(),
			o.moveTo(C.x, C.y),
			o.lineTo(P.x, P.y),
			o.lineTo(g.x, g.y),
			o.stroke();
			let A = GameInventoryManager.getItem(this.cosmetics.head);
			A.draw(o, k.x, k.y, this.drawHeadAngle, r, this.dir),
			o.globalAlpha = 1
		}
	}
}