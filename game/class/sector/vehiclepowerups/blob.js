import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	color = '#a784c5';
	index = 4;
	name = 'blob';
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , n = t.pos.y - this.y
		  , r = Math.sqrt(Math.pow(s, 2) + Math.pow(n, 2))
		  , h = i._powerupsConsumed.misc
		  , l = this.scene;
		if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
			h.push(this.id);
			var c = this.time * l.settings.drawFPS;
			i.setTempVehicle(this.name.toUpperCase(), c, {
				x: this.x,
				y: this.y
			}, e.dir),
			l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
			l.vehicleTimer.playerAddedTime(i)),
			i.isGhost() === !1 && (this.hit = !0,
			this.sector.powerupCanvasDrawn = !1,
			this.scene.message.show('Blob Powerup!', 50, this.color, !1))
		}
	}
	drawIcon(t, e) {
		t.scale(e, e),
		t.beginPath(),
		t.roundRect(1, 1, 22, 22, 3.5),
		t.fill(),
		t.stroke()
	}
	updateCache(t, e) {
		super.updateCache(t, e);
		let i = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (i = this.settings.physicsLineColor),
		t.strokeStyle = i,
		t.fillStyle = this.color,
		t.lineWidth = 2
	}
	static cache = this.createCache({
		width: 24,
		height: 24
	})
}