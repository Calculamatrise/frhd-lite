import Powerup from "../powerup.js";

let n = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 26,
    height: 26
}

export default class extends Powerup {
    constructor(t, e, i) {
        super(i);
        this.x = t;
        this.y = e;
    }
    x = 0;
    y = 0;
    name = "bomb";
    getCode() {
        return "O " + this.x.toString(32) + " " + this.y.toString(32)
    }
    recache(t) {
        n.dirty = !1;
        var e = n.canvas;
        e.width = n.width * t,
        e.height = n.height * t;
        var i = e.getContext("2d")
            , s = e.width / 2
            , r = e.height / 2;
        this.drawCircle(s, r, t, i),
        this.settings.developerMode && (i.beginPath(),
        i.rect(0, 0, e.width, e.height),
        i.strokeStyle = "red",
        i.strokeWidth = 1 * t,
        i.stroke())
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
    drawCircle(t, e, i, s) {
        i *= .2,
        s.fillStyle = inviolable.storage.get("dark") ? "#fdfdfd" : "#000",
        s.strokeStyle = inviolable.storage.get("dark") ? "#fdfdfd" : "#000",
        s.lineWidth = 8 * i,
        s.beginPath(),
        s.moveTo(53 * i, 105 * i),
        s.lineTo(41.5 * i, 115 * i),
        s.lineTo(43 * i, 100 * i),
        s.bezierCurveTo(35.5 * i, 95 * i, 30 * i, 88.5 * i, 26.5 * i, 80 * i),
        s.lineTo(11 * i, 78 * i),
        s.lineTo(24 * i, 69.5 * i),
        s.bezierCurveTo(24 * i, 68 * i, 24 * i, 67 * i, 24 * i, 66 * i),
        s.bezierCurveTo(24 * i, 58.5 * i, 26 * i, 51 * i, 30 * i, 45 * i),
        s.lineTo(22 * i, 31.5 * i),
        s.lineTo(37.5 * i, 36 * i),
        s.bezierCurveTo(43.5 * i, 31 * i, 51 * i, 27.5 * i, 60 * i, 26 * i),
        s.lineTo(66 * i, 11 * i),
        s.lineTo(72 * i, 26.5 * i),
        s.bezierCurveTo(80.5 * i, 27.5 * i, 88 * i, 31 * i, 93.5 * i, 36.5 * i),
        s.lineTo(110 * i, 31.5 * i),
        s.lineTo(101.5 * i, 46 * i),
        s.bezierCurveTo(105 * i, 52 * i, 107 * i, 59 * i, 107 * i, 66 * i),
        s.bezierCurveTo(107 * i, 67 * i, 107 * i, 68 * i, 107 * i, 69 * i),
        s.lineTo(121 * i, 78 * i),
        s.lineTo(104.5 * i, 80.5 * i),
        s.bezierCurveTo(101.5 * i, 88 * i, 96 * i, 95 * i, 89 * i, 99.5 * i),
        s.lineTo(90.5 * i, 115 * i),
        s.lineTo(78.5 * i, 104.5 * i),
        s.bezierCurveTo(74.5 * i, 106 * i, 70 * i, 107 * i, 65.5 * i, 107 * i),
        s.bezierCurveTo(61 * i, 107 * i, 57 * i, 106 * i, 53 * i, 105 * i),
        s.lineTo(53 * i, 105 * i),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.beginPath(),
        s.arc(66 * i, 66 * i, 40 * i, 0 * i, 2 * Math.PI, !0),
        s.lineWidth = 2 * i,
        s.fillStyle = "#d12929",
        s.fill(),
        s.stroke(),
        s.beginPath(),
        s.arc(66 * i, 66 * i, 8 * i, 0 * i, 2 * Math.PI, !0),
        s.lineWidth = 2 * i,
        s.fillStyle = inviolable.storage.get("dark") ? "#fdfdfd" : "#000",
        s.fill(),
        s.stroke()
    }
    collide(t) {
        var e = t.parent
            , i = e.player
            , s = t.pos.x - this.x
            , n = t.pos.y - this.y
            , a = Math.sqrt(Math.pow(s, 2) + Math.pow(n, 2));
        20 > a && i.isAlive() && (e.explode(),
        i.isGhost() === !1 && (this.hit = !0,
        this.sector.powerupCanvasDrawn = !1))
    }
}