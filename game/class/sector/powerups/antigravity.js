import Powerup from "../powerup.js";

export default class extends Powerup {
	color = '#08faf3';
	hitboxRadius = Math.sqrt(1e3);
	name = 'antigravity';
	prefix = 'A';
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
	drawPowerup(t, e) {
		e *= this.constructor.cache.scale,
		t.scale(e, e),
		t.beginPath();
		let i = t.lineWidth;
		t.arc(25, 25, 11 - i / 2, 0, 2 * Math.PI, !0),
		t.fill(),
		t.stroke(),
		t.beginPath(),
		t.moveTo(3, 29.3196417),
		t.bezierCurveTo(4.74079001, 38.2359804, 11.7640196, 45.2589035, 20.6800518, 46.9996935),
		t.lineTo(20.6800518, 40.7043471),
		t.bezierCurveTo(15.1649961, 39.1854465, 10.814247, 34.8350039, 9.29534642, 29.3196417),
		t.closePath(),
		t.moveTo(47, 20.6803583),
		t.bezierCurveTo(45.25921, 11.7640196, 38.2362869, 4.74079001, 29.3196417, 3),
		t.lineTo(29.3196417, 9.29534642),
		t.bezierCurveTo(34.8350039, 10.814247, 39.185753, 15.1646897, 40.7046536, 20.6803583),
		t.closePath(),
		t.moveTo(9.29534642, 20.6803583),
		t.bezierCurveTo(10.814247, 15.1646897, 15.1649961, 10.814247, 20.6800518, 9.29534642),
		t.lineTo(20.6800518, 3),
		t.bezierCurveTo(11.7640196, 4.74109649, 4.74079001, 11.7640196, 3, 20.6803583),
		t.closePath(),
		t.moveTo(29.3196417, 46.9996935),
		t.bezierCurveTo(38.2362869, 45.2589035, 45.25921, 38.2359804, 47, 29.3196417),
		t.lineTo(40.7046536, 29.3196417),
		t.bezierCurveTo(39.185753, 34.8350039, 34.8350039, 39.1854465, 29.3196417, 40.7043471),
		t.closePath(),
		t.lineWidth = 5,
		t.stroke(),
		t.lineWidth = i,
		t.fill(),
		t.resetTransform()
	}
	updateCache(t, e) {
		let i = super.updateCache(t, e);
		t.fillStyle = this.color,
		t.strokeStyle = this.outline,
		t.lineWidth = 3;
		return i
	}
	static cache = this.createCache({ scale: .5 })
}