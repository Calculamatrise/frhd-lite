export default class {
    constructor(t) {
        this.game = t.scene.game,
        this.scene = t.scene,
        this.settings = this.game.settings,
        this.remove = !1
    }
    scene = null;
    angle = 0;
    x = 0;
    y = 0;
    name = null;
    sector = null;
    settings = null;
    remove = !1;
    getCode() {}
    draw() {}
    erase(t, e) {
        var i = !1;
        if (!this.remove) {
            var r = Math.sqrt(Math.pow(t.x - this.x, 2) + Math.pow(t.y - this.y, 2));
            e >= r && (i = [this],
            this.removeAllReferences())
        }
        return i
    }
    removeAllReferences() {
        this.remove = !0,
        this.sector && (this.sector.powerupCanvasDrawn = !1,
        this.sector.dirty = !0,
        this.sector = null),
        this.scene.track.cleanPowerups()
    }
    collide(t) {
        var e = t.pos.x - this.x
          , i = t.pos.y - this.y
          , r = Math.sqrt(Math.pow(e, 2) + Math.pow(i, 2));
        !this.hit && 26 > r && (this.hit = !0,
        this.sector.powerupCanvasDrawn = !1)
    }
    addSectorReference(t) {
        this.sector = t
    }
    move(t, e) {
        this.x += parseInt(t) | 0;
        this.y += parseInt(e) | 0;
        return this;
    }
}