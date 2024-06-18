export default class {
	canvasPool = [];
	poolCap = 5e3;
	setToScreen = true;
	options = null;
	constructor(t) {
		this.options = t;
		t.screen && this.update();
		t.cap && (this.setToScreen = !1,
		this.poolCap = t.cap)
	}
	update() {
		this.setToScreen && (this.getPoolCapFromScreen(),
		this.cleanPool())
	}
	getPoolCapFromScreen() {
		this.poolCap = Math.ceil(this.options.screen.width / Math.floor(this.options.settings.drawSectorSize * this.options.camera.zoom)) * Math.ceil(this.options.screen.height / Math.floor(this.options.settings.drawSectorSize * this.options.camera.zoom)) + Math.ceil(this.options.screen.width / Math.floor(this.options.settings.drawSectorSize * this.options.camera.zoom)) + Math.ceil(this.options.screen.height / Math.floor(this.options.settings.drawSectorSize * this.options.camera.zoom))
	}
	getCanvas() {
		let t = this.canvasPool.pop();
		return t ??= document.createElement("canvas")
	}
	releaseCanvas(t) {
		this.canvasPool.length < this.poolCap && this.canvasPool.push(t)
	}
	cleanPool() {
		this.canvasPool.length > this.poolCap && (this.canvasPool = this.canvasPool.slice(0, this.poolCap + 1))
	}
}