export default class Tool {
	name = '';
	constructor(t) {
		Object.defineProperties(this, {
			toolhandler: { value: t, writable: true },
			scene: { value: t.scene, writable: true },
			game: { value: t, writable: true }
		});
		this.camera = t.scene.camera;
		this.mouse = t.scene.mouse;
		this.gamepad = t.gamepad
	}

	checkKeys() {
		let t = this.gamepad
		  , e = this.toolhandler
		  , i = this.name
		  , s = i + 'tool';
		t.isButtonDown(i) && (e.setTool(s),
		t.setButtonUp(i))
	}

	draw(t) {
		let e = this.toolhandler
		  , i = e.gamepad
		  , s = e.tools
		  , n = s.select;
		  n && (i.isButtonDown("ctrl") || n.selectedElements.length > 0) && n.draw(t)
	}

	getOptions() {
		return this.options || {}
	}

	press() { }
	hold() { }
	release() { }
	reset() { }
	update() {
		let t = this.mouse
		  , e = t.touch
		  , i = t.secondaryTouch
		  , s = this.toolhandler.gamepad
		  , n = this.toolhandler.options
		  , r = s.isButtonDown("shift")
		  , g = s.isButtonDown("ctrl");
		n.rightClickMove && (r = i.old.down),
		r ? (e.old.down || n.rightClickMove) && this.moveCamera() : (!this.toolhandler.tools[this.toolhandler.currentTool].active && g) ? this.selectArea(e) : (e.press && this.press(),
		e.old.down && this.hold(),
		e.release && this.release()),
		t.mousewheel !== !1 && r === !1 && this.mousewheel(t.mousewheel)
	}

	moveCamera() {
		return this.toolhandler.tools.camera.hold()
	}

	mousewheel(t) {
		let e = this.scene.settings
		  , i = this.scene.game.pixelRatio
		  , s = e.cameraSensitivity
		  , n = e.cameraZoomMin
		  , r = e.cameraZoomMax
		  , o = n * i
		  , a = r * i
		  , h = this.camera
		  , l = this.mouse.touch
		  , c = h.desiredZoom;
		c += t * s,
		h.setZoom(c / i, l.pos),
		h.desiredZoom < o ? h.setZoom(n, l.pos) : h.desiredZoom > a && h.setZoom(r, l.pos)
	}

	selectArea(t) {
		let e = this.toolhandler
		  , i = e.tools
		  , s = i.select;
		s && (t.press && s.press(),
		t.old.down && s.hold(),
		t.release && s.release())
	}

	[Symbol.dispose]() {
		this.camera = null,
		this.mouse = null,
		this.scene = null,
		this.toolhandler = null
	}
}