import Controls from "./controls.js";

export default class extends Controls {
	name = "fullscreen_controls";
	fullscreen = !1;
	controlsSpriteSheetData = {
		exit_fullscreen_btn: [230, 2, 76, 76],
		fullscreen_btn: [78, 2, 76, 76]
	}
	controlData = {
		fullscreen: {
			top: 60,
			right: 150,
			key: "fullscreen",
			alpha: 0.5,
			width: 76,
			height: 76
		}
	}
	constructor() {
		super(...arguments);
		this.init(...arguments);
	}
	click(component = Object.values(this.controlData).find(this.isMouseOverComponent.bind(this))) {
		// let t = this.scene.settings.fullscreen;
		// this.scene.buttonDown(t ? "exit_fullscreen" : "fullscreen");
		for (const i in this.controlData) {
			const component = this.controlData[i];
			if (this.isMouseOverComponent(component)) {
				this.scene.buttonDown(component.key);
			}
		}
	}
	update() {
		let t = this.scene.settings.fullscreen;
		this.fullscreen !== t && (this.controlData.fullscreen.image = t ? "exit_fullscreen" : "fullscreen",
		this.fullscreen = t)
		super.update()
	}
}