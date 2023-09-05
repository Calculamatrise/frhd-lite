export default class ForwardCap extends GameInventoryManager.HeadClass {
	drawAngle = 0;
	constructor(t) {
		super();
		this.colors = t;
		this.createVersion();
	}
	cache(t) {
		let e = this.versions[this.versionName];
		e.dirty = !1;
		let p = this.getScale()
		t = Math.max(t, 1)
		let i = this.getBaseWidth() * t * p
		  , s = this.getBaseHeight() * t * p
		  , h = e.canvas;
		h.width = i,
		h.height = s;
		var l = h.getContext('2d')
		  , d = p * t
		  , f = this.colors
		  , r = Math.PI / 12;
		l.scale(d, d),
		l.translate(0, 0),
		l.strokeStyle = f.outline || lite.storage.get('theme') === 'dark' ? "#FBFBFB" : "rgba(0,0,0,1)",
		l.lineCap = 'round',
		l.lineJoin = 'miter',
		l.lineWidth = 7,
		l.miterLimit = 4,
		l.fillStyle = f.skin || "#ffffff",
		l.save(),
		l.beginPath(),
		l.arc(42.4, 52.5, 30.3 + l.lineWidth / 2, 0, 2 * Math.PI, !0),
		l.fill(),
		l.stroke(),
		l.beginPath(),
		l.arc(42.4, 52.5, 30.3, 0, 2 * Math.PI, !0),
		l.clip(),
		l.fillStyle = f.back,
		l.beginPath(),
		l.arc(42.4, 52.5, 30.3, -r, Math.PI - r, !0),
		l.fill(),
		f.front && (l.beginPath(),
		l.arc(42.4, 52.5, 30.3, -r, r - Math.PI / 1.75, !0),
		l.lineTo(52.501, 44.894999999999996),
		l.fillStyle = f.front,
		l.fill()),
		l.restore(),

		l.beginPath(),
		l.arc(42.4, 52.5, 30.3 + l.lineWidth / 2, -Math.PI - r, Math.PI - r, !0),
		l.stroke(),
		// l.lineWidth = 12,
		// l.lineTo(111, 36),
		// l.stroke(),

		l.save(),
		l.lineWidth = 12,
		l.beginPath(),
		l.moveTo(16.3, 60),
		l.lineTo(103.5, 36.5),
		l.stroke()
	}
	setDirty() {
		this.versions[this.versionName].dirty = !0
	}
	getBaseWidth() {
		return 115
	}
	getBaseHeight() {
		return 112
	}
	getDrawOffsetX() {
		return 2.2
	}
	getDrawOffsetY() {
		return 1
	}
	getScale() {
		return .17
	}
}

GameInventoryManager && GameInventoryManager.register("forward_cap", ForwardCap);