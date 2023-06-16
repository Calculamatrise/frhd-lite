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
		alpha: 1,
		right: 0,
		scaleX: window.devicePixelRatio / 2,
		scaleY: window.devicePixelRatio / 2,
		top: 60,
		visible: !0,
		x: 0,
		y: 0
	}
    init(t) {
        this.scene = t,
        this.game = t.game,
        this.assets = t.assets,
        this.settings = t.settings,
        this.mouse = t.mouse,
        this.playerManager = t.playerManager,
		this.createSprite(),
        this.resize()
    }
	isMouseOverComponent(component) {
		const { x, y } = this.mouse.touch.pos;
		return Math.sqrt((x - component.x) ** 2 + (y - component.y) ** 2) < component.width / 2 * component.scaleX;
	}
	click() {}
    createSprite() {
        let t = this.scene.assets.getResult(this.name)
          , e = this.controlsSpriteSheetData;
        e.images = [t];
		this.controlsSprite = t
    }
	draw() {
		if (!this.properties.visible) return;
		let t = this.game.canvas.getContext("2d");
		t.save();
		t.globalAlpha = this.properties.alpha;
		for (const i in this.controlData) {
			const component = this.controlData[i];
			let ctrlData = this.controlsSpriteSheetData[(component.image || i) + "_btn"];
			let width = ctrlData[2] * this.properties.scaleX;
			let height = ctrlData[3] * this.properties.scaleY;
			t.globalAlpha = this.properties.alpha * component.alpha;
			t.drawImage(this.controlsSpriteSheetData.images[0], ...ctrlData, this.game.width - component.right * this.properties.scaleX - width / 2, component.top * this.properties.scaleY - height / 2, width, height);
		}

		t.restore();
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
        this.mouse.enabled = !1
		// this.game.canvas.style.setProperty('cursor', 'pointer')
    }
    mouseOut(t) {
		t && (t.alpha = .5),
        this.mouse.enabled = !0
		// this.game.canvas.style.removeProperty('cursor', 'default')
    }
    controlDown(t) {
        let e = this.playerManager.firstPlayer.getGamepad();
        if (t.target.buttonDetails.key) {
            e.setButtonDown(t.target.buttonDetails.key)
        }
        if (t.target.buttonDetails.keys)
            for (var r = t.target.buttonDetails.keys, o = r.length, a = 0; o > a; a++) {
                e.setButtonDown(r[a])
            }
            t.target.buttonDetails.downCallback && t.target.buttonDetails.downCallback(t),
        this.settings.mobile && (this.mouse.enabled = !1),
        t.target.alpha = 1
    }
    controlUp(t) {
        var e = t.target
          , i = e.buttonDetails
          , s = this.playerManager.firstPlayer.getGamepad();
        if (i.key) {
            var n = i.key;
            s.setButtonUp(n)
        }
        if (i.keys)
            for (var r = i.keys, o = r.length, a = 0; o > a; a++) {
                var n = r[a];
                s.setButtonUp(n)
            }
        i.upCallback && i.upCallback(t),
        this.settings.mobile ? (this.mouse.enabled = !0,
        e.alpha = .5) : e.alpha = .8
    }
	click() {}
    close() {}
    update() {
		for (const i in this.controlData) {
			const component = this.controlData[i];
			if (this.isMouseOverComponent(component)) {
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
}