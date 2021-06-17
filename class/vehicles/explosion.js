import s from "../math/cartesian.js";
import n from "./debris.js";

export default class {
    constructor(t, e) {
        this.time = 20;
        this.gravity = new s(0, .3);
        this.scene = e;
        this.createMasses(t);
        this.positionX = t.x;
        this.positionY = t.y;
    }
    vehicleInit = this.init;
    complete = !1;
    time = 0;
    powerupsEnabled = !1;
    draw(t) {
        var e = this.time
            , i = this.positionX
            , s = this.positionY
            , n = this.scene.camera.zoom
            , h = this.scene.screen
            , l = this.scene.game.canvas.getContext("2d");
        if (l.globalAlpha = t,
        e > 0) {
            e -= 10;
            var c = h.realToScreen(i, "x")
                , u = h.realToScreen(s, "y")
                , p = 0
                , d = 6.2 * Math.random()
                , f = e * n
                , v = c + f * Math.cos(d)
                , g = u + f * Math.sin(d);
            for (l.lineWidth = 0,
            l.strokeStyle = "black",
            l.beginPath(),
            l.moveTo(v, g),
            l.fillStyle = "black"; p++ < 16; )
                f = (e + 30 * Math.random()) * n,
                v = c + f * Math.cos(d + 6.283 * p / 16),
                g = u + f * Math.sin(d + 6.283 * p / 16),
                l.lineTo(v, g);
            l.fill(),
            l.stroke()
        }
        var m = this.masses;
        for (var y in m)
            m[y].draw();
        l.globalAlpha = 1,
        this.time = e
    }
    createMasses(t) {
        this.masses = [],
        this.masses.push(new n(t,this,"#000000")),
        this.masses.push(new n(t,this,"#000000")),
        this.masses.push(new n(t,this,"#000000")),
        this.masses.push(new n(t,this,"#000000")),
        this.masses.push(new n(t,this,"#000000")),
        this.masses.push(new n(t,this,"#000000")),
        this.masses.push(new n(t,this,"#000000"))
    }
    update() {
        var t = this.masses;
        for (var e in t)
            t[e].update()
    }
}