import Vector2 from "../math/cartesian.js";

export default class {
	center = new Vector2;
	size = new Vector2;
	width = 0;
	height = 0;
	constructor(t) {
		Object.defineProperties(this, {
			scene: { value: t, writable: true },
			game: { value: t.game, writable: true }
		});
		this.setScreen()
	}
	setScreen() {
		this.width = this.game.width,
		this.height = this.game.height,
		this.size.x = this.game.width,
		this.size.y = this.game.height,
		this.center.x = this.game.width / 2,
		this.center.y = this.game.height / 2
	}
	update() {
		(this.game.width !== this.width || this.game.height !== this.height) && this.setScreen()
	}
	realToScreen(t, e) {
		return (t - this.scene.camera.position[e]) * this.scene.camera.zoom + this.scene.screen.center[e]
	}
	toReal(t, e) {
		return (t - this.scene.screen.center[e]) / this.scene.camera.zoom + this.scene.camera.position[e]
	}
	close() {
		this.width = null,
		this.height = null,
		this.center = null,
		this.size = null,
		this.game = null,
		this.scene = null
	}
}