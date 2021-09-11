export default class {
    constructor(t) {
        this.toolhandler = t;
        this.scene = t.scene;
        this.game = t.scene.game;
        this.camera = t.scene.camera;
        this.mouse = t.scene.mouse;
        this.gamepad = t.gamepad;
    }
    name = "";
    toolhandler = null;
    camera = null;
    mouse = null;
    scene = null;
    press() {}
    hold() {}
    release() {}
    update = () => {
        let r = this.toolhandler.gamepad.isButtonDown("shift");
        this.toolhandler.options.rightClickMove && (r = this.mouse.secondaryTouch.old.down),
        r ? (this.mouse.touch.old.down || this.toolhandler.options.rightClickMove) && this.moveCamera() : (this.mouse.touch.press && this.press(),
        this.mouse.touch.old.down && this.hold(),
        this.mouse.touch.release && this.release()),
        this.mouse.mousewheel !== !1 && this.toolhandler.gamepad.isButtonDown("shift") === !1 && this.mousewheel(this.mouse.mousewheel)
    }
    moveCamera() {
        this.camera.position.inc(this.mouse.secondaryTouch.old.pos.sub(this.mouse.secondaryTouch.pos).factor(1 / this.camera.zoom))
    }
    draw() {}
    reset() {}
    mousewheel(t) {
        this.camera.setZoom((this.camera.desiredZoom + (t * this.scene.settings.cameraSensitivity)) / this.scene.game.pixelRatio, this.mouse.touch.pos),
        this.camera.desiredZoom < this.scene.settings.cameraZoomMin * this.scene.game.pixelRatio ? this.camera.setZoom(this.scene.settings.cameraZoomMin, this.mouse.touch.pos) : this.camera.desiredZoom > this.scene.settings.cameraZoomMax * this.scene.game.pixelRatio && this.camera.setZoom(this.scene.settings.cameraZoomMax, this.mouse.touch.pos)
    }
    checkKeys() {
        this.gamepad.isButtonDown(this.name.toLowerCase()) && (this.toolhandler.setTool(this.name.toLowerCase()),
        this.gamepad.setButtonUp(this.name.toLowerCase()))
    }
    getOptions() {
        return {}
    }
    close() {}
}