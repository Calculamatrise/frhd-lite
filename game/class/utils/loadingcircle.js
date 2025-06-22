export default class {
	scene = null;
	clockwise = !1;
	screen = null;
	settings = {
		radius: 10,
		color: "#1884cf"
	}
	constructor(t) {
		this.scene = t;
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
		  , c = e.height - 25 * s;
		t.beginPath(),
		t.arc(l, c, n * s, 0, o, !this.clockwise),
		t.lineWidth = 3 * s,
		t.strokeStyle = i.color,
		t.stroke()
	}
}