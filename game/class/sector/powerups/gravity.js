import Powerup from "../powerup.js";

export default class extends Powerup {
	angle = -180;
	color = '#376eb7';
	name = "gravity";
	prefix = 'G';
	realAngle = 0;
	constructor(t, e, i, s) {
		super(t, e, s),
		this.angle = i - 180,
		this.realAngle = i;
		let n = this.angle / 360 * 2 * Math.PI;
		this.directionX = (-.3 * Math.sin(n)).toFixed(15) / 1,
		this.directionY = (.3 * Math.cos(n)).toFixed(15) / 1
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , r = t.pos.y - this.y
		  , o = s ** 2 + r ** 2;
		1e3 > o && i.isAlive() && (e.gravity.x = this.directionX,
		e.gravity.y = this.directionY,
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
	drawPowerup(t, e) {
		e *= this.constructor.cache.scale,
		t.beginPath(),
		t.moveTo(45 * e, 70 * e),
		t.lineTo(45 * e, 95 * e),
		t.lineTo(97 * e, 50 * e),
		t.lineTo(45 * e, 5 * e),
		t.lineTo(45 * e, 30 * e),
		t.lineTo(3 * e, 30 * e),
		t.lineTo(3 * e, 70 * e),
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
		t.lineJoin = 'round',
		t.lineWidth = Math.max(6 * e * this.constructor.cache.scale, 1),
		t.fillStyle = this.color,
		t.strokeStyle = i
	}
	static cache = this.createCache({
		width: 20,
		height: 20,
		scale: .2
	})
}