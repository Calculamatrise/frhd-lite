export default class {
    constructor(t) {
        this.options = t;
        this.canvasPool = [];
        t.screen && (this.setToScreen = !0,
        this.update());
        t.cap && (this.setToScreen = !1,
        this.poolCap = t.cap);
    }
    canvasPool = null;
    poolCap = 5e3;
    setToScreen = !0;
    options = null;
    update() {
        this.setToScreen && (this.getPoolCapFromScreen(),
        this.cleanPool())
    }
    getPoolCapFromScreen() {
        var t = this.options
            , e = t.settings
            , i = t.screen
            , r = (this.options.width,
        this.options.height,
        i.width)
            , o = i.height
            , a = t.camera
            , h = a.zoom
            , l = Math.floor(e.drawSectorSize * h)
            , c = Math.ceil(r / l)
            , u = Math.ceil(o / l);
        this.poolCap = c * u + c + u
    }
    getCanvas() {
        var t = this.canvasPool.pop();
        return null == t && (t = document.createElement("canvas")),
        t
    }
    releaseCanvas(t) {
        this.canvasPool.length < this.poolCap && this.canvasPool.push(t)
    }
    cleanPool() {
        this.canvasPool.length > this.poolCap && (this.canvasPool = this.canvasPool.slice(0, this.poolCap + 1))
    }
}