export default class {
	scene = null;
	clockwise = !1;
	screen = null;
	settings = null;
	constructor(t) {
		this.scene = t;
		this.screen = t.screen;
		this.settings = {
			radius: 10,
			color: "#1884cf"
		}
	}
	draw(t) {
		let e = this.screen
		  , i = this.settings
		  , s = this.scene.game.pixelRatio
		  , n = i.radius
		  , o = this.scene.game._updates % 25 / 25 * 2 * Math.PI;
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