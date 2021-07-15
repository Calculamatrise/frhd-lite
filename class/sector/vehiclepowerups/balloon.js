import Powerup from "../powerup.js";

let n = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 22,
    height: 32
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
    name = "balloon";
    getCode() {
        return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 3 " + this.time.toString(32)
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
        s.save(),
        s.scale(i, i),
        s.beginPath(),
        s.moveTo(0, 0),
        s.lineTo(21, 0),
        s.lineTo(21, 31),
        s.lineTo(0, 31),
        s.closePath(),
        s.clip(),
        s.translate(0, 0),
        s.translate(0, 0),
        s.scale(1, 1),
        s.translate(0, 0),
        s.strokeStyle = "rgba(0,0,0,0)",
        s.lineCap = "butt",
        s.lineJoin = "miter",
        s.miterLimit = 4,
        s.save(),
        s.restore(),
        s.save(),
        s.restore(),
        s.save(),
        s.fillStyle = "rgba(0, 0, 0, 0)",
        s.strokeStyle = "rgba(0, 0, 0, 0)",
        s.lineWidth = 1,
        s.translate(-1322, -440),
        s.save(),
        s.translate(251, 28),
        s.save(),
        s.translate(1056, 265),
        s.save(),
        s.translate(3, 141),
        s.save(),
        s.translate(12, 6),
        s.save(),
        s.fillStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        s.beginPath(),
        s.moveTo(7, 23),
        s.lineTo(14, 23),
        s.quadraticCurveTo(15, 23, 15, 24),
        s.lineTo(15, 30),
        s.quadraticCurveTo(15, 31, 14, 31),
        s.lineTo(7, 31),
        s.quadraticCurveTo(6, 31, 6, 30),
        s.lineTo(6, 24),
        s.quadraticCurveTo(6, 23, 7, 23),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.save(),
        s.strokeStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        s.lineWidth = 2,
        s.lineCap = "round",
        s.beginPath(),
        s.moveTo(15, 19),
        s.lineTo(12.9375, 24.6875),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.save(),
        s.strokeStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        s.lineWidth = 2,
        s.lineCap = "round",
        s.translate(7.03125, 21.84375),
        s.scale(-1, 1),
        s.translate(-7.03125, -21.84375),
        s.beginPath(),
        s.moveTo(8.0625, 19),
        s.lineTo(6, 24.6875),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.save(),
        s.save(),
        s.fillStyle = "#f02728",
        s.save(),
        s.beginPath(),
        s.arc(10.5, 11.125, 10.5, 0, 6.283185307179586, !0),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.restore(),
        s.save(),
        s.strokeStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        s.lineWidth = 2,
        s.beginPath(),
        s.arc(10.5, 11.125, 9.5, 0, 6.283185307179586, !0),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore()
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
            i.setTempVehicle("BALLOON", c, {
                x: this.x,
                y: this.y
            }, e.dir),
            l.camera.playerFocus === i && (l.camera.focusOnPlayer()),
            i.isGhost() === !1 && (this.hit = !0,
            this.sector.powerupCanvasDrawn = !1,
            this.scene.message.show("Balloon Powerup!", 50, "#f02728", !1))
        }
    }
}