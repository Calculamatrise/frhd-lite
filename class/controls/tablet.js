import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super();
        this.initialize(t);
    }
    name = "tablet_controls";
    mainResize = this.resize;
    zoomControlsContainer = null;
    lastCheckpointButton = null;
    controlsSpriteSheetData = {
        frames: [[154, 306, 150, 150], [154, 154, 150, 150], [382, 154, 75, 75], [306, 2, 150, 150], [154, 2, 150, 150], [306, 154, 75, 75], [2, 306, 150, 150], [2, 154, 150, 150], [2, 2, 150, 150]],
        animations: {
            accelerate: [0],
            brake: [1],
            last_checkpoint: [2],
            direction: [3],
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
            bottom: 120,
            left: 285,
            hitArea: {
                radius: 150,
                x: 75,
                y: 90
            }
        },
        direction: {
            key: "z",
            bottom: 285,
            right: 450,
            hitArea: {
                radius: 150,
                x: 40,
                y: 40
            }
        },
        forward: {
            key: "up",
            bottom: 285,
            left: 140,
            hitArea: {
                radius: 150,
                x: 75,
                y: 75
            }
        },
        last_checkpoint: {
            key: "enter",
            top: 60,
            left: 160
        },
        left: {
            key: "left",
            bottom: 120,
            right: 285,
            hitArea: {
                radius: 150,
                x: 75,
                y: 75
            }
        },
        right: {
            key: "right",
            bottom: 285,
            right: 140,
            hitArea: {
                radius: 150,
                x: 100,
                y: 40
            }
        },
        replay: {
            key: "restart",
            top: 60,
            left: 80
        },
        zoom_in: {
            key: "zoom_increase",
            bottom: 285,
            right: 140
        },
        zoom_out: {
            key: "zoom_decrease",
            bottom: 285,
            left: 140
        }
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
    addControls() {
        var t = this.createControl("zoom_in")
            , e = this.createControl("zoom_out")
            , i = new createjs.Container;
        i.addChild(this.createControl("left")),
        i.addChild(this.createControl("right")),
        i.addChild(this.createControl("forward")),
        i.addChild(this.createControl("brake")),
        i.addChild(this.createControl("direction")),
        i.addChild(this.createControl("last_checkpoint")),
        i.addChild(this.createControl("replay"));
        var s = new createjs.Container;
        s.addChild(t),
        s.addChild(e),
        s.visible = !1,
        this.lastCheckpointButton = i.getChildByName("last_checkpoint"),
        this.controlsContainer = i,
        this.zoomControlsContainer = s,
        this.stage.addChild(i),
        this.stage.addChild(s)
    }
    update() {
        var t = this.scene;
        this.lastCheckpointButton.visible = t.playerManager.firstPlayer.hasCheckpoints() ? !0 : !1
    }
}