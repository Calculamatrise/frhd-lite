import Powerup from "../powerup.js";

let n = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 32,
    height: 42
}

export default class extends Powerup {
    constructor(t, e, i, s) {
        super(s);
        this.x = t;
        this.y = e;
        this.time = i;
        this.id = Math.random().toString(36).substr(2);
        this.hit = !1;
    }
    x = 0;
    y = 0;
    name = "helicopter";
    getCode() {
        return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 1 " + this.time.toString(32)
    }
    recache(t) {
        n.dirty = !1;
        var e = n.canvas;
        e.width = n.width * t,
        e.height = n.height * t;
        var i = e.getContext("2d")
          , s = e.width / 2
          , r = e.height / 2;
        this.drawIcon(s, r, t, i)
    }
    setDirty(t) {
        n.dirty = t
    }
    draw(t, e, i, s) {
        if (!this.hit) {
            n.dirty && this.recache(i);
            var r = n.width * i
              , o = n.height * i
              , a = r / 2
              , h = o / 2;
            s.drawImage(n.canvas, t - a, e - h, r, o)
        }
    }
    drawIcon(t, e, i, s) {
        i *= 1,
        s.lineCap = "butt",
        s.lineJoin = "miter",
        s.miterLimit = 4 * i,
        s.strokeStyle = lite.getVar("dark") ? "#fdfdfd" : "#000";
        s.fillStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        s.beginPath(),
        s.moveTo(15 * i, 4.5 * i),
        s.lineTo(15 * i, 2.5 * i),
        s.bezierCurveTo(15 * i, 1.4 * i, 14.1 * i, .5 * i, 13 * i, .5 * i),
        s.bezierCurveTo(11.9 * i, .5 * i, 11 * i, 1.4 * i, 11 * i, 2.5 * i),
        s.lineTo(11 * i, 4.5 * i),
        s.bezierCurveTo(11 * i, 5.6 * i, 11.9 * i, 6.5 * i, 13 * i, 6.5 * i),
        s.bezierCurveTo(14.1 * i, 6.5 * i, 15 * i, 5.6 * i, 15 * i, 4.5 * i),
        s.lineTo(15 * i, 4.5 * i),
        s.closePath(),
        s.fill(),
        s.beginPath(),
        s.lineCap = "round",
        s.lineWidth = 2 * i,
        s.moveTo(1 * i, 3 * i),
        s.lineTo(25 * i, 3 * i),
        s.stroke(),
        s.lineCap = "butt",
        s.lineWidth = 1 * i,
        s.beginPath(),
        s.moveTo(6.1 * i, 26.9 * i),
        s.lineTo(4.1 * i, 31.9 * i),
        s.bezierCurveTo(3.8 * i, 32.7 * i, 4.2 * i, 33.6 * i, 4.9 * i, 33.9 * i),
        s.bezierCurveTo(5.7 * i, 34.2 * i, 6.6 * i, 33.8 * i, 6.9 * i, 33 * i),
        s.lineTo(8.9 * i, 28 * i),
        s.bezierCurveTo(9.2 * i, 27.3 * i, 8.8 * i, 26.4 * i, 8 * i, 26.1 * i),
        s.bezierCurveTo(7.3 * i, 25.8 * i, 6.4 * i, 26.1 * i, 6.1 * i, 26.9 * i),
        s.lineTo(6.1 * i, 26.9 * i),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.beginPath(),
        s.moveTo(17 * i, 28 * i),
        s.lineTo(19 * i, 33 * i),
        s.bezierCurveTo(19.4 * i, 33.8 * i, 20.3 * i, 34.2 * i, 21 * i, 33.9 * i),
        s.bezierCurveTo(21.8 * i, 33.6 * i, 22.2 * i, 32.7 * i, 21.9 * i, 31.9 * i),
        s.lineTo(19.9 * i, 26.9 * i),
        s.bezierCurveTo(19.6 * i, 26.2 * i, 18.7 * i, 25.8 * i, 17.9 * i, 26.1 * i),
        s.bezierCurveTo(17.2 * i, 26.4 * i, 16.8 * i, 27.3 * i, 17.1 * i, 28 * i),
        s.lineTo(17 * i, 28 * i),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.fillStyle = "#f59423",
        s.strokeStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        s.lineWidth = 2 * i,
        s.beginPath(),
        s.arc(13 * i, 17 * i, 11 * i, 0 * i, 2 * Math.PI, !0),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.fillStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        s.beginPath(),
        s.moveTo(21 * i, 17 * i),
        s.bezierCurveTo(21 * i, 12.6 * i, 17.4 * i, 9 * i, 13 * i, 9 * i),
        s.bezierCurveTo(8.6 * i, 9 * i, 5 * i, 12.6 * i, 5 * i, 17 * i),
        s.lineTo(21 * i, 17 * i),
        s.closePath(),
        s.fill()
    }
    collide(t) {
        var e = t.parent
          , i = e.player
          , s = t.pos.x - this.x
          , n = t.pos.y - this.y
          , r = Math.sqrt(Math.pow(s, 2) + Math.pow(n, 2))
          , h = i._powerupsConsumed.misc
          , l = this.scene;
        if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
            h.push(this.id);
            var c = this.time * l.settings.drawFPS;
            i.setTempVehicle("HELI", c, {
                x: this.x,
                y: this.y
            }, e.dir),
            l.camera.playerFocus === i && (l.camera.focusOnPlayer()),
            i.isGhost() === !1 && (this.hit = !0,
            this.sector.powerupCanvasDrawn = !1,
            this.scene.message.show("Helicopter Powerup!", 50, "#F2902E", !1))
        }
    }
}