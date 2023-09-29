import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	color = '#a784c5';
	name = 'blob';
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
			var c = this.time * l.settings.drawFPS;
			i.setTempVehicle(this.name.toUpperCase(), c, {
				x: this.x,
				y: this.y
			}, e.dir),
			l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
			l.vehicleTimer.playerAddedTime(i)),
			i.isGhost() === !1 && (this.hit = !0,
			this.sector.powerupCanvasDrawn = !1,
			this.scene.message.show('Blob Powerup!', 50, this.color, !1))
		}
	}
	drawIcon(t, e, i, s) {
		i *= 1,
		s.save(),
		s.scale(i, i),
		s.beginPath(),
		s.strokeStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : this.outline,
		s.fillStyle = this.color,
		s.lineWidth = 2,
		s.roundRect(1, 1, 22, 22, 3.5),
		s.fill(),
		s.stroke()
		s.restore()
	}
	getCode() {
		return super.getCode() + ' 4 ' + this.time.toString(32)
	}
	static cache = this.createCache()
}