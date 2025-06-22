import s from "../math/cartesian.js";
import n from "./debris.js";

export default class {
	complete = !1;
	gravity = new s(0, .3)
	powerupsEnabled = !1;
	time = 20;
	constructor(t, e) {
		Object.defineProperty(this, 'scene', { value: e, writable: true }),
		this.positionX = t.x,
		this.positionY = t.y,
		this.createMasses(t)
	}
	draw(l, t) {
		let e = this.time
		  , i = this.positionX
		  , s = this.positionY
		  , n = this.scene.camera.zoom
		  , h = this.scene.screen;
		if (l.globalAlpha = t,
		e > 0) {
			e -= 10;
			let c = h.realToScreen(i, "x")
			  , u = h.realToScreen(s, "y")
			  , p = 0
			  , d = 6.2 * Math.random()
			  , f = e * n
			  , v = c + f * Math.cos(d)
			  , g = u + f * Math.sin(d);
			l.beginPath(),
			l.moveTo(v, g),
			l.fillStyle = this.scene.settings.physicsLineColor;
			while (p++ < 16)
				f = (e + 30 * Math.random()) * n,
				v = c + f * Math.cos(d + 6.283 * p / 16),
				g = u + f * Math.sin(d + 6.283 * p / 16),
				l.lineTo(v, g);
			l.fill()
		}
		let m = this.masses;
		for (let y in m)
			m[y].draw(l);
		l.globalAlpha = 1,
		this.time = e
	}
	createMasses(t) {
		this.masses = [],
		this.masses.push(new n(t, this, this.scene.settings.physicsLineColor)),
		this.masses.push(new n(t, this, this.scene.settings.physicsLineColor)),
		this.masses.push(new n(t, this, this.scene.settings.physicsLineColor)),
		this.masses.push(new n(t, this, this.scene.settings.physicsLineColor)),
		this.masses.push(new n(t, this, this.scene.settings.physicsLineColor)),
		this.masses.push(new n(t, this, this.scene.settings.physicsLineColor)),
		this.masses.push(new n(t, this, this.scene.settings.physicsLineColor))
	}
	fixedUpdate() {
		for (let t of this.masses)
			t.fixedUpdate()
	}
	update() {
		for (let t of this.masses)
			t.update(...arguments)
	}
	lateUpdate() {
		for (let t of this.masses)
			t.lateUpdate()
	}
}