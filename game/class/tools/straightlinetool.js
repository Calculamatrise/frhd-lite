import Cartesian from "../math/cartesian.js";
import Tool from "./tool.js";

export default class StraightLine extends Tool {
	name = 'straightline';
	p1 = null;
	p2 = null;
	active = !1;
	constructor(t) {
		super(t);
		this.p1 = new Cartesian(0, 0);
		this.p2 = new Cartesian(0, 0);
		this.active = !1;
		this.shouldDrawMetadata = !1;
		this.options = {};
	}
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
		n = "physics" === s.options.lineType ? i.addPhysicsLine(t.x, t.y, e.x, e.y) : i.addSceneryLine(t.x, t.y, e.x, e.y),
		n && s.addActionToTimeline({
			type: "add",
			objects: [n]
		});
		let r = s.snapPoint;
		r.x = e.x,
		r.y = e.y,
		this.active = !1
	}
	update() {
		super.update();
		let t = this.toolhandler
		  , e = t.gamepad;
		t.options.snap && (this.active = !0,
		this.p1 = t.snapPoint,
		this.hold()),
		this.shouldDrawMetadata = e.isButtonDown("ctrl") ? !0 : !1
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
		this.drawPointData(e, this.p2, s)),
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
			t.closePath(),
			t.stroke()
		} else
			t.lineWidth = 1,
			t.fillStyle = o,
			t.arc(i.x, i.y, 1 * s, 0, 2 * Math.PI, !1),
			t.closePath(),
			t.fill()
	}
	drawPoint(t, e, i) {
		let s = e.toScreen(this.scene);
		t.beginPath(),
		t.arc(s.x, s.y, 1 * i, 0, 2 * Math.PI, !1),
		t.lineWidth = 1,
		t.fillStyle = "#1884cf",
		t.fill()
	}
	drawPointData(t, e) {
		let i = e.toScreen(this.scene);
		if (this.shouldDrawMetadata) {
			let s = this.p1.getAngleInDegrees(this.p2);
			s = s.toFixed(2);
			let n = this.game.pixelRatio;
			t.fillStyle = /^midnight$/.test(lite.storage.get('theme')) ? 'C' : /^dark(er)?$/i.test(lite.storage.get('theme')) ? 'FB' : '0',
			t.font = 8 * n + "pt arial",
			t.fillText(s + "°", i.x + 10, i.y + 10),
			t.strokeText(s + "°", i.x + 10, i.y + 10)
		}
	}
	drawLine(t, e) {
		let n = this.toolhandler
		  , r = n.options.lineType;
		t.beginPath(),
		t.lineWidth = Math.max(.5, 2 * e),
		t.lineCap = 'round',
		t.strokeStyle = '#'.padEnd(7, 'physics' === r ? /^midnight$/.test(lite.storage.get('theme')) ? 'C' : /^dark(er)?$/i.test(lite.storage.get('theme')) ? 'FD' : '0' : /^(darker|midnight)$/.test(lite.storage.get('theme')) ? '8' : /^dark$/i.test(lite.storage.get('theme')) ? '6' : 'A');
		let a = this.p1.toScreen(this.scene)
		  , h = this.p2.toScreen(this.scene);
		t.moveTo(a.x, a.y),
		t.lineTo(h.x, h.y),
		t.stroke()
	}
}