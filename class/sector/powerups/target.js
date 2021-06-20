import Powerup from "../powerup.js";

let a = {
    canvas: document.createElement("canvas"),
    width: 35,
    height: 35
}
let h = {
    canvas: document.createElement("canvas"),
    width: 35,
    height: 35
}
let l = !0;

export default class extends Powerup {
    constructor(t, e, i) {
        super(i);
        this.x = t;
        this.y = e;
        this.hit = !1,
        this.id = Math.random().toString(36).substr(2)
    }
    x = 0;
    y = 0;
    name = "goal";
    hit = !1;
    getCode() {
        return "T " + this.x.toString(32) + " " + this.y.toString(32)
    }
    recache(t) {
        l = !1,
        this.cacheStar(t),
        this.cacheEmptyStar(t)
    }
    cacheStar(t) {
        var e = a.canvas;
        e.width = a.width * t,
        e.height = a.height * t;
        var i = e.getContext("2d")
          , s = e.width / 2
          , n = e.height / 2;
        this.drawStar(s, n, 5, 10, 5, !0, t, i),
        this.settings.developerMode && (i.beginPath(),
        i.rect(0, 0, e.width, e.height),
        i.strokeStyle = "red",
        i.strokeWidth = 1 * t,
        i.stroke())
    }
    cacheEmptyStar(t) {
        var e = h.canvas;
        e.width = h.width * t,
        e.height = h.height * t;
        var i = e.getContext("2d")
          , s = e.width / 2
          , n = e.height / 2;
        this.drawStar(s, n, 5, 10, 5, !1, t, i),
        this.settings.developerMode && (i.beginPath(),
        i.rect(0, 0, e.width, e.height),
        i.strokeStyle = "red",
        i.strokeWidth = 1 * t,
        i.stroke())
    }
    setDirty(t) {
        l = t
    }
    draw(t, e, i, s) {
        if (this.hit) {
            var n = h.width * i
              , r = h.height * i
              , o = n / 2
              , c = r / 2;
            s.drawImage(h.canvas, t - o, e - c, n, r)
        } else {
            l && this.recache(i);
            var n = a.width * i
              , r = a.height * i
              , o = n / 2
              , c = r / 2;
            s.drawImage(a.canvas, t - o, e - c, n, r)
        }
    }
    drawStar(t, e, i, s, n, r, o, a) {
        var h = Math.PI / 2 * 3
          , l = t
          , c = e
          , u = Math.PI / i;
        s *= o,
        n *= o,
        a.strokeSyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        a.beginPath(),
        a.moveTo(t, e - s);
        for (var p = 0; i > p; p++)
            l = t + Math.cos(h) * s,
            c = e + Math.sin(h) * s,
            a.lineTo(l, c),
            h += u,
            l = t + Math.cos(h) * n,
            c = e + Math.sin(h) * n,
            a.lineTo(l, c),
            h += u;
        a.lineTo(t, e - s),
        a.closePath(),
        a.lineWidth = Math.max(2 * o, 1),
        a.strokeStyle = lite.getVar("dark") ? "#fdfdfd" : "#000",
        a.stroke(),
        a.fillStyle = r ? "#FAE335" : "#FFFFFF",
        a.fill()
    }
    collide(t) {
        var e = t.parent
          , i = e.player
          , s = t.pos.x - this.x
          , o = t.pos.y - this.y
          , a = Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2))
          , h = i._powerupsConsumed.targets
          , l = this.scene;
        if (26 > a && i.isAlive() && -1 === h.indexOf(this.id)) {
            h.push(this.id);
            var c = h.length
              , u = l.track.targetCount;
            i.isGhost() === !1 && (this.hit = !0,
            this.sector.powerupCanvasDrawn = !1,
            l.sound.play("goal_sound"),
            l.message.show(c + " of " + u + " Stars", 50, "#FAE335", "#666666")),
            c >= u && (i.complete = !0)
        }
    }
}