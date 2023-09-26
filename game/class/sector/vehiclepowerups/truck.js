import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
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
			this.scene.message.show("Truck Powerup!", 50, "#94d44e", !1))
		}
	}
	drawIcon(t, e, i, s) {
		i *= 1,
		s.save(),
		s.scale(i, i),
		s.lineCap = 'butt',
		s.lineJoin = 'miter',
		s.miterLimit = 4,
		s.lineWidth = 1,
		s.fillStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? "#FBFBFB" : this.outline,
		s.strokeStyle = s.fillStyle,
		s.translate(0.5, -2),
		s.save(),
		s.beginPath(),
		s.roundRect(0, 17, 6, 11, 1.5 * i),
        s.roundRect(18, 17, 6, 11, 1.5 * i),
		s.fill(),
		s.stroke(),
		s.restore(),
		s.save(),
		s.lineWidth = 2,
		s.lineCap = 'square',
		s.beginPath(),
		s.moveTo(3.5, 23),
		s.lineTo(20.5, 23),
		s.fill(),
		s.stroke(),
		s.restore(),
		s.save(),
		s.fillStyle = '#94d44e',
		s.beginPath(),
		s.moveTo(23, 11.2672237),
		s.bezierCurveTo(23.5979157, 11.6115707, 24, 12.2552568, 24, 12.999615),
		s.lineTo(24, 19.000385),
		s.bezierCurveTo(24, 20.1047419, 23.1029738, 21, 21.9950534, 21),
		s.lineTo(2.00494659, 21),
		s.bezierCurveTo(.897645164, 21, 0, 20.1125667, 0, 19.000385),
		s.lineTo(0, 12.999615),
		s.bezierCurveTo(0, 12.2603805, .401930294, 11.6148368, 1, 11.268783),
		s.lineTo(1, 3.99742191),
		s.bezierCurveTo(1, 2.89427625, 1.88967395, 2, 2.991155, 2),
		s.lineTo(21.008845, 2),
		s.bezierCurveTo(22.1085295, 2, 23, 2.89092539, 23, 3.99742191),
		s.lineTo(23, 11.2672237),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.restore(),
		s.save(),
		s.lineWidth = 2,
		s.beginPath(),
		s.moveTo(22.5009348, 12.1337882),
		s.lineTo(22, 11.8452936),
		s.lineTo(22, 3.99742191),
		s.bezierCurveTo(22, 3.44392402, 21.5569554, 3, 21.008845, 3),
		s.lineTo(2.991155, 3),
		s.bezierCurveTo(2.44342393, 3, 2, 3.44509694, 2, 3.99742191),
		s.lineTo(2, 11.8455),
		s.lineTo(1.50082265, 12.1343329),
		s.bezierCurveTo(1.19247839, 12.3127464, 1, 12.6390115, 1, 12.999615),
		s.lineTo(1, 19.000385),
		s.bezierCurveTo(1, 19.5563739, 1.44601448, 20, 2.00494659, 20),
		s.lineTo(21.9950534, 20),
		s.bezierCurveTo(22.5510229, 20, 23, 19.5521213, 23, 19.000385),
		s.lineTo(23, 12.999615),
		s.bezierCurveTo(23, 12.6352349, 22.8086914, 12.311029, 22.5009348, 12.1337882),
		s.closePath(),
		s.stroke(),
		s.restore(),
		s.beginPath(),
		s.moveTo(5, 6),
		s.lineTo(19, 6),
		s.lineTo(19, 12),
		s.lineTo(5, 12),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.beginPath(),
		s.arc(5.03571429, 16.0357143, 1.39285714, 0, 2 * Math.PI, !0),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.beginPath(),
		s.arc(18.9642857, 16.0357143, 1.39285714, 0, 2 * Math.PI, !0),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.restore()
	}
	getCode() {
		return super.getCode() + ' 2 ' + this.time.toString(32)
	}
	static cache = this.createCache()
}