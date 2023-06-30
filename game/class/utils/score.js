import format from "./formatnumber.js";

export default class {
    cached = !1;
	paused = !1;
    scene = null;
    state = null;
	sprites = {};
	container = {
		children: [],
		x: 10 * window.devicePixelRatio / 2.5,
		y: 10 * window.devicePixelRatio / 2.5,
		scaleX: 0.4,
		scaleY: 0.4,
		width: 508,
		height: 58
	}
	spriteSheet = {
		timer: [2, 2, 58, 58],
		timer_paused: [2, 62, 116, 118],
		target: [2, 2, 58, 58]
	}
    offset = {
       	y: 0,
        x: 0
    }
	time = {
		color: "#000000",
		font: 40 * window.devicePixelRatio / 2.5,
		text: "0:00.00",
		x: 57,
		y: 18
	}
	time_title = {
		color: "#999999",
		font: 20 * window.devicePixelRatio / 2.5,
		text: "TIME:",
		x: 59,
		y: 3
	}
	timer_sprite = {
		image: "timer",
		x: 0,
		y: 0
	}
	best_time = {
		color: "#999999",
		font: 35 * window.devicePixelRatio / 2.5,
		text: "-- : --.--",
		x: 237,
		y: 21
	}
	best_time_title = {
		color: "#999999",
		font: 20 * window.devicePixelRatio / 2.5,
		text: "BEST:",
		x: 240,
		y: 3
	}
	goals = {
		color: "#000000",
		font: 40 * window.devicePixelRatio / 2.5,
		text: "0/0",
		x: 460,
		y: 15
	}
	target_sprite = {
		image: "target",
		x: 400,
		y: 0
	}
    constructor(t) {
        this.scene = t,
		this.container.children.push(this.time),
		this.container.children.push(this.time_title),
		this.container.children.push(this.timer_sprite),
		this.container.children.push(this.best_time),
		this.container.children.push(this.best_time_title),
		this.container.children.push(this.goals),
		this.container.children.push(this.target_sprite),
		this.sprites.timer = this.scene.assets.getResult("time_icon"),
		this.sprites.target = this.scene.assets.getResult("targets_icon")
    }
	draw() {
		let t = this.scene.game.canvas.getContext("2d");
		t.save();
		t.textAlign = "left";
		t.textBaseline = "top";
		t.imageSmoothingEnabled = true;
		for (const data of this.container.children) {
			if (data.hasOwnProperty("image")) {
				let imageData = this.spriteSheet[data.image];
				t.drawImage(this.sprites[data.image.replace("_paused", "")], ...imageData, this.container.x + data.x * this.container.scaleX * window.devicePixelRatio, this.container.y + data.y * this.container.scaleY * window.devicePixelRatio, imageData[2] * this.container.scaleX * window.devicePixelRatio, imageData[3] * this.container.scaleY * window.devicePixelRatio);
			} else if (data.hasOwnProperty("text")) {
				t.font = data.font * window.devicePixelRatio + "px helsinki";
				t.fillStyle = data.color;
				t.fillText(data.text, this.container.x + data.x * this.container.scaleX * window.devicePixelRatio, this.container.y + data.y * this.container.scaleY * window.devicePixelRatio);
			}
		}

		t.restore();
	}
    update() {
		let t = this.scene.state.paused;
        this.paused !== t && (t ? (this.timer_sprite.image = "timer_paused",
        this.paused = !0) : (this.timer_sprite.image = "timer",
        this.paused = !1));
        this.cached === !1 && this.scene.ticks > 50 && (this.cached = !0);
        this.time.text = format(1e3 * this.scene.ticks / this.scene.settings.drawFPS);
        this.goals.text = this.scene.playerManager.firstPlayer.getTargetsHit() + "/" + this.scene.track.targetCount;
        this.best_time.text = "-- : --.--";
        this.scene.settings.isCampaign && this.scene.settings.campaignData.user.best_time ? this.best_time.text = this.scene.settings.campaignData.user.best_time : this.scene.settings.userTrackStats && this.scene.settings.userTrackStats.best_time && (this.best_time.text = this.scene.settings.userTrackStats.best_time),
        this.scene.settings.mobile && this.center_container();
    }
    center_container() {
        var t = this.container
          , e = t.width // t.children.reduce((width, child) => width += child.width, 0)
          , i = this.scene.screen;
        t.x = i.width / 2 - e / 2 * t.scaleY,
        t.y = 10 * window.devicePixelRatio
    }
}