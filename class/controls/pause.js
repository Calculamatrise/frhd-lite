import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super();
        this.initialize(t);
    }
    name = "pause_controls";
    pauseControl = null;
    paused = !1;
    controlsSpriteSheetData = {
        frames: [[230, 2, 76, 76], [154, 2, 76, 76], [78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            "pause_btn-hover": [0],
            pause_btn: [1],
            "play_btn-hover": [2],
            play_btn: [3]
        }
    }
    controlData = {
        "pause_btn-hover": {
            key: "pause",
            top: 60,
            right: 70
        }
    }
    update() {
        let t = this.scene.state.paused;
        this.paused !== t && (t ? (this.pauseControl.gotoAndStop("play_btn-hover"),
        this.paused = !0) : (this.pauseControl.gotoAndStop("pause_btn-hover"),
        this.paused = !1))
    }
    addControls() {
        let t = new createjs.Container;
        t.addChild(this.createControl("pause_btn-hover")),
        this.controlsContainer = t,
        this.pauseControl = t.getChildByName("pause_btn-hover"),
        this.stage.addChild(t)
    }
}