import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super();
        this.initialize(t);
    }
    name = "redo_undo_controls";
    controlsSpriteSheetData = {
        frames: [[78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            redo: [0],
            undo: [1]
        }
    }
    controlData = {
        redo: {
            keys: ["ctrl", "y"],
            top: 60,
            right: 160
        },
        undo: {
            keys: ["ctrl", "z"],
            top: 60,
            right: 240
        }
    }
    addControls() {
        let t = new createjs.Container;
        t.addChild(this.createControl("redo")),
        t.addChild(this.createControl("undo")),
        this.controlsContainer = t,
        this.stage.addChild(t)
    }
    update() {
        let t = this.scene
          , e = this.scene.state.paused;
        t.controls && this.controlsContainer.visible !== e && (this.controlsContainer.visible = e)
    }
}