import Mass from "./mass.js";

let l = [1, .7, .8, .9, .5, 1, .7, 1];

export default class extends Mass {
    constructor(t, e, i) {
        super(t, e);
        this.color = i;
        this.pos.x = t.x + 5 * (Math.random() - Math.random());
        this.pos.y = t.y + 5 * (Math.random() - Math.random());
        this.old.x = this.pos.x;
        this.old.y = this.pos.y;
        this.vel.y = 11 * (Math.random() - Math.random());
        this.vel.x = 11 * (Math.random() - Math.random());
        this.radius = 2 * Math.random() * 5;
        this.angle = 6.2 * Math.random();
        this.speed = 1 * Math.random() - 1 * Math.random();
        this.friction = .05;
    }
    color = "black";
    drive(t, e) {
        var i = this.vel
          , s = this.pos;
        this.speed = (t * i.x + e * i.y) / this.radius,
        this.angle += this.speed;
        var n = -(t * i.x + e * i.y) * this.friction;
        s.x += t * n,
        s.y += e * n;
        var a = Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2));
        if (a > 0) {
            var h = -e / a
              , l = t / a
              , c = .8 * (h * i.x + l * i.y);
            this.old.x += h * c,
            this.old.y += l * c
        }
    }
    update = () => {
        this.angle += this.speed,
        super.update();
    }
    draw() {
        var t = this.scene.screen
          , e = this.scene.camera
          , i = t.realToScreen(this.pos.x, "x")
          , s = t.realToScreen(this.pos.y, "y")
          , n = 0
          , r = e.zoom
          , o = this.angle
          , c = l[0] * r * this.radius
          , u = i + c * Math.cos(o)
          , p = s + c * Math.sin(o)
          , d = this.scene.game.canvas.getContext("2d");
        for (d.lineWidth = 1 * r,
        d.strokeStyle = window.lite.getVar("dark") && "#fff" || "#000",
        d.beginPath(),
        d.moveTo(u, p),
        d.fillStyle = this.color; n++ < 8; )
            c = l[n - 1] * r * this.radius,
            u = i + c * Math.cos(o + 6.283 * n / 8),
            p = s + c * Math.sin(o + 6.283 * n / 8),
            d.lineTo(u, p);
        d.fill(),
        d.stroke()
    }
}