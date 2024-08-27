import Tool from "./tool.js";
import Cartesian from "../math/cartesian.js";

export default class StraightLine extends Tool {
	active = !1;
	name = 'straightline';
	options = {};
	p1 = new Cartesian;
	p2 = new Cartesian;
	shouldDrawMetadata = !1;
	reset() {
		this.active = !1
	}
	press() {
		if (!this.active) {
			let t = this.mouse.touch.real;
			this.p1.x = t.x,
			this.p1.y = t.y,
			this.active = !0
		}
	}
	getOptions() {
		let t = this.toolhandler
		  , e = this.options;
		return e.lineType = t.options.lineType,
		e.snap = t.options.snap,
		e
	}
	hold() {
		let t = this.mouse.touch.real;
		this.p2.x = t.x,
		this.p2.y = t.y,
		this.toolhandler.moveCameraTowardsMouse()
	}
	release() {
		let t = this.p1
		  , e = this.p2
		  , i = this.scene.track
		  , s = this.toolhandler
		  , n = !1;
		n = i['add' + ("physics" === s.options.lineType ? 'Physics' : 'Scenery') + 'Line'](t.x, t.y, e.x, e.y),
		n && s.addActionToTimeline({
			type: "add",
			objects: [n]
		});
		let r = s.snapPoint;
		r.x = e.x,
		r.y = e.y,
		this.reset()
	}
	update() {
		super.update();
		let t = this.toolhandler
		  , e = t.gamepad;
		t.options.snap && (this.active = !0,
		this.p1 = t.snapPoint,
		this.hold()),
		this.shouldDrawMetadata = e.isButtonDown("ctrl")
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
		this.drawPoint(e, this.p2, s),
		this.shouldDrawMetadata && this.drawPointData(e, this.p2, s)),
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
		let s = e.toScreen(this.scene)
		  , n = this.p2.delta(this.p1);
		t.beginPath(),
		t.arc(s.x, s.y, 1 * i, 0, 2 * Math.PI, !1),
		t.lineWidth = 1,
		t.fillStyle = n < 2 ? '#cc4444' : '#1884cf',
		t.fill()
	}
	drawPointData(t, e) {
		let i = e.toScreen(this.scene)
		  , s = this.p1.getAngleInDegrees(this.p2).toFixed(2)
		  , n = this.game.pixelRatio;
		t.fillStyle = this.scene.settings.physicsLineColor,
		t.strokeStyle = this.scene.settings.physicsLineColor,
		t.font = 8 * n + "pt arial",
		t.fillText(s + "°", i.x + 10, i.y + 10),
		t.strokeText(s + "°", i.x + 10, i.y + 10)
	}
	drawLine(t, e) {
		let n = this.toolhandler
		  , r = n.options.lineType
		  , a = this.p1.toScreen(this.scene)
		  , h = this.p2.toScreen(this.scene)
		  , q = this.p2.delta(this.p1);
		t.beginPath(),
		t.lineWidth = Math.max(0.5, 2 * e),
		t.lineCap = 'round',
		t.strokeStyle = q < 2 ? '#cc4444' : this.scene.settings[r + 'LineColor'],
		t.moveTo(a.x, a.y),
		t.lineTo(h.x, h.y),
		t.stroke()
	}
}