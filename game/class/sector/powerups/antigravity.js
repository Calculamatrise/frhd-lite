import Powerup from "../powerup.js";

export default class extends Powerup {
	color = '#08faf3';
	name = 'antigravity';
	constructor(t, e, i) {
		super(i);
		this.x = t;
		this.y = e;
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , r = t.pos.y - this.y
		  , o = Math.pow(s, 2) + Math.pow(r, 2);
		1e3 > o && i.isAlive() && (i.isGhost() === !1 && ((0 != e.gravity.x || 0 != e.gravity.y) && this.scene.sound.play('antigravity_sound', .3),
		this.scene.message.show('Antigravity Engaged', 50, this.color)),
		e.gravity.x = 0,
		e.gravity.y = 0)
	}
	drawPowerup(t, e, i, s) {
		let n = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (n = this.settings.physicsLineColor)
		i *= .5,
		s.save(),
		s.scale(i, i),
		s.fillStyle = this.color,
		s.strokeStyle = n,
        s.lineWidth = 3,
		s.beginPath(),
		s.arc(25, 25, 11 - s.lineWidth / 2, 0, 2 * Math.PI, !0),
		s.fill(),
		s.stroke(),
		s.beginPath(),
		s.moveTo(3, 29.3196417),
		s.bezierCurveTo(4.74079001, 38.2359804, 11.7640196, 45.2589035, 20.6800518, 46.9996935),
		s.lineTo(20.6800518, 40.7043471),
		s.bezierCurveTo(15.1649961, 39.1854465, 10.814247, 34.8350039, 9.29534642, 29.3196417),
		s.closePath(),
		s.moveTo(47, 20.6803583),
		s.bezierCurveTo(45.25921, 11.7640196, 38.2362869, 4.74079001, 29.3196417, 3),
		s.lineTo(29.3196417, 9.29534642),
		s.bezierCurveTo(34.8350039, 10.814247, 39.185753, 15.1646897, 40.7046536, 20.6803583),
		s.closePath(),
		s.moveTo(9.29534642, 20.6803583),
		s.bezierCurveTo(10.814247, 15.1646897, 15.1649961, 10.814247, 20.6800518, 9.29534642),
		s.lineTo(20.6800518, 3),
		s.bezierCurveTo(11.7640196, 4.74109649, 4.74079001, 11.7640196, 3, 20.6803583),
		s.closePath(),
		s.moveTo(29.3196417, 46.9996935),
		s.bezierCurveTo(38.2362869, 45.2589035, 45.25921, 38.2359804, 47, 29.3196417),
		s.lineTo(40.7046536, 29.3196417),
		s.bezierCurveTo(39.185753, 34.8350039, 34.8350039, 39.1854465, 29.3196417, 40.7043471),
		s.closePath(),
		s.lineWidth = 5,
		s.stroke(),
        s.fill(),
		s.restore()
	}
	getCode() {
		return 'A ' + super.getCode()
	}
	static cache = this.createCache()
}