import Powerup from "../powerup.js";

export default class extends Powerup {
	color = '#d12929';
	hit = !1;
	name = 'bomb';
	prefix = 'O';
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , n = t.pos.y - this.y
		  , a = Math.sqrt(s ** 2 + n ** 2);
		20 > a && i.isAlive() && (e.explode(),
		i.isGhost() === !1 && (this.hit = !0,
		this.sector.powerupCanvasDrawn = !1))
	}
	draw(...t) {
		this.hit || super.draw(...t)
	}
	drawPowerup(t, e) {
		e *= this.constructor.cache.scale,
		t.beginPath(),
		t.moveTo(53 * e, 105 * e),
		t.lineTo(41.5 * e, 115 * e),
		t.lineTo(43 * e, 100 * e),
		t.bezierCurveTo(35.5 * e, 95 * e, 30 * e, 88.5 * e, 26.5 * e, 80 * e),
		t.lineTo(11 * e, 78 * e),
		t.lineTo(24 * e, 69.5 * e),
		t.bezierCurveTo(24 * e, 68 * e, 24 * e, 67 * e, 24 * e, 66 * e),
		t.bezierCurveTo(24 * e, 58.5 * e, 26 * e, 51 * e, 30 * e, 45 * e),
		t.lineTo(22 * e, 31.5 * e),
		t.lineTo(37.5 * e, 36 * e),
		t.bezierCurveTo(43.5 * e, 31 * e, 51 * e, 27.5 * e, 60 * e, 26 * e),
		t.lineTo(66 * e, 11 * e),
		t.lineTo(72 * e, 26.5 * e),
		t.bezierCurveTo(80.5 * e, 27.5 * e, 88 * e, 31 * e, 93.5 * e, 36.5 * e),
		t.lineTo(110 * e, 31.5 * e),
		t.lineTo(101.5 * e, 46 * e),
		t.bezierCurveTo(105 * e, 52 * e, 107 * e, 59 * e, 107 * e, 66 * e),
		t.bezierCurveTo(107 * e, 67 * e, 107 * e, 68 * e, 107 * e, 69 * e),
		t.lineTo(121 * e, 78 * e),
		t.lineTo(104.5 * e, 80.5 * e),
		t.bezierCurveTo(101.5 * e, 88 * e, 96 * e, 95 * e, 89 * e, 99.5 * e),
		t.lineTo(90.5 * e, 115 * e),
		t.lineTo(78.5 * e, 104.5 * e),
		t.bezierCurveTo(74.5 * e, 106 * e, 70 * e, 107 * e, 65.5 * e, 107 * e),
		t.bezierCurveTo(61 * e, 107 * e, 57 * e, 106 * e, 53 * e, 105 * e),
		t.lineTo(53 * e, 105 * e),
		t.closePath(),
		t.fill(),
		t.stroke(),
		t.beginPath(),
		t.arc(66 * e, 66 * e, 40 * e, 0 * e, 2 * Math.PI, !0);
		t.save(),
		t.lineWidth = 2 * e,
		t.save(),
		t.fillStyle = this.color,
		t.fill(),
		t.stroke(),
		t.restore(),
		t.beginPath(),
		t.arc(66 * e, 66 * e, 8 * e, 0 * e, 2 * Math.PI, !0),
		t.fill(),
		t.stroke(),
		t.restore()
	}
	updateCache(t, e) {
		super.updateCache(t, e);
		let i = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (i = this.settings.physicsLineColor),
		t.fillStyle = i,
		t.strokeStyle = i,
		t.lineWidth = 8 * e * this.constructor.cache.scale
	}
	static cache = this.createCache({
		width: 26,
		height: 26,
		scale: .2
	});
}