import Powerup from "./powerup.js";

export default class extends Powerup {
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
            l.camera.playerFocus === i && (l.camera.focusOnPlayer()),
			l.vehicleTimer.playerAddedTime(i),
            i.isGhost() === !1 && (this.hit = !0,
            this.sector.powerupCanvasDrawn = !1,
            this.scene.message.show(this.name.replace(/^\w/, c => c.toUpperCase()) + " Powerup!", 50, "#F2902E", !1))
        }
    }
	recache(t) {
        this.constructor.cache.dirty = !1;
        let e = this.constructor.cache.canvas;
        e.width = this.constructor.cache.width * t,
        e.height = this.constructor.cache.height * t;
        let i = e.getContext("2d")
          , s = e.width / 2
          , r = e.height / 2;
        this.drawIcon(s, r, t, i)
    }
	static cache = Object.assign({}, this.cache, {
		canvas: document.createElement("canvas"),
		width: 32,
		height: 42
	})
}