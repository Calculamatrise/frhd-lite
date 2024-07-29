import Powerup from "../powerup.js";

export default class extends Powerup {
	name = 'slowmo';
	prefix = 'S';
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , o = t.pos.y - this.y
		  , a = Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2));
		26 > a && i.isAlive() && (e.slow = !0,
		i.isGhost() === !1 && (this.scene.sound.play('slowmo_sound'),
		this.scene.message.show('Slow Motion', 50, this.color, '#000000')))
	}
	drawPowerup(t, e) {
		e *= .24,
		t.scale(e, e),
		t.beginPath(),
		t.arc(50, 50, 50 - t.lineWidth / 2, 0, 2 * Math.PI),
		t.stroke(),
		t.beginPath(),
		t.arc(50, 50, 42.5 - t.lineWidth / 2, 0, 2 * Math.PI),
		t.stroke(),
		t.beginPath(),
		t.moveTo(70, 50),
		t.lineTo(50, 50),
		t.lineTo(30, 20),
		t.moveTo(92.5, 50),
		t.lineTo(82.5, 50),
		t.moveTo(50, 7.5),
		t.lineTo(50, 17.5),
		t.moveTo(50, 92.5),
		t.lineTo(50, 82.5),
		t.moveTo(7.5, 50),
		t.lineTo(17.5, 50);
		let i = t.lineWidth;
		t.lineWidth = 5,
		t.stroke(),
		t.lineWidth = i
	}
	updateCache(t, e) {
		super.updateCache(t, e);
		let i = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (i = this.settings.physicsLineColor),
		t.strokeStyle = i,
		t.lineWidth = 3
	}
	static cache = this.createCache({
		width: 26,
		height: 24
	})
}