export default class {
	canvasPool = [];
	poolCap = 5e3;
	setToScreen = true;
	constructor(t) {
		Object.defineProperty(this, 'options', { value: t, writable: true }),
		t.screen && this.update(),
		t.cap && (this.setToScreen = !1,
		this.poolCap = t.cap)
	}
	update() {
		this.setToScreen && (this.getPoolCapFromScreen(),
		this.cleanPool())
	}
	getPoolCapFromScreen() {
		let t = this.options
		  , e = t.screen
		  , i = t.camera
		  , s = t.settings;
		this.poolCap = Math.ceil(e.width / Math.floor(s.drawSectorSize * i.zoom)) * Math.ceil(e.height / Math.floor(s.drawSectorSize * i.zoom)) + Math.ceil(e.width / Math.floor(s.drawSectorSize * i.zoom)) + Math.ceil(e.height / Math.floor(s.drawSectorSize * i.zoom))
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