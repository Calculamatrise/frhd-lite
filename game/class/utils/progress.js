import GUI from "../interfaces/gui.js";
import Component from "../interfaces/component.js";

export default class extends GUI {
	bar = new Component({
		width: 0
	}, this.container);
	constructor(t) {
		super(t, {
			borderWidth: 2,
			borderRadius: 30,
			font: { size: 12 },
			inline: true,
			y: 32
		}),
		this.settings = t.settings;
		this.sprite = t.assets.getResult("targets_icon")
	}
	centerContainer() {
		let t = this.scene.screen
		  , e = this.container
		  , i = e.width;
		e.x = t.width / 2 / window.devicePixelRatio - i / 2,
		e.y = 40
	}
	draw(t) {
		t.roundRect(t.canvas.width / 2, t.canvas.height - 12, t.canvas.width / 3, Math.min(12, t.canvas.height / 12), 6);
	}
	update() {
		this.settings.mobile && this.centerContainer()
	}
}