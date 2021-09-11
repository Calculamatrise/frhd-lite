let r = {}
    , o = 0
    , a = 0
    , h = 2.2
    , l = 1
    , c = 115
    , u = 112
    , p = .17;

export default class ForwardCap extends GameInventoryManager.HeadClass {
    constructor(t) {
        super();
        this.drawAngle = 0;
        this.colors = t;
        this.createVersion();
    }
    versionName = "";
    dirty = !0;
    getVersions() {
        return r
    }
    cache(t) {
        var e = r[this.versionName];
        e.dirty = !1;
        var t = Math.max(t, 1)
        , i = c * t * p
        , s = u * t * p
        , h = e.canvas;
        h.width = i,
        h.height = s,
        o = h.width / 2,
        a = h.height / 2;
        var l = h.getContext("2d")
        , d = p * t
        , f = this.colors;
        l.save(),
        l.scale(d, d),
        l.translate(0, 0),
        l.beginPath(),
        l.strokeStyle = inviolable.storage.get("dark") ? "#fdfdfd" : "rgba(0,0,0,0)",
        l.lineCap = "butt",
        l.lineJoin = "miter",
        l.miterLimit = 4,
        l.save(),
        l.fillStyle = "#ffffff",
        l.beginPath(),
        l.arc(42.4, 52.5, 30.3, 0, 6.283185307179586, !0),
        l.closePath(),
        l.fill(),
        l.stroke(),
        l.restore(),
        l.save(),
        l.fillStyle = f.back,
        l.beginPath(),
        l.moveTo(71.624, 44.496),
        l.bezierCurveTo(68.112, 31.647, 56.363, 22.2, 42.4, 22.2),
        l.bezierCurveTo(25.665999999999997, 22.2, 12.099999999999998, 35.765, 12.099999999999998, 52.5),
        l.bezierCurveTo(12.099999999999998, 55.771, 12.623999999999999, 58.916, 13.582999999999998, 61.867000000000004),
        l.lineTo(71.624, 44.496),
        l.closePath(),
        l.fill(),
        l.stroke(),
        l.restore(),
        f.front && (l.save(),
        l.beginPath(),
        l.moveTo(76.917, 38.393),
        l.bezierCurveTo(71.677, 25.617, 59.54900000000001, 16.371000000000002, 45.172, 15.309000000000001),
        l.bezierCurveTo(47.57899999999999, 22.559, 50.918, 33.862, 52.501, 44.894999999999996),
        l.bezierCurveTo(60.643, 42.731, 68.775, 40.566, 76.917, 38.393),
        l.closePath(),
        l.fillStyle = f.front,
        l.fill(),
        l.stroke(),
        l.restore()),
        l.save(),
        l.beginPath(),
        l.moveTo(42.4, 22.2),
        l.bezierCurveTo(59.134, 22.2, 72.7, 35.765, 72.7, 52.5),
        l.bezierCurveTo(72.7, 69.235, 59.135, 82.8, 42.4, 82.8),
        l.bezierCurveTo(25.665, 82.8, 12.1, 69.234, 12.1, 52.5),
        l.bezierCurveTo(12.1, 35.766000000000005, 25.666, 22.2, 42.4, 22.2),
        l.moveTo(42.4, 15.2),
        l.bezierCurveTo(21.833, 15.2, 5.100000000000001, 31.932, 5.100000000000001, 52.5),
        l.bezierCurveTo(5.100000000000001, 73.068, 21.832, 89.8, 42.4, 89.8),
        l.bezierCurveTo(62.967999999999996, 89.8, 79.69999999999999, 73.068, 79.69999999999999, 52.5),
        l.bezierCurveTo(79.69999999999999, 31.932000000000002, 62.968, 15.2, 42.4, 15.2),
        l.lineTo(42.4, 15.2),
        l.closePath(),
        l.fill(),
        l.stroke(),
        l.restore(),
        l.save(),
        l.beginPath(),
        l.moveTo(16.3, 66.85),
        l.bezierCurveTo(41.8, 60.148999999999994, 67.2, 53.449999999999996, 92.601, 46.648999999999994),
        l.bezierCurveTo(96.201, 45.648999999999994, 99.8, 44.748999999999995, 103.5, 43.748999999999995),
        l.bezierCurveTo(111, 41.748999999999995, 107.8, 30.148999999999994, 100.3, 32.148999999999994),
        l.bezierCurveTo(74.901, 38.94899999999999, 49.400999999999996, 45.748999999999995, 24, 52.449),
        l.bezierCurveTo(20.4, 53.449, 16.8, 54.349, 13.101, 55.349),
        l.bezierCurveTo(5.7, 57.35, 8.9, 68.85, 16.3, 66.85),
        l.lineTo(16.3, 66.85),
        l.closePath(),
        l.fill(),
        l.stroke(),
        l.restore()
    }
    setDirty() {
        r[this.versionName].dirty = !0
    }
    getBaseWidth() {
        return c
    }
    getBaseHeight() {
        return u
    }
    getDrawOffsetX() {
        return h
    }
    getDrawOffsetY() {
        return l
    }
    getScale() {
        return p
    }
}

GameInventoryManager && GameInventoryManager.register("forward_cap", ForwardCap);