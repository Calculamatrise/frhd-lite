import Powerup from "../powerup.js";

export default class extends Powerup {
	color = '#826cdc';
	hit = !1;
	id = crypto.randomUUID();
	name = 'checkpoint';
	prefix = 'C';
	draw(t, e, i, s) {
		s.save(),
		this.hit && (s.globalAlpha = .3),
		super.draw(t, e, i, s),
		s.restore()
	}
	drawPowerup(t, e, i, s) {
		let n = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (n = this.settings.physicsLineColor)
		i *= .15,
		s.save(),
		s.fillStyle = this.color,
		s.strokeStyle = n,
		s.lineWidth = 8 * i,
		s.beginPath(),
		s.moveTo(4 * i, 11 * i),
		s.bezierCurveTo(4 * i, 11 * i, 34.5 * i, 28 * i, 56 * i, 11 * i),
		s.bezierCurveTo(77 * i, -5 * i, 109 * i, 11 * i, 109 * i, 11 * i),
		s.lineTo(110 * i, 87 * i),
		s.bezierCurveTo(110 * i, 87 * i, 75 * i, 74.5 * i, 57.5 * i, 87 * i),
		s.bezierCurveTo(41 * i, 99 * i, 4 * i, 89.5 * i, 4 * i, 89.5 * i),
		s.closePath(),
		s.fill(),
		s.stroke(),
		s.beginPath(),
		s.lineWidth = 10 * i,
		s.moveTo(5 * i, 11 * i),
		s.lineTo(5 * i, 181 * i),
		s.stroke(),
		s.restore()
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , o = t.pos.y - this.y
		  , a = Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2))
		  , h = i._powerupsConsumed.checkpoints;
		26 > a && i.isAlive() && -1 === h.indexOf(this.id) && (h.push(this.id),
		i.setCheckpointOnUpdate(),
		i.isGhost() === !1 && (this.hit = !0,
		this.sector.powerupCanvasDrawn = !1,
		this.scene.message.show('Checkpoint Saved', 50, this.color, '#FFFFFF'),
		this.scene.sound.play('checkpoint_sound')))
	}
	static cache = Object.assign(this.createCache(), {
		width: 18,
		height: 28
	})
}