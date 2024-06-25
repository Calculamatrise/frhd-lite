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
		super(...arguments),
		this.init()
	}
	update() {
		let t = this.scene.settings.fullscreen;
		this.fullscreen !== t && (this.controlData.fullscreen.image = t ? "exit_fullscreen" : "fullscreen",
		this.fullscreen = t)
	}
}