import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super();
        this.initialize(t);
    }
    name = "fullscreen_controls";
    fullscreenControl = null;
    fullscreen = !1;
    controlsSpriteSheetData = {
        frames: [[230, 2, 76, 76], [154, 2, 76, 76], [78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            "exit_fullscreen_btn-hover": [0],
            exit_fullscreen_btn: [1],
            "fullscreen_btn-hover": [2],
            fullscreen_btn: [3]
        }
    }
    controlData = {
        "fullscreen_btn-hover": {
            top: 60,
            right: 150,
            key: "fullscreen"
        }
    }
    update() {
        var t = this.scene.settings.fullscreen;
        this.fullscreen !== t && (this.fullscreenControl.gotoAndStop(t ? "exit_fullscreen_btn-hover" : "fullscreen_btn-hover"),
        this.fullscreen = t)
    }
    addControls() {
        var t = new createjs.Container;
        t.addChild(this.createControl("fullscreen_btn-hover")),
        this.controlsContainer = t,
        this.fullscreenControl = t.getChildByName("fullscreen_btn-hover"),
        this.stage.addChild(t)
    }
}