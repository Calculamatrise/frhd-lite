import Controls from "./controls.js";

export default class extends Controls {
	name = "pause_controls";
    paused = !1;
    controlsSpriteSheetData = {
		pause_btn: [230, 2, 76, 76],
		play_btn: [78, 2, 76, 76]
    }
    controlData = {
        pause: {
			alpha: 0.5,
            key: "pause",
            top: 60,
            right: 70,
			width: 76,
			height: 76
        }
    }
	constructor(t) {
        super(...arguments);
        this.init(...arguments);
    }
	click(component = Object.values(this.controlData).find(this.isMouseOverComponent.bind(this))) {
		for (const i in this.controlData) {
			const component = this.controlData[i];
			if (this.isMouseOverComponent(component)) {
				this.scene.buttonDown(component.key);
			}
		}
	}
    update() {
        let t = this.scene.state.paused;
        this.paused !== t && (t ? (this.controlData.pause.image = "play",
        this.paused = !0) : (this.controlData.pause.image = "pause",
        this.paused = !1))
		super.update();
    }
}