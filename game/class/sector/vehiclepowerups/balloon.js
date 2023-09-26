import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	name = 'balloon';
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , n = t.pos.y - this.y
		  , r = Math.sqrt(Math.pow(s, 2) + Math.pow(n, 2))
		  , h = i._powerupsConsumed.misc
		  , l = this.scene;
		if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
			h.push(this.id);
			let c = this.time * l.settings.drawFPS;
			i.setTempVehicle(this.name.toUpperCase(), c, {
				x: this.x,
				y: this.y
			}, e.dir),
			l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
			l.vehicleTimer.playerAddedTime(i)),
			i.isGhost() === !1 && (this.hit = !0,
			this.sector.powerupCanvasDrawn = !1,
			this.scene.message.show('Balloon Powerup!', 50, '#f02728', !1))
		}
	}
	drawIcon(t, e, i, s) {
		s.save(),
		s.scale(i, i),
		s.translate(0, -0.6),
		s.lineCap = 'round',
		s.lineJoin = 'miter',
		s.miterLimit = 4,
		s.lineWidth = 2,
		s.strokeStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? "#FBFBFB" : this.outline,
		s.save(),
		s.fillStyle = s.strokeStyle,
		s.beginPath(),
		s.roundRect(6, 23, 9, 8, 1),
		s.fill(),
		s.beginPath(),
		s.moveTo(15, 19),
		s.lineTo(12.9375, 24.6875),
		s.stroke(),
		s.translate(7.03125, 21.84375),
		s.scale(-1, 1),
		s.translate(-7.03125, -21.84375),
		s.beginPath(),
		s.moveTo(8.0625, 19),
		s.lineTo(6, 24.6875),
		s.stroke(),
		s.restore(),
		s.save(),
		s.fillStyle = '#f02728',
		s.beginPath(),
		s.arc(10.5, 11.125, 10.5 - s.lineWidth / 2, 0, 2 * Math.PI, !0),
		s.fill(),
		s.stroke(),
		s.restore()
	}
	getCode() {
		return super.getCode() + " 3 " + this.time.toString(32)
	}
	static cache = Object.assign(this.createCache(), {
		width: 22,
		height: 43
	})
}