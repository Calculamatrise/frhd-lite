export default class {
	color = "#000";
	message = null;
	timeout = false;
	constructor(t) {
		Object.defineProperty(this, 'scene', { value: t, writable: true })
	}
	draw(a) {
		let t = this.message
		  , e = this.timeout
		  , i = this.color
		  , s = this.outline;
		if (e !== !1 && 0 >= e && (t = !1),
		this.scene.state.paused && (i = !1,
		s = !1,
		t = "Paused - Press Spacebar to Continue"),
		i === !1 && (i = this.scene.settings.UITextColor),
		t) {
			let n = this.scene.game
			  , r = this.scene
			  , o = n.pixelRatio
			  , h = r.screen.center.x
			  , l = 100;
			a.save(),
			a.fillStyle = i,
			a.lineWidth = 4 * (o / 2),
			a.font = 12 * o + "pt helsinki",
			a.textAlign = "center",
			s && (a.strokeStyle = s,
			a.strokeText(t, h, l * o)),
			a.fillText(t, h, l * o),
			a.restore()
		}
	}
	show(t, e, i, s) {
		this.hide();
		this.message = t;
		this.timeout = e;
		i && (this.color = i);
		s && (this.outline = s)
	}
	hide() {
		this.message = null,
		this.color = !1,
		this.outline = !1
	}
	update() {
		this.timeout !== !1 && this.timeout--
	}
}