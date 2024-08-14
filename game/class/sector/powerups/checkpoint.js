import Consumable from "./consumable.js";

export default class extends Consumable {
	color = '#826cdc';
	name = 'checkpoint';
	prefix = 'C';
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
	draw(t, e, i, s) {
		s.save(),
		this.hit && (s.globalAlpha = .3),
		super.draw(t, e, i, s),
		s.restore()
	}
	drawPowerup(t, e) {
		e *= this.constructor.cache.scale,
		t.beginPath(),
		t.moveTo(4 * e, 11 * e),
		t.bezierCurveTo(4 * e, 11 * e, 34.5 * e, 28 * e, 56 * e, 11 * e),
		t.bezierCurveTo(77 * e, -5 * e, 109 * e, 11 * e, 109 * e, 11 * e),
		t.lineTo(110 * e, 87 * e),
		t.bezierCurveTo(110 * e, 87 * e, 75 * e, 74.5 * e, 57.5 * e, 87 * e),
		t.bezierCurveTo(41 * e, 99 * e, 4 * e, 89.5 * e, 4 * e, 89.5 * e),
		t.closePath(),
		t.fill(),
		t.stroke(),
		t.beginPath(),
		t.moveTo(5 * e, 11 * e),
		t.lineTo(5 * e, 181 * e);
		let i = t.lineWidth;
		t.lineWidth = 10 * e,
		t.stroke(),
		t.lineWidth = i
	}
	updateCache(t, e) {
		super.updateCache(t, e);
		let i = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (i = this.settings.physicsLineColor),
		t.fillStyle = this.color,
		t.strokeStyle = i,
		t.lineWidth = 8 * e * this.constructor.cache.scale
	}
	static cache = this.createCache({
		width: 18,
		height: 28,
		scale: .15
	})
}