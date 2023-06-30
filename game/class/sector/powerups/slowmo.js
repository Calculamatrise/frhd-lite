import Powerup from "../powerup.js";

export default class extends Powerup {
	name = "slowmo";
    constructor(t, e, i) {
        super(i);
        this.x = t;
        this.y = e;
    }
    recache(t) {
        this.constructor.cache.dirty = !1;
        var e = this.constructor.cache.canvas;
        e.width = this.constructor.cache.width * t,
        e.height = this.constructor.cache.height * t;
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
    getCode() {
        return "S " + this.x.toString(32) + " " + this.y.toString(32)
    }
    draw(t, e, i, s) {
        this.constructor.cache.dirty && this.recache(i);
        var n = this.constructor.cache.width * i
          , r = this.constructor.cache.height * i
          , a = n / 2
          , h = r / 2;
        s.drawImage(this.constructor.cache.canvas, t - a, e - h, n, r)
    }
    collide(t) {
        var e = t.parent
          , i = e.player
          , s = t.pos.x - this.x
          , o = t.pos.y - this.y
          , a = Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2));
        !this.hit && 26 > a && i.isAlive() && (e.slow = !0,
        i.isGhost() === !1 && (this.scene.sound.play("slowmo_sound"),
        this.scene.message.show("Slow Motion", 50, "#FFFFFF", "#000000")))
    }
    drawCircle(t, e, i, s) {
        s.save(),
        s.beginPath(),
        i *= .2,
        s.moveTo(0 * i, 0 * i),
        s.lineTo(116 * i, 0 * i),
        s.lineTo(116 * i, 114 * i),
        s.lineTo(0 * i, 114 * i),
        s.closePath(),
        s.fillStyle = "#ffffff00",
        s.strokeStyle = /^(dark|midnight)$/i.test(lite.storage.get('theme')) ? "#FBFBFB" : this.outline,
        s.lineWidth = Math.max(3 * i, .5),
        s.beginPath(),
        s.moveTo(58 * i, 111 * i),
        s.bezierCurveTo(89 * i, 111 * i, 114 * i, 87 * i, 114 * i, 56 * i),
        s.bezierCurveTo(114 * i, 26 * i, 89 * i, 2 * i, 58 * i, 2 * i),
        s.bezierCurveTo(27.1748289 * i, 2 * i, 2 * i, 26 * i, 2 * i, 56 * i),
        s.bezierCurveTo(2 * i, 87 * i, 27.1748289 * i, 111 * i, 58 * i, 111 * i),
        s.closePath(),
        s.moveTo(58 * i, 103 * i),
        s.bezierCurveTo(84 * i, 103 * i, 106 * i, 82 * i, 106 * i, 56 * i),
        s.bezierCurveTo(106 * i, 30 * i, 84 * i, 9 * i, 58 * i, 9 * i),
        s.bezierCurveTo(31 * i, 9 * i, 10 * i, 30 * i, 10 * i, 56 * i),
        s.bezierCurveTo(10 * i, 82 * i, 31 * i, 103 * i, 58 * i, 103 * i),
        s.closePath(),
        s.moveTo(58 * i, 55 * i),
        s.lineTo(37 * i, 23 * i),
        s.lineTo(35 * i, 25 * i),
        s.lineTo(56 * i, 57 * i),
        s.lineTo(58 * i, 55 * i),
        s.closePath(),
        s.moveTo(58.5 * i, 59 * i),
        s.lineTo(81.5 * i, 59 * i),
        s.lineTo(81.5 * i, 56 * i),
        s.lineTo(58.5 * i, 56 * i),
        s.lineTo(58.5 * i, 59 * i),
        s.closePath(),
        s.moveTo(98.5 * i, 59 * i),
        s.lineTo(105.5 * i, 59 * i),
        s.lineTo(105.5 * i, 56 * i),
        s.lineTo(98.5 * i, 56 * i),
        s.lineTo(98.5 * i, 59 * i),
        s.closePath(),
        s.moveTo(11.5 * i, 59 * i),
        s.lineTo(18.5 * i, 59 * i),
        s.lineTo(18.5 * i, 56 * i),
        s.lineTo(11.5 * i, 56 * i),
        s.lineTo(11.5 * i, 59 * i),
        s.closePath(),
        s.moveTo(57 * i, 96 * i),
        s.lineTo(57 * i, 101.5 * i),
        s.lineTo(60 * i, 101.5 * i),
        s.lineTo(60 * i, 96 * i),
        s.lineTo(57 * i, 96 * i),
        s.closePath(),
        s.moveTo(57 * i, 12 * i),
        s.lineTo(57 * i, 17.5 * i),
        s.lineTo(60 * i, 17.5 * i),
        s.lineTo(60 * i, 12 * i),
        s.lineTo(57 * i, 12 * i),
        s.closePath(),
        s.fill(),
        s.stroke()
    }
	static cache = Object.assign({}, this.cache, {
		canvas: document.createElement("canvas"),
		width: 24,
		height: 24
	})
}