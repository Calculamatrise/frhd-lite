import Cartesian from "../math/cartesian.js";
import Tool from "./tool.js";

export default class Brush extends Tool {
	name = 'brush';
	p1 = null;
	p2 = null;
	active = !1;
	options = null;
	constructor(t) {
		super(t);
		this.p1 = new Cartesian(0, 0);
		this.p2 = new Cartesian(0, 0);
		this.active = !1;
		let e = t.scene.settings.brush;
		this.addedObjects = [],
		this.options = {
			breakLength: e.breakLength,
			maxBreakLength: e.maxBreakLength,
			minBreakLength: e.minBreakLength,
			breakLengthSensitivity: e.breakLengthSensitivity,
			trailSpeed: e.trailSpeed,
			maxTrailSpeed: e.maxTrailSpeed,
			minTrailSpeed: e.minTrailSpeed,
			trailSpeedSensitivity: e.trailSpeedSensitivity
		}
	}
	reset() {
		this.recordActionsToToolhandler(),
		this.active = !1
	}
	recordActionsToToolhandler() {
		var t, e = this.addedObjects, i = e.length;
		if (i)
			for (t = 0; i > t; t++)
				this.toolhandler.addActionToTimeline({
					type: "add",
					objects: [e[t]]
				});
		this.addedObjects = []
	}
	press() {
		if (this.recordActionsToToolhandler(),
		!this.active) {
			let t = this.mouse.touch.real;
			this.p1.x = t.x,
			this.p1.y = t.y,
			this.p2.x = t.x,
			this.p2.y = t.y,
			this.active = !0
		}
	}
	hold() {
		let t = this.mouse.touch.real
		  , e = this.p1
		  , i = this.p2
		  , s = this.options.trailSpeed
		  , n = this.options.breakLength;
		i.inc(t.sub(i).factor(s));
		let r = screen.height + t.sub(i).len();
		if (r *= n,
		i.sub(e).lenSqr() > r) {
			let o = this.scene.track,
				a = !1;
			a = "physics" === this.toolhandler.options.lineType ? o.addPhysicsLine(e.x, e.y, i.x, i.y) : o.addSceneryLine(e.x, e.y, i.x, i.y),
			a && this.addedObjects.push(a),
			e.equ(i),
			this.toolhandler.snapPoint.x = i.x,
			this.toolhandler.snapPoint.y = i.y
		}
		this.toolhandler.moveCameraTowardsMouse()
	}
	release() {
		let t = this.p1
		  , e = this.p2
		  , i = this.scene.track
		  , s = !1;
		s = "physics" === this.toolhandler.options.lineType ? i.addPhysicsLine(t.x, t.y, e.x, e.y) : i.addSceneryLine(t.x, t.y, e.x, e.y),
		s && this.addedObjects.push(s),
		this.recordActionsToToolhandler();
		let n = this.toolhandler
		  , r = n.snapPoint;
		r.x = e.x,
		r.y = e.y,
		this.active = !1
	}
	update() {
		let t = this.toolhandler.gamepad
		  , e = this.mouse;
		t.isButtonDown("alt") ? e.mousewheel !== !1 && this.adjustTrailSpeed(e.mousewheel) : t.isButtonDown("shift") && e.mousewheel !== !1 && this.adjustBreakLength(e.mousewheel);
		let i = this.toolhandler;
		i.options.snap && (this.active = !0,
		this.p1.x = i.snapPoint.x,
		this.p1.y = i.snapPoint.y,
		this.p2.x = e.touch.real.x,
		this.p2.y = e.touch.real.y),
		super.update()
	}
	adjustTrailSpeed(t) {
		let e = this.options.trailSpeed
		  , i = this.options.trailSpeedSensitivity
		  , s = this.options.maxTrailSpeed
		  , n = this.options.minTrailSpeed;
		t > 0 ? (e += i,
		e > s && (e = s)) : (e -= i,
		n > e && (e = n)),
		this.setOption("trailSpeed", e)
	}
	adjustBreakLength(t) {
		let e = this.options.breakLength
		  , i = this.options.breakLengthSensitivity
		  , s = this.options.maxBreakLength
		  , n = this.options.minBreakLength;
		t > 0 ? (e += i,
		e > s && (e = s)) : (e -= i,
		n > e && (e = n)),
		this.setOption("breakLength", e)
	}
	setOption(t, e) {
		this.options[t] = e
	}
	getOptions() {
		let t = this.toolhandler
		  , e = this.options;
		return e.lineType = t.options.lineType,
		e.snap = t.options.snap,
		e
	}
	draw(e) {
		super.draw(e);
		let t = this.scene
		  , i = t.camera
		  , s = i.zoom;
		this.drawCursor(e),
		this.active && (this.drawLine(e, s),
		this.drawPoint(e, this.p1, s),
		this.drawPoint(e, this.p2, s))
	}
	drawText(t) {
		let e = this.name
		  , i = this.options.breakLength
		  , s = this.options.trailSpeed
		  , n = this.game.pixelRatio;
		t.fillStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : '#000',
		t.font = 12 * n + "pt arial",
		t.fillText(e, 10 * n, 20 * n),
		t.font = 8 * n + "pt arial",
		s = 0 | s,
		t.fillText("Trail speed : " + s, 10 * n, 40 * n),
		t.fillText("Break length : " + i, 10 * n, 60 * n)
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
		t.fillStyle = "#1884cf",
		t.fill()
	}
	drawLine(t, e) {
		let n = this.toolhandler
		  , r = n.options.lineType;
		t.beginPath(),
		t.lineWidth = Math.max(0.5, 2 * e),
		t.lineCap = 'round',
		t.strokeStyle = '#'.padEnd(7, 'physics' === r ? /^midnight$/i.test(lite.storage.get('theme')) ? 'C' : /^dark$/i.test(lite.storage.get('theme')) ? 'FB' : '0' : /^midnight$/i.test(lite.storage.get('theme')) ? '8' : /^dark$/i.test(lite.storage.get('theme')) ? '6' : 'A');
		let a = this.p1.toScreen(this.scene)
		  , h = this.p2.toScreen(this.scene);
		t.moveTo(a.x, a.y),
		t.lineTo(h.x, h.y),
		t.stroke()
	}
}