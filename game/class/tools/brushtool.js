import StraightLine from "./straightlinetool.js";

export default class Brush extends StraightLine {
	name = 'brush';
	constructor(t) {
		super(t);
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
		super.reset()
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
		this.recordActionsToToolhandler(),
		super.press();
		if (!this.active) {
			let t = this.mouse.touch.real;
			this.p2.x = t.x,
			this.p2.y = t.y
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
			a = o['add' + ('physics' === this.toolhandler.options.lineType ? 'Physics' : 'Scenery') + 'Line'](e.x, e.y, i.x, i.y),
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
		s = i['add' + ('physics' === this.toolhandler.options.lineType ? 'Physics' : 'Scenery') + 'Line'](t.x, t.y, e.x, e.y),
		s && this.addedObjects.push(s),
		this.recordActionsToToolhandler();
		let n = this.toolhandler
		  , r = n.snapPoint;
		r.x = e.x,
		r.y = e.y,
		this.active = !1
	}
	update() {
		let t = this.toolhandler
		  , e = t.gamepad
		  , i = this.mouse;
		e.isButtonDown("alt") ? i.mousewheel !== !1 && this.adjustTrailSpeed(i.mousewheel) : e.isButtonDown("shift") && i.mousewheel !== !1 && this.adjustBreakLength(i.mousewheel);
		super.update();
		t.options.snap && (this.p2 = i.touch.real)
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
	drawText(t) {
		let e = this.name
		  , i = this.options.breakLength
		  , s = this.options.trailSpeed
		  , n = this.game.pixelRatio;
		t.fillStyle = this.scene.settings.physicsLineColor,
		t.font = 12 * n + "pt arial",
		t.fillText(e, 10 * n, 20 * n),
		t.font = 8 * n + "pt arial",
		s = 0 | s,
		t.fillText("Trail speed : " + s, 10 * n, 40 * n),
		t.fillText("Break length : " + i, 10 * n, 60 * n)
	}
}