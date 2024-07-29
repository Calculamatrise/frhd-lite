import Powerup from "../powerup.js";

export default class extends Powerup {
	angle = null;
	color = '#8ac832';
	name = 'boost';
	prefix = 'B';
	realAngle = 0;
	directionX = 0;
	directionY = 0;
	constructor(t, e, i, s) {
		super(t, e, s),
		this.angle = i,
		this.realAngle = i;
		let n = (i - 180) / 360 * 2 * Math.PI;
		this.directionX = (-Math.sin(n)).toFixed(15) / 1,
		this.directionY = Math.cos(n).toFixed(15) / 1
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , r = t.pos.y - this.y
		  , o = s ** 2 + r ** 2
		  , a = e.masses
		  , h = a.length;
		if (1e3 > o && i.isAlive()) {
			for (let n = 0; n < this.multiplier; n++) {
				// invalid solution -- neglects order of powerups
				for (var u = h - 1; u >= 0; u--) {
					var p = a[u].pos;
					p.x += this.directionX,
					p.y += this.directionY
				}
			}
			i.isGhost() === !1 && (this.scene.sound.play('boost_sound'),
			this.scene.message.show('Boost Engaged', 50, this.color))
		}
	}
	draw(t, e, i, s) {
		this.constructor.cache.dirty && this.recache(i);
		let n = this.constructor.cache.width * i
		  , o = this.constructor.cache.height * i
		  , a = n / 2
		  , h = o / 2
		  , u = (this.angle - 90) * (Math.PI / 180);
		s.translate(t, e),
		s.rotate(u),
		s.drawImage(this.constructor.cache.canvas, -a, -h, n, o),
		s.rotate(-u),
		s.translate(-t, -e)
	}
	drawPowerup(t, e) {
		e *= this.constructor.cache.scale,
		t.beginPath(),
		t.moveTo(8 * e, 4 * e),
		t.lineTo(39 * e, 4 * e),
		t.lineTo(70 * e, 40 * e),
		t.lineTo(38 * e, 76 * e),
		t.lineTo(8 * e, 76 * e),
		t.lineTo(40 * e, 39 * e),
		t.closePath(),
		t.moveTo(57 * e, 4 * e),
		t.lineTo(89 * e, 4 * e),
		t.lineTo(120 * e, 40 * e),
		t.lineTo(88 * e, 76 * e),
		t.lineTo(58 * e, 76 * e),
		t.lineTo(89 * e, 39 * e),
		t.closePath(),
		t.fill(),
		t.stroke()
	}
	getCode() {
		return (super.getCode() + ' ' + this.realAngle.toString(32) + ',').repeat(this.multiplier).slice(0, -1)
	}
	updateCache(t, e) {
		super.updateCache(t, e);
		let i = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (i = this.settings.physicsLineColor),
		t.fillStyle = this.color,
		t.strokeStyle = i,
		t.lineWidth = Math.max(8 * e * this.constructor.cache.scale, 1)
	}
	static cache = this.createCache({
		width: 25,
		height: 16,
		scale: .2
	})
}