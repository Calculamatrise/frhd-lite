import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	color = '#94d44e';
	index = 2;
	name = 'truck';
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
			this.scene.message.show("Truck Powerup!", 50, this.color, !1))
		}
	}
	drawIcon(t, e, i, s) {
		let n = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (n = this.settings.physicsLineColor)
		i *= 1,
		s.save(),
		s.scale(i, i),
		s.fillStyle = n,
		s.strokeStyle = n,
		s.save(),
		s.beginPath(),
		s.roundRect(1, 16.5, 6, 10.5, 1.5),
        s.roundRect(18, 16.5, 6, 10.5, 1.5),
		s.fill(),
		s.moveTo(4, 22),
		s.lineTo(21, 22),
        s.lineWidth = 2,
		s.stroke(),
		s.fillStyle = this.color,
		s.beginPath(),
		s.moveTo(23, 10),
		s.bezierCurveTo(23.5, 10.5, 24, 11, 24, 12),
		s.lineTo(24, 18),
		s.bezierCurveTo(23.5, 19, 23.5, 20, 21, 20),
		s.lineTo(3, 20),
		s.bezierCurveTo(2.5, 20, 1.5, 19.5, 1, 18.5),
		s.lineTo(1, 12),
		s.bezierCurveTo(1, 11, 1.5, 10.5, 2, 10),
		s.lineTo(2, 4),
		s.bezierCurveTo(2, 2, 3, 1, 4, 1),
		s.lineTo(21, 1),
		s.bezierCurveTo(22, 1, 23, 2, 23, 3),
        s.closePath(),
		s.fill(),
		s.stroke(),
		s.restore(),
		s.beginPath(),
        s.rect(5.5, 5, 14, 6),
		s.fill(),
		s.stroke(),
		s.beginPath(),
		s.arc(5.5, 15, 1.895, 0, 2 * Math.PI, !0),
		s.arc(19.5, 15, 1.895, 0, 2 * Math.PI, !0),
		s.fill(),
		s.restore()
	}
	static cache = Object.assign(this.createCache(), {
		width: 25,
		height: 28
	})
}