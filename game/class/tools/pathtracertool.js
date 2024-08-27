import Tool from "./tool.js";
import Cartesian from "../math/cartesian.js";

export default class PathTracer extends Tool {
	active = !1;
	name = 'pathtracer';
	p1 = new Cartesian;
	p2 = new Cartesian;
	path = [];
	points = [];
	reset() {
		this.active = !1
	}
	press() {
		super.press();
		if (!this.active) {
			let t = this.mouse.touch.real;
			this.p1.x = t.x,
			this.p1.y = t.y,
			this.p2.x = t.x,
			this.p2.y = t.y
		}
	}
	hold() {
		let t = this.mouse.touch.real
		  , e = this.p1
		  , i = this.p2;
		i.inc(t.sub(i));
		let r = screen.height + t.sub(i).len();
		if (i.sub(e).len() > 4) {
			this.points.push(i.factor(1)),
			e.equ(i),
			this.toolhandler.snapPoint.x = i.x,
			this.toolhandler.snapPoint.y = i.y
		}
		this.toolhandler.moveCameraTowardsMouse()
	}
	release() {
		let e = this.p2;
		let n = this.toolhandler
		  , r = n.snapPoint;
		r.x = e.x,
		r.y = e.y,
		this.active = !1
	}
	update() {
		let t = this.toolhandler
		  , e = this.mouse;
		super.update();
		t.options.snap && (this.p2 = e.touch.real)
	}
	draw(e) {
		super.draw(e);
		let t = this.scene
		  , i = t.camera
		  , s = i.zoom;
		e.save(),
		this.drawCursor(e),
		this.active && (this.drawLine(e, s),
		this.drawPoint(e, this.p1, s),
		this.drawPoint(e, this.p2, s)),
		e.restore()
	}
	drawCursor(t) {
		let e = this.mouse.touch
		  , i = e.real.toScreen(this.scene)
		  , s = this.camera.zoom
		  , n = this.toolhandler
		  , r = n.options.grid
		  , o = "#1884cf";
		t.beginPath();
		if (r) {
			let a = 5 * s;
			t.moveTo(i.x, i.y - a),
			t.lineTo(i.x, i.y + a),
			t.moveTo(i.x - a, i.y),
			t.lineTo(i.x + a, i.y),
			t.lineWidth = 1 * s,
			t.stroke()
		} else
			t.arc(i.x, i.y, 1 * s, 0, 2 * Math.PI, !1),
			t.lineWidth = 1,
			t.fillStyle = o,
			t.fill()
	}
	drawPoint(t, e, i) {
		let s = e.toScreen(this.scene);
		t.beginPath(),
		t.arc(s.x, s.y, 1 * i, 0, 2 * Math.PI, !1),
		t.lineWidth = 1,
		t.fillStyle = '#1884cf',
		t.fill()
	}
	drawLine(t, e) {
		let i = this.p1.toScreen(this.scene)
		  , s = this.p2.toScreen(this.scene);
		t.beginPath(),
		t.lineWidth = Math.max(0.5, 2 * e),
		t.lineCap = 'round',
		t.strokeStyle = "#1884cf80",
		t.moveTo(i.x, i.y);
		for (let n of this.points.map(r => r.toScreen(this.scene))) {
			t.lineTo(n.x, n.y);
		}
		t.lineTo(s.x, s.y),
		t.stroke()
	}
}