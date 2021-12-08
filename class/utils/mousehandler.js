import Vector from "../math/cartesian.js";
import lodash from "../../libs/lodash-3.10.1.js";
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
        var t = this.scene.game.stage
          , e = this.scene.game.canvas
          , i = this.onMouseMove.bind(this)
          , n = this.onMouseDown.bind(this)
          , r = this.onMouseUp.bind(this);
        t.addEventListener("stagemousemove", i),
        t.addEventListener("stagemousedown", n),
        t.addEventListener("stagemouseup", r),
        this.mouseMoveListener = i,
        this.mouseDownListener = n,
        this.mouseUpListener = r;
        var o = lodash.throttle(this.onMouseWheel, 0);
        e.addEventListener("mousewheel", o.bind(this)),
        e.addEventListener("wheel", o.bind(this)),
        e.addEventListener("DOMMouseScroll", o.bind(this)),
        this.mouseWheelListener = o
    }
    onMouseDown(t) {
        this.analytics.clicks++,
        2 === t.nativeEvent.button ? this.secondaryTouch.down === !1 && (this.updatePosition(t, this.secondaryTouch),
        this.secondaryTouch.down = !0) : this.touch.down === !1 && (this.updatePosition(t, this.touch),
        this.touch.down = !0)
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
        e.type = t.button;
        let i = e.pos;
        i.x = t.stageX,
        i.y = t.stageY,
        this.updateRealPosition(e)
    }
    updateRealPosition(t) {
        let i = t.real;
        i.x = Math.round((t.pos.x - this.scene.screen.center.x) / this.scene.camera.zoom + this.scene.camera.position.x),
        i.y = Math.round((t.pos.y - this.scene.screen.center.y) / this.scene.camera.zoom + this.scene.camera.position.y);
        if (this.scene.toolHandler.options.grid) {
            let p = this.scene.settings.toolHandler.gridSize | 0;
            if (window.lite.storage.get("isometric")) {
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
    onMouseWheel(t) {
        t = window.event || t;
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
        let t = this.scene.game.stage
          , e = this.scene.game.canvas;
        t.removeAllEventListeners(),
        e.removeEventListener("mousewheel", this.mouseWheelListener),
        e.removeEventListener("DOMMouseScroll", this.mouseWheelListener),
        this.touches = null,
        this.touch = null,
        this.scene = null,
        this.wheel = null,
        this.mouseMoveListener = null,
        this.mouseDownListener = null,
        this.mouseUpListener = null
    }
}