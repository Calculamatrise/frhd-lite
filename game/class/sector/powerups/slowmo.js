import Powerup from "../powerup.js";

export default class extends Powerup {
	name = 'slowmo';
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , o = t.pos.y - this.y
		  , a = Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2));
		!this.hit && 26 > a && i.isAlive() && (e.slow = !0,
		i.isGhost() === !1 && (this.scene.sound.play('slowmo_sound'),
		this.scene.message.show('Slow Motion', 50, this.color, '#000000')))
	}
	drawPowerup(t, e, i, s) {
		let n = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (n = this.settings.physicsLineColor),
		i *= .24,
		s.save(),
		s.scale(i, i),
		s.beginPath(),
		s.strokeStyle = n,
		s.lineWidth = 3,
		s.arc(50, 50, 50 - s.lineWidth / 2, 0, 2 * Math.PI),
		s.stroke(),
		s.beginPath(),
		s.arc(50, 50, 42.5 - s.lineWidth / 2, 0, 2 * Math.PI),
		s.stroke(),
		s.beginPath(),
		s.lineWidth = 5,
		s.moveTo(70, 50),
		s.lineTo(50, 50),
		s.lineTo(30, 20),
		s.moveTo(92.5, 50),
		s.lineTo(82.5, 50),
		s.moveTo(50, 7.5),
		s.lineTo(50, 17.5),
		s.moveTo(50, 92.5),
		s.lineTo(50, 82.5),
		s.moveTo(7.5, 50),
		s.lineTo(17.5, 50),
		s.stroke(),
		s.restore()
	}
	getCode() {
		return 'S ' + super.getCode()
	}
	static cache = Object.assign(this.createCache(), {
		width: 26,
		height: 24
	})
}