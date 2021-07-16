import Vector from "../math/cartesian.js";
import EventEmitter from "../EventEmitter.js";

export default class extends EventEmitter {
    constructor(t) {
        super();
        this.scene = t;
        this.enabled = !0;
        this.touch = this.getTouchObject();
        this.touch.old = this.getTouchObject();
        this.secondaryTouch = this.getTouchObject();
        this.secondaryTouch.old = this.getTouchObject();
        this.initAnalytics();
        this.bindToMouseEvents();
        this.updateCallback = !1;
    }
    scene = null;
    touch = null;
    touches = [];
    wheel = !1;
    mousewheel = !1;
    mouseMoveListener = null;
    mouseUpListener = null;
    mouseDownListener = null;
    throttledMouseWheel = null;
    analytics = null;
    contextMenuHandler(t) {
        return t.stopPropagation(),
        t.preventDefault(),
        !1
    }
    initAnalytics() {
        this.analytics = {
            clicks: 0
        }
    }
    getTouchObject() {
        return {
            id: null,
            down: !1,
            press: !1,
            release: !1,
            pos: new Vector(0,0),
            real: new Vector(0,0),
            type: 1
        }
    }
    bindToMouseEvents() {
        this.scene.game.canvas.addEventListener("mousemove", this.mouseMoveListener = this.onMouseMove.bind(this)),
        this.scene.game.canvas.addEventListener("mousedown", this.mouseDownListener = this.onMouseDown.bind(this)),
        this.scene.game.canvas.addEventListener("mouseup", this.mouseUpListener = this.onMouseUp.bind(this));
        this.scene.game.canvas.addEventListener("mousewheel", this.mouseWheelListener = this.onMouseWheel.bind(this)),
        this.scene.game.canvas.addEventListener("wheel", this.onMouseWheel.bind(this)),
        this.scene.game.canvas.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this)),
        this.mouseWheelListener = this.onMouseWheel
    }
    onMouseDown(t) {
        this.analytics.clicks++,
        2 === t.button ? this.secondaryTouch.down === !1 && (this.updatePosition(t, this.secondaryTouch),
        this.secondaryTouch.down = !0) : this.touch.down === !1 && (this.updatePosition(t, this.touch),
        this.touch.down = !0)
        if (this.scene.pauseControls.check(this.touch.pos)) this.scene.pauseControls.click()
        else if (this.scene.fullscreenControls && this.scene.fullscreenControls.check(this.touch.pos)) this.scene.fullscreenControls.click();
        else if (this.scene.settingsControls && this.scene.settingsControls.check(this.touch.pos)) this.scene.settingsControls.click();
        else if (this.scene.redoundoControls && this.scene.redoundoControls.check(this.touch.pos) == 1) this.scene.redoundoControls.click(true);
        else if (this.scene.redoundoControls && this.scene.redoundoControls.check(this.touch.pos) == 2) this.scene.redoundoControls.click(false);
    }
    disableContextMenu() {
        this.scene.game.canvas.oncontextmenu = function() {
            return !1
        }
    }
    onMouseUp(t) {
        2 === t.button ? this.secondaryTouch.down === !0 && (this.updatePosition(t, this.secondaryTouch),
        this.secondaryTouch.down = !1) : this.touch.down === !0 && (this.updatePosition(t, this.touch),
        this.touch.down = !1)
    }
    updatePosition(t, e) {
        e.id = t.pointerID,
        e.type = t.button,
        e.pos.x = t.offsetX,
        e.pos.y = t.offsetY,
        this.updateRealPosition(e)
    }
    updateRealPosition(t) {
        let i = t.real;
        i.x = Math.round((t.pos.x - this.scene.screen.center.x) / this.scene.camera.zoom + this.scene.camera.position.x),
        i.y = Math.round((t.pos.y - this.scene.screen.center.y) / this.scene.camera.zoom + this.scene.camera.position.y);
        if (this.scene.toolHandler.options.grid) {
            let p = this.scene.settings.toolHandler.gridSize | 0;
            if (lite.getVar("isometric")) {
                function Ab(t, e) {
                    return ((t % e) + e) % e
                }
                let g = p / 2,
                    adjusted = Math.round(i.x / p);
                i.x = adjusted * p;
                i.y = i.y - Ab(i.y + g * (Ab(adjusted, 2) + 1), p) - (g * (Ab(adjusted, 2) - 1)) + (Ab(adjusted, 2) * g);
            } else {
                i.x = Math.round(i.x / p) * p
                i.y = Math.round(i.y / p) * p
            }
        }
        this.updateCallback
    }
    onMouseWheel(t = window.event) {
        t.preventDefault(),
        t.stopPropagation();
        let e = Math.max(-1, Math.min(1, -t.deltaY || -t.detail));
        return 0 == e && (e = Math.max(-1, Math.min(1, t.deltaX || -t.detail))),
        this.wheel = -e,
        !1
    }
    onMouseMove(t) {
        this.updatePosition(t, this.touch),
        this.updatePosition(t, this.secondaryTouch);
        if (this.scene.pauseControls.check(this.touch.pos) ||
        (this.scene.fullscreenControls && this.scene.fullscreenControls.check(this.touch.pos)) ||
        (this.scene.settingsControls && this.scene.settingsControls.check(this.touch.pos)) ||
        (this.scene.redoundoControls && this.scene.redoundoControls.check(this.touch.pos)))
            this.scene.game.canvas.style.cursor = "pointer",
            this.enabled = !1;
        else
            this.scene.game.canvas.style.cursor = "default",
            this.enabled = !0
    }
    update() {
        this.enabled && (this.updateTouch(this.touch),
        this.updateTouch(this.secondaryTouch),
        this.updateWheel())
    }
    updateTouch(t) {
        t.old.pos.x = t.pos.x,
        t.old.pos.y = t.pos.y,
        t.old.real.x = t.real.x,
        t.old.real.y = t.real.y,
        !t.old.down && t.down && (t.press = !0),
        t.old.down && !t.down && (t.release = !0),
        t.old.press && (t.press = !1),
        t.old.release && (t.release = !1),
        this.updateRealPosition(t),
        t.old.down = t.down,
        t.old.press = t.press,
        t.old.release = t.release
    }
    updateWheel() {
        this.mousewheel = this.wheel,
        this.wheel = !1
    }
    close() {
        this.scene.game.canvas.removeEventListener("mousemove", this.onMouseMove),
        this.scene.game.canvas.removeEventListener("mousedown", this.onMouseDown),
        this.scene.game.canvas.removeEventListener("mouseup", this.onMouseUp),
        this.scene.game.canvas.removeEventListener("mousewheel", this.mouseWheelListener),
        this.scene.game.canvas.removeEventListener("DOMMouseScroll", this.mouseWheelListener),
        this.touches = null,
        this.touch = null,
        this.scene = null,
        this.wheel = null,
        this.mouseMoveListener = null,
        this.mouseDownListener = null,
        this.mouseUpListener = null
    }
}