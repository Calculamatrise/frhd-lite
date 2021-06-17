import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super();
        let e = t.settings;
        if (e.fullscreenAvailable === !1) {
            let i = this.controlData["settings_btn-hover"];
            i.top = 60;
            i.right = 150;
        }
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
        var t = new createjs.Container;
        t.addChild(this.createControl("settings_btn-hover")),
        this.controlsContainer = t,
        this.stage.addChild(t)
    }
}