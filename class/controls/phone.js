import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super();
        this.initalize(t);
    }
    name = "phone_controls";
    mainResize = n.resize;
    zoomControlsContainer = null;
    lastCheckpointButton = null;
    replayButton = null;
    controlsSpriteSheetData = {
        frames: [[782, 2, 128, 128], [652, 2, 128, 128], [522, 2, 128, 128], [912, 78, 75, 75], [392, 2, 128, 128], [912, 2, 75, 75], [262, 2, 128, 128], [132, 2, 128, 128], [2, 2, 128, 128]],
        animations: {
            accelerate: [0],
            brake: [1],
            direction: [2],
            last_checkpoint: [3],
            left: [4],
            replay: [5],
            right: [6],
            zoom_in: [7],
            zoom_out: [8]
        }
    }
    controlData = {
        brake: {
            key: "down",
            bottom: 100,
            left: 100,
            hitArea: {
                width: 250,
                height: 200,
                x: -30,
                y: -15
            }
        },
        direction: {
            key: "z",
            bottom: 250,
            right: 100,
            hitArea: {
                width: 200,
                height: 200,
                x: -20,
                y: -65
            }
        },
        forward: {
            key: "up",
            bottom: 250,
            left: 100,
            hitArea: {
                width: 250,
                height: 200,
                x: -30,
                y: -65
            }
        },
        last_checkpoint: {
            key: "enter",
            top: 60,
            left: 160
        },
        left: {
            key: "left",
            bottom: 100,
            right: 250,
            hitArea: {
                width: 230,
                height: 230,
                x: -100,
                y: -65
            }
        },
        right: {
            key: "right",
            bottom: 100,
            right: 100,
            hitArea: {
                width: 200,
                height: 200,
                x: -10,
                y: -15
            }
        },
        replay: {
            key: "restart",
            top: 60,
            left: 80
        },
        zoom_in: {
            key: "zoom_increase",
            bottom: 100,
            right: 100
        },
        zoom_out: {
            key: "zoom_decrease",
            bottom: 100,
            left: 100
        }
    }
    addControls() {
        var t = this.createControl("last_checkpoint")
        , e = this.createControl("replay")
        , i = this.createControl("zoom_in")
        , s = this.createControl("zoom_out")
        , n = new createjs.Container;
        n.addChild(this.createControl("left")),
        n.addChild(this.createControl("right")),
        n.addChild(this.createControl("forward")),
        n.addChild(this.createControl("brake")),
        n.addChild(this.createControl("direction")),
        n.addChild(t),
        n.addChild(e),
        n.addChild(i),
        n.addChild(s);
        var r = new createjs.Container;
        r.addChild(i),
        r.addChild(s),
        r.visibility = !1,
        this.lastCheckpointButton = t,
        this.replayButton = e,
        this.controlsContainer = n,
        this.zoomControlsContainer = r,
        this.stage.addChild(n),
        this.stage.addChild(r)
    }
    resize() {
        var t = this.scene.game
        , e = (this.scene.screen,
        t.width)
        , i = t.height
        , s = t.pixelRatio
        , n = this.zoomControlsContainer.children;
        for (var r in n) {
            var o = n[r]
            , a = o.buttonDetails;
            a.bottom && (o.y = i - a.bottom * (s / 2)),
            a.left && (o.x = a.left * (s / 2)),
            a.right && (o.x = e - a.right * (s / 2)),
            a.top && (o.y = a.top * (s / 2)),
            o.scaleX = o.scaleY = s / 2
        }
        this.mainResize()
    }
    setZoomControlsVisibilty(t) {
        this.zoomControlsContainer.visible = t
    }
    update() {
        var t = this.scene;
        this.lastCheckpointButton.visible = t.playerManager.firstPlayer.hasCheckpoints() ? !0 : !1
    }
}