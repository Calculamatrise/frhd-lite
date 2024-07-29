import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	color = '#94d44e';
	index = 2;
	name = 'truck';
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
			this.scene.message.show("Truck Powerup!", 50, this.color, !1))
		}
	}
	drawIcon(t, e) {
		t.scale(e, e),
		t.save(),
		t.beginPath(),
		t.roundRect(1, 16.5, 6, 10.5, 1.5),
		t.roundRect(18, 16.5, 6, 10.5, 1.5),
		t.fill(),
		t.moveTo(4, 22),
		t.lineTo(21, 22),
		t.stroke(),
		t.beginPath(),
		t.moveTo(23, 10),
		t.bezierCurveTo(23.5, 10.5, 24, 11, 24, 12),
		t.lineTo(24, 18),
		t.bezierCurveTo(23.5, 19, 23.5, 20, 21, 20),
		t.lineTo(3, 20),
		t.bezierCurveTo(2.5, 20, 1.5, 19.5, 1, 18.5),
		t.lineTo(1, 12),
		t.bezierCurveTo(1, 11, 1.5, 10.5, 2, 10),
		t.lineTo(2, 4),
		t.bezierCurveTo(2, 2, 3, 1, 4, 1),
		t.lineTo(21, 1),
		t.bezierCurveTo(22, 1, 23, 2, 23, 3),
		t.closePath();
		let i = t.fillStyle;
		t.fillStyle = this.color,
		t.fill(),
		t.fillStyle = i,
		t.stroke(),
		t.restore(),
		t.beginPath(),
		t.rect(5.5, 5, 14, 6),
		t.fill(),
		t.stroke(),
		t.beginPath(),
		t.arc(5.5, 15, 1.895, 0, 2 * Math.PI, !0),
		t.arc(19.5, 15, 1.895, 0, 2 * Math.PI, !0),
		t.fill()
	}
	updateCache(t, e) {
		super.updateCache(t, e);
		let i = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (i = this.settings.physicsLineColor),
		t.fillStyle = i,
		t.strokeStyle = i,
		t.lineWidth = 2
	}
	static cache = this.createCache({
		width: 25,
		height: 28
	})
}