import GUI from "../interfaces/gui.js";
import Component from "../interfaces/component.js";
import Container from "../interfaces/container.js";

export default class extends GUI {
	sprite = null;
	spriteSheet = {
		bronze_medal: [548, 68, 44, 44],
		center_panel: [2, 68, 452, 56],
		silver_medal: [502, 68, 44, 44],
		left_panel: [2, 2, 588, 64],
		gold_medal: [456, 68, 44, 44]
	}
	bronze_container = new Container({
		alpha: 0.4,
		font: { size: 12 },
		inline: true,
		x: 6.4
	}, this.container)
	silver_container = new Container({
		alpha: 0.4,
		font: { size: 12 },
		inline: true,
		x: 6.4
	}, this.container)
	gold_container = new Container({
		alpha: 0.4,
		font: { size: 12 },
		inline: true,
		x: 6.4
	}, this.container)
	constructor(t) {
		super(t, {
			font: { size: 12 },
			inline: true,
			y: 32
		}),
		this.settings = t.settings;
		let e = t.settings.campaignData.goals;
		this.sprite = t.assets.getResult("campaign_icons"),
		this.bronze_container.addChild(new Component({
			cached: true,
			image: {
				canvas: this.sprite,
				x: 548,
				y: 68,
				width: 44,
				height: 44
			},
			width: 18,
			height: 18
		})),
		this.bronze_container.addChild(new Component({
			text: e.third,
			x: 4,
			y: 3
		})),
		this.silver_container.addChild(new Component({
			cached: true,
			image: {
				canvas: this.sprite,
				x: 502,
				y: 68,
				width: 44,
				height: 44
			},
			width: 18,
			height: 18
		})),
		this.silver_container.addChild(new Component({
			text: e.second,
			x: 4,
			y: 3
		})),
		this.gold_container.addChild(new Component({
			cached: true,
			image: {
				canvas: this.sprite,
				x: 456,
				y: 68,
				width: 44,
				height: 44
			},
			width: 18,
			height: 18
		})),
		this.gold_container.addChild(new Component({
			text: e.first,
			x: 4,
			y: 3
		})),
		this.update_state()
	}
	update_state() {
		switch (this.settings.campaignData.user.has_goal) {
		case 1:
		case "first":
			this.gold_container.alpha = 1;
		case 2:
		case "second":
			this.silver_container.alpha = 1;
		case 3:
		case "third":
			this.bronze_container.alpha = 1;
		}
		this.redraw()
	}
	centerContainer() {
		let t = this.scene.screen
		  , e = this.container
		  , i = e.width;
		e.x = t.width / 2 / window.devicePixelRatio - i / 2,
		e.y = 40
	}
	update() {
		this.settings.mobile && this.centerContainer(),
		this.update_state()
	}
}