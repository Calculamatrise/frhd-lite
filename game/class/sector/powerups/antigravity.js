import Powerup from "../powerup.js";

export default class extends Powerup {
	name = 'antigravity';
	constructor(t, e, i) {
		super(i);
		this.x = t;
		this.y = e;
	}
	getCode() {
		return 'A ' + super.getCode()
	}
	recache(t) {
		this.constructor.cache.dirty = !1;
		let e = this.constructor.cache.canvas;
		e.width = this.constructor.cache.width * t,
		e.height = this.constructor.cache.height * t;
		let i = e.getContext('2d')
		  , s = e.width / 2
		  , n = e.height / 2;
		this.drawPowerup(s, n, t, i),
		this.settings.developerMode && (i.beginPath(),
		i.rect(0, 0, e.width, e.height),
		i.strokeStyle = 'red',
		i.strokeWidth = 1 * t,
		i.stroke())
	}
	draw(t, e, i, s) {
		this.constructor.cache.dirty && this.recache(i);
		var n = this.constructor.cache.width * i
			, o = this.constructor.cache.height * i
			, a = n / 2
			, h = o / 2
			, l = t
			, c = e;
		s.translate(l, c),
		s.drawImage(this.constructor.cache.canvas, -a, -h, n, o),
		s.translate(-l, -c)
	}
	drawPowerup(t, e, i, s) {
		i *= .5,
		s.save(),
		s.scale(i, i),
		s.lineCap = 'butt',
		s.lineJoin = 'miter',
		s.miterLimit = 4,
		s.fillStyle = '#08faf3',
		s.strokeStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : this.outline,
		s.lineWidth = 1,
		s.save(),
		s.beginPath(),
		s.lineWidth = 3,
		s.arc(25, 25, 11 - s.lineWidth / 2, 0, 2 * Math.PI, !0),
		s.fill(),
		s.stroke(),
		s.restore(),
		s.save(),
		s.fillStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : this.outline,
		s.beginPath(),
		s.moveTo(1.0370609, 29.702878),
		s.lineTo(.571767448, 27.3196417),
		s.lineTo(10.8190136, 27.3196417),
		s.lineTo(11.2235626, 28.7886215),
		s.bezierCurveTo(12.5553335, 33.6244869, 16.3752072, 37.4442862, 21.2110994, 38.7761385),
		s.lineTo(22.6800518, 39.1807024),
		s.lineTo(22.6800518, 49.4279421),
		s.lineTo(20.2968028, 48.9626301),
		s.bezierCurveTo(10.5816525, 47.0658182, 2.93381735, 39.4180779, 1.0370609, 29.702878),
		s.closePath(),
		s.moveTo(48.9629391, 20.297122),
		s.lineTo(49.4282326, 22.6803583),
		s.lineTo(39.1809639, 22.6803583),
		s.lineTo(38.7764299, 21.2113511),
		s.bezierCurveTo(37.4446547, 16.3752014, 33.624798, 12.5554192, 28.7886215, 11.2235626),
		s.lineTo(27.3196417, 10.8190136),
		s.lineTo(27.3196417, .571783441),
		s.lineTo(29.7028653, 1.03705842),
		s.bezierCurveTo(39.418382, 2.93381152, 47.0661305, 10.5816549, 48.9629391, 20.297122),
		s.closePath(),
		s.moveTo(11.2235701, 21.2113511),
		s.lineTo(10.8190361, 22.6803583),
		s.lineTo(.571767448, 22.6803583),
		s.lineTo(1.0370609, 20.297122),
		s.bezierCurveTo(2.93380373, 10.5819918, 10.5815702, 2.93422536, 20.2967378, 1.03707606),
		s.lineTo(22.6800518, .571669532),
		s.lineTo(22.6800518, 10.8189911),
		s.lineTo(21.2110994, 11.223555),
		s.bezierCurveTo(16.3751604, 12.5554202, 12.5553324, 16.3752482, 11.2235701, 21.2113511),
		s.closePath(),
		s.moveTo(29.7028653, 48.9626351),
		s.lineTo(27.3196417, 49.4279101),
		s.lineTo(27.3196417, 39.1806799),
		s.lineTo(28.7886215, 38.7761309),
		s.bezierCurveTo(33.6247513, 37.4442873, 37.4446537, 33.6245336, 38.7764374, 28.7886215),
		s.lineTo(39.1809864, 27.3196417),
		s.lineTo(49.4282326, 27.3196417),
		s.lineTo(48.9629391, 29.702878),
		s.bezierCurveTo(47.0661446, 39.4182726, 39.4184545, 47.0658678, 29.7028653, 48.9626351),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.restore(),
		s.beginPath(),
		s.moveTo(3, 29.3196417),
		s.bezierCurveTo(4.74079001, 38.2359804, 11.7640196, 45.2589035, 20.6800518, 46.9996935),
		s.lineTo(20.6800518, 40.7043471),
		s.bezierCurveTo(15.1649961, 39.1854465, 10.814247, 34.8350039, 9.29534642, 29.3196417),
		s.lineTo(3, 29.3196417),
		s.closePath(),
		s.moveTo(47, 20.6803583),
		s.bezierCurveTo(45.25921, 11.7640196, 38.2362869, 4.74079001, 29.3196417, 3),
		s.lineTo(29.3196417, 9.29534642),
		s.bezierCurveTo(34.8350039, 10.814247, 39.185753, 15.1646897, 40.7046536, 20.6803583),
		s.lineTo(47, 20.6803583),
		s.closePath(),
		s.moveTo(9.29534642, 20.6803583),
		s.bezierCurveTo(10.814247, 15.1646897, 15.1649961, 10.814247, 20.6800518, 9.29534642),
		s.lineTo(20.6800518, 3),
		s.bezierCurveTo(11.7640196, 4.74109649, 4.74079001, 11.7640196, 3, 20.6803583),
		s.lineTo(9.29534642, 20.6803583),
		s.closePath(),
		s.moveTo(29.3196417, 46.9996935),
		s.bezierCurveTo(38.2362869, 45.2589035, 45.25921, 38.2359804, 47, 29.3196417),
		s.lineTo(40.7046536, 29.3196417),
		s.bezierCurveTo(39.185753, 34.8350039, 34.8350039, 39.1854465, 29.3196417, 40.7043471),
		s.lineTo(29.3196417, 46.9996935),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.restore()
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , r = t.pos.y - this.y
		  , o = Math.pow(s, 2) + Math.pow(r, 2);
		1e3 > o && i.isAlive() && (i.isGhost() === !1 && ((0 != e.gravity.x || 0 != e.gravity.y) && this.scene.sound.play('antigravity_sound', .3),
		this.scene.message.show('Antigravity Engaged', 50, '#08faf3')),
		e.gravity.x = 0,
		e.gravity.y = 0)
	}
	static cache = this.createCache()
}