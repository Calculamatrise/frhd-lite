import i from "../math/cartesian.js";
import s from "../math/curvedivision.js";
import StraightLine from "./straightlinetool.js";

export default class Curve extends StraightLine {
	name = 'curve';
	midpoint = new i;
	anchoring = !1;
	controlPoints = [];
	options = {
		breakLength: .2,
		breakLengthSensitivity: .1,
		controlPoints: 1,
		maxBreakLength: 3,
		minBreakLength: .02
	};
	getControlPoints(limit) {
		let controlPoints = Array.from(this.controlPoints);
		controlPoints.length < this.options.controlPoints && controlPoints.push(...Array.from({ length: limit ?? (this.options.controlPoints - controlPoints.length) }, () => this.midpoint.factor(1)));
		return controlPoints
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
		  , i = this.midpoint;
		if (this.anchoring) {
			// also check if the midpoint is on the line -- straight line
			if (i.x === e.x && i.y === e.y) {
				super.release()
			} else if (this.options.controlPoints > this.controlPoints.length + 1) {
				this.controlPoints.push(this.midpoint.factor(1));
				return;
			} else
				this.splitAndAddCurve();
			this.reset()
		} else {
			let h = e.x - t.x
			  , l = e.y - t.y
			  , c = Math.sqrt(h ** 2 + l ** 2);
			c > 0 ? this.anchoring = !0 : this.active = !1
		}
	}
	reset() {
		super.reset(),
		this.anchoring = !1,
		this.controlPoints.splice(0)
	}
	updateAnchor() {
		let t = this.mouse.touch.real;
		this.midpoint.x = t.x,
		this.midpoint.y = t.y;
		if (window.hasOwnProperty('lite') && lite.storage.get('preciseEditorTools')) {
			if (this.options.controlPoints > 1) {
				// let last = this.controlPoints.at(-1) || this.p1;
				// last = this.p1.add(last).factor(1 / 2);
				// let midpoint = last.add(this.p2).factor(1 / 2);
				// this.midpoint.inc(this.midpoint.sub(midpoint))
				return;
			}
			let midpoint = this.p1.add(this.p2).factor(1 / 2);
			this.midpoint.inc(this.midpoint.sub(midpoint))
		}
	}
	splitAndAddCurve() {
		for (var t = s(this.p1, ...this.getControlPoints(), this.p2, this.getOptions()), e = this.scene.track, i = t.length, n = this.toolhandler, r = [], o = 0; i - 2 > o; o += 2) {
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
		let t = this.mouse
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
		t.mousewheel !== !1 && (s.isButtonDown("shift") === !1 ? this.mousewheel(t.mousewheel) : this.adjustBreakLength(t.mousewheel))
	}
	drawPoint(t, e, i) {
		let s = e.toScreen(this.scene)
		  , n = this.getControlPoints(1).concat(this.p2);
		n.unshift(this.p1);
		let a = n.reduce((sum, point, i) => sum += point.delta(n[(i < 1 ? n.length : i) - 1]), 0) / n.length;
		t.beginPath(),
		t.arc(s.x, s.y, 1 * i, 0, 2 * Math.PI, !1),
		t.lineWidth = 1,
		t.fillStyle = a < 2 ? '#cc4444' : '#1884cf',
		t.fill()
	}
	drawLine(t, e) {
		let n = this.toolhandler
		  , r = n.options.lineType
		  , p = this.getControlPoints(1).concat(this.p2);
		p.unshift(this.p1);
		let q = p.reduce((sum, point, i) => sum += point.delta(p[(i < 1 ? p.length : i) - 1]), 0) / p.length;
		t.beginPath(),
		t.lineWidth = Math.max(.5, 2 * e),
		t.lineCap = 'round',
		t.strokeStyle = q < 2 ? '#cc4444' : this.scene.settings[r + 'LineColor'];
		let a = this.p1.toScreen(this.scene)
		  , h = this.p2.toScreen(this.scene)
		  , l = this.midpoint.toScreen(this.scene);
		t.moveTo(a.x, a.y);
		if (this.options.controlPoints > 1) {
			let q = s(a, ...this.getControlPoints().map(t => t.toScreen(this.scene)), h, this.getOptions());
			for (let i = 0; i < q.length; i += 2) {
				t.lineTo(Math.floor(q[i]), Math.floor(q[i + 1]));
			}
		} else
			t.quadraticCurveTo(l.x, l.y, h.x, h.y);
		// for (let i = 0; i < q.length; i += 2) {
		// 	t.lineTo(Math.floor(q[i]), Math.floor(q[i + 1]));
		// }
		t.stroke()
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
}