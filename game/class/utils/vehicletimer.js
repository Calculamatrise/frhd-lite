export default class {
	scene = null;
	cached = !1;
	container = {
		borderRadius: 25,
		font: 35 * window.devicePixelRatio / 2,
		text: "00:00",
		scaleX: window.devicePixelRatio / 2,
		scaleY: window.devicePixelRatio / 2,
		width: 200,
		height: 60,
		x: 100,
		y: 30
	}
	constructor(t) {
		this.scene = t,
		this.settings = t.settings,
		this.player = !1,
		this.createPulseTween()
	}
	setPlayer(t) {
		this.player = t
	}
	removePlayer() {
		this.player = !1
	}
	playerAddedTime(t) {
		this.player === t && this.createPulseTween()
	}
	createPulseTween() {
		let i = this.scene.game.pixelRatio / 2
		this.tweenRemaining = 200
		this.tweenStart = i
		this.tweenScale = 1.2 * i
	}
	center_container() {
		var t = this.scene.screen
		, e = this.container;
		e.x = t.width / 2 - 100 * e.scaleX,
		e.y = t.height - 100 * e.scaleY
	}
	draw(t) {
		t.save();
		t.fillStyle = "rgba(242,144,66,0.5)";
		t.strokeStyle = "rgba(242,144,66,1)";
		t.lineWidth = 5 * window.devicePixelRatio / 2;
		t.beginPath();
		t.roundRect(this.container.x, this.container.y, this.container.width * this.container.scaleX, this.container.height * this.container.scaleY, this.container.borderRadius * this.container.scaleY);
		t.fill();
		t.stroke();
		t.font = this.container.font + "px helsinki";
		t.fillStyle = "#000000";
		t.textAlign = "center";
		t.textBaseline = "middle";
		t.fillText(this.container.text, this.container.x + this.container.width / 2 * this.container.scaleX, this.container.y + this.container.height / 2 * this.container.scaleY);
		t.restore();
	}
	fixedUpdate() {
		if (this.tweenRemaining > 0) {
			this.tweenRemaining = Math.max(this.tweenRemaining - 1000 / this.scene.game.settings.drawFPS)
			let t = this.container
			t.scaleX = t.scaleY = t.scaleX * (1 - this.tweenRemaining / 100) + this.tweenScale * (this.tweenRemaining / 100)
			if (t.scaleX == this.tweenScale) {
				this.tweenScale = this.tweenStart
			}
		}

		this.player && this.player._tempVehicleTicks > 0 ? (this.center_container(),
		this.updateTime()) : this.container.visible = !1
	}
	updateTime() {
		var e = this.player._tempVehicleTicks
		, i = this.scene.settings.drawFPS
		, s = e / i;
		s = s.toFixed(2);
		var n = "";
		10 > s && (n = "0"),
		n += s,
		this.container.text = n,
		this.container.visible = true
	}
	close() {
		this.container = null,
		this.player = null,
		this.scene = null,
		this.settings = null
	}
}