import Controls from "./controls.js";

export default class extends Controls {
	name = "redo_undo_controls";
	controlsSpriteSheetData = {
		redo_btn: [78, 2, 76, 76],
		undo_btn: [2, 2, 76, 76]
	}
	controlData = {
		redo: {
			keys: ["ctrl", "y"],
			alpha: 0.5,
			top: 60,
			right: 160,
			width: 76,
			height: 76
		},
		undo: {
			keys: ["ctrl", "z"],
			alpha: 0.5,
			top: 60,
			right: 240,
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
			if (this.isMouseOverComponent(component)) {
				this.scene.toolHandler[(i == 'undo' ? 'revert' : 'apply') + 'Action']()
			}
		}
	}
	update() {
		let t = this.scene.toolHandler;
		this.controlData.undo.disabled = t.actionTimelinePointer === 0,
		this.controlData.redo.disabled = t.actionTimelinePointer >= t.actionTimeline.length
	}
}