export default class ForwardCap extends GameInventoryManager.HeadClass {
	drawAngle = 0;
	constructor(t) {
		super(),
		this.colors = t,
		this.createVersion()
	}
	cache(t) {
		let e = this.versions[this.versionName]
		  , h = e.canvas
		  , d = this.getScale() * Math.max(t, 1);
		e.dirty = !1;
		h.width = this.getBaseWidth() * d,
		h.height = this.getBaseHeight() * d;
		let l = h.getContext('2d')
		  , f = this.colors
		  , r = Math.PI / 12;
		l.scale(d, d),
		l.strokeStyle = f.outline || window.lite && lite.storage.get('theme').startsWith('dark') ? 'hsl(0, 0%, 98%)' : lite.storage.get('theme') === 'midnight' ? 'hsl(0, 0%, 80%)' : GameInventoryManager.HeadClass.Defaults.Outline,
		l.lineCap = 'round',
		l.lineJoin = 'miter',
		l.lineWidth = 7,
		l.miterLimit = 4,
		l.fillStyle = f.skin || window.lite && lite.storage.get('theme') === 'darker' ? 'hsl(231, 16%, 8%)' : lite.storage.get('theme') === 'dark' ? 'hsl(0, 0%, 11%)' : lite.storage.get('theme') === 'midnight' ? 'hsl(207, 16%, 14%)' : GameInventoryManager.HeadClass.Defaults.Skin,
		l.save(),
		l.beginPath(),
		l.arc(42.4, 52.5, 30.3 + l.lineWidth / 2, 0, 2 * Math.PI, !0),
		l.fill(),
		l.stroke(),
		l.clip(),
		l.beginPath(),
		l.arc(42.4, 52.5, 30.3, -r, Math.PI - r, !0),
		l.fillStyle = f.back,
		l.fill(),
		f.front && (l.beginPath(),
		l.arc(42.4, 52.5, 30.3, -r, r - Math.PI / 1.75, !0),
		l.lineTo(52.501, 44.894999999999996),
		l.fillStyle = f.front,
		l.fill()),
		l.restore(),
		l.lineWidth = 12,
		l.beginPath(),
		l.moveTo(16.3, 60),
		l.lineTo(103.5, 36.5),
		l.stroke()
	}
	getBaseWidth() { return 115 }
	getBaseHeight() { return 112 }
	getDrawOffsetX() { return 2.2 }
	getDrawOffsetY() { return 1 }
	getScale() { return .17 }
}

GameInventoryManager && GameInventoryManager.register('forward_cap', ForwardCap);