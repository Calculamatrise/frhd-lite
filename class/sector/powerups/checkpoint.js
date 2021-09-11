import Powerup from "../powerup.js";

let a = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 20,
    height: 32
}

export default class extends Powerup {
    constructor(t, e, i) {
        super(i);
        this.x = t;
        this.y = e;
        this.id = Math.random().toString(36).substr(2);
    }
    x = 0;
    y = 0;
    name = "checkpoint";
    getCode() {
        return "C " + this.x.toString(32) + " " + this.y.toString(32)
    }
    recache(t) {
        a.dirty = !1;
        var e = a.canvas;
        e.width = a.width * t,
        e.height = a.height * t;
        var i = e.getContext("2d")
          , s = e.width / 2
          , n = e.height / 2;
        this.drawCircle(s, n, t, i),
        this.settings.developerMode && (i.beginPath(),
        i.rect(0, 0, e.width, e.height),
        i.strokeStyle = "red",
        i.strokeWidth = 1 * t,
        i.stroke())
    }
    setDirty(t) {
        a.dirty = t
    }
    draw(t, e, i, s) {
        a.dirty && this.recache(i);
        var n = a.width * i
          , r = a.height * i
          , o = n / 2
          , h = r / 2;
        s.save(),
        this.hit && (s.globalAlpha = .3),
        s.drawImage(a.canvas, t - o, e - h, n, r),
        s.restore()
    }
    drawCircle(t, e, i, s) {
        i *= .15,
        s.save(),
        s.translate(1, 1),
        s.beginPath(),
        s.moveTo(0 * i, 0 * i),
        s.lineTo(112 * i, 0 * i),
        s.lineTo(112 * i, 95 * i),
        s.lineTo(0 * i, 95 * i),
        s.closePath(),
        s.fillStyle = "#826cdc",
        s.strokeStyle = inviolable.storage.get("dark") ? "#fdfdfd" : "#000",
        s.lineWidth = 8 * i,
        s.beginPath(),
        s.moveTo(3 * i, 10 * i),
        s.bezierCurveTo(3 * i, 10 * i, 33.5 * i, 27 * i, 55 * i, 10 * i),
        s.bezierCurveTo(76 * i, -6 * i, 108 * i, 10 * i, 108 * i, 10 * i),
        s.lineTo(109 * i, 86 * i),
        s.bezierCurveTo(109 * i, 86 * i, 74 * i, 73.5 * i, 56.5 * i, 86 * i),
        s.bezierCurveTo(40 * i, 98 * i, 3 * i, 88.5 * i, 3 * i, 88.5 * i),
        s.lineTo(3 * i, 10 * i),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.beginPath(),
        s.lineWidth = 15 * i,
        s.moveTo(3 * i, 10 * i),
        s.lineTo(3 * i, 180 * i),
        s.stroke(),
        s.restore()
    }
    collide(t) {
        {
            var e = t.parent
              , i = e.player
              , s = t.pos.x - this.x
              , o = t.pos.y - this.y
              , a = Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2))
              , h = i._powerupsConsumed.checkpoints;
            this.scene
        }
        26 > a && i.isAlive() && -1 === h.indexOf(this.id) && (h.push(this.id),
        i.setCheckpointOnUpdate(),
        i.isGhost() === !1 && (this.hit = !0,
        this.sector.powerupCanvasDrawn = !1,
        this.scene.message.show("Checkpoint Saved", 50, "#826cdc", "#FFFFFF"),
        this.scene.sound.play("checkpoint_sound")))
    }
}