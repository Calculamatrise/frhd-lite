export default class {
	defaultControlOptions = {
		visible: !0
	}
	name = null;
	controlsSpriteSheetData = {};
	controlData = null;
	game = null;
	scene = null;
	settings = null;
	controlsSprite = null;
	gamepad = null;
	properties = {
		right: 0,
		scaleX: window.devicePixelRatio / 2,
		scaleY: window.devicePixelRatio / 2,
		top: 60,
		visible: !0,
		x: 0,
		y: 0
	}
	constructor(t) {
		this.scene = t,
		this.game = t.game,
		this.assets = t.assets,
		this.settings = t.settings,
		this.mouse = t.mouse,
		this.playerManager = t.playerManager
	}
	init() {
		this.createSprite(),
		this.resize()
	}
	click() {
		for (const i in this.controlData) {
			const component = this.controlData[i];
			if (this.isMouseOverComponent(component)) {
				this.scene.buttonDown(component.key)
			}
		}
	}
	createSprite() {
		let t = this.scene.assets.getResult(this.name)
		  , e = this.controlsSpriteSheetData;
		e.images = [t];
		this.controlsSprite = t
	}
	draw(t) {
		if (!this.properties.visible) return;
		let globalAlpha = t.globalAlpha;
		typeof this.properties.alpha == 'number' && (t.globalAlpha = this.properties.alpha);
		for (const i in this.controlData) {
			const component = this.controlData[i];
			let ctrlData = this.controlsSpriteSheetData[(component.image || i) + "_btn"]
			  , width = ctrlData[2] * this.properties.scaleX
			  , height = ctrlData[3] * this.properties.scaleY;
			typeof component.alpha == 'number' && (t.globalAlpha = (typeof this.properties.alpha != 'number' || this.properties.alpha) * (component.alpha / (2 - !component.disabled))),
			t.drawImage(this.controlsSpriteSheetData.images[0], ...ctrlData, this.game.width - component.right * this.properties.scaleX - width / 2, component.top * this.properties.scaleY - height / 2, width, height);
		}
		globalAlpha !== t.globalAlpha && (t.globalAlpha = globalAlpha)
	}
	isMouseOverComponent(component) {
		const { x, y } = this.mouse.touch.pos;
		return Math.sqrt((x - component.x) ** 2 + (y - component.y) ** 2) < component.width / 2 * component.scaleX
	}
	isVisible() {
		return this.properties.visible
	}
	hide() {
		this.setVisibility(!1)
	}
	show() {
		this.setVisibility(!0)
	}
	setVisibility(t) {
		this.properties.visible = t
	}
	mouseOver(t) {
		t && (t.alpha = this.mouse.touch.down ? 1 : .8),
		this.mouse.enabled = !1,
		this.game.canvas.style.setProperty('cursor', 'pointer')
	}
	mouseOut(t) {
		t && (t.alpha = .5),
		this.mouse.enabled = !0,
		this.game.canvas.style.removeProperty('cursor')
	}
	controlDown(t) {
		let e = t.target
		  , i = e.buttonDetails
		  , s = this.playerManager.firstPlayer.getGamepad();
		i.key && s.setButtonDown(i.key);
		if (i.keys)
			for (let r = i.keys, o = 0; r.length > o; o++) {
				s.setButtonDown(r[o])
			}
		i.downCallback && i.downCallback(t),
		this.mouse.enabled = !1,
		e.alpha = 1
	}
	controlUp(t) {
		let e = t.target
		  , i = e.buttonDetails
		  , s = this.playerManager.firstPlayer.getGamepad();
		i.key && s.setButtonUp(i.key);
		if (i.keys)
			for (let r = i.keys, o = 0; r.length > o; o++) {
				s.setButtonUp(r[o])
			}
		i.upCallback && i.upCallback(t),
		this.mouse.enabled = !0,
		e.alpha = .8
	}
	close() {}
	redraw() {
		for (const i in this.controlData) {
			const component = this.controlData[i];
			if (!component.disabled && this.isMouseOverComponent(component)) {
				this.mouseOver(component)
				component.hovering = true
			} else if (component.hovering && !this.mouse.enabled) {
				this.mouseOut(component);
				delete component.hovering
			}
		}
	}
	resize() {
		let t = this.scene.game
		  , e = t.width
		  , i = t.height;
		this.properties.scaleX = this.properties.scaleY = window.devicePixelRatio / 2,
		this.properties.bottom && (this.properties.y = i - this.properties.bottom * this.properties.scaleY),
		this.properties.left && (this.properties.x = this.properties.left * this.properties.scaleX),
		this.properties.right && (this.properties.x = e - this.properties.right * this.properties.scaleX),
		this.properties.top && (this.properties.y = this.properties.top * this.properties.scaleY)
		for (const s in this.controlData) {
			const component = this.controlData[s];
			component.scaleX = component.scaleY = window.devicePixelRatio / 2,
			component.bottom && (component.y = i - component.bottom * component.scaleY),
			component.left && (component.x = component.left * component.scaleX),
			component.right && (component.x = e - component.right * component.scaleX),
			component.top && (component.y = component.top * component.scaleY)
		}
	}
	update() {}
}