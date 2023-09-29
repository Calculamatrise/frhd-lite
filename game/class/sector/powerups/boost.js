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
		super(t, e, s);
		this.angle = i;
		this.realAngle = i;
		let n = (i - 180) / 360 * 2 * Math.PI;
		this.directionX = (-Math.sin(n)).toFixed(15) / 1;
		this.directionY = Math.cos(n).toFixed(15) / 1;
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , r = t.pos.y - this.y
		  , o = Math.pow(s, 2) + Math.pow(r, 2)
		  , a = e.masses
		  , h = a.length;
		if (1e3 > o && i.isAlive()) {
			for (var u = h - 1; u >= 0; u--) {
				var p = a[u].pos;
				p.x += this.directionX * (1 + this.stack),
				p.y += this.directionY * (1 + this.stack)
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
	drawPowerup(t, e, i, s) {
		let n = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (n = this.settings.physicsLineColor),
		i *= .2,
		s.save(),
		s.fillStyle = this.color,
		s.strokeStyle = n,
		s.lineWidth = Math.max(8 * i, 1),
		s.beginPath(),
		s.moveTo(8 * i, 4 * i),
		s.lineTo(39 * i, 4 * i),
		s.lineTo(70 * i, 40 * i),
		s.lineTo(38 * i, 76 * i),
		s.lineTo(8 * i, 76 * i),
		s.lineTo(40 * i, 39 * i),
		s.closePath(),
		s.moveTo(57 * i, 4 * i),
		s.lineTo(89 * i, 4 * i),
		s.lineTo(120 * i, 40 * i),
		s.lineTo(88 * i, 76 * i),
		s.lineTo(58 * i, 76 * i),
		s.lineTo(89 * i, 39 * i),
		s.closePath(),
		s.fill(),
		s.stroke()
	}
	getCode() {
		return super.getCode() + ' ' + this.realAngle.toString(32)
	}
	static cache = Object.assign(this.createCache(), {
		width: 25,
		height: 16
	})
}