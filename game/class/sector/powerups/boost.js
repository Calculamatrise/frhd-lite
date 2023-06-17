import Powerup from "../powerup.js";

export default class extends Powerup {
	name = "boost";
    realAngle = 0;
    directionX = 0;
    directionY = 0;
    constructor(t, e, i, s) {
        super(s);
        this.x = t;
        this.y = e;
        this.angle = i;
        this.realAngle = i;
        let n = (i - 180) / 360 * 2 * Math.PI;
        this.directionX = (-Math.sin(n)).toFixed(15) / 1;
        this.directionY = Math.cos(n).toFixed(15) / 1;
    }
    getCode() {
        return "B " + this.x.toString(32) + " " + this.y.toString(32) + " " + this.realAngle.toString(32)
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
    draw(t, e, i, s) {
        this.constructor.cache.dirty && this.recache(i);
        var n = this.constructor.cache.width * i
            , o = this.constructor.cache.height * i
            , a = n / 2
            , h = o / 2
            , l = t
            , c = e
            , u = (this.angle - 90) * (Math.PI / 180);
        s.translate(l, c),
        s.rotate(u),
        s.drawImage(this.constructor.cache.canvas, -a, -h, n, o),
        s.rotate(-u),
        s.translate(-l, -c)
    }
    drawCircle(t, e, i, s) {
        s.save(),
        s.strokeStyle = "rgba(0,0,0,0)",
        s.lineCap = "round",
        s.fillStyle = "#8ac832",
        s.strokeStyle = lite.storage.get('theme') == 'dark' ? "#FBFBFB" : this.outline,
        i *= .2,
        s.lineWidth = Math.max(8 * i, 1),
        s.beginPath(),
        s.moveTo(0 * i, 0 * i),
        s.lineTo(118 * i, 0 * i),
        s.lineTo(118 * i, 81 * i),
        s.lineTo(0 * i, 81 * i),
        s.closePath(),
        s.beginPath(),
        s.moveTo(3 * i, 1.5 * i),
        s.lineTo(35 * i, 1.7 * i),
        s.lineTo(66 * i, 40 * i),
        s.lineTo(34 * i, 78 * i),
        s.lineTo(4 * i, 78 * i),
        s.lineTo(36 * i, 39 * i),
        s.lineTo(3 * i, 1.5 * i),
        s.closePath(),
        s.moveTo(53 * i, 1.5 * i),
        s.lineTo(85 * i, 1.7 * i),
        s.lineTo(116 * i, 40 * i),
        s.lineTo(84 * i, 78 * i),
        s.lineTo(54 * i, 78 * i),
        s.lineTo(85 * i, 39 * i),
        s.lineTo(53 * i, 1.5 * i),
        s.closePath(),
        s.fill(),
        s.stroke()
    }
    collide(t) {
        var e = t.parent
            , i = e.player
            , s = t.pos.x - this.x
            , r = t.pos.y - this.y
            , o = Math.pow(s, 2) + Math.pow(r, 2)
            , a = e.masses
            , h = a.length
            , l = this.directionX
            , c = this.directionY;
        if (1e3 > o && i.isAlive()) {
            for (var u = h - 1; u >= 0; u--) {
                var p = a[u].pos;
                p.x += l,
                p.y += c
            }
            i.isGhost() === !1 && (this.scene.sound.play("boost_sound"),
            this.scene.message.show("Boost Engaged", 50, "#8ac832"))
        }
    }
	static cache = Object.assign({}, this.cache, {
		canvas: document.createElement("canvas"),
		width: 24,
		height: 16
	})
}