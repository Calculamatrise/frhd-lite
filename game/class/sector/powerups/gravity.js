import Powerup from "../powerup.js";

export default class extends Powerup {
	realAngle = 0;
	name = "gravity";
	constructor(t, e, i, s) {
		super(...arguments);
		this.angle = i - 180;
		this.realAngle = i;
		let n = this.angle / 360 * 2 * Math.PI;
		this.directionX = (-.3 * Math.sin(n)).toFixed(15) / 1;
		this.directionY = (.3 * Math.cos(n)).toFixed(15) / 1;
	}
	recache(t) {
		this.constructor.cache.dirty = !1;
		let e = this.constructor.cache.canvas;
		e.width = this.constructor.cache.width * t,
		e.height = this.constructor.cache.height * t;
		let i = e.getContext('2d')
		  , s = e.width / 2
		  , n = e.height / 2;
		this.drawArrow(s, n, t, i),
		this.settings.developerMode && (i.beginPath(),
		i.rect(0, 0, e.width, e.height),
		i.strokeStyle = 'red',
		i.strokeWidth = 3 * t,
		i.stroke())
	}
	getCode() {
		return 'G ' + super.getCode() + ' ' + this.realAngle.toString(32)
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
	drawArrow(t, e, i, s) {
		i *= .2,
		s.beginPath(),
		s.moveTo(0 * i, 0 * i),
		s.lineTo(97 * i, 0 * i),
		s.lineTo(97 * i, 96 * i),
		s.lineTo(0 * i, 96 * i),
		s.closePath(),
		s.clip(),
		s.fillStyle = "rgba(0, 0, 0, 0)",
		s.strokeStyle = "rgba(0, 0, 0, 0)",
		s.lineWidth = Math.max(6 * i, 1),
		s.save(),
		s.fillStyle = '#376eb7',
		s.strokeStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : this.outline,
		s.beginPath(),
		s.moveTo(41 * i, 70 * i),
		s.lineTo(41 * i, 95 * i),
		s.lineTo(97 * i, 48 * i),
		s.lineTo(41 * i, 1 * i),
		s.lineTo(41 * i, 25 * i),
		s.lineTo(1 * i, 25 * i),
		s.lineTo(1 * i, 70 * i),
		s.lineTo(41 * i, 70 * i),
		s.closePath(),
		s.closePath(),
		s.fill(),
		s.stroke()
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , r = t.pos.y - this.y
		  , o = Math.pow(s, 2) + Math.pow(r, 2)
		  , a = e.masses
		  , h = (a.length,
		this.directionX)
		, l = this.directionY;
		1e3 > o && i.isAlive() && (e.gravity.x = h,
		e.gravity.y = l,
		i.isGhost() === !1 && (this.scene.message.show('Gravity Changed', 50, '#1F80C3', '#FFFFFF'),
		this.scene.sound.play('gravity_down_sound')))
	}
	static cache = Object.assign(this.createCache(), {
		width: 20,
		height: 20
	})
}