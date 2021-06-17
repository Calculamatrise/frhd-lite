import s from "../math/cartesian.js";

export default class {
    constructor(t) {
        this.scene = t;
        this.game = t.game;
        this.size = new s(0, 0);
        this.center = new s(0, 0);
        this.setScreen();
    }
    game = null;
    scene = null;
    size = null;
    center = null;
    width = 0;
    height = 0;
    setScreen() {
        var t = this.game.width
            , e = this.game.height;
        this.width = t,
        this.height = e,
        this.size.x = t,
        this.size.y = e,
        this.center.x = t / 2,
        this.center.y = e / 2
    }
    update() {
        var t = this.game;
        (t.width !== this.width || t.height !== this.height) && this.setScreen()
    }
    realToScreen(t, e) {
        var i = this.scene
            , s = i.camera
            , n = i.screen;
        return (t - s.position[e]) * s.zoom + n.center[e]
    }
    toReal(t, e) {
        var i = this.scene
            , s = i.camera
            , n = i.screen;
        return (t - n.center[e]) / s.zoom + s.position[e]
    }
    close() {
        this.width = null,
        this.height = null,
        this.center = null,
        this.size = null,
        this.game = null,
        this.scene = null
    }
}