import Container from "../interfaces/container.js";

export default class extends Container {
	settings = null;
	constructor(t) {
		super({
			background: 'rgba(242,144,66,.5)',
			borderColor: 'rgba(242,144,66,1)',
			borderRadius: '75%',
			borderWidth: 5,
			color: 'black',
			font: { size: 17.5 },
			text: "00:00",
			textAlign: 'center',
			textBaseline: 'middle',
			width: 200,
			height: 60,
			x: 100,
			y: 80
		});
		Object.defineProperty(this, 'scene', { value: t, writable: true }),
		this.settings = t.settings,
		this.removePlayer(),
		this.centerContainer(),
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
		const i = this.scene.game.pixelRatio / 2;
		this.tweenRemaining = 200;
		this.tweenStart = i;
		this.tweenScale = 1.2 * i
	}
	centerContainer() {
		const t = this.scene.screen;
		this.x = t.width / 2 - this.actualWidth / 2,
		this.y = t.height - this.actualHeight - 100 - this.settings.inset.bottom
	}
	fixedUpdate() {
		if (this.tweenRemaining > 0) {
			this.tweenRemaining = Math.max(this.tweenRemaining - 1e3 / this.scene.game.settings.drawFPS);
			this.scale.x = this.scale.y = this.scale.x * (1 - this.tweenRemaining / 100) + this.tweenScale * (this.tweenRemaining / 100);
			this.scale.x == this.tweenScale && (this.tweenScale = this.tweenStart);
		}

		this.player && this.player._tempVehicleTicks > 0 ? (this.centerContainer(),
		this.updateTime()) : this.visible = !1
		this.visible = !0
	}
	updateTime() {
		let e = this.player._tempVehicleTicks
		  , i = this.scene.settings.drawFPS
		  , s = (e / i).toFixed(2)
		  , n = "";
		10 > s && (n = "0"),
		n += s,
		this.text = n,
		this.setDirty(),
		this.visible = true
	}
	close() {
		this.player = null,
		this.scene = null,
		this.settings = null
	}
}