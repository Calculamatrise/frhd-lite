export default class {
    scene = null;
	sprite = null;
    cached = !1;
	container = {
		children: [],
		color: "#000000",
		font: 30 * window.devicePixelRatio / 2.5,
		x: 0,
		y: 80 * window.devicePixelRatio / 2.5,
		scaleX: window.devicePixelRatio / 2.5,
		scaleY: window.devicePixelRatio / 2.5
	}
	spriteSheet = {
		bronze_medal: [548, 68, 44, 44],
		center_panel: [2, 68, 452, 56],
		silver_medal: [502, 68, 44, 44],
		left_panel: [2, 2, 588, 64],
		gold_medal: [456, 68, 44, 44]
	}
	bronze_container = {
		alpha: 0.4,
		image: "bronze_medal",
		x: 16,
		y: 7
	}
	silver_container = {
		alpha: 0.4,
		image: "silver_medal",
		x: 175,
		y: 7
	}
	gold_container = {
		alpha: 0.4,
		image: "gold_medal",
		x: 350,
		y: 7
	}
	constructor(t) {
        this.scene = t,
        this.settings = t.settings;
		let { goals } = t.settings.campaignData;
		this.bronze_container.text = goals.third;
		this.silver_container.text = goals.second;
		this.gold_container.text = goals.first;
		this.container.children.push(this.bronze_container),
		this.container.children.push(this.silver_container),
		this.container.children.push(this.gold_container),
		this.sprite = this.scene.assets.getResult("campaign_icons")
        this.update_state()
    }
    update_state() {
        switch (this.settings.campaignData.user.has_goal) {
            case 1:
            case "first":
                this.gold_container.alpha = 1;
            case "second":
            case 2:
                this.silver_container.alpha = 1;
            case "third":
            case 3:
                this.bronze_container.alpha = 1;
            case 0:
        }
    }
    center_container() {
        let t = this.scene.screen
          , e = this.container
          , i = e.children.reduce((width, child) => width += child.width, 0);
		e.x = t.width / 2 - i / 2 * window.devicePixelRatio,
        e.y = 40 * window.devicePixelRatio
    }
	draw(t) {
		t.save();
		t.fillStyle = this.container.color;
		t.font = this.container.font + "px helsinki";
		t.textBaseline = "middle";
		for (const data of this.container.children) {
			let imageData = this.spriteSheet[data.image];
			let imageX = this.container.x + data.x * this.container.scaleX;
			let imageY = this.container.y + data.y * this.container.scaleY;
			t.drawImage(this.sprite, ...imageData, imageX, imageY, imageData[2] * this.container.scaleX, imageData[3] * this.container.scaleY);
			t.globalAlpha = data.alpha;
			let e = t.measureText(data.text);
			data.width = imageData[2] + e.width;
			data.height = imageData[3] + e.actualBoundingBoxAscent + e.actualBoundingBoxDescent;
			t.fillText(data.text, imageX + imageData[2] * this.container.scaleX + e.width / 2 + 8 * this.container.scaleX, imageY + imageData[3] / 2 * this.container.scaleY);
		}

		t.restore();
	}
    update() {
        this.settings.mobile && this.center_container(),
        this.update_state()
    }
}