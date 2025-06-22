import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	color = '#f02728';
	index = 3;
	name = 'balloon';
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
			let c = this.time * l.settings.drawFPS;
			i.setTempVehicle(this.name.toUpperCase(), c, {
				x: this.x,
				y: this.y
			}, e.dir),
			l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
			l.vehicleTimer.playerAddedTime(i)),
			i.isGhost() === !1 && (this.hit = !0,
			this.sector.powerupCanvasDrawn = !1,
			this.scene.message.show('Balloon Powerup!', 50, this.color))
		}
	}
	drawIcon(t, e) {
		t.scale(e, e),
		t.beginPath(),
		t.roundRect(6, 23, 9, 8, 1),
		t.fill(),
		t.beginPath(),
		t.arc(10.5, 10.5, 10.5 - t.lineWidth / 2, 0, 2 * Math.PI);
		let i = t.fillStyle;
		t.fillStyle = this.color,
		t.fill(),
		t.fillStyle = i,
		t.moveTo(15, 18.5),
		t.lineTo(13, 24),
		t.moveTo(8, 24),
		t.lineTo(6, 18.5),
		t.stroke(),
		t.resetTransform()
	}
	updateCache(t, e) {
		let i = super.updateCache(t, e);
		t.lineWidth = 2,
		t.strokeStyle = this.outline,
		t.fillStyle = this.outline;
		return i
	}
	static cache = this.createCache({
		width: 21,
		height: 31
	})
}