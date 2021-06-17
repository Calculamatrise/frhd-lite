export default class {
    constructor(t) {
        this.scene = t;
        this.screen = t.screen;
        this.context = t.game.canvas.getContext("2d");
        this.clockwise = !1;
        this.settings = {
            radius: 10,
            color: "#1884cf"
        }
    }
    scene = null;
    clockwise = !1;
    context = null;
    screen = null;
    pixelRatio = 1;
    draw() {
        var t = this.context
            , e = this.screen
            , i = this.settings
            , s = this.scene.game.pixelRatio
            , n = i.radius
            , r = this.clockwise
            , o = this.scene.game.tickCount % 25 / 25 * 2 * Math.PI;
        0 === o && (this.clockwise && (o = 2 * Math.PI),
        this.clockwise = !this.clockwise);
        var a = r ? 0 : o
            , h = r ? o : 0
            , l = e.width - 25 * s
            , c = e.height - 25 * s
            , u = !1;
        t.beginPath(),
        t.arc(l, c, n * s, a, h, u),
        t.lineWidth = 3 * s,
        t.strokeStyle = i.color,
        t.stroke()
    }
}