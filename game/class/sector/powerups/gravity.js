import Powerup from "../powerup.js";

export default class extends Powerup {
	angle = null;
	color = '#376eb7';
	name = "gravity";
	prefix = 'G';
	realAngle = 0;
	constructor(t, e, i, s) {
		super(t, e, s);
		this.angle = i - 180;
		this.realAngle = i;
		let n = this.angle / 360 * 2 * Math.PI;
		this.directionX = (-.3 * Math.sin(n)).toFixed(15) / 1;
		this.directionY = (.3 * Math.cos(n)).toFixed(15) / 1;
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , r = t.pos.y - this.y
		  , o = Math.pow(s, 2) + Math.pow(r, 2)
		  , a = e.masses
		  , h = this.directionX
		  , l = this.directionY;
		1e3 > o && i.isAlive() && (e.gravity.x = h,
		e.gravity.y = l,
		i.isGhost() === !1 && (this.scene.message.show('Gravity Changed', 50, '#1F80C3', '#FFFFFF'),
		this.scene.sound.play('gravity_down_sound')))
	}
	draw(t, e, i, s) {
		this.constructor.cache.dirty && this.recache(i);
		let n = this.constructor.cache.width * i
		  , o = this.constructor.cache.height * i
		  , a = n / 2
		  , h = o / 2
		  , u = (this.angle + 90) * (Math.PI / 180);
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
		s.lineJoin = 'round'
		s.save(),
		s.lineWidth = Math.max(6 * i, 1),
		s.fillStyle = this.color,
		s.strokeStyle = n,
		s.beginPath(),
		s.moveTo(45 * i, 70 * i),
		s.lineTo(45 * i, 95 * i),
		s.lineTo(97 * i, 50 * i),
		s.lineTo(45 * i, 5 * i),
		s.lineTo(45 * i, 30 * i),
		s.lineTo(3 * i, 30 * i),
		s.lineTo(3 * i, 70 * i),
		s.closePath(),
		s.fill(),
		s.stroke(),
        s.restore()
	}
	getCode() {
		return super.getCode() + ' ' + this.realAngle.toString(32)
	}
	static cache = Object.assign(this.createCache(), {
		width: 20,
		height: 20
	})
}