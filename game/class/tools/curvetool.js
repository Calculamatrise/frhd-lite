import i from "../math/cartesian.js";
import s from "../math/curvedivision.js";
import Tool from "./tool.js";

export default class Curve extends Tool {
	name = 'curve';
	active = !1;
	p1 = null;
	p2 = null;
	midpoint = null;
	anchoring = !1;
	options = null;
	constructor(t) {
		super(t);
		this.p1 = new i(0, 0);
		this.p2 = new i(0, 0);
		this.midpoint = new i(0, 0);
		this.active = !1;
		this.options = {};
	}
	getOptions() {
		let t = this.toolhandler
		  , e = this.options;
		return e.lineType = t.options.lineType,
		e.snap = t.options.snap,
		e
	}
	reset() {
		this.active = !1,
		this.anchoring = !1
	}
	press() {
		if (!this.active) {
			this.active = !0;
			var t = this.mouse.touch.real;
			this.p1.x = t.x,
			this.p1.y = t.y
		}
	}
	hold() {
		let t = this.mouse.touch.real;
		this.p2.x = t.x,
		this.p2.y = t.y;
		let e = this.p1
		  , i = this.p2;
		this.midpoint.x = (e.x + i.x) / 2,
		this.midpoint.y = (e.y + i.y) / 2,
		this.toolhandler.moveCameraTowardsMouse()
	}
	release() {
		let t = this.p1
		  , e = this.p2
		  , i = this.midpoint
		  , s = this.toolhandler;
		if (this.anchoring) {
			if (i.x === e.x && i.y === e.y) {
				var n = this.scene.track
					, a = !1;
				a = n['add' + ('physics' === s.options.lineType ? 'Physics' : 'Scenery') + 'Line'](t.x, t.y, e.x, e.y),
				a && s.addActionToTimeline({
					type: 'add',
					objects: [a]
				}),
				s.snapPoint.x = e.x,
				s.snapPoint.y = e.y
			} else
				this.splitAndAddCurve();
			this.anchoring = !1,
			this.active = !1
		} else {
			var h = e.x - t.x
				, l = e.y - t.y
				, c = Math.sqrt(Math.pow(h, 2) + Math.pow(l, 2));
			c > 0 ? this.anchoring = !0 : this.active = !1
		}
	}
	updateAnchor() {
		let t = this.mouse.touch.real;
		this.midpoint.x = t.x,
		this.midpoint.y = t.y
	}
	splitAndAddCurve() {
		for (var t = s(this.p1, this.midpoint, this.p2), e = this.scene.track, i = t.length, n = this.toolhandler, r = [], o = 0; i - 2 > o; o += 2) {
			let a = t[o]
			  , h = t[o + 1]
			  , l = t[o + 2]
			  , c = t[o + 3]
			  , u = e['add' + ('physics' === n.options.lineType ? 'Physics' : 'Scenery') + 'Line'](a, h, l, c);
			u && r.push(u),
			n.snapPoint.x = l,
			n.snapPoint.y = c
		}
		r.length > 0 && n.addActionToTimeline({
			type: 'add',
			objects: r
		})
	}
	update() {
		var t = this.mouse
			, e = t.touch
			, i = t.secondaryTouch
			, s = this.toolhandler.gamepad
			, n = this.toolhandler;
		n.options.snap && (this.active = !0,
		this.p1 = n.snapPoint,
		this.anchoring || this.hold());
		var r = this.toolhandler.options
		  , o = s.isButtonDown("shift");
		r.rightClickMove && (o = i.old.down),
		o ? (e.old.down || r.rightClickMove) && this.moveCamera() : (e.press && !this.anchoring && this.press(),
		e.old.down && !this.anchoring && this.hold(),
		e.release && this.release(),
		this.anchoring && this.updateAnchor()),
		t.mousewheel !== !1 && s.isButtonDown("shift") === !1 && this.mousewheel(t.mousewheel)
	}
	draw(e) {
		super.draw(e);
		let t = this.scene
		  , i = t.camera
		  , s = i.zoom;
		this.drawCursor(e, s),
		this.active && (this.drawLine(e, s),
		this.drawPoint(e, this.p1, s),
		this.drawPoint(e, this.p2, s))
	}
	toScreen(t, e) {
		let i = this.scene.camera
		  , s = this.scene.screen;
		return (t - i.position[e]) * i.zoom + s.center[e]
	}
	drawCursor(t, e) {
		var i = this.mouse.touch
		  , s = i.real.toScreen(this.scene)
		  , n = this.toolhandler
		  , r = n.options.grid
		  , o = "#1884cf";
		t.beginPath();
		if (r) {
			let a = 5 * e;
			t.moveTo(s.x, s.y - a),
			t.lineTo(s.x, s.y + a),
			t.moveTo(s.x - a, s.y),
			t.lineTo(s.x + a, s.y),
			t.lineWidth = 1 * e,
			t.stroke()
		} else
			t.arc(s.x, s.y, 1 * e, 0, 2 * Math.PI, !1),
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
	drawText(t) {
		let e = this.name
		  , i = this.game.pixelRatio;
		t.fillStyle = /^(dark|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : '#000',
		t.font = 12 * i + "pt arial",
		t.fillText(e, 10 * i, 20 * i),
		t.font = 8 * i + "pt arial"
	}
	drawLine(t, e) {
		let n = this.toolhandler
		  , r = n.options.lineType;
		t.beginPath(),
		t.lineWidth = Math.max(.5, 2 * e),
		t.lineCap = 'round',
		t.strokeStyle = '#'.padEnd(7, 'physics' === r ? /^midnight$/i.test(lite.storage.get('theme')) ? 'C' : /^dark$/i.test(lite.storage.get('theme')) ? 'FB' : '0' : /^midnight$/i.test(lite.storage.get('theme')) ? '8' : /^dark$/i.test(lite.storage.get('theme')) ? '6' : 'A');
		let a = this.p1.toScreen(this.scene)
		  , h = this.p2.toScreen(this.scene)
		  , l = this.midpoint.toScreen(this.scene);
		t.moveTo(a.x, a.y),
		t.quadraticCurveTo(l.x, l.y, h.x, h.y),
		t.stroke()
	}
}