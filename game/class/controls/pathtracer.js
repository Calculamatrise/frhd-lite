import Controls from "./controls.js";

export default class extends Controls {
	name = "phone_controls";
	controlsSpriteSheetData = {
		checkpoint_btn: [912, 78, 73, 73]
	}
	controlData = {
		checkpoint: {
			disabled: true,
			top: 60,
			right: 310,
			key: "checkpoint",
			alpha: 0.5,
			width: 76,
			height: 76
		}
	}
	constructor() {
		super(...arguments),
		this.init()
	}
	click() {
		for (const i in this.controlData) {
			const component = this.controlData[i];
			if (component.disabled) continue;
			if (this.isMouseOverComponent(component)) {
				component.active = !component.active,
				this.scene.toolHandler.setTool(component.active ? 'pathtracer' : 'camera')
			}
		}
	}
}