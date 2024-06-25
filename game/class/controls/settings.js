import Controls from "./controls.js";

export default class extends Controls {
	name = "settings_controls"
	controlsSpriteSheetData = {
		settings_btn: [78, 2, 76, 76]
	}
	controlData = {
		settings: {
			top: 60,
			right: 230,
			key: "settings",
			alpha: 0.5,
			width: 76,
			height: 76
		}
	}
	constructor() {
		super(...arguments),
		this.init()
	}
}