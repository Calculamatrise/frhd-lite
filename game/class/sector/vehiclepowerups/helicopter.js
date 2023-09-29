import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	color = '#f59423';
	index = 1;
	name = 'helicopter';
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
			i.setTempVehicle('HELI', c, {
				x: this.x,
				y: this.y
			}, e.dir),
			l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
			l.vehicleTimer.playerAddedTime(i)),
			i.isGhost() === !1 && (this.hit = !0,
			this.sector.powerupCanvasDrawn = !1,
			this.scene.message.show('Helicopter Powerup!', 50, '#F2902E', !1))
		}
	}
	drawIcon(t, e, i, s) {
		let n = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (n = this.settings.physicsLineColor)
		i *= 1,
		s.save(),
		s.scale(i, i),
		s.lineCap = 'butt',
		s.lineJoin = 'miter',
		s.miterLimit = 4,
		s.strokeStyle = n;
		s.fillStyle = n,
		s.beginPath(),
		s.moveTo(15, 4.5),
		s.lineTo(15, 2.5),
		s.bezierCurveTo(15, 1.4, 14.1, .5, 13, .5),
		s.bezierCurveTo(11.9, .5, 11, 1.4, 11, 2.5),
		s.lineTo(11, 4.5),
		s.bezierCurveTo(11, 5.6, 11.9, 6.5, 13, 6.5),
		s.bezierCurveTo(14.1, 6.5, 15, 5.6, 15, 4.5),
		s.lineTo(15, 4.5),
		s.closePath(),
		s.fill(),
		s.beginPath(),
		s.lineCap = 'round',
		s.lineWidth = 2,
		s.moveTo(1, 3),
		s.lineTo(25, 3),
		s.stroke(),
		s.lineCap = 'butt',
		s.lineWidth = 1,
		s.beginPath(),
		s.moveTo(6.1, 26.9),
		s.lineTo(4.1, 31.9),
		s.bezierCurveTo(3.8, 32.7, 4.2, 33.6, 4.9, 33.9),
		s.bezierCurveTo(5.7, 34.2, 6.6, 33.8, 6.9, 33),
		s.lineTo(8.9, 28),
		s.bezierCurveTo(9.2, 27.3, 8.8, 26.4, 8, 26.1),
		s.bezierCurveTo(7.3, 25.8, 6.4, 26.1, 6.1, 26.9),
		s.lineTo(6.1, 26.9),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.beginPath(),
		s.moveTo(17, 28),
		s.lineTo(19, 33),
		s.bezierCurveTo(19.4, 33.8, 20.3, 34.2, 21, 33.9),
		s.bezierCurveTo(21.8, 33.6, 22.2, 32.7, 21.9, 31.9),
		s.lineTo(19.9, 26.9),
		s.bezierCurveTo(19.6, 26.2, 18.7, 25.8, 17.9, 26.1),
		s.bezierCurveTo(17.2, 26.4, 16.8, 27.3, 17.1, 28),
		s.lineTo(17, 28),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.fillStyle = this.color,
		s.lineWidth = 2,
		s.beginPath(),
		s.arc(13, 17, 11, 0, 2 * Math.PI, !0),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.fillStyle = n,
		s.beginPath(),
		s.moveTo(21, 17),
		s.bezierCurveTo(21, 12.6, 17.4, 9, 13, 9),
		s.bezierCurveTo(8.6, 9, 5, 12.6, 5, 17),
		s.lineTo(21, 17),
		s.closePath(),
		s.fill(),
		s.restore()
	}
	static cache = Object.assign(this.createCache(), {
		width: 26,
		height: 35
	})
}