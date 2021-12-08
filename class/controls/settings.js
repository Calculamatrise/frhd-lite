import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super();
        this.initialize(t);
    }
    name = "settings_controls"
    controlsSpriteSheetData = {
        frames: [[78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            "settings_btn-hover": [0],
            settings_btn: [1]
        }
    }
    controlData = {
        "settings_btn-hover": {
            top: 60,
            right: 230,
            key: "settings"
        }
    }
    update() {}
    addControls() {
        let t = new createjs.Container;
        t.addChild(this.createControl("settings_btn-hover")),
        this.controlsContainer = t,
        this.stage.addChild(t)
    }
}