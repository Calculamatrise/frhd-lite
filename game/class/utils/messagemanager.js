export default class {
	color = "#000";
	message = false;
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
		t = 'Paused' + (this.scene.settings.mobile ? '' : " - Press Spacebar to Continue")),
		i === !1 && (i = '#'.padEnd(7, lite.storage.get("theme") == "midnight" ? '8' : /^dark(er)?$/i.test(lite.storage.get("theme")) ? 'c' : '3')),
		t) {
			let n = this.scene.game
			  , r = this.scene
			  , o = n.pixelRatio
			  , h = r.screen.center.x
			  , l = 100
			  , c = r.settings;
			"phone" === c.controls && (l = 80),
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
		this.message = t,
		this.timeout = e,
		this.color = /^#(0|3){3,6}$/.test(i) ? this.scene.settings.physicsLineColor : i,
		this.outline = lite.storage.get('theme') == 'midnight' ? '#1d2328' : lite.storage.get('theme') == 'darker' ? '#000' : lite.storage.get('theme') == 'dark' ? '#1b1b1b' : s
	}
	hide() {
		this.message = !1,
		this.color = !1,
		this.outline = !1
	}
	update() {
		this.timeout !== !1 && this.timeout--
	}
}