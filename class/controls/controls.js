export default class {
    constructor(t) {
        this.scene = t,
        this.game = t.game,
        this.assets = t.assets,
        this.settings = t.settings,
        this.mouse = t.mouse,
        this.playerManager = t.playerManager
    }
    defaultControlOptions = {
        visible: !0
    }
    name = null;
    controlsSpriteSheetData = null;
    controlData = null;
    game = null;
    scene = null;
    settings = null;
    controlsContainer = null;
    controlsSprite = null;
    gamepad = null;
    addControls() {}
    isVisible() {
        return this.controlsContainer.visible
    }
    hide() {
        this.controlsContainer.visible = !1
    }
    show() {
        this.controlsContainer.visible = !0
    }
    setVisibility(t) {
        this.controlsContainer.visible = t
    }
    mouseOver(t) {
        t.target.alpha = .8,
        this.mouse.enabled = !1
    }
    mouseOut(t) {
        t.target.alpha = .5,
        this.mouse.enabled = !0
    }
    controlDown(t) {
        let e = this.playerManager.firstPlayer.getGamepad();
        if (t.target.buttonDetails.key) {
            e.setButtonDown(t.target.buttonDetails.key)
        }
        if (t.target.buttonDetails.keys)
            for (var r = t.target.buttonDetails.keys, o = r.length, a = 0; o > a; a++) {
                e.setButtonDown(r[a])
            }
            t.target.buttonDetails.downCallback && t.target.buttonDetails.downCallback(t),
        this.settings.mobile && (this.mouse.enabled = !1),
        t.target.alpha = 1
    }
    controlUp(t) {
        let e = this.playerManager.firstPlayer.getGamepad();
        if (t.target.buttonDetails.key) {
            e.setButtonUp(t.target.buttonDetails.key)
        }
        if (t.target.buttonDetails.keys)
            for (var r = t.target.buttonDetails.keys, o = r.length, a = 0; o > a; a++) {
                e.setButtonUp(r[a])
            }
            t.target.buttonDetails.upCallback && t.target.buttonDetails.upCallback(t),
        this.settings.mobile ? (this.mouse.enabled = !0,
            t.target.alpha = .5) : t.target.alpha = .8
    }
    close() {}
    update() {}
    resize() {
        if (!this.controlsContainer) return;
        for (const t in this.controlsContainer.children) {
            this.controlsContainer.children[t].buttonDetails.bottom && (this.controlsContainer.children[t].y = this.scene.game.height - this.controlsContainer.children[t].buttonDetails.bottom * (this.scene.game.pixelRatio / 2)),
            this.controlsContainer.children[t].buttonDetails.left && (this.controlsContainer.children[t].x = this.controlsContainer.children[t].buttonDetails.left * (this.scene.game.pixelRatio / 2)),
            this.controlsContainer.children[t].buttonDetails.right && (this.controlsContainer.children[t].x = this.scene.game.width - this.controlsContainer.children[t].buttonDetails.right * (this.scene.game.pixelRatio / 2)),
            this.controlsContainer.children[t].buttonDetails.top && (this.controlsContainer.children[t].y = this.controlsContainer.children[t].buttonDetails.top * (this.scene.game.pixelRatio / 2)),
            this.controlsContainer.children[t].scaleX = this.controlsContainer.children[t].scaleY = this.scene.game.pixelRatio / 2
        }
    }
    check(t) {
        if (t.x > this.container.x && t.x < this.container.x + 38 && t.y > this.container.y && t.y < this.container.y + 38) {
            return true;
        }
        return false;
    }
}