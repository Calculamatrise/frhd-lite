import Powerup from "../powerup.js";

let r = {
    canvas: document.createElement("canvas"),
    dirty: !0,
    width: 25,
    height: 25
}

export default class extends Powerup {
    constructor(t, e, i) {
        super();
        this.x = t;
        this.y = e;
        this.init(i);
    }
    x = 0;
    y = 0;
    name = "antigravity";
    getCode() {
        return "A " + this.x.toString(32) + " " + this.y.toString(32)
    }
    recache(t) {
        r.dirty = !1;
        var e = r.canvas;
        e.width = r.width * t,
        e.height = r.height * t;
        var i = e.getContext("2d")
            , s = e.width / 2
            , n = e.height / 2;
        this.drawPowerup(s, n, t, i),
        this.settings.developerMode && (i.beginPath(),
        i.rect(0, 0, e.width, e.height),
        i.strokeStyle = "red",
        i.strokeWidth = 1 * t,
        i.stroke())
    }
    setDirty(t) {
        r.dirty = t
    }
    draw(t, e, i, s) {
        r.dirty && this.recache(i);
        var n = r.width * i
            , o = r.height * i
            , a = n / 2
            , h = o / 2
            , l = t
            , c = e;
        s.translate(l, c),
        s.drawImage(r.canvas, -a, -h, n, o),
        s.translate(-l, -c)
    }
    drawPowerup(t, e, i, s) {
        i *= .5,
        s.save(),
        s.beginPath(),
        s.scale(i, i),
        s.moveTo(0, 0),
        s.lineTo(50, 0),
        s.lineTo(50, 50),
        s.lineTo(0, 50),
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
        s.translate(-726, -131),
        s.save(),
        s.translate(726, 131),
        s.save(),
        s.fillStyle = "#08faf3",
        s.strokeStyle = "#000000",
        s.lineWidth = 2,
        s.beginPath(),
        s.moveTo(25, 36),
        s.bezierCurveTo(18.9251591, 36, 14, 31.0751824, 14, 25),
        s.bezierCurveTo(14, 18.9248176, 18.9251591, 14, 25, 14),
        s.bezierCurveTo(31.0751824, 14, 36, 18.9248176, 36, 25),
        s.bezierCurveTo(36, 31.0751824, 31.0751824, 36, 25, 36),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.save(),
        s.fillStyle = "#000000",
        s.beginPath(),
        s.moveTo(25, 35),
        s.bezierCurveTo(30.5228976, 35, 35, 30.5228976, 35, 25),
        s.bezierCurveTo(35, 19.4771024, 30.5228976, 15, 25, 15),
        s.bezierCurveTo(19.4773211, 15, 15, 19.4772251, 15, 25),
        s.bezierCurveTo(15, 30.5227749, 19.4773211, 35, 25, 35),
        s.closePath(),
        s.moveTo(25, 37),
        s.bezierCurveTo(18.3727612, 37, 13, 31.627354, 13, 25),
        s.bezierCurveTo(13, 18.372646, 18.3727612, 13, 25, 13),
        s.bezierCurveTo(31.6274671, 13, 37, 18.3725329, 37, 25),
        s.bezierCurveTo(37, 31.6274671, 31.6274671, 37, 25, 37),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.save(),
        s.fillStyle = "#000000",
        s.beginPath(),
        s.moveTo(1.0370609, 29.702878),
        s.lineTo(.571767448, 27.3196417),
        s.lineTo(10.8190136, 27.3196417),
        s.lineTo(11.2235626, 28.7886215),
        s.bezierCurveTo(12.5553335, 33.6244869, 16.3752072, 37.4442862, 21.2110994, 38.7761385),
        s.lineTo(22.6800518, 39.1807024),
        s.lineTo(22.6800518, 49.4279421),
        s.lineTo(20.2968028, 48.9626301),
        s.bezierCurveTo(10.5816525, 47.0658182, 2.93381735, 39.4180779, 1.0370609, 29.702878),
        s.closePath(),
        s.moveTo(48.9629391, 20.297122),
        s.lineTo(49.4282326, 22.6803583),
        s.lineTo(39.1809639, 22.6803583),
        s.lineTo(38.7764299, 21.2113511),
        s.bezierCurveTo(37.4446547, 16.3752014, 33.624798, 12.5554192, 28.7886215, 11.2235626),
        s.lineTo(27.3196417, 10.8190136),
        s.lineTo(27.3196417, .571783441),
        s.lineTo(29.7028653, 1.03705842),
        s.bezierCurveTo(39.418382, 2.93381152, 47.0661305, 10.5816549, 48.9629391, 20.297122),
        s.closePath(),
        s.moveTo(11.2235701, 21.2113511),
        s.lineTo(10.8190361, 22.6803583),
        s.lineTo(.571767448, 22.6803583),
        s.lineTo(1.0370609, 20.297122),
        s.bezierCurveTo(2.93380373, 10.5819918, 10.5815702, 2.93422536, 20.2967378, 1.03707606),
        s.lineTo(22.6800518, .571669532),
        s.lineTo(22.6800518, 10.8189911),
        s.lineTo(21.2110994, 11.223555),
        s.bezierCurveTo(16.3751604, 12.5554202, 12.5553324, 16.3752482, 11.2235701, 21.2113511),
        s.closePath(),
        s.moveTo(29.7028653, 48.9626351),
        s.lineTo(27.3196417, 49.4279101),
        s.lineTo(27.3196417, 39.1806799),
        s.lineTo(28.7886215, 38.7761309),
        s.bezierCurveTo(33.6247513, 37.4442873, 37.4446537, 33.6245336, 38.7764374, 28.7886215),
        s.lineTo(39.1809864, 27.3196417),
        s.lineTo(49.4282326, 27.3196417),
        s.lineTo(48.9629391, 29.702878),
        s.bezierCurveTo(47.0661446, 39.4182726, 39.4184545, 47.0658678, 29.7028653, 48.9626351),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.save(),
        s.fillStyle = "#08faf3",
        s.beginPath(),
        s.moveTo(3, 29.3196417),
        s.bezierCurveTo(4.74079001, 38.2359804, 11.7640196, 45.2589035, 20.6800518, 46.9996935),
        s.lineTo(20.6800518, 40.7043471),
        s.bezierCurveTo(15.1649961, 39.1854465, 10.814247, 34.8350039, 9.29534642, 29.3196417),
        s.lineTo(3, 29.3196417),
        s.closePath(),
        s.moveTo(47, 20.6803583),
        s.bezierCurveTo(45.25921, 11.7640196, 38.2362869, 4.74079001, 29.3196417, 3),
        s.lineTo(29.3196417, 9.29534642),
        s.bezierCurveTo(34.8350039, 10.814247, 39.185753, 15.1646897, 40.7046536, 20.6803583),
        s.lineTo(47, 20.6803583),
        s.closePath(),
        s.moveTo(9.29534642, 20.6803583),
        s.bezierCurveTo(10.814247, 15.1646897, 15.1649961, 10.814247, 20.6800518, 9.29534642),
        s.lineTo(20.6800518, 3),
        s.bezierCurveTo(11.7640196, 4.74109649, 4.74079001, 11.7640196, 3, 20.6803583),
        s.lineTo(9.29534642, 20.6803583),
        s.closePath(),
        s.moveTo(29.3196417, 46.9996935),
        s.bezierCurveTo(38.2362869, 45.2589035, 45.25921, 38.2359804, 47, 29.3196417),
        s.lineTo(40.7046536, 29.3196417),
        s.bezierCurveTo(39.185753, 34.8350039, 34.8350039, 39.1854465, 29.3196417, 40.7043471),
        s.lineTo(29.3196417, 46.9996935),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore()
    }
    collide(t) {
        {
            var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , r = t.pos.y - this.y
                , o = n(s, 2) + n(r, 2)
                , a = e.masses;
            a.length
        }
        1e3 > o && i.isAlive() && (i.isGhost() === !1 && ((0 != e.gravity.x || 0 != e.gravity.y) && this.scene.sound.play("antigravity_sound", .3),
        this.scene.message.show("Antigravity Engaged", 50, "#08faf3")),
        e.gravity.x = 0,
        e.gravity.y = 0)
    }
}