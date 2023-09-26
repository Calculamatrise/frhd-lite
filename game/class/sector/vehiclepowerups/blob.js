import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	name = 'blob';
	collide(t) {
		var e = t.parent
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
			this.scene.message.show('Blob Powerup!', 50, '#A784C5', !1))
		}
	}
	getCode() {
		return super.getCode() + ' 4 ' + this.time.toString(32)
	}
	drawIcon(t, e, i, s) {
		i *= 1,
		s.lineCap = 'butt',
		s.lineJoin = 'miter',
		s.miterLimit = 4 * i,
		s.save(),
		s.scale(i, i),
        s.beginPath(),
        s.strokeStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : this.outline,
        s.fillStyle = '#a784c5',
        s.lineWidth = 2,
        s.roundRect(1, 1, 22, 20, 3.5),
        s.fill(),
        s.stroke()
		s.restore()
	}
	static cache = this.createCache()
}