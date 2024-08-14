import Powerup from "../powerup.js";

export default class extends Powerup {
	angle = null;
	directionX = 0;
	directionY = 0;
	realAngle = 0;
	constructor(t, e, i, s) {
		super(t, e, s),
		this.realAngle = i
	}
	draw(t, e, i, s) {
		this.constructor.cache.dirty && this.recache(i);
		let n = this.constructor.cache.width * i
		  , o = this.constructor.cache.height * i
		  , a = n / 2
		  , h = o / 2
		  , u = (this.angle + this.constructor.angleOffset) * (Math.PI / 180);
		s.translate(t, e),
		s.rotate(u),
		s.drawImage(this.constructor.cache.canvas, -a, -h, n, o),
		s.rotate(-u),
		s.translate(-t, -e)
	}
	getCode() {
		return (super.getCode() + ' ' + this.realAngle.toString(32) + ',').repeat(this.multiplier).slice(0, -1)
	}
}