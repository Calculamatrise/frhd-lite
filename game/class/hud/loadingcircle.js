export default class {
	clockwise = !1;
	screen = null;
	settings = {
		radius: 10,
		color: "#1884cf"
	};
	constructor(t) {
		Object.defineProperty(this, 'scene', { value: t, writable: true });
		this.screen = t.screen
	}

	draw(t) {
		let e = this.screen
		  , i = this.settings
		  , s = this.scene.game.pixelRatio
		  , n = i.radius
		  , o = (performance.now() / 60) % 30 / 30 * 2 * Math.PI;
		0 === o && (this.clockwise = !this.clockwise);
		let l = e.width - 25 * s
		  , c = e.height - 25 * s - this.scene.settings.inset.bottom;
		t.beginPath(),
		t.arc(l, c, n * s, 0, o, !this.clockwise),
		t.lineWidth = 3 * s,
		t.strokeStyle = i.color,
		t.stroke()
	}
}