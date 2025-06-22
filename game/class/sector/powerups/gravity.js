import DirectionalPowerup from "./directional.js";

export default class extends DirectionalPowerup {
	angle = -180;
	color = '#376eb7';
	name = "gravity";
	prefix = 'G';
	constructor(t, e, i, s) {
		super(t, e, i, s),
		this.angle = i - 180;
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
	updateCache(t, e) {
		let i = super.updateCache(t, e);
		t.lineJoin = 'round',
		t.lineWidth = Math.max(6 * e * this.constructor.cache.scale, 1),
		t.fillStyle = this.color,
		t.strokeStyle = this.outline;
		return i
	}
	static angleOffset = 90;
	static cache = this.createCache({
		width: 20,
		height: 20,
		scale: .2
	})
}