import s from "../../libs/lodash.js";

export default class {
    defaultControlOptions = {
        visible: !0
    }
    name = null;
    controlsSpriteSheetData = null;
    controlData = null;
    game = null;
    scene = null;
    settings = null;
    stage = null;
    controlsContainer = null;
    controlsSprite = null;
    gamepad = null;
    initialize(t) {
        this.scene = t,
        this.game = t.game,
        this.assets = t.assets,
        this.settings = t.settings,
        this.stage = t.game.stage,
        this.mouse = t.mouse,
        this.playerManager = t.playerManager,
        this.createSprite(),
        this.addControls(),
        this.resize()
    }
    addControls() {}
    createSprite() {
        var t = this.scene.assets.getResult(this.name)
            , e = this.controlsSpriteSheetData;
        e.images = [t];
        var i = new createjs.SpriteSheet(e)
            , s = new createjs.Sprite(i);
        this.controlsSprite = s
    }
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
    createControl(t) {
        var e = this.controlsSprite
            , i = s.extend({}, this.defaultControlOptions, this.controlData[t])
            , n = e.clone();
        n.gotoAndStop(t),
        n.buttonDetails = i,
        n.cursor = "pointer",
        n.on("mousedown", this.controlDown.bind(this)),
        n.on("pressup", this.controlUp.bind(this)),
        n.on("mouseover", this.mouseOver.bind(this)),
        n.on("mouseout", this.mouseOut.bind(this));
        var r = n.getBounds();
        if (n.regX = r.width / 2,
        n.regY = r.height / 2,
        n.alpha = .5,
        n.name = t,
        n.visible = i.visible,
        i.hitArea) {
            var o = i.hitArea
                , a = new createjs.Shape;
            o.radius ? a.graphics.beginFill("#000").drawCircle(o.x, o.y, o.radius) : a.graphics.beginFill("#000").drawRect(o.x, o.y, o.width, o.height),
            n.hitArea = a
        }
        return n
    }
    mouseOver(t) {
        var e = t.target;
        e.alpha = .8,
        this.mouse.enabled = !1
    }
    mouseOut(t) {
        var e = t.target;
        e.alpha = .5,
        this.mouse.enabled = !0
    }
    controlDown(t) {
        var e = t.target
            , i = e.buttonDetails
            , s = this.playerManager.firstPlayer.getGamepad();
        if (i.key) {
            var n = i.key;
            s.setButtonDown(n)
        }
        if (i.keys)
            for (var r = i.keys, o = r.length, a = 0; o > a; a++) {
                var n = r[a];
                s.setButtonDown(n)
            }
        i.downCallback && i.downCallback(t),
        this.settings.mobile && (this.mouse.enabled = !1),
        e.alpha = 1
    }
    controlUp(t) {
        var e = t.target
            , i = e.buttonDetails
            , s = this.playerManager.firstPlayer.getGamepad();
        if (i.key) {
            var n = i.key;
            s.setButtonUp(n)
        }
        if (i.keys)
            for (var r = i.keys, o = r.length, a = 0; o > a; a++) {
                var n = r[a];
                s.setButtonUp(n)
            }
        i.upCallback && i.upCallback(t),
        this.settings.mobile ? (this.mouse.enabled = !0,
        e.alpha = .5) : e.alpha = .8
    }
    close() {}
    update() {}
    resize() {
        var t = this.scene.game
            , e = (this.scene.screen,
        t.width)
            , i = t.height
            , s = t.pixelRatio
            , n = this.controlsContainer.children;
        for (var r in n) {
            var o = n[r]
                , a = o.buttonDetails;
            a.bottom && (o.y = i - a.bottom * (s / 2)),
            a.left && (o.x = a.left * (s / 2)),
            a.right && (o.x = e - a.right * (s / 2)),
            a.top && (o.y = a.top * (s / 2)),
            o.scaleX = o.scaleY = s / 2
        }
    }
}