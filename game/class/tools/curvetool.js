import i from "../math/cartesian.js";
import s from "../math/curvedivision.js";
import StraightLine from "./straightlinetool.js";

export default class Curve extends StraightLine {
	name = 'curve';
	midpoint = new i;
	anchoring = !1;
	reset() {
		super.reset(),
		this.anchoring = !1
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
		let controlPoint = this.midpoint;
		if (window.hasOwnProperty('lite') && lite.storage.get('preciseEditorTools')) {
			let midpoint = this.p1.add(this.p2).factor(1 / 2);
			controlPoint = this.midpoint.add(this.midpoint.sub(midpoint));
		}
		for (var t = s(this.p1, controlPoint, this.p2, this.toolhandler.tools.brush.getOptions()), e = this.scene.track, i = t.length, n = this.toolhandler, r = [], o = 0; i - 2 > o; o += 2) {
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
	drawPoint(t, e, i) {
		let s = e.toScreen(this.scene)
		  , n = this.p2.delta(this.p1); // check length of curve
		t.beginPath(),
		t.arc(s.x, s.y, 1 * i, 0, 2 * Math.PI, !1),
		t.lineWidth = 1,
		t.fillStyle = n < 2 ? '#cc4444' : '#1884cf',
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
		if (window.hasOwnProperty('lite') && lite.storage.get('preciseEditorTools')) {
			let midpoint = this.p1.add(this.p2).factor(1 / 2);
			l = this.midpoint.add(this.midpoint.sub(midpoint)).toScreen(this.scene);
		}
		t.moveTo(a.x, a.y),
		t.quadraticCurveTo(l.x, l.y, h.x, h.y),
		// for (let i = 0; i < q.length; i += 2) {
		// 	t.lineTo(Math.floor(q[i]), Math.floor(q[i + 1]));
		// }
		t.stroke()
	}
}