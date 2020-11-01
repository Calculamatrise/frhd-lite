const {
    E, LN2, LN10, LOG2E, LOG10E, PI, SQRT1_2, SQRT2,
    abs, acos, acosh, asin, asinh, atan, atan2, atanh,
    cbrt, ceil, clz32, cos, cosh, exp, expm1, floor,
    fround, hypot, imul, log, log1p, log2, log10, max,
    min, pow, random, round, sign, sin, sinh, sqrt, tan,
    tanh, trunc
} = Math;
function formatNumber(t) {
    t = parseInt(t, 10);
    var e = floor(t / 6e4)
        , i = (t - 6e4 * e) / 1e3;
    return i = i.toFixed(2),
    10 > e && (e = e),
    10 > i && (i = "0" + i),
    e + ":" + i
}
function bresenham(t, e, i, a, h) {
    var l = []
      , c = t
      , u = e
      , p = (a - e) / (i - t)
      , d = i > t ? 1 : -1
      , f = a > e ? 1 : -1
      , v = 0;
    l.push(t, e);
    do {
        var g = floor(c / h) == floor(i / h)
          , m = floor(u / h) == floor(a / h);
        if (g && m)
            break;
        var y = 0
          , w = 0;
        y = round(floor(c / h + d) * h),
        0 > d && (y = round(ceil((c + 1) / h + d) * h) - 1),
        w = round(e + (y - t) * p);
        var x = 0
          , _ = 0;
        _ = round(floor(u / h + f) * h),
        0 > f && (_ = round(ceil((u + 1) / h + f) * h) - 1),
        x = round(t + (_ - e) / p),
        pow(y - t, 2) + pow(w - e, 2) < pow(x - t, 2) + pow(_ - e, 2) ? (c = y,
        u = w,
        l.push(y, w)) : (c = x,
        u = _,
        l.push(x, _))
    } while (v++ < 5e3);return l
}
function curve(t, e, i) {
    function o(t, e, i, s, n, r) {
        f.push(t, e),
        a(t, e, i, s, n, r, 0),
        f.push(n, r)
    }
    function a(t, e, i, o, h, l, c) {
        if (!(c > g)) {
            var u = (t + i) / 2
              , p = (e + o) / 2
              , d = (i + h) / 2
              , x = (o + l) / 2
              , _ = (u + d) / 2
              , b = (p + x) / 2
              , T = h - t
              , C = l - e
              , k = abs((i - h) * C - (o - l) * T);
            if (k > m) {
                if (v * (T * T + C * C) >= k * k) {
                    if (w > y)
                        return void f.push(_, b);
                    var S = abs(atan2(l - o, h - i) - atan2(o - e, i - t));
                    if (S >= PI && (S = 2 * PI - S),
                    y > S)
                        return void f.push(_, b)
                }
            } else if (T = _ - (t + h) / 2,
            C = b - (e + l) / 2,
            v >= T * T + C * C)
                return void f.push(_, b);
            a(t, e, u, p, _, b, c + 1),
            a(_, b, d, x, h, l, c + 1)
        }
    }
    var h = t.x
      , l = t.y
      , c = e.x
      , u = e.y
      , p = i.x
      , d = i.y
      , f = []
      , v = .25
      , g = 10
      , m = 1e-30
      , y = 0
      , w = .01;
    return o(h, l, c, u, p, d),
    f
}
!function t(e) {
    var i = {}
      , s = [1];
    function n(o, a) {
        if (!i[o]) {
            if (!e[o]) {
                var h = typeof require == "function" && require;
                if (!a && h)
                    return h(o, !0);
                if (r)
                    return r(o, !0);
                var l = new Error("Cannot find module '" + o + "'");
                throw l.code = "MODULE_NOT_FOUND",
                l
            }
            var c = i[o] = {
                exports: {}
            };
            e[o].call(c.exports, function(t) {
                return n(t)
            }, c, c.exports, t, e, i, s)
        }
        return i[o].exports
    }
    for (var r = "function" == typeof require && require, o = 0; o < s.length; o++)
        n(s[o]);
    return n
}({
    1: function(t) {
        t(7);
        t(89);
        t(92);
        if (typeof window.performance == "undefined") {
            window.performance = {}
            if(!window.performance.now) {
                var t = Date.now();
                if(performance.timing) {
                    if(performance.timing.navigationStart) {
                        t = performance.timing.navigationStart
                    }
                }
                window.performance.now = function() {
                    return Date.now() - t
                }
            }
        }
        window.Game = class Game {
            constructor(t, e, i) {
                this.assets = e,
                this.settings = i,
                this.initCanvas(),
                this.initStage(),
                this.setSize(),
                this.switchScene(t),
                this.setSize(),
                this.startTicker()
            }
            gameContainer = null;
            tickCount = 0;
            currentScene = null;
            assets = null;
            stage = null;
            canvas = null;
            stats = null;
            width = 0;
            height = 0;
            fullscreen = !1;
            onStateChange = null;
            scenes = {
                Editor: t(9),
                Main: t(10)
            }
            initCanvas() {
                var t = document.createElement("canvas")
                    , e = document.getElementById(this.settings.defaultContainerID);
                e.appendChild(t),
                this.gameContainer = e,
                this.canvas = t
            }
            initStage() {
                var t = new createjs.Stage(this.canvas);
                t.autoClear = !1,
                createjs.Touch.enable(t),
                t.enableMouseOver(30),
                t.mouseMoveOutside = !0,
                t.preventSelection = !1,
                this.stage = t
            }
            setSize() {
                var t = window.innerHeight
                    , e = window.innerWidth;
                if (!this.settings.fullscreen && !this.settings.isStandalone) {
                    var i = this.gameContainer;
                    t = i.clientHeight,
                    e = i.clientWidth
                }
                if (this.currentScene) {
                    var s = this.currentScene.getCanvasOffset();
                    t -= s.height
                }
                var n = 1;
                void 0 !== window.devicePixelRatio && (n = window.devicePixelRatio),
                this.settings.lowQualityMode && (n = 1);
                var r = e * n
                    , o = t * n;
                (r !== this.width || o !== this.height) && (this.width = r,
                this.height = o,
                this.canvas.width = r,
                this.canvas.height = o),
                this.pixelRatio = n,
                this.canvas.style.width = e + "px",
                this.canvas.style.height = t + "px",
                this.currentScene && this.currentScene.command("resize")
            }
            startTicker() {
                createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCED,
                createjs.Ticker.setFPS(this.settings.drawFPS),
                createjs.Ticker.on("tick", this.update.bind(this))
            }
            update() {
                this.currentScene.update(),
                this.currentScene.toolHandler.options.visibleGrid = window.lite.getVar("invisible") ? false : true,
                document.getElementsByClassName("game")[0].style.background = window.lite.getVar("dark") && "#1d1d1d" || "#ffffff",
                window.lite.getVar("displayInput") && window.lite.drawInputDisplay(this.canvas),
                this.tickCount++
            }
            switchScene(t) {
                null !== this.currentScene && this.currentScene.close(),
                this.currentScene = new this.scenes[t](this)
            }
            command() {
                this.currentScene.command.apply(this.currentScene, arguments)
            }
            close() {
                createjs.Ticker.reset(),
                createjs.Ticker.removeAllEventListeners(),
                this.currentScene.close(),
                this.currentScene = null,
                this.assets = null,
                this.settings = null,
                this.stage.autoClear = !0,
                this.stage.removeAllChildren(),
                this.stage.update(),
                this.stage.enableDOMEvents(!1),
                this.stage.removeAllEventListeners(),
                this.stage = null,
                this.canvas.parentNode.removeChild(this.canvas),
                this.canvas = null,
                this.tickCount = null,
                this.height = null,
                this.width = null
            }
        }
    },
    2: function(t, e) {
        e.exports = class Controls {
            defaultControlOptions = {
                visible: !0
            }
            name = null
            controlsSpriteSheetData = null
            controlData = null
            game = null
            scene = null
            settings = null
            stage = null
            controlsContainer = null
            controlsSprite = null
            gamepad = null
            initialize(t) {
                this.scene = t,
                this.game = t.game,
                this.assets = t.assets,
                this.settings = t.settings,
                this.stage = t.game.stage,
                this.mouse = t.mouse,
                this.playerManager = t.playerManager,
                this.createSprite(),
                this.addControls(),
                this.resize()
            }
            addControls() {}
            createSprite() {
                var t = this.scene.assets.getResult(this.name)
                  , e = this.controlsSpriteSheetData;
                e.images = [t];
                var i = new createjs.SpriteSheet(e)
                  , s = new createjs.Sprite(i);
                this.controlsSprite = s
            }
            isVisible() {
                return this.controlsContainer.visible
            }
            hide() {
                this.controlsContainer.visible = !1
            }
            show() {
                this.controlsContainer.visible = !0
            }
            setVisibility(t) {
                this.controlsContainer.visible = t
            }
            createControl(t) {
                var e = this.controlsSprite
                  , i = this.defaultControlOptions
                  , n = e.clone();
                for(var a in this.controlData[t]) {
                    i[a] = this.controlData[t][a]
                }
                n.gotoAndStop(t),
                n.buttonDetails = i,
                n.cursor = "pointer",
                n.on("mousedown", this.controlDown.bind(this)),
                n.on("pressup", this.controlUp.bind(this)),
                n.on("mouseover", this.mouseOver.bind(this)),
                n.on("mouseout", this.mouseOut.bind(this));
                var r = n.getBounds();
                if (n.regX = r.width / 2,
                n.regY = r.height / 2,
                n.alpha = .5,
                n.name = t,
                n.visible = i.visible,
                i.hitArea) {
                    var o = i.hitArea
                      , a = new createjs.Shape;
                    o.radius ? a.graphics.beginFill("#000").drawCircle(o.x, o.y, o.radius) : a.graphics.beginFill("#000").drawRect(o.x, o.y, o.width, o.height),
                    n.hitArea = a
                }
                return n
            }
            mouseOver(t) {
                var e = t.target;
                e.alpha = .8,
                this.mouse.enabled = !1
            }
            mouseOut(t) {
                var e = t.target;
                e.alpha = .5,
                this.mouse.enabled = !0
            }
            controlDown(t) {
                var e = t.target
                  , i = e.buttonDetails
                  , s = this.playerManager.firstPlayer.getGamepad();
                if (i.key) {
                    var n = i.key;
                    s.setButtonDown(n)
                }
                if (i.keys)
                    for (var r = i.keys, o = r.length, a = 0; o > a; a++) {
                        var n = r[a];
                        s.setButtonDown(n)
                    }
                i.downCallback && i.downCallback(t),
                this.settings.mobile && (this.mouse.enabled = !1),
                e.alpha = 1
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
            close() {}
            update() {}
            resize() {
                var t = this.scene.game
                  , e = t.width
                  , i = t.height
                  , s = t.pixelRatio
                  , n = this.controlsContainer.children;
                for (var r in n) {
                    var o = n[r]
                      , a = o.buttonDetails;
                    a.bottom && (o.y = i - a.bottom * (s / 2)),
                    a.left && (o.x = a.left * (s / 2)),
                    a.right && (o.x = e - a.right * (s / 2)),
                    a.top && (o.y = a.top * (s / 2)),
                    o.scaleX = o.scaleY = s / 2
                }
            }
        }
    },
    3: function(t, e) {
        var Controls = t(2);
        e.exports = class FullScreenControls extends Controls {
            constructor(a) {
                super();
                this.initialize(a)
            }
            name = "fullscreen_controls";
            fullscreenControl = null;
            fullscreen = !1;
            controlsSpriteSheetData = {
                frames: [[230, 2, 76, 76], [154, 2, 76, 76], [78, 2, 76, 76], [2, 2, 76, 76]],
                animations: {
                    "exit_fullscreen_btn-hover": [0],
                    exit_fullscreen_btn: [1],
                    "fullscreen_btn-hover": [2],
                    fullscreen_btn: [3]
                }
            }
            controlData = {
                "fullscreen_btn-hover": {
                    top: 60,
                    right: 150,
                    key: "fullscreen"
                }
            }
            update() {
                var t = this.scene.settings.fullscreen;
                this.fullscreen !== t && (this.fullscreenControl.gotoAndStop(t ? "exit_fullscreen_btn-hover" : "fullscreen_btn-hover"),
                this.fullscreen = t)
            }
            addControls() {
                var t = new createjs.Container;
                t.addChild(this.createControl("fullscreen_btn-hover")),
                this.controlsContainer = t,
                this.fullscreenControl = t.getChildByName("fullscreen_btn-hover"),
                this.stage.addChild(t)
            }
        }
    },
    4: function(t, e) {
        var Controls = t(2);
        e.exports = class PauseControls extends Controls {
            constructor(a) {
                super();
                this.initialize(a)
            }
            name = "pause_controls";
            pauseControl = null;
            paused = !1;
            controlsSpriteSheetData = {
                frames: [[230, 2, 76, 76], [154, 2, 76, 76], [78, 2, 76, 76], [2, 2, 76, 76]],
                animations: {
                    "pause_btn-hover": [0],
                    pause_btn: [1],
                    "play_btn-hover": [2],
                    play_btn: [3]
                }
            }
            controlData = {
                "pause_btn-hover": {
                    key: "pause",
                    top: 60,
                    right: 70
                }
            }
            update() {
                var t = this.scene.state.paused;
                this.paused !== t && (t ? (this.pauseControl.gotoAndStop("play_btn-hover"),
                this.paused = !0) : (this.pauseControl.gotoAndStop("pause_btn-hover"),
                this.paused = !1))
            }
            addControls() {
                var t = new createjs.Container;
                t.addChild(this.createControl("pause_btn-hover")),
                this.controlsContainer = t,
                this.pauseControl = t.getChildByName("pause_btn-hover"),
                this.stage.addChild(t)
            }
        }
    },
    5: function(t, e) {
        var Controls = t(2);
        e.exports = class UndoManager extends Controls {
            constructor(a) {
                super();
                this.initialize(a)
            }
            name = "redo_undo_controls";
            controlsSpriteSheetData = {
                frames: [[78, 2, 76, 76], [2, 2, 76, 76]],
                animations: {
                    redo: [0],
                    undo: [1]
                }
            }
            controlData = {
                redo: {
                    keys: ["ctrl", "y"],
                    top: 60,
                    right: 160
                },
                undo: {
                    keys: ["ctrl", "z"],
                    top: 60,
                    right: 240
                }
            }
            addControls() {
                var t = new createjs.Container;
                t.addChild(this.createControl("redo")),
                t.addChild(this.createControl("undo")),
                this.controlsContainer = t,
                this.stage.addChild(t)
            }
            update() {
                var t = this.scene
                , e = this.scene.state.paused;
                t.controls && this.controlsContainer.visible !== e && (this.controlsContainer.visible = e)
            }
        }
    },
    6: function(t, e) {
        var Controls = t(2);
        e.exports = class ControlSettings extends Controls {
            constructor(a) {
                super();
                var e = a.settings;
                if (e.fullscreenAvailable === !1) {
                    var i = this.controlData["settings_btn-hover"];
                    i.top = 60,
                    i.right = 150
                }
                this.initialize(a)
            }
            name = "settings_controls"
            controlsSpriteSheetData = {
                frames: [[78, 2, 76, 76], [2, 2, 76, 76]],
                animations: {
                    "settings_btn-hover": [0],
                    settings_btn: [1]
                }
            }
            controlData = {
                "settings_btn-hover": {
                    top: 60,
                    right: 230,
                    key: "settings"
                }
            }
            update() {}
            addControls() {
                var t = new createjs.Container;
                t.addChild(this.createControl("settings_btn-hover")),
                this.controlsContainer = t,
                this.stage.addChild(t)
            }
        }
    },
    7: function(t, e) {
        window.GameInventoryManager = new class GameInventoryManager {
            s = {};
            n = {};
            r = {};
            getItem(t) {
                var e = t.classname
                  , i = t.script
                  , o = t.options
                  , a = t.type;
                this.s[e] || ("1" === a && (e = "forward_cap",
                o = {
                    back: "white"
                }),
                this.r[i] || (this.r[i] = !0,
                GameManager.loadFile(i)));
                var h = this.generateID(a, e, o);
                return this.n[h] || (this.n[h] = new this.s[e](o)),
                this.n[h]
            }
            redraw() {
                for (var t in this.n)
                    this.n.hasOwnProperty(t) && this.n[t].setDirty()
            }
            generateID(t, e, i) {
                var e = t + e;
                if (i)
                    for (var s in i)
                        i.hasOwnProperty(s) && (e += i[s]);
                return e
            }
            register(t, e) {
                this.s[t] = e
            }
            clear() {}
        }
        GameInventoryManager.HeadClass = class HeadClass {
            createVersion() {
                var t = this.colors
                  , e = this.getVersions()
                  , i = "";
                for (var s in t)
                    t.hasOwnProperty(s) && (i += t[s]);
                this.versionName = i,
                e[i] || (e[i] = {
                    dirty: !0,
                    canvas: document.createElement("canvas")
                })
            }
            draw(t, e, i, s, n, r) {
                var o = this.getCache(n)
                  , a = this.getBaseWidth()
                  , h = this.getBaseHeight()
                  , l = this.getScale()
                  , c = this.getDrawOffsetX()
                  , u = this.getDrawOffsetY()
                  , p = a * n * l
                  , d = h * n * l
                  , f = c * n - p / 2
                  , v = u * n - d / 2
                  , g = -1 === r;
                t.translate(e, i),
                t.rotate(s),
                g && t.scale(1, -1),
                t.drawImage(o, f, v, p, d),
                g && t.scale(1, -1),
                t.rotate(-s),
                t.translate(-e, -i)
            }
            getCache(t) {
                var e = this.getVersions();
                return e[this.versionName].dirty && this.cache(t),
                e[this.versionName].canvas
            }
            setDirty() {
                var t = this.getVersions();
                t[this.versionName].dirty = !0
            }
        }
        class Head extends GameInventoryManager.HeadClass {
            constructor(a) {
                super();
                this.drawAngle = 0,
                this.colors = a,
                this.createVersion()
            }
            r = {};
            h = 2.2;
            l = 1;
            c = 115;
            u = 112;
            o = 0;
            a = 0;
            p = .17;
            versionName = "";
            dirty = !0;
            getVersions() {
                return this.r
            }
            cache(t) {
                var e = this.r[this.versionName];
                e.dirty = !1;
                var t = max(t, 1)
                , i = this.c * t * this.p
                , s = this.u * t * this.p
                , h = e.canvas;
                h.width = i,
                h.height = s,
                this.o = h.width / 2,
                this.a = h.height / 2;
                var l = h.getContext("2d")
                , d = this.p * t
                , f = this.colors;
                l.save(),
                l.scale(d, d),
                l.translate(0, 0),
                l.beginPath(),
                l.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "rgba(0,0,0,0)",
                l.lineCap = "butt",
                l.lineJoin = "miter",
                l.miterLimit = 4,
                l.save(),
                l.fillStyle = "#ffffff";
                l.beginPath(),
                l.arc(42.4, 52.5, 30.3, 0, 6.283185307179586, !0),
                l.closePath(),
                l.fill(),
                l.stroke(),
                l.restore(),
                l.save(),
                l.fillStyle = f.back;
                l.beginPath(),
                l.moveTo(71.624, 44.496),
                l.bezierCurveTo(68.112, 31.647, 56.363, 22.2, 42.4, 22.2),
                l.bezierCurveTo(25.665999999999997, 22.2, 12.099999999999998, 35.765, 12.099999999999998, 52.5),
                l.bezierCurveTo(12.099999999999998, 55.771, 12.623999999999999, 58.916, 13.582999999999998, 61.867000000000004),
                l.lineTo(71.624, 44.496),
                l.closePath(),
                l.fill(),
                l.stroke(),
                l.restore(),
                f.front && (l.save(),
                l.beginPath(),
                l.moveTo(76.917, 38.393),
                l.bezierCurveTo(71.677, 25.617, 59.54900000000001, 16.371000000000002, 45.172, 15.309000000000001),
                l.bezierCurveTo(47.57899999999999, 22.559, 50.918, 33.862, 52.501, 44.894999999999996),
                l.bezierCurveTo(60.643, 42.731, 68.775, 40.566, 76.917, 38.393),
                l.closePath(),
                l.fillStyle = f.front,
                l.fill(),
                l.stroke(),
                l.restore()),
                l.save(),
                l.beginPath(),
                l.moveTo(42.4, 22.2),
                l.bezierCurveTo(59.134, 22.2, 72.7, 35.765, 72.7, 52.5),
                l.bezierCurveTo(72.7, 69.235, 59.135, 82.8, 42.4, 82.8),
                l.bezierCurveTo(25.665, 82.8, 12.1, 69.234, 12.1, 52.5),
                l.bezierCurveTo(12.1, 35.766000000000005, 25.666, 22.2, 42.4, 22.2),
                l.moveTo(42.4, 15.2),
                l.bezierCurveTo(21.833, 15.2, 5.100000000000001, 31.932, 5.100000000000001, 52.5),
                l.bezierCurveTo(5.100000000000001, 73.068, 21.832, 89.8, 42.4, 89.8),
                l.bezierCurveTo(62.967999999999996, 89.8, 79.69999999999999, 73.068, 79.69999999999999, 52.5),
                l.bezierCurveTo(79.69999999999999, 31.932000000000002, 62.968, 15.2, 42.4, 15.2),
                l.lineTo(42.4, 15.2),
                l.closePath(),
                l.fill(),
                l.stroke(),
                l.restore(),
                l.save(),
                l.beginPath(),
                l.moveTo(16.3, 66.85),
                l.bezierCurveTo(41.8, 60.148999999999994, 67.2, 53.449999999999996, 92.601, 46.648999999999994),
                l.bezierCurveTo(96.201, 45.648999999999994, 99.8, 44.748999999999995, 103.5, 43.748999999999995),
                l.bezierCurveTo(111, 41.748999999999995, 107.8, 30.148999999999994, 100.3, 32.148999999999994),
                l.bezierCurveTo(74.901, 38.94899999999999, 49.400999999999996, 45.748999999999995, 24, 52.449),
                l.bezierCurveTo(20.4, 53.449, 16.8, 54.349, 13.101, 55.349),
                l.bezierCurveTo(5.7, 57.35, 8.9, 68.85, 16.3, 66.85),
                l.lineTo(16.3, 66.85),
                l.closePath(),
                l.fill(),
                l.stroke(),
                l.restore()
            }
            setDirty() {
                this.r[this.versionName].dirty = !0
            }
            getBaseWidth() {
                return this.c
            }
            getBaseHeight() {
                return this.u
            }
            getDrawOffsetX() {
                return this.h
            }
            getDrawOffsetY() {
                return this.l
            }
            getScale() {
                return this.p
            }
        }
        if(GameInventoryManager) {
            GameInventoryManager.register("forward_cap", Head)
        }
    },
    8: function(t, e) {
        e.exports = class Vector {
            constructor(a, b) {
                this.x = a,
                this.y = b
            }
            x = 0;
            y = 0;
            toReal(a) {
                var camera = a.camera,
                    screen = a.screen,
                    x = (this.x - screen.center.x) / camera.zoom + camera.position.x,
                    y = (this.y - screen.center.y) / camera.zoom + camera.position.y;
                return new Vector(x, y)
            }
            toScreen(a) {
                var camera = a.camera
                  , screen = a.screen
                  , x = (this.x - camera.position.x) * camera.zoom + screen.center.x
                  , y = (this.y - camera.position.y) * camera.zoom + screen.center.y;
                return new Vector(x, y)
            }
            lenSqr() {
                return pow(this.x, 2) + pow(this.y, 2)
            }
            len() {
                return sqrt(pow(this.x, 2) + pow(this.y, 2))
            }
            dot(a) {
                return this.x * a.x + this.y * a.y
            }
            factor(a) {
                return new Vector(this.x * a, this.y * a)
            }
            factorSelf(a) {
                this.x = this.x * a,
                this.y = this.y * a
            }
            factorOut(a, b) {
                b.x = this.x * a,
                b.y = this.y * a
            }
            add(a) {
                return new Vector(this.x + a.x, this.y + a.y)
            }
            inc(a) {
                this.x += a.x,
                this.y += a.y
            }
            addOut(a, b) {
                b.x = this.x + a.x,
                b.y = this.y + a.y
            }
            sub(a) {
                return new Vector(this.x - a.x,this.y - a.y)
            }
            subOut(a, b) {
                b.x = this.x - a.x,
                b.y = this.y - a.y
            }
            subSelf(a) {
                this.x = this.x - a.x,
                this.y = this.y - a.y
            }
            equ(a) {
                this.x = a.x,
                this.y = a.y
            }
            normalize() {
                var t = sqrt(pow(this.x, 2) + pow(this.y, 2));
                return new Vector(this.x / t,this.y / t)
            }
            getAngleInDegrees(a) {
                var e = a.sub(this)
                  , i = atan2(e.x, -e.y)
                  , s = i * (180 / PI);
                return 0 > s && (s += 360),
                s
            }
            getAngleInRadians(a) {
                var b = a.sub(this);
                return atan2(b.x, -b.y)
            }
        }
    },
    9: function(t, e) {
        var MouseHandler = t(63)
          , Camera = t(87)
          , Screen = t(88)
          , PlayerManager = t(80)
          , VehicleTimer = t(69)
          , ToolHandler = t(50)
          , CameraTool = t(35)
          , CurveTool = t(36)
          , StraightLineTool = t(48)
          , BrushTool = t(34)
          , SelectTool = t(47)
          , FillTool = t(90)
          , OvalTool = t(91)
          , EraserTool = t(37)
          , PowerupTool = t(38)
          , VehiclePowerupTool = t(51)
          , Track = t(56)
          , LoadingCircle = t(61)
          , Score = t(66)
          , PauseControls = t(4)
          , UndoManager = t(5)
          , SoundManager = t(68)
          , MessageManager = t(62);
        e.exports = class Editor {
            constructor(game){
                this.game = game,
                this.assets = game.assets,
                this.stage = game.stage,
                this.settings = game.settings,
                this.sound = new SoundManager(this),
                this.mouse = new MouseHandler(this),
                this.mouse.disableContextMenu(),
                this.message = new MessageManager(this),
                this.camera = new Camera(this),
                this.screen = new Screen(this),
                this.createTrack(),
                this.loadingcircle = new LoadingCircle(this),
                this.playerManager = new PlayerManager(this),
                this.vehicleTimer = new VehicleTimer(this),
                this.score = new Score(this),
                this.createMainPlayer(),
                this.createControls(),
                this.registerTools(),
                this.state = this.setStateDefaults(),
                this.oldState = this.setStateDefaults(),
                this.restart(),
                this.initializeAnalytics(),
                this.stage.addEventListener("stagemousedown", this.tapToStartOrRestart.bind(this)),
                window.lite && this.injectLiteFeatures()
            }
            game = null;
            assets = null;
            stage = null;
            canvas = null;
            settings = null;
            camera = null;
            screen = null;
            mouse = null;
            track = null;
            player = null;
            players = null;
            ticks = 0;
            state = null;
            oldState = null;
            stateDirty = !0;
            onStateChange = null;
            vehicle = "Mtb";
            showDialog = !1;
            dialogOptions = !1;
            importCode = !1;
            clear = !1;
            redoundoControls = null;
            pauseControls = null;
            inFocus = !0;
            controls = null;
            verified = !1;
            injectLiteFeatures() {
                var ca = document.createElement('div');
                ca.className = 'topMenu-button topMenu-button_autoCheck';
                ca.title = 'Check to see if your auto is broken';
                ca.onclick = window.lite.checkAuto;
                ca.innerHTML = '<a>Check Auto</a>';
                var ic = setInterval(() => {
                    if(document.getElementsByClassName('topMenu-button_offline').length > 0) {
                        document.getElementsByClassName('topMenu-button_offline')[0].after(ca);
                        clearInterval(ic)
                    }
                })
                var tm = document.createElement('div');
                tm.id = 'trackMover';
                tm.className = 'bottomToolOptions';
                tm.title = 'Move your track!';
                tm.innerHTML = `<a onClick="window.lite.moveTrack()">Move Track</a>
                &emsp;<input type="number" id="moveX" placeholder="Position X"></input>
                &emsp;<input type="number" id="moveY" placeholder="Position Y"></input>`;
                var tc = document.createElement('div');
                tc.id = 'trackCombiner';
                tc.className = 'bottomToolOptions';
                tc.title = 'Combine your tracks!';
                tc.innerHTML = `<a onClick="window.lite.combine()" id="combineTrack">Combine Track</a>
                &emsp;<input id="input1" placeholder="Track 1" spellcheck="false"></input>
                &emsp;<input id="input2" placeholder="Track 2" spellcheck="false"></input>
                &emsp;<input id="output" placeholder="Output" readonly="true" spellcheck="false"></input>`;
                var t = window.lite.getVar("toggle") ? tm : tc;
                window.lite.nodes.trackMover = tm;
                window.lite.nodes.trackCombiner = tc;
                window.lite.nodes.tools = t;
                var script = document.createElement('script');
                script.innerHTML = `([...document.querySelectorAll('input')]).forEach(n => {
                    n.addEventListener('keydown', e => e.stopPropagation());
                    n.addEventListener('keyup', e => e.stopPropagation());
                    n.addEventListener('keypress', e => e.stopPropagation());
                });`;
                var it = setInterval(() => {
                    if(document.getElementsByClassName('bottomToolOptions_straightline').length > 0) {
                        document.getElementsByClassName('bottomToolOptions_straightline')[0].after(t);
                        document.body.appendChild(script);
                        clearInterval(it)
                    }
                })
                var st = document.createElement('div');
                st.className = 'sideButton sideButton-bottom sideButton_selectTool';
                st.onclick = () => {
                    this.toolHandler.setTool('select'),
                    st.className = 'sideButton sideButton-bottom sideButton_selectTool active';
                }
                st.innerHTML = `<div style="width:40px;height:40px;display:flex"><img src="https://i.imgur.com/FLP6RhL.png" style="display:inline-flex;margin:auto;width:30px;height:30px;justify-content:center;align-items:center;float:center"></img></div>`;
                var ith = setInterval(() => {
                    if(document.getElementsByClassName('sideButton').length > 0) {
                        [...document.getElementsByClassName('sideButton')].forEach(e => {
                            e.onclick = () => {
                                if(!['sideButton sideButton-bottom sideButton_selectTool'].includes(e.className)) {
                                    st.className = 'sideButton sideButton-bottom sideButton_selectTool';
                                } else {
                                    this.toolHandler.setTool('select'),
                                    st.className = 'sideButton sideButton-bottom sideButton_selectTool active';
                                }
                            }
                        })
                        clearInterval(ith)
                    }
                })
                var is = setInterval(() => {
                    if(document.getElementsByClassName('sideButton_cameraTool').length > 0) {
                        document.getElementsByClassName('sideButton_cameraTool')[0].after(st)
                        clearInterval(is)
                    }
                })
            }
            getCanvasOffset() {
                var t = {
                    height: 90,
                    width: 0
                };
                return this.settings.isStandalone && (t = {
                    height: 202,
                    width: 0
                }),
                t
            }
            tapToStartOrRestart() {
                if (this.settings.mobile) {
                    var t = this.playerManager.firstPlayer;
                    if (t && t._crashed && !this.state.paused) {
                        var e = t.getGamepad();
                        e.setButtonDown("enter")
                    } else
                        this.play()
                }
            }
            analytics = null;
            initializeAnalytics() {
                this.analytics = {
                    deaths: 0,
                    mouseEvents: 0
                },
                this.trackAction("editor-open", "open")
            }
            createMainPlayer() {
                var t = this.playerManager
                  , e = t.createPlayer(this, this.settings.user)
                  , i = e.getGamepad();
                i.setKeyMap(this.settings.editorHotkeys),
                i.onButtonDown = this.buttonDown.bind(this),
                i.listen(),
                this.playerManager.firstPlayer = e,
                this.playerManager.addPlayer(e)
            }
            createControls() {
                this.redoundoControls = new UndoManager(this),
                this.pauseControls = new PauseControls(this)
            }
            createTrack() {
                this.track && this.track.close();
                var t = new Track(this)
                  , e = this.getAvailableTrackCode();
                0 != e ? (t.read(e),
                this.track = t,
                this.state.preloading = !1,
                this.state.loading = !1) : t.addDefaultLine(),
                this.importCode = !1,
                this.restartTrack = !0,
                this.clear = !1,
                this.track = t
            }
            updateControls() {
                if (this.controls) {
                    var t = this.state.paused;
                    this.controls.isVisible() === t && (t || (this.state.playing = !1,
                    this.camera.focusOnMainPlayer(),
                    this.toolHandler.setTool("camera")),
                    this.controls.setVisibility(!t),
                    this.updateState()),
                    this.controls.update()
                }
                this.pauseControls.update()
            }
            registerTools() {
                var t = new ToolHandler(this);
                t.enableGridUse(),
                this.toolHandler = t,
                t.registerTool(CameraTool),
                t.registerTool(CurveTool),
                t.registerTool(StraightLineTool),
                t.registerTool(BrushTool),
                t.registerTool(SelectTool),
                t.registerTool(FillTool),
                t.registerTool(OvalTool),
                t.registerTool(EraserTool),
                t.registerTool(PowerupTool),
                t.registerTool(VehiclePowerupTool),
                t.setTool(this.settings.startTool)
            }
            updateToolHandler() {
                this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update()
            }
            play() {
                this.state.playing = !0
            }
            update = () => {
                this.updateToolHandler(),
                this.mouse.update(),
                this.state.showDialog || (this.updateGamepads(),
                this.checkGamepads()),
                this.screen.update(),
                this.updateControls(),
                this.camera.update(),
                this.sound.update(),
                this.restartTrack && this.restart(),
                !this.state.paused && this.state.playing && (this.message.update(),
                this.updatePlayers(),
                this.score.update(),
                this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
                this.vehicleTimer.update(),
                (this.importCode || this.clear) && this.createTrack(),
                this.isStateDirty() && this.updateState(),
                this.stage.clear(),
                this.draw(),
                this.stage.update(),
                this.camera.updateZoom()
            }
            isStateDirty() {
                var t = this.oldState
                  , e = this.state
                  , i = !1;
                for (var s in e)
                    e[s] !== t[s] && (i = !0,
                    this.oldState[s] = e[s]);
                return i
            }
            updateGamepads() {
                this.playerManager.updateGamepads()
            }
            checkGamepads() {
                this.playerManager.checkKeys()
            }
            stopAudio() {
                createjs.Sound.stop()
            }
            restart() {
                this.verified = !this.settings.requireTrackVerification,
                this.track.dirty = !1,
                this.track.resetPowerups(),
                this.message.hide(),
                this.restartTrack = !1,
                this.state.playing = !1,
                this.ticks = 0,
                this.playerManager.reset(),
                this.camera.focusOnPlayer(),
                this.camera.fastforward(),
                this.score.update()
            }
            buttonDown(button) {
                var e = this.camera;
                switch (this.state.playing = !0,
                button) {
                case "up":
                case "down":
                case "left":
                case "right":
                    e.focusOnMainPlayer();
                    break;
                case "change_camera":
                    e.focusOnNextPlayer();
                    break;
                case "pause":
                    this.state.paused = !this.state.paused;
                    break;
                case "settings":
                    this.command("dialog", "settings");
                    break;
                case "change_vehicle":
                    this.toggleVehicle(),
                    this.stateChanged();
                    break;
                case "zoom_increase":
                    e.increaseZoom(),
                    this.stateChanged();
                    break;
                case "zoom_decrease":
                    e.decreaseZoom(),
                    this.stateChanged();
                    break;
                case "fullscreen":
                    this.toggleFullscreen(),
                    this.stateChanged()
                }
            }
            toggleFullscreen() {
                if (this.settings.embedded) {
                    var t = this.settings
                      , e = t.basePlatformUrl + "/t/" + t.track.url;
                    window.open(e)
                } else
                    this.settings.fullscreenAvailable && (this.settings.fullscreen = this.state.fullscreen = !this.settings.fullscreen)
            }
            updatePlayers() {
                this.playerManager.update()
            }
            drawPlayers() {
                this.playerManager.draw()
            }
            draw() {
                this.toolHandler.drawGrid(),
                this.track.draw(),
                this.drawPlayers(),
                this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
                this.state.loading && this.loadingcircle.draw(),
                this.message.draw()
            }
            getAvailableTrackCode() {
                var t = this.settings
                  , e = !1;
                return t.importCode && "false" !== t.importCode ? (e = t.importCode,
                t.importCode = null) : this.importCode && (e = this.importCode,
                this.importCode = null),
                e
            }
            redraw() {
                this.track.undraw(),
                GameInventoryManager.redraw(),
                this.toolHandler.resize()
            }
            resize() {
                this.pauseControls.resize(),
                this.redoundoControls.resize(),
                this.controls && this.controls.resize()
            }
            updateState() {
                if (null !== this.game.onStateChange) {
                    var t = this.state;
                    t.tool = this.toolHandler.currentTool,
                    t.toolOptions = this.toolHandler.getToolOptions(),
                    t.grid = this.toolHandler.options.grid,
                    t.cameraLocked = this.toolHandler.options.cameraLocked,
                    t.zoomPercentage = this.camera.zoomPercentage,
                    t.vehicle = this.vehicle,
                    this.game.onStateChange(this.state)
                }
            }
            stateChanged() {
                this.updateState()
            }
            setStateDefaults() {
                var t = {};
                return t.paused = this.settings.mobile ? !0 : this.settings.startPaused,
                t.loading = !1,
                t.playing = this.settings.waitForKeyPress,
                t.tool = this.toolHandler.currentTool,
                t.toolOptions = this.toolHandler.getToolOptions(),
                t.grid = this.toolHandler.options.grid,
                t.cameraLocked = this.toolHandler.options.cameraLocked,
                t.zoomPercentage = this.camera.zoomPercentage,
                t.vehicle = this.vehicle,
                t.showDialog = !1,
                t.dialogOptions = !1,
                t.preloading = !1,
                t.fullscreen = this.settings.fullscreen,
                t.inFocus = !0,
                this.controls && (t.hideMenus = this.controls.isVisible()),
                t
            }
            toggleVehicle() {
                var t = this.track.allowedVehicles
                  , e = t.length
                  , i = this.state.vehicle
                  , s = t.indexOf(i);
                s++,
                s >= e && (s = 0);
                var i = t[s];
                this.selectVehicle(i)
            }
            selectVehicle(t) {
                var e = this.track.allowedVehicles
                  , i = e.indexOf(t);
                -1 !== i && (this.vehicle = t,
                this.playerManager.firstPlayer.setBaseVehicle(t),
                this.restartTrack = !0)
            }
            trackAction(t, e) {
                var i = this.toolHandler.analytics.actions
                  , s = this.mouse.analytics.clicks
                  , n = i + s
                  , r = {
                    category: "create",
                    action: t,
                    label: e,
                    value: n,
                    non_interaction: !0
                };
                Application.Helpers.GoogleAnalyticsHelper.track_event(r)
            }
            openDialog(t) {
                switch (this.state.dialogOptions = {},
                t) {
                case "import":
                    break;
                case "export":
                    setTimeout(this.getTrackCode.bind(this), 750);
                    break;
                case "upload":
                    "undefined" == typeof isChromeApp && setTimeout(this.getTrackCode.bind(this), 750)
                }
                this.state.playing = !1,
                this.state.showDialog = t
            }
            getTrackCode() {
                this.state.dialogOptions = {},
                this.state.dialogOptions.verified = this.verified,
                this.state.dialogOptions.code = this.track.getCode()
            }
            trackComplete() {
                this.verified = this.track.dirty ? !1 : !0
            }
            hideControlPlanel() {}
            showControlPlanel() {}
            command() {
                var t = Array.prototype.slice.call(arguments, 0)
                  , e = t.shift();
                switch (e) {
                case "change tool":
                    var i = t[0];
                    this.toolHandler.setTool(i);
                    break;
                case "change tool option":
                    var s = t[0]
                      , n = t[1];
                    "undefined" != typeof t[2] ? this.toolHandler.setToolOption(s, n, t[2]) : this.toolHandler.setToolOption(s, n);
                    break;
                case "snap":
                    this.toolHandler.toggleSnap();
                    break;
                case "add track":
                    this.track.read(demo.code),
                    track = null;
                    break;
                case "redraw":
                    this.redraw();
                    break;
                case "fullscreen":
                    this.settings.fullscreen = this.state.fullscreen = !this.settings.fullscreen;
                    break;
                case "grid":
                    this.toolHandler.toggleGrid();
                    break;
                case "lock camera":
                    this.toolHandler.toggleCameraLock();
                    break;
                case "toggle vehicle":
                    this.toggleVehicle(),
                    this.stateChanged();
                    break;
                case "reset zoom":
                    this.camera.resetZoom();
                    break;
                case "increase zoom":
                    this.camera.increaseZoom();
                    break;
                case "decrease zoom":
                    this.camera.decreaseZoom();
                    break;
                case "change lineType":
                    var r = t[0];
                    this.toolHandler.options.lineType = r,
                    this.stateChanged();
                    break;
                case "resize":
                    this.resize();
                    break;
                case "dialog":
                    var o = t[0];
                    o === !1 ? this.listen() : this.unlisten(),
                    this.openDialog(o);
                    break;
                case "focused":
                    var a = t[0];
                    a === !0 ? (this.state.inFocus = !0,
                    this.state.showDialog === !1 && this.listen()) : (this.state.inFocus = !1,
                    this.unlisten(),
                    this.state.playing = !1);
                    break;
                case "clear track":
                    this.trackAction("editor-action", "clear"),
                    this.clear = !0;
                    break;
                case "import":
                    var h = t[0];
                    h.length <= 0 && (h = !1),
                    this.importCode = h,
                    this.clear = t[1],
                    this.command("dialog", !1)
                }
            }
            listen() {
                var t = this.playerManager.firstPlayer
                  , e = t.getGamepad();
                e.listen()
            }
            unlisten() {
                var t = this.playerManager.firstPlayer
                  , e = t.getGamepad();
                e.unlisten()
            }
            stopAudio() {
                createjs.Sound.stop()
            }
            close() {
                this.trackAction("editor-exit", "exit"),
                this.pauseControls = null,
                this.mouse.close(),
                this.mouse = null,
                this.camera.close(),
                this.camera = null,
                this.screen.close(),
                this.screen = null,
                this.vehicleTimer.close(),
                this.vehicleTimer = null,
                this.playerManager.close(),
                this.playerManager = null,
                this.sound.close(),
                this.sound = null,
                this.track.close(),
                this.toolHandler.close(),
                this.game = null,
                this.assets = null,
                this.settings = null,
                this.stage = null,
                this.track = null,
                this.state = null,
                this.stopAudio()
            }
        }
    },
    10: function(t, e) {
        var MouseHandler = t(63)
          , Score = t(66)
          , CampaignScore = t(57)
          , RaceTimes = t(65)
          , Camera = t(87)
          , Screen = t(88)
          , ToolHandler = t(50)
          , CameraTool = t(35)
          , PlayerManager = t(80)
          , VehicleTimer = t(69)
          , Track = t(56)
          , LoadingCircle = t(61)
          , PauseControls = t(4)
          , SoundManager = t(68)
          , MessageManager = t(62)
          , FullScreenControls = t(3)
          , ControlSettings = t(6)
          , S = t(67);
        e.exports = class Main {
            constructor(game) {
                this.game = game,
                this.assets = game.assets,
                this.stage = game.stage,
                this.settings = game.settings,
                this.sound = new SoundManager(this),
                this.mouse = new MouseHandler(this),
                this.initalizeCamera(),
                this.screen = new Screen(this),
                this.createTrack(),
                this.score = new Score(this),
                this.raceTimes = new RaceTimes(this),
                this.message = new MessageManager(this),
                this.settings.isCampaign && (this.campaignScore = new CampaignScore(this)),
                this.loadingcircle = new LoadingCircle(this),
                this.loading = !1,
                this.ready = !1,
                this.playerManager = new PlayerManager(this),
                this.vehicleTimer = new VehicleTimer(this),
                this.races = [],
                this.state = this.setStateDefaults(),
                this.oldState = this.setStateDefaults(),
                this.createMainPlayer(),
                this.createControls(),
                this.registerTools(),
                this.setStartingVehicle(),
                this.restart(),
                this.initializeAnalytics(),
                this.stage.addEventListener("stagemousedown", this.tapToStartOrRestart.bind(this)),
                window.lite && this.injectLiteFeatures()
            }
            game = null;
            assets = null;
            stage = null;
            settings = null;
            camera = null;
            score = null;
            screen = null;
            mouse = null;
            track = null;
            player = null;
            players = null;
            ticks = 0;
            races = null;
            state = null;
            oldState = null;
            stateDirty = !0;
            onStateChange = null;
            playing = !1;
            ready = !1;
            vehicle = "Mtb";
            showDialog = !1;
            importCode = !1;
            preloading = !0;
            loading = !0;
            pauseControls = null;
            fullscreenControls = null;
            settingsControls = null;
            controls = null;
            message = null;
            showSkip = !1;
            injectLiteFeatures() {
                if(window.lite.getVar("feats")) {
                    fetch("https://raw.githubusercontent.com/calculus-dev/Official_Featured_Ghosts/master/tampermonkey.script.js").then((response) => response.text()).then(data => {
                        var script = document.createElement('script');
                        script.innerHTML = data;
                        document.head.appendChild(script)
                    })
                }
            }
            getCanvasOffset() {
                var t = {
                    height: 0,
                    width: 0
                };
                return t
            }
            tapToStartOrRestart() {
                if (this.settings.mobile) {
                    var t = this.playerManager.firstPlayer;
                    if (t && t._crashed && !this.state.paused) {
                        var e = t.getGamepad();
                        e.setButtonDown("enter")
                    } else
                        this.play()
                }
            }
            analytics = null;
            initializeAnalytics() {
                this.analytics = {
                    deaths: 0
                }
            }
            createControls() {
                this.pauseControls = new PauseControls(this),
                this.settings.fullscreenAvailable && (this.fullscreenControls = new FullScreenControls(this)),
                this.settingsControls = new ControlSettings(this)
            }
            play() {
                this.state.playing || (this.state.playing = !0,
                this.hideControlPlanel())
            }
            buttonDown(button) {
                if (!this.state.showDialog) {
                    var e = this.camera;
                    switch (button) {
                    case "change_camera":
                        e.focusOnNextPlayer();
                        break;
                    case "pause":
                        this.state.paused = !this.state.paused;
                        break;
                    case "settings":
                        this.openDialog("settings");
                        break;
                    case "exit_fullscreen":
                        this.exitFullscreen();
                        break;
                    case "change_vehicle":
                        this.toggleVehicle();
                        break;
                    case "zoom_increase":
                        e.increaseZoom();
                        break;
                    case "zoom_decrease":
                        e.decreaseZoom();
                        break;
                    case "fullscreen":
                        this.toggleFullscreen()
                    }
                }
            }
            exitFullscreen() {
                this.settings.fullscreenAvailable && (this.settings.fullscreen = !1,
                this.state.fullscreen = !1,
                this.trackEvent("game-ui", "game-fullscreen-toggle", "game-out-fullscreen"))
            }
            toggleFullscreen() {
                if (this.settings.embedded) {
                    var t = this.settings
                    , e = t.basePlatformUrl + "/t/" + t.track.url;
                    window.open(e)
                } else
                    this.settings.fullscreenAvailable && (this.settings.fullscreen = !this.settings.fullscreen,
                    this.state.fullscreen = !this.settings.fullscreen,
                    this.settings.fullscreen ? this.trackEvent("game-ui", "game-fullscreen-toggle", "game-into-fullscreen") : this.trackEvent("game-ui", "game-fullscreen-toggle", "game-out-fullscreen"))
            }
            trackEvent(a, b, c) {
                var d = {
                    category: a,
                    action: b,
                    label: c,
                    value: 0,
                    non_interaction: !0
                };
                Application.Helpers.GoogleAnalyticsHelper.track_event(d)
            }
            getAvailableTrackCode() {
                var t = this.settings
                , e = !1;
                return t.importCode && "false" !== t.importCode ? (e = t.importCode,
                t.importCode = null) : this.importCode && (e = this.importCode,
                this.importCode = null),
                e
            }
            createMainPlayer() {
                var t = this.playerManager
                , e = t.createPlayer(this, this.settings.user)
                , i = e.getGamepad();
                i.setKeyMap(this.settings.playHotkeys),
                i.recordKeys(this.settings.keysToRecord),
                i.onButtonDown = this.buttonDown.bind(this),
                i.listen(),
                this.playerManager.firstPlayer = e,
                this.playerManager.addPlayer(e)
            }
            createTrack() {
                this.track && this.track.close();
                var t = new Track(this)
                , e = this.getAvailableTrackCode();
                0 != e && (t.read(e),
                this.track = t,
                this.setTrackAllowedVehicles(),
                this.state.preloading = !1,
                this.loading = !1,
                this.restartTrack = !0,
                this.ready = !0),
                this.track = t
            }
            setTrackAllowedVehicles() {
                var t = this.track
                , e = this.settings.track;
                e && (t.allowedVehicles = e.vehicles)
            }
            initalizeCamera() {
                this.camera = new Camera(this)
            }
            updateControls() {
                if (this.controls) {
                    var t = this.state.paused;
                    this.controls.isVisible() === t && (t || (this.state.playing = !1,
                    this.camera.focusOnMainPlayer(),
                    this.toolHandler.setTool("camera")),
                    this.controls.setVisibility(!t),
                    this.controls.setZoomControlsVisibilty(t),
                    this.updateState()),
                    this.controls.update()
                }
                this.pauseControls.update(),
                this.settings.fullscreenAvailable && this.fullscreenControls.update()
            }
            registerTools() {
                var t = new ToolHandler(this);
                this.toolHandler = t,
                t.registerTool(CameraTool),
                t.setTool("Camera")
            }
            updateToolHandler() {
                this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update()
            }
            update() {
                this.ready ? (this.updateToolHandler(),
                this.mouse.update(),
                this.state.paused || this.state.showDialog || (this.updateGamepads(),
                this.checkGamepads()),
                this.screen.update(),
                this.updateControls(),
                this.camera.update(),
                this.sound.update(),
                this.restartTrack && this.restart(),
                !this.state.paused && this.state.playing && (this.message.update(),
                this.updatePlayers(),
                this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
                this.updateScore(),
                this.vehicleTimer.update(),
                this.isStateDirty() && this.updateState(),
                this.stage.clear(),
                this.draw(),
                this.stage.update(),
                this.camera.updateZoom()) : this.importCode && this.createTrack()
            }
            isStateDirty() {
                var t = this.oldState
                , e = this.state;
                e.fullscreen != GameSettings.fullscreen && (e.fullscreen = GameSettings.fullscreen);
                var i = !1;
                for (var s in e)
                    e[s] !== t[s] && (i = !0,
                    this.oldState[s] = e[s]);
                return i
            }
            updateScore() {
                this.score.update(),
                this.campaignScore && this.campaignScore.update(),
                this.raceTimes.update()
            }
            restart() {
                this.settings.mobile ? this.message.show("Press Any Button To Start", 1, "#333333") : this.message.show("Press Any Key To Start", 1, "#333333", "#FFFFFF"),
                this.track.resetPowerups(),
                this.restartTrack = !1,
                this.state.paused = !1,
                this.state.playing = !this.settings.waitForKeyPress,
                this.ticks = 0,
                this.playerManager.reset(),
                this.playerManager.getPlayerCount() > 0 && (this.camera.focusIndex = 1),
                this.camera.focusOnPlayer(),
                this.camera.fastforward(),
                this.showControlPlanel("main")
            }
            listen() {
                var t = this.playerManager.firstPlayer
                , e = t.getGamepad();
                e.listen()
            }
            unlisten() {
                var t = this.playerManager.firstPlayer
                , e = t.getGamepad();
                e.unlisten()
            }
            stopAudio() {
                createjs.Sound.stop()
            }
            setStartingVehicle() {
                var t = this.settings
                , e = t.startVehicle;
                t.track && (e = t.track.vehicle),
                this.vehicle = e
            }
            updateGamepads() {
                this.playerManager.updateGamepads()
            }
            checkGamepads() {
                this.playerManager.checkKeys()
            }
            updatePlayers() {
                this.playerManager.update()
            }
            drawPlayers() {
                this.playerManager.draw()
            }
            hideControlPlanel() {
                this.state.showSkip && (this.state.showSkip = !1),
                this.state.showControls !== !1 && (this.state.showControls = !1)
            }
            showControlPlanel(c) {
                this.settings.isCampaign && !this.settings.mobile && this.settings.campaignData.can_skip && this.analytics && this.analytics.deaths > 5 && (this.state.showSkip = !0),
                this.stateshowControls !== c && this.settings.showHelpControls && (this.state.showControls = c)
            }
            draw() {
                this.toolHandler.drawGrid(),
                this.track.draw(),
                this.drawPlayers(),
                this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
                this.loading && this.loadingcircle.draw(),
                this.message.draw()
            }
            redraw() {
                this.track.undraw(),
                GameInventoryManager.redraw(),
                this.toolHandler.resize()
            }
            resize() {
                this.pauseControls.resize(),
                this.settings.fullscreenAvailable && this.fullscreenControls.resize(),
                this.settingsControls.resize(),
                this.controls && this.controls.resize()
            }
            updateState() {
                null !== this.game.onStateChange && this.game.onStateChange(this.state)
            }
            stateChanged() {
                this.updateState()
            }
            setStateDefaults() {
                var t = {};
                return t.playing = !this.settings.waitForKeyPress,
                t.paused = !1,
                t.playerAlive = !0,
                t.inFocus = !0,
                t.preloading = !0,
                t.fullscreen = this.settings.fullscreen,
                t.showControls = !1,
                t.showSkip = !1,
                t.showDialog = !1,
                t.dialogOptions = !1,
                t
            }
            toggleVehicle() {
                var t = this.track.allowedVehicles
                , e = t.length
                , i = this.vehicle
                , s = t.indexOf(i);
                s++,
                s >= e && (s = 0);
                var i = t[s];
                this.selectVehicle(i)
            }
            selectVehicle(t) {
                var e = this.track.allowedVehicles
                , i = e.indexOf(t);
                -1 !== i && (this.settings.track.vehicle = t,
                this.vehicle = t,
                this.playerManager.firstPlayer.setBaseVehicle(t),
                this.restartTrack = !0)
            }
            openDialog(t) {
                this.state.playing = !1,
                this.state.showDialog = t
            }
            command() {
                var t = Array.prototype.slice.call(arguments, 0)
                , e = t.shift();
                switch (e) {
                case "resize":
                    this.resize();
                    break;
                case "dialog":
                    var i = t[0];
                    i === !1 ? this.listen() : this.unlisten(),
                    this.openDialog(i);
                    break;
                case "focused":
                    var s = t[0];
                    s === !0 ? (this.state.inFocus = !0,
                    this.state.showDialog === !1 && this.listen()) : (this.state.inFocus = !1,
                    this.unlisten(),
                    this.state.playing = !1);
                    break;
                case "add track":
                    var n = t[0];
                    this.importCode = n.code;
                    break;
                case "clear race":
                    this.races = [],
                    this.restartTrack = !0,
                    this.raceTimes.clear();
                    break;
                case "add race":
                    var r = t[0]
                    , o = t[1];
                    this.addRaces(r),
                    o && (this.state.dialogOptions = {
                        races: this.races
                    },
                    this.command("dialog", "race_dialog"));
                    break;
                case "change vehicle":
                    var a = t[0];
                    this.selectVehicle(a);
                    break;
                case "restart":
                    this.command("dialog", !1),
                    this.restartTrack = !0;
                    break;
                case "resume":
                    this.state.paused = !1;
                    break;
                case "fullscreen":
                    this.toggleFullscreen();
                    break;
                case "exit_fullscreen":
                    this.exitFullscreen()
                }
            }
            addRaces(race) {
                this.mergeRaces(race),
                this.sortRaces(),
                this.formatRaces(),
                this.addRaceTimes(),
                this.addPlayers(),
                this.restartTrack = !0
            }
            addRaceTimes() {
                var t = this.settings.raceColors
                , e = t.length
                , i = this.races
                , s = this.raceTimes;
                s.clear();
                for (var n in i) {
                    var r = i[n];
                    r.user.color = t[n % e],
                    s.addRace(r, n)
                }
            }
            addPlayers() {
                var t = this.races
                , e = this.playerManager;
                e.clear();
                var i = this.settings.keysToRecord;
                for (var s in t) {
                    var n = t[s]
                    , r = n.user
                    , o = n.race
                    , a = o.code;
                    "string" == typeof a && (a = JSON.parse(a));
                    var h = e.createPlayer(this, r);
                    h.setBaseVehicle(o.vehicle),
                    h.setAsGhost();
                    var l = h.getGamepad();
                    l.loadPlayback(a, i),
                    e.addPlayer(h)
                }
            }
            formatRaces() {
                var t = this.races;
                for (var e in t) {
                    var i = t[e].race
                    , s = i.code;
                    if ("string" == typeof s) {
                        s = JSON.parse(s);
                        for (var n in s) {
                            var o = {};
                            for(var b in s[n]) {
                                o[s[n][b]] = 0;
                                o[s[n][b]]++
                            }
                            s[n] = o
                        }
                        i.code = s
                    }
                }
            }
            removeDuplicateRaces() {}
            uniqesByUserIdIterator(a) {
                var e = a.user;
                return e.u_id
            }
            sortRaces() {
                this.races.forEach(t => {
                    this.sortByRunTicksIterator(t);
                });
                this.races.sort((a, b) => {
                    return a.race.run_ticks - b.race.run_ticks
                });
            }
            mergeRaces(race) {
                race = race[0] || race;
                if(race) {
                    for(var t in this.races) {
                        if(this.races[t].user.u_id === (race.user.u_id)) {
                            if(this.races[t].race.run_ticks === race.race.run_ticks) {
                                return;
                            }
                        }
                    }
                    this.races.push(race);
                }
            }
            sortByRunTicksIterator(a) {
                var e = this.settings
                , i = parseInt(a.race.run_ticks)
                , s = formatNumber(i / e.drawFPS * 1e3);
                return a.runTime = s,
                i
            }
            verifyComplete() {
                var t = this.playerManager.firstPlayer
                , e = t._powerupsConsumed.targets
                , i = this.track.targets
                , s = !0;
                for (var n in i) {
                    var r = i[n]
                    , o = r.id;
                    -1 === e.indexOf(o) && (s = !1)
                }
                return s
            }
            trackComplete() {
                if (this.verifyComplete()) {
                    this.sound.play("victory_sound");
                    var t = this.playerManager;
                    t.mutePlayers();
                    var e = t.firstPlayer
                    , i = e.getGamepad()
                    , s = i.getReplayString()
                    , n = this.settings
                    , r = this.ticks
                    , o = formatNumber(r / n.drawFPS * 1e3)
                    , a = $("#track-data").data("t_id")
                    , h = {
                        t_id: a,
                        u_id: n.user.u_id,
                        code: s,
                        vehicle: e._baseVehicleType,
                        run_ticks: r,
                        fps: 25,
                        time: o
                    }
                    , l = h.t_id + "|" + h.u_id + "|" + h.code + "|" + h.run_ticks + "|" + h.vehicle + "|" + h.fps + "|erxrHHcksIHHksktt8933XhwlstTekz"
                    , c = S.SHA256(l).toString();
                    h.sig = c;
                    var u = this.races
                    , p = u.length
                    , d = [];
                    if (p > 0) {
                        for (var f = 0; p > f; f++)
                            d.push(u[f].user.u_id);
                        h.races = d
                    }
                    n.isCampaign && (h.is_campaign = !0),
                    this.state.dialogOptions = {
                        postData: h,
                        analytics: this.analytics
                    },
                    n.isCampaign ? this.command("dialog", "campaign_complete") : this.command("dialog", "track_complete"),
                    i.reset(!0),
                    this.listen()
                }
            }
            drawFPS() {
                var t = createjs.Ticker.getMeasuredFPS()
                , e = this.game.pixelRatio
                , i = this.game.canvas.getContext("2d")
                , s = 5
                , n = this.screen.height - 12 * e
                , r = round(10 * t) / 10
                , o = "FPS : " + r;
                i.save(),
                i.fillStyle = "#000000",
                i.font = 8 * e + "pt arial",
                i.fillText(o, s * e, n),
                i.restore()
            }
            close() {
                this.fullscreenControls = null,
                this.settingsControls = null,
                this.pauseControls = null,
                this.raceTimes = null,
                this.score = null,
                this.campaignScore = null,
                this.mouse.close(),
                this.mouse = null,
                this.camera.close(),
                this.camera = null,
                this.screen.close(),
                this.screen = null,
                this.vehicleTimer.close(),
                this.vehicleTimer = null,
                this.playerManager.close(),
                this.playerManager = null,
                this.sound.close(),
                this.sound = null,
                this.track.close(),
                this.toolHandler.close(),
                this.game = null,
                this.assets = null,
                this.settings = null,
                this.stage = null,
                this.track = null,
                this.state = null,
                this.stopAudio()
            }
        }
    },
    11: function(t, e) {
        var Vector = t(8);
        e.exports = class PhysicsLine {
            constructor(a, b, c, d) {
                this.p1 = new Vector(a, b),
                this.p2 = new Vector(c, d),
                this.pp = this.p2.sub(this.p1),
                this.len = this.pp.len(),
                this.sectors = [],
                this.collided = !1,
                this.remove = !1,
                this.highlight = !1,
                this.recorded = !1
            }
            sectors = null;
            p1 = null;
            p2 = null;
            pp = null;
            len = 0;
            collided = !1;
            remove = !1;
            highlight = !1;
            recorded = !1;
            getCode(a) {
                this.recorded = !0;
                var e = this.p2
                  , i = " " + e.x.toString(32) + " " + e.y.toString(32)
                  , s = this.checkForConnectedLine(a, e);
                return s && (i += s.getCode(a)),
                i
            }
            checkForConnectedLine(a, e) {
                var i = a.settings.physicsSectorSize
                  , s = a.sectors.physicsSectors
                  , n = floor(e.x / i)
                  , r = floor(e.y / i);
                return s[n][r].searchForLine("physicsLines", e)
            }
            addSectorReference(a) {
                this.sectors.push(a)
            }
            removeAllReferences() {
                this.remove = !0;
                for (var t = this.sectors, e = t.length, i = 0; e > i; i++)
                    t[i].drawn = !1,
                    t[i].dirty = !0;
                this.sectors = []
            }
            erase(t, e) {
                var i = !1;
                if (!this.remove) {
                    var s = this.p1
                      , r = this.p2
                      , o = t
                      , a = e
                      , h = r.sub(s)
                      , l = s.sub(o)
                      , c = h.dot(h)
                      , u = 2 * l.dot(h)
                      , p = l.dot(l) - a * a
                      , d = u * u - 4 * c * p;
                    if (d > 0) {
                        d = sqrt(d);
                        var f = (-u - d) / (2 * c)
                          , v = (-u + d) / (2 * c);
                        f >= 0 && 1 >= f && (i = !0,
                        this.removeAllReferences()),
                        v >= 0 && 1 >= v && (i = !0,
                        this.removeAllReferences())
                    }
                    this.intersects(this.p1.x, this.p1.y, t.x, t.y, e) ? (i = !0,
                    this.removeAllReferences()) : this.intersects(this.p2.x, this.p2.y, t.x, t.y, e) && (i = !0,
                    this.removeAllReferences())
                }
                return i
            }
            intersects(a, b, c, d, e) {
                var r = a - c
                  , o = b - d;
                return e * e >= r * r + o * o
            }
            collide(a) {
                if (!this.collided) {
                    this.collided = !0;
                    var e = a.pos
                      , i = a.vel
                      , s = a.radius
                      , o = 0
                      , b = 0
                      , h = 0
                      , l = this.p1
                      , c = this.p2
                      , u = e.x - l.x
                      , p = e.y - l.y
                      , d = this.pp
                      , f = this.len
                      , v = (u * d.x + p * d.y) / f / f;
                    if (v >= 0 && 1 >= v) {
                        var g = (u * d.y - p * d.x) * ((u - i.x) * d.y - (p - i.y) * d.x) < 0 ? -1 : 1
                          , o = u - d.x * v
                          , b = p - d.y * v;
                        if (h = sqrt(pow(o, 2) + pow(b, 2)),
                        0 === h && (h = 1),
                        s > h || 0 > g) {
                            var m = (s * g - h) / h;
                            return e.x += o * m,
                            e.y += b * m,
                            void a.drive(-b / h, o / h)
                        }
                    }
                    if (!(-s > v * f || v * f > f + s)) {
                        var y = v > 0 ? c : l;
                        if (o = e.x - y.x,
                            b = e.y - y.y,
                        h = sqrt(pow(o, 2) + pow(b, 2)),
                        0 === h && (h = 1),
                        s > h) {
                            var m = (s - h) / h;
                            return e.x += o * m,
                            e.y += b * m,
                            void a.drive(-b / h, o / h)
                        }
                    }
                }
            }
        }
    },
    12: function(t, e) {
        e.exports = class Powerup {
            init(a) {
                this.game = a.scene.game,
                this.scene = a.scene,
                this.settings = this.game.settings,
                this.remove = !1
            }
            scene = null
            angle = 0
            x = 0
            y = 0
            name = null
            sector = null
            settings = null
            remove = !1
            getCode() {}
            draw() {}
            erase(a, b) {
                var i = !1;
                if (!this.remove) {
                    var r = sqrt(pow(a.x - this.x, 2) + pow(a.y - this.y, 2));
                    b >= r && (i = [this],
                    this.removeAllReferences())
                }
                return i
            }
            removeAllReferences() {
                this.remove = !0,
                this.sector && (this.sector.powerupCanvasDrawn = !1,
                this.sector.dirty = !0,
                this.sector = null),
                this.scene.track.cleanPowerups()
            }
            collide(a) {
                var e = a.pos.x - this.x
                  , i = a.pos.y - this.y
                  , r = sqrt(pow(e, 2) + pow(i, 2));
                !this.hit && 26 > r && (this.hit = !0,
                this.sector.powerupCanvasDrawn = !1)
            }
            addSectorReference(a) {
                this.sector = a
            }
        }
    },
    13: function(t, e) {
        var Powerup = t(12),
            powerup = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 25,
                height: 25
            }
        e.exports = class Antigravity extends Powerup {
            constructor(a, b, c){
                super();
                this.x = a,
                this.y = b,
                this.init(c)
            }
            x = 0;
            y = 0;
            name = "antigravity";
            getCode() {
                return "A " + this.x.toString(32) + " " + this.y.toString(32)
            }
            recache(a) {
                powerup.dirty = !1;
                powerup.canvas.width = powerup.width * a,
                powerup.canvas.height = powerup.height * a;
                var i = powerup.canvas.getContext("2d")
                  , s = powerup.canvas.width / 2
                  , n = powerup.canvas.height / 2;
                this.drawPowerup(s, n, a, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, powerup.canvas.width, powerup.canvas.height),
                i.strokeStyle = "red",
                i.strokeWidth = 1 * a,
                i.stroke())
            }
            setDirty(a) {
                powerup.dirty = a
            }
            draw(a, b, c, d) {
                powerup.dirty && this.recache(c);
                var n = powerup.width * c
                  , o = powerup.height * c
                  , e = n / 2
                  , h = o / 2
                  , l = a
                  , f = b;
                d.translate(l, f),
                d.drawImage(powerup.canvas, -e, -h, n, o),
                d.translate(-l, -f)
            }
            drawPowerup(t, e, i, s) {
                i *= .5,
                s.save(),
                s.beginPath(),
                s.scale(i, i),
                s.moveTo(0, 0),
                s.lineTo(50, 0),
                s.lineTo(50, 50),
                s.lineTo(0, 50),
                s.closePath(),
                s.clip(),
                s.translate(0, 0),
                s.translate(0, 0),
                s.scale(1, 1),
                s.translate(0, 0),
                s.strokeStyle = "rgba(0,0,0,0)",
                s.lineCap = "butt",
                s.lineJoin = "miter",
                s.miterLimit = 4,
                s.save(),
                s.restore(),
                s.save(),
                s.restore(),
                s.save(),
                s.fillStyle = "rgba(0, 0, 0, 0)",
                s.strokeStyle = "rgba(0, 0, 0, 0)",
                s.lineWidth = 1,
                s.translate(-726, -131),
                s.save(),
                s.translate(726, 131),
                s.save(),
                s.fillStyle = "#08faf3",
                s.strokeStyle = "#000000",
                s.lineWidth = 2,
                s.beginPath(),
                s.moveTo(25, 36),
                s.bezierCurveTo(18.9251591, 36, 14, 31.0751824, 14, 25),
                s.bezierCurveTo(14, 18.9248176, 18.9251591, 14, 25, 14),
                s.bezierCurveTo(31.0751824, 14, 36, 18.9248176, 36, 25),
                s.bezierCurveTo(36, 31.0751824, 31.0751824, 36, 25, 36),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(25, 35),
                s.bezierCurveTo(30.5228976, 35, 35, 30.5228976, 35, 25),
                s.bezierCurveTo(35, 19.4771024, 30.5228976, 15, 25, 15),
                s.bezierCurveTo(19.4773211, 15, 15, 19.4772251, 15, 25),
                s.bezierCurveTo(15, 30.5227749, 19.4773211, 35, 25, 35),
                s.closePath(),
                s.moveTo(25, 37),
                s.bezierCurveTo(18.3727612, 37, 13, 31.627354, 13, 25),
                s.bezierCurveTo(13, 18.372646, 18.3727612, 13, 25, 13),
                s.bezierCurveTo(31.6274671, 13, 37, 18.3725329, 37, 25),
                s.bezierCurveTo(37, 31.6274671, 31.6274671, 37, 25, 37),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(1.0370609, 29.702878),
                s.lineTo(.571767448, 27.3196417),
                s.lineTo(10.8190136, 27.3196417),
                s.lineTo(11.2235626, 28.7886215),
                s.bezierCurveTo(12.5553335, 33.6244869, 16.3752072, 37.4442862, 21.2110994, 38.7761385),
                s.lineTo(22.6800518, 39.1807024),
                s.lineTo(22.6800518, 49.4279421),
                s.lineTo(20.2968028, 48.9626301),
                s.bezierCurveTo(10.5816525, 47.0658182, 2.93381735, 39.4180779, 1.0370609, 29.702878),
                s.closePath(),
                s.moveTo(48.9629391, 20.297122),
                s.lineTo(49.4282326, 22.6803583),
                s.lineTo(39.1809639, 22.6803583),
                s.lineTo(38.7764299, 21.2113511),
                s.bezierCurveTo(37.4446547, 16.3752014, 33.624798, 12.5554192, 28.7886215, 11.2235626),
                s.lineTo(27.3196417, 10.8190136),
                s.lineTo(27.3196417, .571783441),
                s.lineTo(29.7028653, 1.03705842),
                s.bezierCurveTo(39.418382, 2.93381152, 47.0661305, 10.5816549, 48.9629391, 20.297122),
                s.closePath(),
                s.moveTo(11.2235701, 21.2113511),
                s.lineTo(10.8190361, 22.6803583),
                s.lineTo(.571767448, 22.6803583),
                s.lineTo(1.0370609, 20.297122),
                s.bezierCurveTo(2.93380373, 10.5819918, 10.5815702, 2.93422536, 20.2967378, 1.03707606),
                s.lineTo(22.6800518, .571669532),
                s.lineTo(22.6800518, 10.8189911),
                s.lineTo(21.2110994, 11.223555),
                s.bezierCurveTo(16.3751604, 12.5554202, 12.5553324, 16.3752482, 11.2235701, 21.2113511),
                s.closePath(),
                s.moveTo(29.7028653, 48.9626351),
                s.lineTo(27.3196417, 49.4279101),
                s.lineTo(27.3196417, 39.1806799),
                s.lineTo(28.7886215, 38.7761309),
                s.bezierCurveTo(33.6247513, 37.4442873, 37.4446537, 33.6245336, 38.7764374, 28.7886215),
                s.lineTo(39.1809864, 27.3196417),
                s.lineTo(49.4282326, 27.3196417),
                s.lineTo(48.9629391, 29.702878),
                s.bezierCurveTo(47.0661446, 39.4182726, 39.4184545, 47.0658678, 29.7028653, 48.9626351),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#08faf3",
                s.beginPath(),
                s.moveTo(3, 29.3196417),
                s.bezierCurveTo(4.74079001, 38.2359804, 11.7640196, 45.2589035, 20.6800518, 46.9996935),
                s.lineTo(20.6800518, 40.7043471),
                s.bezierCurveTo(15.1649961, 39.1854465, 10.814247, 34.8350039, 9.29534642, 29.3196417),
                s.lineTo(3, 29.3196417),
                s.closePath(),
                s.moveTo(47, 20.6803583),
                s.bezierCurveTo(45.25921, 11.7640196, 38.2362869, 4.74079001, 29.3196417, 3),
                s.lineTo(29.3196417, 9.29534642),
                s.bezierCurveTo(34.8350039, 10.814247, 39.185753, 15.1646897, 40.7046536, 20.6803583),
                s.lineTo(47, 20.6803583),
                s.closePath(),
                s.moveTo(9.29534642, 20.6803583),
                s.bezierCurveTo(10.814247, 15.1646897, 15.1649961, 10.814247, 20.6800518, 9.29534642),
                s.lineTo(20.6800518, 3),
                s.bezierCurveTo(11.7640196, 4.74109649, 4.74079001, 11.7640196, 3, 20.6803583),
                s.lineTo(9.29534642, 20.6803583),
                s.closePath(),
                s.moveTo(29.3196417, 46.9996935),
                s.bezierCurveTo(38.2362869, 45.2589035, 45.25921, 38.2359804, 47, 29.3196417),
                s.lineTo(40.7046536, 29.3196417),
                s.bezierCurveTo(39.185753, 34.8350039, 34.8350039, 39.1854465, 29.3196417, 40.7043471),
                s.lineTo(29.3196417, 46.9996935),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore()
            }
            collide(a) {
                {
                    var e = a.parent
                      , i = e.player
                      , s = a.pos.x - this.x
                      , r = a.pos.y - this.y
                      , o = pow(s, 2) + pow(r, 2)
                      , b = e.masses;
                    b.length
                }
                1e3 > o && i.isAlive() && (i.isGhost() === !1 && ((0 != e.gravity.x || 0 != e.gravity.y) && this.scene.sound.play("antigravity_sound", .3),
                this.scene.message.show("Antigravity Engaged", 50, "#08faf3")),
                e.gravity.x = 0,
                e.gravity.y = 0)
            }
        }
    },
    14: function(t, e) {
        var Powerup = t(12)
          , n = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 26,
                height: 26
            };
        e.exports = class Bomb extends Powerup {
            constructor(a, b, c) {
                super();
                this.x = a,
                this.y = b,
                this.init(c),
                this.hit = !1
            }
            x = 0;
            y = 0;
            name = "bomb";
            getCode() {
                return "O " + this.x.toString(32) + " " + this.y.toString(32)
            }
            recache(t) {
                n.dirty = !1;
                var e = n.canvas;
                e.width = n.width * t,
                e.height = n.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , r = e.height / 2;
                this.drawCircle(s, r, t, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, e.width, e.height),
                i.strokeStyle = "red",
                i.strokeWidth = 1 * t,
                i.stroke())
            }
            setDirty(t) {
                n.dirty = t
            }
            draw(t, e, i, s) {
                if (!this.hit) {
                    n.dirty && this.recache(i);
                    var r = n.width * i
                    , o = n.height * i
                    , a = r / 2
                    , h = o / 2;
                    s.drawImage(n.canvas, t - a, e - h, r, o)
                }
            }
            drawCircle(t, e, i, s) {
                i *= .2,
                s.fillStyle = "#000",
                s.strokeStyle = "#000",
                s.lineWidth = 8 * i,
                s.beginPath(),
                s.moveTo(53 * i, 105 * i),
                s.lineTo(41.5 * i, 115 * i),
                s.lineTo(43 * i, 100 * i),
                s.bezierCurveTo(35.5 * i, 95 * i, 30 * i, 88.5 * i, 26.5 * i, 80 * i),
                s.lineTo(11 * i, 78 * i),
                s.lineTo(24 * i, 69.5 * i),
                s.bezierCurveTo(24 * i, 68 * i, 24 * i, 67 * i, 24 * i, 66 * i),
                s.bezierCurveTo(24 * i, 58.5 * i, 26 * i, 51 * i, 30 * i, 45 * i),
                s.lineTo(22 * i, 31.5 * i),
                s.lineTo(37.5 * i, 36 * i),
                s.bezierCurveTo(43.5 * i, 31 * i, 51 * i, 27.5 * i, 60 * i, 26 * i),
                s.lineTo(66 * i, 11 * i),
                s.lineTo(72 * i, 26.5 * i),
                s.bezierCurveTo(80.5 * i, 27.5 * i, 88 * i, 31 * i, 93.5 * i, 36.5 * i),
                s.lineTo(110 * i, 31.5 * i),
                s.lineTo(101.5 * i, 46 * i),
                s.bezierCurveTo(105 * i, 52 * i, 107 * i, 59 * i, 107 * i, 66 * i),
                s.bezierCurveTo(107 * i, 67 * i, 107 * i, 68 * i, 107 * i, 69 * i),
                s.lineTo(121 * i, 78 * i),
                s.lineTo(104.5 * i, 80.5 * i),
                s.bezierCurveTo(101.5 * i, 88 * i, 96 * i, 95 * i, 89 * i, 99.5 * i),
                s.lineTo(90.5 * i, 115 * i),
                s.lineTo(78.5 * i, 104.5 * i),
                s.bezierCurveTo(74.5 * i, 106 * i, 70 * i, 107 * i, 65.5 * i, 107 * i),
                s.bezierCurveTo(61 * i, 107 * i, 57 * i, 106 * i, 53 * i, 105 * i),
                s.lineTo(53 * i, 105 * i),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.beginPath(),
                s.arc(66 * i, 66 * i, 40 * i, 0 * i, 2 * PI, !0),
                s.lineWidth = 2 * i,
                s.fillStyle = "#d12929",
                s.fill(),
                s.stroke(),
                s.beginPath(),
                s.arc(66 * i, 66 * i, 8 * i, 0 * i, 2 * PI, !0),
                s.lineWidth = 2 * i,
                s.fillStyle = "#000",
                s.fill(),
                s.stroke()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , n = t.pos.y - this.y
                , a = sqrt(pow(s, 2) + pow(n, 2));
                20 > a && i.isAlive() && (e.explode(),
                i.isGhost() === !1 && (this.hit = !0,
                this.sector.powerupCanvasDrawn = !1))
            }
        }
    },
    15: function(t, e) {
        var Powerup = t(12)
          , r = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 24,
                height: 16
            };
        e.exports = class Booster extends Powerup {
            constructor(a, b, c, d) {
                super();
                this.x = a,
                this.y = b,
                this.angle = c,
                this.realAngle = c;
                var n = (c - 180) / 360 * 2 * PI;
                this.directionX = (-sin(n)).toFixed(15) / 1,
                this.directionY = cos(n).toFixed(15) / 1,
                this.init(d)
            }
            x = 0;
            y = 0;
            name = "boost";
            angle = 0;
            realAngle = 0;
            directionX = 0;
            directionY = 0;
            getCode() {
                return "B " + this.x.toString(32) + " " + this.y.toString(32) + " " + this.realAngle.toString(32)
            }
            recache(t) {
                r.dirty = !1;
                var e = r.canvas;
                e.width = r.width * t,
                e.height = r.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , n = e.height / 2;
                this.drawCircle(s, n, t, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, e.width, e.height),
                i.strokeStyle = "red",
                i.strokeWidth = 1 * t,
                i.stroke())
            }
            setDirty(t) {
                r.dirty = t
            }
            draw(t, e, i, s) {
                r.dirty && this.recache(i);
                var n = r.width * i
                , o = r.height * i
                , a = n / 2
                , h = o / 2
                , l = t
                , c = e
                , u = (this.angle - 90) * (PI / 180);
                s.translate(l, c),
                s.rotate(u),
                s.drawImage(r.canvas, -a, -h, n, o),
                s.rotate(-u),
                s.translate(-l, -c)
            }
            drawCircle(t, e, i, s) {
                s.save(),
                s.strokeStyle = "rgba(0,0,0,0)",
                s.lineCap = "round",
                s.fillStyle = "#8ac832",
                s.strokeStyle = "#000000",
                i *= .2,
                s.lineWidth = max(8 * i, 1),
                s.beginPath(),
                s.moveTo(0 * i, 0 * i),
                s.lineTo(118 * i, 0 * i),
                s.lineTo(118 * i, 81 * i),
                s.lineTo(0 * i, 81 * i),
                s.closePath(),
                s.beginPath(),
                s.moveTo(3 * i, 1.5 * i),
                s.lineTo(35 * i, 1.7 * i),
                s.lineTo(66 * i, 40 * i),
                s.lineTo(34 * i, 78 * i),
                s.lineTo(4 * i, 78 * i),
                s.lineTo(36 * i, 39 * i),
                s.lineTo(3 * i, 1.5 * i),
                s.closePath(),
                s.moveTo(53 * i, 1.5 * i),
                s.lineTo(85 * i, 1.7 * i),
                s.lineTo(116 * i, 40 * i),
                s.lineTo(84 * i, 78 * i),
                s.lineTo(54 * i, 78 * i),
                s.lineTo(85 * i, 39 * i),
                s.lineTo(53 * i, 1.5 * i),
                s.closePath(),
                s.fill(),
                s.stroke()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , r = t.pos.y - this.y
                , o = pow(s, 2) + pow(r, 2)
                , a = e.masses
                , h = a.length
                , l = this.directionX
                , c = this.directionY;
                if (1e3 > o && i.isAlive()) {
                    for (var u = h - 1; u >= 0; u--) {
                        var p = a[u].pos;
                        p.x += l,
                        p.y += c
                    }
                    i.isGhost() === !1 && (this.scene.sound.play("boost_sound"),
                    this.scene.message.show("Boost Engaged", 50, "#8ac832"))
                }
            }
        }
    },
    16: function(t, e) {
        var Powerup = t(12)
          , a = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 20,
                height: 32
            };
        e.exports = class Checkpoint extends Powerup {
            constructor(a, b, c) {
                super();
                this.x = a,
                this.y = b,
                this.id = random().toString(36).substr(2),
                this.init(c)
            }
            x = 0;
            y = 0;
            name = "checkpoint";
            getCode() {
                return "C " + this.x.toString(32) + " " + this.y.toString(32)
            }
            recache(t) {
                a.dirty = !1;
                var e = a.canvas;
                e.width = a.width * t,
                e.height = a.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , n = e.height / 2;
                this.drawCircle(s, n, t, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, e.width, e.height),
                i.strokeStyle = "red",
                i.strokeWidth = 1 * t,
                i.stroke())
            }
            setDirty(t) {
                a.dirty = t
            }
            draw(t, e, i, s) {
                a.dirty && this.recache(i);
                var n = a.width * i
                , r = a.height * i
                , o = n / 2
                , h = r / 2;
                s.save(),
                this.hit && (s.globalAlpha = .3),
                s.drawImage(a.canvas, t - o, e - h, n, r),
                s.restore()
            }
            drawCircle(t, e, i, s) {
                i *= .15,
                s.save(),
                s.translate(1, 1),
                s.beginPath(),
                s.moveTo(0 * i, 0 * i),
                s.lineTo(112 * i, 0 * i),
                s.lineTo(112 * i, 95 * i),
                s.lineTo(0 * i, 95 * i),
                s.closePath(),
                s.fillStyle = "#826cdc",
                s.strokeStyle = "#000000",
                s.lineWidth = 8 * i,
                s.beginPath(),
                s.moveTo(3 * i, 10 * i),
                s.bezierCurveTo(3 * i, 10 * i, 33.5 * i, 27 * i, 55 * i, 10 * i),
                s.bezierCurveTo(76 * i, -6 * i, 108 * i, 10 * i, 108 * i, 10 * i),
                s.lineTo(109 * i, 86 * i),
                s.bezierCurveTo(109 * i, 86 * i, 74 * i, 73.5 * i, 56.5 * i, 86 * i),
                s.bezierCurveTo(40 * i, 98 * i, 3 * i, 88.5 * i, 3 * i, 88.5 * i),
                s.lineTo(3 * i, 10 * i),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.beginPath(),
                s.lineWidth = 15 * i,
                s.moveTo(3 * i, 10 * i),
                s.lineTo(3 * i, 180 * i),
                s.stroke(),
                s.restore()
            }
            collide(t) {
                var e = t.parent
                  , i = e.player
                  , s = t.pos.x - this.x
                  , o = t.pos.y - this.y
                  , a = sqrt(pow(s, 2) + pow(o, 2))
                  , h = i._powerupsConsumed.checkpoints;
                26 > a && i.isAlive() && -1 === h.indexOf(this.id) && (h.push(this.id),
                i.setCheckpointOnUpdate(),
                i.isGhost() === !1 && (this.hit = !0,
                this.sector.powerupCanvasDrawn = !1,
                this.scene.message.show("Checkpoint Saved", 50, "#826cdc", "#FFFFFF"),
                this.scene.sound.play("checkpoint_sound")))
            }
        }
    },
    17: function(t, e) {
        var Powerup = t(12)
          , r = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 20,
                height: 20
            };
        e.exports = class Gravity extends Powerup {
            constructor(a, b, c, d) {
                super();
                this.x = a,
                this.y = b,
                this.angle = c - 180,
                this.realAngle = c;
                var n = this.angle / 360 * 2 * PI;
                this.directionX = (-.3 * sin(n)).toFixed(15) / 1,
                this.directionY = (.3 * cos(n)).toFixed(15) / 1,
                this.init(d)
            }
            x = 0;
            y = 0;
            angle = 0;
            realAngle = 0;
            name = "gravity";
            recache(t) {
                r.dirty = !1;
                var e = r.canvas;
                e.width = r.width * t,
                e.height = r.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , n = e.height / 2;
                this.drawArrow(s, n, t, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, e.width, e.height),
                i.strokeStyle = "red",
                i.strokeWidth = 3 * t,
                i.stroke())
            }
            getCode() {
                return "G " + this.x.toString(32) + " " + this.y.toString(32) + " " + this.realAngle.toString(32)
            }
            setDirty(t) {
                r.dirty = t
            }
            draw(t, e, i, s) {
                r.dirty && this.recache(i);
                var n = r.width * i
                , o = r.height * i
                , a = n / 2
                , h = o / 2
                , l = t
                , c = e
                , u = (this.angle + 90) * (PI / 180);
                s.translate(l, c),
                s.rotate(u),
                s.drawImage(r.canvas, -a, -h, n, o),
                s.rotate(-u),
                s.translate(-l, -c)
            }
            drawArrow(t, e, i, s) {
                i *= .2,
                s.beginPath(),
                s.moveTo(0 * i, 0 * i),
                s.lineTo(97 * i, 0 * i),
                s.lineTo(97 * i, 96 * i),
                s.lineTo(0 * i, 96 * i),
                s.closePath(),
                s.clip(),
                s.fillStyle = "rgba(0, 0, 0, 0)",
                s.strokeStyle = "rgba(0, 0, 0, 0)",
                s.lineWidth = max(6 * i, 1),
                s.save(),
                s.fillStyle = "#376eb7",
                s.strokeStyle = "#000000",
                s.beginPath(),
                s.moveTo(41 * i, 70 * i),
                s.lineTo(41 * i, 95 * i),
                s.lineTo(97 * i, 48 * i),
                s.lineTo(41 * i, 1 * i),
                s.lineTo(41 * i, 25 * i),
                s.lineTo(1 * i, 25 * i),
                s.lineTo(1 * i, 70 * i),
                s.lineTo(41 * i, 70 * i),
                s.closePath(),
                s.closePath(),
                s.fill(),
                s.stroke()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , r = t.pos.y - this.y
                , o = pow(s, 2) + pow(r, 2)
                , a = e.masses
                , h = (a.length,
                this.directionX)
                , l = this.directionY;
                1e3 > o && i.isAlive() && (e.gravity.x = h,
                e.gravity.y = l,
                i.isGhost() === !1 && (this.scene.message.show("Gravity Changed", 50, "#1F80C3", "#FFFFFF"),
                this.scene.sound.play("gravity_down_sound")))
            }
        }
    },
    18: function(t, e) {
        var Powerup = t(12),
            r = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 24,
                height: 24 
            };
        e.exports = class Slowmo extends Powerup {
            constructor(a, b, c) {
                super();
                this.x = a,
                this.y = b,
                this.init(c)
            }
            x = 0;
            y = 0;
            name = "slowmo";
            recache(t) {
                r.dirty = !1;
                var e = r.canvas;
                e.width = r.width * t,
                e.height = r.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , n = e.height / 2;
                this.drawCircle(s, n, t, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, e.width, e.height),
                i.strokeStyle = "red",
                i.strokeWidth = 1 * t,
                i.stroke())
            }
            setDirty(t) {
                r.dirty = t
            }
            getCode() {
                return "S " + this.x.toString(32) + " " + this.y.toString(32)
            }
            draw(t, e, i, s) {
                r.dirty && this.recache(i);
                var n = r.width * i
                , r = r.height * i
                , a = n / 2
                , h = r / 2;
                s.drawImage(r.canvas, t - a, e - h, n, r)
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , o = t.pos.y - this.y
                , a = sqrt(pow(s, 2) + pow(o, 2));
                !this.hit && 26 > a && i.isAlive() && (e.slow = !0,
                i.isGhost() === !1 && (this.scene.sound.play("slowmo_sound"),
                this.scene.message.show("Slow Motion", 50, "#FFFFFF", "#000000")))
            }
            drawCircle(t, e, i, s) {
                s.save(),
                s.beginPath(),
                i *= .2,
                s.moveTo(0 * i, 0 * i),
                s.lineTo(116 * i, 0 * i),
                s.lineTo(116 * i, 114 * i),
                s.lineTo(0 * i, 114 * i),
                s.closePath(),
                s.fillStyle = "#FFF",
                s.strokeStyle = "#000000",
                s.lineWidth = max(3 * i, .5),
                s.beginPath(),
                s.moveTo(58 * i, 111 * i),
                s.bezierCurveTo(89 * i, 111 * i, 114 * i, 87 * i, 114 * i, 56 * i),
                s.bezierCurveTo(114 * i, 26 * i, 89 * i, 2 * i, 58 * i, 2 * i),
                s.bezierCurveTo(27.1748289 * i, 2 * i, 2 * i, 26 * i, 2 * i, 56 * i),
                s.bezierCurveTo(2 * i, 87 * i, 27.1748289 * i, 111 * i, 58 * i, 111 * i),
                s.closePath(),
                s.moveTo(58 * i, 103 * i),
                s.bezierCurveTo(84 * i, 103 * i, 106 * i, 82 * i, 106 * i, 56 * i),
                s.bezierCurveTo(106 * i, 30 * i, 84 * i, 9 * i, 58 * i, 9 * i),
                s.bezierCurveTo(31 * i, 9 * i, 10 * i, 30 * i, 10 * i, 56 * i),
                s.bezierCurveTo(10 * i, 82 * i, 31 * i, 103 * i, 58 * i, 103 * i),
                s.closePath(),
                s.moveTo(58 * i, 55 * i),
                s.lineTo(37 * i, 23 * i),
                s.lineTo(35 * i, 25 * i),
                s.lineTo(56 * i, 57 * i),
                s.lineTo(58 * i, 55 * i),
                s.closePath(),
                s.moveTo(58.5 * i, 59 * i),
                s.lineTo(81.5 * i, 59 * i),
                s.lineTo(81.5 * i, 56 * i),
                s.lineTo(58.5 * i, 56 * i),
                s.lineTo(58.5 * i, 59 * i),
                s.closePath(),
                s.moveTo(98.5 * i, 59 * i),
                s.lineTo(105.5 * i, 59 * i),
                s.lineTo(105.5 * i, 56 * i),
                s.lineTo(98.5 * i, 56 * i),
                s.lineTo(98.5 * i, 59 * i),
                s.closePath(),
                s.moveTo(11.5 * i, 59 * i),
                s.lineTo(18.5 * i, 59 * i),
                s.lineTo(18.5 * i, 56 * i),
                s.lineTo(11.5 * i, 56 * i),
                s.lineTo(11.5 * i, 59 * i),
                s.closePath(),
                s.moveTo(57 * i, 96 * i),
                s.lineTo(57 * i, 101.5 * i),
                s.lineTo(60 * i, 101.5 * i),
                s.lineTo(60 * i, 96 * i),
                s.lineTo(57 * i, 96 * i),
                s.closePath(),
                s.moveTo(57 * i, 12 * i),
                s.lineTo(57 * i, 17.5 * i),
                s.lineTo(60 * i, 17.5 * i),
                s.lineTo(60 * i, 12 * i),
                s.lineTo(57 * i, 12 * i),
                s.closePath(),
                s.fill(),
                s.stroke()
            }
        }
    },
    19: function(t, e) {
        var Powerup = t(12)
          , a = {
                canvas: document.createElement("canvas"),
                width: 35,
                height: 35
            }
          , h = {
                canvas: document.createElement("canvas"),
                width: 35,
                height: 35
            };
        e.exports = class Target extends Powerup {
            constructor(a, b, c) {
                super();
                this.x = a,
                this.y = b,
                this.hit = !1,
                this.id = random().toString(36).substr(2),
                this.init(c)
            }
            x = 0;
            y = 0;
            dirty = !0;
            name = "goal";
            hit = !1;
            superErase = this.erase;
            getCode() {
                return "T " + this.x.toString(32) + " " + this.y.toString(32)
            }
            recache(t) {
                this.dirty = !1,
                this.cacheStar(t),
                this.cacheEmptyStar(t)
            }
            cacheStar(t) {
                var e = a.canvas;
                e.width = a.width * t,
                e.height = a.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , n = e.height / 2;
                this.drawStar(s, n, 5, 10, 5, !0, t, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, e.width, e.height),
                i.strokeStyle = "red",
                i.strokeWidth = 1 * t,
                i.stroke())
            }
            cacheEmptyStar(t) {
                var e = h.canvas;
                e.width = h.width * t,
                e.height = h.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , n = e.height / 2;
                this.drawStar(s, n, 5, 10, 5, !1, t, i),
                this.settings.developerMode && (i.beginPath(),
                i.rect(0, 0, e.width, e.height),
                i.strokeStyle = "red",
                i.strokeWidth = 1 * t,
                i.stroke())
            }
            setDirty(t) {
                this.dirty = t
            }
            draw(t, e, i, s) {
                if (this.hit) {
                    var n = h.width * i
                    , r = h.height * i
                    , o = n / 2
                    , c = r / 2;
                    s.drawImage(h.canvas, t - o, e - c, n, r)
                } else {
                    this.dirty && this.recache(i);
                    var n = a.width * i
                    , r = a.height * i
                    , o = n / 2
                    , c = r / 2;
                    s.drawImage(a.canvas, t - o, e - c, n, r)
                }
            }
            drawStar(t, e, i, s, n, r, o, a) {
                var h = PI / 2 * 3
                , l = t
                , c = e
                , u = PI / i;
                s *= o,
                n *= o,
                a.strokeSyle = "#000",
                a.beginPath(),
                a.moveTo(t, e - s);
                for (var p = 0; i > p; p++)
                    l = t + cos(h) * s,
                    c = e + sin(h) * s,
                    a.lineTo(l, c),
                    h += u,
                    l = t + cos(h) * n,
                    c = e + sin(h) * n,
                    a.lineTo(l, c),
                    h += u;
                a.lineTo(t, e - s),
                a.closePath(),
                a.lineWidth = max(2 * o, 1),
                a.strokeStyle = "black",
                a.stroke(),
                a.fillStyle = r ? "#FAE335" : "#FFFFFF",
                a.fill()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , o = t.pos.y - this.y
                , a = sqrt(pow(s, 2) + pow(o, 2))
                , h = i._powerupsConsumed.targets
                , l = this.scene;
                if (26 > a && i.isAlive() && -1 === h.indexOf(this.id)) {
                    h.push(this.id);
                    var c = h.length
                    , u = l.track.targetCount;
                    i.isGhost() === !1 && (this.hit = !0,
                    this.sector.powerupCanvasDrawn = !1,
                    l.sound.play("goal_sound"),
                    l.message.show(c + " of " + u + " Stars", 50, "#FAE335", "#666666")),
                    c >= u && (i.complete = !0)
                }
            }
        }
    },
    20: function(t, e) {
        var Powerup = t(12)
          , a = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 29,
                height: 32
            };
        e.exports = class Teleporter extends Powerup {
            constructor(a, b, c) {
                super();
                this.x = a,
                this.y = b,
                this.id = random().toString(36).substr(2),
                this.init(c)
            }
            id = null;
            otherPortal = null;
            hit = !1;
            x = 0;
            y = 0;
            name = "teleport";
            recorded = !1;
            erase(t, e) {
                var i = !1;
                if (!this.remove) {
                    var s = sqrt(pow(t.x - this.x, 2) + pow(t.y - this.y, 2));
                    e >= s && (i = [this, this.otherPortal],
                    this.removeAllReferences(),
                    this.otherPortal.removeAllReferences())
                }
                return i
            }
            addOtherPortalRef(t) {
                this.otherPortal = t
            }
            getCode() {
                var t = "";
                return this.recorded === !1 && this.otherPortal.recorded === !0 ? this.recorded = !0 : this.recorded === !1 && this.otherPortal.recorded === !1 ? (this.recorded = !0,
                t = "W " + this.x.toString(32) + " " + this.y.toString(32) + " " + this.otherPortal.x.toString(32) + " " + this.otherPortal.y.toString(32)) : this.recorded === !0 && this.otherPortal.recorded === !0 && (this.otherPortal.recorded = !1,
                t = "W " + this.x.toString(32) + " " + this.y.toString(32) + " " + this.otherPortal.x.toString(32) + " " + this.otherPortal.y.toString(32)),
                t
            }
            setDirty(t) {
                a.dirty = t
            }
            recache(t) {
                a.dirty = !1,
                this.drawPowerup(t, a)
            }
            drawPowerup(t, e) {
                var i = e.canvas;
                i.width = e.width * t,
                i.height = e.height * t;
                var s = i.getContext("2d")
                , n = (s.width / 2,
                s.height / 2,
                .65 * t);
                s.save(),
                s.scale(n, n),
                s.save(),
                s.beginPath(),
                s.moveTo(0, 0),
                s.lineTo(44, 0),
                s.lineTo(44, 48),
                s.lineTo(0, 48),
                s.closePath(),
                s.clip(),
                s.translate(0, 0),
                s.translate(0, 0),
                s.scale(1, 1),
                s.translate(0, 0),
                s.strokeStyle = "rgba(0,0,0,0)",
                s.lineCap = "butt",
                s.lineJoin = "miter",
                s.miterLimit = 4,
                s.save(),
                s.restore(),
                s.save(),
                s.restore(),
                s.save(),
                s.fillStyle = "rgba(0, 0, 0, 0)",
                s.strokeStyle = "rgba(0, 0, 0, 0)",
                s.lineWidth = 1,
                s.translate(-788, -50),
                s.save(),
                s.translate(790, 52),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(17, 3),
                s.bezierCurveTo(16.9424049, 2.83458834, 16.4420628, 2.62968665, 15.9196825, 2.4515011),
                s.lineTo(8.51063934, -.0757469011),
                s.lineTo(16.223952, -1.41205186),
                s.bezierCurveTo(21.2423806, -2.2814774, 25.8773816, -1.40451316, 29.9447883, .583562762),
                s.bezierCurveTo(31.7394578, 1.46076529, 33.0361403, 2.35169307, 33.7316821, 2.95217334),
                s.bezierCurveTo(35.1972328, 4.14751314, 36.509471, 5.52829294, 37.6336956, 7.05811132),
                s.bezierCurveTo(39.8993675, 10.1439271, 41.2801108, 13.6041318, 41.7252304, 17.3208639),
                s.bezierCurveTo(41.7397043, 17.4414782, 41.7543021, 17.5670407, 41.7704814, 17.7094344),
                s.bezierCurveTo(41.7921038, 17.9009058, 41.7921038, 17.9009058, 41.8132645, 18.0904969),
                s.lineTo(41.840873, 18.3390683),
                s.lineTo(41.8856209, 18.735971),
                s.lineTo(41.8856209, 21.4226506),
                s.lineTo(41.8542399, 21.5977061),
                s.bezierCurveTo(41.8009577, 21.89487, 41.7866262, 21.9747988, 41.7740749, 22.044061),
                s.bezierCurveTo(41.759051, 22.1809078, 41.759051, 22.1809078, 41.7559584, 22.2091488),
                s.bezierCurveTo(41.6872107, 22.8267498, 41.6438556, 23.1562694, 41.5609313, 23.6049736),
                s.bezierCurveTo(40.8769441, 27.3127264, 39.3221077, 30.5993535, 36.9456235, 33.3462518),
                s.bezierCurveTo(32.8945821, 38.029004, 27.65733, 40.5391341, 21.868366, 40.5391341),
                s.bezierCurveTo(21.742671, 40.5391341, 21.6184358, 40.538205, 21.4955986, 40.5363608),
                s.bezierCurveTo(22.1492681, 41.0434881, 22.8806236, 41.5794806, 23.6943816, 42.1440112),
                s.lineTo(28.4276887, 45.4276613),
                s.lineTo(22.6779106, 45.7834802),
                s.bezierCurveTo(18.1741264, 46.062192, 14.0554746, 45.155711, 10.4302114, 43.4736066),
                s.bezierCurveTo(8.54152696, 42.5972663, 7.17424655, 41.7066293, 6.38621142, 41.0629331),
                s.bezierCurveTo(4.99599225, 40.025971, 3.38305673, 38.3146562, 2.25448469, 36.778713),
                s.bezierCurveTo(-.0125398982, 33.6943248, -1.39399999, 30.2338948, -1.84021156, 26.5118367),
                s.bezierCurveTo(-1.86468983, 26.3063181, -1.88762639, 26.1042985, -1.92006182, 25.811651),
                s.lineTo(-1.95463612, 25.5020237),
                s.lineTo(-2.00013072, 25.1020716),
                s.lineTo(-2.00013072, 22.4141906),
                s.lineTo(-1.96885958, 22.2394346),
                s.bezierCurveTo(-1.92214724, 21.9784071, -1.90657901, 21.8914122, -1.89618079, 21.8334198),
                s.bezierCurveTo(-1.83478692, 21.2274076, -1.79887919, 20.9331002, -1.72945035, 20.5323584),
                s.bezierCurveTo(-.927733904, 15.885014, 1.1979378, 11.9079902, 4.5664052, 8.76464131),
                s.bezierCurveTo(8.29993169, 5.27968493, 12.7861394, 3.24768826, 17.4210789, 3.06365477),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#dd45ec",
                s.beginPath(),
                s.moveTo(23.9052288, 5.91261647),
                s.bezierCurveTo(23.9052288, 5.91261647, 22.5543791, 5.13614588, 18.1099346, 5.04995765),
                s.bezierCurveTo(13.6479739, 5.05021647, 9.39411765, 6.99424, 5.93111111, 10.2266871),
                s.bezierCurveTo(2.88431373, 13.0698635, .969542484, 16.6517224, .241437908, 20.8723576),
                s.bezierCurveTo(.169019608, 21.2903576, .131372549, 21.6617694, .101045752, 21.9601929),
                s.bezierCurveTo(.0960784314, 22.0104047, .0911111111, 22.0611341, .0858823529, 22.1113459),
                s.bezierCurveTo(.0837908497, 22.1227341, .0816993464, 22.1341224, .0796078431, 22.1452518),
                s.lineTo(-.000130718954, 22.5917224),
                s.lineTo(-.000130718954, 23.0451812),
                s.lineTo(-.000130718954, 24.6993224),
                s.lineTo(-.000130718954, 24.9886871),
                s.lineTo(.0325490196, 25.2759812),
                s.lineTo(.0675816993, 25.5896753),
                s.bezierCurveTo(.0929411765, 25.8184753, .118562092, 26.0470165, .145751634, 26.2752988),
                s.bezierCurveTo(.550457516, 29.6511341, 1.80196078, 32.7860047, 3.86601307, 35.59424),
                s.bezierCurveTo(4.76326797, 36.8153694, 6.27176471, 38.4928047, 7.6179085, 39.4864282),
                s.bezierCurveTo(7.6179085, 39.4864282, 13.4911111, 44.3481694, 22.5543791, 43.7872988),
                s.bezierCurveTo(16.5849673, 39.6461224, 15.7624837, 37.5460282, 15.7624837, 37.5460282),
                s.bezierCurveTo(16.4521569, 37.6208282, 18.1535948, 38.5391341, 21.868366, 38.5391341),
                s.bezierCurveTo(27.0628758, 38.5391341, 31.7535948, 36.2909929, 35.4330719, 32.0377459),
                s.bezierCurveTo(37.5739869, 29.5631341, 38.9739869, 26.6037459, 39.5941176, 23.2421459),
                s.bezierCurveTo(39.6816993, 22.76824, 39.7295425, 22.3354871, 39.7682353, 21.9878871),
                s.bezierCurveTo(39.7768627, 21.9092047, 39.7852288, 21.8300047, 39.7946405, 21.7510635),
                s.bezierCurveTo(39.7983007, 21.7319106, 39.8019608, 21.7124988, 39.8053595, 21.6930871),
                s.lineTo(39.8856209, 21.2448047),
                s.lineTo(39.8856209, 20.7895341),
                s.lineTo(39.8856209, 19.1356518),
                s.lineTo(39.8856209, 18.8483576),
                s.lineTo(39.8534641, 18.5631341),
                s.lineTo(39.8254902, 18.3112988),
                s.bezierCurveTo(39.7975163, 18.0607576, 39.7695425, 17.8096988, 39.7394771, 17.5591576),
                s.bezierCurveTo(39.3355556, 14.1864282, 38.0845752, 11.0515576, 36.0215686, 8.24176941),
                s.bezierCurveTo(34.9975163, 6.84826353, 33.8019608, 5.59038118, 32.4675817, 4.50202824),
                s.bezierCurveTo(32.4675817, 4.50202824, 25.996732, -1.07536, 16.5653595, .558592941),
                s.bezierCurveTo(21.6393464, 2.28934588, 23.9052288, 5.91261647, 23.9052288, 5.91261647),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#fefefe",
                s.beginPath(),
                s.moveTo(5.22875817, 24.6992965),
                s.lineTo(5.22875817, 23.0451553),
                s.bezierCurveTo(5.24078431, 22.97812, 5.25647059, 22.9113435, 5.26457516, 22.8437906),
                s.bezierCurveTo(5.30823529, 22.4770376, 5.33254902, 22.1071788, 5.39555556, 21.7440494),
                s.bezierCurveTo(5.9179085, 18.7173671, 7.26117647, 16.0988494, 9.5179085, 13.9930612),
                s.bezierCurveTo(12.7882353, 10.9404965, 16.6520261, 9.83428471, 21.0614379, 10.8020259),
                s.bezierCurveTo(23.1579085, 11.2619553, 24.9563399, 12.2887082, 26.3997386, 13.8804729),
                s.bezierCurveTo(27.8005229, 15.4251318, 28.5681046, 17.2482847, 28.8130719, 19.3033435),
                s.bezierCurveTo(29.0044444, 20.9103788, 28.7861438, 22.4467553, 28.0836601, 23.9122141),
                s.bezierCurveTo(26.5186928, 27.1764965, 23.3458824, 28.74652, 19.8862745, 27.9666847),
                s.bezierCurveTo(17.6018301, 27.4518847, 16.0658824, 25.7762612, 15.7793464, 23.4833435),
                s.bezierCurveTo(15.7513725, 23.2566141, 15.7422222, 23.0278141, 15.7233987, 22.7920259),
                s.bezierCurveTo(15.6826144, 22.7959082, 15.6577778, 22.7959082, 15.6345098, 22.8013435),
                s.bezierCurveTo(15.2580392, 22.8929671, 15.0844444, 23.1867318, 14.9532026, 23.5037906),
                s.bezierCurveTo(14.6407843, 24.2592965, 14.6128105, 25.0383553, 14.8180392, 25.8238847),
                s.bezierCurveTo(15.1252288, 26.9999788, 15.8075817, 27.9480494, 16.7301961, 28.7162376),
                s.bezierCurveTo(19.105098, 30.6939082, 21.8201307, 31.2356259, 24.7777778, 30.3869435),
                s.bezierCurveTo(27.9027451, 29.4903788, 30.1628758, 27.5002847, 31.6556863, 24.6703082),
                s.bezierCurveTo(33.1751634, 21.7893435, 33.4169935, 18.73652, 32.7003922, 15.5969906),
                s.bezierCurveTo(32.1134641, 13.0263553, 30.9056209, 10.7471553, 29.2807843, 8.67397882),
                s.bezierCurveTo(29.2345098, 8.61496706, 29.1887582, 8.55595529, 29.1427451, 8.49694353),
                s.bezierCurveTo(30.1487582, 9.31767294, 31.0295425, 10.2476259, 31.7918954, 11.2855082),
                s.bezierCurveTo(33.305098, 13.3460024, 34.2433987, 15.6329671, 34.5471895, 18.1681435),
                s.bezierCurveTo(34.5856209, 18.4903788, 34.6206536, 18.8131318, 34.6569935, 19.1356259),
                s.lineTo(34.6569935, 20.7897671),
                s.bezierCurveTo(34.6449673, 20.8565435, 34.629281, 20.92332, 34.620915, 20.9908729),
                s.bezierCurveTo(34.5644444, 21.4313906, 34.5309804, 21.8763082, 34.4501961, 22.3121671),
                s.bezierCurveTo(34.0122876, 24.6873906, 33.0475817, 26.8374376, 31.4616993, 28.6706847),
                s.bezierCurveTo(28.1134641, 32.5408729, 23.9121569, 34.11012, 18.8256209, 33.0287553),
                s.bezierCurveTo(16.5994771, 32.5553671, 14.72, 31.4287082, 13.2504575, 29.68372),
                s.bezierCurveTo(11.9879739, 28.1846141, 11.2983007, 26.4463553, 11.0705882, 24.5126847),
                s.bezierCurveTo(10.871634, 22.8236024, 11.1286275, 21.2212259, 11.9113725, 19.7042612),
                s.bezierCurveTo(13.5228758, 16.5810376, 16.6386928, 15.0982376, 19.9803922, 15.8646141),
                s.bezierCurveTo(22.303268, 16.3975318, 23.7997386, 18.0288965, 24.1079739, 20.3696965),
                s.bezierCurveTo(24.136732, 20.5899553, 24.1440523, 20.8128024, 24.1662745, 21.1008729),
                s.bezierCurveTo(24.343268, 20.9921671, 24.5147712, 20.9334141, 24.6146405, 20.8153906),
                s.bezierCurveTo(24.7620915, 20.6414612, 24.8909804, 20.4375082, 24.970719, 20.2255318),
                s.bezierCurveTo(25.28, 19.4032494, 25.2648366, 18.5688024, 24.9890196, 17.7405671),
                s.bezierCurveTo(24.5738562, 16.4935553, 23.7654902, 15.5263318, 22.715817, 14.7615082),
                s.bezierCurveTo(20.315817, 13.0147082, 17.6664052, 12.6334612, 14.8541176, 13.5207082),
                s.bezierCurveTo(11.8538562, 14.4672259, 9.67267974, 16.4187553, 8.23006536, 19.1622847),
                s.bezierCurveTo(6.68470588, 22.1014847, 6.45960784, 25.2078847, 7.22352941, 28.3996965),
                s.bezierCurveTo(7.82248366, 30.8996729, 9.0096732, 33.1206376, 10.5921569, 35.1438612),
                s.bezierCurveTo(10.6420915, 35.2083082, 10.692549, 35.2724965, 10.743268, 35.3364259),
                s.bezierCurveTo(9.97568627, 34.7698612, 8.83764706, 33.5606376, 8.09385621, 32.5486376),
                s.bezierCurveTo(6.57986928, 30.4886612, 5.6420915, 28.2016965, 5.33830065, 25.66652),
                s.bezierCurveTo(5.29960784, 25.3442847, 5.26535948, 25.0215318, 5.22875817, 24.6992965),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore()
            }
            draw(t, e, i, s) {
                a.dirty && this.recache(i);
                {
                    var n = a.width * i
                    , r = a.height * i
                    , o = n / 2
                    , h = r / 2
                    , l = t
                    , c = e;
                    (this.angle - 90) * (PI / 180)
                }
                s.globalAlpha = this.hit === !1 ? 1 : .2,
                s.translate(l, c),
                s.drawImage(a.canvas, -o, -h, n, r),
                s.translate(-l, -c)
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = i._powerupsConsumed.misc;
                if (-1 === s.indexOf(this.id)) {
                    {
                        var n = t.pos.x - this.x
                        , o = t.pos.y - this.y
                        , a = pow(n, 2) + pow(o, 2)
                        , h = e.masses;
                        h.length
                    }
                    1e3 > a && i.isAlive() && (s.push(this.id),
                    s.push(this.otherPortal.id),
                    e.moveVehicle(this.otherPortal.x - this.x, this.otherPortal.y - this.y),
                    i.isGhost() === !1 && (this.hit = !0,
                    this.otherPortal.hit = !0,
                    this.sector.powerupCanvasDrawn = !1,
                    this.otherPortal.sector.powerupCanvasDrawn = !1,
                    this.scene.sound.play("teleport_sound", .3),
                    this.scene.message.show("Teleport Engaged", 50, "#8ac832")))
                }
            }
        }
    },
    21: function(t, e) {
        var Vector = t(8);
        e.exports = class SceneryLine {
            constructor(a, b, c, d){
                this.p1 = new Vector(a, b),
                this.p2 = new Vector(c, d),
                this.pp = this.p2.sub(this.p1),
                this.len = this.pp.len(),
                this.sectors = []
            }
            sectors = null;
            p1 = null;
            p2 = null;
            pp = null;
            len = 0;
            collided = !1;
            remove = !1;
            recorded = !1;
            getCode(t) {
                this.recorded = !0;
                var e = this.p2
                  , i = " " + e.x.toString(32) + " " + e.y.toString(32)
                  , s = this.checkForConnectedLine(t, e);
                return s && (i += s.getCode(t)),
                i
            }
            checkForConnectedLine(t, e) {
                var i = t.settings.drawSectorSize
                  , s = t.sectors.drawSectors
                  , n = floor(e.x / i)
                  , o = floor(e.y / i);
                return s[n][o].searchForLine("sceneryLines", e)
            }
            erase(t, e) {
                var i = !1;
                if (!this.remove) {
                    var s = this.p1
                      , r = this.p2
                      , o = t
                      , a = e
                      , h = r.sub(s)
                      , l = s.sub(o)
                      , c = h.dot(h)
                      , u = 2 * l.dot(h)
                      , p = l.dot(l) - a * a
                      , d = u * u - 4 * c * p;
                    if (d > 0) {
                        d = sqrt(d);
                        var f = (-u - d) / (2 * c)
                          , v = (-u + d) / (2 * c);
                        f >= 0 && 1 >= f && (i = !0,
                        this.removeAllReferences()),
                        v >= 0 && 1 >= v && (i = !0,
                        this.removeAllReferences())
                    }
                    this.intersects(this.p1.x, this.p1.y, t.x, t.y, e) ? (i = !0,
                    this.removeAllReferences()) : this.intersects(this.p2.x, this.p2.y, t.x, t.y, e) && (i = !0,
                    this.removeAllReferences())
                }
                return i
            }
            intersects(t, e, i, s, n) {
                var r = t - i
                  , o = e - s;
                return n * n >= r * r + o * o
            }
            addSectorReference(t) {
                this.sectors.push(t)
            }
            removeAllReferences() {
                this.remove = !0;
                for (var t = this.sectors, e = t.length, i = 0; e > i; i++)
                    t[i].drawn = !1,
                    t[i].dirty = !0;
                this.sectors = []
            }
        }
    },
    22: function(t, e) {
        var PhysicsLine = t(11)
          , SceneryLine = t(21);
        e.exports = class Sector {
            constructor(a, b, c) {
                this.track = c,
                this.scene = c.scene,
                this.settings = c.settings,
                this.drawSectorSize = this.settings.drawSectorSize,
                this.row = b,
                this.column = a,
                this.camera = c.camera,
                this.zoom = c.camera.zoom,
                this.canvasPool = c.canvasPool,
                this.x = a * this.drawSectorSize,
                this.y = b * this.drawSectorSize,
                this.realX = this.x * this.zoom,
                this.realY = this.y * this.zoom,
                this.lineCount = 0,
                this.powerupsCount = 0,
                this.drawn = !1,
                this.dirty = !1,
                this.physicsLines = [],
                this.sceneryLines = [],
                this.hasPowerups = !1,
                this.powerups = {
                    all: [],
                    goals: [],
                    gravitys: [],
                    boosts: [],
                    slowmos: [],
                    checkpoints: [],
                    bombs: [],
                    antigravitys: [],
                    teleports: [],
                    helicopters: [],
                    trucks: [],
                    balloons: [],
                    blobs: []
                }
            }
            image = !1;
            scene = null;
            settings = null;
            drawSectorSize = null;
            row = 0;
            column = 0;
            camera = null;
            zoom = 0;
            x = 0;
            y = 0;
            realX = 0;
            realY = 0;
            lineCount = 0;
            powerupsCount = 0;
            drawn = !1;
            physicsLines = [];
            sceneryLines = [];
            powerups = [];
            canvasPool = null;
            canvas = null;
            powerupCanvas = null;
            powerupCanvasOffset = 30;
            powerupCanvasDrawn = !1;
            dirty = !1;
            addLine(t) {
                t instanceof PhysicsLine && this.physicsLines.push(t),
                t instanceof SceneryLine && this.sceneryLines.push(t),
                this.lineCount++,
                this.drawn = !1
            }
            searchForLine(t, e) {
                var i = this[t]
                  , s = !1;
                for (var n in i) {
                    var r = i[n];
                    r.p1.x === e.x && r.p1.y === e.y && r.recorded === !1 && r.remove === !1 && (s = r)
                }
                return s
            }
            addPowerup(t) {
                var e = this.powerups
                  , i = null;
                switch (t.name) {
                case "goal":
                    i = e.goals;
                    break;
                case "gravity":
                    i = e.gravitys;
                    break;
                case "slowmo":
                    i = e.slowmos;
                    break;
                case "boost":
                    i = e.boosts;
                    break;
                case "checkpoint":
                    i = e.checkpoints;
                    break;
                case "bomb":
                    i = e.bombs;
                    break;
                case "antigravity":
                    i = e.antigravitys;
                    break;
                case "teleport":
                    i = e.teleports;
                    break;
                case "helicopter":
                    i = e.helicopters;
                    break;
                case "truck":
                    i = e.trucks;
                    break;
                case "balloon":
                    i = e.balloons;
                    break;
                case "blob":
                    i = e.blobs
                }
                e.all.push(t),
                i.push(t),
                this.powerupsCount++,
                this.hasPowerups = !0,
                this.powerupCanvasDrawn = !1
            }
            erase(t, e, i) {
                var s = [];
                if (i.physics === !0)
                    for (var n = this.physicsLines, r = n.length, o = r - 1; o >= 0; o--) {
                        var a = n[o];
                        a.erase(t, e) && s.push(a)
                    }
                if (i.scenery === !0)
                    for (var h = this.sceneryLines, l = h.length, c = l - 1; c >= 0; c--) {
                        var u = h[c];
                        u.erase(t, e) && s.push(u)
                    }
                if (i.powerups === !0)
                    for (var p = this.powerups.all, d = p.length, f = d - 1; f >= 0; f--) {
                        var v = p[f]
                          , g = v.erase(t, e);
                        g !== !1 && s.push.apply(s, g)
                    }
                return s
            }
            cleanSector() {
                this.cleanSectorType("physicsLines"),
                this.cleanSectorType("sceneryLines"),
                this.cleanSectorType("powerups", "all"),
                0 === this.powerups.all.length ? (this.hasPowerups = !1,
                this.powerupCanvas && (this.canvasPool.releaseCanvas(this.powerupCanvas),
                this.powerupCanvas = null)) : this.hasPowerups = !0,
                this.dirty = !1
            }
            cleanSectorType(t, e) {
                var i = this[t];
                e && (i = i[e]);
                for (var s = i.length, n = s - 1; n >= 0; n--) {
                    var r = i[n];
                    r.remove && i.splice(n, 1)
                }
            }
            draw() {
                var t = this.scene.camera
                  , e = t.zoom
                  , i = this.physicsLines
                  , s = this.sceneryLines
                  , n = this.drawSectorSize * e | 0
                  , r = this.canvasPool.getCanvas();
                r.width = n,
                r.height = n;
                var o = r.getContext("2d");
                o.clearRect(0, 0, r.width, r.height);
                var a = 2 * e > .5 ? 2 * e : .5
                  , h = this.settings.sceneryLineColor
                  , l = this.settings.physicsLineColor;
                o.save(),
                o.beginPath(),
                o.lineWidth = a,
                o.lineCap = "round",
                o.strokeStyle = window.lite.getVar("dark") ? "#707070" : h,
                this.drawLines(s, e, o),
                o.stroke(),
                o.beginPath(),
                o.lineWidth = a,
                o.lineCap = "round",
                o.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : l,
                this.drawLines(i, e, o),
                o.stroke(),
                this.settings.developerMode && (o.beginPath(),
                o.strokeStyle = "blue",
                o.rect(0, 0, n, n),
                o.stroke()),
                this.canvas = r,
                this.drawn = !0
            }
            drawLine(t, e) {
                var i, s, n, r, o, a, h = this.canvas, l = this.scene.camera, c = l.zoom, u = 2 * c > .5 ? 2 * c : .5, p = !1, d = this.x, f = this.y;
                if (!h) {
                    var v = this.drawSectorSize * c | 0;
                    h = this.canvasPool.getCanvas(),
                    h.width = v,
                    h.height = v,
                    p = h.getContext("2d")
                }
                p || (p = h.getContext("2d")),
                o = t.p1,
                a = t.p2,
                i = (o.x - d) * c,
                s = (o.y - f) * c,
                n = (a.x - d) * c,
                r = (a.y - f) * c,
                p.save(),
                p.beginPath(),
                p.lineWidth = u,
                p.lineCap = "round",
                p.strokeStyle = e,
                p.moveTo(i, s),
                p.lineTo(n, r),
                p.stroke()
            }
            cachePowerupSector() {
                this.powerupCanvasDrawn = !0;
                var t = this.powerups.all;
                if (t.length > 0) {
                    var e = this.scene.camera
                      , i = e.zoom
                      , s = this.drawSectorSize * i | 0
                      , n = this.powerupCanvasOffset
                      , r = this.canvasPool.getCanvas();
                    r.width = s + n * i,
                    r.height = s + n * i;
                    var o = r.getContext("2d");
                    o.clearRect(0, 0, r.width, r.height),
                    this.drawPowerups(this.powerups.slowmos, i, o),
                    this.drawPowerups(this.powerups.checkpoints, i, o),
                    this.drawPowerups(this.powerups.boosts, i, o),
                    this.drawPowerups(this.powerups.gravitys, i, o),
                    this.drawPowerups(this.powerups.bombs, i, o),
                    this.drawPowerups(this.powerups.goals, i, o),
                    this.drawPowerups(this.powerups.antigravitys, i, o),
                    this.drawPowerups(this.powerups.teleports, i, o),
                    this.drawPowerups(this.powerups.helicopters, i, o),
                    this.drawPowerups(this.powerups.trucks, i, o),
                    this.drawPowerups(this.powerups.balloons, i, o),
                    this.drawPowerups(this.powerups.blobs, i, o),
                    this.powerupCanvas = r,
                    this.settings.developerMode && (o.beginPath(),
                    o.strokeStyle = "red",
                    o.rect(0, 0, r.width, r.height),
                    o.stroke())
                }
            }
            update = () => {
                var t = this.camera.zoom;
                this.realX = this.x * t | 0,
                this.realY = this.y * t | 0,
                this.zoom = t
            }
            resetCollided() {
                for (var t = this.physicsLines, e = t.length, i = e - 1; i >= 0; i--)
                    t[i] && (t[i].collided = !1)
            }
            collide(t) {
                for (var e = t.parent, i = this.physicsLines, s = i.length, n = s - 1; n >= 0; n--)
                    if (i[n]) {
                        var r = i[n];
                        r.remove ? i.splice(n, 1) : r.collide(t)
                    }
                if (e.powerupsEnabled)
                    for (var o = this.powerups.all, a = o.length, h = a - 1; h >= 0; h--) {
                        var l = o[h];
                        l.remove ? o.splice(h, 1) : o[h].collide(t)
                    }
            }
            drawLines(t, e, i) {
                for (var s, n, r, o, a, h, l, c = this.x, u = this.y, p = t.length, d = p - 1; d >= 0; d--) {
                    var a = t[d];
                    a.remove ? t.splice(d, 1) : (h = a.p1,
                    l = a.p2,
                    s = (h.x - c) * e,
                    n = (h.y - u) * e,
                    r = (l.x - c) * e,
                    o = (l.y - u) * e,
                    i.moveTo(s, n),
                    i.lineTo(r, o))
                }
            }
            drawPowerups(t, e, i) {
                for (var t = t, s = t.length, n = this.x, r = this.y, o = this.powerupCanvasOffset * e / 2, a = s - 1; a >= 0; a--) {
                    var h = t[a];
                    if (h.remove)
                        t.splice(a, 1);
                    else {
                        var l = (h.x - n) * e + o
                          , c = (h.y - r) * e + o;
                        h.draw(l, c, e, i)
                    }
                }
            }
            drawBackground(t, e, i) {
                var s = this.drawSectorSize * e | 0;
                t.beginPath(),
                t.rect(0, 0, s, s),
                t.fillStyle = i,
                t.fill()
            }
            clear() {
                this.drawn = !1,
                this.powerupCanvasDrawn = !1,
                this.canvas && (this.canvas = null,
                this.canvasPool.releaseCanvas(this.canvas)),
                this.powerupCanvas && (this.canvasPool.releaseCanvas(this.powerupCanvas),
                this.powerupCanvas = null)
            }
            close() {
                this.track = null,
                this.scene = null,
                this.settings = null,
                this.drawSectorSize = null,
                this.row = null,
                this.column = null,
                this.camera = null,
                this.zoom = null,
                this.canvasPool = null,
                this.x = null,
                this.y = null,
                this.realX = null,
                this.realY = null,
                this.lineCount = null,
                this.drawn = null,
                this.physicsLines = null,
                this.sceneryLines = null,
                this.canvas = null
            }
        }
    },
    30: function(t, e) {
        var Powerup = t(12)
          , n = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 22,
                height: 32
            };
        e.exports = class BalloonPowerup extends Powerup {
            constructor(a, b, c, d) {
                super();
                this.x = a,
                this.y = b,
                this.time = c,
                this.id = random().toString(36).substr(2),
                this.hit = !1,
                this.init(d)
            }
            x = 0;
            y = 0;
            name = "balloon";
            getCode() {
                return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 3 " + this.time.toString(32)
            }
            recache(t) {
                n.dirty = !1;
                var e = n.canvas;
                e.width = n.width * t,
                e.height = n.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , r = e.height / 2;
                this.drawIcon(s, r, t, i)
            }
            setDirty(t) {
                n.dirty = t
            }
            draw(t, e, i, s) {
                if (!this.hit) {
                    n.dirty && this.recache(i);
                    var r = n.width * i
                    , o = n.height * i
                    , a = r / 2
                    , h = o / 2;
                    s.drawImage(n.canvas, t - a, e - h, r, o)
                }
            }
            drawIcon(t, e, i, s) {
                s.save(),
                s.scale(i, i),
                s.beginPath(),
                s.moveTo(0, 0),
                s.lineTo(21, 0),
                s.lineTo(21, 31),
                s.lineTo(0, 31),
                s.closePath(),
                s.clip(),
                s.translate(0, 0),
                s.translate(0, 0),
                s.scale(1, 1),
                s.translate(0, 0),
                s.strokeStyle = "rgba(0,0,0,0)",
                s.lineCap = "butt",
                s.lineJoin = "miter",
                s.miterLimit = 4,
                s.save(),
                s.restore(),
                s.save(),
                s.restore(),
                s.save(),
                s.fillStyle = "rgba(0, 0, 0, 0)",
                s.strokeStyle = "rgba(0, 0, 0, 0)",
                s.lineWidth = 1,
                s.translate(-1322, -440),
                s.save(),
                s.translate(251, 28),
                s.save(),
                s.translate(1056, 265),
                s.save(),
                s.translate(3, 141),
                s.save(),
                s.translate(12, 6),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(7, 23),
                s.lineTo(14, 23),
                s.quadraticCurveTo(15, 23, 15, 24),
                s.lineTo(15, 30),
                s.quadraticCurveTo(15, 31, 14, 31),
                s.lineTo(7, 31),
                s.quadraticCurveTo(6, 31, 6, 30),
                s.lineTo(6, 24),
                s.quadraticCurveTo(6, 23, 7, 23),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.strokeStyle = "#000000",
                s.lineWidth = 2,
                s.lineCap = "round",
                s.beginPath(),
                s.moveTo(15, 19),
                s.lineTo(12.9375, 24.6875),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.strokeStyle = "#000000",
                s.lineWidth = 2,
                s.lineCap = "round",
                s.translate(7.03125, 21.84375),
                s.scale(-1, 1),
                s.translate(-7.03125, -21.84375),
                s.beginPath(),
                s.moveTo(8.0625, 19),
                s.lineTo(6, 24.6875),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.save(),
                s.fillStyle = "#f02728",
                s.save(),
                s.beginPath(),
                s.arc(10.5, 11.125, 10.5, 0, 6.283185307179586, !0),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.save(),
                s.strokeStyle = "#000000",
                s.lineWidth = 2,
                s.beginPath(),
                s.arc(10.5, 11.125, 9.5, 0, 6.283185307179586, !0),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , n = t.pos.y - this.y
                , r = sqrt(pow(s, 2) + pow(n, 2))
                , h = i._powerupsConsumed.misc
                , l = this.scene;
                if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
                    h.push(this.id);
                    var c = this.time * l.settings.drawFPS;
                    i.setTempVehicle("BALLOON", c, {
                        x: this.x,
                        y: this.y
                    }, e.dir),
                    l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
                    l.vehicleTimer.playerAddedTime(i)),
                    i.isGhost() === !1 && (this.hit = !0,
                    this.sector.powerupCanvasDrawn = !1,
                    this.scene.message.show("Balloon Powerup!", 50, "#f02728", !1))
                }
            }
        }
    },
    31: function(t, e) {
        var Powerup = t(12)
          , n = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 32,
                height: 42
            };
        e.exports = class BlobPowerup extends Powerup {
            constructor(a, b, c, d) {
                super();
                this.x = a,
                this.y = b,
                this.time = c,
                this.id = random().toString(36).substr(2),
                this.hit = !1,
                this.init(d)
            }
            x = 0;
            y = 0;
            name = "blob";
            getCode() {
                return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 4 " + this.time.toString(32)
            }
            recache(t) {
                n.dirty = !1;
                var e = n.canvas;
                e.width = n.width * t,
                e.height = n.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , r = e.height / 2;
                this.drawIcon(s, r, t, i)
            }
            setDirty(t) {
                n.dirty = t
            }
            draw(t, e, i, s) {
                if (!this.hit) {
                    n.dirty && this.recache(i);
                    var r = n.width * i
                    , o = n.height * i
                    , a = r / 2
                    , h = o / 2;
                    s.drawImage(n.canvas, t - a, e - h, r, o)
                }
            }
            drawIcon(t, e, i, s) {
                s.lineJoin = "miter",
                s.scale(i, i),
                s.fillStyle = "#a784c5",
                s.beginPath(),
                s.moveTo(0, 0),
                s.lineTo(24, 0),
                s.lineTo(24, 22),
                s.lineTo(0, 22),
                s.closePath(),
                s.strokeStyle = "rgba(0,0,0,0)",
                s.lineCap = "butt",
                s.lineJoin = "miter",
                s.miterLimit = 4,
                s.save(),
                s.restore(),
                s.save(),
                s.restore(),
                s.save(),
                s.fillStyle = "rgba(0, 0, 0, 0)",
                s.strokeStyle = "rgba(0, 0, 0, 0)",
                s.lineWidth = 1,
                s.save(),
                s.fillStyle = "#a784c5",
                s.save(),
                s.beginPath(),
                s.moveTo(4, 0),
                s.lineTo(20, 0),
                s.quadraticCurveTo(24, 0, 24, 4),
                s.lineTo(24, 18),
                s.quadraticCurveTo(24, 22, 20, 22),
                s.lineTo(4, 22),
                s.quadraticCurveTo(0, 22, 0, 18),
                s.lineTo(0, 4),
                s.quadraticCurveTo(0, 0, 4, 0),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.save(),
                s.strokeStyle = "#000000",
                s.lineWidth = 2,
                s.beginPath(),
                s.moveTo(5, 1),
                s.lineTo(19, 1),
                s.quadraticCurveTo(23, 1, 23, 5),
                s.lineTo(23, 17),
                s.quadraticCurveTo(23, 21, 19, 21),
                s.lineTo(5, 21),
                s.quadraticCurveTo(1, 21, 1, 17),
                s.lineTo(1, 5),
                s.quadraticCurveTo(1, 1, 5, 1),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , n = t.pos.y - this.y
                , r = sqrt(pow(s, 2) + pow(n, 2))
                , h = i._powerupsConsumed.misc
                , l = this.scene;
                if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
                    h.push(this.id);
                    var c = this.time * l.settings.drawFPS;
                    i.setTempVehicle("BLOB", c, {
                        x: this.x,
                        y: this.y
                    }, e.dir),
                    l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
                    l.vehicleTimer.playerAddedTime(i)),
                    i.isGhost() === !1 && (this.hit = !0,
                    this.sector.powerupCanvasDrawn = !1,
                    this.scene.message.show("Blob Powerup!", 50, "#A784C5", !1))
                }
            }
        }
    },
    32: function(t, e) {
        var Powerup = t(12)
          , n = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 32,
                height: 42
            };
        e.exports = class HeliPowerup extends Powerup {
            constructor(a, b, c, d) {
                super();
                this.x = a,
                this.y = b,
                this.time = c,
                this.id = random().toString(36).substr(2),
                this.hit = !1,
                this.init(d)
            }
            x = 0;
            y = 0;
            name = "helicopter";
            getCode() {
                return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 1 " + this.time.toString(32)
            }
            recache(t) {
                n.dirty = !1;
                var e = n.canvas;
                e.width = n.width * t,
                e.height = n.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , r = e.height / 2;
                this.drawIcon(s, r, t, i)
            }
            setDirty(t) {
                n.dirty = t
            }
            draw(t, e, i, s) {
                if (!this.hit) {
                    n.dirty && this.recache(i);
                    var r = n.width * i
                    , o = n.height * i
                    , a = r / 2
                    , h = o / 2;
                    s.drawImage(n.canvas, t - a, e - h, r, o)
                }
            }
            drawIcon(t, e, i, s) {
                i *= 1,
                s.lineCap = "butt",
                s.lineJoin = "miter",
                s.miterLimit = 4 * i,
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(15 * i, 4.5 * i),
                s.lineTo(15 * i, 2.5 * i),
                s.bezierCurveTo(15 * i, 1.4 * i, 14.1 * i, .5 * i, 13 * i, .5 * i),
                s.bezierCurveTo(11.9 * i, .5 * i, 11 * i, 1.4 * i, 11 * i, 2.5 * i),
                s.lineTo(11 * i, 4.5 * i),
                s.bezierCurveTo(11 * i, 5.6 * i, 11.9 * i, 6.5 * i, 13 * i, 6.5 * i),
                s.bezierCurveTo(14.1 * i, 6.5 * i, 15 * i, 5.6 * i, 15 * i, 4.5 * i),
                s.lineTo(15 * i, 4.5 * i),
                s.closePath(),
                s.fill(),
                s.beginPath(),
                s.lineCap = "round",
                s.lineWidth = 2 * i,
                s.moveTo(1 * i, 3 * i),
                s.lineTo(25 * i, 3 * i),
                s.stroke(),
                s.lineCap = "butt",
                s.lineWidth = 1 * i,
                s.beginPath(),
                s.moveTo(6.1 * i, 26.9 * i),
                s.lineTo(4.1 * i, 31.9 * i),
                s.bezierCurveTo(3.8 * i, 32.7 * i, 4.2 * i, 33.6 * i, 4.9 * i, 33.9 * i),
                s.bezierCurveTo(5.7 * i, 34.2 * i, 6.6 * i, 33.8 * i, 6.9 * i, 33 * i),
                s.lineTo(8.9 * i, 28 * i),
                s.bezierCurveTo(9.2 * i, 27.3 * i, 8.8 * i, 26.4 * i, 8 * i, 26.1 * i),
                s.bezierCurveTo(7.3 * i, 25.8 * i, 6.4 * i, 26.1 * i, 6.1 * i, 26.9 * i),
                s.lineTo(6.1 * i, 26.9 * i),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.beginPath(),
                s.moveTo(17 * i, 28 * i),
                s.lineTo(19 * i, 33 * i),
                s.bezierCurveTo(19.4 * i, 33.8 * i, 20.3 * i, 34.2 * i, 21 * i, 33.9 * i),
                s.bezierCurveTo(21.8 * i, 33.6 * i, 22.2 * i, 32.7 * i, 21.9 * i, 31.9 * i),
                s.lineTo(19.9 * i, 26.9 * i),
                s.bezierCurveTo(19.6 * i, 26.2 * i, 18.7 * i, 25.8 * i, 17.9 * i, 26.1 * i),
                s.bezierCurveTo(17.2 * i, 26.4 * i, 16.8 * i, 27.3 * i, 17.1 * i, 28 * i),
                s.lineTo(17 * i, 28 * i),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.fillStyle = "#f59423",
                s.strokeStyle = "#000000",
                s.lineWidth = 2 * i,
                s.beginPath(),
                s.arc(13 * i, 17 * i, 11 * i, 0 * i, 2 * PI, !0),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(21 * i, 17 * i),
                s.bezierCurveTo(21 * i, 12.6 * i, 17.4 * i, 9 * i, 13 * i, 9 * i),
                s.bezierCurveTo(8.6 * i, 9 * i, 5 * i, 12.6 * i, 5 * i, 17 * i),
                s.lineTo(21 * i, 17 * i),
                s.closePath(),
                s.fill()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , n = t.pos.y - this.y
                , r = sqrt(pow(s, 2) + pow(n, 2))
                , h = i._powerupsConsumed.misc
                , l = this.scene;
                if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
                    h.push(this.id);
                    var c = this.time * l.settings.drawFPS;
                    i.setTempVehicle("HELI", c, {
                        x: this.x,
                        y: this.y
                    }, e.dir),
                    l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
                    l.vehicleTimer.playerAddedTime(i)),
                    i.isGhost() === !1 && (this.hit = !0,
                    this.sector.powerupCanvasDrawn = !1,
                    this.scene.message.show("Helicopter Powerup!", 50, "#F2902E", !1))
                }
            }
        }
    },
    33: function(t, e) {
        var Powerup = t(12)
          , n = {
                canvas: document.createElement("canvas"),
                dirty: !0,
                width: 32,
                height: 42
            };
        e.exports = class TruckPowerup extends Powerup {
            constructor(a, b, c, d) {
                super();
                this.x = a,
                this.y = b,
                this.time = c,
                this.id = random().toString(36).substr(2),
                this.hit = !1,
                this.init(d)
            }
            x = 0;
            y = 0;
            name = "truck";
            getCode() {
                return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 2 " + this.time.toString(32)
            }
            recache(t) {
                n.dirty = !1;
                var e = n.canvas;
                e.width = n.width * t,
                e.height = n.height * t;
                var i = e.getContext("2d")
                , s = e.width / 2
                , r = e.height / 2;
                this.drawIcon(s, r, t, i)
            }
            setDirty(t) {
                n.dirty = t
            }
            draw(t, e, i, s) {
                if (!this.hit) {
                    n.dirty && this.recache(i);
                    var r = n.width * i
                    , o = n.height * i
                    , a = r / 2
                    , h = o / 2;
                    s.drawImage(n.canvas, t - a, e - h, r, o)
                }
            }
            drawIcon(t, e, i, s) {
                i *= 1,
                s.save(),
                s.scale(i, i),
                s.beginPath(),
                s.moveTo(0, 0),
                s.lineTo(24, 0),
                s.lineTo(24, 26),
                s.lineTo(0, 26),
                s.closePath(),
                s.clip(),
                s.translate(0, 0),
                s.translate(0, 0),
                s.scale(1, 1),
                s.translate(0, 0),
                s.strokeStyle = "rgba(0,0,0,0)",
                s.lineCap = "butt",
                s.lineJoin = "miter",
                s.miterLimit = 4,
                s.save(),
                s.restore(),
                s.save(),
                s.restore(),
                s.save(),
                s.fillStyle = "rgba(0, 0, 0, 0)",
                s.strokeStyle = "rgba(0, 0, 0, 0)",
                s.lineWidth = 1,
                s.translate(-1320, -352),
                s.save(),
                s.translate(251, 28),
                s.save(),
                s.translate(1056, 265),
                s.save(),
                s.translate(3, 49),
                s.save(),
                s.translate(10, 8),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(2, 17),
                s.lineTo(4, 17),
                s.quadraticCurveTo(6, 17, 6, 19),
                s.lineTo(6, 26),
                s.quadraticCurveTo(6, 28, 4, 28),
                s.lineTo(2, 28),
                s.quadraticCurveTo(0, 28, 0, 26),
                s.lineTo(0, 19),
                s.quadraticCurveTo(0, 17, 2, 17),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(20, 17),
                s.lineTo(22, 17),
                s.quadraticCurveTo(24, 17, 24, 19),
                s.lineTo(24, 26),
                s.quadraticCurveTo(24, 28, 22, 28),
                s.lineTo(20, 28),
                s.quadraticCurveTo(18, 28, 18, 26),
                s.lineTo(18, 19),
                s.quadraticCurveTo(18, 17, 20, 17),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.strokeStyle = "#000000",
                s.lineWidth = 2,
                s.lineCap = "square",
                s.beginPath(),
                s.moveTo(3.5, 23),
                s.lineTo(20.5, 23),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.save(),
                s.fillStyle = "#94d44e",
                s.save(),
                s.beginPath(),
                s.moveTo(23, 11.2672237),
                s.bezierCurveTo(23.5979157, 11.6115707, 24, 12.2552568, 24, 12.999615),
                s.lineTo(24, 19.000385),
                s.bezierCurveTo(24, 20.1047419, 23.1029738, 21, 21.9950534, 21),
                s.lineTo(2.00494659, 21),
                s.bezierCurveTo(.897645164, 21, 0, 20.1125667, 0, 19.000385),
                s.lineTo(0, 12.999615),
                s.bezierCurveTo(0, 12.2603805, .401930294, 11.6148368, 1, 11.268783),
                s.lineTo(1, 3.99742191),
                s.bezierCurveTo(1, 2.89427625, 1.88967395, 2, 2.991155, 2),
                s.lineTo(21.008845, 2),
                s.bezierCurveTo(22.1085295, 2, 23, 2.89092539, 23, 3.99742191),
                s.lineTo(23, 11.2672237),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.save(),
                s.strokeStyle = "#000000",
                s.lineWidth = 2,
                s.beginPath(),
                s.moveTo(22.5009348, 12.1337882),
                s.lineTo(22, 11.8452936),
                s.lineTo(22, 3.99742191),
                s.bezierCurveTo(22, 3.44392402, 21.5569554, 3, 21.008845, 3),
                s.lineTo(2.991155, 3),
                s.bezierCurveTo(2.44342393, 3, 2, 3.44509694, 2, 3.99742191),
                s.lineTo(2, 11.8455),
                s.lineTo(1.50082265, 12.1343329),
                s.bezierCurveTo(1.19247839, 12.3127464, 1, 12.6390115, 1, 12.999615),
                s.lineTo(1, 19.000385),
                s.bezierCurveTo(1, 19.5563739, 1.44601448, 20, 2.00494659, 20),
                s.lineTo(21.9950534, 20),
                s.bezierCurveTo(22.5510229, 20, 23, 19.5521213, 23, 19.000385),
                s.lineTo(23, 12.999615),
                s.bezierCurveTo(23, 12.6352349, 22.8086914, 12.311029, 22.5009348, 12.1337882),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.moveTo(5, 6),
                s.lineTo(19, 6),
                s.quadraticCurveTo(19, 6, 19, 6),
                s.lineTo(19, 12),
                s.quadraticCurveTo(19, 12, 19, 12),
                s.lineTo(5, 12),
                s.quadraticCurveTo(5, 12, 5, 12),
                s.lineTo(5, 6),
                s.quadraticCurveTo(5, 6, 5, 6),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.arc(5.03571429, 16.0357143, 1.39285714, 0, 6.283185307179586, !0),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.save(),
                s.fillStyle = "#000000",
                s.beginPath(),
                s.arc(18.9642857, 16.0357143, 1.39285714, 0, 6.283185307179586, !0),
                s.closePath(),
                s.fill(),
                s.stroke(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore(),
                s.restore()
            }
            collide(t) {
                var e = t.parent
                , i = e.player
                , s = t.pos.x - this.x
                , n = t.pos.y - this.y
                , r = sqrt(pow(s, 2) + pow(n, 2))
                , h = i._powerupsConsumed.misc
                , l = this.scene;
                if (30 > r && i.isAlive() && -1 === h.indexOf(this.id)) {
                    h.push(this.id);
                    var c = this.time * l.settings.drawFPS;
                    i.setTempVehicle("TRUCK", c, {
                        x: this.x,
                        y: this.y
                    }, e.dir),
                    l.camera.playerFocus === i && (l.camera.focusOnPlayer(),
                    l.vehicleTimer.playerAddedTime(i)),
                    i.isGhost() === !1 && (this.hit = !0,
                    this.sector.powerupCanvasDrawn = !1,
                    this.scene.message.show("Truck Powerup!", 50, "#94d44e", !1))
                }
            }
        }
    },
    34: function(t, e) {
        var Vector = t(8)
          , Tool = t(49);
        e.exports = class BrushTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1;
                var e = a.scene.settings.brush;
                this.addedObjects = [],
                this.options = {
                    breakLength: e.breakLength,
                    maxBreakLength: e.maxBreakLength,
                    minBreakLength: e.minBreakLength,
                    breakLengthSensitivity: e.breakLengthSensitivity,
                    trailSpeed: e.trailSpeed,
                    maxTrailSpeed: e.maxTrailSpeed,
                    minTrailSpeed: e.minTrailSpeed,
                    trailSpeedSensitivity: e.trailSpeedSensitivity
                }
            }
            toolInit = this.init;
            toolUpdate = this.update;
            name = "Brush";
            p1 = null;
            p2 = null;
            active = !1;
            options = null;
            reset() {
                this.recordActionsToToolhandler(),
                this.active = !1
            }
            recordActionsToToolhandler() {
                var t, e = this.addedObjects, i = e.length;
                if (i)
                    for (t = 0; i > t; t++)
                        this.toolhandler.addActionToTimeline({
                            type: "add",
                            objects: [e[t]]
                        });
                this.addedObjects = []
            }
            press() {
                if (this.recordActionsToToolhandler(),
                !this.active) {
                    var t = this.mouse.touch.real;
                    this.p1.x = t.x,
                    this.p1.y = t.y,
                    this.p2.x = t.x,
                    this.p2.y = t.y,
                    this.active = !0
                }
            }
            hold() {
                var t = this.mouse.touch.real
                , e = this.p1
                , i = this.p2
                , s = this.options.trailSpeed
                , n = this.options.breakLength;
                i.inc(t.sub(i).factor(s));
                var r = screen.height + t.sub(i).len();
                if (r *= n,
                i.sub(e).lenSqr() > r) {
                    var o = this.scene.track
                    , a = !1;
                    a = "physics" === this.toolhandler.options.lineType ? o.addPhysicsLine(e.x, e.y, i.x, i.y) : o.addSceneryLine(e.x, e.y, i.x, i.y),
                    a && this.addedObjects.push(a),
                    e.equ(i),
                    this.toolhandler.snapPoint.x = i.x,
                    this.toolhandler.snapPoint.y = i.y
                }
                this.toolhandler.moveCameraTowardsMouse()
            }
            release() {
                var t = this.p1
                , e = this.p2
                , i = this.scene.track
                , s = !1;
                s = "physics" === this.toolhandler.options.lineType ? i.addPhysicsLine(t.x, t.y, e.x, e.y) : i.addSceneryLine(t.x, t.y, e.x, e.y),
                s && this.addedObjects.push(s),
                this.recordActionsToToolhandler();
                var n = this.toolhandler
                , r = n.snapPoint;
                r.x = e.x,
                r.y = e.y,
                this.active = !1
            }
            update = () => {
                var t = this.toolhandler.gamepad
                , e = this.mouse;
                t.isButtonDown("alt") ? e.mousewheel !== !1 && this.adjustTrailSpeed(e.mousewheel) : t.isButtonDown("shift") && e.mousewheel !== !1 && this.adjustBreakLength(e.mousewheel);
                var i = this.toolhandler;
                i.options.snap && (this.active = !0,
                this.p1.x = i.snapPoint.x,
                this.p1.y = i.snapPoint.y,
                this.p2.x = e.touch.real.x,
                this.p2.y = e.touch.real.y),
                this.toolUpdate()
            }
            adjustTrailSpeed(t) {
                var e = this.options.trailSpeed
                , i = this.options.trailSpeedSensitivity
                , s = this.options.maxTrailSpeed
                , n = this.options.minTrailSpeed;
                t > 0 ? (e += i,
                e > s && (e = s)) : (e -= i,
                n > e && (e = n)),
                this.setOption("trailSpeed", e)
            }
            adjustBreakLength(t) {
                var e = this.options.breakLength
                , i = this.options.breakLengthSensitivity
                , s = this.options.maxBreakLength
                , n = this.options.minBreakLength;
                t > 0 ? (e += i,
                e > s && (e = s)) : (e -= i,
                n > e && (e = n)),
                this.setOption("breakLength", e)
            }
            setOption(t, e) {
                this.options[t] = e
            }
            getOptions() {
                var t = this.toolhandler
                , e = this.options;
                return e.lineType = t.options.lineType,
                e.snap = t.options.snap,
                e
            }
            draw() {
                var t = this.scene
                , e = (t.game.canvas,
                t.game.canvas.getContext("2d"))
                , i = t.camera
                , s = i.zoom;
                this.drawCursor(e),
                this.active && (this.drawLine(e, s),
                this.drawPoint(e, this.p1, s),
                this.drawPoint(e, this.p2, s))
            }
            drawText(t) {
                var e = this.name
                , i = this.options.breakLength
                , s = this.options.trailSpeed
                , n = this.game.pixelRatio;
                t.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.font = 12 * n + "pt arial",
                t.fillText(e, 10 * n, 20 * n),
                t.font = 8 * n + "pt arial",
                s = 0 | s,
                i = i,
                t.fillText("Trail speed : " + s, 10 * n, 40 * n),
                t.fillText("Break length : " + i, 10 * n, 60 * n)
            }
            drawCursor(t) {
                var e = this.mouse.touch
                , i = e.real.toScreen(this.scene)
                , s = this.camera.zoom
                , n = this.toolhandler
                , r = n.options.grid
                , o = "#1884cf";
                if (r) {
                    var a = 5 * s;
                    t.beginPath(),
                    t.moveTo(i.x, i.y - a),
                    t.lineTo(i.x, i.y + a),
                    t.moveTo(i.x - a, i.y),
                    t.lineTo(i.x + a, i.y),
                    t.lineWidth = 1 * s,
                    t.stroke()
                } else
                    t.beginPath(),
                    t.arc(i.x, i.y, 1 * s, 0, 2 * PI, !1),
                    t.lineWidth = 1,
                    t.fillStyle = o,
                    t.fill()
            }
            drawPoint(t, e, i) {
                var s = e.toScreen(this.scene);
                t.beginPath(),
                t.arc(s.x, s.y, 1 * i, 0, 2 * PI, !1),
                t.lineWidth = 1,
                t.fillStyle = "#1884cf",
                t.fill()
            }
            drawLine(t, e) {
                var i = this.scene
                , s = (i.game.canvas,
                2 * e > .5 ? 2 * e : .5)
                , n = this.toolhandler
                , r = n.options.lineType
                , o = "physics" === r ? (window.lite.getVar("dark") ? "#fff" : "#000") : (window.lite.getVar("dark") ? "#777" : "#AAA");
                t.beginPath(),
                t.lineWidth = s,
                t.lineCap = "round",
                t.strokeStyle = o;
                var a = this.p1.toScreen(this.scene)
                , h = this.p2.toScreen(this.scene);
                t.moveTo(a.x, a.y),
                t.lineTo(h.x, h.y),
                t.stroke()
            }
        }
    },
    35: function(t, e) {
        var Tool = t(49);
        e.exports = class Camera extends Tool {
            constructor(t) {
                super();
                this.toolInit(t)
            }
            toolInit = this.init;
            toolDraw = this.draw;
            name = "Camera";
            hold() {
                var t = this.mouse.touch
                , e = t.pos
                , i = this.camera
                , s = t.old.pos.sub(e).factor(1 / i.zoom);
                i.position.inc(s)
            }
            draw() {
                {
                    var t = this.scene;
                    t.game.canvas,
                    t.game.canvas.getContext("2d")
                }
            }
            drawText(t) {
                {
                    var e = this.name
                    , i = this.game.pixelRatio
                    , s = this.scene;
                    s.game.canvas
                }
                t.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.font = 12 * i + "pt arial",
                t.fillText(e, 10 * i, 20 * i),
                t.font = 8 * i + "pt arial"
            }
        }
    },
    36: function(t, e) {
        var Vector = t(8)
          , Tool = t(49);
        e.exports = class CurveTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.midpoint = new Vector(0,0),
                this.active = !1,
                this.options = {}
            }
            toolInit = this.init;
            name = "Curve";
            active = !1;
            p1 = null;
            p2 = null;
            midpoint = null;
            anchoring = !1;
            options = null;
            getOptions() {
                var t = this.toolhandler
                , e = this.options;
                return e.lineType = t.options.lineType,
                e.snap = t.options.snap,
                e
            }
            reset() {
                this.active = !1,
                this.anchoring = !1
            }
            press() {
                if (!this.active) {
                    this.active = !0;
                    var t = this.mouse.touch.real;
                    this.p1.x = t.x,
                    this.p1.y = t.y
                }
            }
            hold() {
                var t = this.mouse.touch.real;
                this.p2.x = t.x,
                this.p2.y = t.y;
                var e = this.p1
                , i = this.p2;
                this.midpoint.x = (e.x + i.x) / 2,
                this.midpoint.y = (e.y + i.y) / 2,
                this.toolhandler.moveCameraTowardsMouse()
            }
            release() {
                var t = this.p1
                , e = this.p2
                , i = this.midpoint
                , s = this.toolhandler;
                if (this.anchoring) {
                    if (i.x === e.x && i.y === e.y) {
                        var n = this.scene.track
                        , a = !1;
                        a = "physics" === s.options.lineType ? n.addPhysicsLine(t.x, t.y, e.x, e.y) : n.addSceneryLine(t.x, t.y, e.x, e.y),
                        a && s.addActionToTimeline({
                            type: "add",
                            objects: [a]
                        }),
                        s.snapPoint.x = e.x,
                        s.snapPoint.y = e.y
                    } else
                        this.splitAndAddCurve();
                    this.anchoring = !1,
                    this.active = !1
                } else {
                    var h = e.x - t.x
                    , l = e.y - t.y
                    , c = sqrt(pow(h, 2) + pow(l, 2));
                    c > 0 ? this.anchoring = !0 : this.active = !1
                }
            }
            updateAnchor() {
                var t = this.mouse.touch.real;
                this.midpoint.x = t.x,
                this.midpoint.y = t.y
            }
            splitAndAddCurve() {
                for (var t = curve(this.p1, this.midpoint, this.p2), e = this.scene.track, i = t.length, n = this.toolhandler, r = [], o = 0; i - 2 > o; o += 2) {
                    var a = t[o]
                    , h = t[o + 1]
                    , l = t[o + 2]
                    , c = t[o + 3]
                    , u = !1;
                    u = "physics" === n.options.lineType ? e.addPhysicsLine(a, h, l, c) : e.addSceneryLine(a, h, l, c),
                    u && r.push(u),
                    n.snapPoint.x = l,
                    n.snapPoint.y = c
                }
                r.length > 0 && n.addActionToTimeline({
                    type: "add",
                    objects: r
                })
            }
            update = () => {
                var t = this.mouse
                , e = t.touch
                , i = t.secondaryTouch
                , s = this.toolhandler.gamepad
                , n = this.toolhandler;
                n.options.snap && (this.active = !0,
                this.p1 = n.snapPoint,
                this.anchoring || this.hold());
                var r = this.toolhandler.options
                , o = s.isButtonDown("shift");
                r.rightClickMove && (o = i.old.down),
                o ? (e.old.down || r.rightClickMove) && this.moveCamera() : (e.press && !this.anchoring && this.press(),
                e.old.down && !this.anchoring && this.hold(),
                e.release && this.release(),
                this.anchoring && this.updateAnchor()),
                t.mousewheel !== !1 && s.isButtonDown("shift") === !1 && this.mousewheel(t.mousewheel)
            }
            draw() {
                var t = this.scene
                , e = (t.game.canvas,
                t.game.canvas.getContext("2d"))
                , i = t.camera
                , s = i.zoom;
                this.drawCursor(e, s),
                this.active && (this.drawLine(e, s),
                this.drawPoint(e, this.p1, s),
                this.drawPoint(e, this.p2, s))
            }
            toScreen(t, e) {
                var i = this.scene.camera
                , s = this.scene.screen;
                return (t - i.position[e]) * i.zoom + s.center[e]
            }
            drawCursor(t, e) {
                var i = this.mouse.touch
                , s = i.real.toScreen(this.scene)
                , n = this.toolhandler
                , r = n.options.grid
                , o = "#1884cf";
                if (r) {
                    var a = 5 * e;
                    t.beginPath(),
                    t.moveTo(s.x, s.y - a),
                    t.lineTo(s.x, s.y + a),
                    t.moveTo(s.x - a, s.y),
                    t.lineTo(s.x + a, s.y),
                    t.lineWidth = 1 * e,
                    t.stroke()
                } else
                    t.beginPath(),
                    t.arc(s.x, s.y, 1 * e, 0, 2 * PI, !1),
                    t.lineWidth = 1,
                    t.fillStyle = o,
                    t.fill()
            }
            drawPoint(t, e, i) {
                var s = e.toScreen(this.scene);
                t.beginPath(),
                t.arc(s.x, s.y, 1 * i, 0, 2 * PI, !1),
                t.lineWidth = 1,
                t.fillStyle = "#1884cf",
                t.fill()
            }
            drawText(t) {
                {
                    var e = this.name
                    , i = this.game.pixelRatio
                    , s = this.scene;
                    s.game.canvas
                }
                t.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.font = 12 * i + "pt arial",
                t.fillText(e, 10 * i, 20 * i),
                t.font = 8 * i + "pt arial"
            }
            drawLine(t, e) {
                var i = this.scene
                , s = (i.game.canvas,
                2 * e > .5 ? 2 * e : .5)
                , n = this.toolhandler
                , r = n.options.lineType
                , o = "physics" === r ? (window.lite.getVar("dark") ? "#fff" : "#000") : (window.lite.getVar("dark") ? "#777" : "#AAA");
                t.beginPath(),
                t.lineWidth = s,
                t.lineCap = "round",
                t.strokeStyle = o;
                var a = this.p1.toScreen(this.scene)
                , h = this.p2.toScreen(this.scene)
                , l = this.midpoint.toScreen(this.scene);
                t.moveTo(a.x, a.y),
                t.quadraticCurveTo(l.x, l.y, h.x, h.y),
                t.stroke()
            }
        }
    },
    37: function(t, e) {
        var Vector = t(8)
          , Tool = t(49);
        e.exports = class EraserTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a);
                var e = a.scene.settings.eraser;
                this.options = e,
                this.eraserPoint = new Vector,
                this.erasedObjects = []
            }
            toolInit = this.init;
            toolUpdate = this.update;
            name = "Eraser";
            options = null;
            reset() {
                this.recordActionsToToolhandler()
            }
            press() {
                this.recordActionsToToolhandler()
            }
            recordActionsToToolhandler() {
                var t = [];
                for(var e in this.erasedObjects) {
                    for(var i in this.erasedObjects[e]) {
                        t.push(this.erasedObjects[e][i])
                    }
                }
                this.erasedObjects.length > 0 && this.toolhandler.addActionToTimeline({
                    type: "remove",
                    objects: t
                }),
                this.erasedObjects = []
            }
            release() {
                this.recordActionsToToolhandler()
            }
            hold() {
                var t = this.mouse.touch
                , e = t.pos
                , i = this.scene.track
                , s = this.scene.screen
                , n = this.scene.camera
                , o = s.center
                , a = n.position
                , h = (e.x - o.x) / n.zoom + a.x
                , l = (e.y - o.y) / n.zoom + a.y;
                this.eraserPoint.x = round(h),
                this.eraserPoint.y = round(l);
                var c = i.erase(this.eraserPoint, this.options.radius / this.scene.camera.zoom, this.options.types);
                c.length > 0 && this.erasedObjects.push(c)
            }
            draw() {
                var t = this.scene
                , e = (t.game.canvas,
                t.game.canvas.getContext("2d"));
                this.drawEraser(e)
            }
            drawEraser(t) {
                {
                    var e = this.mouse.touch
                    , i = e.pos;
                    this.camera.zoom
                }
                t.beginPath(),
                t.arc(i.x, i.y, this.options.radius, 0, 2 * PI, !1),
                t.lineWidth = 1,
                t.fillStyle = "rgba(255,255,255,0.8)",
                t.fill(),
                t.strokeStyle = "#000000",
                t.stroke()
            }
            setOption(t, e) {
                this.options[t] = e
            }
            getOptions() {
                return this.options
            }
            update = () => {
                var t = this.toolhandler.gamepad
                , e = this.mouse;
                t.isButtonDown("shift") && e.mousewheel !== !1 && this.adjustRadius(e.mousewheel),
                this.toolUpdate()
            }
            adjustRadius(t) {
                var e = this.options.radius
                , i = this.options.radiusSizeSensitivity
                , s = this.options.maxRadius
                , n = this.options.minRadius
                , r = t > 0 ? i : -i;
                e += r,
                n > e ? e = n : e > s && (e = s),
                this.setOption("radius", e)
            }
        }
    },
    38: function(t, e) {
        var Tool = t(49)
          , Gravity = t(44)
          , TargetTool = t(43)
          , BoosterTool = t(41)
          , SlowmoTool = t(45)
          , CheckpointTool = t(42)
          , BombTool = t(40)
          , AntigravityTool = t(39)
          , TeleporterTool = t(46);
        e.exports = class PowerupTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a),
                this.powerupTools = {},
                this.registerPowerupTools(),
                this.options = {
                    selected: "goal"
                }
            }
            toolInit = this.init;
            toolUpdate = this.update;
            name = "Powerup";
            powerupTools = null;
            registerPowerupTools() {
                this.registerTool(new TargetTool(this.toolhandler)),
                this.registerTool(new BoosterTool(this.toolhandler)),
                this.registerTool(new Gravity(this.toolhandler)),
                this.registerTool(new SlowmoTool(this.toolhandler)),
                this.registerTool(new BombTool(this.toolhandler)),
                this.registerTool(new CheckpointTool(this.toolhandler)),
                this.registerTool(new AntigravityTool(this.toolhandler)),
                this.registerTool(new TeleporterTool(this.toolhandler))
            }
            registerTool(t) {
                this.powerupTools[t.name] = t
            }
            setOption(t, e) {
                this.options[t] = e
            }
            getOptions() {
                return this.options
            }
            update = () => {
                var t = this.toolhandler.gamepad
                , e = (this.mouse,
                this.options);
                t.isButtonDown("opt1") && (e.selected = "goal",
                t.setButtonUp("opt1"),
                this.scene.stateChanged()),
                t.isButtonDown("opt2") && (e.selected = "boost",
                t.setButtonUp("opt2"),
                this.scene.stateChanged()),
                t.isButtonDown("opt3") && (e.selected = "gravity",
                t.setButtonUp("opt3"),
                this.scene.stateChanged()),
                t.isButtonDown("opt4") && (e.selected = "slowmo",
                t.setButtonUp("opt4"),
                this.scene.stateChanged()),
                t.isButtonDown("opt5") && (e.selected = "bomb",
                t.setButtonUp("opt5"),
                this.scene.stateChanged()),
                t.isButtonDown("opt6") && (e.selected = "checkpoint",
                t.setButtonUp("opt6"),
                this.scene.stateChanged()),
                t.isButtonDown("opt7") && (e.selected = "antigravity",
                t.setButtonUp("opt7"),
                this.scene.stateChanged()),
                t.isButtonDown("opt8") && Application.User.get("classic") && (e.selected = "teleport",
                t.setButtonUp("opt8"),
                this.scene.stateChanged()),
                this.toolUpdate()
            }
            press() {
                var t = this.options.selected;
                this.powerupTools[t].press()
            }
            hold() {
                var t = this.options.selected;
                this.powerupTools[t].hold()
            }
            release() {
                var t = this.options.selected;
                this.powerupTools[t].release()
            }
            draw() {
                var t = this.scene
                , e = (t.game.canvas,
                t.game.canvas.getContext("2d"))
                , i = this.options;
                this.powerupTools[i.selected].draw(e)
            }
        }
    },
    39: function(t, e) {
        var Vector = t(8)
          , Antigravity = t(13)
          , Tool = t(49);
        e.exports = class AntigravityTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a),
                this.powerup = new Antigravity(0,0,a.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "antigravity";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                , i = (e.pos,
                this.camera.zoom)
                , s = this.scene.settings.device
                , n = this.scene.screen;
                if (this.active === !0) {
                    var r = n.realToScreen(this.p1.x, "x")
                    , o = n.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                } else if ("desktop" === s) {
                    var r = n.realToScreen(e.real.x, "x")
                    , o = n.realToScreen(e.real.y, "y");
                    t.globalAlpha = .8,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y;
                var i = this.scene.track
                , s = new Antigravity(this.p1.x,this.p1.y,i);
                i.addPowerup(s),
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [s]
                })
            }
        }
    },
    40: function(t, e) {
        var Vector = t(8)
          , Bomb = t(14)
          , Tool = t(49);
        e.exports = class BombTool extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.powerup = new Bomb(0,0,t.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "bomb";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                , i = (e.pos,
                this.camera.zoom)
                , s = this.scene.settings.device
                , n = this.scene.screen;
                if (this.active === !0) {
                    var r = n.realToScreen(this.p1.x, "x")
                    , o = n.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                } else if ("desktop" === s) {
                    var r = n.realToScreen(e.real.x, "x")
                    , o = n.realToScreen(e.real.y, "y");
                    t.globalAlpha = .8,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                , e = new Bomb(this.p1.x,this.p1.y,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
    },
    41: function(t, e) {
        var Vector = t(8)
          , Booster = t(15)
          , Tool = t(49);
        class BoosterTool extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.powerup = new Booster(0,0,0,t.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "boost";
            p1 = null;
            p2 = null;
            active = !1;
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = this.scene.track
                , e = new Booster(this.p1.x,this.p1.y,this.powerup.angle,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
            draw(t) {
                var e = this.mouse.touch
                , i = (e.pos,
                this.camera.zoom)
                , s = this.scene.screen
                , n = this.scene.settings.device;
                if (this.active === !0) {
                    var a = s.realToScreen(this.p1.x, "x")
                    , h = s.realToScreen(this.p1.y, "y")
                    , l = this.p1
                    , c = this.p2
                    , u = l.y - c.y
                    , p = l.x - c.x
                    , d = atan2(l.y - c.y, l.x - c.x);
                    0 === p && 0 === u && (d = PI - PI / 2),
                    0 > d && (d += 2 * PI),
                    this.drawPathToMouse(t, d),
                    this.powerup.angle = d * (180 / PI) - 90 | 0,
                    this.powerup.draw(a, h, i, t)
                } else if ("desktop" === n) {
                    t.globalAlpha = .8,
                    this.powerup.angle = 0;
                    var a = s.realToScreen(e.real.x, "x")
                    , h = s.realToScreen(e.real.y, "y");
                    this.powerup.draw(a, h, i, t),
                    t.globalAlpha = 1
                }
            }
            drawPathToMouse(t, e) {
                var i = this.p1
                , s = this.p2
                , n = this.scene.screen
                , o = this.scene.camera.zoom
                , u = n.realToScreen(i.x, "x")
                , p = n.realToScreen(i.y, "y")
                , d = n.realToScreen(s.x, "x")
                , f = n.realToScreen(s.y, "y")
                , v = sqrt(pow(d - u, 2) + pow(f - p, 2));
                30 * o > v && (v = 30 * o),
                t.strokeStyle = "#ADCF7D",
                t.lineWidth = max(1, 2 * o),
                t.beginPath(),
                t.moveTo(u, p),
                t.lineTo(u + v, p),
                t.stroke(),
                t.beginPath(),
                t.moveTo(u, p),
                t.lineTo(d, f),
                t.stroke(),
                t.closePath();
                var g = e + 180 * (PI / 180)
                , m = min(v, 50 * o);
                t.beginPath(),
                t.moveTo(u, p),
                t.arc(u, p, m, g, 0, !1),
                t.moveTo(u, p),
                t.stroke(),
                t.fillStyle = "rgba(173, 207, 125,0.2)",
                t.fill(),
                t.closePath()
            }
        }
        e.exports = BoosterTool
    },
    42: function(t, e) {
        var Vector = t(8),
            Checkpoint = t(16),
            Tool = t(49);
        class CheckpointTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a),
                this.powerup = new Checkpoint(0,0,a.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "checkpoint";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                  , i = (e.pos,
                this.camera.zoom)
                  , s = this.scene.settings.device
                  , n = this.scene.screen;
                if (this.active === !0) {
                    var r = n.realToScreen(this.p1.x, "x")
                      , o = n.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                } else if ("desktop" === s) {
                    var r = n.realToScreen(e.real.x, "x")
                      , o = n.realToScreen(e.real.y, "y");
                    t.globalAlpha = .8,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                  , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                  , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                  , e = new Checkpoint(this.p1.x,this.p1.y,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
        e.exports = CheckpointTool
    },
    43: function(t, e) {
        var Vector = t(8),
            Target = t(19),
            Tool = t(49);
        class TargetTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a),
                this.powerup = new Target(0,0,a.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "goal";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                  , i = (e.pos,
                this.camera.zoom)
                  , s = this.scene.settings.device
                  , n = this.scene.screen;
                if (this.active === !0) {
                    var r = n.realToScreen(this.p1.x, "x")
                      , o = n.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                } else if ("desktop" === s) {
                    var r = n.realToScreen(e.real.x, "x")
                      , o = n.realToScreen(e.real.y, "y");
                    t.globalAlpha = .8,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                  , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                  , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                  , e = new Target(this.p1.x,this.p1.y,t);
                t.addTarget(e),
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
        e.exports = TargetTool
    },
    44: function(t, e) {
        var Vector = t(8)
          , Gravity = t(17)
          , Tool = t(49);
        class GravityTool extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.powerup = new Gravity(0,0,0,t.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "gravity";
            p1 = null;
            p2 = null;
            active = !1;
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = this.scene.track
                , e = new Gravity(this.p1.x,this.p1.y,this.powerup.angle - 180,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
            draw(t) {
                var e = this.mouse.touch
                , i = (e.pos,
                this.camera.zoom)
                , s = this.scene.screen
                , n = this.scene.settings.device;
                if (this.active === !0) {
                    var a = s.realToScreen(this.p1.x, "x")
                    , h = s.realToScreen(this.p1.y, "y")
                    , l = this.p1
                    , c = this.p2
                    , u = l.y - c.y
                    , p = l.x - c.x
                    , d = atan2(l.y - c.y, l.x - c.x);
                    0 === p && 0 === u && (d = PI - PI / 2),
                    0 > d && (d += 2 * PI),
                    this.drawPathToMouse(t, d),
                    this.powerup.angle = d * (180 / PI) + 90 | 0,
                    this.powerup.draw(a, h, i, t)
                } else if ("desktop" === n) {
                    t.globalAlpha = .8,
                    this.powerup.angle = 180;
                    var a = s.realToScreen(e.real.x, "x")
                    , h = s.realToScreen(e.real.y, "y");
                    this.powerup.draw(a, h, i, t),
                    t.globalAlpha = 1
                }
            }
            drawPathToMouse(t, e) {
                var i = this.p1
                , s = this.p2
                , n = this.scene.screen
                , o = this.scene.camera.zoom
                , u = n.realToScreen(i.x, "x")
                , p = n.realToScreen(i.y, "y")
                , d = n.realToScreen(s.x, "x")
                , f = n.realToScreen(s.y, "y")
                , v = sqrt(pow(d - u, 2) + pow(f - p, 2));
                30 * o > v && (v = 30 * o),
                t.strokeStyle = "#A2B7D2",
                t.lineWidth = max(1, 2 * o),
                t.beginPath(),
                t.moveTo(u, p),
                t.lineTo(u + v, p),
                t.stroke(),
                t.beginPath(),
                t.moveTo(u, p),
                t.lineTo(d, f),
                t.stroke(),
                t.closePath();
                var g = e + 180 * (PI / 180)
                , m = min(v, 50 * o);
                t.beginPath(),
                t.moveTo(u, p),
                t.arc(u, p, m, g, 0, !1),
                t.moveTo(u, p),
                t.stroke(),
                t.fillStyle = "rgba(162, 183, 210,0.2)",
                t.fill(),
                t.closePath()
            }
        }
        e.exports = GravityTool
    },
    45: function(t, e) {
        var Vector = t(8)
          , Slowmo = t(18)
          , Tool = t(49);
        class SlowmoTool extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.powerup = new Slowmo(0,0,t.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "slowmo";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                , i = (e.pos,
                this.camera.zoom)
                , s = this.scene.settings.device
                , n = this.scene.screen;
                if (this.active === !0) {
                    var r = n.realToScreen(this.p1.x, "x")
                    , o = n.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                } else if ("desktop" === s) {
                    var r = n.realToScreen(e.real.x, "x")
                    , o = n.realToScreen(e.real.y, "y");
                    t.globalAlpha = .8,
                    this.powerup.draw(r, o, i, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                , e = new Slowmo(this.p1.x,this.p1.y,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
        e.exports = SlowmoTool
    },
    46: function(t, e) {
        var Vector = t(8)
          , Teleporter = t(20)
          , Tool = t(49)
          , c = (min,
        abs);
        class TeleporterTool extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.powerup = new Teleporter(0,0,t.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            portal1 = null;
            name = "teleport";
            p1 = null;
            p2 = null;
            active = !1;
            press() {
                var t = this.mouse.touch
                , e = t.real
                , i = (this.scene.screen,
                this.scene.track);
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.portal1 = new Teleporter(this.p1.x,this.p1.y,i),
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = c(this.p2.x - this.p1.x)
                , e = c(this.p2.y - this.p1.y);
                if (t > 40 || e > 40) {
                    var i = this.scene.track;
                    this.portal2 = new Teleporter(this.p2.x,this.p2.y,i),
                    this.portal1.addOtherPortalRef(this.portal2),
                    this.portal2.addOtherPortalRef(this.portal1),
                    i.addPowerup(this.portal1),
                    i.addPowerup(this.portal2),
                    this.toolhandler.addActionToTimeline({
                        type: "add",
                        objects: [this.portal1, this.portal2]
                    }),
                    this.active = !1
                } else
                    this.active = !1,
                    this.portal1 = null
            }
            draw(t) {
                var e = this.mouse.touch
                , i = (e.pos,
                this.camera.zoom)
                , s = this.scene.screen
                , n = this.scene.settings.device;
                if (this.active === !0) {
                    var a = s.realToScreen(this.p1.x, "x")
                    , h = s.realToScreen(this.p1.y, "y")
                    , l = s.realToScreen(this.p2.x, "x")
                    , c = s.realToScreen(this.p2.y, "y")
                    , u = this.p1
                    , p = this.p2
                    , d = u.y - p.y
                    , f = u.x - p.x
                    , v = atan2(u.y - p.y, u.x - p.x);
                    0 === f && 0 === d && (v = PI - PI / 2),
                    0 > v && (v += 2 * PI),
                    this.drawPathToMouse(t, v),
                    this.portal1.draw(a, h, i, t),
                    this.powerup.draw(l, c, i, t)
                } else if ("desktop" === n) {
                    t.globalAlpha = .8;
                    var g = s.realToScreen(e.real.x, "x")
                    , m = s.realToScreen(e.real.y, "y");
                    this.powerup.draw(g, m, i, t),
                    t.globalAlpha = 1
                }
            }
            drawPathToMouse(t) {
                var e = this.p1
                , i = this.p2
                , s = this.scene.screen
                , n = this.scene.camera.zoom
                , r = s.realToScreen(e.x, "x")
                , o = s.realToScreen(e.y, "y")
                , c = s.realToScreen(i.x, "x")
                , u = s.realToScreen(i.y, "y")
                , p = sqrt(pow(c - r, 2) + pow(u - o, 2));
                30 * n > p && (p = 30 * n),
                t.strokeStyle = "#dd45ec",
                t.lineWidth = max(1, 2 * n),
                t.beginPath(),
                t.moveTo(r, o),
                t.lineTo(c, u),
                t.stroke(),
                t.closePath()
            }
        }
        e.exports = TeleporterTool
    },
    47: function(t, e) {
        var Vector = t(8)
          , Path = t(64)
          , Tool = t(49);
        class SelectTool extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.selectedElements = [],
                this.selectedSectors = [],
                this.dashOffset = 0,
                this.defaults = document.onkeydown
            }
            toolInit = this.init;
            name = "Select";
            passive = !1;
            active = !1;
            p1 = null;
            p2 = null;
            selectedElements = [];
            selectedSectors = [];
            press() {
                var t = this.mouse.touch.real;
                this.passive = !1,
                this.active = !0,
                this.p1.x = t.x,
                this.p1.y = t.y,
                this.p2.x = t.x,
                this.p2.y = t.y
            }
            hold() {
                var t = this.mouse.touch.real;
                this.p2.x = t.x,
                this.p2.y = t.y
            }
            unselectElements() {
                this.selectedElements = [];
                this.selectedSectors = [];
                this.selectedSegments = [];
                document.onkeydown = this.defaults
            }
            moveSelected(a) {
                var selectedSegments = this.selectedSegments;
                this.selectedSegments = [];
                for(var i of selectedSegments) {
                    if(i.p1 || i.p2) {
                        switch(a) {
                            case "ArrowUp":
                                i.p1.y--;
                                i.p2.y--;
                                break;
                            case "ArrowDown":
                                i.p1.y++;
                                i.p2.y++;
                                break;
                            case "ArrowLeft":
                                i.p1.x--;
                                i.p2.x--;
                                break;
                            case "ArrowRight":
                                i.p1.x++;
                                i.p2.x++
                        }
                        i.name ? this.selectedSegments.push(this.scene.track.addPowerup(i)) : this.selectedSegments.push(this.scene.track.addPhysicsLine(i.p1.x, i.p1.y, i.p2.x, i.p2.y));
                        i.removeAllReferences();
                    } else {
                        switch(a) {
                            case "ArrowUp":
                                i.y--;
                                break;
                            case "ArrowDown":
                                i.y++;
                                break;
                            case "ArrowLeft":
                                i.x--;
                                break;
                            case "ArrowRight":
                                i.x++
                        }
                        this.selectedSegments.push(this.scene.track.addPowerup(i));
                    }
                    this.scene.track.undraw();
                    this.scene.track.draw();
                    this.scene.redraw()
                }
                return this.selectedSegments
            }
            fillSelected() {
                if(this.p1.x < this.p2.x && this.p1.y < this.p2.y){
                    for(let i = this.p1.y; i < this.p1.y + this.p2.y; i++) {
                        this.scene.track.addPhysicsLine(this.p1.x, i, this.p1.x + this.p2.x, i);
                    }
                } else {
                    for(let i = this.p2.y; i < this.p2.y + this.p1.y; i++) {
                        this.scene.track.addPhysicsLine(this.p2.x, i, this.p2.x + this.p1.x, i);
                    }
                }
                return this.selectedSegments
            }
            rotateSelected() {
                var selectedSegments = this.selectedSegments;
                this.selectedSegments = [];
                for(var i of selectedSegments) {
                    if(i.p1 || i.p2) {
                        i.p1.x++;
                        i.p2.x--
                        i.name ? this.selectedSegments.push(this.scene.track.addPowerup(i)) : this.selectedSegments.push(this.scene.track.addPhysicsLine(i.p1.x, i.p1.y, i.p2.x, i.p2.y));
                        i.removeAllReferences();
                    } else {
                        i.x--
                        this.selectedSegments.push(this.scene.track.addPowerup(i));
                    }
                    this.scene.track.undraw();
                    this.scene.track.draw();
                    this.scene.redraw()
                }
                return this.selectedSegments
            }
            release() {
                this.unselectElements();
                for (var t = (performance.now(),
                this.scene.track.select(this.p1, this.p2)), e = t.length, i = [], s = 0; e > s; s++) {
                    var n = t[s];
                    this.intersectsLine(n.x ? n : n.p1, n.x ? n : n.p2) && (this.selectedSegments.push(n),
                    i.push(n))
                }
                this.selectedElements = i,
                this.active = !1,
                this.passive = !0,
                document.onkeydown = e => {
                    e.preventDefault();
                    switch(e.key) {
                        case "Delete":
                            for(var i of this.selectedSegments) {
                                i.removeAllReferences()
                            }
                            this.reset();
                            break;
                        case "R":
                            this.rotateSelected();
                            break;
                        case "ArrowUp":
                        case "ArrowDown":
                        case "ArrowLeft":
                        case "ArrowRight":
                            this.moveSelected(e.key);
                            break;
                        case "`":
                            this.reset()
                    }
                }
            }
            buildPaths(t) {
                for (var e = []; t.length > 0; ) {
                    var i = new Path;
                    i.build(t),
                    e.push(i)
                }
            }
            intersectsLine(t, e) {
                var i = min(this.p1.y, this.p2.y)
                  , s = min(this.p1.x, this.p2.x)
                  , n = max(this.p1.y, this.p2.y)
                  , r = max(this.p1.x, this.p2.x)
                  , o = abs(r - s)
                  , c = abs(i - n)
                  , u = t.x
                  , p = e.x;
                if (t.x > e.x && (u = e.x,
                p = t.x),
                p > s + o && (p = s + o),
                s > u && (u = s),
                u > p)
                    return !1;
                var d = t.y
                  , f = e.y
                  , v = e.x - t.x;
                if (abs(v) > 1e-7) {
                    var g = (e.y - t.y) / v
                      , m = t.y - g * t.x;
                    d = g * u + m,
                    f = g * p + m
                }
                if (d > f) {
                    var y = f;
                    f = d,
                    d = y
                }
                return f > i + c && (f = i + c),
                i > d && (d = i),
                d > f ? !1 : !0
            }
            toScreen(t, e) {
                var i = this.scene.camera
                  , s = this.scene.screen;
                return (t - i.position[e]) * i.zoom + s.center[e]
            }
            draw() {
                var t = this.scene
                  , e = (t.game.canvas,
                t.game.canvas.getContext("2d"));
                if (this.active || this.passive) {
                    var i = this.p1.toScreen(this.scene)
                      , s = this.p2.toScreen(this.scene)
                      , n = s.x - i.x
                      , r = s.y - i.y;
                    e.save(),
                    this.active ? (e.beginPath(),
                    e.rect(i.x, i.y, n, r),
                    e.fillStyle = "rgba(24, 132, 207, 0.2)",
                    e.fill(),
                    e.lineWidth = 2,
                    e.strokeStyle = "rgba(24, 132, 207, 0.7)",
                    e.stroke()) : this.passive && (e.strokeStyle = "rgba(24, 132, 207, 0.7)",
                    e.lineWidth = 2,
                    e.strokeRect(i.x, i.y, n, r)),
                    e.restore()
                }
            }
            reset() {
                this.p1.x = 0,
                this.p1.y = 0,
                this.p2.x = 0,
                this.p2.y = 0,
                this.active = !1,
                this.passive = !1,
                document.onkeydown = this.defaults,
                this.unselectElements()
            }
            drawSectors() {
                for (var t = this.scene, e = t.camera, i = t.screen, s = t.game.canvas.getContext("2d"), n = e.zoom, r = e.position, o = t.screen.center, a = this.settings.drawSectorSize * n, h = r.x * n / a, l = r.y * n / a, c = i.width / a, u = i.height / a, p = u / 2, d = c / 2, f = h - d - 1, v = l - p - 1, g = h + d, m = l + p, y = this.totalSectors, w = y.length, x = 0; w > x; x++) {
                    var _ = y[x]
                      , b = _.row
                      , T = _.column;
                    if (T >= f && g >= T && b >= v && m >= b) {
                        _.drawn === !1 && _.image === !1 && _.draw();
                        var C = T * a - h * a + o.x
                          , k = b * a - l * a + o.y;
                        C = 0 | C,
                        k = 0 | k,
                        _.image ? s.drawImage(_.image, C, k) : s.drawImage(_.canvas, C, k)
                    } else
                        _.drawn && _.clear()
                }
            }
            close() {
                this.dashOffset = 0,
                this.selectedElements = [],
                this.mouse = null,
                this.camera = null,
                this.scene = null,
                this.toolHandler = null,
                this.p2 = null,
                this.p1 = null,
                this.active = !1,
                this.passive = !1
            }
        }
        e.exports = SelectTool
    },
    48: function(t, e) {
        var Vector = t(8)
          , Tool = t(49);
        class StraightLineTool extends Tool {
            constructor(t) {
                super();
                this.game = t.scene.game,
                this.toolInit(t),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.active = !1,
                this.shouldDrawMetadata = !1,
                this.options = {}
            }
            toolInit = this.init;
            toolUpdate = this.update;
            toolDraw = this.draw;
            name = "StraightLine";
            p1 = null;
            p2 = null;
            active = !1;
            reset() {
                this.active = !1
            }
            press() {
                if (!this.active) {
                    var t = this.mouse.touch.real;
                    this.p1.x = t.x,
                    this.p1.y = t.y,
                    this.active = !0
                }
            }
            getOptions() {
                var t = this.toolhandler
                    , e = this.options;
                return e.lineType = t.options.lineType,
                e.snap = t.options.snap,
                e
            }
            hold() {
                var t = this.mouse.touch.real;
                this.p2.x = t.x,
                this.p2.y = t.y,
                this.toolhandler.moveCameraTowardsMouse()
            }
            release() {
                var t = this.p1
                    , e = this.p2
                    , i = this.scene.track
                    , s = this.toolhandler
                    , n = !1;
                n = "physics" === s.options.lineType ? i.addPhysicsLine(t.x, t.y, e.x, e.y) : i.addSceneryLine(t.x, t.y, e.x, e.y),
                n && s.addActionToTimeline({
                    type: "add",
                    objects: [n]
                });
                var r = s.snapPoint;
                r.x = e.x,
                r.y = e.y,
                this.active = !1
            }
            update = () => {
                this.toolUpdate();
                var t = this.toolhandler
                    , e = t.gamepad;
                t.options.snap && (this.active = !0,
                this.p1 = t.snapPoint,
                this.hold()),
                this.shouldDrawMetadata = e.isButtonDown("ctrl") ? !0 : !1
            }
            draw() {
                var t = this.scene
                    , e = (t.game.canvas,
                t.game.canvas.getContext("2d"))
                    , i = t.camera
                    , s = i.zoom;
                e.save(),
                this.drawCursor(e),
                this.active && (this.drawLine(e, s),
                this.drawPoint(e, this.p1, s),
                this.drawPoint(e, this.p2, s),
                this.drawPointData(e, this.p2, s)),
                e.restore()
            }
            drawCursor(t) {
                var e = this.mouse.touch
                    , i = e.real.toScreen(this.scene)
                    , s = this.camera.zoom
                    , n = this.toolhandler
                    , r = n.options.grid
                    , o = "#1884cf";
                if (r) {
                    var a = 5 * s;
                    t.beginPath(),
                    t.moveTo(i.x, i.y - a),
                    t.lineTo(i.x, i.y + a),
                    t.moveTo(i.x - a, i.y),
                    t.lineTo(i.x + a, i.y),
                    t.lineWidth = 1 * s,
                    t.closePath(),
                    t.stroke()
                } else
                    t.lineWidth = 1,
                    t.fillStyle = o,
                    t.beginPath(),
                    t.arc(i.x, i.y, 1 * s, 0, 2 * PI, !1),
                    t.closePath(),
                    t.fill()
            }
            drawPoint(t, e, i) {
                var s = e.toScreen(this.scene);
                t.beginPath(),
                t.arc(s.x, s.y, 1 * i, 0, 2 * PI, !1),
                t.lineWidth = 1,
                t.fillStyle = "#1884cf",
                t.fill()
            }
            drawPointData(t, e) {
                var i = e.toScreen(this.scene);
                if (this.shouldDrawMetadata) {
                    var s = this.p1.getAngleInDegrees(this.p2);
                    s = s.toFixed(2);
                    var n = this.game.pixelRatio;
                    t.fillStyle = "#000000",
                    t.font = 8 * n + "pt arial",
                    t.fillText("" + s + "°", i.x + 10, i.y + 10),
                    t.strokeText("" + s + "°", i.x + 10, i.y + 10)
                }
            }
            drawLine(t, e) {
                var i = this.scene
                    , s = (i.game.canvas,
                2 * e > .5 ? 2 * e : .5)
                    , n = this.toolhandler
                    , r = n.options.lineType
                    , o = "physics" === r ? window.lite.getVar("dark") ? "#fafafa" : "#000" : window.lite.getVar("dark") ? "#666" : "#AAA";
                t.beginPath(),
                t.lineWidth = s,
                t.lineCap = "round",
                t.strokeStyle = o;
                var a = this.p1.toScreen(this.scene)
                    , h = this.p2.toScreen(this.scene);
                t.moveTo(a.x, a.y),
                t.lineTo(h.x, h.y),
                t.stroke()
            }
        }
        e.exports = StraightLineTool
    },
    49: function(t, e) {
        class Tool {
            name = "";
            toolhandler = null;
            camera = null;
            mouse = null;
            scene = null;
            init(a) {
                this.toolhandler = a,
                this.scene = a.scene,
                this.game = a.scene.game,
                this.camera = a.scene.camera,
                this.mouse = a.scene.mouse,
                this.gamepad = a.gamepad
            }
            press() {}
            hold() {}
            release() {}
            update() {
                var t = this.mouse
                  , e = t.touch
                  , i = t.secondaryTouch
                  , s = this.toolhandler.gamepad
                  , n = this.toolhandler.options
                  , r = s.isButtonDown("shift");
                n.rightClickMove && (r = i.old.down),
                r ? (e.old.down || n.rightClickMove) && this.moveCamera() : (e.press && this.press(),
                e.old.down && this.hold(),
                e.release && this.release()),
                t.mousewheel !== !1 && s.isButtonDown("shift") === !1 && this.mousewheel(t.mousewheel)
            }
            moveCamera() {
                var t = this.mouse.secondaryTouch
                  , e = t.pos
                  , i = this.camera
                  , s = t.old.pos.sub(e).factor(1 / i.zoom);
                i.position.inc(s)
            }
            draw() {}
            reset() {}
            mousewheel(t) {
                var e = this.scene.settings
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
            checkKeys() {
                var t = this.gamepad
                  , e = this.name.toLowerCase()
                  , i = this.toolhandler;
                t.isButtonDown(e) && (i.setTool(e),
                t.setButtonUp(e))
            }
            getOptions() {
                return {}
            }
            close() {}
        }
        e.exports = Tool
    },
    50: function(t, e) {
        var Vector = t(8)
          , PhysicsLine = t(11)
          , SceneryLine = t(21)
          , Target = t(19)
          , a = 50;
        class ToolHandler {
            constructor(a) {
                this.currentTool = "",
                this.scene = a,
                this.camera = a.camera,
                this.mouse = a.mouse,
                this.mouse.updateCallback = this.draw.bind(this),
                this.gamepad = a.playerManager.firstPlayer.getGamepad(),
                this.tools = {},
                this.options = a.settings.toolHandler,
                this.snapPoint = new Vector,
                this.snapPoint.equ(this.scene.track.defaultLine.p2),
                this.gridCache = !1,
                this.initAnalytics(),
                this.actionTimeline = [],
                this.actionTimelinePointer = 0
            }
            currentTool = "";
            scene = null;
            camera = null;
            mouse = null;
            tools = {};
            gamepad = null;
            gridCache = !1;
            gridCacheAlpha = 1;
            gridUseEnabled = !1;
            snapPoint = !1;
            options = null;
            initAnalytics() {
                this.analytics = {
                    actions: 0
                }
            }
            enableGridUse() {
                this.gridUseEnabled = !0
            }
            getToolOptions() {
                return this.tools[this.currentTool].getOptions()
            }
            setToolOption(t, e, i) {
                "undefined" != typeof i && "undefined" != typeof this.tools[i] ? this.tools[i].setOption(t, e) : this.tools[this.currentTool].setOption(t, e),
                this.scene.stateChanged()
            }
            registerTool(t) {
                var t = new t(this)
                  , e = t.name.toLowerCase();
                this.tools[e] = t
            }
            setTool(t) {
                {
                    var t = t.toLowerCase();
                    this.scene
                }
                this.currentTool !== t && (this.resetTool(),
                this.currentTool = t,
                this.scene.stateChanged(),
                this.analytics.actions++)
            }
            addActionToTimeline(t) {
                this.actionTimeline.length >= a && (this.actionTimeline.splice(0, this.actionTimeline.length - a),
                this.actionTimelinePointer = a),
                this.actionTimeline.splice(this.actionTimelinePointer),
                this.actionTimeline.push(t),
                this.actionTimelinePointer++
            }
            revertAction() {
                var t = this.actionTimelinePointer;
                if (t > 0) {
                    var e = this.actionTimeline[t - 1];
                    switch (t--,
                    e.type) {
                    case "add":
                        this.removeObjects(e.objects);
                        break;
                    case "remove":
                        this.addObjects(e.objects)
                    }
                    this.actionTimelinePointer = t
                }
            }
            applyAction() {
                var t = this.actionTimeline
                  , e = this.actionTimelinePointer;
                if (e < t.length) {
                    var i = this.actionTimeline[e];
                    switch (e++,
                    i.type) {
                    case "add":
                        this.addObjects(i.objects);
                        break;
                    case "remove":
                        this.removeObjects(i.objects)
                    }
                    this.actionTimelinePointer = e
                }
            }
            removeObjects(t) {
                for (var e = t.length, i = 0; e > i; i++) {
                    var s = t[i];
                    s.remove = !0,
                    s.removeAllReferences()
                }
                this.scene.track.cleanTrack()
            }
            addObjects(t) {
                for (var e = t.length, i = this.scene.track, s = 0; e > s; s++) {
                    var a = t[s];
                    a instanceof PhysicsLine ? (a.remove = !1,
                    i.addPhysicsLineToTrack(a)) : a instanceof SceneryLine ? (a.remove = !1,
                    i.addSceneryLineToTrack(a)) : a instanceof Target ? (a.remove = !1,
                    i.addTarget(a),
                    i.addPowerup(a)) : (a.remove = !1,
                    i.addPowerup(a))
                }
            }
            resetTool() {
                "" !== this.currentTool && this.tools[this.currentTool].reset()
            }
            update() {
                this.checkGrid(),
                this.mouse.enabled && this.tools[this.currentTool].update(),
                this.checkHotkeys(),
                this.checkMouse(),
                this.checkSnap()
            }
            checkGrid() {
                var t = this.scene.camera;
                t.zoom !== t.desiredZoom && (this.gridCache = !1)
            }
            checkSnap() {
                this.options.snapLocked && (this.options.snap = !0)
            }
            moveCameraTowardsMouse() {
                if (this.options.cameraLocked === !1) {
                    var t = this.scene.screen
                      , e = 100
                      , i = t.height - e
                      , s = 0 + e
                      , n = t.width - e
                      , r = 0 + e
                      , o = this.options.cameraMoveSpeed
                      , a = t.center
                      , h = this.camera
                      , l = this.mouse.touch
                      , c = l.pos.x
                      , u = l.pos.y
                      , p = .8 * (c - a.x)
                      , d = u - a.y;
                    (c >= n || r >= c || u >= i || s >= u) && (h.position.x += p * o * (1 / h.zoom),
                    h.position.y += d * o * (1 / h.zoom))
                }
            }
            checkMouse() {
                var t = this.mouse.touch
                  , e = this.mouse.secondaryTouch;
                (t.press || e.press) && this.press()
            }
            press() {
                this.camera.unfocus()
            }
            checkHotkeys() {
                var t = this.gamepad
                  , e = this.options.snap
                  , i = this.options.snapLocked
                  , s = this.options.rightClickMove
                  , n = t.isButtonDown("alt");
                s && (n = t.isButtonDown("shift")),
                n && !e ? this.toggleQuickSnap() : n || !e || i || this.toggleQuickSnap(),
                t.isButtonDown("ctrl") && t.isButtonDown("z") && (t.setButtonUp("z"),
                this.revertAction()),
                t.isButtonDown("ctrl") && t.isButtonDown("y") && (t.setButtonUp("y"),
                this.applyAction());
                var r = this.tools;
                for (var o in r) {
                    var a = r[o];
                    a.checkKeys()
                }
                this.gridUseEnabled && t.isButtonDown("grid") && (t.setButtonUp("grid"),
                this.toggleGrid()),
                t.isButtonDown("zoom_increase") && (t.setButtonUp("zoom_increase"),
                this.scene.camera.increaseZoom()),
                t.isButtonDown("zoom_decrease") && (t.setButtonUp("zoom_decrease"),
                this.scene.camera.decreaseZoom()),
                t.isButtonDown("zoom_100") && (t.setButtonUp("zoom_100"),
                this.scene.camera.resetZoom()),
                t.isButtonDown("lineType") && (t.setButtonUp("lineType"),
                this.toggleLineType())
            }
            toggleLineType() {
                var t = this.options.lineType;
                this.options.lineType = "physics" === t ? "scenery" : "physics",
                this.scene.stateChanged()
            }
            toggleGrid() {
                this.options.grid = this.scene.state.grid = !this.options.grid,
                this.scene.stateChanged()
            }
            toggleSnap() {
                this.options.snap = !this.options.snap,
                this.options.snapLocked = !this.options.snapLocked,
                this.resetTool(),
                this.scene.stateChanged()
            }
            toggleQuickSnap() {
                this.options.snapLocked || (this.options.snap = !this.options.snap,
                this.resetTool(),
                this.scene.stateChanged())
            }
            toggleCameraLock() {
                this.options.cameraLocked = !this.options.cameraLocked,
                this.scene.stateChanged()
            }
            draw() {
                this.scene.game.pixelRatio,
                this.scene.game.canvas.getContext("2d");
                this.mouse.enabled && this.tools[this.currentTool].draw()
            }
            drawGrid() {
                var t = this.scene.game.pixelRatio
                  , e = this.scene.game.canvas.getContext("2d");
                this.options.grid === !0 && this.options.visibleGrid && (window.lite.getVar("isometric") && this.drawCachedIsometricGrid(e, t) || this.drawCachedGrid(e, t))
            }
            drawCachedGrid(t, e) {
                this.gridCache === !1 && this.cacheGrid(e);
                var i = this.gridCache
                  , s = i.width
                  , n = i.height
                  , r = this.scene.screen
                  , o = r.center
                  , a = (o.x / s | 0) + 2
                  , h = (o.y / n | 0) + 2
                  , l = this.camera.zoom
                  , c = this.camera.position.x * l % s
                  , u = this.camera.position.y * l % n;
                t.globalAlpha = this.gridCacheAlpha;
                for (var p = -a; a > p; p++)
                    for (var d = -h; h > d; d++) {
                        var f = p * s - c + o.x
                          , v = d * n - u + o.y;
                        t.drawImage(i, 0, 0, n, s, f, v, s, n)
                    }
                t.globalAlpha = 1
            }
            drawCachedIsometricGrid(t, e) {
                this.gridCache === !1 && this.cacheIsometricGrid(e);
                var i = this.gridCache
                  , s = i.width
                  , n = i.height
                  , r = this.scene.screen
                  , o = r.center
                  , a = (o.x / s | 0) + 2
                  , h = (o.y / n | 0) + 2
                  , l = this.camera.zoom
                  , c = this.camera.position.x * l % s
                  , u = this.camera.position.y * l % n;
                t.globalAlpha = this.gridCacheAlpha;
                for (var p = -a; a > p; p++)
                    for (var d = -h; h > d; d++) {
                        var f = p * s - c + o.x
                          , v = d * n - u + o.y;
                        t.drawImage(i, 0, 0, n, s, f, v, s, n)
                    }
                t.globalAlpha = 1
            }
            cacheGrid() {
                var t = this.scene.camera.zoom
                  , e = 200 * t
                  , i = 200 * t
                  , n = this.options.gridSize
                  , r = n * t
                  , o = document.createElement("canvas");
                o.width = e,
                o.height = i;
                var a = o.getContext("2d");
                a.strokeStyle = window.lite.getVar("dark") ? "#252525" : this.options.gridMinorLineColor,
                a.strokeWidth = 1,
                a.beginPath();
                var h = null
                  , l = null
                  , c = null
                  , u = null;
                for (h = floor(e / r),
                l = 0; h >= l; l++)
                    c = l * r,
                    a.moveTo(c, 0),
                    a.lineTo(c, i),
                    a.stroke();
                for (h = floor(i / r),
                l = 0; h >= l; l++)
                    u = l * r,
                    a.moveTo(0, u),
                    a.lineTo(e, u),
                    a.stroke();
                a.beginPath(),
                a.rect(0, 0, e, i),
                a.lineWidth = 2,
                a.strokeStyle = window.lite.getVar("dark") ? "#3e3e3e" : this.options.gridMajorLineColor,
                a.stroke(),
                a.closePath(),
                this.gridCache = o,
                this.gridCacheAlpha = min(t + .2, 1)
            }
            cacheIsometricGrid() {
                var t = this.scene.camera.zoom
                  , e = 200 * t
                  , i = 200 * t
                  , n = this.options.gridSize
                  , r = n * t
                  , o = document.createElement("canvas");
                o.width = e,
                o.height = i;
                var a = o.getContext("2d");
                a.strokeStyle = window.lite.getVar("dark") ? "#252525" : this.options.gridMinorLineColor,
                a.strokeWidth = 1,
                a.beginPath();
                var h = null
                  , l = null
                  , c = null
                  , u = null;
                for (h = floor(e / r),
                l = 0; h >= l; l+=1.5)
                    c = l * r,
                    a.moveTo(c, 0),
                    a.lineTo(c, i),
                    a.stroke();
                for (h = floor(i / r),
                l = 0; h >= l; l++)
                    u = l * r,
                    a.moveTo(0, u),
                    a.lineTo(e, u),
                    a.stroke();
                a.beginPath(),
                a.rect(0, 0, e, i),
                a.lineWidth = 2,
                a.strokeStyle = window.lite.getVar("dark") ? "#3e3e3e" : this.options.gridMajorLineColor,
                a.stroke(),
                a.closePath(),
                this.gridCache = o,
                this.gridCacheAlpha = min(t + .2, 1)
            }
            resize() {
                var t = this.scene.game.pixelRatio;
                this.cacheGrid(t)
            }
            undo() {}
            redo() {}
            close() {
                this.actionTimeline = [],
                this.actionTimelinePointer = 0,
                this.tools = null,
                this.mouse = null,
                this.scene = null,
                this.camera = null,
                this.options.grid = !1,
                this.options = null,
                this.gridCache = null
            }
        }
        e.exports = ToolHandler
    },
    51: function(t, e) {
        var Tool = t(49)
          , HeliTool = t(54)
          , TruckTool = t(55)
          , BalloonTool = t(52)
          , BlobTool = t(53);
        class VehiclePowerupTool extends Tool {
            constructor(a) {
                super();
                this.toolInit(a),
                this.powerupTools = {},
                this.options = a.scene.settings.vehiclePowerup,
                this.registerPowerupTools()
            }
            toolInit = this.init;
            toolUpdate = this.update;
            name = "vehiclepowerup";
            powerupTools = null;
            registerPowerupTools() {
                this.registerTool(new HeliTool(this,this.toolhandler)),
                this.registerTool(new TruckTool(this,this.toolhandler)),
                this.registerTool(new BalloonTool(this,this.toolhandler)),
                this.registerTool(new BlobTool(this,this.toolhandler))
            }
            registerTool(t) {
                this.powerupTools[t.name] = t
            }
            setOption(t, e) {
                this.options[t] = e
            }
            getOptions() {
                return this.options
            }
            update = () => {
                this.toolhandler.gamepad,
                this.mouse,
                this.options;
                this.toolUpdate()
            }
            press = function() {
                var t = this.options.selected;
                this.powerupTools[t].press()
            }
            hold = function() {
                var t = this.options.selected;
                this.powerupTools[t].hold()
            }
            release = function() {
                var t = this.options.selected;
                this.powerupTools[t].release()
            }
            draw = function() {
                var t = this.scene
                , e = t.game.canvas.getContext("2d")
                , i = this.options;
                this.powerupTools[i.selected].draw(e)
            }
        }
        e.exports = VehiclePowerupTool
    },
    52: function(t, e) {
        var Vector = t(8)
          , Tool = t(49)
          , BalloonPowerup = t(30);
        class BalloonTool extends Tool {
            constructor(a, b) {
                super();
                this.toolInit(b),
                this.powerup = new BalloonPowerup(0,0,0,b.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.options = a.options,
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "balloon";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                , i = e.pos
                , s = this.camera.zoom
                , n = this.scene.settings.device;
                if (("desktop" === n || this.active) && (t.globalAlpha = .8,
                this.powerup.draw(i.x, i.y, s, t),
                t.globalAlpha = 1),
                this.active === !0) {
                    var r = this.scene.screen
                    , o = r.realToScreen(this.p1.x, "x")
                    , a = r.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(o, a, s, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                , e = new BalloonPowerup(this.p1.x,this.p1.y,this.options.time,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
        e.exports = BalloonTool
    },
    53: function(t, e) {
        var Vector = t(8)
          , Tool = t(49)
          , BlobPowerup = t(31);
        class BlobTool extends Tool {
            constructor(a, b) {
                super();
                this.toolInit(b),
                this.powerup = new BlobPowerup(0,0,0,b.scene.track),
                this.p1 = new Vector(0,0),
                this.options = a.options,
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "blob";
            p1 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                , i = e.pos
                , s = this.camera.zoom
                , n = this.scene.settings.device;
                if (("desktop" === n || this.active) && (t.globalAlpha = .8,
                this.powerup.draw(i.x, i.y, s, t),
                t.globalAlpha = 1),
                this.active === !0) {
                    var r = this.scene.screen
                    , o = r.realToScreen(this.p1.x, "x")
                    , a = r.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(o, a, s, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.active = !0
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                , e = new BlobPowerup(this.p1.x,this.p1.y,this.options.time,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
        e.exports = BlobTool
    },
    54: function(t, e) {
        var Vector = t(8)
          , Tool = t(49)
          , HeliPowerup = t(32);
        class HeliTool extends Tool {
            constructor(a, b) {
                super();
                this.toolInit(b),
                this.powerup = new HeliPowerup(0,0,0,b.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.options = a.options,
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "helicopter";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                , i = e.pos
                , s = this.camera.zoom
                , n = this.scene.settings.device;
                if (("desktop" === n || this.active) && (t.globalAlpha = .8,
                this.powerup.draw(i.x, i.y, s, t),
                t.globalAlpha = 1),
                this.active === !0) {
                    var r = this.scene.screen
                    , o = r.realToScreen(this.p1.x, "x")
                    , a = r.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(o, a, s, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                , e = new HeliPowerup(this.p1.x,this.p1.y,this.options.time,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
        e.exports = HeliTool
    },
    55: function(t, e) {
        var Vector = t(8)
          , Tool = t(49)
          , TruckPowerup = t(33);
        class TruckTool extends Tool {
            constructor(a, b) {
                super();
                this.toolInit(b),
                this.powerup = new TruckPowerup(0,0,0,b.scene.track),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0),
                this.options = a.options,
                this.active = !1
            }
            toolInit = this.init;
            toolUpdate = this.update;
            powerup = null;
            name = "truck";
            p1 = null;
            p2 = null;
            active = !1;
            draw(t) {
                var e = this.mouse.touch
                , i = e.pos
                , s = this.camera.zoom
                , n = this.scene.settings.device;
                if (("desktop" === n || this.active) && (t.globalAlpha = .8,
                this.powerup.draw(i.x, i.y, s, t),
                t.globalAlpha = 1),
                this.active === !0) {
                    var r = this.scene.screen
                    , o = r.realToScreen(this.p1.x, "x")
                    , a = r.realToScreen(this.p1.y, "y");
                    t.globalAlpha = .4,
                    this.powerup.draw(o, a, s, t),
                    t.globalAlpha = 1
                }
            }
            press() {
                var t = this.mouse.touch
                , e = t.real;
                this.p1.x = e.x,
                this.p1.y = e.y,
                this.p2.x = e.x,
                this.p2.y = e.y,
                this.active = !0
            }
            hold() {
                var t = this.mouse.touch
                , e = t.real;
                this.p2.x = e.x,
                this.p2.y = e.y
            }
            release() {
                var t = (this.scene.screen,
                this.scene.track)
                , e = new TruckPowerup(this.p1.x,this.p1.y,this.options.time,t);
                t.addPowerup(e),
                this.active = !1,
                this.toolhandler.addActionToTimeline({
                    type: "add",
                    objects: [e]
                })
            }
        }
        e.exports = TruckTool
    },
    56: function(t, e) {
        var Vector = t(8)
          , PhysicsLine = t(11)
          , SceneryLine = t(21)
          , Sector = t(22)
          , Bomb = t(14)
          , Gravity = t(17)
          , Booster = t(15)
          , Checkpoint = t(16)
          , Target = t(19)
          , Slowmo = t(18)
          , Antigravity = t(13)
          , Teleporter = t(20)
          , HeliPowerup = t(32)
          , TruckPowerup = t(33)
          , BalloonPowerup = t(30)
          , BlobPowerup = t(31)
          , CanvasPool = t(58)
          , M = {
            LINE: 1,
            POWERUPS: 2
        }
          , PowerupsCache = [];
        class Track {
            constructor(t) {
                this.scene = t,
                this.game = t.game,
                this.settings = t.game.settings,
                this.camera = t.camera,
                this.sectors = {},
                this.sectors.drawSectors = [],
                this.sectors.physicsSectors = [],
                this.totalSectors = [],
                this.powerups = [],
                this.powerupsLookupTable = {},
                this.physicsLines = [],
                this.sceneryLines = [],
                this.targets = [],
                this.allowedVehicles = ["MTB", "BMX"],
                this.canvasPool = new CanvasPool(t),
                this.createPowerupCache()
            }
            defaultLine = {
                p1: new Vector(-40,50),
                p2: new Vector(40,50)
            }
            game = null;
            scene = null;
            camera = null;
            canvas = null;
            canvasPool = null;
            settings = null;
            physicsLines = null;
            sceneryLines = null;
            powerups = null;
            targets = null;
            targetCount = 0;
            sectors = null;
            totalSectors = null;
            allowedVehicles = null;
            dirty = !1;
            createPowerupCache() {
                PowerupsCache.push(new Booster(0,0,0,this)),
                PowerupsCache.push(new Slowmo(0,0,this)),
                PowerupsCache.push(new Bomb(0,0,this)),
                PowerupsCache.push(new Gravity(0,0,0,this)),
                PowerupsCache.push(new Checkpoint(0,0,this)),
                PowerupsCache.push(new Target(0,0,this)),
                PowerupsCache.push(new Antigravity(0,0,this)),
                PowerupsCache.push(new Teleporter(0,0,this)),
                PowerupsCache.push(new HeliPowerup(0,0,0,this)),
                PowerupsCache.push(new TruckPowerup(0,0,0,this)),
                PowerupsCache.push(new BalloonPowerup(0,0,0,this)),
                PowerupsCache.push(new BlobPowerup(0,0,0,this))
            }
            recachePowerups(a) {
                for (var e in PowerupsCache)
                    PowerupsCache[e].recache(a)
            }
            read(a) {
                var e = a.split("#")
                  , i = e[0].split(",")
                  , s = []
                  , n = [];
                if (e.length > 2)
                    var s = e[1].split(",")
                      , n = e[2].split(",");
                else if (e.length > 1)
                    var n = e[1].split(",");
                this.addLines(i, this.addPhysicsLine),
                this.addLines(s, this.addSceneryLine),
                this.addPowerups(n)
            }
            addPowerups(tt) {
                for (var e = tt.length, i = [], s = ((new Date).getTime(),
                0); e > s; s++)
                    if (i = tt[s].split(" "),
                    i.length >= 2) {
                        for (var n = [], r = i.length, o = 1; r > o; o++) {
                            var a = parseInt(i[o], 32);
                            n.push(a)
                        }
                        var h = round(n[0])
                          , l = round(n[1])
                          , p = null;
                        switch (i[0]) {
                        case "B":
                            p = new Booster(h,l,n[2],this),
                            this.addPowerup(p);
                            break;
                        case "S":
                            p = new Slowmo(h,l,this),
                            this.addPowerup(p);
                            break;
                        case "O":
                            p = new Bomb(h,l,this),
                            this.addPowerup(p);
                            break;
                        case "G":
                            p = new Gravity(h,l,n[2],this),
                            this.addPowerup(p);
                            break;
                        case "C":
                            p = new Checkpoint(h,l,this),
                            this.addPowerup(p);
                            break;
                        case "T":
                            p = new Target(h,l,this),
                            this.addTarget(p),
                            this.addPowerup(p);
                            break;
                        case "A":
                            p = new Antigravity(h,l,this),
                            this.addPowerup(p);
                            break;
                        case "V":
                            var d = n[2]
                              , P = n[3]
                              , M = this.settings.vehiclePowerup.minTime
                              , A = this.settings.vehiclePowerup.maxTime;
                            P = P || M,
                            P = min(P, A),
                            P = max(P, M);
                            var p;
                            switch (d) {
                                case 1:
                                    p = new HeliPowerup(h,l,P,this);
                                    break;
                                case 2:
                                    p = new TruckPowerup(h,l,P,this);
                                    break;
                                case 3:
                                    p = new BalloonPowerup(h,l,P,this);
                                    break;
                                case 4:
                                    p = new BlobPowerup(h,l,P,this);
                                    break;
                                default:
                                    continue
                            }
                            this.addPowerup(p);
                            break;
                        case "W":
                            var D = n[0]
                              , I = n[1]
                              , E = n[2]
                              , O = n[3]
                              , z = new Teleporter(D,I,this)
                              , j = new Teleporter(E,O,this);
                            z.addOtherPortalRef(j),
                            j.addOtherPortalRef(z),
                            this.addPowerup(z),
                            this.addPowerup(j)
                        }
                    }
            }
            addTarget(t) {
                this.dirty = !0,
                this.targetCount++,
                this.targets.push(t)
            }
            addPowerup(t) {
                var e = this.sectors.drawSectors
                  , i = this.sectors.physicsSectors
                  , s = t.x
                  , n = t.y
                  , r = this.settings.drawSectorSize
                  , o = this.settings.physicsSectorSize;
                this.addRef(s, n, t, M.POWERUPS, i, o);
                var a = this.addRef(s, n, t, M.POWERUPS, e, r);
                return a !== !1 && this.totalSectors.push(a),
                null !== t && (this.powerups.push(t),
                t.id && (this.powerupsLookupTable[t.id] = t)),
                t
            }
            addLines(t, e) {
                for (var i = t.length, s = 0; i > s; s++) {
                    var n = t[s].split(" ")
                      , r = n.length;
                    if (r > 3)
                        for (var o = 0; r - 2 > o; o += 2) {
                            var a = parseInt(n[o], 32)
                              , h = parseInt(n[o + 1], 32)
                              , l = parseInt(n[o + 2], 32)
                              , c = parseInt(n[o + 3], 32)
                              , u = a + h + l + c;
                            isNaN(u) || e.call(this, a, h, l, c)
                        }
                }
            }
            addPhysicsLine(t, e, i, s) {
                var t = round(t)
                  , e = round(e)
                  , i = round(i)
                  , s = round(s)
                  , r = i - t
                  , o = s - e
                  , a = sqrt(pow(r, 2) + pow(o, 2));
                if (a >= 2) {
                    var h = new PhysicsLine(t,e,i,s);
                    this.addPhysicsLineToTrack(h)
                }
                return h
            }
            addPhysicsLineToTrack(t) {
                for (var e = this.settings.drawSectorSize, i = t.p1, s = t.p2, n = i.x, r = i.y, a = s.x, h = s.y, l = bresenham(n, r, a, h, e), c = this.sectors.drawSectors, u = l.length, p = 0; u > p; p += 2) {
                    var d = l[p]
                      , f = l[p + 1]
                      , v = this.addRef(d, f, t, M.LINE, c, e);
                    v !== !1 && this.totalSectors.push(v)
                }
                for (var g = this.settings.physicsSectorSize, m = bresenham(n, r, a, h, g), y = this.sectors.physicsSectors, w = m.length, p = 0; w > p; p += 2) {
                    var d = m[p]
                      , f = m[p + 1];
                    this.addRef(d, f, t, M.LINE, y, g)
                }
                return this.physicsLines.push(t),
                t
            }
            addSceneryLine(t, e, i, s) {
                var t = round(t)
                  , e = round(e)
                  , i = round(i)
                  , s = round(s)
                  , n = i - t
                  , o = s - e
                  , a = sqrt(pow(n, 2) + pow(o, 2));
                if (a >= 2) {
                    var h = new SceneryLine(t,e,i,s);
                    this.addSceneryLineToTrack(h)
                }
                return h
            }
            addSceneryLineToTrack(t) {
                for (var e = this.settings.drawSectorSize, i = t.p1, s = t.p2, n = i.x, r = i.y, a = s.x, h = s.y, l = bresenham(n, r, a, h, e), c = this.sectors.drawSectors, u = l.length, p = 0; u > p; p += 2) {
                    var d = l[p]
                      , f = l[p + 1]
                      , v = this.addRef(d, f, t, M.LINE, c, e);
                    v !== !1 && this.totalSectors.push(v)
                }
                return this.sceneryLines.push(t),
                t
            }
            addRef(t, e, i, s, n, r) {
                var o = floor(t / r)
                  , h = floor(e / r)
                  , c = !1;
                if (void 0 === n[o] && (n[o] = []),
                void 0 === n[o][h]) {
                    var u = new Sector(o,h,this);
                    n[o][h] = u,
                    c = u
                }
                switch (s) {
                    case M.LINE:
                        n[o][h].addLine(i),
                        i.addSectorReference(n[o][h]);
                        break;
                    case M.POWERUPS:
                        n[o][h].addPowerup(i),
                        i.addSectorReference(n[o][h])
                }
                return this.dirty = !0,
                c
            }
            cleanTrack() {
                this.cleanLines(),
                this.cleanPowerups()
            }
            cleanLines() {
                for (var t = this.physicsLines, e = this.sceneryLines, i = t.length, s = e.length, n = i - 1; n >= 0; n--)
                    t[n].remove && t.splice(n, 1);
                for (var r = s - 1; r >= 0; r--)
                    e[r].remove && e.splice(r, 1)
            }
            cleanPowerups() {
                for (var t = this.powerups, e = this.targets, i = this.targets.length, s = t.length, n = (this.powerupsLookupTable,
                s - 1); n >= 0; n--)
                    t[n].remove && t.splice(n, 1);
                for (var r = i - 1; r >= 0; r--)
                    e[r].remove && e.splice(r, 1);
                this.targetCount = e.length
            }
            updatePowerupState(t) {
                var e = t._powerupsConsumed;
                this.resetPowerups();
                var i = e.targets
                  , s = e.checkpoints
                  , n = e.misc;
                this.setPowerupStates(i),
                this.setPowerupStates(s),
                this.setPowerupStates(n)
            }
            setPowerupStates(t) {
                var e = this.powerupsLookupTable;
                for (var i in t) {
                    var s = t[i]
                      , n = e[s];
                    n.remove && n.id && (delete e[s],
                    delete t[s]),
                    n.hit = !0,
                    n.sector.powerupCanvasDrawn = !1
                }
            }
            select(a, b) {
                var segments = [];
                if(a.x < b.x && a.y < b.y){
                    for(var i of [...this.physicsLines, ...this.sceneryLines, ...this.powerups]){
                        if(i.p1 || i.p2) {
                            if(i.p1.x >= a.x && i.p1.y >= a.y || i.p2.x >= a.x && i.p2.y >= a.y && i.p1.x <= b.x && i.p1.y <= b.y ||
                            i.p2.x <= b.x && i.p2.y <= b.y) {
                                segments.push(i);
                            }
                        } else {
                            if(i.x >= a.x && i.y >= a.y && i.x <= b.x && i.y <= b.y) {
                                segments.push(i);
                            }
                        }
                    }
                } else {
                    for(var i of [...this.physicsLines, ...this.sceneryLines, ...this.powerups]){
                        if(i.p1 || i.p2) {
                            if(i.p1.x <= a.x && i.p1.y <= a.y || i.p2.x <= a.x && i.p2.y <= a.y && i.p1.x >= b.x && i.p1.y >= b.y ||
                            i.p2.x >= b.x && i.p2.y >= b.y) {
                                segments.push(i);
                            }
                        } else {
                            if(i.x <= a.x && i.y <= a.y && i.x >= b.x && i.y >= b.y) {
                                segments.push(i);
                            }
                        }
                    }
                }
                return segments
            }
            getCode() {
                this.cleanTrack();
                var t = this.powerups
                  , e = this.physicsLines
                  , i = this.sceneryLines
                  , s = ""
                  , n = e.length
                  , r = i.length
                  , o = t.length;
                if (n > 0) {
                    for (var a in e) {
                        var h = e[a];
                        h.recorded || (s += h.p1.x.toString(32) + " " + h.p1.y.toString(32) + h.getCode(this) + ",")
                    }
                    s = s.slice(0, -1);
                    for (var a in e)
                        e[a].recorded = !1
                }
                if (s += "#",
                r > 0) {
                    for (var l in i) {
                        var h = i[l];
                        h.recorded || (s += h.p1.x.toString(32) + " " + h.p1.y.toString(32) + h.getCode(this) + ",")
                    }
                    s = s.slice(0, -1);
                    for (var l in i)
                        i[l].recorded = !1
                }
                if (s += "#",
                o > 0) {
                    for (var c in t) {
                        var u = t[c]
                          , p = u.getCode();
                        p && (s += p + ",")
                    }
                    s = s.slice(0, -1)
                }
                return s
            }
            resetPowerups() {
                var t = this.powerups;
                for (var e in t) {
                    var i = t[e];
                    i.hit && !i.remove && (i.hit = !1,
                    i.sector.powerupCanvasDrawn = !1)
                }
            }
            addDefaultLine() {
                var t = this.defaultLine
                  , e = t.p1
                  , i = t.p2;
                this.addPhysicsLine(e.x, e.y, i.x, i.y)
            }
            erase(t, e, i) {
                this.dirty = !0;
                for (var s = t.x - e, n = t.y - e, r = t.x + e, o = t.y + e, a = max(s, r), p = min(s, r), d = max(n, o), f = min(n, o), v = this.settings.drawSectorSize, g = floor(a / v), m = floor(p / v), y = floor(d / v), w = floor(f / v), x = this.sectors.drawSectors, _ = [], b = m; g >= b; b++)
                    for (var T = w; y >= T; T++)
                        x[b] && x[b][T] && _.push(x[b][T].erase(t, e, i));
                var t = [];
                for(var e in _) {
                    for(var i in _[e]) {
                        t.push(_[e][i])
                    }
                }
                return t
            }
            drawAndCache() {
                for (var t = performance.now(), e = this.totalSectors, i = e.length, s = 0; i > s; s++) {
                    var n = e[s];
                    !function(t) {
                        setTimeout(function() {
                            t.draw(),
                            t.cacheAsImage()
                        }, 250 * s)
                    }(n)
                }
                var r = performance.now();
                console.log("Track :: Time to draw entire track : " + (r - t) + "ms")
            }
            undraw() {
                var t = (performance.now(),
                this.totalSectors);
                for (var e in t) {
                    var i = t[e];
                    i.drawn && i.clear(!0)
                }
                var s = this.camera.zoom;
                this.recachePowerups(max(s, 1)),
                this.canvasPool.update()
            }
            collide(t) {
                var e = this.settings.physicsSectorSize
                  , i = floor(t.pos.x / e - .5)
                  , s = floor(t.pos.y / e - .5)
                  , n = this.sectors.physicsSectors;
                n[i] && n[i][s] && n[i][s].resetCollided(),
                n[i + 1] && n[i + 1][s] && n[i + 1][s].resetCollided(),
                n[i + 1] && n[i + 1][s + 1] && n[i + 1][s + 1].resetCollided(),
                n[i] && n[i][s + 1] && n[i][s + 1].resetCollided(),
                n[i] && n[i][s] && n[i][s].collide(t),
                n[i + 1] && n[i + 1][s] && n[i + 1][s].collide(t),
                n[i + 1] && n[i + 1][s + 1] && n[i + 1][s + 1].collide(t),
                n[i] && n[i][s + 1] && n[i][s + 1].collide(t)
            }
            getDrawSector(t, e) {
                var i = this.settings.drawSectorSize
                  , s = floor(t / i)
                  , n = floor(e / i)
                  , r = this.sectors.drawSectors
                  , o = !1;
                return "undefined" != typeof r[s] && "undefined" != typeof r[s][n] && (o = r[s][n]),
                o
            }
            draw() {
                var t = this.scene
                  , e = t.camera
                  , i = t.screen
                  , s = t.game.canvas.getContext("2d")
                  , n = e.zoom
                  , r = e.position
                  , o = t.screen.center
                  , a = this.settings.drawSectorSize * n
                  , h = r.x * n / a
                  , l = r.y * n / a
                  , c = i.width / a
                  , u = i.height / a
                  , p = u / 2
                  , d = c / 2
                  , f = h - d - 1
                  , v = l - p - 1
                  , g = h + d
                  , m = l + p;
                s.imageSmoothingEnabled = !1,
                s.mozImageSmoothingEnabled = !1,
                s.oImageSmoothingEnabled = !1,
                s.webkitImageSmoothingEnabled = !1;
                for (var y = h * a - o.x, w = l * a - o.y, x = this.totalSectors, _ = x.length, b = 0; _ > b; b++) {
                    var T = x[b]
                      , C = T.row
                      , k = T.column;
                    if (T.dirty && T.cleanSector(),
                    k >= f && g >= k && C >= v && m >= C) {
                        T.drawn === !1 && T.draw(),
                        T.hasPowerups && (T.powerupCanvasDrawn || T.cachePowerupSector());
                        var S = k * a - y
                          , P = C * a - w;
                        if (S = 0 | S,
                        P = 0 | P,
                        s.drawImage(T.canvas, S, P, a, a),
                        T.hasPowerups && T.powerupCanvasDrawn) {
                            var M = T.powerupCanvasOffset * n;
                            s.drawImage(T.powerupCanvas, S - M / 2, P - M / 2, a + M, a + M)
                        }
                    } else
                        T.drawn && T.clear()
                }
            }
            closeSectors() {
                for (var t = this.totalSectors, e = t.length, i = 0; e > i; i++)
                    t[i].close()
            }
            close() {
                this.scene = null,
                this.closeSectors(),
                this.totalSectors = null,
                this.canvasPool = null,
                this.sectors = null,
                this.physicsLines = null,
                this.sceneryLines = null,
                this.powerups = null,
                this.camera = null
            }
        }
        e.exports = Track
    },
    57: function(t, e) {
        class CampaignScore {
            constructor(a) {
                this.scene = a,
                this.settings = a.settings,
                this.build_interface()
            }
            scene = null;
            container = null;
            cached = !1;
            build_interface() {
                this.sprite_sheet = this.create_sprite_sheet();
                var t = this.scene.game.pixelRatio
                , e = new createjs.Container
                , i = "helsinki"
                , s = this.settings.campaignData
                , n = s.goals
                , r = n.third
                , o = new createjs.Container
                , a = this.get_sprite("bronze_medal")
                , r = new createjs.Text(r,"30px " + i,window.lite.getVar("dark") ? "#fdfdfd" : "#000000")
                , h = n.second
                , l = new createjs.Container
                , c = this.get_sprite("silver_medal")
                , h = new createjs.Text(h,"30px " + i,window.lite.getVar("dark") ? "#fdfdfd" : "#000000")
                , u = n.first
                , p = new createjs.Container
                , d = this.get_sprite("gold_medal")
                , u = new createjs.Text(u,"30px " + i,window.lite.getVar("dark") ? "#fdfdfd" : "#000000")
                , f = t / 2.5;
                "phone" === this.settings.controls && (f = t / 2.5),
                a.y = 7,
                a.x = 16,
                r.x = 69,
                r.y = 14,
                c.y = 7,
                c.x = 175,
                h.x = 229,
                h.y = 14,
                d.y = 7,
                d.x = 350,
                u.y = 14,
                u.x = 400,
                o.addChild(a),
                o.addChild(r),
                l.addChild(c),
                l.addChild(h),
                p.addChild(d),
                p.addChild(u),
                o.alpha = .4,
                l.alpha = .4,
                p.alpha = .4,
                e.addChild(o),
                e.addChild(l),
                e.addChild(p),
                e.scaleX = e.scaleY = f,
                e.y = 80 * f,
                e.x = 0,
                this.bronze_container = o,
                this.silver_container = l,
                this.gold_container = p,
                this.container = e,
                this.scene.game.stage.addChild(e),
                this.update_state()
            }
            update_state() {
                var t = this.settings.campaignData
                , e = t.user;
                switch (e.has_goal) {
                case 1:
                case "first":
                    this.gold_container.alpha = 1;
                case "second":
                case 2:
                    this.silver_container.alpha = 1;
                case "third":
                case 3:
                    this.bronze_container.alpha = 1;
                case 0:
                }
            }
            center_container() {
                var t = this.scene.screen
                , e = this.container
                , i = e.getBounds()
                , s = this.scene.game.pixelRatio;
                e.x = t.width / 2 - i.width / 2 * e.scaleY,
                e.y = 40 * s
            }
            update = () => {
                this.settings.mobile && this.center_container(),
                this.update_state()
            }
            create_sprite_sheet() {
                var t = this.scene.assets.getResult("campaign_icons")
                , e = {
                    images: [t],
                    frames: [[548, 68, 44, 44], [2, 68, 452, 56], [502, 68, 44, 44], [2, 2, 588, 64], [456, 68, 44, 44]],
                    animations: {
                        bronze_medal: [0],
                        center_panel: [1],
                        silver_medal: [2],
                        left_panel: [3],
                        gold_medal: [4]
                    }
                }
                , i = new createjs.SpriteSheet(e);
                return i
            }
            get_sprite(t) {
                var e = this.sprite_sheet
                , i = new createjs.Sprite(e,t);
                return i.stop(),
                i
            }
        }
        e.exports = CampaignScore
    },
    58: function(t, e) {
        class CanvasPool {
            constructor(a) {
                this.options = a,
                this.canvasPool = [],
                a.screen && (this.setToScreen = !0,
                this.update()),
                a.cap && (this.setToScreen = !1,
                this.poolCap = a.cap)
            }
            canvasPool = null;
            poolCap = 5e3;
            setToScreen = !0;
            options = null;
            update = () => {
                this.setToScreen && (this.getPoolCapFromScreen(),
                this.cleanPool())
            }
            getPoolCapFromScreen() {
                var t = this.options
                  , e = t.settings
                  , i = t.screen
                  , r = (this.options.width,
                this.options.height,
                i.width)
                  , o = i.height
                  , a = t.camera
                  , h = a.zoom
                  , l = floor(e.drawSectorSize * h)
                  , c = ceil(r / l)
                  , u = ceil(o / l);
                this.poolCap = c * u + c + u
            }
            getCanvas() {
                var t = this.canvasPool.pop();
                return null == t && (t = document.createElement("canvas")),
                t
            }
            releaseCanvas(t) {
                this.canvasPool.length < this.poolCap && this.canvasPool.push(t)
            }
            cleanPool() {
                this.canvasPool.length > this.poolCap && (this.canvasPool = this.canvasPool.slice(0, this.poolCap + 1))
            }
        }
        e.exports = CanvasPool
    },
    60: function(t, e) {
        class Gamepad {
            constructor(a) {
                this.scene = a,
                this.tickDownButtons = {},
                this.previousTickDownButtons = {},
                this.downButtons = {},
                this.keymap = {},
                this.records = {},
                this.numberOfKeysDown = 0,
                this.tickNumberOfKeysDown = 0 
            }
            tickDownButtons = null;
            previousTickDownButtons = null;
            downButtons = null;
            paused = !1;
            keymap = null;
            records = null;
            keysToRecord = null;
            keysToPlay = null;
            recording = !1;
            playback = null;
            numberOfKeysDown = 0;
            tickNumberOfKeysDown = 0;
            replaying = !1;
            listen() {
                document.onkeydown = this.handleButtonDown.bind(this),
                document.onkeyup = this.handleButtonUp.bind(this)
            }
            unlisten() {
                this.downButtons = {},
                document.onkeydown = function() {}
                ,
                document.onkeyup = function() {}
            }
            pause() {
                this.paused = !0
            }
            unpause() {
                this.paused = !1
            }
            recordKeys(t) {
                this.keysToRecord = t,
                this.recording = !0
            }
            loadPlayback(t, e) {
                this.keysToPlay = e,
                this.playback = t,
                this.replaying = !0
            }
            setKeyMap(t) {
                var e = {};
                for (var i in t)
                    if (t[i]instanceof Array)
                        for (var s in t[i])
                            e[t[i][s]] = i;
                    else
                        e[t[i]] = i;
                this.keymap = e
            }
            handleButtonDown(t) {
                var e = this.getInternalCode(t.keyCode);
                "string" == typeof e && t.preventDefault(),
                this.setButtonDown(e)
            }
            handleButtonUp(t) {
                var e = this.getInternalCode(t.keyCode);
                "string" == typeof e && t.preventDefault(),
                this.setButtonUp(e)
            }
            getInternalCode(t) {
                var e = this.keymap;
                return e[t] || t
            }
            setButtonsDown(t) {
                for (var e = 0, i = t.length; i > e; e++)
                    this.setButtonDown(t[e])
            }
            setButtonUp(t) {
                this.downButtons[t] && (this.onButtonUp && this.onButtonUp(t),
                this.downButtons[t] = !1,
                this.numberOfKeysDown--)
            }
            setButtonDown(t, e) {
                this.downButtons[t] || (this.onButtonDown && this.onButtonDown(t),
                this.downButtons[t] = e ? e : !0,
                this.numberOfKeysDown++)
            }
            isButtonDown(t) {
                var e = !1
                  , i = this.tickDownButtons[t];
                return (i > 0 || 1 == i) && (e = !0),
                e
            }
            getButtonDownOccurances(t) {
                var e = 0;
                if (this.isButtonDown(t)) {
                    e = 1;
                    var i = this.tickDownButtons[t];
                    i !== !0 && (e = i)
                }
                return e
            }
            getDownButtons() {
                var t = [];
                for (var e in this.tickDownButtons)
                    this.tickDownButtons[e] && t.push(e);
                return t
            }
            reset(t) {
                (this.replaying || t) && (this.downButtons = {}),
                this.tickDownButtons = {},
                this.previousTickDownButtons = {},
                this.records = {}
            }
            update() {
                this.scene;
                if(this.replaying) {
                    this.updatePlayback();
                }
                for(var e in this.tickDownButtons) {
                    this.previousTickDownButtons[e] = this.tickDownButtons[e];
                }
                for(var t in this.downButtons) {
                    this.tickDownButtons[t] = this.downButtons[t];
                }
                this.tickNumberOfKeysDown = this.numberOfKeysDown;
                if(this.recording) {
                    this.updateRecording()
                }
            }
            areKeysDown() {
                for (var t in this.downButtons)
                    if (this.downButtons[t] === !0)
                        return !0;
                return !1
            }
            updatePlayback() {
                var t = this.keysToPlay
                  , e = this.playback
                  , i = this.scene.ticks;
                for (var s in t) {
                    var n = t[s]
                      , r = n + "_up"
                      , o = n + "_down";
                    if ("undefined" != typeof e[o] && "undefined" != typeof e[o][i]) {
                        var a = e[o][i];
                        this.setButtonDown(n, a)
                    }
                    "undefined" != typeof e[r] && "undefined" != typeof e[r][i] && this.setButtonUp(n)
                }
            }
            updateRecording() {
                var t = this.scene.ticks
                  , e = this.records
                  , i = this.keysToRecord
                  , s = this.tickDownButtons
                  , n = this.previousTickDownButtons;
                for (var r in i) {
                    var o = i[r];
                    if ("undefined" != typeof s[o]) {
                        var a = s[o]
                          , h = !1;
                        if ("undefined" != typeof n[o] && (h = n[o]),
                        a !== h) {
                            var l = o + "_up"
                              , c = o + "_down"
                              , u = l;
                            a && (u = c),
                            e[u] || (e[u] = []),
                            a || e[c] && -1 !== e[c].indexOf(t) && (t += 1),
                            e[u].push(t)
                        }
                    }
                }
            }
            buttonWasRecentlyDown(t) {
                var e = this.records;
                this.replaying && (e = this.playback);
                var i = t + "_down"
                  , s = !1;
                if (e[i]) {
                    var n = this.scene.ticks
                      , r = n
                      , o = e[i]
                      , a = -1;
                    a = this.replaying ? "undefined" != typeof o[r] : o.indexOf(r),
                    -1 !== a && (s = !0)
                }
                return s
            }
            getReplayString() {
                return JSON.stringify(this.records)
            }
            encodeReplayString(t) {
                var e = this.scene.settings
                  , i = {
                    version: e.replayVersion
                };
                for (var s in t) {
                    var n = t[s];
                    i[s] = "";
                    for (var r in n) {
                        var o = n[r];
                        i[s] += o.toString(32) + " "
                    }
                }
                return i
            }
            close() {
                this.unlisten(),
                this.handleButtonUp = null,
                this.handleButtonDown = null,
                this.onButtonDown = null,
                this.onButtonUp = null,
                this.scene = null,
                this.tickDownButtons = null,
                this.downButtons = null,
                this.keymap = null,
                this.records = null,
                this.keysToRecord = null
            }
        }
        e.exports = Gamepad
    },
    61: function(t, e) {
        class LoadingCircle {
            constructor(a) {
                this.scene = a,
                this.screen = a.screen,
                this.context = a.game.canvas.getContext("2d"),
                this.clockwise = !1,
                this.settings = {
                    radius: 10,
                    color: "#1884cf"
                }
            }
            scene = null;
            clockwise = !1;
            context = null;
            screen = null;
            pixelRatio = 1;
            draw() {
                var t = this.context
                  , e = this.screen
                  , i = this.settings
                  , s = this.scene.game.pixelRatio
                  , n = i.radius
                  , r = this.clockwise
                  , o = this.scene.game.tickCount % 25 / 25 * 2 * PI;
                0 === o && (this.clockwise && (o = 2 * PI),
                this.clockwise = !this.clockwise);
                var a = r ? 0 : o
                  , h = r ? o : 0
                  , l = e.width - 25 * s
                  , c = e.height - 25 * s
                  , u = !1;
                t.beginPath(),
                t.arc(l, c, n * s, a, h, u),
                t.lineWidth = 3 * s,
                t.strokeStyle = i.color,
                t.stroke()
            }
        }
        e.exports = LoadingCircle
    },
    62: function(t, e) {
        class MessageManager {
            constructor(a) {
                this.scene = a,
                this.message = !1,
                this.timeout = !1,
                this.color = "#000"
            }
            message = null;
            timeout = null;
            draw() {
                var t = this.message
                , e = this.timeout
                , i = this.color
                , s = this.outline;
                if (e !== !1 && 0 >= e && (t = !1),
                this.scene.state.paused && (i = !1,
                s = !1,
                t = this.scene.settings.mobile ? "Paused" : "Paused - Press Spacebar to Continue"),
                i === !1 && (i = window.lite.getVar("dark") ? "#CCCCCC" : "#333333"),
                t) {
                    var n = this.scene.game
                    , r = this.scene
                    , o = n.pixelRatio
                    , a = n.canvas.getContext("2d")
                    , h = r.screen.center.x
                    , l = 100
                    , c = r.settings;
                    "phone" === c.controls && (l = 80),
                    a.save(),
                    a.fillStyle = i,
                    a.lineWidth = 4 * (o / 2),
                    a.font = 12 * o + "pt helsinki",
                    a.textAlign = "center",
                    s && (a.strokeStyle = s,
                    a.strokeText(t, h, l * o),
                    a.strokeStyle = "#000"),
                    a.fillText(t, h, l * o),
                    a.restore()
                }
            }
            show(t, e, i, s) {
                this.message = t,
                this.timeout = e,
                this.color = i,
                this.outline = s
            }
            hide() {
                this.message = !1,
                this.color = !1,
                this.outline = !1
            }
            update() {
                this.timeout !== !1 && this.timeout--
            }
        }
        e.exports = MessageManager
    },
    63: function(t, e) {
        var Vector = t(8);
        class MouseHandler {
            constructor(a) {
                this.scene = a,
                this.enabled = !0,
                this.touch = this.getTouchObject(),
                this.touch.old = this.getTouchObject(),
                this.secondaryTouch = this.getTouchObject(),
                this.secondaryTouch.old = this.getTouchObject(),
                this.initAnalytics(),
                this.bindToMouseEvents(),
                this.updateCallback = !1
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
                var t = {
                    id: null,
                    down: !1,
                    press: !1,
                    release: !1,
                    pos: new Vector(0,0),
                    real: new Vector(0,0),
                    type: 1
                };
                return t
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
                function hn(t, e, i) {
                    var o = function() {
                        if (a = arguments,
                        c = Date.now(),
                        u = this,
                        d = g && (p || !m),
                        !1 === v)
                            var i = m && !p;
                        else {
                            h || m || (f = c);
                            var s = v - (c - f)
                                , o = 0 >= s || s > v;
                            o ? (h && (h = or(h)),
                            f = c,
                            l = t.apply(u, a)) : h || (h = setTimeout(!function(e, i) {
                                i && or(i),
                                e && (f = Date.now(),
                                l = t.apply(u, a),
                                p || h)
                            }(g, p), s))
                        }
                        return o && p ? p = or(p) : p || e === v || (p = setTimeout(n = function() {
                            var t = e - (Date.now() - c);
                            0 >= t || t > e ? s(d, h) : p = setTimeout(n, t)
                        }, e)), i && (o = !0, l = t.apply(u, a)), !o || p || h, l
                    };
                    var a, h, l, c, u, p, d, f = 0, v = !1, g = !0;
                    if ("function" != typeof t)
                        throw new Kn(U);
                    if (e = 0 > e ? 0 : +e || 0,
                    !0 === i)
                        var m = !0
                            , g = !1;
                    else
                    (!!i && (typeof i == "object" || typeof i == "function")) && (m = !!i.leading,
                        v = "maxWait"in i && max(+i.maxWait || 0, e),
                        g = "trailing"in i ? !!i.trailing : g);
                    return o.cancel = function() {
                        p && or(p),
                        h && or(h),
                        f = 0,
                        h = p = d = T
                    }, o
                }
                var throttle = function(t, e, i) {
                    var s = !0
                      , n = !0;
                    if (typeof t != "function") {
                        throw Error()
                    }
                    var v = hn(t, e, {
                        leading: s,
                        maxWait: +e,
                        trailing: n
                    });
                    return !1 === i ? s = !1 : (!!i && (typeof i == "object" || typeof i == "function")) && (s = "leading" in i ? !!i.leading : s,
                    n = "trailing" in i ? !!i.trailing : n),
                    v
                }
                var o = throttle(this.onMouseWheel, 0);
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
                2 === t.nativeEvent.button ? this.secondaryTouch.down === !0 && (this.updatePosition(t, this.secondaryTouch),
                this.secondaryTouch.down = !1) : this.touch.down === !0 && (this.updatePosition(t, this.touch),
                this.touch.down = !1)
            }
            updatePosition(t, e) {
                e.id = t.pointerID,
                e.type = t.nativeEvent.button;
                var i = e.pos;
                i.x = t.stageX,
                i.y = t.stageY,
                this.updateRealPosition(e)
            }
            updateRealPosition(t) {
                var e = (t.old,
                t.pos)
                , i = t.real
                , s = (t.down,
                this.scene)
                , n = s.screen
                , o = s.camera
                , a = n.center
                , h = o.position
                , l = (e.x - a.x) / o.zoom + h.x
                , c = (e.y - a.y) / o.zoom + h.y;
                i.x = round(l),
                i.y = round(c);
                var u = this.scene.settings;
                if (this.scene.toolHandler.options.grid) {
                    var p = u.toolHandler.gridSize;
                    i.x = round(i.x / p) * p,
                    i.y = round(i.y / p) * p
                }
                this.updateCallback
            }
            onMouseWheel(t) {
                var t = window.event || t;
                t.preventDefault(),
                t.stopPropagation();
                var e = max(-1, min(1, t.deltaY || -t.detail));
                return 0 == e && (e = max(-1, min(1, t.deltaX || -t.detail))),
                this.wheel = -e,
                !1
            }
            onMouseMove(t) {
                this.updatePosition(t, this.touch),
                this.updatePosition(t, this.secondaryTouch)
            }
            update() {
                this.enabled && (this.updateTouch(this.touch),
                this.updateTouch(this.secondaryTouch),
                this.updateWheel())
            }
            updateTouch(t) {
                var e = t.old
                , i = t.pos
                , s = t.real
                , n = t.down;
                e.pos.x = i.x,
                e.pos.y = i.y,
                e.real.x = s.x,
                e.real.y = s.y,
                !e.down && n && (t.press = !0),
                e.down && !n && (t.release = !0),
                e.press && (t.press = !1),
                e.release && (t.release = !1),
                this.updateRealPosition(t),
                e.down = t.down,
                e.press = t.press,
                e.release = t.release
            }
            updateWheel() {
                this.mousewheel = this.wheel,
                this.wheel = !1
            }
            close() {
                var t = this.scene.game.stage
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
        e.exports = MouseHandler
    },
    64: function(t, e) {
        class Path {
            constructor() {
                this.start = null,
                this.end = null,
                this.verticies = []
            }
            start = null;
            end = null;
            verticies = [];
            build(t) {
                var e = t.pop();
                this.start = e.p1,
                this.end = e.p2,
                this.verticies.push(e);
                for (var i = t.length, s = i - 1; s >= 0; s--) {
                    var n = t[s]
                      , r = n.p1
                      , o = n.p2;
                    this.start.x === o.x && this.start.y === o.y ? (this.verticies.unshift(n),
                    this.start = n.p1,
                    t.splice(s, 1)) : this.end.x === r.x && this.end.y === r.y && (this.verticies.push(n),
                    this.end = n.p2,
                    t.splice(s, 1))
                }
            }
        }
        e.exports = Path
    },
    65: function(t, e) {
        class RaceTimes {
            constructor(a) {
                this.scene = a,
                this.maxRaces = this.scene.settings.mobile ? 3 : 10,
                this.createContainer()
            }
            container = null;
            raceTimes = {};
            raceList = [];
            raceCount = 0;
            highlightedRace = null;
            raceOpacity = .3;
            raceYOffset = 50;
            mobileRaceXOffset = 180;
            maxRaces = 10;
            createContainer() {
                var t = this.scene.game
                , e = t.settings
                , i = t.pixelRatio
                , s = i / 2.5
                , n = new createjs.Container;
                n.scaleX = n.scaleY = s,
                n.y = 80 * s,
                n.x = 15 * s,
                e.isCampaign && (n.y += 55 * s),
                this.container = n,
                t.stage.addChild(n)
            }
            clear() {
                this.container.removeAllChildren(),
                this.raceList = [],
                this.raceCount = 0
            }
            centerContainer() {
                var t = this.scene
                , e = t.screen
                , i = this.container
                , s = i.getBounds()
                , n = this.scene.game.pixelRatio;
                i.x = e.width / 2 - s.width / 2 * i.scaleY;
                var r = 40;
                t.settings.isCampaign && (i.visible = !1),
                i.y = r * n
            }
            addRace(t, e) {
                if (this.raceCount < this.maxRaces) {
                    var i = this.scene
                    , n = i.game
                    , r = (n.pixelRatio,
                    t.user)
                    , o = t.race
                    , a = i.settings
                    , h = a.drawFPS
                    , l = r.color
                    , c = "helsinki"
                    , u = new createjs.Container
                    , p = (i.camera,
                    new createjs.Shape)
                    , d = p.graphics;
                    d.setStrokeStyle(4, "round"),
                    d.beginFill(l).drawCircle(0, 0, 20),
                    p.x = 25,
                    p.y = 25;
                    var f = formatNumber(parseInt(o.run_ticks) / h * 1e3)
                    , th = i.playerManager._players[0].getTargetsHit()
                    , tt = i.track.targetCount
                    , v = new createjs.Text(f + " " + th + "/" + tt,"30px " + c,window.lite.getVar("dark") ? "#f1f1f1" : "#000000");
                    v.x = 55,
                    v.y = 9;
                    var g = new createjs.Text(r.d_name.charAt(0),"25px " + c,window.lite.getVar("dark") ? "#fdfdfd" : "#000000");
                    g.x = 17,
                    g.y = 33,
                    g.textBaseline = "alphabetic";
                    var m = new createjs.Container;
                    m.addChild(p),
                    m.addChild(g),
                    m.cache(0, 0, 50, 50),
                    m.removeAllChildren(),
                    u.addChild(m, v),
                    u.alpha = this.raceOpacity,
                    a.mobile ? u.x = e * this.mobileRaceXOffset : (u.x = -2,
                    u.y = e * this.raceYOffset),
                    this.raceTimes[r.d_name] = {
                        time: v
                    },
                    this.raceList.push(u),
                    this.container.addChild(u),
                    this.raceCount++
                }
            }
            update() {
                var s = this.scene;
                if (this.raceCount > 0) {
                    for(var i in this.raceTimes) {
                        for(var x in s.playerManager._players) {
                            if(s.playerManager._players[x]._user.d_name == i) {
                                var th = s.playerManager._players[x].getTargetsHit(),
                                    tt = s.track.targetCount;
                                this.raceTimes[i].time.text = this.raceTimes[i].time.text.split(" ")[0] + " " + th + "/" + tt;
                                this.raceTimes[i].time.color = window.lite &&  window.lite.getVar("dark") ? "#f1f1f1" : "#000000"
                            }
                        }
                    }
                    var t = this.scene.camera;
                    t.focusIndex > 0 && t.focusIndex < this.maxRaces ? this.highlightRace(t.focusIndex - 1) : this.unhighlightRace(),
                    this.scene.settings.mobile && this.centerContainer()
                }
            }
            highlightRace(t) {
                if (this.highlightedRace !== this.raceList[t]) {
                    this.unhighlightRace();
                    var e = this.raceList[t];
                    e.alpha = 1,
                    this.highlightedRace = e
                }
            }
            unhighlightRace() {
                this.highlightedRace && (this.highlightedRace.alpha = this.raceOpacity,
                this.highlightedRace = null)
            }
        }
        e.exports = RaceTimes
    },
    66: function(t, e) {
        class Score {
            constructor(a) {
                this.scene = a,
                this.stage = a.game.stage,
                this.build_interface()
            }
            container = null;
            cached = !1;
            scene = null;
            state = null;
            offset = {
                y: 0,
                x: 0
            }
            build_interface() {
                var t = this.scene
                , e = t.game.pixelRatio
                , i = t.settings
                , s = new createjs.Container
                , n = "helsinki"
                , r = new createjs.Text("00:00.00","40px " + n, window.lite &&  window.lite.getVar("dark") ? "#fdfdfd" : "#000000")
                , o = new createjs.Text("TIME:","20px " + n, window.lite &&  window.lite.getVar("dark") ? "#666666" : "#999999")
                , a = this.get_timer_sprite()
                , h = new createjs.Text(" -- : --.--","35px " + n, window.lite &&  window.lite.getVar("dark") ? "#666666" : "#999999")
                , l = new createjs.Text("BEST:","20px " + n, window.lite &&  window.lite.getVar("dark") ? "#666666" : "#999999")
                , c = new createjs.Text("0/0","40px " + n, window.lite &&  window.lite.getVar("dark") ? "#fdfdfd" : "#000000")
                , u = new createjs.Bitmap(t.assets.getResult("targets_icon"))
                , p = e / 2.5;
                i.mobile && (p = e / 2.5),
                r.y = 18,
                r.x = 57,
                o.y = 3,
                o.x = 59,
                a.y = 0,
                a.x = 0,
                h.x = 237,
                h.y = 21,
                l.x = 240,
                l.y = 3,
                c.y = 15,
                c.x = 460,
                u.y = 0,
                u.x = 400,
                s.addChild(r),
                s.addChild(o),
                s.addChild(a),
                s.addChild(h),
                s.addChild(l),
                s.addChild(c),
                s.addChild(u),
                s.scaleX = s.scaleY = p,
                s.y = (10 + this.offset.y) * p,
                s.x = 10 * p,
                this.best_time_title = l,
                this.time_title = o,
                this.container = s,
                this.time = r,
                this.goals = c,
                this.best_time = h,
                this.stage.addChild(s)
            }
            update() {
                var t = this.scene
                , e = t.ticks
                , i = t.settings
                , n = t.track
                , r = t.playerManager.firstPlayer;
                this.cached === !1 && e > 50 && (this.cached = !0,
                this.cache_fixed_text());
                var o = e / i.drawFPS;
                this.time.text = formatNumber(1e3 * o);
                this.time.color = window.lite &&  window.lite.getVar("dark") ? "#fdfdfd" : "#000000";
                var a = n.targetCount
                , h = r.getTargetsHit();
                this.goals.text = h + "/" + a;
                this.goals.color = window.lite &&  window.lite.getVar("dark") ? "#fdfdfd" : "#000000";
                var l = " -- : --.--";
                i.isCampaign && i.campaignData.user.best_time ? l = i.campaignData.user.best_time : i.userTrackStats && i.userTrackStats.best_time && (l = i.userTrackStats.best_time),
                this.best_time.text = l,
                i.mobile && this.center_container();
                this.best_time_title.color = window.lite &&  window.lite.getVar("dark") ? "#666666" : "#999999";
                this.best_time.color = window.lite &&  window.lite.getVar("dark") ? "#666666" : "#999999"
            }
            center_container() {
                var t = this.container
                , e = t.getBounds()
                , i = this.scene.screen
                , s = this.scene.game.pixelRatio;
                t.x = i.width / 2 - e.width / 2 * t.scaleY,
                t.y = 10 * s
            }
            cache_fixed_text() {
                var t, e = this.best_time_title, i = this.time_title, s = 10;
                t = e.getBounds(),
                e.cache(t.x, t.y, t.width, t.height + s),
                t = i.getBounds(),
                i.cache(t.x, t.y, t.width, t.height + s)
            }
            get_timer_sprite() {
                var t = this.scene.assets.getResult("time_icon")
                , e = {
                    images: [t],
                    frames: {
                        width: 60,
                        height: 60
                    }
                }
                , i = new createjs.SpriteSheet(e)
                , s = new createjs.Sprite(i);
                return s
            }
        }
        e.exports = Score
    },
    67: function(t, e) {
        var S = function(e) {
            return S = {
                    lib: s = {
                        Base: r = {
                            extend: function(t) {
                                var n = function() {};
                                n.prototype = this;
                                var e = new n;
                                return t && e.mixIn(t),
                                e.hasOwnProperty("init") || (e.init = function() {
                                    e.$super.init.apply(this, arguments)
                                }),
                                e.init.prototype = e, e.$super = this, e
                            },
                            create: function() {
                                var t = this.extend();
                                return t.init.apply(t, arguments),
                                t
                            },
                            init: function() {},
                            mixIn: function(t) {
                                for (var e in t)
                                    t.hasOwnProperty(e) && (this[e] = t[e]);
                                t.hasOwnProperty("toString") && (this.toString = t.toString)
                            },
                            clone: function() {
                                return this.init.prototype.extend(this)
                            }
                        },
                        WordArray: o = r.extend({
                            init: function(t, i) {
                                t = this.words = t || [],
                                this.sigBytes = i != e ? i : 4 * t.length
                            },
                            toString: function(t) {
                                return (t || h).stringify(this)
                            },
                            concat: function(t) {
                                var e = this.words
                                , i = t.words
                                , s = this.sigBytes;
                                if (t = t.sigBytes,
                                this.clamp(),
                                s % 4)
                                    for (var n = 0; t > n; n++)
                                        e[s + n >>> 2] |= (i[n >>> 2] >>> 24 - 8 * (n % 4) & 255) << 24 - 8 * ((s + n) % 4);
                                else if (65535 < i.length)
                                    for (n = 0; t > n; n += 4)
                                        e[s + n >>> 2] = i[n >>> 2];
                                else
                                    e.push.apply(e, i);
                                return this.sigBytes += t,
                                this
                            },
                            clamp: function() {
                                var e = this.words
                                , i = this.sigBytes;
                                e[i >>> 2] &= 4294967295 << 32 - 8 * (i % 4),
                                e.length = ceil(i / 4)
                            },
                            clone: function() {
                                var t = r.clone.call(this);
                                return t.words = this.words.slice(0),
                                t
                            },
                            random: function(e) {
                                for (var i = [], s = 0; e > s; s += 4)
                                    i.push(4294967296 * t.random() | 0);
                                return new o.init(i,e)
                            }
                        }),
                        BufferedBlockAlgorithm:  u = r.extend({
                            reset: function() {
                                this._data = new o.init,
                                this._nDataBytes = 0
                            },
                            _append: function(t) {
                                "string" == typeof t && (t = c.parse(t)),
                                this._data.concat(t),
                                this._nDataBytes += t.sigBytes
                            },
                            _process: function(e) {
                                var i = this._data
                                , s = i.words
                                , n = i.sigBytes
                                , r = this.blockSize
                                , a = n / (4 * r)
                                , a = e ? ceil(a) : max((0 | a) - this._minBufferSize, 0);
                                if (e = a * r,
                                n = min(4 * e, n),
                                e) {
                                    for (var h = 0; e > h; h += r)
                                        this._doProcessBlock(s, h);
                                    h = s.splice(0, e),
                                    i.sigBytes -= n
                                }
                                return new o.init(h,n)
                            },
                            clone: function() {
                                var t = r.clone.call(this);
                                return t._data = this._data.clone(),
                                t
                            },
                            _minBufferSize: 0
                        }),
                        Hasher: h = u.extend({
                            cfg: r.extend(),
                            init: function(t) {
                                this.cfg = this.cfg.extend(t),
                                this.reset()
                            },
                            reset: function() {
                                u.reset.call(this),
                                this._doReset()
                            },
                            update: function(t) {
                                return this._append(t),
                                this._process(),
                                this
                            },
                            finalize: function(t) {
                                return t && this._append(t),
                                this._doFinalize()
                            },
                            blockSize: 16,
                            _createHelper: function(t) {
                                return function(e, i) {
                                    return new t.init(i).finalize(e)
                                }
                            },
                            _createHmacHelper: function(t) {
                                return function(e, i) {
                                    return new p.HMAC.init(t,i).finalize(e)
                                }
                            }
                        }),
                        SHA256: h.extend({
                            _doReset: function() {
                                this._hash = new n.init(o.slice(0))
                            },
                            _doProcessBlock: function(t, e) {
                                for (var i = this._hash.words, s = i[0], n = i[1], r = i[2], o = i[3], h = i[4], l = i[5], c = i[6], u = i[7], p = 0; 64 > p; p++) {
                                    if (16 > p)
                                        f[p] = 0 | t[e + p];
                                    else {
                                        var d = f[p - 15]
                                          , v = f[p - 2];
                                        f[p] = ((d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3) + f[p - 7] + ((v << 15 | v >>> 17) ^ (v << 13 | v >>> 19) ^ v >>> 10) + f[p - 16]
                                    }
                                    d = u + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & l ^ ~h & c) + a[p] + f[p],
                                    v = ((s << 30 | s >>> 2) ^ (s << 19 | s >>> 13) ^ (s << 10 | s >>> 22)) + (s & n ^ s & r ^ n & r),
                                    u = c,
                                    c = l,
                                    l = h,
                                    h = o + d | 0,
                                    o = r,
                                    r = n,
                                    n = s,
                                    s = d + v | 0
                                }
                                i[0] = i[0] + s | 0,
                                i[1] = i[1] + n | 0,
                                i[2] = i[2] + r | 0,
                                i[3] = i[3] + o | 0,
                                i[4] = i[4] + h | 0,
                                i[5] = i[5] + l | 0,
                                i[6] = i[6] + c | 0,
                                i[7] = i[7] + u | 0
                            },
                            _doFinalize: function() {
                                var e = this._data
                                  , i = e.words
                                  , s = 8 * this._nDataBytes
                                  , n = 8 * e.sigBytes;
                                return i[n >>> 5] |= 128 << 24 - n % 32,
                                i[(n + 64 >>> 9 << 4) + 14] = floor(s / 4294967296),
                                i[(n + 64 >>> 9 << 4) + 15] = s,
                                e.sigBytes = 4 * i.length,
                                this._process(),
                                this._hash
                            },
                            clone: function() {
                                var t = r.clone.call(this);
                                return t._hash = this._hash.clone(),
                                t
                            }
                        })
                    },
                    enc: a = {
                        Hex: h = {
                            stringify: function(t) {
                                var e = t.words;
                                t = t.sigBytes;
                                for (var i = [], s = 0; t > s; s++) {
                                    var n = e[s >>> 2] >>> 24 - 8 * (s % 4) & 255;
                                    i.push((n >>> 4).toString(16)),
                                    i.push((15 & n).toString(16))
                                }
                                return i.join("")
                            },
                            parse: function(t) {
                                for (var e = t.length, i = [], s = 0; e > s; s += 2)
                                    i[s >>> 3] |= parseInt(t.substr(s, 2), 16) << 24 - 4 * (s % 8);
                                return new o.init(i,e / 2)
                            }
                        },
                        Latin1: l = {
                            stringify: function(t) {
                                var e = t.words;
                                t = t.sigBytes;
                                for (var i = [], s = 0; t > s; s++)
                                    i.push(String.fromCharCode(e[s >>> 2] >>> 24 - 8 * (s % 4) & 255));
                                return i.join("")
                            },
                            parse: function(t) {
                                for (var e = t.length, i = [], s = 0; e > s; s++)
                                    i[s >>> 2] |= (255 & t.charCodeAt(s)) << 24 - 8 * (s % 4);
                                return new o.init(i,e)
                            }
                        },
                        Utf8: c = {
                            stringify: function(t) {
                                try {
                                    return decodeURIComponent(escape(l.stringify(t)))
                                } catch (e) {
                                    throw Error("Malformed UTF-8 data")
                                }
                            },
                            parse: function(t) {
                                return l.parse(unescape(encodeURIComponent(t)))
                            }
                        }
                    },
                    algo: p = {}
            };
        }();
        !function(t = Math) {
            for (var e = S, s = e.lib, n = s.WordArray, r = s.Hasher, s = e.algo, o = [], a = [], h = function(t) {
                return 4294967296 * (t - (0 | t)) | 0
            }, l = 2, c = 0; 64 > c; ) {
                var u;
                t: {
                    u = l;
                    for (var p = t.sqrt(u), d = 2; p >= d; d++)
                        if (!(u % d)) {
                            u = !1;
                            break t
                        }
                    u = !0
                }
                u && (8 > c && (o[c] = h(t.pow(l, .5))),
                a[c] = h(t.pow(l, 1 / 3)),
                c++),
                l++
            }
            var f = []
              , s = s.SHA256 = r.extend({
                _doReset: function() {
                    this._hash = new n.init(o.slice(0))
                },
                _doProcessBlock: function(t, e) {
                    for (var i = this._hash.words, s = i[0], n = i[1], r = i[2], o = i[3], h = i[4], l = i[5], c = i[6], u = i[7], p = 0; 64 > p; p++) {
                        if (16 > p)
                            f[p] = 0 | t[e + p];
                        else {
                            var d = f[p - 15]
                              , v = f[p - 2];
                            f[p] = ((d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3) + f[p - 7] + ((v << 15 | v >>> 17) ^ (v << 13 | v >>> 19) ^ v >>> 10) + f[p - 16]
                        }
                        d = u + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & l ^ ~h & c) + a[p] + f[p],
                        v = ((s << 30 | s >>> 2) ^ (s << 19 | s >>> 13) ^ (s << 10 | s >>> 22)) + (s & n ^ s & r ^ n & r),
                        u = c,
                        c = l,
                        l = h,
                        h = o + d | 0,
                        o = r,
                        r = n,
                        n = s,
                        s = d + v | 0
                    }
                    i[0] = i[0] + s | 0,
                    i[1] = i[1] + n | 0,
                    i[2] = i[2] + r | 0,
                    i[3] = i[3] + o | 0,
                    i[4] = i[4] + h | 0,
                    i[5] = i[5] + l | 0,
                    i[6] = i[6] + c | 0,
                    i[7] = i[7] + u | 0
                },
                _doFinalize: function() {
                    var e = this._data
                      , i = e.words
                      , s = 8 * this._nDataBytes
                      , n = 8 * e.sigBytes;
                    return i[n >>> 5] |= 128 << 24 - n % 32,
                    i[(n + 64 >>> 9 << 4) + 14] = floor(s / 4294967296),
                    i[(n + 64 >>> 9 << 4) + 15] = s,
                    e.sigBytes = 4 * i.length,
                    this._process(),
                    this._hash
                },
                clone: function() {
                    var t = r.clone.call(this);
                    return t._hash = this._hash.clone(),
                    t
                }
            });
            e.SHA256 = function(e, i) {
                return new s.init(i).finalize(e)
            },
            e.HmacSHA256 = r._createHmacHelper(s)
        }();
        e.exports = S
    },
    68: function(t, e) {
        class SoundManager {
            constructor(a) {
                this.scene = a,
                this.sounds = {}
            }
            sounds = null;
            update() {
                var t = createjs.Sound
                  , e = this.scene
                  , i = e.settings;
                t.setMute(e.state.paused || i.soundsEnabled === !1 ? !0 : !1)
            }
            setVolume(t, e) {
                this.sounds[t] && (this.sounds[t].volume = e)
            }
            muted = !1;
            mute_all() {
                var t = this.sounds;
                for (var e in t)
                    t.hasOwnProperty(e) && (t[e].volume = 0);
                this.muted = !0
            }
            stop_all() {
                var t = this.sounds;
                for (var e in t)
                    t.hasOwnProperty(e) && (t[e].volume = 0,
                    t[e].stop())
            }
            play(t, e) {
                if ((null === e || "undefined" == typeof e) && (e = 1),
                this.sounds[t])
                    this.sounds[t].volume = e;
                else if (this.scene.settings.soundsEnabled) {
                    var i = createjs.Sound.play(t, {
                        volume: e
                    })
                      , s = this;
                    i.addEventListener("complete", function() {
                        s.sounds[t] = null
                    }),
                    this.sounds[t] = i
                }
            }
            stop(t) {
                this.sounds[t] && (this.sounds[t].stop(),
                this.sounds[t] = null)
            }
            close() {
                this.sounds = null
            }
        }
        e.exports = SoundManager
    },
    69: function(t, e) {
        e.exports = class VehicleTimer {
            constructor(a) {
                this.scene = a,
                this.settings = a.settings,
                this.player = !1,
                this.tweens = [],
                this.build_interface(),
                this.createPulseTween()
            }
            scene = null;
            container = null;
            cached = !1;
            build_interface() {
                var t = this.scene.game.pixelRatio
                , e = new createjs.Container
                , i = "helsinki"
                , s = new createjs.Shape;
                s.graphics.setStrokeStyle(5, "round").beginStroke("rgba(242,144,66,1)").beginFill("rgba(242,144,66,0.5)").drawRoundRect(0, 0, 200, 60, 25);
                var n = new createjs.Text("00:00","35px " + i,window.lite &&  window.lite.getVar("dark") ? "#fdfdfd" : "#000000");
                n.textAlign = "center",
                n.textBaseline = "middle",
                n.x = 100,
                n.y = 30,
                e.addChild(s),
                e.addChild(n),
                e.visible = !1,
                e.scaleX = e.scaleY = t / 2,
                this.timeText = n,
                this.container = e,
                this.scene.game.stage.addChild(e),
                this.center_container()
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
                var self = this;
                class Tween {
                    constructor(t) {
                        this.e = t,
                        this.i = {},
                        this.n = {},
                        this.r = {},
                        this.o = 1e3,
                        this.a = 0,
                        this.h = !1,
                        this.l = !1,
                        this.c = !1,
                        this.u = 0,
                        this.p = null,
                        this.d = (t) => { return t },
                        this.f = function(t, e) {
                            var i = t.length - 1
                            , n = i * e
                            , r = floor(n)
                            , o = function(t, e, i) {
                                return (e - t) * i + t
                            };
                            return 0 > e ? o(t[0], t[1], n) : e > 1 ? o(t[i], t[i - 1], i - n) : o(t[r], t[r + 1 > i ? i : r + 1], n - r)
                        },
                        this.v = [],
                        this.g = null,
                        this.m = !1,
                        this.y = null,
                        this.w = null,
                        this.x = null;
                        for (var _ in t)
                            this.i[_] = parseFloat(t[_], 10);
                    }
                    to(t, e) {
                        return void 0 !== e && (this.o = e),
                        this.n = t,
                        this
                    }
                    start(t) {
                        self.tweens.push(this),
                        this.l = !0,
                        this.m = !1,
                        p = void 0 !== t ? t : window.performance.now(),
                        p += u;
                        for (var o in n) {
                            if (n[o]instanceof Array) {
                                if (0 === n[o].length)
                                    continue;
                                n[o] = [e[o]].concat(n[o])
                            }
                            this.i[o] = e[o],
                            this.i[o]instanceof Array == !1 && (this.i[o] *= 1),
                            r[o] = this.i[o] || 0
                        }
                        return this
                    }
                    stop() {
                        return l ? ((i = t.indexOf(this), i !== -1 && self.tweens.splice(i, 1)),
                        l = !1,
                        null !== x && x.call(e),
                        this.stopChainedTweens(),
                        this) : this
                    }
                    stopChainedTweens() {
                        for (var t = 0, e = this.v.length; e > t; t++)
                            this.v[t].stop()
                    }
                    delay(t) {
                        return this.u = t,
                        this
                    }
                    repeat(t) {
                        return this.a = t,
                        this
                    }
                    yoyo(t) {
                        return this.h = t,
                        this
                    }
                    easing(t) {
                        return this.d = t,
                        this
                    }
                    interpolation(t) {
                        return this.f = t,
                        this
                    }
                    chain() {
                        return v = arguments,
                        this
                    }
                    onStart(t) {
                        return g = t,
                        this
                    }
                    onUpdate(t) {
                        return this.y = t,
                        this
                    }
                    onComplete(t) {
                        return this.w = t,
                        this
                    }
                    onStop(t) {
                        return this.x = t,
                        this
                    }
                    update(t) {
                        var s, l, x;
                        if (p > t)
                            return !0;
                        m === !1 && (null !== g && g.call(e),
                        m = !0),
                        l = (t - p) / o,
                        l = l > 1 ? 1 : l,
                        x = d(l);
                        for (s in n) {
                            var _ = i[s] || 0
                              , b = n[s];
                            b instanceof Array ? e[s] = f(b, x) : ("string" == typeof b && (b = _ + parseFloat(b, 10)),
                            "number" == typeof b && (e[s] = _ + (b - _) * x))
                        }
                        if (null !== y && y.call(e, x),
                        1 === l) {
                            if (a > 0) {
                                isFinite(a) && a--;
                                for (s in r) {
                                    if ("string" == typeof n[s] && (r[s] = r[s] + parseFloat(n[s], 10)),
                                    h) {
                                        var T = r[s];
                                        r[s] = n[s],
                                        n[s] = T
                                    }
                                    i[s] = r[s]
                                }
                                return h && (c = !c),
                                p = t + u,
                                !0
                            }
                            null !== w && w.call(e);
                            for (var C = 0, k = v.length; k > C; C++)
                                v[C].start(p + o);
                            return !1
                        }
                        return !0
                    }
                }
                var t = this.container
                , e = this.scene.game.pixelRatio
                , i = e / 2
                , n = {
                    scale: i
                }
                , r = {
                    scale: 1.2 * i
                };
                this.pulse = new Tween(n).to(r, 200).repeat(1).yoyo(!0).easing(function(t) {
                    return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
                }).onUpdate(function() {
                    t.scaleX = t.scaleY = this.scale
                }).start()
            }
            center_container() {
                var t = this.scene.screen
                , e = this.container;
                e.x = t.width / 2 - 100 * e.scaleX,
                e.y = t.height - 100 * e.scaleY
            }
            update = () => {

                this.player && this.player._tempVehicleTicks > 0 ? (this.center_container(),
                this.updateTime()) : this.container.visible = !1
            }
            updateTime() {
                var t = (this.container,
                this.timeText)
                , e = (this.player,
                this.player._tempVehicleTicks)
                , i = this.scene.settings.drawFPS
                , s = e / i;
                s = s.toFixed(2);
                var n = "";
                10 > s && (n = "0"),
                n += s,
                t.text = n,
                this.container.visible = !0
            }
            close() {
                this.container = null,
                this.player = null,
                this.scene = null,
                this.settings = null,
                this.timeText = null
            }
        }
    },
    70: function(t, e) {
        var Vector = t(8)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85)
          , Canopy = t(73)
          , h = {
                BALLOON_ON: "balloon_on"
            };
        class Balloon extends Vehicle {
            constructor(a, b) {
                super();
                this.vehicleInit(a),
                this.createMasses(b),
                this.createSprings(),
                this.stopSounds(),
                this.focalPoint = this.head
            }
            vehicleName = "BALLOON";
            head = null;
            basket = null;
            masses = null;
            springs = null;
            slow = !1;
            vehicleInit = this.init;
            crashed = !1;
            createMasses(t) {
                this.masses = [];
                var e = new Canopy(t.x,t.y - 10,this);
                e.radius = 30;
                var i = new Mass;
                i.init(new Vector(t.x,t.y + 35), this),
                i.friction = .1,
                this.masses.push(e),
                this.masses.push(i),
                this.head = this.masses[0],
                this.basket = this.masses[1];
                var r = this;
                this.masses[0].drive = this.head.drive = function() {
                    r.explode()
                }
            }
            updateCameraFocalPoint() {}
            createSprings() {
                this.springs = [];
                var t = new Spring(this.head,this.basket,this);
                t.springConstant = .2,
                t.dampConstant = .2,
                t.lrest = t.leff = 45,
                this.springs.push(t)
            }
            update() {
                if (this.crashed === !1 && this.updateSound(),
                this.explosion)
                    this.explosion.update();
                else {
                    this.head.wind = !this.basket.contact,
                    this.slow = !1;
                    for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                        t[i].update();
                    for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                        s[r].update();
                    for (var i = e - 1; i >= 0; i--)
                        t[i].update();
                    for (var r = n - 1; r >= 0; r--)
                        s[r].update()
                }
            }
            updateSound() {
                if (this.player.isInFocus()) {
                    var t = this.scene.sound
                    , e = this.gamepad;
                    e.isButtonDown("up") ? t.play(h.BALLOON_ON, .6) : e.isButtonDown("up") || t.stop(h.BALLOON_ON)
                }
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(h.BALLOON_ON)
            }
            draw() {
                if (this.explosion)
                    this.explosion.draw(1);
                else {
                    var t = this.scene.game.canvas.getContext("2d");
                    if (this.settings.developerMode)
                        for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                            e[s].draw();
                    t.globalAlpha = this.player._opacity,
                    this.drawBalloon(t),
                    t.globalAlpha = 1
                }
            }
            drawBalloon(t) {
                var e = this.scene
                , i = this.basket.pos.toScreen(e)
                , s = this.head.pos.toScreen(e)
                , n = e.camera.zoom
                , r = s.x - i.x
                , o = s.y - i.y
                , a = -o
                , h = r;
                t.save(),
                t.strokeStyle = window.lite.getVar("dark") ? "#666666" : "#999999",
                t.lineWidth = 1,
                t.beginPath(),
                t.moveTo(i.x + .1 * a, i.y + .1 * h),
                t.lineTo(i.x + .5 * r + .4 * a, i.y + .5 * o + .4 * h),
                t.moveTo(i.x - .1 * a, i.y - .1 * h),
                t.lineTo(i.x + .5 * r - .4 * a, i.y + .5 * o - .4 * h),
                t.moveTo(i.x + .1 * a, i.y + .1 * h),
                t.lineTo(i.x + .36 * r + .2 * a, i.y + .36 * o + .2 * h),
                t.moveTo(i.x - .1 * a, i.y - .1 * h),
                t.lineTo(i.x + .36 * r - .2 * a, i.y + .36 * o - .2 * h),
                t.closePath(),
                t.stroke(),
                this.head.draw(t),
                this.gamepad.isButtonDown("up") && (t.beginPath(),
                t.strokeStyle = "#FFFF00",
                t.lineWidth = 8 * n,
                t.moveTo(i.x, i.y),
                t.lineTo(i.x + .1 * r, i.y + .1 * o),
                t.closePath(),
                t.stroke(),
                t.beginPath(),
                t.strokeStyle = "#FFAA00",
                t.lineWidth = 3 * n,
                t.moveTo(i.x, i.y),
                t.lineTo(i.x + .1 * r, i.y + .1 * o),
                t.closePath(),
                t.stroke()),
                t.beginPath(),
                t.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.moveTo(i.x + .1 * a, i.y + .1 * h),
                t.lineTo(i.x - .1 * a, i.y - .1 * h),
                t.lineTo(i.x - .22 * r - .1 * a, i.y - .22 * o - .1 * h),
                t.lineTo(i.x - .22 * r + .1 * a, i.y - .22 * o + .1 * h),
                t.lineTo(i.x + .1 * a, i.y + .1 * h),
                t.closePath(),
                t.fill(),
                t.restore()
            }
        }
        e.exports = Balloon
    },
    71: function(t, e) {
        var Vector = t(8)
          , Mass = t(77)
          , Wheel = t(86)
          , Spring = t(83)
          , Vehicle = t(85)
          , l = {
                BLOB: "blob_sound"
        };
        class Blob extends Vehicle {
            constructor(a, b) {
                super();
                this.vehicleInit(a),
                this.createMasses(b),
                this.createSprings(),
                this.stopSounds()
            }
            vehicleName = "Blob";
            vehicleInit = this.init;
            vehicleUpdate = this.update;
            vehicleDraw = this.draw;
            masses = null;
            springs = null;
            slow = !1;
            createMasses(t) {
                var e = [];
                e.push(new Wheel(new Vector(t.x + 15,t.y + 40),this)),
                e.push(new Wheel(new Vector(t.x + -15,t.y + 40),this)),
                e.push(new Wheel(new Vector(t.x + -15,t.y + 10),this)),
                e.push(new Wheel(new Vector(t.x + 15,t.y + 10),this));
                var i = new Mass;
                i.init(new Vector(0,0), this),
                i.vel = new Vector(0,0),
                this.m0 = e[0],
                this.m1 = e[1],
                this.m2 = e[2],
                this.m3 = e[3],
                this.head = i,
                this.masses = e,
                this.focalPoint = this.head
            }
            createSprings() {
                var t = this.masses
                , e = []
                , t = this.masses
                , e = []
                , i = this.spring0 = new Spring(t[0],t[1],this)
                , s = this.spring1 = new Spring(t[1],t[2],this)
                , n = this.spring2 = new Spring(t[2],t[3],this)
                , r = this.spring3 = new Spring(t[3],t[0],this)
                , o = this.spring4 = new Spring(t[0],t[2],this)
                , h = this.spring5 = new Spring(t[1],t[3],this);
                e.push(i),
                e.push(s),
                e.push(n),
                e.push(r),
                e.push(o),
                e.push(h);
                for (var l in e)
                    e[l].springConstant = .2,
                    e[l].dampConstant = .2;
                this.springs = e
            }
            update() {
                if (this.crashed === !1 && (this.updateSound(),
                this.control()),
                this.explosion)
                    this.explosion.update();
                else {
                    var t = this.masses
                    , e = t.length
                    , i = this.springs
                    , n = i.length;
                    for (var s = n - 1; s >= 0; s--)
                        i[s].update();
                    for (var m = e - 1; m >= 0; m--)
                        t[m].update();
                    if ((t[0].contact || t[1].contact || t[2].contact || t[3].contact) && (this.slow = !1),
                    !this.slow) {
                        for (this.control(),
                        s = n - 1; s >= 0; s--)
                            i[s].update();
                        for (m = e - 1; m >= 0; m--)
                            t[m].update()
                    }
                    var r = 0
                    , o = 0;
                    for (m = 0; m < e; m++)
                        r += t[m].pos.x,
                        o += t[m].pos.y;
                    var a = this.head;
                    a.pos.x = .25 * r,
                    a.pos.y = .25 * o,
                    a.vel = t[0].vel
                }
            }
            updateSound() {
                if (this.player.isInFocus()) {
                    var t = this.scene.sound;
                    t.play(l.BLOB, .4)
                }
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(l.BLOB)
            }
            updateCameraFocalPoint() {}
            control() {
                var t, e, i = this.player.getGamepad(), s = i.isButtonDown("up"), n = i.isButtonDown("down"), r = i.isButtonDown("left"), o = i.isButtonDown("right"), a = i.isButtonDown("z"), h = this.masses, l = this.springs, c = h.length, u = l.length, p = this.dir;
                p = o ? 1 : -1;
                var d = o || r ? 1 : 0;
                for (n && (d = 0),
                t = c - 1; t >= 0; t--)
                    h[t].motor += (d * p * 1 - h[t].motor) / 10,
                    0 == d && (h[t].motor = 0),
                    h[t].brake = n;
                var f = r ? 1 : 0;
                if (f += o ? -1 : 0,
                l[4].rotate(f / 9),
                l[5].rotate(f / 9),
                a || s)
                    for (e = u - 1; e >= 0; e--)
                        l[e].contract(30, 10);
                else
                    for (e = u - 1; e >= 0; e--)
                        l[e].contract(0, 1.5)
            }
            draw() {
                if (this.explosion)
                    this.explosion.draw(1);
                else {
                    var t = this.scene.game.canvas.getContext("2d")
                    , e = this.masses
                    , i = this.scene
                    , s = i.camera.zoom
                    , n = e[0].pos.toScreen(i)
                    , r = e[1].pos.toScreen(i)
                    , o = e[2].pos.toScreen(i)
                    , a = e[3].pos.toScreen(i);
                    t.globalAlpha = this.player._opacity,
                    t.beginPath(),
                    t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                    t.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                    t.lineWidth = 20 * s,
                    t.lineCap = "round",
                    t.moveTo(n.x, n.y),
                    t.lineTo(r.x, r.y),
                    t.lineTo(o.x, o.y),
                    t.lineTo(a.x, a.y),
                    t.lineTo(n.x, n.y),
                    t.fill(),
                    t.stroke(),
                    t.globalAlpha = 1
                }
            }
        }
        e.exports = Blob
    },
    72: function(t, e) {
        var Vector = t(8)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85)
          , Wheel = t(86)
          , Ragdoll = t(82)
          , d = {
            BIKE_GROUND: "bike_ground",
            BIKE_AIR: "bike_air",
            BIKE_FALL_1: "bike_fall_1",
            BIKE_FALL_2: "bike_fall_2",
            BIKE_FALL_3: "bike_fall_3"
        };
        class Bmx extends Vehicle {
            constructor(a, b, c, d) {
                super()
                this.vehicleInit(a),
                this.createMasses(b, d),
                this.createSprings(),
                this.updateCameraFocalPoint(),
                this.stopSounds(),
                -1 === c && this.swap() 
            }
            vehicleName = "BMX";
            vehicleInit = this.init;
            vehicleUpdate = this.update;
            masses = null;
            springs = null;
            cosmetics = null;
            slow = !1;
            pedala = 0;
            cosmeticHead = null;
            cosmeticRearWheel = null;
            cosmeticFrontWheel = null;
            swapped = !1;
            ragdoll = null;
            createMasses(t, e) {
                this.masses = [];
                var i = new Mass
                , r = new Wheel(new Vector(t.x + 21,t.y + 3),this)
                , o = new Wheel(new Vector(t.x + -21,t.y + 3),this);
                i.init(new Vector(t.x,t.y - 36), this),
                i.drive = this.createRagdoll.bind(this),
                o.radius = 11.7,
                r.radius = 11.7,
                i.radius = 14,
                i.vel.equ(e),
                o.vel.equ(e),
                r.vel.equ(e),
                this.masses.push(i),
                this.masses.push(o),
                this.masses.push(r),
                this.head = i,
                this.frontWheel = r,
                this.rearWheel = o
            }
            createSprings() {
                this.springs = [];
                var t = new Spring(this.head,this.rearWheel,this)
                , e = new Spring(this.rearWheel,this.frontWheel,this)
                , i = new Spring(this.frontWheel,this.head,this);
                e.lrest = 42,
                e.leff = 42,
                e.springConstant = .35,
                e.dampConstant = .3,
                t.lrest = 45,
                t.leff = 45,
                t.springConstant = .35,
                t.dampConstant = .3,
                i.lrest = 45,
                i.leff = 45,
                i.springConstant = .35,
                i.dampConstant = .3,
                this.springs.push(t),
                this.springs.push(e),
                this.springs.push(i),
                this.rearSpring = t,
                this.chasse = e,
                this.frontSpring = i
            }
            createRagdoll() {
                this.ragdoll = new Ragdoll(this.getStickMan(),this),
                this.ragdoll.zero(this.head.vel, this.rearWheel.vel),
                this.ragdoll.dir = this.dir,
                this.rearWheel.motor = 0,
                this.rearWheel.brake = !1,
                this.frontWheel.brake = !1,
                this.head.collide = !1,
                this.updateCameraFocalPoint(),
                this.player.isInFocus() && this.playBailSound(),
                this.dead()
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(d.BIKE_AIR),
                t.stop(d.BIKE_GROUND)
            }
            playBailSound() {
                var t = this.scene.sound
                , e = min(this.speed / 50, 1)
                , i = floor(3 * random()) + 1;
                switch (i) {
                case 1:
                    t.play(d.BIKE_FALL_1, e);
                    break;
                case 2:
                    t.play(d.BIKE_FALL_2, e);
                    break;
                case 3:
                    t.play(d.BIKE_FALL_3, e)
                }
            }
            updateCameraFocalPoint() {
                this.focalPoint = this.ragdoll ? this.ragdoll.head : this.head
            }
            getStickMan() {
                var t = this.dir
                , e = this.head
                , i = this.frontWheel
                , n = this.rearWheel
                , r = this.pedala
                , o = i.pos.sub(n.pos)
                , a = e.pos.sub(i.pos.add(n.pos).factor(.5))
                , h = new Vector(o.y * t,-o.x * t)
                , l = {};
                l.head = n.pos.add(o.factor(.35)).add(a.factor(1.2)),
                l.lHand = l.rHand = n.pos.add(o.factor(.8)).add(h.factor(.68));
                var c = l.head.sub(l.lHand);
                c = new Vector(c.y * t,-c.x * t),
                l.lElbow = l.rElbow = l.head.add(l.lHand).factor(.5).add(c.factor(130 / c.lenSqr())),
                l.waist = n.pos.add(o.factor(.2)).add(h.factor(.5));
                var u = new Vector(6 * cos(r),6 * sin(r));
                return l.lFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).add(u),
                c = l.waist.sub(l.lFoot),
                c = new Vector(-c.y * t,c.x * t),
                l.lKnee = l.waist.add(l.lFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
                l.rFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).sub(u),
                c = l.waist.sub(l.rFoot),
                c = new Vector(-c.y * t,c.x * t),
                l.rKnee = l.waist.add(l.rFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
                l
            }
            update() {
                if (this.crashed === !1 && (this.updateSound(),
                this.control()),
                this.explosion)
                    this.explosion.update();
                else {
                    for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                        t[i].update();
                    for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                        s[r].update();
                    if (this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1),
                    this.slow === !1) {
                        this.crashed === !1 && this.control();
                        for (var i = e - 1; i >= 0; i--)
                            t[i].update();
                        for (var r = n - 1; r >= 0; r--)
                            s[r].update()
                    }
                    this.ragdoll ? this.ragdoll.update() : this.updateDrawHeadAngle()
                }
                this.updateCameraFocalPoint()
            }
            updateSound() {
                if (this.player.isInFocus()) {
                    this.updateSpeed();
                    var t = min(this.speed / 50, 1)
                    , e = this.scene.sound;
                    this.rearWheel.contact || this.frontWheel.contact ? (e.play(d.BIKE_GROUND, t),
                    e.stop(d.BIKE_AIR)) : (e.play(d.BIKE_AIR, t),
                    e.stop(d.BIKE_GROUND))
                }
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(d.BIKE_AIR),
                t.stop(d.BIKE_GROUND)
            }
            swap() {
                this.dir = -1 * this.dir,
                this.chasse.swap();
                var t = this.rearSpring.leff;
                this.rearSpring.leff = this.frontSpring.leff,
                this.frontSpring.leff = t
            }
            control() {
                var t = this.gamepad
                , e = t.isButtonDown("up")
                , i = t.isButtonDown("down")
                , s = t.isButtonDown("left")
                , n = t.isButtonDown("right")
                , r = t.isButtonDown("z")
                , o = e ? 1 : 0
                , a = this.rearWheel;
                a.motor += (o - a.motor) / 10,
                r && !this.swapped && (this.swap(),
                this.swapped = !0),
                r || (this.swapped = !1),
                e && (this.pedala += this.rearWheel.speed / 5),
                a.brake = i,
                i && this.frontSpring.contract(-10, 10),
                this.frontWheel.brake = this.dir > 0 && n && i ? !0 : this.dir < 0 && s && i ? !0 : !1;
                var h = s ? 1 : 0;
                h += n ? -1 : 0,
                this.rearSpring.contract(5 * h * this.dir, 5),
                this.frontSpring.contract(5 * -h * this.dir, 5),
                this.chasse.rotate(h / 6),
                !h && e && (this.rearSpring.contract(-7, 5),
                this.frontSpring.contract(7, 5))
            }
            draw() {
                if (this.explosion)
                    this.explosion.draw();
                else {
                    var t = this.scene.game.canvas.getContext("2d");
                    if (t.imageSmoothingEnabled = !0,
                    t.webkitImageSmoothingEnabled = !0,
                    t.mozImageSmoothingEnabled = !0,
                    this.settings.developerMode)
                        for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                            e[s].draw();
                    this.drawBikeFrame()
                }
            }
            clone() {
                if (this.explosion)
                    this.explosion.draw();
                else {
                    this.cloneBikeFrame()
                }
            }
            updateDrawHeadAngle() {
                var t = this.frontWheel.pos
                , e = this.rearWheel.pos
                , i = t.x
                , s = t.y
                , n = e.x
                , r = e.y
                , o = i - n
                , a = s - r;
                this.drawHeadAngle = -(atan2(o, a) - PI / 2)
            }
            drawBikeFrame(alpha = this.player._opacity, old = this) {
                var t = this.scene
                  , rearWheel = new Vector(old.rearWheel.pos.x, old.rearWheel.pos.y)
                  , frontWheel = new Vector(old.frontWheel.pos.x, old.frontWheel.pos.y)
                  , head = new Vector(old.head.pos.x, old.head.pos.y)
                  , e = rearWheel.toScreen(t)
                  , i = frontWheel.toScreen(t)
                  , n = head.toScreen(t)
                  , r = alpha
                  , o = i.sub(e)
                  , l = old.dir
                  , a = new Vector((i.y - e.y) * l,(e.x - i.x) * l)
                  , h = old.pedala
                  , c = t.camera.zoom
                  , u = t.game.canvas.getContext("2d");
                u.globalAlpha = r,
                u.strokeStyle = window.lite.getVar("red") ? "#d34836" : window.lite.getVar("orange") ? "#e8a923" : window.lite.getVar("green") ? "#46b073" : window.lite &&  window.lite.getVar("blue") ? "#3498db" : window.lite.getVar("purple") ? "#917bdf" : window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                u.lineWidth = 3 * c,
                u.lineCap = "round",
                u.lineJoin = "round",
                u.beginPath(),
                u.fillStyle = "rgba(200,200, 200, 0.2)",
                u.arc(i.x, i.y, 10.5 * c, 0, 2 * PI, !1),
                u.fill(),
                u.stroke(),
                u.beginPath(),
                u.arc(e.x, e.y, 10.5 * c, 0, 2 * PI, !1),
                u.fill(),
                u.stroke();
                var p = e.add(o.factor(.3)).add(a.factor(.25))
                , d = e.add(o.factor(.4)).add(a.factor(.05))
                , f = e.add(o.factor(.84)).add(a.factor(.42))
                , v = e.add(o.factor(.84)).add(a.factor(.37));
                u.beginPath(),
                u.strokeStyle = window.lite.getVar("red") ? "#d34836" : window.lite.getVar("orange") ? "#e8a923" : window.lite.getVar("green") ? "#46b073" : window.lite &&  window.lite.getVar("blue") ? "#3498db" : window.lite.getVar("purple") ? "#917bdf" : window.lite.getVar("dark") ? "#fdfdfd" : "rgba(0,0,0,1)",
                u.moveTo(e.x, e.y),
                u.lineTo(p.x, p.y),
                u.lineTo(f.x, f.y),
                u.moveTo(v.x, v.y),
                u.lineTo(d.x, d.y),
                u.lineTo(e.x, e.y),
                u.stroke(),
                u.beginPath(),
                u.strokeStyle = window.lite.getVar("red") ? "#d34836" : window.lite.getVar("orange") ? "#e8a923" : window.lite.getVar("green") ? "#46b073" : window.lite &&  window.lite.getVar("blue") ? "#3498db" : window.lite.getVar("purple") ? "#917bdf" : window.lite.getVar("dark") ? "#fdfdfd" : "rgba(0,0,0,1)",
                u.lineWidth = max(1 * c, .5),
                u.arc(d.x, d.y, 3 * c, 0, 2 * PI, !1),
                u.stroke();
                var g = new Vector(6 * cos(h) * c,6 * sin(h) * c)
                , m = d.add(g)
                , y = d.sub(g);
                u.beginPath(),
                u.moveTo(m.x, m.y),
                u.lineTo(y.x, y.y),
                u.stroke();
                var w = e.add(o.factor(.25)).add(a.factor(.4))
                , x = e.add(o.factor(.17)).add(a.factor(.38))
                , _ = e.add(o.factor(.3)).add(a.factor(.45));
                u.beginPath(),
                u.strokeStyle = window.lite.getVar("red") ? "#d34836" : window.lite.getVar("orange") ? "#e8a923" : window.lite.getVar("green") ? "#46b073" : window.lite &&  window.lite.getVar("blue") ? "#3498db" : window.lite.getVar("purple") ? "#917bdf" : window.lite.getVar("dark") ? "#fdfdfd" : "rgba(0,0,0,1)",
                u.lineWidth = 3 * c,
                u.moveTo(x.x, x.y),
                u.lineTo(_.x, _.y),
                u.moveTo(d.x, d.y),
                u.lineTo(w.x, w.y);
                var b = e.add(o.factor(1)).add(a.factor(0))
                , T = e.add(o.factor(.97)).add(a.factor(0))
                , C = e.add(o.factor(.8)).add(a.factor(.48));
                u.moveTo(b.x, b.y),
                u.lineTo(T.x, T.y),
                u.lineTo(C.x, C.y);
                var k = e.add(o.factor(.86)).add(a.factor(.5))
                , S = e.add(o.factor(.82)).add(a.factor(.65))
                , P = e.add(o.factor(.78)).add(a.factor(.67));
                if (u.moveTo(C.x, C.y),
                u.lineTo(k.x, k.y),
                u.lineTo(S.x, S.y),
                u.lineTo(P.x, P.y),
                u.stroke(),
                old.crashed) {
                    old.ragdoll.draw && old.ragdoll.draw();
                }
                else {
                    a = n.sub(e.add(o.factor(.5)));
                    var M = p.add(o.factor(-.1)).add(a.factor(.3))
                    , A = m.sub(M)
                    , D = new Vector(A.y * l,-A.x * l);
                    D = D.factor(c * c);
                    var I = M.add(A.factor(.5)).add(D.factor(200 / A.lenSqr()))
                    , E = m.add(A.factor(.12)).add(D.factor(50 / A.lenSqr()));
                    A = y.sub(M),
                    D = new Vector(A.y * l,-A.x * l),
                    D = D.factor(c * c);
                    var O = M.add(A.factor(.5)).add(D.factor(200 / A.lenSqr()))
                    , z = y.add(A.factor(.12)).add(D.factor(50 / A.lenSqr()));
                    u.strokeStyle = window.lite.getVar("dark") ? "#fdfdfda5" : "rgba(0,0,0,0.5)",
                    u.lineWidth = 6 * c,
                    u.beginPath(),
                    u.moveTo(y.x, y.y),
                    u.lineTo(O.x, O.y),
                    u.lineTo(M.x, M.y),
                    u.stroke(),
                    u.lineWidth = 4 * c,
                    u.beginPath(),
                    u.moveTo(y.x, y.y),
                    u.lineTo(z.x, z.y),
                    u.stroke(),
                    u.lineWidth = 6 * c,
                    u.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "rgba(0,0,0,1)",
                    u.beginPath(),
                    u.moveTo(m.x, m.y),
                    u.lineTo(I.x, I.y),
                    u.lineTo(M.x, M.y),
                    u.stroke(),
                    u.lineWidth = 6 * c,
                    u.beginPath(),
                    u.moveTo(m.x, m.y),
                    u.lineTo(E.x, E.y),
                    u.stroke();
                    var j = p.add(o.factor(.05)).add(a.factor(.9));
                    u.lineWidth = 8 * c,
                    u.beginPath(),
                    u.moveTo(M.x, M.y),
                    u.lineTo(j.x, j.y),
                    u.stroke();
                    var L = p.add(o.factor(.15)).add(a.factor(1.05));
                    o = j.sub(P),
                    a = new Vector(o.y * l,-o.x * l),
                    a = a.factor(c * c);
                    var B = P.add(o.factor(.4)).add(a.factor(130 / o.lenSqr()));
                    u.lineWidth = 5 * c,
                    u.beginPath(),
                    u.moveTo(j.x, j.y),
                    u.lineTo(B.x, B.y),
                    u.lineTo(P.x, P.y),
                    u.stroke();
                    if(window.lite.getVar("frce")) {
                        j = GameInventoryManager.getItem(window.lite.getCap())
                    } else {
                        j = GameInventoryManager.getItem(this.cosmetics.head);
                    }
                    j.draw(u, L.x, L.y, old.drawHeadAngle, c, old.dir)
                }
                u.globalAlpha = 1;
            }
            cloneBikeFrame() {
                //this.player._checkpoints = this.player._checkpoints.slice(-101);
                var op = 0;
                for(var checkpoint in this.player._checkpoints) {
                    if(checkpoint > this.player._checkpoints.length - 11) {
                        op++;
                        var alpha = .01 * op
                        this.drawBikeFrame(alpha, JSON.parse(this.player._checkpoints[checkpoint]._baseVehicle))
                    }
                }
                var al = 0;
                for(var checkpoint in this.player._checkpointsCache) {
                    if(checkpoint > this.player._checkpointsCache.length - 11) {
                        al++;
                        var alpha = .01 * al
                        this.drawBikeFrame(alpha, JSON.parse(this.player._checkpointsCache[checkpoint]._baseVehicle))
                    }
                }
            }
        }
        e.exports = Bmx;
    },
    73: function(t, e) {
        var Mass = t(77)
          , Vector = t(8);
        e.exports = class Canopy extends Mass {
            constructor(a, b, c) {
                super();
                this.init(new Vector(a, b), c),
                this.radius = 10,
                this.collide = !0,
                this.wind = !0
            }
            drive(t, e) {
                var i = this.pos
                  , s = this.vel;
                i.x += .05 * t * -t * (t * s.x + e * s.y),
                this.contact = !0
            }
            update() {
                var t = this.vel
                  , e = this.pos
                  , i = this.old
                  , s = this.parent.gravity
                  , n = this.parent.gamepad
                  , r = n.isButtonDown("up")
                  , o = n.isButtonDown("left")
                  , a = n.isButtonDown("right");
                (0 !== s.x || 0 !== s.y) && (t.x = .9 * t.x,
                t.y = .99 * t.y),
                o && (e.x += -.05),
                a && (e.x += .05),
                (0 !== s.x || 0 !== s.y) && (e.y += -.1),
                r && (e.y += -.5),
                this.wind && (e.x += .3),
                e.x += t.x,
                e.y += t.y,
                this.contact = !1,
                this.collide && this.scene.track.collide(this),
                (0 !== s.x || 0 !== s.y) && (t.x = e.x - i.x,
                t.y = e.y - i.y),
                i.x = e.x,
                i.y = e.y
            }
            draw(t) {
                var e = this.parent.scene
                  , i = this.pos.toScreen(e)
                  , s = this.radius * e.camera.zoom;
                t.beginPath(),
                t.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.arc(i.x, i.y, s, 0, 2 * PI, !1),
                t.closePath(),
                t.fill()
            }
        }
    },
    74: function(t, e) {
        var Mass = t(77);
        e.exports = class Debris extends Mass {
            constructor(a, b, c) {
                super();
                this.massInit(a, b),
                this.color = c,
                this.pos.x = a.x + 5 * (random() - random()),
                this.pos.y = a.y + 5 * (random() - random()),
                this.old.x = this.pos.x,
                this.old.y = this.pos.y,
                this.vel.y = 11 * (random() - random()),
                this.vel.x = 11 * (random() - random()),
                this.radius = 2 * random() * 5,
                this.angle = 6.2 * random(),
                this.speed = 1 * random() - 1 * random(),
                this.friction = .05
            }
            massInit = this.init;
            massUpdate = this.update;
            color = "black";
            drive(t, e) {
                var i = this.vel
                , s = this.pos;
                this.speed = (t * i.x + e * i.y) / this.radius,
                this.angle += this.speed;
                var n = -(t * i.x + e * i.y) * this.friction;
                s.x += t * n,
                s.y += e * n;
                var a = sqrt(pow(t, 2) + pow(e, 2));
                if (a > 0) {
                    var h = -e / a
                    , l = t / a
                    , c = .8 * (h * i.x + l * i.y);
                    this.old.x += h * c,
                    this.old.y += l * c
                }
            }
            update = () => {
                this.angle += this.speed,
                this.massUpdate()
            }
            draw() {
                var t = this.scene.screen
                , e = this.scene.camera
                , i = t.realToScreen(this.pos.x, "x")
                , s = t.realToScreen(this.pos.y, "y")
                , n = 0
                , r = e.zoom
                , o = this.angle
                , c = 1 * r * this.radius
                , u = i + c * cos(o)
                , p = s + c * sin(o)
                , d = this.scene.game.canvas.getContext("2d");
                for (d.lineWidth = 1 * r,
                d.strokeStyle = window.lite.getVar("dark") && "#ffffff" || "#000000",
                d.beginPath(),
                d.moveTo(u, p),
                d.fillStyle = this.color; n++ < 8; )
                    c = [1, .7, .8, .9, .5, 1, .7, 1][n - 1] * r * this.radius,
                    u = i + c * cos(o + 6.283 * n / 8),
                    p = s + c * sin(o + 6.283 * n / 8),
                    d.lineTo(u, p);
                d.fill(),
                d.stroke()
            }
        }
    },
    75: function(t, e) {
        var Vector = t(8)
          , Debris = t(74);
        e.exports = class Explosion {
            constructor(a, b) {
                this.time = 20,
                this.gravity = new Vector(0,.3),
                this.scene = b,
                this.createMasses(a),
                this.positionX = a.x,
                this.positionY = a.y
            }
            vehicleInit = this.init;
            complete = !1;
            time = 0;
            powerupsEnabled = !1;
            draw(t) {
                var e = this.time
                , i = this.positionX
                , s = this.positionY
                , n = this.scene.camera.zoom
                , h = this.scene.screen
                , l = this.scene.game.canvas.getContext("2d");
                if (l.globalAlpha = t,
                e > 0) {
                    e -= 10;
                    var c = h.realToScreen(i, "x")
                    , u = h.realToScreen(s, "y")
                    , p = 0
                    , d = 6.2 * random()
                    , f = e * n
                    , v = c + f * cos(d)
                    , g = u + f * sin(d);
                    for (l.lineWidth = 0,
                    l.strokeStyle = window.lite.getVar("dark") && "white" || "black",
                    l.beginPath(),
                    l.moveTo(v, g),
                    l.fillStyle = window.lite.getVar("dark") && "white" || "black"; p++ < 16; )
                        f = (e + 30 * random()) * n,
                        v = c + f * cos(d + 6.283 * p / 16),
                        g = u + f * sin(d + 6.283 * p / 16),
                        l.lineTo(v, g);
                    l.fill(),
                    l.stroke()
                }
                var m = this.masses;
                for (var y in m)
                    m[y].draw();
                l.globalAlpha = 1,
                this.time = e
            }
            createMasses(t) {
                this.masses = [],
                this.masses.push(new Debris(t,this,window.lite.getVar("dark") && "#ffffff" || "#000000")),
                this.masses.push(new Debris(t,this,window.lite.getVar("dark") && "#ffffff" || "#000000")),
                this.masses.push(new Debris(t,this,window.lite.getVar("dark") && "#ffffff" || "#000000")),
                this.masses.push(new Debris(t,this,window.lite.getVar("dark") && "#ffffff" || "#000000")),
                this.masses.push(new Debris(t,this,window.lite.getVar("dark") && "#ffffff" || "#000000")),
                this.masses.push(new Debris(t,this,window.lite.getVar("dark") && "#ffffff" || "#000000")),
                this.masses.push(new Debris(t,this,window.lite.getVar("dark") && "#ffffff" || "#000000"))
            }
            update() {
                var t = this.masses;
                for (var e in t)
                    t[e].update()
            }
        }
    },
    76: function(t, e) {
        var Vector = t(8)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85)
          , Prop = t(81)
          , c = {
            HELICOPTER: "helicopter"
        };
        e.exports = class Heli extends Vehicle {
            constructor(a, b, c) {
                super();
                this.vehicleInit(a),
                this.createMasses(b),
                this.createSprings(),
                this.createCockpit(),
                this.updateCameraFocalPoint(),
                this.stopSounds(),
                -1 === c && this.swap()
            }
            vehicleName = "Helicopter";
            vehicleInit = this.init;
            vehicleUpdate = this.update;
            vehicleDraw = this.draw;
            masses = null;
            springs = null;
            slow = !1;
            swapped = !1;
            createCockpit() {
                var t = document.createElement("canvas");
                this.canvasCockpit = t
            }
            drawCockpit() {
                var t = this.canvasCockpit
                , e = this.masses
                , i = this.scene
                , s = i.camera.zoom
                , n = e[0].radius * s * .9
                , r = 50 * s
                , o = 50 * s;
                t.width = r,
                t.height = o;
                var a = 0
                , h = 0
                , l = max(2 * s, 1)
                , c = t.getContext("2d");
                c.save(),
                c.translate(r / 2, o / 2),
                c.scale(1.3, 1),
                c.beginPath(),
                c.arc(0, 0, n, 0, 1.5 * PI, !1),
                c.lineTo(a, h),
                c.lineTo(a + n, h),
                c.closePath(),
                c.restore(),
                c.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                c.fill(),
                c.lineWidth = l,
                c.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "black",
                c.stroke(),
                c.save(),
                c.translate(r / 2, o / 2),
                c.scale(1.3, 1),
                c.beginPath(),
                c.arc(a, h, n, 0, 1.5 * PI, !0),
                c.restore(),
                c.lineWidth = l,
                c.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "black",
                c.stroke()
            }
            createMasses(t) {
                var e = [];
                e.push(new Prop(new Vector(t.x + 0,t.y + 18),this));
                var i = new Mass
                , r = new Mass
                , o = new Mass
                , h = new Mass;
                i.init(new Vector(t.x + -17,t.y + 42), this),
                r.init(new Vector(t.x + 17,t.y + 42), this),
                o.init(new Vector(t.x + -40,t.y + 15), this),
                h.init(new Vector(t.x + 40,t.y + 15), this),
                e.push(i),
                e.push(r),
                e.push(o),
                e.push(h),
                e[0].radius = 18,
                e[1].radius = 8,
                e[2].radius = 8,
                e[3].grav = !1,
                e[4].grav = e[4].collide = !1,
                e[1].friction = .2,
                e[2].friction = .2,
                this.head = e[0],
                this.mass2 = e[1],
                this.mass3 = e[2],
                this.mass4 = e[3],
                this.rotor = 0,
                this.rotor2 = 0,
                this.dir = 1;
                var l = this;
                e[3].drive = this.head.drive = function() {
                    l.explode()
                }
                this.focalPoint = e[0],
                this.masses = e
            }
            createSprings() {
                var t = this.masses
                , e = [];
                e.push(new Spring(t[0],t[1],this)),
                e.push(new Spring(t[2],t[0],this)),
                e.push(new Spring(t[2],t[1],this)),
                e.push(new Spring(t[0],t[3],this)),
                e.push(new Spring(t[1],t[3],this)),
                e.push(new Spring(t[0],t[4],this)),
                e.push(new Spring(t[2],t[4],this)),
                this.spring1 = e[0],
                this.spring2 = e[1],
                this.spring3 = e[2],
                this.spring4 = e[3],
                this.spring5 = e[4],
                this.spring6 = e[5],
                this.spring7 = e[6],
                e[0].leff = e[4].lrest = 30,
                e[1].leff = e[4].lrest = 30,
                e[2].leff = e[4].lrest = 35,
                e[4].leff = e[4].lrest = 35,
                e[6].leff = e[4].lrest = 35;
                for (var i in e)
                    e[i].dampConstant = .4;
                for (var i in e)
                    e[i].springConstant = .5;
                this.springs = e
            }
            updateCameraFocalPoint() {}
            update() {
                if (this.crashed === !1 && (this.updateSound(),
                this.control()),
                this.explosion)
                    this.explosion.update();
                else {
                    for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                        t[i].update();
                    for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                        s[r].update();
                    if ((this.masses[1].contact || this.masses[2].contact) && (this.slow = !1),
                    this.slow === !1) {
                        this.crashed === !1 && this.control();
                        for (var i = e - 1; i >= 0; i--)
                            t[i].update();
                        for (var r = n - 1; r >= 0; r--)
                            s[r].update()
                    }
                    this.updateCockpitAngle()
                }
            }
            updateSound() {
                if (this.player.isInFocus()) {
                    var t = this.scene.sound
                    , e = min(this.head.motor, 1);
                    t.play(c.HELICOPTER, e)
                }
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(c.HELICOPTER)
            }
            swap() {
                var t = this.dir
                , e = this.springs
                , i = this.masses;
                t = -1 * t,
                e[2].swap();
                var n = new Vector(0,0)
                , r = new Vector(0,0)
                , o = new Vector(0,0);
                n.equ(i[3].pos),
                r.equ(i[3].old),
                o.equ(i[3].vel),
                i[3].pos.equ(i[4].pos),
                i[3].old.equ(i[4].old),
                i[3].vel.equ(i[4].vel),
                i[4].pos.equ(n),
                i[4].old.equ(r),
                i[4].vel.equ(o),
                this.dir = t
            }
            control() {
                var t = this.player.getGamepad()
                , e = t.isButtonDown("up")
                , i = t.isButtonDown("back")
                , s = t.isButtonDown("left")
                , n = t.isButtonDown("right")
                , r = t.isButtonDown("z")
                , o = this.masses
                , a = this.springs;
                r && !this.swapped && (this.swap(),
                this.swapped = !0),
                r || (this.swapped = !1);
                var h = o[1].pos.add(o[2].pos).factor(.5);
                h = o[0].pos.sub(h),
                h = h.factor(1 / h.len()),
                o[0].angle.equ(h);
                var l = e ? 1 : 0;
                o[0].motor += (l - o[0].motor) / 10;
                var c = s ? 1 : 0;
                c += n ? -1 : 0,
                a[2].rotate(c / 6),
                i && (this.scene.restartTrack = !0)
            }
            updateCockpitAngle() {
                var t = this.masses
                , e = t[0].pos
                , i = t[3].pos
                , s = e.x
                , n = e.y
                , r = i.x
                , o = i.y
                , a = s - r
                , l = n - o;
                this.cockpitAngle = -(atan2(a, l) - PI / 2)
            }
            draw() {
                if (this.explosion)
                    this.explosion.draw(1);
                else {
                    var t = this.scene.game.canvas.getContext("2d");
                    t.imageSmoothingEnabled = !0,
                    t.webkitImageSmoothingEnabled = !0,
                    t.mozImageSmoothingEnabled = !0,
                    t.globalAlpha = this.player._opacity;
                    var e = this.masses
                    , i = this.dir
                    , n = this.rotor
                    , r = this.rotor2
                    , o = this.scene
                    , a = o.camera.zoom
                    , h = e[1].pos.add(e[2].pos).factor(.5);
                    h = e[0].pos.sub(h).factor(a);
                    var l = new Vector(-h.y * i,h.x * i)
                    , c = e[0].pos.toScreen(o);
                    n += .5 * e[0].motor + .05,
                    n > 6.2831 && (n -= 6.2831),
                    r += .5,
                    r > 6.2831 && (r -= 6.2831),
                    this.rotor = n,
                    this.rotor2 = r,
                    t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                    t.lineWidth = 5 * a,
                    t.beginPath(),
                    t.moveTo(c.x + .5 * h.x, c.y + .5 * h.y),
                    t.lineTo(c.x + .8 * h.x, c.y + .8 * h.y),
                    t.stroke(),
                    t.lineWidth = 3 * a,
                    t.beginPath();
                    var u = .9 * cos(n);
                    t.moveTo(c.x + .9 * h.x + l.x * u, c.y + .8 * h.y + l.y * u),
                    t.lineTo(c.x + .9 * h.x - l.x * u, c.y + .8 * h.y - l.y * u),
                    t.stroke();
                    var p = e[1].pos.toScreen(o)
                    , d = e[2].pos.toScreen(o);
                    t.lineWidth = 4 * a,
                    t.stokeStyle = "#666666",
                    t.beginPath(),
                    t.moveTo(p.x - .2 * l.x - .1 * h.x, p.y - .2 * l.y - .1 * h.y),
                    t.lineTo(p.x - .25 * h.x, p.y - .25 * h.y),
                    t.lineTo(d.x - .25 * h.x, d.y - .25 * h.y),
                    t.lineTo(d.x + .2 * l.x - .1 * h.x, d.y + .2 * l.y - .1 * h.y),
                    t.stroke(),
                    t.lineWidth = 3 * a,
                    t.beginPath(),
                    t.moveTo(p.x - .2 * h.x, p.y - .2 * h.y),
                    t.lineTo(c.x, c.y),
                    t.lineTo(d.x - .2 * h.x, d.y - .2 * h.y),
                    t.stroke(),
                    t.lineWidth = 6 * a,
                    t.stokeStyle = "#000000",
                    t.beginPath();
                    var f = e[3].pos.toScreen(o);
                    t.moveTo(c.x, c.y),
                    t.lineTo(f.x, f.y),
                    t.lineTo(c.x - .1 * h.x, c.y - .3 * h.y),
                    t.stroke(),
                    t.lineWidth = 2 * a,
                    t.stokeStyle = "#000000",
                    t.beginPath();
                    var v = 7 * a
                    , g = new Vector(v * sin(-r),v * cos(-r));
                    t.moveTo(f.x + g.x, f.y + g.y),
                    t.lineTo(f.x - g.x, f.y - g.y),
                    t.moveTo(f.x - g.y, f.y + g.x),
                    t.lineTo(f.x + g.y, f.y - g.x),
                    t.stroke(),
                    t.beginPath(),
                    t.lineWidth = 2 * a,
                    t.arc(f.x, f.y, e[3].radius * a, 0, 2 * PI, !1),
                    t.stroke();
                    {
                        c.x,
                        c.y
                    }
                    this.drawCockpit();
                    var m = this.canvasCockpit
                    , y = m.width
                    , w = m.height
                    , x = c.x + 5 * a * this.dir
                    , _ = c.y + 2 * a
                    , b = 0
                    , T = 0
                    , C = y
                    , k = w
                    , S = b * a - C / 2
                    , P = T * a - k / 2
                    , M = this.cockpitAngle
                    , A = -1 === i
                    , D = this.cosmetics
                    , I = GameInventoryManager.getItem(D.head)
                    , E = this.cockpitAngle;
                    I.draw(t, x + 5 * a * i, _ - 5 * a, E, .7 * a, i),
                    t.translate(x, _),
                    t.rotate(M),
                    A && t.scale(1, -1),
                    t.drawImage(m, S, P, C, k),
                    A && t.scale(1, -1),
                    t.rotate(-M),
                    t.translate(-x, -_),
                    t.globalAlpha = 1
                }
            }
        }
    },
    77: function(t, e) {
        var Vector = t(8);
        e.exports = class Mass {
            pos = null;
            old = null;
            vel = null;
            parent = null;
            radius = 0;
            friction = 0;
            collide = !1;
            contact = !1;
            scene = null;
            drawPos = null;
            init(a, e) {
                this.pos = new Vector,
                this.old = new Vector,
                this.vel = new Vector(0,0),
                this.drawPos = new Vector(0,0),
                this.radius = 10,
                this.friction = 0,
                this.parent = e,
                this.collide = !0,
                this.contact = !1,
                this.scene = e.scene,
                this.pos.equ(a),
                this.old.equ(a)
            }
            drive(a, e) {
                var i = this.friction
                  , s = -(a * this.vel.x + e * this.vel.y) * i;
                a *= s,
                e *= s,
                this.pos.x += a,
                this.pos.y += e,
                this.contact = !0
            }
            update() {
                var t = this.vel;
                t.inc(this.parent.gravity);
                var e = this.parent.gravity;
                (0 != e.x || 0 != e.y) && (t.x = .99 * t.x,
                t.y = .99 * t.y),
                this.pos.inc(this.vel),
                this.contact = !1,
                this.collide && this.scene.track.collide(this),
                t.x = this.pos.x - this.old.x,
                t.y = this.pos.y - this.old.y,
                this.old.equ(this.pos)
            }
            draw() {
                var t = this.pos.toScreen(this.scene)
                  , e = this.scene.game.canvas.getContext("2d")
                  , i = this.scene.camera.zoom;
                e.beginPath(),
                e.fillStyle = "rgba(0,0,0,1)",
                e.arc(t.x, t.y, this.radius * i, 0, 2 * PI, !1),
                e.fill(),
                e.closePath()
            }
        }
    },
    78: function(t, e) {
        var Vector = t(8)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85)
          , Wheel = t(86)
          , Ragdoll = t(82)
          , d = {
            BIKE_GROUND: "bike_ground",
            BIKE_AIR: "bike_air",
            BIKE_FALL_1: "bike_fall_1",
            BIKE_FALL_2: "bike_fall_2",
            BIKE_FALL_3: "bike_fall_3"
        };
        e.exports = class Mtb extends Vehicle {
            constructor(a, b, c, d) {
                super();
                this.color = "rgba(0,0,0,1)",
                this.vehicleInit(a),
                this.createMasses(b, d),
                this.createSprings(),
                this.updateCameraFocalPoint(),
                this.stopSounds(),
                -1 === c && this.swap()
            }
            vehicleName = "MTB";
            vehicleInit = this.init;
            vehicleUpdate = this.update;
            vehicleControl = this.control;
            vehicleDraw = this.draw;
            masses = null;
            springs = null;
            cosmetics = null;
            slow = !1;
            pedala = 0;
            swapped = !1;
            ragdoll = null;
            crashed = !1;
            createMasses(t, e) {
                this.masses = [];
                var i = new Mass
                , r = new Wheel(new Vector(t.x + 23,t.y),this)
                , o = new Wheel(new Vector(t.x + -23,t.y),this);
                i.init(new Vector(t.x + 2,t.y + -38), this),
                i.drive = this.createRagdoll.bind(this),
                o.radius = 14,
                r.radius = 14,
                i.radius = 14,
                i.vel.equ(e),
                o.vel.equ(e),
                r.vel.equ(e),
                this.masses.push(i),
                this.masses.push(o),
                this.masses.push(r),
                this.head = i,
                this.frontWheel = r,
                this.rearWheel = o
            }
            createSprings() {
                this.springs = [];
                var t = new Spring(this.head,this.rearWheel,this)
                , e = new Spring(this.rearWheel,this.frontWheel,this)
                , i = new Spring(this.frontWheel,this.head,this);
                e.lrest = 45,
                e.leff = 45,
                e.springConstant = .2,
                e.dampConstant = .3,
                t.lrest = 47,
                t.leff = 47,
                t.springConstant = .2,
                t.dampConstant = .3,
                i.lrest = 45,
                i.leff = 45,
                i.springConstant = .2,
                i.dampConstant = .3,
                this.springs.push(t),
                this.springs.push(e),
                this.springs.push(i),
                this.rearSpring = t,
                this.chasse = e,
                this.frontSpring = i
            }
            createRagdoll() {
                this.ragdoll = new Ragdoll(this.getStickMan(),this),
                this.ragdoll.zero(this.head.vel, this.rearWheel.vel),
                this.ragdoll.dir = this.dir,
                this.rearWheel.motor = 0,
                this.rearWheel.brake = !1,
                this.frontWheel.brake = !1,
                this.head.collide = !1,
                this.player.isInFocus() && this.playBailSound(),
                this.dead()
            }
            playBailSound() {
                var t = this.scene.sound
                , e = min(this.speed / 50, 1)
                , i = floor(3 * random()) + 1;
                switch (i) {
                case 1:
                    t.play(d.BIKE_FALL_1, e);
                    break;
                case 2:
                    t.play(d.BIKE_FALL_2, e);
                    break;
                case 3:
                    t.play(d.BIKE_FALL_3, e)
                }
            }
            updateCameraFocalPoint() {
                this.focalPoint = this.ragdoll ? this.ragdoll.head : this.head
            }
            getStickMan() {
                var t = this.dir
                , e = this.head
                , i = this.frontWheel
                , n = this.rearWheel
                , r = this.pedala
                , o = i.pos.sub(n.pos)
                , a = e.pos.sub(i.pos.add(n.pos).factor(.5))
                , h = new Vector(o.y * t,-o.x * t)
                , l = {};
                l.head = n.pos.add(o.factor(.35)).add(a.factor(1.2)),
                l.lHand = l.rHand = n.pos.add(o.factor(.8)).add(h.factor(.68));
                var c = l.head.sub(l.lHand);
                c = new Vector(c.y * t,-c.x * t),
                l.lElbow = l.rElbow = l.head.add(l.lHand).factor(.5).add(c.factor(130 / c.lenSqr())),
                l.waist = n.pos.add(o.factor(.2)).add(h.factor(.5));
                var u = new Vector(6 * cos(r),6 * sin(r));
                return l.lFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).add(u),
                c = l.waist.sub(l.lFoot),
                c = new Vector(-c.y * t,c.x * t),
                l.lKnee = l.waist.add(l.lFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
                l.rFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).sub(u),
                c = l.waist.sub(l.rFoot),
                c = new Vector(-c.y * t,c.x * t),
                l.rKnee = l.waist.add(l.rFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
                l
            }
            update() {
                if (this.crashed === !1 && (this.updateSound(),
                this.control()),
                this.explosion)
                    this.explosion.update();
                else {
                    for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                        t[i].update();
                    for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                        s[r].update();
                    if (this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1),
                    this.slow === !1) {
                        this.crashed === !1 && this.control();
                        for (var i = e - 1; i >= 0; i--)
                            t[i].update();
                        for (var r = n - 1; r >= 0; r--)
                            s[r].update()
                    }
                    this.ragdoll ? this.ragdoll.update() : this.updateDrawHeadAngle()
                }
                this.updateCameraFocalPoint()
            }
            updateSound() {
                if (this.player.isInFocus()) {
                    this.updateSpeed();
                    var t = min(this.speed / 50, 1)
                    , e = this.scene.sound;
                    this.rearWheel.contact || this.frontWheel.contact ? (e.play(d.BIKE_GROUND, t),
                    e.stop(d.BIKE_AIR)) : (e.play(d.BIKE_AIR, t),
                    e.stop(d.BIKE_GROUND))
                }
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(d.BIKE_AIR),
                t.stop(d.BIKE_GROUND)
            }
            updateDrawHeadAngle() {
                var t = this.frontWheel.pos
                , e = this.rearWheel.pos
                , i = t.x
                , s = t.y
                , n = e.x
                , r = e.y
                , o = i - n
                , a = s - r;
                this.drawHeadAngle = -(atan2(o, a) - PI / 2)
            }
            swap() {
                this.dir = -1 * this.dir,
                this.chasse.swap();
                var t = this.rearSpring.leff;
                this.rearSpring.leff = this.frontSpring.leff,
                this.frontSpring.leff = t
            }
            control() {
                var t = this.gamepad
                , e = t.isButtonDown("up")
                , i = t.isButtonDown("down")
                , s = t.isButtonDown("left")
                , n = t.isButtonDown("right")
                , r = t.isButtonDown("z")
                , o = e ? 1 : 0
                , a = this.rearWheel;
                a.motor += (o - a.motor) / 10,
                r && !this.swapped && (this.swap(),
                this.swapped = !0),
                r || (this.swapped = !1),
                e && (this.pedala += this.rearWheel.speed / 5),
                a.brake = i,
                this.frontWheel.brake = this.dir > 0 && n && i ? !0 : this.dir < 0 && s && i ? !0 : !1;
                var h = s ? 1 : 0;
                h += n ? -1 : 0,
                this.rearSpring.contract(5 * h * this.dir, 5),
                this.frontSpring.contract(5 * -h * this.dir, 5),
                this.chasse.rotate(h / 8),
                !h && e && (this.rearSpring.contract(-7, 5),
                this.frontSpring.contract(7, 5))
            }
            draw() {
                if (this.explosion)
                    this.explosion.draw(1);
                else {
                    var t = this.scene.game.canvas.getContext("2d");
                    if (t.imageSmoothingEnabled = !0,
                    t.mozImageSmoothingEnabled = !0,
                    t.oImageSmoothingEnabled = !0,
                    t.webkitImageSmoothingEnabled = !0,
                    this.settings.developerMode)
                        for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                            e[s].draw();
                    this.drawBikeFrame()
                }
            }
            clone() {
                if (this.explosion)
                    this.explosion.draw(1);
                else {
                    this.cloneBikeFrame()
                }
            }
            drawBikeFrame(alpha = this.player._opacity, old = this) {
                var t = this.scene
                  , frontWheel = new Vector(old.frontWheel.pos.x, old.frontWheel.pos.y)
                  , rearWheel = new Vector(old.rearWheel.pos.x, old.rearWheel.pos.y)
                  , head = new Vector(old.head.pos.x, old.head.pos.y)
                  , e = frontWheel.toScreen(t)
                  , i = rearWheel.toScreen(t)
                  , n = head.toScreen(t)
                  , r = t.camera.zoom
                    , o = t.game.canvas.getContext("2d")
                    , a = alpha
                    , h = e.sub(i)
                    , l = new Vector((e.y - i.y) * old.dir,(i.x - e.x) * old.dir)
                    , c = h.factor(.5);
                i.addOut(c, c),
                n.subOut(c, c),
                o.globalAlpha = a,
                o.strokeStyle = window.lite.getVar("red") ? "#d34836" : window.lite.getVar("orange") ? "#e8a923" : window.lite.getVar("green") ? "#46b073" : window.lite &&  window.lite.getVar("blue") ? "#3498db" : window.lite.getVar("purple") ? "#917bdf" : window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                o.lineWidth = 3 * r,
                o.lineCap = "round",
                o.lineJoin = "round",
                o.beginPath(),
                o.fillStyle = "rgba(200,200, 200,0.2)",
                o.arc(e.x, e.y, 12.5 * r, 0, 2 * PI, !1),
                o.fill(),
                o.stroke(),
                o.beginPath(),
                o.arc(i.x, i.y, 12.5 * r, 0, 2 * PI, !1),
                o.fill(),
                o.stroke(),
                o.strokeStyle = "rgba(153, 153, 153,1)",
                o.fillStyle = "rgba(204, 204, 204,1)",
                o.lineWidth = 1,
                o.beginPath(),
                o.arc(e.x, e.y, 6 * r, 0, 2 * PI, !1),
                o.fill(),
                o.stroke(),
                o.beginPath(),
                o.arc(i.x, i.y, 6 * r, 0, 2 * PI, !1),
                o.fill(),
                o.stroke(),
                o.beginPath(),
                o.strokeStyle = window.lite.getVar("red") ? "#d34836" : window.lite.getVar("orange") ? "#e8a923" : window.lite.getVar("green") ? "#46b073" : window.lite &&  window.lite.getVar("blue") ? "#3498db" : window.lite.getVar("purple") ? "#917bdf" : window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                o.lineWidth = 5 * r,
                o.moveTo(i.x, i.y),
                o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
                o.moveTo(i.x + .72 * h.x + .64 * c.x, i.y + .72 * h.y + .64 * c.y),
                o.lineTo(i.x + .46 * h.x + .4 * c.x, i.y + .46 * h.y + .4 * c.y),
                o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
                o.stroke(),
                o.beginPath(),
                o.lineWidth = 2 * r,
                o.strokeStyle = window.lite.getVar("red") ? "#d34836" : window.lite.getVar("orange") ? "#e8a923" : window.lite.getVar("green") ? "#46b073" : window.lite &&  window.lite.getVar("blue") ? "#3498db" : window.lite.getVar("purple") ? "#917bdf" : window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                o.moveTo(i.x + .72 * h.x + .64 * c.x, i.y + .72 * h.y + .64 * c.y),
                o.lineTo(i.x + .43 * h.x + .05 * l.x, i.y + .43 * h.y + .05 * l.y),
                o.stroke(),
                o.beginPath(),
                o.lineWidth = 1 * r,
                o.moveTo(i.x + .46 * h.x + .4 * c.x, i.y + .46 * h.y + .4 * c.y),
                o.lineTo(i.x + .28 * h.x + .5 * c.x, i.y + .28 * h.y + .5 * c.y),
                o.stroke(),
                o.beginPath(),
                o.lineWidth = 2 * r,
                o.moveTo(i.x + .45 * h.x + .3 * c.x, i.y + .45 * h.y + .3 * c.y),
                o.lineTo(i.x + .3 * h.x + .4 * c.x, i.y + .3 * h.y + .4 * c.y),
                o.lineTo(i.x + .25 * h.x + .6 * c.x, i.y + .25 * h.y + .6 * c.y),
                o.moveTo(i.x + .17 * h.x + .6 * c.x, i.y + .17 * h.y + .6 * c.y),
                o.lineTo(i.x + .3 * h.x + .6 * c.x, i.y + .3 * h.y + .6 * c.y),
                o.stroke(),
                o.beginPath(),
                o.lineWidth = 3 * r,
                o.moveTo(e.x, e.y),
                o.lineTo(i.x + .71 * h.x + .73 * c.x, i.y + .71 * h.y + .73 * c.y),
                o.lineTo(i.x + .73 * h.x + .77 * c.x, i.y + .73 * h.y + .77 * c.y),
                o.lineTo(i.x + .7 * h.x + .8 * c.x, i.y + .7 * h.y + .8 * c.y),
                o.stroke(),
                o.beginPath(),
                o.lineWidth = 1 * r;
                var u = new Vector(6 * cos(this.pedala) * r,6 * sin(this.pedala) * r);
                if (o.moveTo(i.x + .43 * h.x + .05 * l.x + u.x, i.y + .43 * h.y + .05 * l.y + u.y),
                o.lineTo(i.x + .43 * h.x + .05 * l.x - u.x, i.y + .43 * h.y + .05 * l.y - u.y),
                o.stroke(),
                old.crashed)
                    this.ragdoll && this.ragdoll.draw();
                else {
                    h.factorOut(.5, l),
                    i.addOut(l, l),
                    n.subOut(l, l);
                    var p = h.factor(.3);
                    p.x = i.x + p.x + .25 * l.x,
                    p.y = i.y + p.y + .25 * l.y;
                    var d = h.factor(.4);
                    d.x = i.x + d.x + .05 * l.x,
                    d.y = i.y + d.y + .05 * l.y;
                    var f = d.add(u)
                    , v = d.sub(u)
                    , g = h.factor(.67);
                    g.x = i.x + g.x + .8 * l.x,
                    g.y = i.y + g.y + .8 * l.y;
                    var m = h.factor(-.05);
                    m.x = p.x + m.x + .42 * l.x,
                    m.y = p.y + m.y + .42 * l.y;
                    var y = f.sub(m)
                    , w = y.lenSqr();
                    c.x = y.y * this.dir,
                    c.y = -y.x * this.dir,
                    c.factorSelf(r * r);
                    var x = y.factor(.5);
                    x.x = m.x + x.x + c.x * (200 / y.lenSqr()),
                    x.y = m.y + x.y + c.y * (200 / y.lenSqr());
                    var _ = y.factor(.12);
                    _.x = f.x + _.x + c.x * (50 / w),
                    _.y = f.y + _.y + c.y * (50 / w),
                    v.subOut(m, y),
                    w = y.lenSqr(),
                    c.x = y.y * this.dir,
                    c.y = -y.x * this.dir,
                    c.factorSelf(r * r);
                    var b = y.factor(.5);
                    b.x = m.x + b.x + c.x * (200 / w),
                    b.y = m.y + b.y + c.y * (200 / w);
                    var T = y.factor(.12);
                    T.x = v.x + T.x + c.x * (50 / w),
                    T.y = v.y + T.y + c.y * (50 / w),
                    o.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "rgba(0,0,0," + .5 * a + ")",
                    o.lineWidth = 6 * r,
                    o.beginPath(),
                    o.moveTo(v.x, v.y),
                    o.lineTo(b.x, b.y),
                    o.lineTo(m.x, m.y),
                    o.stroke(),
                    o.lineWidth = 4 * r,
                    o.beginPath(),
                    o.moveTo(v.x, v.y),
                    o.lineTo(T.x, T.y),
                    o.stroke(),
                    o.lineWidth = 6 * r,
                    o.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                    o.beginPath(),
                    o.moveTo(f.x, f.y),
                    o.lineTo(x.x, x.y),
                    o.lineTo(m.x, m.y),
                    o.stroke(),
                    o.lineWidth = 4 * r,
                    o.beginPath(),
                    o.moveTo(f.x, f.y),
                    o.lineTo(_.x, _.y),
                    o.stroke();
                    var C = h.factor(.1);
                    C.x = p.x + C.x + .95 * l.x,
                    C.y = p.y + C.y + .95 * l.y,
                    o.lineWidth = 8 * r,
                    o.beginPath(),
                    o.moveTo(m.x, m.y),
                    o.lineTo(C.x, C.y),
                    o.stroke();
                    var k = h.factor(.2);
                    k.x = p.x + k.x + 1.09 * l.x,
                    k.y = p.y + k.y + 1.09 * l.y,
                    o.beginPath(),
                    o.lineWidth = 2 * r,
                    C.subOut(g, h);
                    var S = h.lenSqr();
                    l.x = h.y * old.dir,
                    l.y = -h.x * old.dir,
                    l.factorSelf(r * r);
                    var P = h.factor(.3);
                    P.x = g.x + P.x + l.x * (80 / S),
                    P.y = g.y + P.y + l.y * (80 / S),
                    o.lineWidth = 5 * r,
                    o.beginPath(),
                    o.moveTo(C.x, C.y),
                    o.lineTo(P.x, P.y),
                    o.lineTo(g.x, g.y),
                    o.stroke();
                    var A;
                    if(window.lite.getVar("frce")) {
                        A = GameInventoryManager.getItem(window.lite.getCap());
                    } else {
                        A = GameInventoryManager.getItem(this.cosmetics.head);
                    }
                    A.draw(o, k.x, k.y, old.drawHeadAngle, r, old.dir)
                }
                o.globalAlpha = 1;
            }
            cloneBikeFrame() {
                //this.player._checkpoints = this.player._checkpoints.slice(-101);
                var op = 0;
                for(var checkpoint in this.player._checkpoints) {
                    if(checkpoint > this.player._checkpoints.length - 11) {
                        op++;
                        var alpha = .03 * op
                        this.drawBikeFrame(alpha, JSON.parse(this.player._checkpoints[checkpoint]._baseVehicle))
                    }
                }
                var al = 0;
                for(var checkpoint in this.player._checkpointsCache) {
                    if(checkpoint > this.player._checkpointsCache.length - 11) {
                        al++;
                        var alpha = .01 * al
                        this.drawBikeFrame(alpha, JSON.parse(this.player._checkpointsCache[checkpoint]._baseVehicle))
                    }
                }
            }
        }
    },
    79: function(t, e) {
        var Vector = t(8)
          , Gamepad = t(60)
          , Explosion = t(75)
          , Bmx = t(72)
          , Heli = t(76)
          , Truck = t(84)
          , Mtb = t(78)
          , Balloon = t(70)
          , Blob = t(71)
          , v = {};
        v.BMX = Bmx,
        v.MTB = Mtb,
        v.HELI = Heli,
        v.TRUCK = Truck,
        v.BALLOON = Balloon,
        v.BLOB = Blob;
        var g = 0
          , m = function y(t, e) {
            for (var i in e)
                try {
                    t[i] = e[i].constructor == Object ? y(t[i], e[i]) : e[i]
                } catch (s) {
                    t[i] = e[i]
                }
            return t
        };
        e.exports = class Player {
            constructor(a, b) {
                this.id = g++,
                this._scene = a,
                this._game = a.game,
                this._user = b,
                this._settings = a.settings;
                var i = a.settings.startVehicle;
                a.settings.track && (i = a.settings.track.vehicle),
                this._baseVehicleType = i,
                this._gamepad = new Gamepad(a),
                this._ghost = !1,
                this._color = b.color ? b.color : "#000000",
                this.setDefaults(),
                this.createBaseVehicle(new Vector(0,35), 1, new Vector(0,0))
            }
            getCheckpointCount() {
                return this._checkpoints.length
            }
            setDefaults() {
                this._baseVehicle = !1,
                this._tempVehicleType = null,
                this._tempVehicle = !1,
                this._tempVehicleTicks = 0,
                this._temp_vehicle_options = null,
                this._addCheckpoint = !1,
                this._checkpoints = [],
                this._checkpointsCache = [],
                this._crashed = !1,
                this._effect = !1,
                this._effectTicks = 0,
                this._opacity = 1,
                this.complete = !1,
                this._powerupsConsumed = {
                    checkpoints: [],
                    targets: [],
                    misc: []
                }
            }
            hasCheckpoints() {
                return this._checkpoints.length > 0
            }
            setColor(t) {
                this._color = t
            }
            dead() {
                if (this._crashed = !0,
                this._ghost === !1) {
                    var t = this._scene
                      , e = t.settings
                      , i = t.message;
                    t.state.playerAlive = this.isAlive(),
                    this._checkpoints.length > 0 ? e.mobile ? i.show("Tap to go to checkpoint!", !1, "#000000", "#FFFFFF") : i.show("Press Enter For Checkpoint", !1, "#000000", "#FFFFFF") : e.mobile ? i.show("Tap to Restart!", !1, "#000000", "#FFFFFF") : i.show("Press Enter To Restart", !1, "#000000", "#FFFFFF")
                }
            }
            setAsGhost() {
                this._ghost = !0
            }
            isGhost() {
                return this._ghost
            }
            isAlive() {
                return !this._crashed
            }
            getTargetsHit() {
                return this._powerupsConsumed.targets.length
            }
            getGamepad() {
                return this._gamepad
            }
            setBaseVehicle(t) {
                this._baseVehicleType = t,
                this.reset()
            }
            createBaseVehicle(t, e, i) {
                this._tempVehicle && this._tempVehicle.stopSounds(),
                this._baseVehicle = new v[this._baseVehicleType](this,t,e,i),
                this._tempVehicle = !1,
                this._tempVehicleType = !1,
                this._tempVehicleTicks = 0
            }
            setTempVehicle(t, e, i, s) {
                this._temp_vehicle_options && this._temp_vehicle_options.type === t && (e = this._temp_vehicle_options.ticks + e),
                this._temp_vehicle_options = {
                    type: t,
                    ticks: e,
                    position: i,
                    direction: s
                }
            }
            createTempVehicle(t, e, i, s) {
                if (this._temp_vehicle_options) {
                    var n = this._temp_vehicle_options;
                    t = n.type,
                    e = n.ticks,
                    i = n.position,
                    s = n.direction,
                    this._temp_vehicle_options = null
                }
                this._tempVehicleType === t ? this._tempVehicleTicks += e : (this.getActiveVehicle().stopSounds(),
                this._effect = new Explosion(i,this._scene),
                this._effectTicks = 45,
                this._tempVehicleType = t,
                this._tempVehicle = new v[t](this,i,s),
                this._tempVehicleTicks = e)
            }
            update() {
                if (this.complete === !1) {
                    var t = this._baseVehicle;
                    this._temp_vehicle_options && this.createTempVehicle(),
                    this._tempVehicleTicks > 0 && (t = this._tempVehicle,
                    this._crashed === !1 && this._tempVehicleTicks--,
                    this._tempVehicleTicks <= 0 && this._crashed === !1 && (this._effectTicks = 45,
                    this._effect = new Explosion(this._tempVehicle.focalPoint.pos,this._scene),
                    this.createBaseVehicle(this._tempVehicle.focalPoint.pos, this._tempVehicle.dir, this._tempVehicle.masses[0].vel),
                    t = this._baseVehicle)),
                    this._effectTicks > 0 && (this._effectTicks--,
                    this._effect.update()),
                    t.update(),
                    this._addCheckpoint && (this._createCheckpoint(),
                    this._addCheckpoint = !1)
                }
            }
            isInFocus() {
                var t = this._scene.camera
                  , e = !1;
                return t.playerFocus && t.playerFocus === this && (e = !0),
                e
            }
            updateOpacity() {
                var t = 1
                  , e = this._scene.camera;
                if (e.playerFocus && e.playerFocus !== this) {
                    var i = this.getDistanceBetweenPlayers(e.playerFocus);
                    1200 > i && (t = min(i / 500, 1))
                }
                this._opacity = t
            }
            drawName() {
                var t = this._scene
                  , e = this._color
                  , i = this._user.d_name
                  , s = t.game
                  , n = t.camera.zoom
                  , r = s.pixelRatio
                  , o = s.canvas
                  , a = o.getContext("2d")
                  , h = this._opacity
                  , l = this.getActiveVehicle()
                  , c = l.focalPoint.pos.toScreen(t);
                a.globalAlpha = h,
                a.beginPath(),
                a.fillStyle = e,
                a.moveTo(c.x, c.y - 40 * n),
                a.lineTo(c.x - 5 * n, c.y - 50 * n),
                a.lineTo(c.x + 5 * n, c.y - 50 * n),
                a.lineTo(c.x, c.y - 40 * n),
                a.fill();
                var u = 9 * r * max(n, 1);
                a.font = u + "pt helsinki",
                a.textAlign = "center",
                a.fillStyle = e,
                a.fillText(i, c.x, c.y - 60 * n),
                a.globalAlpha = 1
            }
            draw() {
                this.updateOpacity();
                var t = this._baseVehicle;
                this._tempVehicleTicks > 0 && (t = this._tempVehicle),
                this._effectTicks > 0 && this._effect.draw(this._effectTicks / 100),
                t.draw(),
                window.lite.getVar("frce") && this._scene.ticks > 0 && this._scene.state.playing == !1 && t.clone(),
                this.isGhost() && this.drawName()
            }
            checkKeys() {
                var t = this._gamepad
                  , e = this._ghost
                  , i = this._scene;
                if (!t.isButtonDown("enter") && !t.isButtonDown("backspace") && t.areKeysDown()) {
                    if(this._checkpointsCache.length > 0) {
                        this._checkpointsCache = [];
                    }
                }
                if (t.isButtonDown("enter")) {
                    var s = t.getButtonDownOccurances("enter");
                    this.returnToCheckpoint(s),
                    t.setButtonUp("enter")
                }
                if (e === !1 && (t.areKeysDown() && !this._crashed && i.play(),
                t.isButtonDown("restart") && (i.restartTrack = !0,
                t.setButtonUp("restart")),
                (t.isButtonDown("up") || t.isButtonDown("down") || t.isButtonDown("left") || t.isButtonDown("right")) && i.camera.focusOnMainPlayer()),
                t.isButtonDown("enter") && (this.gotoCheckpoint(),
                t.setButtonUp("enter")),
                t.isButtonDown("backspace")) {
                    var s = t.getButtonDownOccurances("backspace");
                    this.removeCheckpoint(s),
                    t.setButtonUp("backspace")
                }
            }
            getDistanceBetweenPlayers(t) {
                var e = t.getActiveVehicle()
                  , i = this.getActiveVehicle()
                  , s = e.focalPoint.pos.x - i.focalPoint.pos.x
                  , n = e.focalPoint.pos.y - i.focalPoint.pos.y;
                return sqrt(pow(s, 2) + pow(n, 2))
            }
            getActiveVehicle() {
                var t = this._baseVehicle;
                return this._tempVehicleTicks > 0 && (t = this._tempVehicle),
                t
            }
            _createCheckpoint() {
                var t = {
                    _powerupsConsumed: JSON.stringify(this._powerupsConsumed),
                    _crashed: this._crashed,
                    _ticks: this._ticks
                };
                this._tempVehicleTicks > 0 ? (t._tempVehicleType = this._tempVehicleType,
                t._tempVehicle = JSON.stringify(this._tempVehicle, this._snapshotFilter),
                t._tempVehicleTicks = this._tempVehicleTicks) : (t._baseVehicleType = this._baseVehicleType,
                t._baseVehicle = JSON.stringify(this._baseVehicle, this._snapshotFilter)),
                this._checkpoints.push(t)
            }
            _snapshotFilter(t, e) {
                switch (t) {
                case "parent":
                case "player":
                case "scene":
                case "settings":
                case "masses":
                case "springs":
                case "focalPoint":
                case "gamepad":
                    return void 0;
                case "explosion":
                    return !1;
                default:
                    return e
                }
            }
            setCheckpointOnUpdate() {
                this._addCheckpoint = !0
            }
            crashed() {
                this._crashed = !0
            }
            gotoCheckpoint() {
                var t = this._gamepad
                  , e = t.replaying
                  , i = this._scene;
                if (this._checkpoints.length > 0) {
                    var s = this._checkpoints[this._checkpoints.length - 1];
                    if (s._tempVehicle) {
                        this._baseVehicle.stopSounds();
                        var n = this._tempVehicle;
                        this._tempVehicleType !== s._tempVehicleType && (n = new v[s._tempVehicleType](this,{
                            x: 0,
                            y: 0
                        }));
                        var r = JSON.parse(s._tempVehicle);
                        m(n, r),
                        this._tempVehicle = n,
                        this._tempVehicleType = s._tempVehicleType,
                        this._tempVehicleTicks = s._tempVehicleTicks,
                        n.updateCameraFocalPoint()
                    } else {
                        var n = this._baseVehicle
                          , r = JSON.parse(s._baseVehicle);
                        m(n, r),
                        this._tempVehicle && this._tempVehicle.stopSounds(),
                        this._baseVehicle = n,
                        this._tempVehicleTicks = 0,
                        this._tempVehicleType = !1,
                        n.updateCameraFocalPoint()
                    }
                    if (this._powerupsConsumed = JSON.parse(s._powerupsConsumed),
                    this._crashed = s._crashed,
                    e === !1) {
                        var o = i.settings;
                        i.state.playerAlive = this.isAlive(),
                        i.settings.mobile ? i.message.show("Tap to resume", 5, "#826cdc", "#FFFFFF") : i.message.show("Press Backspace To Go Back Further", 5, "#826cdc", "#FFFFFF"),
                        i.track.updatePowerupState(this),
                        o.waitAtCheckpoints && (i.state.playing = !1),
                        i.camera.focusOnMainPlayer()
                    }
                    i.camera.playerFocus === this && i.camera.fastforward()
                } else
                    e === !1 && this.restartScene()
            }
            restartScene() {
                var t = this._gamepad
                  , e = t.replaying;
                this._checkpointsCache = [];
                e === !1 && (this._scene.restartTrack = !0)
            }
            removeCheckpoint(t) {
                if (this._checkpoints.length > 1) {
                    for (var e = 0; t > e; e++)
                        this._checkpointsCache.push(this._checkpoints.pop());
                    this.gotoCheckpoint()
                } else
                    this.restartScene()
            }
            returnToCheckpoint(t) {
                if (this._checkpointsCache.length > 0) {
                    for (var e = 0; t > e; e++) {
                        if(typeof this._gamepad.records.backspace_down != "undefined") {
                            this._gamepad.records.backspace_down.pop();
                            if(this._gamepad.records.backspace_down.length < 1) {
                                delete this._gamepad.records.backspace_down
                            }
                        }
                        if(typeof this._gamepad.records.backspace_up != "undefined") {
                            this._gamepad.records.backspace_up.pop();
                            if(this._gamepad.records.backspace_up.length < 1) {
                                delete this._gamepad.records.backspace_up
                            }
                        }
                        this._checkpoints.push(this._checkpointsCache.pop());
                    }
                }
                this.gotoCheckpoint()
            }
            close() {
                this.id = null,
                this._scene = null,
                this._game = null,
                this._user = null,
                this._settings = null,
                this._baseVehicleType = null,
                this._gamepad.close(),
                this._gamepad = null,
                this._baseVehicle = null,
                this._tempVehicleType = null,
                this._tempVehicle = null,
                this._tempVehicleTicks = null,
                this._addCheckpoint = null,
                this._checkpoints = null,
                this._checkpointsCache = null,
                this._crashed = null,
                this._effect = null,
                this._effectTicks = null,
                this._powerupsConsumed = null
            }
            reset() {
                this._tempVehicle && this._tempVehicle.stopSounds(),
                this._baseVehicle.stopSounds(),
                this.setDefaults(),
                this.createBaseVehicle(new Vector(0,35), 1, new Vector(0,0)),
                this._gamepad.reset(),
                this._scene.state.playerAlive = this.isAlive()
            }
        }
    },
    80: function(t, e) {
        var Player = t(79);
        e.exports = class PlayerManager {
            constructor(a) {
                this.scene = a,
                this.game = a.game,
                this.settings = a.settings,
                this.firstPlayer = null,
                this._players = [],
                this._playerLookup = {}
            }
            update() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].update()
            }
            mutePlayers() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++) {
                    var s = t[i].getActiveVehicle();
                    s.stopSounds()
                }
            }
            updateGamepads() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i]._gamepad.update()
            }
            createPlayer(t, e) {
                return new Player(this.scene,e)
            }
            addPlayer(t) {
                this._players.push(t),
                this._playerLookup[t.id] = t
            }
            checkKeys() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].checkKeys()
            }
            draw() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].draw()
            }
            getPlayerByIndex(t) {
                return this._players[t]
            }
            getPlayerById(t) {
                return this._playerLookup[t]
            }
            getPlayerCount() {
                return this._players.length
            }
            reset() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].reset()
            }
            clear() {
                this._players = [],
                this._playerLookup = {},
                this._players.push(this.firstPlayer),
                this._playerLookup[this.firstPlayer.id] = this.firstPlayer
            }
            _closePlayers() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].close()
            }
            close() {
                this._closePlayers(),
                this._players = null,
                this.firstPlayer = null,
                this._playerLookup = null,
                this.scene = null,
                this.game = null,
                this.settings = null
            }
        }
    },
    81: function(t, e) {
        var Vector = t(8)
          , Mass = t(77);
        e.exports = class Prop extends Mass {
            constructor(a, b) {
                super();
                this.init(a, b),
                this.motor = 0,
                this.angle = new Vector(0,0),
                this.radius = 10,
                this.speed = 0
            }
            motor = 0;
            angle = 0;
            speed = 0;
            update() {
                var t = this.vel
                , e = this.angle
                , i = this.pos
                , s = this.old
                , n = this.motor;
                t.y += 0,
                t.inc(e.factor(2 * n)),
                t = t.factor(.99),
                i.inc(t),
                this.contact = !1,
                this.collide && this.scene.track.collide(this),
                this.vel = i.sub(s),
                s.equ(i)
            }
        }
    },
    82: function(t, e) {
        var Vector = t(8)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85);
        e.exports = class Ragdoll extends Vehicle {
            constructor(t, e) {
                super();
                this.parent = e;
                var i, o, a, h, l, c, u, p, d, f, v = [], g = [], m = new Vector(0,0);
                i = new Mass,
                o = new Mass,
                a = new Mass,
                h = new Mass,
                c = new Mass,
                l = new Mass,
                u = new Mass,
                p = new Mass,
                d = new Mass,
                f = new Mass,
                i.init(m, e),
                o.init(m, e),
                a.init(m, e),
                h.init(m, e),
                c.init(m, e),
                l.init(m, e),
                u.init(m, e),
                p.init(m, e),
                d.init(m, e),
                f.init(m, e),
                v.push(i),
                v.push(o),
                v.push(a),
                v.push(h),
                v.push(c),
                v.push(l),
                v.push(u),
                v.push(p),
                v.push(d),
                v.push(f),
                g.push(new Spring(i,o,this)),
                g.push(new Spring(i,a,this)),
                g.push(new Spring(a,c,this)),
                g.push(new Spring(i,h,this)),
                g.push(new Spring(h,l,this)),
                g.push(new Spring(o,u,this)),
                g.push(new Spring(u,d,this)),
                g.push(new Spring(o,p,this)),
                g.push(new Spring(p,f,this));
                for (var y in v)
                    v[y].radius = 3;
                for (var y in v)
                    v[y].friction = .05;
                i.radius = o.radius = 8;
                for (var y in g)
                    g[y].springConstant = .4;
                for (var y in g)
                    g[y].dampConstant = .7;
                this.masses = v,
                this.springs = g,
                this.head = i,
                this.waist = o,
                this.lElbow = a,
                this.rElbow = h,
                this.rHand = l,
                this.lHand = c,
                this.lKnee = u,
                this.rKnee = p,
                this.lFoot = d,
                this.rFoot = f;
                for (var y in t)
                    this[y].pos.equ(t[y])
            }
            init = this.initialize;
            parent = null;
            zero(t, e) {
                t = t.factor(.7),
                e = e.factor(.7);
                var i = this.springs
                  , s = this.masses;
                for (var n in i) {
                    var r = i[n].m2.pos.sub(i[n].m1.pos).len();
                    i[n].lrest = r,
                    i[n].leff = r
                }
                for (var n = 1; 4 >= n; n++)
                    i[n].lrest = 13,
                    i[n].leff = 13;
                for (var n in i)
                    i[n].leff > 20 && (i[n].lrest = 20,
                    i[n].leff = 20);
                var o = [this.head, this.lElbow, this.rElbow, this.lHand, this.rHand]
                  , a = [this.waist, this.lKnee, this.rKnee, this.lFoot, this.rFoot];
                for (var n in o)
                    o[n].old = o[n].pos.sub(t);
                for (var n in a)
                    a[n].old = a[n].pos.sub(e);
                for (var n in s)
                    s[n].vel.equ(s[n].pos.sub(s[n].old)),
                    s[n].vel.x += 1 * (random() - random()),
                    s[n].vel.y += 1 * (random() - random())
            }
            draw() {
                var t = this.head
                  , e = this.waist
                  , i = this.lElbow
                  , s = this.rElbow
                  , n = this.rHand
                  , r = this.lHand
                  , o = this.lKnee
                  , a = this.rKnee
                  , h = this.lFoot
                  , l = this.rFoot
                  , c = this.parent.scene
                  , u = c.camera
                  , p = u.zoom
                  , d = c.game.canvas.getContext("2d")
                  , f = this.parent.alpha;
                d.strokeStyle = "rgba(0,0,0," + f + ")",
                d.lineWidth = 5 * p,
                d.lineCap = "round",
                d.lineJoin = "round";
                var v = t.pos.toScreen(c);
                d.beginPath(),
                d.moveTo(v.x, v.y);
                var g = i.pos.toScreen(c);
                d.lineTo(g.x, g.y);
                var m = r.pos.toScreen(c);
                d.lineTo(m.x, m.y),
                d.stroke(),
                d.strokeStyle = "rgba(0,0,0," + .5 * f + ")",
                d.beginPath(),
                d.moveTo(v.x, v.y);
                var y = s.pos.toScreen(c);
                d.lineTo(y.x, y.y);
                var w = n.pos.toScreen(c);
                d.lineTo(w.x, w.y),
                d.stroke(),
                d.strokeStyle = "rgba(0,0,0," + f + ")",
                d.lineWidth = 8 * p,
                d.beginPath(),
                d.moveTo(v.x, v.y);
                var x = e.pos.toScreen(c);
                d.lineTo(x.x, x.y),
                d.stroke(),
                d.lineWidth = 5 * p,
                d.beginPath(),
                d.moveTo(x.x, x.y);
                var _ = o.pos.toScreen(c);
                d.lineTo(_.x, _.y);
                var b = h.pos.toScreen(c);
                d.lineTo(b.x, b.y);
                var T = o.pos.sub(e.pos).normalize();
                T = T.factor(4).add(h.pos);
                var C = T.toScreen(c);
                d.lineTo(C.x, C.y),
                d.stroke(),
                d.strokeStyle = "rgba(0,0,0," + .5 * f + ")",
                d.lineWidth = 5 * p,
                d.beginPath(),
                d.moveTo(x.x, x.y);
                var k = a.pos.toScreen(c);
                d.lineTo(k.x, k.y);
                var S = a.pos.sub(e.pos).normalize();
                S = S.factor(4).add(l.pos);
                var P = l.pos.toScreen(c);
                d.lineTo(P.x, P.y);
                var M = S.toScreen(c);
                d.lineTo(M.x, M.y),
                d.stroke(),
                v.inc(v.sub(x).factor(.25));
                if(window.lite.getVar("frce")) {
                    let t = v.sub(x)
                      , e = new Vector(t.y,-t.x)
                      , i = v.add(e.factor(.15 * this.dir)).add(t.factor(-.05))
                      , s = v.add(e.factor(-.35 * this.dir)).add(t.factor(.15));
                    d.beginPath(),
                    d.arc(v.x, v.y, 5 * p, 0, 2 * PI, !1),
                    d.moveTo(i.x, i.y),
                    d.lineTo(s.x, s.y),
                    d.lineWidth = 2 * p,
                    d.strokeStyle = "#000000",
                    d.stroke()
                } else {
                    var D = GameInventoryManager.getItem(this.parent.cosmetics.head)
                    , I = this.drawHeadAngle;
                    D.draw(d, v.x, v.y, I, p, this.dir, 1)
                }
            }
            update(){
                for (var t = this.springs.length - 1; t >= 0; t--)
                    this.springs[t].update();
                for (var e = this.masses.length - 1; e >= 0; e--)
                    this.masses[e].update();
                this.updateDrawHeadAngle()
            }
            updateDrawHeadAngle() {
                var t, e;
                this.dir < 0 ? (e = this.head.pos,
                t = this.waist.pos) : (t = this.head.pos,
                e = this.waist.pos);
                var i = t.x
                  , s = t.y
                  , n = e.x
                  , r = e.y
                  , o = i - n
                  , h = s - r;
                this.drawHeadAngle = -(atan2(o, h) + PI)
            }
        }
    },
    83: function(t, e) {
        var Vector = t(8);
        e.exports = class Spring {
            constructor(a, b, c) {
                this.m1 = a,
                this.m2 = b,
                this.parent = c,
                this.lrest = 40,
                this.leff = 40,
                this.dampConstant = .5,
                this.springConstant = .7
            }
            m1 = null;
            m2 = null;
            parent = null;
            lrest = 40;
            leff = 40;
            dampConstant = 0;
            springConstant = 0;
            swap() {
                var t = new Vector
                  , e = this.m1
                  , s = this.m2;
                t.equ(e.pos),
                e.pos.equ(s.pos),
                s.pos.equ(t),
                t.equ(e.old),
                e.old.equ(s.old),
                s.old.equ(t),
                t.equ(e.vel),
                e.vel.equ(s.vel),
                s.vel.equ(t);
                var n = e.angle;
                e.angle = s.angle,
                s.angle = n
            }
            update() {
                var t = new Vector(0,0)
                  , e = this.m1
                  , s = this.m2
                  , n = e.pos
                  , r = s.pos
                  , o = e.vel
                  , a = s.vel;
                t.x = r.x - n.x,
                t.y = r.y - n.y;
                var h = t.len();
                if (!(1 > h)) {
                    var l = 1 / h;
                    t.x *= l,
                    t.y *= l;
                    var c = (h - this.leff) * this.springConstant
                      , u = {
                        x: t.x * c,
                        y: t.y * c
                    }
                      , p = a.x - o.x
                      , d = a.y - o.y
                      , f = p * t.x + d * t.y
                      , v = f * this.dampConstant
                      , g = t.x * v
                      , m = t.y * v;
                    u.x += g,
                    u.y += m,
                    a.x += -u.x,
                    a.y += -u.y,
                    o.x += u.x,
                    o.y += u.y
                }
            }
            rotate(t) {
                var e = this.m1
                  , i = this.m2
                  , s = i.pos.x - e.pos.x
                  , n = i.pos.y - e.pos.y
                  , r = -n / this.leff
                  , o = s / this.leff;
                e.pos.x += r * t,
                e.pos.y += o * t,
                i.pos.x += r * -t,
                i.pos.y += o * -t
            }
            contract(t, e) {
                this.leff += (this.lrest - t - this.leff) / e
            }
            setMasses(t, e) {
                this.m1 = t,
                this.m2 = e
            }
        }
    },
    84: function(t, e) {
        var Vector = t(8)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85)
          , Wheel = t(86)
          , d = {
                TRUCK_GROUND: "truck_idle"
            };
        e.exports = class Truck extends Vehicle {
            constructor(a, b, c) {
                super();
                this.vehicleInit(a),
                this.createMasses(b),
                this.createSprings(),
                this.stopSounds(),
                this.updateCameraFocalPoint(),
                -1 === c && this.swap()
            }
            vehicleName = "TRUCK";
            vehicleInit = this.init;
            vehicleUpdate = this.update;
            vehicleControl = this.control;
            vehicleDraw = this.draw;
            masses = null;
            springs = null;
            cosmetics = null;
            slow = !1;
            pedala = 0;
            swapped = !1;
            crashed = !1;
            createMasses(t) {
                this.masses = [],
                this.masses.push(new Mass),
                this.masses.push(new Mass),
                this.masses[0].init(new Vector(t.x - 15,t.y + 7), this),
                this.masses[1].init(new Vector(t.x + 15,t.y + 7), this),
                this.masses[0].friction = .1,
                this.masses[1].friction = .1,
                this.masses.push(new Wheel(new Vector(t.x - 20,t.y + 35),this)),
                this.masses.push(new Wheel(new Vector(t.x + 20,t.y + 35),this)),
                this.masses[2].radius = this.masses[3].radius = 14,
                this.masses[0].radius = this.masses[1].radius = 7,
                this.head = this.masses[0],
                this.backMass = this.masses[1],
                this.rearWheel = this.masses[2],
                this.frontWheel = this.masses[3]
            }
            createSprings() {
                this.springs = [];
                var t = this.masses;
                this.springs.push(new Spring(t[0],t[1],this)),
                this.springs.push(new Spring(t[0],t[2],this)),
                this.springs.push(new Spring(t[1],t[3],this)),
                this.springs.push(new Spring(t[0],t[3],this)),
                this.springs.push(new Spring(t[1],t[2],this)),
                this.springs.push(new Spring(t[2],t[3],this)),
                this.springs[0].leff = this.springs[0].lrest = 30,
                this.springs[1].leff = this.springs[1].lrest = 30,
                this.springs[2].leff = this.springs[2].lrest = 30,
                this.springs[3].leff = this.springs[3].lrest = 45,
                this.springs[4].leff = this.springs[4].lrest = 45;
                for (var e in this.springs)
                    this.springs[e].springConstant = .3
            }
            updateCameraFocalPoint() {}
            update() {
                if (this.crashed === !1 && (this.updateSound(),
                this.control()),
                this.explosion)
                    this.explosion.update();
                else {
                    for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                        t[i].update();
                    for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                        s[r].update();
                    if (this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1),
                    this.slow === !1) {
                        this.crashed === !1 && this.control();
                        for (var i = e - 1; i >= 0; i--)
                            t[i].update();
                        for (var r = n - 1; r >= 0; r--)
                            s[r].update()
                    }
                    this.updateDrawHeadAngle(),
                    this.updateCameraFocalPoint()
                }
            }
            updateSound() {
                if (this.player.isInFocus()) {
                    var t = this.scene.sound;
                    if (this.rearWheel.contact) {
                        var e = min(this.rearWheel.motor, 1);
                        t.play(d.TRUCK_GROUND, e)
                    } else if (this.frontWheel.contact) {
                        var e = min(this.frontWheel.motor, 1);
                        t.play(d.TRUCK_GROUND, e)
                    } else
                        t.stop(d.TRUCK_GROUND)
                }
            }
            updateCameraFocalPoint() {
                this.focalPoint = 1 === this.dir ? this.head : this.backMass
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(d.TRUCK_GROUND)
            }
            updateDrawHeadAngle() {
                var t = this.frontWheel.pos
                , e = this.rearWheel.pos
                , i = t.x
                , s = t.y
                , n = e.x
                , r = e.y
                , o = i - n
                , a = s - r;
                this.drawHeadAngle = -(atan2(o, a) - PI / 2)
            }
            swap() {
                this.dir = -1 * this.dir,
                this.springs[0].swap(),
                this.springs[5].swap()
            }
            control() {
                var t = this.gamepad
                , e = t.isButtonDown("up")
                , i = t.isButtonDown("down")
                , s = t.isButtonDown("left")
                , n = t.isButtonDown("right")
                , r = t.isButtonDown("z");
                r && !this.swapped && (this.swap(),
                this.swapped = !0),
                r || (this.swapped = !1);
                var o = e ? 1 : 0
                , a = this.rearWheel
                , h = this.frontWheel;
                a.motor += (.8 * o - a.motor) / 10,
                h.motor += (.8 * o - h.motor) / 10,
                a.brake = i,
                h.brake = i;
                var l = s ? 1 : 0;
                l += n ? -1 : 0;
                var c = this.springs;
                c[0].rotate(l / 8),
                c[5].rotate(l / 8)
            }
            draw() {
                if (this.explosion)
                    this.explosion.draw(1);
                else {
                    var t = this.scene.game.canvas.getContext("2d");
                    if (t.imageSmoothingEnabled = !0,
                    t.mozImageSmoothingEnabled = !0,
                    t.oImageSmoothingEnabled = !0,
                    t.webkitImageSmoothingEnabled = !0,
                    this.settings.developerMode)
                        for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                            e[s].draw();
                    t.globalAlpha = this.player._opacity,
                    this.drawTruck(t),
                    t.globalAlpha = 1
                }
            }
            drawTruck(t) {
                var e = this.scene
                , i = e.camera.zoom
                , s = this.cosmetics
                , n = GameInventoryManager.getItem(s.head)
                , r = this.drawHeadAngle
                , o = this.dir
                , a = this.frontWheel.pos.toScreen(e)
                , h = this.rearWheel.pos.toScreen(e)
                , l = this.head.pos.toScreen(e)
                , c = this.backMass.pos.toScreen(e)
                , d = (this.masses[1].pos.x - this.masses[0].pos.x) * i
                , f = (this.masses[1].pos.y - this.masses[0].pos.y) * i
                , v = (.5 * (this.masses[0].pos.x + this.masses[1].pos.x) - .5 * (this.masses[2].pos.x + this.masses[3].pos.x)) * i
                , g = (.5 * (this.masses[0].pos.y + this.masses[1].pos.y) - .5 * (this.masses[2].pos.y + this.masses[3].pos.y)) * i;
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.lineWidth = 3 * i,
                t.lineCap = "round",
                t.lineJoin = "round";
                var m = c.x - l.x
                , y = c.y - l.y
                , w = sqrt(pow(m, 2) + pow(y, 2))
                , x = m / w
                , _ = y / w;
                n.draw(t, c.x - .5 * x * i * 20, c.y - _ * i * 20 * .5, r, .45 * i, o);
                t.strokeStyle = window.lite.getVar("dark") ? "#bbbbbb" : "#444444",
                t.beginPath(),
                t.moveTo(l.x - .4 * d - .9 * v, l.y - .4 * f - .9 * g),
                t.lineTo(l.x + .8 * d - .9 * v, l.y + .8 * f - .9 * g),
                t.stroke(),
                t.closePath(),
                t.save(),
                t.fillStyle = window.lite.getVar("dark") ? "#888888" : "#777777",
                t.beginPath(),
                t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
                t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
                t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
                t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
                t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
                t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
                t.closePath(),
                t.fill(),
                t.save(),
                t.lineWidth = 2 * i,
                t.strokeStyle = window.lite.getVar("dark") ? "#bbbbbb" : "#444444",
                t.beginPath(),
                t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
                t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
                t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
                t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
                t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
                t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.closePath(),
                t.stroke(),
                t.strokeStyle = window.lite.getVar("dark") ? "#bbbbbb" : "#444444",
                t.lineWidth = i,
                t.beginPath(),
                t.moveTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
                t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
                t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
                t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
                t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
                t.closePath(),
                t.stroke(),
                t.beginPath(),
                this.tire(t, h.x, h.y, 10 * i, i, this.rearWheel.angle),
                t.closePath(),
                t.beginPath(),
                this.tire(t, a.x, a.y, 10 * i, i, this.frontWheel.angle),
                t.closePath(),
                t.restore()
            }
            tire(t, e, i, s, n, r) {
                var a;
                for (t.beginPath(),
                t.arc(e, i, 10 * n, 0, 2 * PI, !1),
                t.fillStyle = "#888888",
                t.fill(),
                t.lineWidth = 5.9 * n,
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.closePath(),
                t.stroke(),
                t.beginPath(),
                t.lineWidth = 2 * n,
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "0x000000",
                a = 0,
                s += 3 * n; a++ < 8; )
                    t.moveTo(e + s * cos(r + 6.283 * a / 8), i + s * sin(r + 6.283 * a / 8)),
                    t.lineTo(e + s * cos(r + 6.283 * (a + .5) / 8), i + s * sin(r + 6.283 * (a + .5) / 8));
                for (t.stroke(),
                t.closePath(),
                t.beginPath(),
                t.lineWidth = 2 * n,
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "0x000000",
                a = 0,
                s += -9 * n; a++ < 5; )
                    t.moveTo(e + s * cos(r + 6.283 * a / 5), i + s * sin(r + 6.283 * a / 5)),
                    t.lineTo(e + s * cos(r + 6.283 * (a + .2) / 5), i + s * sin(r + 6.283 * (a + .2) / 5));
                t.closePath(),
                t.stroke()
            }
        }
    },
    85: function(t, e) {
        var Vector = t(8)
          , Explosion = t(75);
        e.exports = class Vehicle {
            init(t) {
                this.player = t,
                this.scene = t._scene,
                this.gamepad = t._gamepad,
                this.settings = t._settings,
                this.gravity = new Vector(0,.3),
                this.complete = !1,
                this.alive = !0,
                this.crashed = !1,
                this.dir = 1,
                this.ghost = !1,
                this.ragdoll = !1,
                this.explosion = !1,
                this.speed = 0,
                this.powerupsEnabled = !0,
                this.createCosmetics()
            }
            explode() {
                this.scene.sound.play("bomb_sound", 1),
                this.explosion = new Explosion(this.masses[0].pos,this.scene),
                this.dead()
            }
            createCosmetics() {
                var t = this.player._user
                  , e = t.cosmetics;
                this.cosmetics = e
            }
            updateSpeed() {
                this.speed = abs(round(this.focalPoint.vel.x + this.focalPoint.vel.y))
            }
            close() {
                this.scene = null,
                this.settings = null,
                this.gravity = null,
                this.speed = null,
                this.cosmetics = null,
                this.explosion = null,
                this.ragdoll = null,
                this.ghost = null,
                this.crashed = null,
                this.alive = null,
                this.gamepad = null
            }
            dead() {
                this.stopSounds(),
                this.player.dead(),
                this.crashed = !0,
                this.alive = !1
            }
            moveVehicle(t, e) {
                for (var i = this.masses, s = i.length, n = s - 1; n >= 0; n--)
                    i[n].pos.x = i[n].pos.x + t,
                    i[n].pos.y = i[n].pos.y + e,
                    i[n].old.x = i[n].old.x + t,
                    i[n].old.y = i[n].old.y + e
            }
            stopSounds() {}
        }
    },
    86: function(t, e) {
        var Mass = t(77);
        e.exports = class Wheel extends Mass {
            constructor(a, b) {
                super();
                this.init(a, b),
                this.motor = 0,
                this.brake = !1,
                this.angle = 0,
                this.speed = 0,
                this.rotationSpeed = 0
            }
            motor = 0;
            brake = !1;
            angle = 0;
            speed = 0;
            drive(t, e) {
                var i = this.pos
                , s = this.motor * this.parent.dir
                , n = s * t
                , r = s * e;
                if (i.x += n,
                i.y += r,
                this.brake) {
                    var o = .3 * -(t * this.vel.x + e * this.vel.y)
                    , a = t * o
                    , h = e * o;
                    i.x += a,
                    i.y += h
                }
                this.speed = (t * this.vel.x + e * this.vel.y) / this.radius,
                this.rotationSpeed = this.speed,
                this.angle += this.speed,
                this.contact = !0
            }
            massUpdate = this.update;
            update() {
                var t = this.parent.gravity
                , e = this.pos
                , i = this.old
                , s = this.vel;
                s.x += t.x,
                s.y += t.y,
                (0 != t.x || 0 != t.y) && (s.x = .99 * s.x,
                s.y = .99 * s.y),
                e.x += s.x,
                e.y += s.y,
                this.contact = !1,
                this.collide && this.scene.track.collide(this),
                s.x = e.x - i.x,
                s.y = e.y - i.y,
                this.old.equ(this.pos),
                this.rotationSpeed = .999 * this.rotationSpeed
            }
        }
    },
    87: function(t, e) {
        var Vector = t(8);
        e.exports = class Camera {
            constructor(a) {
                var e = a.settings;
                this.settings = e,
                this.scene = a,
                this.zoom = e.cameraStartZoom * a.game.pixelRatio,
                this.desiredZoom = e.cameraStartZoom * a.game.pixelRatio,
                this.zooming = !1,
                this.position = new Vector(0,0),
                this.zoomPercentage = this.getZoomAsPercentage(),
                this.zoomPoint = !1
            }
            settings = null;
            scene = null;
            zoom = 1;
            position = null;
            desiredZoom = 1;
            zoomPercentage = 0;
            focusIndex = 0;
            playerFocus = null;
            focusOnNextPlayer() {
                var t = this.scene.playerManager.getPlayerCount();
                this.focusIndex = (this.focusIndex + 1) % t,
                this.focusOnPlayer()
            }
            focusOnPlayer() {
                var t = this.scene
                  , e = t.playerManager
                  , i = e.getPlayerCount();
                i <= this.focusIndex && (this.focusIndex = 0);
                var s = e.getPlayerByIndex(this.focusIndex);
                if (this.playerFocus !== s) {
                    var n = this.playerFocus;
                    if (this.playerFocus = s,
                    t.vehicleTimer.setPlayer(s),
                    n) {
                        var r = s.getDistanceBetweenPlayers(n);
                        r > 1500 && this.fastforward()
                    } else
                        this.fastforward()
                }
            }
            focusOnMainPlayer() {
                0 === this.focusIndex && this.playerFocus || (this.focusIndex = 0,
                this.focusOnPlayer())
            }
            update() {
                if (this.playerFocus) {
                    var t = this.playerFocus.getActiveVehicle()
                      , e = t.focalPoint
                      , i = this.position
                      , s = 3
                      , n = e.pos.x - i.x
                      , r = e.pos.y - i.y
                      , h = sqrt(pow(n, 2) + pow(r, 2));
                    h > 1500 && (s = 1),
                    i.x += (e.pos.x - i.x) / s,
                    i.y += (e.pos.y - i.y) / s
                }
            }
            updateZoom() {
                var t = this.zoom
                  , e = this.desiredZoom;
                t !== e && (this.scene.loading = !0,
                this._performZoom(),
                this.zoom === this.desiredZoom && this.zoomComplete())
            }
            zoomToPoint(t) {
                var e = this.scene
                  , i = e.screen
                  , s = this.position
                  , n = this.zoomPoint
                  , r = i.toReal(n.x, "x")
                  , o = i.toReal(n.y, "y")
                  , a = n.x / i.width
                  , h = n.y / i.height
                  , l = i.width / t
                  , c = i.height / t;
                s.x = r - l * a + l / 2,
                s.y = o - c * h + c / 2
            }
            _performZoom() {
                var t = this.scene
                  , e = this.zoom
                  , i = this.desiredZoom
                  , s = i - e
                  , n = s / 3;
                e += n,
                abs(s) < .05 && (e = i),
                this.zoomPoint && this.zoomToPoint(e),
                this.zoom = e
            }
            zoomComplete() {
                this.scene.redraw(),
                this.zooming = !1,
                this.scene.loading = !1
            }
            setZoom(t, e) {
                var i = this.scene;
                this.desiredZoom = round(t * i.game.pixelRatio * 10) / 10,
                this.zooming = !0,
                this.desiredZoom === this.zoom && (this.zooming = !1,
                this.scene.state.loading = !1),
                this.zoomPoint = !1,
                null === this.playerFocus && e && (this.zoomPoint = e),
                this.zoomPercentage = this.getZoomAsPercentage(),
                i.stateChanged()
            }
            resetZoom() {
                var t = this.settings.cameraStartZoom;
                this.setZoom(t)
            }
            getZoomAsPercentage() {
                var t = this.scene.settings
                  , e = this.desiredZoom / this.scene.game.pixelRatio / t.cameraStartZoom * 100;
                return 0 | e
            }
            increaseZoom() {
                var t = this.scene.settings
                  , e = t.cameraSensitivity
                  , i = this.desiredZoom + 2 * e
                  , s = this.scene.game.pixelRatio
                  , n = t.cameraZoomMax
                  , r = n * s;
                this.setZoom(i / s),
                this.desiredZoom > r && this.setZoom(n)
            }
            decreaseZoom() {
                var t = this.scene.settings
                  , e = t.cameraSensitivity
                  , i = this.desiredZoom - 2 * e
                  , s = this.scene.game.pixelRatio
                  , n = t.cameraZoomMin
                  , r = n * s;
                this.setZoom(i / s),
                this.desiredZoom < r && this.setZoom(n)
            }
            unfocus() {
                this.playerFocus = null,
                this.scene.vehicleTimer.removePlayer()
            }
            fastforward() {
                if (this.playerFocus) {
                    var t = this.playerFocus.getActiveVehicle()
                      , e = t.focalPoint;
                    this.position.x = e.pos.x,
                    this.position.y = e.pos.y
                }
            }
            close() {
                this.zoom = null,
                this.scene = null,
                this.position = null,
                this.playerFocus = null
            }
        }
    },
    88: function(t, e) {
        var Vector = t(8);
        e.exports = class Screen {
            constructor(a) {
                this.scene = a,
                this.game = a.game,
                this.size = new Vector(0,0),
                this.center = new Vector(0,0),
                this.setScreen()
            }
            game = null;
            scene = null;
            size = null;
            center = null;
            width = 0;
            height = 0;
            setScreen() {
                var t = this.game.width
                  , e = this.game.height;
                this.width = t,
                this.height = e,
                this.size.x = t,
                this.size.y = e,
                this.center.x = t / 2,
                this.center.y = e / 2
            }
            update() {
                var t = this.game;
                (t.width !== this.width || t.height !== this.height) && this.setScreen()
            }
            realToScreen(t, e) {
                var i = this.scene
                  , s = i.camera
                  , n = i.screen;
                return (t - s.position[e]) * s.zoom + n.center[e]
            }
            toReal(t, e) {
                var i = this.scene
                  , s = i.camera
                  , n = i.screen;
                return (t - n.center[e]) / s.zoom + s.position[e]
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
    },
    89: function() {
        this.createjs = {
            extend: function(t, e) {
                "use strict";
                function i() {
                    this.constructor = t
                }
                return i.prototype = e.prototype,
                t.prototype = new i
            },
            promote: function(t, e) {
                "use strict";
                var i = t.prototype
                  , s = Object.getPrototypeOf && Object.getPrototypeOf(i) || i.__proto__;
                if (s) {
                    i[(e += "_") + "constructor"] = s.constructor;
                    for (var n in s)
                        i.hasOwnProperty(n) && "function" == typeof s[n] && (i[e + n] = s[n])
                }
                return t
            },
            indexOf: function(t, e) {
                for (var i = 0, s = t.length; s > i; i++)
                    if (e === t[i])
                        return i;
                return -1
            },
            Event: class {
                constructor(t, e, i) {
                    this.type = t,
                    this.target = null,
                    this.currentTarget = null,
                    this.eventPhase = 0,
                    this.bubbles = !!e,
                    this.cancelable = !!i,
                    this.timeStamp = (new Date).getTime(),
                    this.defaultPrevented = !1,
                    this.propagationStopped = !1,
                    this.immediatePropagationStopped = !1,
                    this.removed = !1
                }
                preventDefault() {
                    this.defaultPrevented = this.cancelable && !0
                }
                stopPropagation() {
                    this.propagationStopped = !0
                }
                stopImmediatePropagation() {
                    this.immediatePropagationStopped = this.propagationStopped = !0
                }
                remove() {
                    this.removed = !0
                }
                clone() {
                    return new t(this.type,this.bubbles,this.cancelable)
                }
                set(t) {
                    for (var e in t)
                        this[e] = t[e];
                    return this
                }
                toString() {
                    return "[Event (type=" + this.type + ")]"
                }
            },
            EventDispatcher: class {
                constructor() {
                    this._listeners = null,
                    this._captureListeners = null,
                    this.initialize = function(t) {
                        t.addEventListener = e.addEventListener,
                        t.on = e.on,
                        t.removeEventListener = t.off = e.removeEventListener,
                        t.removeAllEventListeners = e.removeAllEventListeners,
                        t.hasEventListener = e.hasEventListener,
                        t.dispatchEvent = e.dispatchEvent,
                        t._dispatchEvent = e._dispatchEvent,
                        t.willTrigger = e.willTrigger
                    }
                }
                addEventListener(t, e, i) {
                    var s;
                    s = i ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
                    var n = s[t];
                    return n && this.removeEventListener(t, e, i),
                    n = s[t],
                    n ? n.push(e) : s[t] = [e],
                    e
                }
                on(t, e, i, s, n, r) {
                    return e.handleEvent && (i = i || e,
                    e = e.handleEvent),
                    i = i || this,
                    this.addEventListener(t, function(t) {
                        e.call(i, t, n),
                        s && t.remove()
                    }, r)
                }
                removeEventListener(t, e, i) {
                    var s = i ? this._captureListeners : this._listeners;
                    if (s) {
                        var n = s[t];
                        if (n)
                            for (var r = 0, o = n.length; o > r; r++)
                                if (n[r] == e) {
                                    1 == o ? delete s[t] : n.splice(r, 1);
                                    break
                                }
                    }
                }
                off = e.removeEventListener;
                removeAllEventListeners(t) {
                    t ? (this._listeners && delete this._listeners[t],
                    this._captureListeners && delete this._captureListeners[t]) : this._listeners = this._captureListeners = null
                }
                dispatchEvent(t) {
                    if ("string" == typeof t) {
                        var e = this._listeners;
                        if (!e || !e[t])
                            return !1;
                        t = new createjs.Event(t)
                    } else
                        t.target && t.clone && (t = t.clone());
                    try {
                        t.target = this
                    } catch (i) {}
                    if (t.bubbles && this.parent) {
                        for (var s = this, n = [s]; s.parent; )
                            n.push(s = s.parent);
                        var r, o = n.length;
                        for (r = o - 1; r >= 0 && !t.propagationStopped; r--)
                            n[r]._dispatchEvent(t, 1 + (0 == r));
                        for (r = 1; o > r && !t.propagationStopped; r++)
                            n[r]._dispatchEvent(t, 3)
                    } else
                        this._dispatchEvent(t, 2);
                    return t.defaultPrevented
                }
                hasEventListener(t) {
                    var e = this._listeners
                      , i = this._captureListeners;
                    return !!(e && e[t] || i && i[t])
                }
                willTrigger(t) {
                    for (var e = this; e; ) {
                        if (e.hasEventListener(t))
                            return !0;
                        e = e.parent
                    }
                    return !1
                }
                toString() {
                    return "[EventDispatcher]"
                }
                _dispatchEvent(t, e) {
                    var i, s = 1 == e ? this._captureListeners : this._listeners;
                    if (t && s) {
                        var n = s[t.type];
                        if (!n || !(i = n.length))
                            return;
                        try {
                            t.currentTarget = this
                        } catch (r) {}
                        try {
                            t.eventPhase = e
                        } catch (r) {}
                        t.removed = !1,
                        n = n.slice();
                        for (var o = 0; i > o && !t.immediatePropagationStopped; o++) {
                            var a = n[o];
                            a.handleEvent ? a.handleEvent(t) : a(t),
                            t.removed && (this.off(t.type, a, 1 == e),
                            t.removed = !1)
                        }
                    }
                }
            }
        },
        function() {
            function t() {
                throw "Ticker cannot be instantiated."
            }
            t.RAF_SYNCHED = "synched",
            t.RAF = "raf",
            t.TIMEOUT = "timeout",
            t.useRAF = !1,
            t.timingMode = null,
            t.maxDelta = 0,
            t.paused = !1,
            t.removeEventListener = null,
            t.removeAllEventListeners = null,
            t.dispatchEvent = null,
            t.hasEventListener = null,
            t._listeners = null,
            createjs.EventDispatcher.initialize(t),
            t._addEventListener = t.addEventListener,
            t.addEventListener = function() {
                return !t._inited && t.init(),
                t._addEventListener.apply(t, arguments)
            },
            t._inited = !1,
            t._startTime = 0,
            t._pausedTime = 0,
            t._ticks = 0,
            t._pausedTicks = 0,
            t._interval = 50,
            t._lastTime = 0,
            t._times = null,
            t._tickTimes = null,
            t._timerId = null,
            t._raf = !0,
            t.setInterval = function(e) {
                t._interval = e,
                t._inited && t._setupTick()
            },
            t.getInterval = function() {
                return t._interval
            },
            t.setFPS = function(e) {
                t.setInterval(1e3 / e)
            },
            t.getFPS = function() {
                return 1e3 / t._interval
            }
            ;
            try {
                Object.defineProperties(t, {
                    interval: {
                        get: t.getInterval,
                        set: t.setInterval
                    },
                    framerate: {
                        get: t.getFPS,
                        set: t.setFPS
                    }
                })
            } catch (e) {
                console.log(e)
            }
            t.init = function() {
                t._inited || (t._inited = !0,
                t._times = [],
                t._tickTimes = [],
                t._startTime = t._getTime(),
                t._times.push(t._lastTime = 0),
                t.interval = t._interval)
            },
            t.reset = function() {
                if (t._raf) {
                    var e = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
                    e && e(t._timerId)
                } else
                    clearTimeout(t._timerId);
                t.removeAllEventListeners("tick"),
                t._timerId = t._times = t._tickTimes = null,
                t._startTime = t._lastTime = t._ticks = 0,
                t._inited = !1
            },
            t.getMeasuredTickTime = function(e) {
                var i = 0
                  , s = t._tickTimes;
                if (!s || s.length < 1)
                    return -1;
                e = min(s.length, e || 0 | t.getFPS());
                for (var n = 0; e > n; n++)
                    i += s[n];
                return i / e
            },
            t.getMeasuredFPS = function(e) {
                var i = t._times;
                return !i || i.length < 2 ? -1 : (e = min(i.length - 1, e || 0 | t.getFPS()),
                1e3 / ((i[0] - i[e]) / e))
            },
            t.setPaused = function(e) {
                t.paused = e
            },
            t.getPaused = function() {
                return t.paused
            },
            t.getTime = function(e) {
                return t._startTime ? t._getTime() - (e ? t._pausedTime : 0) : -1
            },
            t.getEventTime = function(e) {
                return t._startTime ? (t._lastTime || t._startTime) - (e ? t._pausedTime : 0) : -1
            },
            t.getTicks = function(e) {
                return t._ticks - (e ? t._pausedTicks : 0)
            },
            t._handleSynch = function() {
                t._timerId = null,
                t._setupTick(),
                t._getTime() - t._lastTime >= .97 * (t._interval - 1) && t._tick()
            },
            t._handleRAF = function() {
                t._timerId = null,
                t._setupTick(),
                t._tick()
            },
            t._handleTimeout = function() {
                t._timerId = null,
                t._setupTick(),
                t._tick()
            },
            t._setupTick = function() {
                if (null == t._timerId) {
                    var e = t.timingMode || t.useRAF && t.RAF_SYNCHED;
                    if (e == t.RAF_SYNCHED || e == t.RAF) {
                        var i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
                        if (i)
                            return t._timerId = i(e == t.RAF ? t._handleRAF : t._handleSynch),
                            void (t._raf = !0)
                    }
                    t._raf = !1,
                    t._timerId = setTimeout(t._handleTimeout, t._interval)
                }
            },
            t._tick = function() {
                var e = t.paused
                  , i = t._getTime()
                  , s = i - t._lastTime;
                if (t._lastTime = i,
                t._ticks++,
                e && (t._pausedTicks++,
                t._pausedTime += s),
                t.hasEventListener("tick")) {
                    var n = new createjs.Event("tick")
                      , r = t.maxDelta;
                    n.delta = r && s > r ? r : s,
                    n.paused = e,
                    n.time = i,
                    n.runTime = i - t._pausedTime,
                    t.dispatchEvent(n)
                }
                for (t._tickTimes.unshift(t._getTime() - i); t._tickTimes.length > 100; )
                    t._tickTimes.pop();
                for (t._times.unshift(i); t._times.length > 100; )
                    t._times.pop()
            }
            ;
            var i = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
            t._getTime = function() {
                return (i && i.call(performance) || (new Date).getTime()) - t._startTime
            },
            createjs.Ticker = t
        }(),
        function() {
            "use strict";
            function t() {
                throw "UID cannot be instantiated"
            }
            t._nextID = 0,
            t.get = function() {
                return t._nextID++
            },
            createjs.UID = t
        }(),
        function() {
            function t(t, e, i, s, n, r, o, a, h, l) {
                this.Event_constructor(t, e, i),
                this.stageX = s,
                this.stageY = n,
                this.rawX = null == h ? s : h,
                this.rawY = null == l ? n : l,
                this.nativeEvent = r,
                this.pointerID = o,
                this.primary = !!a
            }
            var e = createjs.extend(t, createjs.Event);
            e._get_localX = function() {
                return this.currentTarget.globalToLocal(this.rawX, this.rawY).x
            },
            e._get_localY = function() {
                return this.currentTarget.globalToLocal(this.rawX, this.rawY).y
            },
            e._get_isTouch = function() {
                return -1 !== this.pointerID
            }
            ;
            try {
                Object.defineProperties(e, {
                    localX: {
                        get: e._get_localX
                    },
                    localY: {
                        get: e._get_localY
                    },
                    isTouch: {
                        get: e._get_isTouch
                    }
                })
            } catch (i) {}
            e.clone = function() {
                return new t(this.type,this.bubbles,this.cancelable,this.stageX,this.stageY,this.nativeEvent,this.pointerID,this.primary,this.rawX,this.rawY)
            },
            e.toString = function() {
                return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
            },
            createjs.MouseEvent = createjs.promote(t, "Event")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i, s, n, r) {
                this.setValues(t, e, i, s, n, r)
            }
            var e = t.prototype;
            t.DEG_TO_RAD = PI / 180,
            t.identity = null,
            e.setValues = function(t, e, i, s, n, r) {
                return this.a = null == t ? 1 : t,
                this.b = e || 0,
                this.c = i || 0,
                this.d = null == s ? 1 : s,
                this.tx = n || 0,
                this.ty = r || 0,
                this
            },
            e.append = function(t, e, i, s, n, r) {
                var o = this.a
                  , a = this.b
                  , h = this.c
                  , l = this.d;
                return (1 != t || 0 != e || 0 != i || 1 != s) && (this.a = o * t + h * e,
                this.b = a * t + l * e,
                this.c = o * i + h * s,
                this.d = a * i + l * s),
                this.tx = o * n + h * r + this.tx,
                this.ty = a * n + l * r + this.ty,
                this
            },
            e.prepend = function(t, e, i, s, n, r) {
                var o = this.a
                  , a = this.c
                  , h = this.tx;
                return this.a = t * o + i * this.b,
                this.b = e * o + s * this.b,
                this.c = t * a + i * this.d,
                this.d = e * a + s * this.d,
                this.tx = t * h + i * this.ty + n,
                this.ty = e * h + s * this.ty + r,
                this
            },
            e.appendMatrix = function(t) {
                return this.append(t.a, t.b, t.c, t.d, t.tx, t.ty)
            },
            e.prependMatrix = function(t) {
                return this.prepend(t.a, t.b, t.c, t.d, t.tx, t.ty)
            },
            e.appendTransform = function(e, i, s, n, r, o, a, h, l) {
                if (r % 360)
                    var c = r * t.DEG_TO_RAD
                      , u = cos(c)
                      , p = sin(c);
                else
                    u = 1,
                    p = 0;
                return o || a ? (o *= t.DEG_TO_RAD,
                a *= t.DEG_TO_RAD,
                this.append(cos(a), sin(a), -sin(o), cos(o), e, i),
                this.append(u * s, p * s, -p * n, u * n, 0, 0)) : this.append(u * s, p * s, -p * n, u * n, e, i),
                (h || l) && (this.tx -= h * this.a + l * this.c,
                this.ty -= h * this.b + l * this.d),
                this
            },
            e.prependTransform = function(e, i, s, n, r, o, a, h, l) {
                if (r % 360)
                    var c = r * t.DEG_TO_RAD
                      , u = cos(c)
                      , p = sin(c);
                else
                    u = 1,
                    p = 0;
                return (h || l) && (this.tx -= h,
                this.ty -= l),
                o || a ? (o *= t.DEG_TO_RAD,
                a *= t.DEG_TO_RAD,
                this.prepend(u * s, p * s, -p * n, u * n, 0, 0),
                this.prepend(cos(a), sin(a), -sin(o), cos(o), e, i)) : this.prepend(u * s, p * s, -p * n, u * n, e, i),
                this
            },
            e.rotate = function(e) {
                e *= t.DEG_TO_RAD;
                var i = cos(e)
                  , s = sin(e)
                  , n = this.a
                  , r = this.b;
                return this.a = n * i + this.c * s,
                this.b = r * i + this.d * s,
                this.c = -n * s + this.c * i,
                this.d = -r * s + this.d * i,
                this
            },
            e.skew = function(e, i) {
                return e *= t.DEG_TO_RAD,
                i *= t.DEG_TO_RAD,
                this.append(cos(i), sin(i), -sin(e), cos(e), 0, 0),
                this
            },
            e.scale = function(t, e) {
                return this.a *= t,
                this.b *= t,
                this.c *= e,
                this.d *= e,
                this
            },
            e.translate = function(t, e) {
                return this.tx += this.a * t + this.c * e,
                this.ty += this.b * t + this.d * e,
                this
            },
            e.identity = function() {
                return this.a = this.d = 1,
                this.b = this.c = this.tx = this.ty = 0,
                this
            },
            e.invert = function() {
                var t = this.a
                  , e = this.b
                  , i = this.c
                  , s = this.d
                  , n = this.tx
                  , r = t * s - e * i;
                return this.a = s / r,
                this.b = -e / r,
                this.c = -i / r,
                this.d = t / r,
                this.tx = (i * this.ty - s * n) / r,
                this.ty = -(t * this.ty - e * n) / r,
                this
            },
            e.isIdentity = function() {
                return 0 === this.tx && 0 === this.ty && 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d
            },
            e.equals = function(t) {
                return this.tx === t.tx && this.ty === t.ty && this.a === t.a && this.b === t.b && this.c === t.c && this.d === t.d
            },
            e.transformPoint = function(t, e, i) {
                return i = i || {},
                i.x = t * this.a + e * this.c + this.tx,
                i.y = t * this.b + e * this.d + this.ty,
                i
            },
            e.decompose = function(e) {
                null == e && (e = {}),
                e.x = this.tx,
                e.y = this.ty,
                e.scaleX = sqrt(this.a * this.a + this.b * this.b),
                e.scaleY = sqrt(this.c * this.c + this.d * this.d);
                var i = atan2(-this.c, this.d)
                  , s = atan2(this.b, this.a)
                  , n = abs(1 - i / s);
                return 1e-5 > n ? (e.rotation = s / t.DEG_TO_RAD,
                this.a < 0 && this.d >= 0 && (e.rotation += e.rotation <= 0 ? 180 : -180),
                e.skewX = e.skewY = 0) : (e.skewX = i / t.DEG_TO_RAD,
                e.skewY = s / t.DEG_TO_RAD),
                e
            },
            e.copy = function(t) {
                return this.setValues(t.a, t.b, t.c, t.d, t.tx, t.ty)
            },
            e.clone = function() {
                return new t(this.a,this.b,this.c,this.d,this.tx,this.ty)
            },
            e.toString = function() {
                return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
            },
            t.identity = new t,
            createjs.Matrix2D = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i, s, n) {
                this.setValues(t, e, i, s, n)
            }
            var e = t.prototype;
            e.setValues = function(t, e, i, s, n) {
                return this.visible = null == t ? !0 : !!t,
                this.alpha = null == e ? 1 : e,
                this.shadow = i,
                this.compositeOperation = i,
                this.matrix = n || this.matrix && this.matrix.identity() || new createjs.Matrix2D,
                this
            },
            e.append = function(t, e, i, s, n) {
                return this.alpha *= e,
                this.shadow = i || this.shadow,
                this.compositeOperation = s || this.compositeOperation,
                this.visible = this.visible && t,
                n && this.matrix.appendMatrix(n),
                this
            },
            e.prepend = function(t, e, i, s, n) {
                return this.alpha *= e,
                this.shadow = this.shadow || i,
                this.compositeOperation = this.compositeOperation || s,
                this.visible = this.visible && t,
                n && this.matrix.prependMatrix(n),
                this
            },
            e.identity = function() {
                return this.visible = !0,
                this.alpha = 1,
                this.shadow = this.compositeOperation = null,
                this.matrix.identity(),
                this
            },
            e.clone = function() {
                return new t(this.alpha,this.shadow,this.compositeOperation,this.visible,this.matrix.clone())
            },
            createjs.DisplayProps = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e) {
                this.setValues(t, e)
            }
            var e = t.prototype;
            e.setValues = function(t, e) {
                return this.x = t || 0,
                this.y = e || 0,
                this
            },
            e.copy = function(t) {
                return this.x = t.x,
                this.y = t.y,
                this
            },
            e.clone = function() {
                return new t(this.x,this.y)
            },
            e.toString = function() {
                return "[Point (x=" + this.x + " y=" + this.y + ")]"
            },
            createjs.Point = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i, s) {
                this.setValues(t, e, i, s)
            }
            var e = t.prototype;
            e.setValues = function(t, e, i, s) {
                return this.x = t || 0,
                this.y = e || 0,
                this.width = i || 0,
                this.height = s || 0,
                this
            },
            e.extend = function(t, e, i, s) {
                return i = i || 0,
                s = s || 0,
                t + i > this.x + this.width && (this.width = t + i - this.x),
                e + s > this.y + this.height && (this.height = e + s - this.y),
                t < this.x && (this.width += this.x - t,
                this.x = t),
                e < this.y && (this.height += this.y - e,
                this.y = e),
                this
            },
            e.pad = function(t, e, i, s) {
                return this.x -= t,
                this.y -= e,
                this.width += t + i,
                this.height += e + s,
                this
            },
            e.copy = function(t) {
                return this.setValues(t.x, t.y, t.width, t.height)
            },
            e.contains = function(t, e, i, s) {
                return i = i || 0,
                s = s || 0,
                t >= this.x && t + i <= this.x + this.width && e >= this.y && e + s <= this.y + this.height
            },
            e.union = function(t) {
                return this.clone().extend(t.x, t.y, t.width, t.height)
            },
            e.intersection = function(e) {
                var i = e.x
                  , s = e.y
                  , n = i + e.width
                  , r = s + e.height;
                return this.x > i && (i = this.x),
                this.y > s && (s = this.y),
                this.x + this.width < n && (n = this.x + this.width),
                this.y + this.height < r && (r = this.y + this.height),
                i >= n || s >= r ? null : new t(i,s,n - i,r - s)
            },
            e.intersects = function(t) {
                return t.x <= this.x + this.width && this.x <= t.x + t.width && t.y <= this.y + this.height && this.y <= t.y + t.height
            },
            e.isEmpty = function() {
                return this.width <= 0 || this.height <= 0
            },
            e.clone = function() {
                return new t(this.x,this.y,this.width,this.height)
            },
            e.toString = function() {
                return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
            },
            createjs.Rectangle = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i, s, n, r, o) {
                t.addEventListener && (this.target = t,
                this.overLabel = null == i ? "over" : i,
                this.outLabel = null == e ? "out" : e,
                this.downLabel = null == s ? "down" : s,
                this.play = n,
                this._isPressed = !1,
                this._isOver = !1,
                this._enabled = !1,
                t.mouseChildren = !1,
                this.enabled = !0,
                this.handleEvent({}),
                r && (o && (r.actionsEnabled = !1,
                r.gotoAndStop && r.gotoAndStop(o)),
                t.hitArea = r))
            }
            var e = t.prototype;
            e.setEnabled = function(t) {
                if (t != this._enabled) {
                    var e = this.target;
                    this._enabled = t,
                    t ? (e.cursor = "pointer",
                    e.addEventListener("rollover", this),
                    e.addEventListener("rollout", this),
                    e.addEventListener("mousedown", this),
                    e.addEventListener("pressup", this)) : (e.cursor = null,
                    e.removeEventListener("rollover", this),
                    e.removeEventListener("rollout", this),
                    e.removeEventListener("mousedown", this),
                    e.removeEventListener("pressup", this))
                }
            },
            e.getEnabled = function() {
                return this._enabled
            }
            ;
            try {
                Object.defineProperties(e, {
                    enabled: {
                        get: e.getEnabled,
                        set: e.setEnabled
                    }
                })
            } catch (i) {}
            e.toString = function() {
                return "[ButtonHelper]"
            },
            e.handleEvent = function(t) {
                var e, i = this.target, s = t.type;
                "mousedown" == s ? (this._isPressed = !0,
                e = this.downLabel) : "pressup" == s ? (this._isPressed = !1,
                e = this._isOver ? this.overLabel : this.outLabel) : "rollover" == s ? (this._isOver = !0,
                e = this._isPressed ? this.downLabel : this.overLabel) : (this._isOver = !1,
                e = this._isPressed ? this.overLabel : this.outLabel),
                this.play ? i.gotoAndPlay && i.gotoAndPlay(e) : i.gotoAndStop && i.gotoAndStop(e)
            },
            createjs.ButtonHelper = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i, s) {
                this.color = t || "black",
                this.offsetX = e || 0,
                this.offsetY = i || 0,
                this.blur = s || 0
            }
            var e = t.prototype;
            t.identity = new t("transparent",0,0,0),
            e.toString = function() {
                return "[Shadow]"
            },
            e.clone = function() {
                return new t(this.color,this.offsetX,this.offsetY,this.blur)
            },
            createjs.Shadow = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t) {
                this.EventDispatcher_constructor(),
                this.complete = !0,
                this.framerate = 0,
                this._animations = null,
                this._frames = null,
                this._images = null,
                this._data = null,
                this._loadCount = 0,
                this._frameHeight = 0,
                this._frameWidth = 0,
                this._numFrames = 0,
                this._regX = 0,
                this._regY = 0,
                this._spacing = 0,
                this._margin = 0,
                this._parseData(t)
            }
            var e = createjs.extend(t, createjs.EventDispatcher);
            e.getAnimations = function() {
                return this._animations.slice()
            }
            ;
            try {
                Object.defineProperties(e, {
                    animations: {
                        get: e.getAnimations
                    }
                })
            } catch (i) {}
            e.getNumFrames = function(t) {
                if (null == t)
                    return this._frames ? this._frames.length : this._numFrames || 0;
                var e = this._data[t];
                return null == e ? 0 : e.frames.length
            },
            e.getAnimation = function(t) {
                return this._data[t]
            },
            e.getFrame = function(t) {
                var e;
                return this._frames && (e = this._frames[t]) ? e : null
            },
            e.getFrameBounds = function(t, e) {
                var i = this.getFrame(t);
                return i ? (e || new createjs.Rectangle).setValues(-i.regX, -i.regY, i.rect.width, i.rect.height) : null
            },
            e.toString = function() {
                return "[SpriteSheet]"
            },
            e.clone = function() {
                throw "SpriteSheet cannot be cloned."
            },
            e._parseData = function(t) {
                var e, i, s, n;
                if (null != t) {
                    if (this.framerate = t.framerate || 0,
                    t.images && (i = t.images.length) > 0)
                        for (n = this._images = [],
                        e = 0; i > e; e++) {
                            var r = t.images[e];
                            if ("string" == typeof r) {
                                var o = r;
                                r = document.createElement("img"),
                                r.src = o
                            }
                            n.push(r),
                            r.getContext || r.complete || (this._loadCount++,
                            this.complete = !1,
                            function(t) {
                                r.onload = function() {
                                    t._handleImageLoad()
                                }
                            }(this))
                        }
                    if (null == t.frames)
                        ;
                    else if (t.frames instanceof Array)
                        for (this._frames = [],
                        n = t.frames,
                        e = 0,
                        i = n.length; i > e; e++) {
                            var a = n[e];
                            this._frames.push({
                                image: this._images[a[4] ? a[4] : 0],
                                rect: new createjs.Rectangle(a[0],a[1],a[2],a[3]),
                                regX: a[5] || 0,
                                regY: a[6] || 0
                            })
                        }
                    else
                        s = t.frames,
                        this._frameWidth = s.width,
                        this._frameHeight = s.height,
                        this._regX = s.regX || 0,
                        this._regY = s.regY || 0,
                        this._spacing = s.spacing || 0,
                        this._margin = s.margin || 0,
                        this._numFrames = s.count,
                        0 == this._loadCount && this._calculateFrames();
                    if (this._animations = [],
                    null != (s = t.animations)) {
                        this._data = {};
                        var h;
                        for (h in s) {
                            var l = {
                                name: h
                            }
                              , c = s[h];
                            if ("number" == typeof c)
                                n = l.frames = [c];
                            else if (c instanceof Array)
                                if (1 == c.length)
                                    l.frames = [c[0]];
                                else
                                    for (l.speed = c[3],
                                    l.next = c[2],
                                    n = l.frames = [],
                                    e = c[0]; e <= c[1]; e++)
                                        n.push(e);
                            else {
                                l.speed = c.speed,
                                l.next = c.next;
                                var u = c.frames;
                                n = l.frames = "number" == typeof u ? [u] : u.slice(0)
                            }
                            (l.next === !0 || void 0 === l.next) && (l.next = h),
                            (l.next === !1 || n.length < 2 && l.next == h) && (l.next = null),
                            l.speed || (l.speed = 1),
                            this._animations.push(h),
                            this._data[h] = l
                        }
                    }
                }
            },
            e._handleImageLoad = function() {
                0 == --this._loadCount && (this._calculateFrames(),
                this.complete = !0,
                this.dispatchEvent("complete"))
            },
            e._calculateFrames = function() {
                if (!this._frames && 0 != this._frameWidth) {
                    this._frames = [];
                    var t = this._numFrames || 1e5
                      , e = 0
                      , i = this._frameWidth
                      , s = this._frameHeight
                      , n = this._spacing
                      , r = this._margin;
                    t: for (var o = 0, a = this._images; o < a.length; o++)
                        for (var h = a[o], l = h.width, c = h.height, u = r; c - r - s >= u; ) {
                            for (var p = r; l - r - i >= p; ) {
                                if (e >= t)
                                    break t;
                                e++,
                                this._frames.push({
                                    image: h,
                                    rect: new createjs.Rectangle(p,u,i,s),
                                    regX: this._regX,
                                    regY: this._regY
                                }),
                                p += i + n
                            }
                            u += s + n
                        }
                    this._numFrames = e
                }
            },
            createjs.SpriteSheet = createjs.promote(t, "EventDispatcher")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                this.command = null,
                this._stroke = null,
                this._strokeStyle = null,
                this._oldStrokeStyle = null,
                this._strokeDash = null,
                this._oldStrokeDash = null,
                this._strokeIgnoreScale = !1,
                this._fill = null,
                this._instructions = [],
                this._commitIndex = 0,
                this._activeInstructions = [],
                this._dirty = !1,
                this._storeIndex = 0,
                this.clear()
            }
            var e = t.prototype
              , i = t;
            t.getRGB = function(t, e, i, s) {
                return null != t && null == i && (s = e,
                i = 255 & t,
                e = t >> 8 & 255,
                t = t >> 16 & 255),
                null == s ? "rgb(" + t + "," + e + "," + i + ")" : "rgba(" + t + "," + e + "," + i + "," + s + ")"
            },
            t.getHSL = function(t, e, i, s) {
                return null == s ? "hsl(" + t % 360 + "," + e + "%," + i + "%)" : "hsla(" + t % 360 + "," + e + "%," + i + "%," + s + ")"
            },
            t.BASE_64 = {
                A: 0,
                B: 1,
                C: 2,
                D: 3,
                E: 4,
                F: 5,
                G: 6,
                H: 7,
                I: 8,
                J: 9,
                K: 10,
                L: 11,
                M: 12,
                N: 13,
                O: 14,
                P: 15,
                Q: 16,
                R: 17,
                S: 18,
                T: 19,
                U: 20,
                V: 21,
                W: 22,
                X: 23,
                Y: 24,
                Z: 25,
                a: 26,
                b: 27,
                c: 28,
                d: 29,
                e: 30,
                f: 31,
                g: 32,
                h: 33,
                i: 34,
                j: 35,
                k: 36,
                l: 37,
                m: 38,
                n: 39,
                o: 40,
                p: 41,
                q: 42,
                r: 43,
                s: 44,
                t: 45,
                u: 46,
                v: 47,
                w: 48,
                x: 49,
                y: 50,
                z: 51,
                0: 52,
                1: 53,
                2: 54,
                3: 55,
                4: 56,
                5: 57,
                6: 58,
                7: 59,
                8: 60,
                9: 61,
                "+": 62,
                "/": 63
            },
            t.STROKE_CAPS_MAP = ["butt", "round", "square"],
            t.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
            var s = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            s.getContext && (t._ctx = s.getContext("2d"),
            s.width = s.height = 1),
            e.getInstructions = function() {
                return this._updateInstructions(),
                this._instructions
            }
            ;
            try {
                Object.defineProperties(e, {
                    instructions: {
                        get: e.getInstructions
                    }
                })
            } catch (n) {}
            e.isEmpty = function() {
                return !(this._instructions.length || this._activeInstructions.length)
            },
            e.draw = function(t, e) {
                this._updateInstructions();
                for (var i = this._instructions, s = this._storeIndex, n = i.length; n > s; s++)
                    i[s].exec(t, e)
            },
            e.drawAsPath = function(t) {
                this._updateInstructions();
                for (var e, i = this._instructions, s = this._storeIndex, n = i.length; n > s; s++)
                    (e = i[s]).path !== !1 && e.exec(t)
            },
            e.moveTo = function(t, e) {
                return this.append(new i.MoveTo(t,e), !0)
            },
            e.lineTo = function(t, e) {
                return this.append(new i.LineTo(t,e))
            },
            e.arcTo = function(t, e, s, n, r) {
                return this.append(new i.ArcTo(t,e,s,n,r))
            },
            e.arc = function(t, e, s, n, r, o) {
                return this.append(new i.Arc(t,e,s,n,r,o))
            },
            e.quadraticCurveTo = function(t, e, s, n) {
                return this.append(new i.QuadraticCurveTo(t,e,s,n))
            },
            e.bezierCurveTo = function(t, e, s, n, r, o) {
                return this.append(new i.BezierCurveTo(t,e,s,n,r,o))
            },
            e.rect = function(t, e, s, n) {
                return this.append(new i.Rect(t,e,s,n))
            },
            e.closePath = function() {
                return this._activeInstructions.length ? this.append(new i.ClosePath) : this
            },
            e.clear = function() {
                return this._instructions.length = this._activeInstructions.length = this._commitIndex = 0,
                this._strokeStyle = this._stroke = this._fill = this._strokeDash = null,
                this._dirty = this._strokeIgnoreScale = !1,
                this
            },
            e.beginFill = function(t) {
                return this._setFill(t ? new i.Fill(t) : null)
            },
            e.beginLinearGradientFill = function(t, e, s, n, r, o) {
                return this._setFill((new i.Fill).linearGradient(t, e, s, n, r, o))
            },
            e.beginRadialGradientFill = function(t, e, s, n, r, o, a, h) {
                return this._setFill((new i.Fill).radialGradient(t, e, s, n, r, o, a, h))
            },
            e.beginBitmapFill = function(t, e, s) {
                return this._setFill(new i.Fill(null,s).bitmap(t, e))
            },
            e.endFill = function() {
                return this.beginFill()
            },
            e.setStrokeStyle = function(t, e, s, n, r) {
                return this._updateInstructions(!0),
                this._strokeStyle = this.command = new i.StrokeStyle(t,e,s,n,r),
                this._stroke && (this._stroke.ignoreScale = r),
                this._strokeIgnoreScale = r,
                this
            },
            e.setStrokeDash = function(t, e) {
                return this._updateInstructions(!0),
                this._strokeDash = this.command = new i.StrokeDash(t,e),
                this
            },
            e.beginStroke = function(t) {
                return this._setStroke(t ? new i.Stroke(t) : null)
            },
            e.beginLinearGradientStroke = function(t, e, s, n, r, o) {
                return this._setStroke((new i.Stroke).linearGradient(t, e, s, n, r, o))
            },
            e.beginRadialGradientStroke = function(t, e, s, n, r, o, a, h) {
                return this._setStroke((new i.Stroke).radialGradient(t, e, s, n, r, o, a, h))
            },
            e.beginBitmapStroke = function(t, e) {
                return this._setStroke((new i.Stroke).bitmap(t, e))
            },
            e.endStroke = function() {
                return this.beginStroke()
            },
            e.curveTo = e.quadraticCurveTo,
            e.drawRect = e.rect,
            e.drawRoundRect = function(t, e, i, s, n) {
                return this.drawRoundRectComplex(t, e, i, s, n, n, n, n)
            },
            e.drawRoundRectComplex = function(t, e, s, n, r, o, a, h) {
                return this.append(new i.RoundRect(t,e,s,n,r,o,a,h))
            },
            e.drawCircle = function(t, e, s) {
                return this.append(new i.Circle(t,e,s))
            },
            e.drawEllipse = function(t, e, s, n) {
                return this.append(new i.Ellipse(t,e,s,n))
            },
            e.drawPolyStar = function(t, e, s, n, r, o) {
                return this.append(new i.PolyStar(t,e,s,n,r,o))
            },
            e.append = function(t, e) {
                return this._activeInstructions.push(t),
                this.command = t,
                e || (this._dirty = !0),
                this
            },
            e.decodePath = function(e) {
                for (var i = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath], s = [2, 2, 4, 6, 0], n = 0, r = e.length, o = [], a = 0, h = 0, l = t.BASE_64; r > n; ) {
                    var c = e.charAt(n)
                      , u = l[c]
                      , p = u >> 3
                      , d = i[p];
                    if (!d || 3 & u)
                        throw "bad path data (@" + n + "): " + c;
                    var f = s[p];
                    p || (a = h = 0),
                    o.length = 0,
                    n++;
                    for (var v = (u >> 2 & 1) + 2, g = 0; f > g; g++) {
                        var m = l[e.charAt(n)]
                          , y = m >> 5 ? -1 : 1;
                        m = (31 & m) << 6 | l[e.charAt(n + 1)],
                        3 == v && (m = m << 6 | l[e.charAt(n + 2)]),
                        m = y * m / 10,
                        g % 2 ? a = m += a : h = m += h,
                        o[g] = m,
                        n += v
                    }
                    d.apply(this, o)
                }
                return this
            },
            e.store = function() {
                return this._updateInstructions(!0),
                this._storeIndex = this._instructions.length,
                this
            },
            e.unstore = function() {
                return this._storeIndex = 0,
                this
            },
            e.clone = function() {
                var e = new t;
                return e.command = this.command,
                e._stroke = this._stroke,
                e._strokeStyle = this._strokeStyle,
                e._strokeDash = this._strokeDash,
                e._strokeIgnoreScale = this._strokeIgnoreScale,
                e._fill = this._fill,
                e._instructions = this._instructions.slice(),
                e._commitIndex = this._commitIndex,
                e._activeInstructions = this._activeInstructions.slice(),
                e._dirty = this._dirty,
                e._storeIndex = this._storeIndex,
                e
            },
            e.toString = function() {
                return "[Graphics]"
            },
            e.mt = e.moveTo,
            e.lt = e.lineTo,
            e.at = e.arcTo,
            e.bt = e.bezierCurveTo,
            e.qt = e.quadraticCurveTo,
            e.a = e.arc,
            e.r = e.rect,
            e.cp = e.closePath,
            e.c = e.clear,
            e.f = e.beginFill,
            e.lf = e.beginLinearGradientFill,
            e.rf = e.beginRadialGradientFill,
            e.bf = e.beginBitmapFill,
            e.ef = e.endFill,
            e.ss = e.setStrokeStyle,
            e.sd = e.setStrokeDash,
            e.s = e.beginStroke,
            e.ls = e.beginLinearGradientStroke,
            e.rs = e.beginRadialGradientStroke,
            e.bs = e.beginBitmapStroke,
            e.es = e.endStroke,
            e.dr = e.drawRect,
            e.rr = e.drawRoundRect,
            e.rc = e.drawRoundRectComplex,
            e.dc = e.drawCircle,
            e.de = e.drawEllipse,
            e.dp = e.drawPolyStar,
            e.p = e.decodePath,
            e._updateInstructions = function(e) {
                var i = this._instructions
                  , s = this._activeInstructions
                  , n = this._commitIndex;
                if (this._dirty && s.length) {
                    i.length = n,
                    i.push(t.beginCmd);
                    var r = s.length
                      , o = i.length;
                    i.length = o + r;
                    for (var a = 0; r > a; a++)
                        i[a + o] = s[a];
                    this._fill && i.push(this._fill),
                    this._stroke && (this._strokeDash !== this._oldStrokeDash && (this._oldStrokeDash = this._strokeDash,
                    i.push(this._strokeDash)),
                    this._strokeStyle !== this._oldStrokeStyle && (this._oldStrokeStyle = this._strokeStyle,
                    i.push(this._strokeStyle)),
                    i.push(this._stroke)),
                    this._dirty = !1
                }
                e && (s.length = 0,
                this._commitIndex = i.length)
            },
            e._setFill = function(t) {
                return this._updateInstructions(!0),
                this.command = this._fill = t,
                this
            },
            e._setStroke = function(t) {
                return this._updateInstructions(!0),
                (this.command = this._stroke = t) && (t.ignoreScale = this._strokeIgnoreScale),
                this
            },
            (i.LineTo = function(t, e) {
                this.x = t,
                this.y = e
            }
            ).prototype.exec = function(t) {
                t.lineTo(this.x, this.y)
            },
            (i.MoveTo = function(t, e) {
                this.x = t,
                this.y = e
            }
            ).prototype.exec = function(t) {
                t.moveTo(this.x, this.y)
            },
            (i.ArcTo = function(t, e, i, s, n) {
                this.x1 = t,
                this.y1 = e,
                this.x2 = i,
                this.y2 = s,
                this.radius = n
            }
            ).prototype.exec = function(t) {
                t.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius)
            },
            (i.Arc = function(t, e, i, s, n, r) {
                this.x = t,
                this.y = e,
                this.radius = i,
                this.startAngle = s,
                this.endAngle = n,
                this.anticlockwise = !!r
            }
            ).prototype.exec = function(t) {
                t.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
            },
            (i.QuadraticCurveTo = function(t, e, i, s) {
                this.cpx = t,
                this.cpy = e,
                this.x = i,
                this.y = s
            }
            ).prototype.exec = function(t) {
                t.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y)
            },
            (i.BezierCurveTo = function(t, e, i, s, n, r) {
                this.cp1x = t,
                this.cp1y = e,
                this.cp2x = i,
                this.cp2y = s,
                this.x = n,
                this.y = r
            }
            ).prototype.exec = function(t) {
                t.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y)
            },
            (i.Rect = function(t, e, i, s) {
                this.x = t,
                this.y = e,
                this.w = i,
                this.h = s
            }
            ).prototype.exec = function(t) {
                t.rect(this.x, this.y, this.w, this.h)
            },
            (i.ClosePath = function() {}
            ).prototype.exec = function(t) {
                t.closePath()
            },
            (i.BeginPath = function() {}
            ).prototype.exec = function(t) {
                t.beginPath()
            },
            e = (i.Fill = function(t, e) {
                this.style = t,
                this.matrix = e
            }).prototype,
            e.exec = function(t) {
                if (this.style) {
                    t.fillStyle = this.style;
                    var e = this.matrix;
                    e && (t.save(),
                    t.transform(e.a, e.b, e.c, e.d, e.tx, e.ty)),
                    t.fill(),
                    e && t.restore()
                }
            },
            e.linearGradient = function(e, i, s, n, r, o) {
                for (var a = this.style = t._ctx.createLinearGradient(s, n, r, o), h = 0, l = e.length; l > h; h++)
                    a.addColorStop(i[h], e[h]);
                return a.props = {
                    colors: e,
                    ratios: i,
                    x0: s,
                    y0: n,
                    x1: r,
                    y1: o,
                    type: "linear"
                },
                this
            },
            e.radialGradient = function(e, i, s, n, r, o, a, h) {
                for (var l = this.style = t._ctx.createRadialGradient(s, n, r, o, a, h), c = 0, u = e.length; u > c; c++)
                    l.addColorStop(i[c], e[c]);
                return l.props = {
                    colors: e,
                    ratios: i,
                    x0: s,
                    y0: n,
                    r0: r,
                    x1: o,
                    y1: a,
                    r1: h,
                    type: "radial"
                },
                this
            },
            e.bitmap = function(e, i) {
                var s = this.style = t._ctx.createPattern(e, i || "");
                return s.props = {
                    image: e,
                    repetition: i,
                    type: "bitmap"
                },
                this
            },
            e.path = !1,
            e = (i.Stroke = function(t, e) {
                this.style = t,
                this.ignoreScale = e
            }).prototype,
            e.exec = function(t) {
                this.style && (t.strokeStyle = this.style,
                this.ignoreScale && (t.save(),
                t.setTransform(1, 0, 0, 1, 0, 0)),
                t.stroke(),
                this.ignoreScale && t.restore())
            },
            e.linearGradient = i.Fill.prototype.linearGradient,
            e.radialGradient = i.Fill.prototype.radialGradient,
            e.bitmap = i.Fill.prototype.bitmap,
            e.path = !1,
            e = (i.StrokeStyle = function(t, e, i, s) {
                this.width = t,
                this.caps = e,
                this.joints = i,
                this.miterLimit = s
            }).prototype,
            e.exec = function(e) {
                e.lineWidth = null == this.width ? "1" : this.width,
                e.lineCap = null == this.caps ? "butt" : isNaN(this.caps) ? this.caps : t.STROKE_CAPS_MAP[this.caps],
                e.lineJoin = null == this.joints ? "miter" : isNaN(this.joints) ? this.joints : t.STROKE_JOINTS_MAP[this.joints],
                e.miterLimit = null == this.miterLimit ? "10" : this.miterLimit
            },
            e.path = !1,
            (i.StrokeDash = function(t, e) {
                this.segments = t,
                this.offset = e || 0
            }
            ).prototype.exec = function(t) {
                t.setLineDash && (t.setLineDash(this.segments || i.StrokeDash.EMPTY_SEGMENTS),
                t.lineDashOffset = this.offset || 0)
            },
            i.StrokeDash.EMPTY_SEGMENTS = [],
            (i.RoundRect = function(t, e, i, s, n, r, o, a) {
                this.x = t,
                this.y = e,
                this.w = i,
                this.h = s,
                this.radiusTL = n,
                this.radiusTR = r,
                this.radiusBR = o,
                this.radiusBL = a
            }
            ).prototype.exec = function(t) {
                var e = (l > h ? h : l) / 2
                  , i = 0
                  , s = 0
                  , n = 0
                  , r = 0
                  , o = this.x
                  , a = this.y
                  , h = this.w
                  , l = this.h
                  , c = this.radiusTL
                  , u = this.radiusTR
                  , p = this.radiusBR
                  , d = this.radiusBL;
                0 > c && (c *= i = -1),
                c > e && (c = e),
                0 > u && (u *= s = -1),
                u > e && (u = e),
                0 > p && (p *= n = -1),
                p > e && (p = e),
                0 > d && (d *= r = -1),
                d > e && (d = e),
                t.moveTo(o + h - u, a),
                t.arcTo(o + h + u * s, a - u * s, o + h, a + u, u),
                t.lineTo(o + h, a + l - p),
                t.arcTo(o + h + p * n, a + l + p * n, o + h - p, a + l, p),
                t.lineTo(o + d, a + l),
                t.arcTo(o - d * r, a + l + d * r, o, a + l - d, d),
                t.lineTo(o, a + c),
                t.arcTo(o - c * i, a - c * i, o + c, a, c),
                t.closePath()
            },
            (i.Circle = function(t, e, i) {
                this.x = t,
                this.y = e,
                this.radius = i
            }
            ).prototype.exec = function(t) {
                t.arc(this.x, this.y, this.radius, 0, 2 * PI)
            },
            (i.Ellipse = function(t, e, i, s) {
                this.x = t,
                this.y = e,
                this.w = i,
                this.h = s
            }
            ).prototype.exec = function(t) {
                var e = this.x
                  , i = this.y
                  , s = this.w
                  , n = this.h
                  , r = .5522848
                  , o = s / 2 * r
                  , a = n / 2 * r
                  , h = e + s
                  , l = i + n
                  , c = e + s / 2
                  , u = i + n / 2;
                t.moveTo(e, u),
                t.bezierCurveTo(e, u - a, c - o, i, c, i),
                t.bezierCurveTo(c + o, i, h, u - a, h, u),
                t.bezierCurveTo(h, u + a, c + o, l, c, l),
                t.bezierCurveTo(c - o, l, e, u + a, e, u)
            },
            (i.PolyStar = function(t, e, i, s, n, r) {
                this.x = t,
                this.y = e,
                this.radius = i,
                this.sides = s,
                this.pointSize = n,
                this.angle = r
            }
            ).prototype.exec = function(t) {
                var e = this.x
                  , i = this.y
                  , s = this.radius
                  , n = (this.angle || 0) / 180 * PI
                  , r = this.sides
                  , o = 1 - (this.pointSize || 0)
                  , a = PI / r;
                t.moveTo(e + cos(n) * s, i + sin(n) * s);
                for (var h = 0; r > h; h++)
                    n += a,
                    1 != o && t.lineTo(e + cos(n) * s * o, i + sin(n) * s * o),
                    n += a,
                    t.lineTo(e + cos(n) * s, i + sin(n) * s);
                t.closePath()
            },
            t.beginCmd = new i.BeginPath,
            createjs.Graphics = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                this.EventDispatcher_constructor(),
                this.alpha = 1,
                this.cacheCanvas = null,
                this.cacheID = 0,
                this.id = createjs.UID.get(),
                this.mouseEnabled = !0,
                this.tickEnabled = !0,
                this.name = null,
                this.parent = null,
                this.regX = 0,
                this.regY = 0,
                this.rotation = 0,
                this.scaleX = 1,
                this.scaleY = 1,
                this.skewX = 0,
                this.skewY = 0,
                this.shadow = null,
                this.visible = !0,
                this.x = 0,
                this.y = 0,
                this.transformMatrix = null,
                this.compositeOperation = null,
                this.snapToPixel = !0,
                this.filters = null,
                this.mask = null,
                this.hitArea = null,
                this.cursor = null,
                this._cacheOffsetX = 0,
                this._cacheOffsetY = 0,
                this._filterOffsetX = 0,
                this._filterOffsetY = 0,
                this._cacheScale = 1,
                this._cacheDataURLID = 0,
                this._cacheDataURL = null,
                this._props = new createjs.DisplayProps,
                this._rectangle = new createjs.Rectangle,
                this._bounds = null
            }
            var e = createjs.extend(t, createjs.EventDispatcher);
            t._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"],
            t.suppressCrossDomainErrors = !1,
            t._snapToPixelEnabled = !1;
            var i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            i.getContext && (t._hitTestCanvas = i,
            t._hitTestContext = i.getContext("2d"),
            i.width = i.height = 1),
            t._nextCacheID = 1,
            e.getStage = function() {
                for (var t = this, e = createjs.Stage; t.parent; )
                    t = t.parent;
                return t instanceof e ? t : null
            }
            ;
            try {
                Object.defineProperties(e, {
                    stage: {
                        get: e.getStage
                    }
                })
            } catch (s) {}
            e.isVisible = function() {
                return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY)
            },
            e.draw = function(t, e) {
                var i = this.cacheCanvas;
                if (e || !i)
                    return !1;
                var s = this._cacheScale;
                return t.drawImage(i, this._cacheOffsetX + this._filterOffsetX, this._cacheOffsetY + this._filterOffsetY, i.width / s, i.height / s),
                !0
            },
            e.updateContext = function(e) {
                var i = this
                  , s = i.mask
                  , n = i._props.matrix;
                s && s.graphics && !s.graphics.isEmpty() && (s.getMatrix(n),
                e.transform(n.a, n.b, n.c, n.d, n.tx, n.ty),
                s.graphics.drawAsPath(e),
                e.clip(),
                n.invert(),
                e.transform(n.a, n.b, n.c, n.d, n.tx, n.ty)),
                this.getMatrix(n);
                var r = n.tx
                  , o = n.ty;
                t._snapToPixelEnabled && i.snapToPixel && (r = r + (0 > r ? -.5 : .5) | 0,
                o = o + (0 > o ? -.5 : .5) | 0),
                e.transform(n.a, n.b, n.c, n.d, r, o),
                e.globalAlpha *= i.alpha,
                i.compositeOperation && (e.globalCompositeOperation = i.compositeOperation),
                i.shadow && this._applyShadow(e, i.shadow)
            },
            e.cache = function(t, e, i, s, n) {
                n = n || 1,
                this.cacheCanvas || (this.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")),
                this._cacheWidth = i,
                this._cacheHeight = s,
                this._cacheOffsetX = t,
                this._cacheOffsetY = e,
                this._cacheScale = n,
                this.updateCache()
            },
            e.updateCache = function(e) {
                var i = this.cacheCanvas;
                if (!i)
                    throw "cache() must be called before updateCache()";
                var s = this._cacheScale
                  , n = this._cacheOffsetX * s
                  , r = this._cacheOffsetY * s
                  , o = this._cacheWidth
                  , a = this._cacheHeight
                  , h = i.getContext("2d")
                  , l = this._getFilterBounds();
                n += this._filterOffsetX = l.x,
                r += this._filterOffsetY = l.y,
                o = ceil(o * s) + l.width,
                a = ceil(a * s) + l.height,
                o != i.width || a != i.height ? (i.width = o,
                i.height = a) : e || h.clearRect(0, 0, o + 1, a + 1),
                h.save(),
                h.globalCompositeOperation = e,
                h.setTransform(s, 0, 0, s, -n, -r),
                this.draw(h, !0),
                this._applyFilters(),
                h.restore(),
                this.cacheID = t._nextCacheID++
            },
            e.uncache = function() {
                this._cacheDataURL = this.cacheCanvas = null,
                this.cacheID = this._cacheOffsetX = this._cacheOffsetY = this._filterOffsetX = this._filterOffsetY = 0,
                this._cacheScale = 1
            },
            e.getCacheDataURL = function() {
                return this.cacheCanvas ? (this.cacheID != this._cacheDataURLID && (this._cacheDataURL = this.cacheCanvas.toDataURL()),
                this._cacheDataURL) : null
            },
            e.localToGlobal = function(t, e, i) {
                return this.getConcatenatedMatrix(this._props.matrix).transformPoint(t, e, i || new createjs.Point)
            },
            e.globalToLocal = function(t, e, i) {
                return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(t, e, i || new createjs.Point)
            },
            e.localToLocal = function(t, e, i, s) {
                return s = this.localToGlobal(t, e, s),
                i.globalToLocal(s.x, s.y, s)
            },
            e.setTransform = function(t, e, i, s, n, r, o, a, h) {
                return this.x = t || 0,
                this.y = e || 0,
                this.scaleX = null == i ? 1 : i,
                this.scaleY = null == s ? 1 : s,
                this.rotation = n || 0,
                this.skewX = r || 0,
                this.skewY = o || 0,
                this.regX = a || 0,
                this.regY = h || 0,
                this
            },
            e.getMatrix = function(t) {
                var e = this
                  , i = t && t.identity() || new createjs.Matrix2D;
                return e.transformMatrix ? i.copy(e.transformMatrix) : i.appendTransform(e.x, e.y, e.scaleX, e.scaleY, e.rotation, e.skewX, e.skewY, e.regX, e.regY)
            },
            e.getConcatenatedMatrix = function(t) {
                for (var e = this, i = this.getMatrix(t); e = e.parent; )
                    i.prependMatrix(e.getMatrix(e._props.matrix));
                return i
            },
            e.getConcatenatedDisplayProps = function(t) {
                t = t ? t.identity() : new createjs.DisplayProps;
                var e = this
                  , i = e.getMatrix(t.matrix);
                do
                    t.prepend(e.visible, e.alpha, e.shadow, e.compositeOperation),
                    e != this && i.prependMatrix(e.getMatrix(e._props.matrix));
                while (e = e.parent);return t
            },
            e.hitTest = function(e, i) {
                var s = t._hitTestContext;
                s.setTransform(1, 0, 0, 1, -e, -i),
                this.draw(s);
                var n = this._testHit(s);
                return s.setTransform(1, 0, 0, 1, 0, 0),
                s.clearRect(0, 0, 2, 2),
                n
            },
            e.set = function(t) {
                for (var e in t)
                    this[e] = t[e];
                return this
            },
            e.getBounds = function() {
                if (this._bounds)
                    return this._rectangle.copy(this._bounds);
                var t = this.cacheCanvas;
                if (t) {
                    var e = this._cacheScale;
                    return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, t.width / e, t.height / e)
                }
                return null
            },
            e.getTransformedBounds = function() {
                return this._getBounds()
            },
            e.setBounds = function(t, e, i, s) {
                null == t && (this._bounds = t),
                this._bounds = (this._bounds || new createjs.Rectangle).setValues(t, e, i, s)
            },
            e.clone = function() {
                return this._cloneProps(new t)
            },
            e.toString = function() {
                return "[DisplayObject (name=" + this.name + ")]"
            },
            e._cloneProps = function(t) {
                return t.alpha = this.alpha,
                t.mouseEnabled = this.mouseEnabled,
                t.tickEnabled = this.tickEnabled,
                t.name = this.name,
                t.regX = this.regX,
                t.regY = this.regY,
                t.rotation = this.rotation,
                t.scaleX = this.scaleX,
                t.scaleY = this.scaleY,
                t.shadow = this.shadow,
                t.skewX = this.skewX,
                t.skewY = this.skewY,
                t.visible = this.visible,
                t.x = this.x,
                t.y = this.y,
                t.compositeOperation = this.compositeOperation,
                t.snapToPixel = this.snapToPixel,
                t.filters = null == this.filters ? null : this.filters.slice(0),
                t.mask = this.mask,
                t.hitArea = this.hitArea,
                t.cursor = this.cursor,
                t._bounds = this._bounds,
                t
            },
            e._applyShadow = function(t, e) {
                e = e || Shadow.identity,
                t.shadowColor = e.color,
                t.shadowOffsetX = e.offsetX,
                t.shadowOffsetY = e.offsetY,
                t.shadowBlur = e.blur
            },
            e._tick = function(t) {
                var e = this._listeners;
                e && e.tick && (t.target = null,
                t.propagationStopped = t.immediatePropagationStopped = !1,
                this.dispatchEvent(t))
            },
            e._testHit = function(e) {
                try {
                    var i = e.getImageData(0, 0, 1, 1).data[3] > 1
                } catch (s) {
                    if (!t.suppressCrossDomainErrors)
                        throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."
                }
                return i
            },
            e._applyFilters = function() {
                if (this.filters && 0 != this.filters.length && this.cacheCanvas)
                    for (var t = this.filters.length, e = this.cacheCanvas.getContext("2d"), i = this.cacheCanvas.width, s = this.cacheCanvas.height, n = 0; t > n; n++)
                        this.filters[n].applyFilter(e, 0, 0, i, s)
            },
            e._getFilterBounds = function() {
                var t, e = this.filters, i = this._rectangle.setValues(0, 0, 0, 0);
                if (!e || !(t = e.length))
                    return i;
                for (var s = 0; t > s; s++) {
                    var n = this.filters[s];
                    n.getBounds && n.getBounds(i)
                }
                return i
            },
            e._getBounds = function(t, e) {
                return this._transformBounds(this.getBounds(), t, e)
            },
            e._transformBounds = function(t, e, i) {
                if (!t)
                    return t;
                var s = t.x
                  , n = t.y
                  , r = t.width
                  , o = t.height
                  , a = this._props.matrix;
                a = i ? a.identity() : this.getMatrix(a),
                (s || n) && a.appendTransform(0, 0, 1, 1, 0, 0, 0, -s, -n),
                e && a.prependMatrix(e);
                var h = r * a.a
                  , l = r * a.b
                  , c = o * a.c
                  , u = o * a.d
                  , p = a.tx
                  , d = a.ty
                  , f = p
                  , v = p
                  , g = d
                  , m = d;
                return (s = h + p) < f ? f = s : s > v && (v = s),
                (s = h + c + p) < f ? f = s : s > v && (v = s),
                (s = c + p) < f ? f = s : s > v && (v = s),
                (n = l + d) < g ? g = n : n > m && (m = n),
                (n = l + u + d) < g ? g = n : n > m && (m = n),
                (n = u + d) < g ? g = n : n > m && (m = n),
                t.setValues(f, g, v - f, m - g)
            },
            e._hasMouseEventListener = function() {
                for (var e = t._MOUSE_EVENTS, i = 0, s = e.length; s > i; i++)
                    if (this.hasEventListener(e[i]))
                        return !0;
                return !!this.cursor
            },
            createjs.DisplayObject = createjs.promote(t, "EventDispatcher")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                this.DisplayObject_constructor(),
                this.children = [],
                this.mouseChildren = !0,
                this.tickChildren = !0
            }
            var e = createjs.extend(t, createjs.DisplayObject);
            e.getNumChildren = function() {
                return this.children.length
            }
            ;
            try {
                Object.defineProperties(e, {
                    numChildren: {
                        get: e.getNumChildren
                    }
                })
            } catch (i) {}
            e.initialize = t,
            e.isVisible = function() {
                var t = this.cacheCanvas || this.children.length;
                return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
            },
            e.draw = function(t, e) {
                if (this.DisplayObject_draw(t, e))
                    return !0;
                for (var i = this.children.slice(), s = 0, n = i.length; n > s; s++) {
                    var r = i[s];
                    r.isVisible() && (t.save(),
                    r.updateContext(t),
                    r.draw(t),
                    t.restore())
                }
                return !0
            },
            e.addChild = function(t) {
                if (null == t)
                    return t;
                var e = arguments.length;
                if (e > 1) {
                    for (var i = 0; e > i; i++)
                        this.addChild(arguments[i]);
                    return arguments[e - 1]
                }
                return t.parent && t.parent.removeChild(t),
                t.parent = this,
                this.children.push(t),
                t.dispatchEvent("added"),
                t
            },
            e.addChildAt = function(t, e) {
                var i = arguments.length
                  , s = arguments[i - 1];
                if (0 > s || s > this.children.length)
                    return arguments[i - 2];
                if (i > 2) {
                    for (var n = 0; i - 1 > n; n++)
                        this.addChildAt(arguments[n], s + n);
                    return arguments[i - 2]
                }
                return t.parent && t.parent.removeChild(t),
                t.parent = this,
                this.children.splice(e, 0, t),
                t.dispatchEvent("added"),
                t
            },
            e.removeChild = function(t) {
                var e = arguments.length;
                if (e > 1) {
                    for (var i = !0, s = 0; e > s; s++)
                        i = i && this.removeChild(arguments[s]);
                    return i
                }
                return this.removeChildAt(createjs.indexOf(this.children, t))
            },
            e.removeChildAt = function(t) {
                var e = arguments.length;
                if (e > 1) {
                    for (var i = [], s = 0; e > s; s++)
                        i[s] = arguments[s];
                    i.sort(function(t, e) {
                        return e - t
                    });
                    for (var n = !0, s = 0; e > s; s++)
                        n = n && this.removeChildAt(i[s]);
                    return n
                }
                if (0 > t || t > this.children.length - 1)
                    return !1;
                var r = this.children[t];
                return r && (r.parent = null),
                this.children.splice(t, 1),
                r.dispatchEvent("removed"),
                !0
            },
            e.removeAllChildren = function() {
                for (var t = this.children; t.length; )
                    this.removeChildAt(0)
            },
            e.getChildAt = function(t) {
                return this.children[t]
            },
            e.getChildByName = function(t) {
                for (var e = this.children, i = 0, s = e.length; s > i; i++)
                    if (e[i].name == t)
                        return e[i];
                return null
            },
            e.sortChildren = function(t) {
                this.children.sort(t)
            },
            e.getChildIndex = function(t) {
                return createjs.indexOf(this.children, t)
            },
            e.swapChildrenAt = function(t, e) {
                var i = this.children
                  , s = i[t]
                  , n = i[e];
                s && n && (i[t] = n,
                i[e] = s)
            },
            e.swapChildren = function(t, e) {
                for (var i, s, n = this.children, r = 0, o = n.length; o > r && (n[r] == t && (i = r),
                n[r] == e && (s = r),
                null == i || null == s); r++)
                    ;
                r != o && (n[i] = e,
                n[s] = t)
            },
            e.setChildIndex = function(t, e) {
                var i = this.children
                  , s = i.length;
                if (!(t.parent != this || 0 > e || e >= s)) {
                    for (var n = 0; s > n && i[n] != t; n++)
                        ;
                    n != s && n != e && (i.splice(n, 1),
                    i.splice(e, 0, t))
                }
            },
            e.contains = function(t) {
                for (; t; ) {
                    if (t == this)
                        return !0;
                    t = t.parent
                }
                return !1
            },
            e.hitTest = function(t, e) {
                return null != this.getObjectUnderPoint(t, e)
            },
            e.getObjectsUnderPoint = function(t, e, i) {
                var s = []
                  , n = this.localToGlobal(t, e);
                return this._getObjectsUnderPoint(n.x, n.y, s, i > 0, 1 == i),
                s
            },
            e.getObjectUnderPoint = function(t, e, i) {
                var s = this.localToGlobal(t, e);
                return this._getObjectsUnderPoint(s.x, s.y, null, i > 0, 1 == i)
            },
            e.getBounds = function() {
                return this._getBounds(null, !0)
            },
            e.getTransformedBounds = function() {
                return this._getBounds()
            },
            e.clone = function(e) {
                var i = this._cloneProps(new t);
                return e && this._cloneChildren(i),
                i
            },
            e.toString = function() {
                return "[Container (name=" + this.name + ")]"
            },
            e._tick = function(t) {
                if (this.tickChildren)
                    for (var e = this.children.length - 1; e >= 0; e--) {
                        var i = this.children[e];
                        i.tickEnabled && i._tick && i._tick(t)
                    }
                this.DisplayObject__tick(t)
            },
            e._cloneChildren = function(t) {
                t.children.length && t.removeAllChildren();
                for (var e = t.children, i = 0, s = this.children.length; s > i; i++) {
                    var n = this.children[i].clone(!0);
                    n.parent = t,
                    e.push(n)
                }
            },
            e._getObjectsUnderPoint = function(e, i, s, n, r, o) {
                if (o = o || 0,
                !o && !this._testMask(this, e, i))
                    return null;
                var a, h = createjs.DisplayObject._hitTestContext;
                r = r || n && this._hasMouseEventListener();
                for (var l = this.children, c = l.length, u = c - 1; u >= 0; u--) {
                    var p = l[u]
                      , d = p.hitArea;
                    if (p.visible && (d || p.isVisible()) && (!n || p.mouseEnabled) && (d || this._testMask(p, e, i)))
                        if (!d && p instanceof t) {
                            var f = p._getObjectsUnderPoint(e, i, s, n, r, o + 1);
                            if (!s && f)
                                return n && !this.mouseChildren ? this : f
                        } else {
                            if (n && !r && !p._hasMouseEventListener())
                                continue;
                            var v = p.getConcatenatedDisplayProps(p._props);
                            if (a = v.matrix,
                            d && (a.appendMatrix(d.getMatrix(d._props.matrix)),
                            v.alpha = d.alpha),
                            h.globalAlpha = v.alpha,
                            h.setTransform(a.a, a.b, a.c, a.d, a.tx - e, a.ty - i),
                            (d || p).draw(h),
                            !this._testHit(h))
                                continue;
                            if (h.setTransform(1, 0, 0, 1, 0, 0),
                            h.clearRect(0, 0, 2, 2),
                            !s)
                                return n && !this.mouseChildren ? this : p;
                            s.push(p)
                        }
                }
                return null
            },
            e._testMask = function(t, e, i) {
                var s = t.mask;
                if (!s || !s.graphics || s.graphics.isEmpty())
                    return !0;
                var n = this._props.matrix
                  , r = t.parent;
                n = r ? r.getConcatenatedMatrix(n) : n.identity(),
                n = s.getMatrix(s._props.matrix).prependMatrix(n);
                var o = createjs.DisplayObject._hitTestContext;
                return o.setTransform(n.a, n.b, n.c, n.d, n.tx - e, n.ty - i),
                s.graphics.drawAsPath(o),
                o.fillStyle = "#000",
                o.fill(),
                this._testHit(o) ? (o.setTransform(1, 0, 0, 1, 0, 0),
                o.clearRect(0, 0, 2, 2),
                !0) : !1
            },
            e._getBounds = function(t, e) {
                var i = this.DisplayObject_getBounds();
                if (i)
                    return this._transformBounds(i, t, e);
                var s = this._props.matrix;
                s = e ? s.identity() : this.getMatrix(s),
                t && s.prependMatrix(t);
                for (var n = this.children.length, r = null, o = 0; n > o; o++) {
                    var a = this.children[o];
                    a.visible && (i = a._getBounds(s)) && (r ? r.extend(i.x, i.y, i.width, i.height) : r = i.clone())
                }
                return r
            },
            createjs.Container = createjs.promote(t, "DisplayObject")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t) {
                this.Container_constructor(),
                this.autoClear = !0,
                this.canvas = "string" == typeof t ? document.getElementById(t) : t,
                this.mouseX = 0,
                this.mouseY = 0,
                this.drawRect = null,
                this.snapToPixelEnabled = !1,
                this.mouseInBounds = !1,
                this.tickOnUpdate = !0,
                this.mouseMoveOutside = !1,
                this.preventSelection = !0,
                this._pointerData = {},
                this._pointerCount = 0,
                this._primaryPointerID = null,
                this._mouseOverIntervalID = null,
                this._nextStage = null,
                this._prevStage = null,
                this.enableDOMEvents(!0)
            }
            var e = createjs.extend(t, createjs.Container);
            e._get_nextStage = function() {
                return this._nextStage
            },
            e._set_nextStage = function(t) {
                this._nextStage && (this._nextStage._prevStage = null),
                t && (t._prevStage = this),
                this._nextStage = t
            }
            ;
            try {
                Object.defineProperties(e, {
                    nextStage: {
                        get: e._get_nextStage,
                        set: e._set_nextStage
                    }
                })
            } catch (i) {}
            e.update = function(t) {
                if (this.canvas && (this.tickOnUpdate && this.tick(t),
                !this.dispatchEvent("drawstart"))) {
                    createjs.DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
                    var e = this.drawRect
                      , i = this.canvas.getContext("2d");
                    i.setTransform(1, 0, 0, 1, 0, 0),
                    this.autoClear && (e ? i.clearRect(e.x, e.y, e.width, e.height) : i.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)),
                    i.save(),
                    this.drawRect && (i.beginPath(),
                    i.rect(e.x, e.y, e.width, e.height),
                    i.clip()),
                    this.updateContext(i),
                    this.draw(i, !1),
                    i.restore(),
                    this.dispatchEvent("drawend")
                }
            },
            e.tick = function(t) {
                if (this.tickEnabled && !this.dispatchEvent("tickstart")) {
                    var e = new createjs.Event("tick");
                    if (t)
                        for (var i in t)
                            t.hasOwnProperty(i) && (e[i] = t[i]);
                    this._tick(e),
                    this.dispatchEvent("tickend")
                }
            },
            e.handleEvent = function(t) {
                "tick" == t.type && this.update(t)
            },
            e.clear = function() {
                if (this.canvas) {
                    var t = this.canvas.getContext("2d");
                    t.setTransform(1, 0, 0, 1, 0, 0),
                    t.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
                }
            },
            e.toDataURL = function(t, e) {
                var i, s = this.canvas.getContext("2d"), n = this.canvas.width, r = this.canvas.height;
                if (t) {
                    i = s.getImageData(0, 0, n, r);
                    var o = s.globalCompositeOperation;
                    s.globalCompositeOperation = "destination-over",
                    s.fillStyle = t,
                    s.fillRect(0, 0, n, r)
                }
                var a = this.canvas.toDataURL(e || "image/png");
                return t && (s.putImageData(i, 0, 0),
                s.globalCompositeOperation = o),
                a
            },
            e.enableMouseOver = function(t) {
                if (this._mouseOverIntervalID && (clearInterval(this._mouseOverIntervalID),
                this._mouseOverIntervalID = null,
                0 == t && this._testMouseOver(!0)),
                null == t)
                    t = 20;
                else if (0 >= t)
                    return;
                var e = this;
                this._mouseOverIntervalID = setInterval(function() {
                    e._testMouseOver()
                }, 1e3 / min(50, t))
            },
            e.enableDOMEvents = function(t) {
                null == t && (t = !0);
                var e, i, s = this._eventListeners;
                if (!t && s) {
                    for (e in s)
                        i = s[e],
                        i.t.removeEventListener(e, i.f, !1);
                    this._eventListeners = null
                } else if (t && !s && this.canvas) {
                    var n = window.addEventListener ? window : document
                      , r = this;
                    s = this._eventListeners = {},
                    s.mouseup = {
                        t: n,
                        f: function(t) {
                            r._handleMouseUp(t)
                        }
                    },
                    s.mousemove = {
                        t: n,
                        f: function(t) {
                            r._handleMouseMove(t)
                        }
                    },
                    s.dblclick = {
                        t: this.canvas,
                        f: function(t) {
                            r._handleDoubleClick(t)
                        }
                    },
                    s.mousedown = {
                        t: this.canvas,
                        f: function(t) {
                            r._handleMouseDown(t)
                        }
                    };
                    for (e in s)
                        i = s[e],
                        i.t.addEventListener(e, i.f, !1)
                }
            },
            e.clone = function() {
                throw "Stage cannot be cloned."
            },
            e.toString = function() {
                return "[Stage (name=" + this.name + ")]"
            },
            e._getElementRect = function(t) {
                var e;
                try {
                    e = t.getBoundingClientRect()
                } catch (i) {
                    e = {
                        top: t.offsetTop,
                        left: t.offsetLeft,
                        width: t.offsetWidth,
                        height: t.offsetHeight
                    }
                }
                var s = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0)
                  , n = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0)
                  , r = window.getComputedStyle ? getComputedStyle(t, null) : t.currentStyle
                  , o = parseInt(r.paddingLeft) + parseInt(r.borderLeftWidth)
                  , a = parseInt(r.paddingTop) + parseInt(r.borderTopWidth)
                  , h = parseInt(r.paddingRight) + parseInt(r.borderRightWidth)
                  , l = parseInt(r.paddingBottom) + parseInt(r.borderBottomWidth);
                return {
                    left: e.left + s + o,
                    right: e.right + s - h,
                    top: e.top + n + a,
                    bottom: e.bottom + n - l
                }
            },
            e._getPointerData = function(t) {
                var e = this._pointerData[t];
                return e || (e = this._pointerData[t] = {
                    x: 0,
                    y: 0
                }),
                e
            },
            e._handleMouseMove = function(t) {
                t || (t = window.event),
                this._handlePointerMove(-1, t, t.pageX, t.pageY)
            },
            e._handlePointerMove = function(t, e, i, s, n) {
                if ((!this._prevStage || void 0 !== n) && this.canvas) {
                    var r = this._nextStage
                      , o = this._getPointerData(t)
                      , a = o.inBounds;
                    this._updatePointerPosition(t, e, i, s),
                    (a || o.inBounds || this.mouseMoveOutside) && (-1 === t && o.inBounds == !a && this._dispatchMouseEvent(this, a ? "mouseleave" : "mouseenter", !1, t, o, e),
                    this._dispatchMouseEvent(this, "stagemousemove", !1, t, o, e),
                    this._dispatchMouseEvent(o.target, "pressmove", !0, t, o, e)),
                    r && r._handlePointerMove(t, e, i, s, null)
                }
            },
            e._updatePointerPosition = function(t, e, i, s) {
                var n = this._getElementRect(this.canvas);
                i -= n.left,
                s -= n.top;
                var r = this.canvas.width
                  , o = this.canvas.height;
                i /= (n.right - n.left) / r,
                s /= (n.bottom - n.top) / o;
                var a = this._getPointerData(t);
                (a.inBounds = i >= 0 && s >= 0 && r - 1 >= i && o - 1 >= s) ? (a.x = i,
                a.y = s) : this.mouseMoveOutside && (a.x = 0 > i ? 0 : i > r - 1 ? r - 1 : i,
                a.y = 0 > s ? 0 : s > o - 1 ? o - 1 : s),
                a.posEvtObj = e,
                a.rawX = i,
                a.rawY = s,
                (t === this._primaryPointerID || -1 === t) && (this.mouseX = a.x,
                this.mouseY = a.y,
                this.mouseInBounds = a.inBounds)
            },
            e._handleMouseUp = function(t) {
                this._handlePointerUp(-1, t, !1)
            },
            e._handlePointerUp = function(t, e, i, s) {
                var n = this._nextStage
                  , r = this._getPointerData(t);
                if (!this._prevStage || void 0 !== s) {
                    r.down && this._dispatchMouseEvent(this, "stagemouseup", !1, t, r, e),
                    r.down = !1;
                    var o = null
                      , a = r.target;
                    s || !a && !n || (o = this._getObjectsUnderPoint(r.x, r.y, null, !0)),
                    o == a && this._dispatchMouseEvent(a, "click", !0, t, r, e),
                    this._dispatchMouseEvent(a, "pressup", !0, t, r, e),
                    i ? (t == this._primaryPointerID && (this._primaryPointerID = null),
                    delete this._pointerData[t]) : r.target = null,
                    n && n._handlePointerUp(t, e, i, s || o && this)
                }
            },
            e._handleMouseDown = function(t) {
                this._handlePointerDown(-1, t, t.pageX, t.pageY)
            },
            e._handlePointerDown = function(t, e, i, s, n) {
                this.preventSelection && e.preventDefault(),
                (null == this._primaryPointerID || -1 === t) && (this._primaryPointerID = t),
                null != s && this._updatePointerPosition(t, e, i, s);
                var r = null
                  , o = this._nextStage
                  , a = this._getPointerData(t);
                a.inBounds && (this._dispatchMouseEvent(this, "stagemousedown", !1, t, a, e),
                a.down = !0),
                n || (r = a.target = this._getObjectsUnderPoint(a.x, a.y, null, !0),
                this._dispatchMouseEvent(a.target, "mousedown", !0, t, a, e)),
                o && o._handlePointerDown(t, e, i, s, n || r && this)
            },
            e._testMouseOver = function(t, e, i) {
                if (!this._prevStage || void 0 !== e) {
                    var s = this._nextStage;
                    if (!this._mouseOverIntervalID)
                        return void (s && s._testMouseOver(t, e, i));
                    var n = this._getPointerData(-1);
                    if (n && (t || this.mouseX != this._mouseOverX || this.mouseY != this._mouseOverY || !this.mouseInBounds)) {
                        var r, o, a, h = n.posEvtObj, l = i || h && h.target == this.canvas, c = null, u = -1, p = "";
                        !e && (t || this.mouseInBounds && l) && (c = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, !0),
                        this._mouseOverX = this.mouseX,
                        this._mouseOverY = this.mouseY);
                        var d = this._mouseOverTarget || []
                          , f = d[d.length - 1]
                          , v = this._mouseOverTarget = [];
                        for (r = c; r; )
                            v.unshift(r),
                            null != r.cursor && (p = r.cursor),
                            r = r.parent;
                        for (this.canvas.style.cursor = p,
                        !e && i && (i.canvas.style.cursor = p),
                        o = 0,
                        a = v.length; a > o && v[o] == d[o]; o++)
                            u = o;
                        for (f != c && this._dispatchMouseEvent(f, "mouseout", !0, -1, n, h),
                        o = d.length - 1; o > u; o--)
                            this._dispatchMouseEvent(d[o], "rollout", !1, -1, n, h);
                        for (o = v.length - 1; o > u; o--)
                            this._dispatchMouseEvent(v[o], "rollover", !1, -1, n, h);
                        f != c && this._dispatchMouseEvent(c, "mouseover", !0, -1, n, h),
                        s && s._testMouseOver(t, e || c && this, i || l && this)
                    }
                }
            },
            e._handleDoubleClick = function(t, e) {
                var i = null
                  , s = this._nextStage
                  , n = this._getPointerData(-1);
                e || (i = this._getObjectsUnderPoint(n.x, n.y, null, !0),
                this._dispatchMouseEvent(i, "dblclick", !0, -1, n, t)),
                s && s._handleDoubleClick(t, e || i && this)
            },
            e._dispatchMouseEvent = function(t, e, i, s, n, r) {
                if (t && (i || t.hasEventListener(e))) {
                    var o = new createjs.MouseEvent(e,i,!1,n.x,n.y,r,s,s === this._primaryPointerID || -1 === s,n.rawX,n.rawY);
                    t.dispatchEvent(o)
                }
            },
            createjs.Stage = createjs.promote(t, "Container")
        }(),
        this.createjs = this.createjs || {},
        function() {
            function t(t) {
                this.DisplayObject_constructor(),
                "string" == typeof t ? (this.image = document.createElement("img"),
                this.image.src = t) : this.image = t,
                this.sourceRect = null
            }
            var e = createjs.extend(t, createjs.DisplayObject);
            e.initialize = t,
            e.isVisible = function() {
                var t = this.cacheCanvas || this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2);
                return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
            },
            e.draw = function(t, e) {
                if (this.DisplayObject_draw(t, e) || !this.image)
                    return !0;
                var i = this.image
                  , s = this.sourceRect;
                if (s) {
                    var n = s.x
                      , r = s.y
                      , o = n + s.width
                      , a = r + s.height
                      , h = 0
                      , l = 0
                      , c = i.width
                      , u = i.height;
                    0 > n && (h -= n,
                    n = 0),
                    o > c && (o = c),
                    0 > r && (l -= r,
                    r = 0),
                    a > u && (a = u),
                    t.drawImage(i, n, r, o - n, a - r, h, l, o - n, a - r)
                } else
                    t.drawImage(i, 0, 0);
                return !0
            },
            e.getBounds = function() {
                var t = this.DisplayObject_getBounds();
                if (t)
                    return t;
                var e = this.sourceRect || this.image
                  , i = this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2);
                return i ? this._rectangle.setValues(0, 0, e.width, e.height) : null
            },
            e.clone = function() {
                var e = new t(this.image);
                return this.sourceRect && (e.sourceRect = this.sourceRect.clone()),
                this._cloneProps(e),
                e
            },
            e.toString = function() {
                return "[Bitmap (name=" + this.name + ")]"
            },
            createjs.Bitmap = createjs.promote(t, "DisplayObject")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e) {
                this.DisplayObject_constructor(),
                this.currentFrame = 0,
                this.currentAnimation = null,
                this.paused = !0,
                this.spriteSheet = t,
                this.currentAnimationFrame = 0,
                this.framerate = 0,
                this._animation = null,
                this._currentFrame = null,
                this._skipAdvance = !1,
                e && this.gotoAndPlay(e)
            }
            var e = createjs.extend(t, createjs.DisplayObject);
            e.isVisible = function() {
                var t = this.cacheCanvas || this.spriteSheet.complete;
                return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
            },
            e.draw = function(t, e) {
                if (this.DisplayObject_draw(t, e))
                    return !0;
                this._normalizeFrame();
                var i = this.spriteSheet.getFrame(0 | this._currentFrame);
                if (!i)
                    return !1;
                var s = i.rect;
                return s.width && s.height && t.drawImage(i.image, s.x, s.y, s.width, s.height, -i.regX, -i.regY, s.width, s.height),
                !0
            },
            e.play = function() {
                this.paused = !1
            },
            e.stop = function() {
                this.paused = !0
            },
            e.gotoAndPlay = function(t) {
                this.paused = !1,
                this._skipAdvance = !0,
                this._goto(t)
            },
            e.gotoAndStop = function(t) {
                this.paused = !0,
                this._goto(t)
            },
            e.advance = function(t) {
                var e = this.framerate || this.spriteSheet.framerate
                  , i = e && null != t ? t / (1e3 / e) : 1;
                this._normalizeFrame(i)
            },
            e.getBounds = function() {
                return this.DisplayObject_getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle)
            },
            e.clone = function() {
                return this._cloneProps(new t(this.spriteSheet))
            },
            e.toString = function() {
                return "[Sprite (name=" + this.name + ")]"
            },
            e._cloneProps = function(t) {
                return this.DisplayObject__cloneProps(t),
                t.currentFrame = this.currentFrame,
                t.currentAnimation = this.currentAnimation,
                t.paused = this.paused,
                t.currentAnimationFrame = this.currentAnimationFrame,
                t.framerate = this.framerate,
                t._animation = this._animation,
                t._currentFrame = this._currentFrame,
                t._skipAdvance = this._skipAdvance,
                t
            },
            e._tick = function(t) {
                this.paused || (this._skipAdvance || this.advance(t && t.delta),
                this._skipAdvance = !1),
                this.DisplayObject__tick(t)
            },
            e._normalizeFrame = function(t) {
                t = t || 0;
                var e, i = this._animation, s = this.paused, n = this._currentFrame;
                if (i) {
                    var r = i.speed || 1
                      , o = this.currentAnimationFrame;
                    if (e = i.frames.length,
                    o + t * r >= e) {
                        var a = i.next;
                        if (this._dispatchAnimationEnd(i, n, s, a, e - 1))
                            return;
                        if (a)
                            return this._goto(a, t - (e - o) / r);
                        this.paused = !0,
                        o = i.frames.length - 1
                    } else
                        o += t * r;
                    this.currentAnimationFrame = o,
                    this._currentFrame = i.frames[0 | o]
                } else if (n = this._currentFrame += t,
                e = this.spriteSheet.getNumFrames(),
                n >= e && e > 0 && !this._dispatchAnimationEnd(i, n, s, e - 1) && (this._currentFrame -= e) >= e)
                    return this._normalizeFrame();
                n = 0 | this._currentFrame,
                this.currentFrame != n && (this.currentFrame = n,
                this.dispatchEvent("change"))
            },
            e._dispatchAnimationEnd = function(t, e, i, s, n) {
                var r = t ? t.name : null;
                if (this.hasEventListener("animationend")) {
                    var o = new createjs.Event("animationend");
                    o.name = r,
                    o.next = s,
                    this.dispatchEvent(o)
                }
                var a = this._animation != t || this._currentFrame != e;
                return a || i || !this.paused || (this.currentAnimationFrame = n,
                a = !0),
                a
            },
            e._goto = function(t, e) {
                if (this.currentAnimationFrame = 0,
                isNaN(t)) {
                    var i = this.spriteSheet.getAnimation(t);
                    i && (this._animation = i,
                    this.currentAnimation = t,
                    this._normalizeFrame(e))
                } else
                    this.currentAnimation = this._animation = null,
                    this._currentFrame = t,
                    this._normalizeFrame()
            },
            createjs.Sprite = createjs.promote(t, "DisplayObject")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t) {
                this.DisplayObject_constructor(),
                this.graphics = t ? t : new createjs.Graphics
            }
            var e = createjs.extend(t, createjs.DisplayObject);
            e.isVisible = function() {
                var t = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
                return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
            },
            e.draw = function(t, e) {
                return this.DisplayObject_draw(t, e) ? !0 : (this.graphics.draw(t, this),
                !0)
            },
            e.clone = function(e) {
                var i = e && this.graphics ? this.graphics.clone() : this.graphics;
                return this._cloneProps(new t(i))
            },
            e.toString = function() {
                return "[Shape (name=" + this.name + ")]"
            },
            createjs.Shape = createjs.promote(t, "DisplayObject")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i) {
                this.DisplayObject_constructor(),
                this.text = t,
                this.font = e,
                this.color = i,
                this.textAlign = "left",
                this.textBaseline = "top",
                this.maxWidth = null,
                this.outline = 0,
                this.lineHeight = 0,
                this.lineWidth = null
            }
            var e = createjs.extend(t, createjs.DisplayObject)
              , i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            i.getContext && (t._workingContext = i.getContext("2d"),
            i.width = i.height = 1),
            t.H_OFFSETS = {
                start: 0,
                left: 0,
                center: -.5,
                end: -1,
                right: -1
            },
            t.V_OFFSETS = {
                top: 0,
                hanging: -.01,
                middle: -.4,
                alphabetic: -.8,
                ideographic: -.85,
                bottom: -1
            },
            e.isVisible = function() {
                var t = this.cacheCanvas || null != this.text && "" !== this.text;
                return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && t)
            },
            e.draw = function(t, e) {
                if (this.DisplayObject_draw(t, e))
                    return !0;
                var i = this.color || "#000";
                return this.outline ? (t.strokeStyle = i,
                t.lineWidth = 1 * this.outline) : t.fillStyle = i,
                this._drawText(this._prepContext(t)),
                !0
            },
            e.getMeasuredWidth = function() {
                return this._getMeasuredWidth(this.text)
            },
            e.getMeasuredLineHeight = function() {
                return 1.2 * this._getMeasuredWidth("M")
            },
            e.getMeasuredHeight = function() {
                return this._drawText(null, {}).height
            },
            e.getBounds = function() {
                var e = this.DisplayObject_getBounds();
                if (e)
                    return e;
                if (null == this.text || "" == this.text)
                    return null;
                var i = this._drawText(null, {})
                  , s = this.maxWidth && this.maxWidth < i.width ? this.maxWidth : i.width
                  , n = s * t.H_OFFSETS[this.textAlign || "left"]
                  , r = this.lineHeight || this.getMeasuredLineHeight()
                  , o = r * t.V_OFFSETS[this.textBaseline || "top"];
                return this._rectangle.setValues(n, o, s, i.height)
            },
            e.getMetrics = function() {
                var e = {
                    lines: []
                };
                return e.lineHeight = this.lineHeight || this.getMeasuredLineHeight(),
                e.vOffset = e.lineHeight * t.V_OFFSETS[this.textBaseline || "top"],
                this._drawText(null, e, e.lines)
            },
            e.clone = function() {
                return this._cloneProps(new t(this.text,this.font,this.color))
            },
            e.toString = function() {
                return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
            },
            e._cloneProps = function(t) {
                return this.DisplayObject__cloneProps(t),
                t.textAlign = this.textAlign,
                t.textBaseline = this.textBaseline,
                t.maxWidth = this.maxWidth,
                t.outline = this.outline,
                t.lineHeight = this.lineHeight,
                t.lineWidth = this.lineWidth,
                t
            },
            e._prepContext = function(t) {
                return t.font = this.font || "10px sans-serif",
                t.textAlign = this.textAlign || "left",
                t.textBaseline = this.textBaseline || "top",
                t
            },
            e._drawText = function(e, i, s) {
                var n = !!e;
                n || (e = t._workingContext,
                e.save(),
                this._prepContext(e));
                for (var r = this.lineHeight || this.getMeasuredLineHeight(), o = 0, a = 0, h = String(this.text).split(/(?:\r\n|\r|\n)/), l = 0, c = h.length; c > l; l++) {
                    var u = h[l]
                      , p = null;
                    if (null != this.lineWidth && (p = e.measureText(u).width) > this.lineWidth) {
                        var d = u.split(/(\s)/);
                        u = d[0],
                        p = e.measureText(u).width;
                        for (var f = 1, v = d.length; v > f; f += 2) {
                            var g = e.measureText(d[f] + d[f + 1]).width;
                            p + g > this.lineWidth ? (n && this._drawTextLine(e, u, a * r),
                            s && s.push(u),
                            p > o && (o = p),
                            u = d[f + 1],
                            p = e.measureText(u).width,
                            a++) : (u += d[f] + d[f + 1],
                            p += g)
                        }
                    }
                    n && this._drawTextLine(e, u, a * r),
                    s && s.push(u),
                    i && null == p && (p = e.measureText(u).width),
                    p > o && (o = p),
                    a++
                }
                return i && (i.width = o,
                i.height = a * r),
                n || e.restore(),
                i
            },
            e._drawTextLine = function(t, e, i) {
                this.outline ? t.strokeText(e, 0, i, this.maxWidth || 65535) : t.fillText(e, 0, i, this.maxWidth || 65535)
            },
            e._getMeasuredWidth = function(e) {
                var i = t._workingContext;
                i.save();
                var s = this._prepContext(i).measureText(e).width;
                return i.restore(),
                s
            },
            createjs.Text = createjs.promote(t, "DisplayObject")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e) {
                this.Container_constructor(),
                this.text = t || "",
                this.spriteSheet = e,
                this.lineHeight = 0,
                this.letterSpacing = 0,
                this.spaceWidth = 0,
                this._oldProps = {
                    text: 0,
                    spriteSheet: 0,
                    lineHeight: 0,
                    letterSpacing: 0,
                    spaceWidth: 0
                }
            }
            var e = createjs.extend(t, createjs.Container);
            t.maxPoolSize = 100,
            t._spritePool = [],
            e.draw = function(t, e) {
                this.DisplayObject_draw(t, e) || (this._updateText(),
                this.Container_draw(t, e))
            },
            e.getBounds = function() {
                return this._updateText(),
                this.Container_getBounds()
            },
            e.isVisible = function() {
                var t = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
                return !!(this.visible && this.alpha > 0 && 0 !== this.scaleX && 0 !== this.scaleY && t)
            },
            e.clone = function() {
                return this._cloneProps(new t(this.text,this.spriteSheet))
            },
            e.addChild = e.addChildAt = e.removeChild = e.removeChildAt = e.removeAllChildren = function() {},
            e._cloneProps = function(t) {
                return this.DisplayObject__cloneProps(t),
                t.lineHeight = this.lineHeight,
                t.letterSpacing = this.letterSpacing,
                t.spaceWidth = this.spaceWidth,
                t
            },
            e._getFrameIndex = function(t, e) {
                var i, s = e.getAnimation(t);
                return s || (t != (i = t.toUpperCase()) || t != (i = t.toLowerCase()) || (i = null),
                i && (s = e.getAnimation(i))),
                s && s.frames[0]
            },
            e._getFrame = function(t, e) {
                var i = this._getFrameIndex(t, e);
                return null == i ? i : e.getFrame(i)
            },
            e._getLineHeight = function(t) {
                var e = this._getFrame("1", t) || this._getFrame("T", t) || this._getFrame("L", t) || t.getFrame(0);
                return e ? e.rect.height : 1
            },
            e._getSpaceWidth = function(t) {
                var e = this._getFrame("1", t) || this._getFrame("l", t) || this._getFrame("e", t) || this._getFrame("a", t) || t.getFrame(0);
                return e ? e.rect.width : 1
            },
            e._updateText = function() {
                var e, i = 0, s = 0, n = this._oldProps, r = !1, o = this.spaceWidth, a = this.lineHeight, h = this.spriteSheet, l = t._spritePool, c = this.children, u = 0, p = c.length;
                for (var d in n)
                    n[d] != this[d] && (n[d] = this[d],
                    r = !0);
                if (r) {
                    var f = !!this._getFrame(" ", h);
                    f || o || (o = this._getSpaceWidth(h)),
                    a || (a = this._getLineHeight(h));
                    for (var v = 0, g = this.text.length; g > v; v++) {
                        var m = this.text.charAt(v);
                        if (" " != m || f)
                            if ("\n" != m && "\r" != m) {
                                var y = this._getFrameIndex(m, h);
                                null != y && (p > u ? e = c[u] : (c.push(e = l.length ? l.pop() : new createjs.Sprite),
                                e.parent = this,
                                p++),
                                e.spriteSheet = h,
                                e.gotoAndStop(y),
                                e.x = i,
                                e.y = s,
                                u++,
                                i += e.getBounds().width + this.letterSpacing)
                            } else
                                "\r" == m && "\n" == this.text.charAt(v + 1) && v++,
                                i = 0,
                                s += a;
                        else
                            i += o
                    }
                    for (; p > u; )
                        l.push(e = c.pop()),
                        e.parent = null,
                        p--;
                    l.length > t.maxPoolSize && (l.length = t.maxPoolSize)
                }
            },
            createjs.BitmapText = createjs.promote(t, "Container")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                throw "SpriteSheetUtils cannot be instantiated"
            }
            var e = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            e.getContext && (t._workingCanvas = e,
            t._workingContext = e.getContext("2d"),
            e.width = e.height = 1),
            t.addFlippedFrames = function(e, i, s, n) {
                if (i || s || n) {
                    var r = 0;
                    i && t._flip(e, ++r, !0, !1),
                    s && t._flip(e, ++r, !1, !0),
                    n && t._flip(e, ++r, !0, !0)
                }
            },
            t.extractFrame = function(e, i) {
                isNaN(i) && (i = e.getAnimation(i).frames[0]);
                var s = e.getFrame(i);
                if (!s)
                    return null;
                var n = s.rect
                  , r = t._workingCanvas;
                r.width = n.width,
                r.height = n.height,
                t._workingContext.drawImage(s.image, n.x, n.y, n.width, n.height, 0, 0, n.width, n.height);
                var o = document.createElement("img");
                return o.src = r.toDataURL("image/png"),
                o
            },
            t.mergeAlpha = function(t, e, i) {
                i || (i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")),
                i.width = max(e.width, t.width),
                i.height = max(e.height, t.height);
                var s = i.getContext("2d");
                return s.save(),
                s.drawImage(t, 0, 0),
                s.globalCompositeOperation = "destination-in",
                s.drawImage(e, 0, 0),
                s.restore(),
                i
            },
            t._flip = function(e, i, s, n) {
                for (var r = e._images, o = t._workingCanvas, a = t._workingContext, h = r.length / i, l = 0; h > l; l++) {
                    var c = r[l];
                    c.__tmp = l,
                    a.setTransform(1, 0, 0, 1, 0, 0),
                    a.clearRect(0, 0, o.width + 1, o.height + 1),
                    o.width = c.width,
                    o.height = c.height,
                    a.setTransform(s ? -1 : 1, 0, 0, n ? -1 : 1, s ? c.width : 0, n ? c.height : 0),
                    a.drawImage(c, 0, 0);
                    var u = document.createElement("img");
                    u.src = o.toDataURL("image/png"),
                    u.width = c.width,
                    u.height = c.height,
                    r.push(u)
                }
                var p = e._frames
                  , d = p.length / i;
                for (l = 0; d > l; l++) {
                    c = p[l];
                    var f = c.rect.clone();
                    u = r[c.image.__tmp + h * i];
                    var v = {
                        image: u,
                        rect: f,
                        regX: c.regX,
                        regY: c.regY
                    };
                    s && (f.x = u.width - f.x - f.width,
                    v.regX = f.width - c.regX),
                    n && (f.y = u.height - f.y - f.height,
                    v.regY = f.height - c.regY),
                    p.push(v)
                }
                var g = "_" + (s ? "h" : "") + (n ? "v" : "")
                  , m = e._animations
                  , y = e._data
                  , w = m.length / i;
                for (l = 0; w > l; l++) {
                    var x = m[l];
                    c = y[x];
                    var _ = {
                        name: x + g,
                        speed: c.speed,
                        next: c.next,
                        frames: []
                    };
                    c.next && (_.next += g),
                    p = c.frames;
                    for (var b = 0, T = p.length; T > b; b++)
                        _.frames.push(p[b] + d * i);
                    y[_.name] = _,
                    m.push(_.name)
                }
            },
            createjs.SpriteSheetUtils = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                this.EventDispatcher_constructor(),
                this.maxWidth = 2048,
                this.maxHeight = 2048,
                this.spriteSheet = null,
                this.scale = 1,
                this.padding = 1,
                this.timeSlice = .3,
                this.progress = -1,
                this._frames = [],
                this._animations = {},
                this._data = null,
                this._nextFrameIndex = 0,
                this._index = 0,
                this._timerID = null,
                this._scale = 1
            }
            var e = createjs.extend(t, createjs.EventDispatcher);
            t.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions",
            t.ERR_RUNNING = "a build is already running",
            e.addFrame = function(e, i, s, n, r) {
                if (this._data)
                    throw t.ERR_RUNNING;
                var o = i || e.bounds || e.nominalBounds;
                return !o && e.getBounds && (o = e.getBounds()),
                o ? (s = s || 1,
                this._frames.push({
                    source: e,
                    sourceRect: o,
                    scale: s,
                    funct: n,
                    data: r,
                    index: this._frames.length,
                    height: o.height * s
                }) - 1) : null
            },
            e.addAnimation = function(e, i, s, n) {
                if (this._data)
                    throw t.ERR_RUNNING;
                this._animations[e] = {
                    frames: i,
                    next: s,
                    frequency: n
                }
            },
            e.addMovieClip = function(e, i, s, n, r, o) {
                if (this._data)
                    throw t.ERR_RUNNING;
                var a = e.frameBounds
                  , h = i || e.bounds || e.nominalBounds;
                if (!h && e.getBounds && (h = e.getBounds()),
                h || a) {
                    var l, c, u = this._frames.length, p = e.timeline.duration;
                    for (l = 0; p > l; l++) {
                        var d = a && a[l] ? a[l] : h;
                        this.addFrame(e, d, s, this._setupMovieClipFrame, {
                            i: l,
                            f: n,
                            d: r
                        })
                    }
                    var f = e.timeline._labels
                      , v = [];
                    for (var g in f)
                        v.push({
                            index: f[g],
                            label: g
                        });
                    if (v.length)
                        for (v.sort(function(t, e) {
                            return t.index - e.index
                        }),
                        l = 0,
                        c = v.length; c > l; l++) {
                            for (var m = v[l].label, y = u + v[l].index, w = u + (l == c - 1 ? p : v[l + 1].index), x = [], _ = y; w > _; _++)
                                x.push(_);
                            (!o || (m = o(m, e, y, w))) && this.addAnimation(m, x, !0)
                        }
                }
            },
            e.build = function() {
                if (this._data)
                    throw t.ERR_RUNNING;
                for (this._startBuild(); this._drawNext(); )
                    ;
                return this._endBuild(),
                this.spriteSheet
            },
            e.buildAsync = function(e) {
                if (this._data)
                    throw t.ERR_RUNNING;
                this.timeSlice = e,
                this._startBuild();
                var i = this;
                this._timerID = setTimeout(function() {
                    i._run()
                }, 50 - 50 * max(.01, min(.99, this.timeSlice || .3)))
            },
            e.stopAsync = function() {
                clearTimeout(this._timerID),
                this._data = null
            },
            e.clone = function() {
                throw "SpriteSheetBuilder cannot be cloned."
            },
            e.toString = function() {
                return "[SpriteSheetBuilder]"
            },
            e._startBuild = function() {
                var e = this.padding || 0;
                this.progress = 0,
                this.spriteSheet = null,
                this._index = 0,
                this._scale = this.scale;
                var i = [];
                this._data = {
                    images: [],
                    frames: i,
                    animations: this._animations
                };
                var s = this._frames.slice();
                if (s.sort(function(t, e) {
                    return t.height <= e.height ? -1 : 1
                }),
                s[s.length - 1].height + 2 * e > this.maxHeight)
                    throw t.ERR_DIMENSIONS;
                for (var n = 0, r = 0, o = 0; s.length; ) {
                    var a = this._fillRow(s, n, o, i, e);
                    if (a.w > r && (r = a.w),
                    n += a.h,
                    !a.h || !s.length) {
                        var h = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
                        h.width = this._getSize(r, this.maxWidth),
                        h.height = this._getSize(n, this.maxHeight),
                        this._data.images[o] = h,
                        a.h || (r = n = 0,
                        o++)
                    }
                }
            },
            e._setupMovieClipFrame = function(t, e) {
                var i = t.actionsEnabled;
                t.actionsEnabled = !1,
                t.gotoAndStop(e.i),
                t.actionsEnabled = i,
                e.f && e.f(t, e.d, e.i)
            },
            e._getSize = function(t, e) {
                for (var i = 4; pow(2, ++i) < t; )
                    ;
                return min(e, pow(2, i))
            },
            e._fillRow = function(e, i, s, n, r) {
                var o = this.maxWidth
                  , a = this.maxHeight;
                i += r;
                for (var h = a - i, l = r, c = 0, u = e.length - 1; u >= 0; u--) {
                    var p = e[u]
                      , d = this._scale * p.scale
                      , f = p.sourceRect
                      , v = p.source
                      , g = floor(d * f.x - r)
                      , m = floor(d * f.y - r)
                      , y = ceil(d * f.height + 2 * r)
                      , w = ceil(d * f.width + 2 * r);
                    if (w > o)
                        throw t.ERR_DIMENSIONS;
                    y > h || l + w > o || (p.img = s,
                    p.rect = new createjs.Rectangle(l,i,w,y),
                    c = c || y,
                    e.splice(u, 1),
                    n[p.index] = [l, i, w, y, s, round(-g + d * v.regX - r), round(-m + d * v.regY - r)],
                    l += w)
                }
                return {
                    w: l,
                    h: c
                }
            },
            e._endBuild = function() {
                this.spriteSheet = new createjs.SpriteSheet(this._data),
                this._data = null,
                this.progress = 1,
                this.dispatchEvent("complete")
            },
            e._run = function() {
                for (var t = 50 * max(.01, min(.99, this.timeSlice || .3)), e = (new Date).getTime() + t, i = !1; e > (new Date).getTime(); )
                    if (!this._drawNext()) {
                        i = !0;
                        break
                    }
                if (i)
                    this._endBuild();
                else {
                    var s = this;
                    this._timerID = setTimeout(function() {
                        s._run()
                    }, 50 - t)
                }
                var n = this.progress = this._index / this._frames.length;
                if (this.hasEventListener("progress")) {
                    var r = new createjs.Event("progress");
                    r.progress = n,
                    this.dispatchEvent(r)
                }
            },
            e._drawNext = function() {
                var t = this._frames[this._index]
                  , e = t.scale * this._scale
                  , i = t.rect
                  , s = t.sourceRect
                  , n = this._data.images[t.img]
                  , r = n.getContext("2d");
                return t.funct && t.funct(t.source, t.data),
                r.save(),
                r.beginPath(),
                r.rect(i.x, i.y, i.width, i.height),
                r.clip(),
                r.translate(ceil(i.x - s.x * e), ceil(i.y - s.y * e)),
                r.scale(e, e),
                t.source.draw(r),
                r.restore(),
                ++this._index < this._frames.length
            },
            createjs.SpriteSheetBuilder = createjs.promote(t, "EventDispatcher")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t) {
                this.DisplayObject_constructor(),
                "string" == typeof t && (t = document.getElementById(t)),
                this.mouseEnabled = !1;
                var e = t.style;
                e.position = "absolute",
                e.transformOrigin = e.WebkitTransformOrigin = e.msTransformOrigin = e.MozTransformOrigin = e.OTransformOrigin = "0% 0%",
                this.htmlElement = t,
                this._oldProps = null
            }
            var e = createjs.extend(t, createjs.DisplayObject);
            e.isVisible = function() {
                return null != this.htmlElement
            },
            e.draw = function() {
                return !0
            },
            e.cache = function() {},
            e.uncache = function() {},
            e.updateCache = function() {},
            e.hitTest = function() {},
            e.localToGlobal = function() {},
            e.globalToLocal = function() {},
            e.localToLocal = function() {},
            e.clone = function() {
                throw "DOMElement cannot be cloned."
            },
            e.toString = function() {
                return "[DOMElement (name=" + this.name + ")]"
            },
            e._tick = function(t) {
                var e = this.getStage();
                e && e.on("drawend", this._handleDrawEnd, this, !0),
                this.DisplayObject__tick(t)
            },
            e._handleDrawEnd = function() {
                var t = this.htmlElement;
                if (t) {
                    var e = t.style
                      , i = this.getConcatenatedDisplayProps(this._props)
                      , s = i.matrix
                      , n = i.visible ? "visible" : "hidden";
                    if (n != e.visibility && (e.visibility = n),
                    i.visible) {
                        var r = this._oldProps
                          , o = r && r.matrix
                          , a = 1e4;
                        if (!o || !o.equals(s)) {
                            var h = "matrix(" + (s.a * a | 0) / a + "," + (s.b * a | 0) / a + "," + (s.c * a | 0) / a + "," + (s.d * a | 0) / a + "," + (s.tx + .5 | 0);
                            e.transform = e.WebkitTransform = e.OTransform = e.msTransform = h + "," + (s.ty + .5 | 0) + ")",
                            e.MozTransform = h + "px," + (s.ty + .5 | 0) + "px)",
                            r || (r = this._oldProps = new createjs.DisplayProps(!0,0 / 0)),
                            r.matrix.copy(s)
                        }
                        r.alpha != i.alpha && (e.opacity = "" + (i.alpha * a | 0) / a,
                        r.alpha = i.alpha)
                    }
                }
            },
            createjs.DOMElement = createjs.promote(t, "DisplayObject")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {}
            var e = t.prototype;
            e.getBounds = function(t) {
                return t
            },
            e.applyFilter = function(t, e, i, s, n, r, o, a) {
                r = r || t,
                null == o && (o = e),
                null == a && (a = i);
                try {
                    var h = t.getImageData(e, i, s, n)
                } catch (l) {
                    return !1
                }
                return this._applyFilter(h) ? (r.putImageData(h, o, a),
                !0) : !1
            },
            e.toString = function() {
                return "[Filter]"
            },
            e.clone = function() {
                return new t
            },
            e._applyFilter = function() {
                return !0
            },
            createjs.Filter = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i) {
                (isNaN(t) || 0 > t) && (t = 0),
                (isNaN(e) || 0 > e) && (e = 0),
                (isNaN(i) || 1 > i) && (i = 1),
                this.blurX = 0 | t,
                this.blurY = 0 | e,
                this.quality = 0 | i
            }
            var e = createjs.extend(t, createjs.Filter);
            t.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1],
            t.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9],
            e.getBounds = function(t) {
                var e = 0 | this.blurX
                  , i = 0 | this.blurY;
                if (0 >= e && 0 >= i)
                    return t;
                var s = pow(this.quality, .2);
                return (t || new createjs.Rectangle).pad(e * s + 1, i * s + 1, e * s + 1, i * s + 1)
            },
            e.clone = function() {
                return new t(this.blurX,this.blurY,this.quality)
            },
            e.toString = function() {
                return "[BlurFilter]"
            },
            e._applyFilter = function(e) {
                var i = this.blurX >> 1;
                if (isNaN(i) || 0 > i)
                    return !1;
                var s = this.blurY >> 1;
                if (isNaN(s) || 0 > s)
                    return !1;
                if (0 == i && 0 == s)
                    return !1;
                var n = this.quality;
                (isNaN(n) || 1 > n) && (n = 1),
                n |= 0,
                n > 3 && (n = 3),
                1 > n && (n = 1);
                var r = e.data
                  , o = 0
                  , a = 0
                  , h = 0
                  , l = 0
                  , c = 0
                  , u = 0
                  , p = 0
                  , d = 0
                  , f = 0
                  , v = 0
                  , g = 0
                  , m = 0
                  , y = 0
                  , w = 0
                  , x = 0
                  , _ = i + i + 1 | 0
                  , b = s + s + 1 | 0
                  , T = 0 | e.width
                  , C = 0 | e.height
                  , k = T - 1 | 0
                  , S = C - 1 | 0
                  , P = i + 1 | 0
                  , M = s + 1 | 0
                  , A = {
                    r: 0,
                    b: 0,
                    g: 0,
                    a: 0
                }
                  , D = A;
                for (h = 1; _ > h; h++)
                    D = D.n = {
                        r: 0,
                        b: 0,
                        g: 0,
                        a: 0
                    };
                D.n = A;
                var I = {
                    r: 0,
                    b: 0,
                    g: 0,
                    a: 0
                }
                  , E = I;
                for (h = 1; b > h; h++)
                    E = E.n = {
                        r: 0,
                        b: 0,
                        g: 0,
                        a: 0
                    };
                E.n = I;
                for (var O = null, z = 0 | t.MUL_TABLE[i], j = 0 | t.SHG_TABLE[i], L = 0 | t.MUL_TABLE[s], B = 0 | t.SHG_TABLE[s]; n-- > 0; ) {
                    p = u = 0;
                    var F = z
                      , R = j;
                    for (a = C; --a > -1; ) {
                        for (d = P * (m = r[0 | u]),
                        f = P * (y = r[u + 1 | 0]),
                        v = P * (w = r[u + 2 | 0]),
                        g = P * (x = r[u + 3 | 0]),
                        D = A,
                        h = P; --h > -1; )
                            D.r = m,
                            D.g = y,
                            D.b = w,
                            D.a = x,
                            D = D.n;
                        for (h = 1; P > h; h++)
                            l = u + ((h > k ? k : h) << 2) | 0,
                            d += D.r = r[l],
                            f += D.g = r[l + 1],
                            v += D.b = r[l + 2],
                            g += D.a = r[l + 3],
                            D = D.n;
                        for (O = A,
                        o = 0; T > o; o++)
                            r[u++] = d * F >>> R,
                            r[u++] = f * F >>> R,
                            r[u++] = v * F >>> R,
                            r[u++] = g * F >>> R,
                            l = p + ((l = o + i + 1) < k ? l : k) << 2,
                            d -= O.r - (O.r = r[l]),
                            f -= O.g - (O.g = r[l + 1]),
                            v -= O.b - (O.b = r[l + 2]),
                            g -= O.a - (O.a = r[l + 3]),
                            O = O.n;
                        p += T
                    }
                    for (F = L,
                    R = B,
                    o = 0; T > o; o++) {
                        for (u = o << 2 | 0,
                        d = M * (m = r[u]) | 0,
                        f = M * (y = r[u + 1 | 0]) | 0,
                        v = M * (w = r[u + 2 | 0]) | 0,
                        g = M * (x = r[u + 3 | 0]) | 0,
                        E = I,
                        h = 0; M > h; h++)
                            E.r = m,
                            E.g = y,
                            E.b = w,
                            E.a = x,
                            E = E.n;
                        for (c = T,
                        h = 1; s >= h; h++)
                            u = c + o << 2,
                            d += E.r = r[u],
                            f += E.g = r[u + 1],
                            v += E.b = r[u + 2],
                            g += E.a = r[u + 3],
                            E = E.n,
                            S > h && (c += T);
                        if (u = o,
                        O = I,
                        n > 0)
                            for (a = 0; C > a; a++)
                                l = u << 2,
                                r[l + 3] = x = g * F >>> R,
                                x > 0 ? (r[l] = d * F >>> R,
                                r[l + 1] = f * F >>> R,
                                r[l + 2] = v * F >>> R) : r[l] = r[l + 1] = r[l + 2] = 0,
                                l = o + ((l = a + M) < S ? l : S) * T << 2,
                                d -= O.r - (O.r = r[l]),
                                f -= O.g - (O.g = r[l + 1]),
                                v -= O.b - (O.b = r[l + 2]),
                                g -= O.a - (O.a = r[l + 3]),
                                O = O.n,
                                u += T;
                        else
                            for (a = 0; C > a; a++)
                                l = u << 2,
                                r[l + 3] = x = g * F >>> R,
                                x > 0 ? (x = 255 / x,
                                r[l] = (d * F >>> R) * x,
                                r[l + 1] = (f * F >>> R) * x,
                                r[l + 2] = (v * F >>> R) * x) : r[l] = r[l + 1] = r[l + 2] = 0,
                                l = o + ((l = a + M) < S ? l : S) * T << 2,
                                d -= O.r - (O.r = r[l]),
                                f -= O.g - (O.g = r[l + 1]),
                                v -= O.b - (O.b = r[l + 2]),
                                g -= O.a - (O.a = r[l + 3]),
                                O = O.n,
                                u += T
                    }
                }
                return !0
            },
            createjs.BlurFilter = createjs.promote(t, "Filter")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t) {
                this.alphaMap = t,
                this._alphaMap = null,
                this._mapData = null
            }
            var e = createjs.extend(t, createjs.Filter);
            e.clone = function() {
                var e = new t(this.alphaMap);
                return e._alphaMap = this._alphaMap,
                e._mapData = this._mapData,
                e
            },
            e.toString = function() {
                return "[AlphaMapFilter]"
            },
            e._applyFilter = function(t) {
                if (!this.alphaMap)
                    return !0;
                if (!this._prepAlphaMap())
                    return !1;
                for (var e = t.data, i = this._mapData, s = 0, n = e.length; n > s; s += 4)
                    e[s + 3] = i[s] || 0;
                return !0
            },
            e._prepAlphaMap = function() {
                if (!this.alphaMap)
                    return !1;
                if (this.alphaMap == this._alphaMap && this._mapData)
                    return !0;
                this._mapData = null;
                var t, e = this._alphaMap = this.alphaMap, i = e;
                e instanceof HTMLCanvasElement ? t = i.getContext("2d") : (i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"),
                i.width = e.width,
                i.height = e.height,
                t = i.getContext("2d"),
                t.drawImage(e, 0, 0));
                try {
                    var s = t.getImageData(0, 0, e.width, e.height)
                } catch (n) {
                    return !1
                }
                return this._mapData = s.data,
                !0
            },
            createjs.AlphaMapFilter = createjs.promote(t, "Filter")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t) {
                this.mask = t
            }
            var e = createjs.extend(t, createjs.Filter);
            e.applyFilter = function(t, e, i, s, n, r, o, a) {
                return this.mask ? (r = r || t,
                null == o && (o = e),
                null == a && (a = i),
                r.save(),
                t != r ? !1 : (r.globalCompositeOperation = "destination-in",
                r.drawImage(this.mask, o, a),
                r.restore(),
                !0)) : !0
            },
            e.clone = function() {
                return new t(this.mask)
            },
            e.toString = function() {
                return "[AlphaMaskFilter]"
            },
            createjs.AlphaMaskFilter = createjs.promote(t, "Filter")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i, s, n, r, o, a) {
                this.redMultiplier = null != t ? t : 1,
                this.greenMultiplier = null != e ? e : 1,
                this.blueMultiplier = null != i ? i : 1,
                this.alphaMultiplier = null != s ? s : 1,
                this.redOffset = n || 0,
                this.greenOffset = r || 0,
                this.blueOffset = o || 0,
                this.alphaOffset = a || 0
            }
            var e = createjs.extend(t, createjs.Filter);
            e.toString = function() {
                return "[ColorFilter]"
            },
            e.clone = function() {
                return new t(this.redMultiplier,this.greenMultiplier,this.blueMultiplier,this.alphaMultiplier,this.redOffset,this.greenOffset,this.blueOffset,this.alphaOffset)
            },
            e._applyFilter = function(t) {
                for (var e = t.data, i = e.length, s = 0; i > s; s += 4)
                    e[s] = e[s] * this.redMultiplier + this.redOffset,
                    e[s + 1] = e[s + 1] * this.greenMultiplier + this.greenOffset,
                    e[s + 2] = e[s + 2] * this.blueMultiplier + this.blueOffset,
                    e[s + 3] = e[s + 3] * this.alphaMultiplier + this.alphaOffset;
                return !0
            },
            createjs.ColorFilter = createjs.promote(t, "Filter")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i, s) {
                this.setColor(t, e, i, s)
            }
            var e = t.prototype;
            t.DELTA_INDEX = [0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10],
            t.IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            t.LENGTH = t.IDENTITY_MATRIX.length,
            e.setColor = function(t, e, i, s) {
                return this.reset().adjustColor(t, e, i, s)
            },
            e.reset = function() {
                return this.copy(t.IDENTITY_MATRIX)
            },
            e.adjustColor = function(t, e, i, s) {
                return this.adjustHue(s),
                this.adjustContrast(e),
                this.adjustBrightness(t),
                this.adjustSaturation(i)
            },
            e.adjustBrightness = function(t) {
                return 0 == t || isNaN(t) ? this : (t = this._cleanValue(t, 255),
                this._multiplyMatrix([1, 0, 0, 0, t, 0, 1, 0, 0, t, 0, 0, 1, 0, t, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
                this)
            },
            e.adjustContrast = function(e) {
                if (0 == e || isNaN(e))
                    return this;
                e = this._cleanValue(e, 100);
                var i;
                return 0 > e ? i = 127 + e / 100 * 127 : (i = e % 1,
                i = 0 == i ? t.DELTA_INDEX[e] : t.DELTA_INDEX[e << 0] * (1 - i) + t.DELTA_INDEX[(e << 0) + 1] * i,
                i = 127 * i + 127),
                this._multiplyMatrix([i / 127, 0, 0, 0, .5 * (127 - i), 0, i / 127, 0, 0, .5 * (127 - i), 0, 0, i / 127, 0, .5 * (127 - i), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
                this
            },
            e.adjustSaturation = function(t) {
                if (0 == t || isNaN(t))
                    return this;
                t = this._cleanValue(t, 100);
                var e = 1 + (t > 0 ? 3 * t / 100 : t / 100)
                  , i = .3086
                  , s = .6094
                  , n = .082;
                return this._multiplyMatrix([i * (1 - e) + e, s * (1 - e), n * (1 - e), 0, 0, i * (1 - e), s * (1 - e) + e, n * (1 - e), 0, 0, i * (1 - e), s * (1 - e), n * (1 - e) + e, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
                this
            },
            e.adjustHue = function(t) {
                if (0 == t || isNaN(t))
                    return this;
                t = this._cleanValue(t, 180) / 180 * PI;
                var e = cos(t)
                  , i = sin(t)
                  , s = .213
                  , n = .715
                  , r = .072;
                return this._multiplyMatrix([s + e * (1 - s) + i * -s, n + e * -n + i * -n, r + e * -r + i * (1 - r), 0, 0, s + e * -s + .143 * i, n + e * (1 - n) + .14 * i, r + e * -r + i * -.283, 0, 0, s + e * -s + i * -(1 - s), n + e * -n + i * n, r + e * (1 - r) + i * r, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
                this
            },
            e.concat = function(e) {
                return e = this._fixMatrix(e),
                e.length != t.LENGTH ? this : (this._multiplyMatrix(e),
                this)
            },
            e.clone = function() {
                return (new t).copy(this)
            },
            e.toArray = function() {
                for (var e = [], i = 0, s = t.LENGTH; s > i; i++)
                    e[i] = this[i];
                return e
            },
            e.copy = function(e) {
                for (var i = t.LENGTH, s = 0; i > s; s++)
                    this[s] = e[s];
                return this
            },
            e.toString = function() {
                return "[ColorMatrix]"
            },
            e._multiplyMatrix = function(t) {
                var e, i, s, n = [];
                for (e = 0; 5 > e; e++) {
                    for (i = 0; 5 > i; i++)
                        n[i] = this[i + 5 * e];
                    for (i = 0; 5 > i; i++) {
                        var r = 0;
                        for (s = 0; 5 > s; s++)
                            r += t[i + 5 * s] * n[s];
                        this[i + 5 * e] = r
                    }
                }
            },
            e._cleanValue = function(t, e) {
                return min(e, max(-e, t))
            },
            e._fixMatrix = function(e) {
                return e instanceof t && (e = e.toArray()),
                e.length < t.LENGTH ? e = e.slice(0, e.length).concat(t.IDENTITY_MATRIX.slice(e.length, t.LENGTH)) : e.length > t.LENGTH && (e = e.slice(0, t.LENGTH)),
                e
            },
            createjs.ColorMatrix = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t) {
                this.matrix = t
            }
            var e = createjs.extend(t, createjs.Filter);
            e.toString = function() {
                return "[ColorMatrixFilter]"
            },
            e.clone = function() {
                return new t(this.matrix)
            },
            e._applyFilter = function(t) {
                for (var e, i, s, n, r = t.data, o = r.length, a = this.matrix, h = a[0], l = a[1], c = a[2], u = a[3], p = a[4], d = a[5], f = a[6], v = a[7], g = a[8], m = a[9], y = a[10], w = a[11], x = a[12], _ = a[13], b = a[14], T = a[15], C = a[16], k = a[17], S = a[18], P = a[19], M = 0; o > M; M += 4)
                    e = r[M],
                    i = r[M + 1],
                    s = r[M + 2],
                    n = r[M + 3],
                    r[M] = e * h + i * l + s * c + n * u + p,
                    r[M + 1] = e * d + i * f + s * v + n * g + m,
                    r[M + 2] = e * y + i * w + s * x + n * _ + b,
                    r[M + 3] = e * T + i * C + s * k + n * S + P;
                return !0
            },
            createjs.ColorMatrixFilter = createjs.promote(t, "Filter")
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                throw "Touch cannot be instantiated"
            }
            t.isSupported = function() {
                return !!("ontouchstart"in window || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0)
            },
            t.enable = function(e, i, s) {
                return e && e.canvas && t.isSupported() ? e.__touch ? !0 : (e.__touch = {
                    pointers: {},
                    multitouch: !i,
                    preventDefault: !s,
                    count: 0
                },
                "ontouchstart"in window ? t._IOS_enable(e) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && t._IE_enable(e),
                !0) : !1
            },
            t.disable = function(e) {
                e && ("ontouchstart"in window ? t._IOS_disable(e) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && t._IE_disable(e),
                delete e.__touch)
            },
            t._IOS_enable = function(e) {
                var i = e.canvas
                  , s = e.__touch.f = function(i) {
                    t._IOS_handleEvent(e, i)
                }
                ;
                i.addEventListener("touchstart", s, !1),
                i.addEventListener("touchmove", s, !1),
                i.addEventListener("touchend", s, !1),
                i.addEventListener("touchcancel", s, !1)
            },
            t._IOS_disable = function(t) {
                var e = t.canvas;
                if (e) {
                    var i = t.__touch.f;
                    e.removeEventListener("touchstart", i, !1),
                    e.removeEventListener("touchmove", i, !1),
                    e.removeEventListener("touchend", i, !1),
                    e.removeEventListener("touchcancel", i, !1)
                }
            },
            t._IOS_handleEvent = function(t, e) {
                if (t) {
                    t.__touch.preventDefault && e.preventDefault && e.preventDefault();
                    for (var i = e.changedTouches, s = e.type, n = 0, r = i.length; r > n; n++) {
                        var o = i[n]
                          , a = o.identifier;
                        o.target == t.canvas && ("touchstart" == s ? this._handleStart(t, a, e, o.pageX, o.pageY) : "touchmove" == s ? this._handleMove(t, a, e, o.pageX, o.pageY) : ("touchend" == s || "touchcancel" == s) && this._handleEnd(t, a, e))
                    }
                }
            },
            t._IE_enable = function(e) {
                var i = e.canvas
                  , s = e.__touch.f = function(i) {
                    t._IE_handleEvent(e, i)
                }
                ;
                void 0 === window.navigator.pointerEnabled ? (i.addEventListener("MSPointerDown", s, !1),
                window.addEventListener("MSPointerMove", s, !1),
                window.addEventListener("MSPointerUp", s, !1),
                window.addEventListener("MSPointerCancel", s, !1),
                e.__touch.preventDefault && (i.style.msTouchAction = "none")) : (i.addEventListener("pointerdown", s, !1),
                window.addEventListener("pointermove", s, !1),
                window.addEventListener("pointerup", s, !1),
                window.addEventListener("pointercancel", s, !1),
                e.__touch.preventDefault && (i.style.touchAction = "none")),
                e.__touch.activeIDs = {}
            },
            t._IE_disable = function(t) {
                var e = t.__touch.f;
                void 0 === window.navigator.pointerEnabled ? (window.removeEventListener("MSPointerMove", e, !1),
                window.removeEventListener("MSPointerUp", e, !1),
                window.removeEventListener("MSPointerCancel", e, !1),
                t.canvas && t.canvas.removeEventListener("MSPointerDown", e, !1)) : (window.removeEventListener("pointermove", e, !1),
                window.removeEventListener("pointerup", e, !1),
                window.removeEventListener("pointercancel", e, !1),
                t.canvas && t.canvas.removeEventListener("pointerdown", e, !1))
            },
            t._IE_handleEvent = function(t, e) {
                if (t) {
                    t.__touch.preventDefault && e.preventDefault && e.preventDefault();
                    var i = e.type
                      , s = e.pointerId
                      , n = t.__touch.activeIDs;
                    if ("MSPointerDown" == i || "pointerdown" == i) {
                        if (e.srcElement != t.canvas)
                            return;
                        n[s] = !0,
                        this._handleStart(t, s, e, e.pageX, e.pageY)
                    } else
                        n[s] && ("MSPointerMove" == i || "pointermove" == i ? this._handleMove(t, s, e, e.pageX, e.pageY) : ("MSPointerUp" == i || "MSPointerCancel" == i || "pointerup" == i || "pointercancel" == i) && (delete n[s],
                        this._handleEnd(t, s, e)))
                }
            },
            t._handleStart = function(t, e, i, s, n) {
                var r = t.__touch;
                if (r.multitouch || !r.count) {
                    var o = r.pointers;
                    o[e] || (o[e] = !0,
                    r.count++,
                    t._handlePointerDown(e, i, s, n))
                }
            },
            t._handleMove = function(t, e, i, s, n) {
                t.__touch.pointers[e] && t._handlePointerMove(e, i, s, n)
            },
            t._handleEnd = function(t, e, i) {
                var s = t.__touch
                  , n = s.pointers;
                n[e] && (s.count--,
                t._handlePointerUp(e, i, !0),
                delete n[e])
            },
            createjs.Touch = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            var t = createjs.EaselJS = createjs.EaselJS || {};
            t.version = "0.8.0",
            t.buildDate = "Thu, 22 Oct 2020 00:15:55 PST"
        }()
    },
    90: function(t, e) {
        var Vector = t(8)
          , Tool = t(49)
          , Path = t(64);
        e.exports = class Fill extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.pos = new Vector(0,0)
            }
            toolInit = this.init;
            name = "Fill";
            passive = !1;
            active = !1;
            pos = null;
            release() {
                var t = this.mouse.touch.real;
                this.passive = !1,
                this.active = !0,
                this.pos.x = t.x,
                this.pos.y = t.y;
                for(var i of this.scene.track.physicsLines) {
                    var p1 = i.checkForConnectedLine(this.scene.track, i.p1);
                    var p2 = i.checkForConnectedLine(this.scene.track, i.p2);
                    if(p1 && p2) {
                        var p1a = p1.checkForConnectedLine(this.scene.track, p1.p1);
                        var p2a = p2.checkForConnectedLine(this.scene.track, p2.p1);
                        var p1b = p1.checkForConnectedLine(this.scene.track, p1.p2);
                        var p2b = p2.checkForConnectedLine(this.scene.track, p2.p2);
                        if(p1a == p2a || p1b == p2b || p1a == p2b || p2a == p1b) {
                            var p3 = p1b;
                        }
                        if(p3) {
                            for(let i = p3.p1.y; i < p3.p1.y + p3.p2.y; i++) {
                                this.scene.track.addPhysicsLine(p3.p1.x, i, p3.p1.x + p3.p2.x, i);
                            }
                        }
                    }
                }
            }
            buildPaths(t) {
                for (var e = []; t.length > 0; ) {
                    var i = new Path;
                    i.build(t),
                    e.push(i)
                }
            }
            intersectsLine(t, e) {
                var i = min(this.p1.y, this.p2.y)
                    , s = min(this.p1.x, this.p2.x)
                    , n = max(this.p1.y, this.p2.y)
                    , r = max(this.p1.x, this.p2.x)
                    , o = abs(r - s)
                    , c = abs(i - n)
                    , u = t.x
                    , p = e.x;
                if (t.x > e.x && (u = e.x,
                p = t.x),
                p > s + o && (p = s + o),
                s > u && (u = s),
                u > p)
                    return !1;
                var d = t.y
                    , f = e.y
                    , v = e.x - t.x;
                if (abs(v) > 1e-7) {
                    var g = (e.y - t.y) / v
                        , m = t.y - g * t.x;
                    d = g * u + m,
                    f = g * p + m
                }
                if (d > f) {
                    var y = f;
                    f = d,
                    d = y
                }
                return f > i + c && (f = i + c),
                i > d && (d = i),
                d > f ? !1 : !0
            }
            toScreen(t, e) {
                var i = this.scene.camera
                    , s = this.scene.screen;
                return (t - i.position[e]) * i.zoom + s.center[e]
            }
            reset() {
                this.pos.x = 0,
                this.pos.y = 0,
                this.active = !1,
                this.passive = !1
            }
            close() {
                this.dashOffset = 0,
                this.selectedElements = [],
                this.mouse = null,
                this.camera = null,
                this.scene = null,
                this.toolHandler = null,
                this.pos = null,
                this.active = !1,
                this.passive = !1
            }
        }
    },
    91: function(t, e) {
        var Vector = t(8)
            , n = t(64)
            , Tool = t(49);
        e.exports = class OvalTool extends Tool {
            constructor(t) {
                super();
                this.toolInit(t),
                this.p1 = new Vector(0,0),
                this.p2 = new Vector(0,0)
            }
            toolInit = this.init;
            name = "Oval";
            passive = !1;
            active = !1;
            p1 = null;
            p2 = null;
            press() {
                var t = this.mouse.touch.real;
                this.passive = !1,
                this.active = !0,
                this.p1.x = t.x,
                this.p1.y = t.y,
                this.p2.x = t.x,
                this.p2.y = t.y
            }
            hold() {
                var t = this.mouse.touch.real;
                this.p2.x = t.x,
                this.p2.y = t.y
            }
            release() {
                for(let i = 0; i <= 360; i += 5) {
                    this.scene.track.addPhysicsLine(this.p1.x + this.p2.x * cos(i * PI / 180), this.p1.y + this.p2.y * sin(i * PI / 180))
                }
                this.active = !1,
                this.passive = !0
            }
            buildPaths(t) {
                for (var e = []; t.length > 0; ) {
                    var i = new n;
                    i.build(t),
                    e.push(i)
                }
            }
            intersectsLine(t, e) {
                var i = min(this.p1.y, this.p2.y)
                    , s = min(this.p1.x, this.p2.x)
                    , n = max(this.p1.y, this.p2.y)
                    , r = max(this.p1.x, this.p2.x)
                    , o = abs(r - s)
                    , c = abs(i - n)
                    , u = t.x
                    , p = e.x;
                if (t.x > e.x && (u = e.x,
                p = t.x),
                p > s + o && (p = s + o),
                s > u && (u = s),
                u > p)
                    return !1;
                var d = t.y
                    , f = e.y
                    , v = e.x - t.x;
                if (abs(v) > 1e-7) {
                    var g = (e.y - t.y) / v
                        , m = t.y - g * t.x;
                    d = g * u + m,
                    f = g * p + m
                }
                if (d > f) {
                    var y = f;
                    f = d,
                    d = y
                }
                return f > i + c && (f = i + c),
                i > d && (d = i),
                d > f ? !1 : !0
            }
            toScreen(t, e) {
                var i = this.scene.camera
                    , s = this.scene.screen;
                return (t - i.position[e]) * i.zoom + s.center[e]
            }
            draw() {
                    var t = this.scene
                        , e = t.game.canvas.getContext("2d");
                    if (this.active || this.passive) {
                        var i = this.p1.toScreen(this.scene)
                            , s = this.p2.toScreen(this.scene);
                        CanvasRenderingContext2D.prototype.oval = function(x, y, w, h) {
                            e.moveTo(x, y + h / 2);
                            e.bezierCurveTo(x, y + h / 2 - (h / 2) * .5522848, x + w / 2 - (w / 2) * .5522848, y, x + w / 2, y);
                            e.bezierCurveTo(x + w / 2 + (w / 2) * .5522848, y, x + w, y + h / 2 - (h / 2) * .5522848, x + w, y + h / 2);
                            e.bezierCurveTo(x + w, y + h / 2 + (h / 2) * .5522848, x + w / 2 + (w / 2) * .5522848, y + h, x + w / 2, y + h);
                            e.bezierCurveTo(x + w / 2 - (w / 2) * .5522848, y + h, x, y + h / 2 + (h / 2) * .5522848, x, y + h / 2);
                        }
                        e.save(),
                        e.beginPath(),
                        e.oval(i.x, i.y, s.x, s.y),
                        e.stroke(),
                        e.restore()
                    }
            }
            reset() {
                this.p1.x = 0,
                this.p1.y = 0,
                this.p2.x = 0,
                this.p2.y = 0,
                this.active = !1,
                this.passive = !1
            }
            drawSectors() {
                for (var t = this.scene, e = t.camera, i = t.screen, s = t.game.canvas.getContext("2d"), n = e.zoom, r = e.position, o = t.screen.center, a = this.settings.drawSectorSize * n, h = r.x * n / a, l = r.y * n / a, c = i.width / a, u = i.height / a, p = u / 2, d = c / 2, f = h - d - 1, v = l - p - 1, g = h + d, m = l + p, y = this.totalSectors, w = y.length, x = 0; w > x; x++) {
                    var _ = y[x]
                        , b = _.row
                        , T = _.column;
                    if (T >= f && g >= T && b >= v && m >= b) {
                        _.drawn === !1 && _.image === !1 && _.draw();
                        var C = T * a - h * a + o.x
                            , k = b * a - l * a + o.y;
                        C = 0 | C,
                        k = 0 | k,
                        _.image ? s.drawImage(_.image, C, k) : s.drawImage(_.canvas, C, k)
                    } else
                        _.drawn && _.clear()
                }
            }
            close() {
                this.mouse = null,
                this.camera = null,
                this.scene = null,
                this.toolHandler = null,
                this.p2 = null,
                this.p1 = null,
                this.active = !1,
                this.passive = !1
            }
        }
    },
    92: function(t, e) {
        e.exports = window.lite = new class lite {
            constructor() {
                this.vars = localStorage.lite ? JSON.parse(localStorage.lite).vars : {
                    dark: !1,
                    di: !0,
                    feats: !1,
                    frce: !1,
                    invisible: !1,
                    isometric: !1,
                    toggle: !1,
                    toggleDropdown: !1,
                    update: {
                        dismissed: !1,
                        uptodate: !1
                    }
                }
                this.nodes = {
                    trackMover: null,
                    trackCombiner: null,
                    tools: null
                }
                this.inject(),
                this.saveToLocalStorage();
                var cfuInt = setInterval(() => {
                    !!window.manifestVersionLite && (this.checkForUpdate(window.manifestVersionLite), clearInterval(cfuInt));
                }, 1000);
            }
            getCap() {
                return {
                    classname: "cap",
                    script: GameInventoryManager.register("cap", class e extends GameInventoryManager.HeadClass {
                        constructor() {
                            super(),
                            this.drawAngle = 0,
                            this.createVersion()
                        }
                        versions = {};
                        versionName = "";
                        dirty = !0;
                        getVersions() {
                            return this.versions
                        }
                        cache(e) {
                            var r = this.versions[this.versionName];
                            r.dirty = !1;
                            var a = 115*(e=max(e,1))*.17,s=112*e*.17,
                            u = r.canvas;u.width=a,
                            u.height=s;
                            var v=u.getContext("2d"),
                            l=.17*e;
                            v.save(),
                            v.scale(l,l),
                            v.fillStyle = "#ffffff00";
                            v.lineCap = "round";
                            v.lineWidth = 11.5;
                            v.beginPath(),
                            v.arc(44, 50.5, 29.5, 0, 2 * PI),
                            v.moveTo(15,54),
                            v.lineTo(100, 38.5),
                            v.fill(),
                            v.stroke()
                        }
                        setDirty(){
                            this.versions[this.versionName].dirty=!0
                        }
                        getBaseWidth(){
                            return 115
                        }
                        getBaseHeight(){
                            return 112
                        }
                        getDrawOffsetX(){
                            return 2.2
                        }
                        getDrawOffsetY(){
                            return 1
                        }
                        getScale(){
                            return .17
                        }
                    }),
                    type: "1"
                }
            }
            drawInputDisplay(canvas = document.createElement('canvas')) {
                var gamepad = GameManager.game.currentScene.playerManager._players[GameManager.game.currentScene.camera.focusIndex]._gamepad.downButtons;
                var ctx = canvas.getContext('2d');
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                ctx.lineWidth = 5;
                ctx.strokeStyle = this.getVar("dark") && "#fff" || "#000";
                ctx.fillStyle = this.getVar("dark") && "#fff" || "#000";
                ctx.beginPath();
                ctx.moveTo(10, canvas.height - 10);
                ctx.lineTo(10, canvas.height - 50);
                ctx.lineTo(50, canvas.height - 50);
                ctx.lineTo(50, canvas.height - 10);
                ctx.lineTo(10, canvas.height - 10);
                !!gamepad.left && ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(10, canvas.height - 60);
                ctx.lineTo(10, canvas.height - 100);
                ctx.lineTo(50, canvas.height - 100);
                ctx.lineTo(50, canvas.height - 60);
                ctx.lineTo(10, canvas.height - 60);
                !!gamepad.z && ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(60, canvas.height - 60);
                ctx.lineTo(60, canvas.height - 100);
                ctx.lineTo(100, canvas.height - 100);
                ctx.lineTo(100, canvas.height - 60);
                ctx.lineTo(60, canvas.height - 60);
                !!gamepad.up && ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(60, canvas.height - 10);
                ctx.lineTo(60, canvas.height - 50);
                ctx.lineTo(100, canvas.height - 50);
                ctx.lineTo(100, canvas.height - 10);
                ctx.lineTo(60, canvas.height - 10);
                !!gamepad.down && ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(110, canvas.height - 10);
                ctx.lineTo(110, canvas.height - 50);
                ctx.lineTo(150, canvas.height - 50);
                ctx.lineTo(150, canvas.height - 10);
                ctx.lineTo(110, canvas.height - 10);
                !!gamepad.right && ctx.fill();
                ctx.stroke();
                ctx.lineWidth = 3;
                ctx.strokeStyle = !!gamepad.left ? (this.getVar("dark") ? "#000" : "#fff") : (this.getVar("dark") ? "#fff" : "#000");
                ctx.beginPath();
                ctx.moveTo(35, canvas.height - 38);
                ctx.lineTo(22, canvas.height - 30);
                ctx.lineTo(35, canvas.height - 22);
                ctx.stroke();
                ctx.strokeStyle = !!gamepad.z ? (this.getVar("dark") ? "#000" : "#fff") : (this.getVar("dark") ? "#fff" : "#000");
                ctx.beginPath();
                ctx.moveTo(22, canvas.height - 90);
                ctx.lineTo(37, canvas.height - 90);
                ctx.lineTo(22, canvas.height - 70);
                ctx.lineTo(37, canvas.height - 70);
                ctx.stroke();
                ctx.strokeStyle = !!gamepad.up ? (this.getVar("dark") ? "#000" : "#fff") : (this.getVar("dark") ? "#fff" : "#000");
                ctx.beginPath();
                ctx.moveTo(72, canvas.height - 72);
                ctx.lineTo(80, canvas.height - 88);
                ctx.lineTo(88, canvas.height - 72);
                ctx.stroke();
                ctx.strokeStyle = !!gamepad.down ? (this.getVar("dark") ? "#000" : "#fff") : (this.getVar("dark") ? "#fff" : "#000");
                ctx.beginPath();
                ctx.moveTo(72, canvas.height - 37);
                ctx.lineTo(80, canvas.height - 22);
                ctx.lineTo(88, canvas.height - 37);
                ctx.stroke();
                ctx.strokeStyle = !!gamepad.right ? (this.getVar("dark") ? "#000" : "#fff") : (this.getVar("dark") ? "#fff" : "#000");
                ctx.beginPath();
                ctx.moveTo(125, canvas.height - 38);
                ctx.lineTo(138, canvas.height - 30);
                ctx.lineTo(125, canvas.height - 22);
                ctx.stroke();
            }
            saveToLocalStorage() {
                var lite = JSON.stringify({
                    vars: this.vars
                });
                localStorage.setItem("lite", lite)
            }
            getVar(t) {
                return localStorage.lite ? JSON.parse(localStorage.lite).vars[t] : this.vars[t]
            }
            setVar(t, e) {
                if(typeof this.vars[t] == "object") {
                    for(var i in e) {
                        this.vars[t][i] = e[i]
                    }
                } else {
                    this.vars[t] = e
                }
                this.saveToLocalStorage()
            }
            updateVars() {
                this.vars = {};
                for(var t in JSON.parse(localStorage.lite).vars) {
                    this.vars[t] = JSON.parse(localStorage.lite).vars[t];
                }
            }
            checkAuto(){
                GameManager.game.currentScene.importCode = GameManager.game.currentScene.track.getCode();
                console.log("done!");
            }
            encode(t) {
                return parseInt(floor(t)).toString(32);
            }
            decode(t){
                return parseInt(parseInt(t, 32).toString());
            }
            moveTrack(){
                this.mx = !isNaN(parseFloat(document.getElementById("moveX").value)) ? parseFloat(document.getElementById("moveX").value) : 0;
                this.my = !isNaN(parseFloat(document.getElementById("moveY").value)) ? parseFloat(document.getElementById("moveY").value) : 0;
                this.code = GameManager.game.currentScene.track.getCode().split("#");
                this.black = code[0];
                this.grey = code[1];
                this.powerups = code[2];
                this.blackSegments = {};
                this.greySegments = {};
                this.Powerups = {};
                this.newSegmentsBlack = black.split(",");
                this.newSegmentsGrey = grey.split(",");
                this.newPowerups = powerups.split(",");
                if(black){
                    newSegmentsBlack.forEach(segment => {
                        blackSegments[segment] = segment.split(" ")
                    });
                    black = "";
                    for(var i in blackSegments){
                        blackSegments[i].filter((x, i) => i % 2 == 0).forEach(x=>{
                            blackSegments[i][blackSegments[i].indexOf(x)] = encode(decode(x)+mx)
                        });
                        blackSegments[i].filter((x, i) => i % 2).forEach(y=>{
                            blackSegments[i][blackSegments[i].indexOf(y)] = encode(decode(y)+my)
                        });
                        black += blackSegments[i].join(" ") + ",";
                    }
                }
                if(grey){
                    newSegmentsGrey.forEach(segment => {
                        greySegments[segment] = segment.split(" ")
                    });
                    grey = "";
                    for(var i in greySegments){
                        greySegments[i].filter((x, i) => i % 2 == 0).forEach(x=>{
                            greySegments[i][greySegments[i].indexOf(x)] = encode(decode(x)+mx)
                        });
                        greySegments[i].filter((x, i) => i % 2).forEach(y=>{
                            greySegments[i][greySegments[i].indexOf(y)] = encode(decode(y)+my)
                        });
                        grey += greySegments[i].join(" ") + ",";
                    }
                }
                if(powerups){
                    newPowerups.forEach(powerup => {
                        Powerups[powerup] = powerup.split(" ")
                    });
                    powerups = "";
                    for(var i in Powerups){
                        Powerups[i].filter((x, i) => i % 2).forEach(x=>{
                            Powerups[i][Powerups[i].indexOf(x)] = encode(decode(x)+mx)
                        });
                        Powerups[i].filter((x, i) => i % 2 == 0 && i != 0).forEach(y=>{
                            Powerups[i][Powerups[i].indexOf(y)] = encode(decode(y)+my)
                        });        
                        powerups += Powerups[i].join(" ") + ",";
                    }
                }
                GameManager.game.currentScene.importCode = (black ? (black.endsWith(",") ? black.slice(0,-1) : black) : "") + "#" + (grey ? (grey.endsWith(",") ? grey.slice(0,-1) : grey) : "") + "#" + (powerups ? (powerups.endsWith(",") ? powerups.slice(0,-1) : powerups) : "")
            }
            combine(){
                var i1 = document.getElementById("input1").value.split("#")
                  , i2 = document.getElementById("input2").value.split("#")
                  , output = document.getElementById("output");
                output.value = `${i1[0]}${i2[0]}#${i1[1]}${i2[1]}#${i1[2]}${i2[2]}`
            }
            checkForUpdate(t) {
                fetch("https://raw.githubusercontent.com/calculus-dev/free-rider-lite/master/update.json").then(response => response.json()).then(json => {
                    if(json.version > t && this.getVar("update").dismissed != !0){
                        this.setVar("update", {
                            uptodate: !0
                        })
                    }
                    if(this.getVar("update").uptodate != !1){
                        const element = document.body;
                        element.innerHTML += `<div class="mod-update-notification" id="update-notice" style="width:100%;height:50px;background-color:#2bb82b;color:#fff;position:fixed;top:0;z-index:1002;text-align:center;line-height:46px;cursor:pointer">A new version of Free Rider Lite is available!&nbsp;&nbsp;&nbsp;<button onclick="window.location.href='https://chrome.google.com/webstore/detail/mmmpacciomidmplocdcaheednkepbdkb'" id="update-button" style="height: 30px;background-color: #27ce35;border: none;border-radius: 4px;color: #fff">Update</button>&nbsp;<button class="mod-dismiss-button" id="dismiss-notice" style="height:30px;background-color:#27ce35;border:none;border-radius:4px;color: #fff">Dismiss</button></div>`;
                        document.getElementById('dismiss-notice').onclick = (()=>{
                            this.setVar("update", {
                                uptodate: !1,
                                dismissed: !0
                            })
                            document.getElementById('update-notice').style.display = "none";
                        });
                        document.getElementById('update-button').onclick = (()=>{
                            this.setVar("update", {
                                uptodate: !1,
                                dismissed: !0
                            })
                            document.getElementById('update-notice').style.display = "none";
                        });
                    }
                });
            }
            inject() {
                var e = document.createElement("style");
                e.type = "text/css",
                e.innerHTML = ".lite.icon{background-image:url(https://i.imgur.com/bNBqU1b.png);margin:7px;width:32px;height:32px;position:fixed;bottom:40px;left:0;z-index:10}.lite.icon:hover{opacity:0.4;cursor:pointer}.lite.settings{background-color:#fff;border:1px solid grey;line-height:normal;padding:14px;position:fixed;bottom:0;left:0;z-index:11}.lite.settings input{height:auto}.lite.hacker-mode-text{font-family:monospace;line-height:20pt}#color{border:none;background-color:#ffffff00;font-size:13px;font-family:roboto_medium,Arial,Helvetica,sans-serif;color:#1b5264}#color:hover{cursor:pointer}#toggleDropdown{border:none;background-color:#ffffff00;font-size:13px;font-family:roboto_medium,Arial,Helvetica,sans-serif;color:#1b5264}#toggleDropdown:hover{cursor:pointer}#dropdown{display:none;position:absolute;background-color:#f1f1f1;min-width:100px;padding:5px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)}#dropdown2{display:none;position:absolute;background-color:#f1f1f1;min-width:100px;padding:5px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)}",
                document.head.appendChild(e);
                var i = document.createElement("div");
                i.className += "lite icon",
                document.body.appendChild(i);
                var s = document.createElement("div");
                s.className += "lite settings",
                s.innerHTML = `<p style="text-align: center;"><b>Mod</b> <i>Settings</i></p><br>
                <button id="toggleDropdown">Tools</button><br>
                <div id="dropdown2">
                    <input type="radio" name="toggle" id="move" ${this.getVar("toggle") ? "checked" : ""}> <label for="red">Move Tracks</label><br>
                    <input type="radio" name="toggle" id="combine" ${!this.getVar("toggle") ? "checked" : ""}> <label for="orange">Combine Tracks</label><br>
                </div>
                <input title="Refresh your page for changes to take effect" type="checkbox" id="dark" ${this.getVar("dark") ? "checked" : ""}> <label for="dark">Dark Mode</label><br>
                <input title="Enables an input display." type="checkbox" id="di" ${this.getVar("di") ? "checked" : ""}> <label for="di">Input Display</label><br>
                <input title="Enables a beta feature" type="checkbox" id="frce" ${this.getVar("frce") ? "checked" : ""}> <label for="frce">FRCE Mod (limited)</label><br>
                <input title="Hide grid lines" type="checkbox" id="invisible" ${this.getVar("invisible") ? "checked" : ""}> <label for="invisible">Invisible Grid</label><br>
                <input title="Change grid style" type="checkbox" id="isometric" ${this.getVar("isometric") ? "checked" : "disabled"}> <label for="isometric">Isometric Grid</label><br>
                <input title="Enables a beta feature" type="checkbox" id="feats" ${this.getVar("feats") ? "checked" : ""}> <label for="feats">Feat. Ghosts LB</label><br><br>`;
                i.onclick = (()=>{
                    var t = e=>{
                        s.contains(e.target) || (document.removeEventListener("click", t),
                        document.body.removeChild(s))
                    };
                    document.body.appendChild(s),
                    setTimeout(()=>document.addEventListener("click", t), 0)
                });
                s.querySelector("#toggleDropdown").onclick = (()=>{
                    s.querySelector("#dropdown2").style.display = s.querySelector("#dropdown2").style.display == "none" && "block" || "none"
                }),
                s.querySelector("#move").onclick = (()=>{
                    this.setVar("toggle", !0),
                    document.getElementById('trackCombiner').parentNode.replaceChild(this.nodes.trackMover, document.getElementById('trackCombiner'))
                }),
                s.querySelector("#combine").onclick = (()=>{
                    this.setVar("toggle", !1),
                    document.getElementById('trackMover').parentNode.replaceChild(this.nodes.trackCombiner, document.getElementById('trackMover'))
                }),
                s.querySelector("#dark").onclick = (()=>{
                    this.setVar("dark", !this.getVar("dark")),
                    document.getElementsByClassName("game")[0].style.background = this.getVar("dark") && "#1d1d1d" || "#ffffff",
                    GameManager.game.currentScene.track.undraw()
                }),
                s.querySelector("#di").onclick = (()=>{
                    this.setVar("di", !this.getVar("di"))
                }),
                s.querySelector("#frce").onclick = (()=>{
                    this.setVar("frce", !this.getVar("frce"))
                }),
                s.querySelector("#feats").onclick = (()=>{
                    this.setVar("feats", !this.getVar("feats"))
                }),
                s.querySelector("#invisible").onclick = (()=>{
                    this.setVar("invisible", !this.getVar("invisible")),
                    GameManager.game.currentScene.state.grid = GameManager.game.currentScene.toolHandler.options.grid
                }),
                s.querySelector("#isometric").onclick = (()=>{
                    this.setVar("isometric", !this.getVar("isometric"))
                });
            }
        }()
    }
});? y(t[i], e[i]) : e[i]
                } catch (s) {
                    t[i] = e[i]
                }
            return t
        };
        class Player {
            constructor(a, b) {
                this.id = g++,
                this._scene = a,
                this._game = a.game,
                this._user = b,
                this._settings = a.settings;
                var i = a.settings.startVehicle;
                a.settings.track && (i = a.settings.track.vehicle),
                this._baseVehicleType = i,
                this._gamepad = new Gamepad(a),
                this._ghost = !1,
                this._color = b.color ? b.color : "#000000",
                this.setDefaults(),
                this.createBaseVehicle(new Vector(0,35), 1, new Vector(0,0))
            }
            getCheckpointCount() {
                return this._checkpoints.length
            }
            setDefaults() {
                this._baseVehicle = !1,
                this._tempVehicleType = null,
                this._tempVehicle = !1,
                this._tempVehicleTicks = 0,
                this._temp_vehicle_options = null,
                this._addCheckpoint = !1,
                this._checkpoints = [],
                this._checkpointsCache = [],
                this._crashed = !1,
                this._effect = !1,
                this._effectTicks = 0,
                this._opacity = 1,
                this.complete = !1,
                this._powerupsConsumed = {
                    checkpoints: [],
                    targets: [],
                    misc: []
                }
            }
            hasCheckpoints() {
                return this._checkpoints.length > 0
            }
            setColor(t) {
                this._color = t
            }
            dead() {
                if (this._crashed = !0,
                this._ghost === !1) {
                    var t = this._scene
                      , e = t.settings
                      , i = t.message;
                    t.state.playerAlive = this.isAlive(),
                    this._checkpoints.length > 0 ? e.mobile ? i.show("Tap to go to checkpoint!", !1, "#000000", "#FFFFFF") : i.show("Press Enter For Checkpoint", !1, "#000000", "#FFFFFF") : e.mobile ? i.show("Tap to Restart!", !1, "#000000", "#FFFFFF") : i.show("Press Enter To Restart", !1, "#000000", "#FFFFFF")
                }
            }
            setAsGhost() {
                this._ghost = !0
            }
            isGhost() {
                return this._ghost
            }
            isAlive() {
                return !this._crashed
            }
            getTargetsHit() {
                return this._powerupsConsumed.targets.length
            }
            getGamepad() {
                return this._gamepad
            }
            setBaseVehicle(t) {
                this._baseVehicleType = t,
                this.reset()
            }
            createBaseVehicle(t, e, i) {
                this._tempVehicle && this._tempVehicle.stopSounds(),
                this._baseVehicle = new v[this._baseVehicleType](this,t,e,i),
                this._tempVehicle = !1,
                this._tempVehicleType = !1,
                this._tempVehicleTicks = 0
            }
            setTempVehicle(t, e, i, s) {
                this._temp_vehicle_options && this._temp_vehicle_options.type === t && (e = this._temp_vehicle_options.ticks + e),
                this._temp_vehicle_options = {
                    type: t,
                    ticks: e,
                    position: i,
                    direction: s
                }
            }
            createTempVehicle(t, e, i, s) {
                if (this._temp_vehicle_options) {
                    var n = this._temp_vehicle_options;
                    t = n.type,
                    e = n.ticks,
                    i = n.position,
                    s = n.direction,
                    this._temp_vehicle_options = null
                }
                this._tempVehicleType === t ? this._tempVehicleTicks += e : (this.getActiveVehicle().stopSounds(),
                this._effect = new Explosion(i,this._scene),
                this._effectTicks = 45,
                this._tempVehicleType = t,
                this._tempVehicle = new v[t](this,i,s),
                this._tempVehicleTicks = e)
            }
            update() {
                if (this.complete === !1) {
                    var t = this._baseVehicle;
                    this._temp_vehicle_options && this.createTempVehicle(),
                    this._tempVehicleTicks > 0 && (t = this._tempVehicle,
                    this._crashed === !1 && this._tempVehicleTicks--,
                    this._tempVehicleTicks <= 0 && this._crashed === !1 && (this._effectTicks = 45,
                    this._effect = new Explosion(this._tempVehicle.focalPoint.pos,this._scene),
                    this.createBaseVehicle(this._tempVehicle.focalPoint.pos, this._tempVehicle.dir, this._tempVehicle.masses[0].vel),
                    t = this._baseVehicle)),
                    this._effectTicks > 0 && (this._effectTicks--,
                    this._effect.update()),
                    t.update(),
                    this._addCheckpoint && (this._createCheckpoint(),
                    this._addCheckpoint = !1)
                }
            }
            isInFocus() {
                var t = this._scene.camera
                  , e = !1;
                return t.playerFocus && t.playerFocus === this && (e = !0),
                e
            }
            updateOpacity() {
                var t = 1
                  , e = this._scene.camera;
                if (e.playerFocus && e.playerFocus !== this) {
                    var i = this.getDistanceBetweenPlayers(e.playerFocus);
                    1200 > i && (t = min(i / 500, 1))
                }
                this._opacity = t
            }
            drawName() {
                var t = this._scene
                  , e = this._color
                  , i = this._user.d_name
                  , s = t.game
                  , n = t.camera.zoom
                  , r = s.pixelRatio
                  , o = s.canvas
                  , a = o.getContext("2d")
                  , h = this._opacity
                  , l = this.getActiveVehicle()
                  , c = l.focalPoint.pos.toScreen(t);
                a.globalAlpha = h,
                a.beginPath(),
                a.fillStyle = e,
                a.moveTo(c.x, c.y - 40 * n),
                a.lineTo(c.x - 5 * n, c.y - 50 * n),
                a.lineTo(c.x + 5 * n, c.y - 50 * n),
                a.lineTo(c.x, c.y - 40 * n),
                a.fill();
                var u = 9 * r * max(n, 1);
                a.font = u + "pt helsinki",
                a.textAlign = "center",
                a.fillStyle = e,
                a.fillText(i, c.x, c.y - 60 * n),
                a.globalAlpha = 1
            }
            draw() {
                this.updateOpacity();
                var t = this._baseVehicle;
                this._tempVehicleTicks > 0 && (t = this._tempVehicle),
                this._effectTicks > 0 && this._effect.draw(this._effectTicks / 100),
                t.draw(),
                window.lite.getVar("frce") && this._scene.ticks > 0 && this._scene.state.playing == !1 && t.clone(),
                this.isGhost() && this.drawName()
            }
            checkKeys() {
                var t = this._gamepad
                  , e = this._ghost
                  , i = this._scene;
                if (!t.isButtonDown("enter") && !t.isButtonDown("backspace") && t.areKeysDown()) {
                    if(this._checkpointsCache.length > 0) {
                        this._checkpointsCache = [];
                    }
                }
                if (t.isButtonDown("enter")) {
                    var s = t.getButtonDownOccurances("enter");
                    this.returnToCheckpoint(s),
                    t.setButtonUp("enter")
                }
                if (e === !1 && (t.areKeysDown() && !this._crashed && i.play(),
                t.isButtonDown("restart") && (i.restartTrack = !0,
                t.setButtonUp("restart")),
                (t.isButtonDown("up") || t.isButtonDown("down") || t.isButtonDown("left") || t.isButtonDown("right")) && i.camera.focusOnMainPlayer()),
                t.isButtonDown("enter") && (this.gotoCheckpoint(),
                t.setButtonUp("enter")),
                t.isButtonDown("backspace")) {
                    var s = t.getButtonDownOccurances("backspace");
                    this.removeCheckpoint(s),
                    t.setButtonUp("backspace")
                }
            }
            getDistanceBetweenPlayers(t) {
                var e = t.getActiveVehicle()
                  , i = this.getActiveVehicle()
                  , s = e.focalPoint.pos.x - i.focalPoint.pos.x
                  , n = e.focalPoint.pos.y - i.focalPoint.pos.y;
                return sqrt(pow(s, 2) + pow(n, 2))
            }
            getActiveVehicle() {
                var t = this._baseVehicle;
                return this._tempVehicleTicks > 0 && (t = this._tempVehicle),
                t
            }
            _createCheckpoint() {
                var t = {};
                this._tempVehicleTicks > 0 ? (t._tempVehicleType = this._tempVehicleType,
                t._tempVehicle = JSON.stringify(this._tempVehicle, this._snapshotFilter),
                t._tempVehicleTicks = this._tempVehicleTicks) : (t._baseVehicleType = this._baseVehicleType,
                t._baseVehicle = JSON.stringify(this._baseVehicle, this._snapshotFilter)),
                t._powerupsConsumed = JSON.stringify(this._powerupsConsumed),
                t._crashed = this._crashed,
                this._checkpoints.push(t)
            }
            _snapshotFilter(t, e) {
                switch (t) {
                case "parent":
                case "player":
                case "scene":
                case "settings":
                case "masses":
                case "springs":
                case "focalPoint":
                case "gamepad":
                    return void 0;
                case "explosion":
                    return !1;
                default:
                    return e
                }
            }
            setCheckpointOnUpdate() {
                this._addCheckpoint = !0
            }
            crashed() {
                this._crashed = !0
            }
            gotoCheckpoint() {
                var t = this._gamepad
                  , e = t.replaying
                  , i = this._scene;
                if (this._checkpoints.length > 0) {
                    var s = this._checkpoints[this._checkpoints.length - 1];
                    if (s._tempVehicle) {
                        this._baseVehicle.stopSounds();
                        var n = this._tempVehicle;
                        this._tempVehicleType !== s._tempVehicleType && (n = new v[s._tempVehicleType](this,{
                            x: 0,
                            y: 0
                        }));
                        var r = JSON.parse(s._tempVehicle);
                        m(n, r),
                        this._tempVehicle = n,
                        this._tempVehicleType = s._tempVehicleType,
                        this._tempVehicleTicks = s._tempVehicleTicks,
                        n.updateCameraFocalPoint()
                    } else {
                        var n = this._baseVehicle
                          , r = JSON.parse(s._baseVehicle);
                        m(n, r),
                        this._tempVehicle && this._tempVehicle.stopSounds(),
                        this._baseVehicle = n,
                        this._tempVehicleTicks = 0,
                        this._tempVehicleType = !1,
                        n.updateCameraFocalPoint()
                    }
                    if (this._powerupsConsumed = JSON.parse(s._powerupsConsumed),
                    this._crashed = s._crashed,
                    e === !1) {
                        var o = i.settings;
                        i.state.playerAlive = this.isAlive(),
                        i.settings.mobile ? i.message.show("Tap to resume", 5, "#826cdc", "#FFFFFF") : i.message.show("Press Backspace To Go Back Further", 5, "#826cdc", "#FFFFFF"),
                        i.track.updatePowerupState(this),
                        o.waitAtCheckpoints && (i.state.playing = !1),
                        i.camera.focusOnMainPlayer()
                    }
                    i.camera.playerFocus === this && i.camera.fastforward()
                } else
                    e === !1 && this.restartScene()
            }
            restartScene() {
                var t = this._gamepad
                  , e = t.replaying;
                this._checkpointsCache = [];
                e === !1 && (this._scene.restartTrack = !0)
            }
            removeCheckpoint(t) {
                if (this._checkpoints.length > 1) {
                    for (var e = 0; t > e; e++)
                        this._checkpointsCache.push(this._checkpoints.pop());
                    this.gotoCheckpoint()
                } else
                    this.restartScene()
            }
            returnToCheckpoint(t) {
                if (this._checkpointsCache.length > 0) {
                    for (var e = 0; t > e; e++)
                        this._checkpoints.push(this._checkpointsCache.pop());
                    this.gotoCheckpoint()
                }
            }
            close() {
                this.id = null,
                this._scene = null,
                this._game = null,
                this._user = null,
                this._settings = null,
                this._baseVehicleType = null,
                this._gamepad.close(),
                this._gamepad = null,
                this._baseVehicle = null,
                this._tempVehicleType = null,
                this._tempVehicle = null,
                this._tempVehicleTicks = null,
                this._addCheckpoint = null,
                this._checkpoints = null,
                this._checkpointsCache = null,
                this._crashed = null,
                this._effect = null,
                this._effectTicks = null,
                this._powerupsConsumed = null
            }
            reset() {
                this._tempVehicle && this._tempVehicle.stopSounds(),
                this._baseVehicle.stopSounds(),
                this.setDefaults(),
                this.createBaseVehicle(new Vector(0,35), 1, new Vector(0,0)),
                this._gamepad.reset(),
                this._scene.state.playerAlive = this.isAlive()
            }
        }
        e.exports = Player;
    },
    80: function(t, e) {
        var Player = t(79);
        class PlayerManager {
            constructor(a) {
                this.scene = a,
                this.game = a.game,
                this.settings = a.settings,
                this.firstPlayer = null,
                this._players = [],
                this._playerLookup = {}
            }
            update() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].update()
            }
            mutePlayers() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++) {
                    var s = t[i].getActiveVehicle();
                    s.stopSounds()
                }
            }
            updateGamepads() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i]._gamepad.update()
            }
            createPlayer(t, e) {
                return new Player(this.scene,e)
            }
            addPlayer(t) {
                this._players.push(t),
                this._playerLookup[t.id] = t
            }
            checkKeys() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].checkKeys()
            }
            draw() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].draw()
            }
            getPlayerByIndex(t) {
                return this._players[t]
            }
            getPlayerById(t) {
                return this._playerLookup[t]
            }
            getPlayerCount() {
                return this._players.length
            }
            reset() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].reset()
            }
            clear() {
                this._players = [],
                this._playerLookup = {},
                this._players.push(this.firstPlayer),
                this._playerLookup[this.firstPlayer.id] = this.firstPlayer
            }
            _closePlayers() {
                for (var t = this._players, e = t.length, i = 0; e > i; i++)
                    t[i].close()
            }
            close() {
                this._closePlayers(),
                this._players = null,
                this.firstPlayer = null,
                this._playerLookup = null,
                this.scene = null,
                this.game = null,
                this.settings = null
            }
        }
        e.exports = PlayerManager;
    },
    81: function(t, e) {
        var Vector = t(14)
          , Mass = t(77);
        class Prop extends Mass {
            constructor(a, b) {
                super();
                this.init(a, b),
                this.motor = 0,
                this.angle = new Vector(0,0),
                this.radius = 10,
                this.speed = 0
            }
            motor = 0;
            angle = 0;
            speed = 0;
            update() {
                var t = this.vel
                , e = this.angle
                , i = this.pos
                , s = this.old
                , n = this.motor;
                t.y += 0,
                t.inc(e.factor(2 * n)),
                t = t.factor(.99),
                i.inc(t),
                this.contact = !1,
                this.collide && this.scene.track.collide(this),
                this.vel = i.sub(s),
                s.equ(i)
            }
        }
        e.exports = Prop
    },
    82: function(t, e) {
        var Vector = t(14)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85);
        class Ragdoll extends Vehicle {
            constructor(t, e) {
                super();
                this.parent = e;
                var i, o, a, h, l, c, u, p, d, f, v = [], g = [], m = new Vector(0,0);
                i = new Mass,
                o = new Mass,
                a = new Mass,
                h = new Mass,
                c = new Mass,
                l = new Mass,
                u = new Mass,
                p = new Mass,
                d = new Mass,
                f = new Mass,
                i.init(m, e),
                o.init(m, e),
                a.init(m, e),
                h.init(m, e),
                c.init(m, e),
                l.init(m, e),
                u.init(m, e),
                p.init(m, e),
                d.init(m, e),
                f.init(m, e),
                v.push(i),
                v.push(o),
                v.push(a),
                v.push(h),
                v.push(c),
                v.push(l),
                v.push(u),
                v.push(p),
                v.push(d),
                v.push(f),
                g.push(new Spring(i,o,this)),
                g.push(new Spring(i,a,this)),
                g.push(new Spring(a,c,this)),
                g.push(new Spring(i,h,this)),
                g.push(new Spring(h,l,this)),
                g.push(new Spring(o,u,this)),
                g.push(new Spring(u,d,this)),
                g.push(new Spring(o,p,this)),
                g.push(new Spring(p,f,this));
                for (var y in v)
                    v[y].radius = 3;
                for (var y in v)
                    v[y].friction = .05;
                i.radius = o.radius = 8;
                for (var y in g)
                    g[y].springConstant = .4;
                for (var y in g)
                    g[y].dampConstant = .7;
                this.masses = v,
                this.springs = g,
                this.head = i,
                this.waist = o,
                this.lElbow = a,
                this.rElbow = h,
                this.rHand = l,
                this.lHand = c,
                this.lKnee = u,
                this.rKnee = p,
                this.lFoot = d,
                this.rFoot = f;
                for (var y in t)
                    this[y].pos.equ(t[y])
            }
            init = this.initialize;
            parent = null;
            zero(t, e) {
                t = t.factor(.7),
                e = e.factor(.7);
                var i = this.springs
                  , s = this.masses;
                for (var n in i) {
                    var r = i[n].m2.pos.sub(i[n].m1.pos).len();
                    i[n].lrest = r,
                    i[n].leff = r
                }
                for (var n = 1; 4 >= n; n++)
                    i[n].lrest = 13,
                    i[n].leff = 13;
                for (var n in i)
                    i[n].leff > 20 && (i[n].lrest = 20,
                    i[n].leff = 20);
                var o = [this.head, this.lElbow, this.rElbow, this.lHand, this.rHand]
                  , a = [this.waist, this.lKnee, this.rKnee, this.lFoot, this.rFoot];
                for (var n in o)
                    o[n].old = o[n].pos.sub(t);
                for (var n in a)
                    a[n].old = a[n].pos.sub(e);
                for (var n in s)
                    s[n].vel.equ(s[n].pos.sub(s[n].old)),
                    s[n].vel.x += 1 * (random() - random()),
                    s[n].vel.y += 1 * (random() - random())
            }
            draw() {
                var t = this.head
                  , e = this.waist
                  , i = this.lElbow
                  , s = this.rElbow
                  , n = this.rHand
                  , r = this.lHand
                  , o = this.lKnee
                  , a = this.rKnee
                  , h = this.lFoot
                  , l = this.rFoot
                  , c = this.parent.scene
                  , u = c.camera
                  , p = u.zoom
                  , d = c.game.canvas.getContext("2d")
                  , f = this.parent.alpha;
                d.strokeStyle = "rgba(0,0,0," + f + ")",
                d.lineWidth = 5 * p,
                d.lineCap = "round",
                d.lineJoin = "round";
                var v = t.pos.toScreen(c);
                d.beginPath(),
                d.moveTo(v.x, v.y);
                var g = i.pos.toScreen(c);
                d.lineTo(g.x, g.y);
                var m = r.pos.toScreen(c);
                d.lineTo(m.x, m.y),
                d.stroke(),
                d.strokeStyle = "rgba(0,0,0," + .5 * f + ")",
                d.beginPath(),
                d.moveTo(v.x, v.y);
                var y = s.pos.toScreen(c);
                d.lineTo(y.x, y.y);
                var w = n.pos.toScreen(c);
                d.lineTo(w.x, w.y),
                d.stroke(),
                d.strokeStyle = "rgba(0,0,0," + f + ")",
                d.lineWidth = 8 * p,
                d.beginPath(),
                d.moveTo(v.x, v.y);
                var x = e.pos.toScreen(c);
                d.lineTo(x.x, x.y),
                d.stroke(),
                d.lineWidth = 5 * p,
                d.beginPath(),
                d.moveTo(x.x, x.y);
                var _ = o.pos.toScreen(c);
                d.lineTo(_.x, _.y);
                var b = h.pos.toScreen(c);
                d.lineTo(b.x, b.y);
                var T = o.pos.sub(e.pos).normalize();
                T = T.factor(4).add(h.pos);
                var C = T.toScreen(c);
                d.lineTo(C.x, C.y),
                d.stroke(),
                d.strokeStyle = "rgba(0,0,0," + .5 * f + ")",
                d.lineWidth = 5 * p,
                d.beginPath(),
                d.moveTo(x.x, x.y);
                var k = a.pos.toScreen(c);
                d.lineTo(k.x, k.y);
                var S = a.pos.sub(e.pos).normalize();
                S = S.factor(4).add(l.pos);
                var P = l.pos.toScreen(c);
                d.lineTo(P.x, P.y);
                var M = S.toScreen(c);
                d.lineTo(M.x, M.y),
                d.stroke(),
                v.inc(v.sub(x).factor(.25));
                if(window.lite.getVar("frce")) {
                    let t = v.sub(x)
                      , e = new Vector(t.y,-t.x)
                      , i = v.add(e.factor(.15 * this.dir)).add(t.factor(-.05))
                      , s = v.add(e.factor(-.35 * this.dir)).add(t.factor(.15));
                    d.beginPath(),
                    d.arc(v.x, v.y, 5 * p, 0, 2 * PI, !1),
                    d.moveTo(i.x, i.y),
                    d.lineTo(s.x, s.y),
                    d.lineWidth = 2 * p,
                    d.strokeStyle = "#000000",
                    d.stroke()
                } else {
                    var D = GameInventoryManager.getItem(this.parent.cosmetics.head)
                    , I = this.drawHeadAngle;
                    D.draw(d, v.x, v.y, I, p, this.dir, 1)
                }
            }
            update(){
                for (var t = this.springs.length - 1; t >= 0; t--)
                    this.springs[t].update();
                for (var e = this.masses.length - 1; e >= 0; e--)
                    this.masses[e].update();
                this.updateDrawHeadAngle()
            }
            updateDrawHeadAngle() {
                var t, e;
                this.dir < 0 ? (e = this.head.pos,
                t = this.waist.pos) : (t = this.head.pos,
                e = this.waist.pos);
                var i = t.x
                  , s = t.y
                  , n = e.x
                  , r = e.y
                  , o = i - n
                  , h = s - r;
                this.drawHeadAngle = -(atan2(o, h) + PI)
            }
        }
        e.exports = Ragdoll
    },
    83: function(t, e) {
        var Vector = t(14);
        class Spring {
            constructor(a, b, c) {
                this.m1 = a,
                this.m2 = b,
                this.parent = c,
                this.lrest = 40,
                this.leff = 40,
                this.dampConstant = .5,
                this.springConstant = .7
            }
            m1 = null;
            m2 = null;
            parent = null;
            lrest = 40;
            leff = 40;
            dampConstant = 0;
            springConstant = 0;
            swap() {
                var t = new Vector
                  , e = this.m1
                  , s = this.m2;
                t.equ(e.pos),
                e.pos.equ(s.pos),
                s.pos.equ(t),
                t.equ(e.old),
                e.old.equ(s.old),
                s.old.equ(t),
                t.equ(e.vel),
                e.vel.equ(s.vel),
                s.vel.equ(t);
                var n = e.angle;
                e.angle = s.angle,
                s.angle = n
            }
            update() {
                var t = new Vector(0,0)
                  , e = this.m1
                  , s = this.m2
                  , n = e.pos
                  , r = s.pos
                  , o = e.vel
                  , a = s.vel;
                t.x = r.x - n.x,
                t.y = r.y - n.y;
                var h = t.len();
                if (!(1 > h)) {
                    var l = 1 / h;
                    t.x *= l,
                    t.y *= l;
                    var c = (h - this.leff) * this.springConstant
                      , u = {
                        x: t.x * c,
                        y: t.y * c
                    }
                      , p = a.x - o.x
                      , d = a.y - o.y
                      , f = p * t.x + d * t.y
                      , v = f * this.dampConstant
                      , g = t.x * v
                      , m = t.y * v;
                    u.x += g,
                    u.y += m,
                    a.x += -u.x,
                    a.y += -u.y,
                    o.x += u.x,
                    o.y += u.y
                }
            }
            rotate(t) {
                var e = this.m1
                  , i = this.m2
                  , s = i.pos.x - e.pos.x
                  , n = i.pos.y - e.pos.y
                  , r = -n / this.leff
                  , o = s / this.leff;
                e.pos.x += r * t,
                e.pos.y += o * t,
                i.pos.x += r * -t,
                i.pos.y += o * -t
            }
            contract(t, e) {
                this.leff += (this.lrest - t - this.leff) / e
            }
            setMasses(t, e) {
                this.m1 = t,
                this.m2 = e
            }
        }
        e.exports = Spring
    },
    84: function(t, e) {
        var Vector = t(14)
          , Mass = t(77)
          , Spring = t(83)
          , Vehicle = t(85)
          , Wheel = t(86)
          , d = {
                TRUCK_GROUND: "truck_idle"
            };
        class Truck extends Vehicle {
            constructor(a, b, c) {
                super();
                this.vehicleInit(a),
                this.createMasses(b),
                this.createSprings(),
                this.stopSounds(),
                this.updateCameraFocalPoint(),
                -1 === c && this.swap()
            }
            vehicleName = "TRUCK";
            vehicleInit = this.init;
            vehicleUpdate = this.update;
            vehicleControl = this.control;
            vehicleDraw = this.draw;
            masses = null;
            springs = null;
            cosmetics = null;
            slow = !1;
            pedala = 0;
            swapped = !1;
            crashed = !1;
            createMasses(t) {
                this.masses = [],
                this.masses.push(new Mass),
                this.masses.push(new Mass),
                this.masses[0].init(new Vector(t.x - 15,t.y + 7), this),
                this.masses[1].init(new Vector(t.x + 15,t.y + 7), this),
                this.masses[0].friction = .1,
                this.masses[1].friction = .1,
                this.masses.push(new Wheel(new Vector(t.x - 20,t.y + 35),this)),
                this.masses.push(new Wheel(new Vector(t.x + 20,t.y + 35),this)),
                this.masses[2].radius = this.masses[3].radius = 14,
                this.masses[0].radius = this.masses[1].radius = 7,
                this.head = this.masses[0],
                this.backMass = this.masses[1],
                this.rearWheel = this.masses[2],
                this.frontWheel = this.masses[3]
            }
            createSprings() {
                this.springs = [];
                var t = this.masses;
                this.springs.push(new Spring(t[0],t[1],this)),
                this.springs.push(new Spring(t[0],t[2],this)),
                this.springs.push(new Spring(t[1],t[3],this)),
                this.springs.push(new Spring(t[0],t[3],this)),
                this.springs.push(new Spring(t[1],t[2],this)),
                this.springs.push(new Spring(t[2],t[3],this)),
                this.springs[0].leff = this.springs[0].lrest = 30,
                this.springs[1].leff = this.springs[1].lrest = 30,
                this.springs[2].leff = this.springs[2].lrest = 30,
                this.springs[3].leff = this.springs[3].lrest = 45,
                this.springs[4].leff = this.springs[4].lrest = 45;
                for (var e in this.springs)
                    this.springs[e].springConstant = .3
            }
            updateCameraFocalPoint() {}
            update() {
                if (this.crashed === !1 && (this.updateSound(),
                this.control()),
                this.explosion)
                    this.explosion.update();
                else {
                    for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                        t[i].update();
                    for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                        s[r].update();
                    if (this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1),
                    this.slow === !1) {
                        this.crashed === !1 && this.control();
                        for (var i = e - 1; i >= 0; i--)
                            t[i].update();
                        for (var r = n - 1; r >= 0; r--)
                            s[r].update()
                    }
                    this.updateDrawHeadAngle(),
                    this.updateCameraFocalPoint()
                }
            }
            updateSound() {
                if (this.player.isInFocus()) {
                    var t = this.scene.sound;
                    if (this.rearWheel.contact) {
                        var e = min(this.rearWheel.motor, 1);
                        t.play(d.TRUCK_GROUND, e)
                    } else if (this.frontWheel.contact) {
                        var e = min(this.frontWheel.motor, 1);
                        t.play(d.TRUCK_GROUND, e)
                    } else
                        t.stop(d.TRUCK_GROUND)
                }
            }
            updateCameraFocalPoint() {
                this.focalPoint = 1 === this.dir ? this.head : this.backMass
            }
            stopSounds() {
                var t = this.scene.sound;
                t.stop(d.TRUCK_GROUND)
            }
            updateDrawHeadAngle() {
                var t = this.frontWheel.pos
                , e = this.rearWheel.pos
                , i = t.x
                , s = t.y
                , n = e.x
                , r = e.y
                , o = i - n
                , a = s - r;
                this.drawHeadAngle = -(atan2(o, a) - PI / 2)
            }
            swap() {
                this.dir = -1 * this.dir,
                this.springs[0].swap(),
                this.springs[5].swap()
            }
            control() {
                var t = this.gamepad
                , e = t.isButtonDown("up")
                , i = t.isButtonDown("down")
                , s = t.isButtonDown("left")
                , n = t.isButtonDown("right")
                , r = t.isButtonDown("z");
                r && !this.swapped && (this.swap(),
                this.swapped = !0),
                r || (this.swapped = !1);
                var o = e ? 1 : 0
                , a = this.rearWheel
                , h = this.frontWheel;
                a.motor += (.8 * o - a.motor) / 10,
                h.motor += (.8 * o - h.motor) / 10,
                a.brake = i,
                h.brake = i;
                var l = s ? 1 : 0;
                l += n ? -1 : 0;
                var c = this.springs;
                c[0].rotate(l / 8),
                c[5].rotate(l / 8)
            }
            draw() {
                if (this.explosion)
                    this.explosion.draw(1);
                else {
                    var t = this.scene.game.canvas.getContext("2d");
                    if (t.imageSmoothingEnabled = !0,
                    t.mozImageSmoothingEnabled = !0,
                    t.oImageSmoothingEnabled = !0,
                    t.webkitImageSmoothingEnabled = !0,
                    this.settings.developerMode)
                        for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                            e[s].draw();
                    t.globalAlpha = this.player._opacity,
                    this.drawTruck(t),
                    t.globalAlpha = 1
                }
            }
            drawTruck(t) {
                var e = this.scene
                , i = e.camera.zoom
                , s = this.cosmetics
                , n = GameInventoryManager.getItem(s.head)
                , r = this.drawHeadAngle
                , o = this.dir
                , a = this.frontWheel.pos.toScreen(e)
                , h = this.rearWheel.pos.toScreen(e)
                , l = this.head.pos.toScreen(e)
                , c = this.backMass.pos.toScreen(e)
                , d = (this.masses[1].pos.x - this.masses[0].pos.x) * i
                , f = (this.masses[1].pos.y - this.masses[0].pos.y) * i
                , v = (.5 * (this.masses[0].pos.x + this.masses[1].pos.x) - .5 * (this.masses[2].pos.x + this.masses[3].pos.x)) * i
                , g = (.5 * (this.masses[0].pos.y + this.masses[1].pos.y) - .5 * (this.masses[2].pos.y + this.masses[3].pos.y)) * i;
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.lineWidth = 3 * i,
                t.lineCap = "round",
                t.lineJoin = "round";
                var m = c.x - l.x
                , y = c.y - l.y
                , w = sqrt(pow(m, 2) + pow(y, 2))
                , x = m / w
                , _ = y / w;
                n.draw(t, c.x - .5 * x * i * 20, c.y - _ * i * 20 * .5, r, .45 * i, o);
                t.strokeStyle = window.lite.getVar("dark") ? "#bbbbbb" : "#444444",
                t.beginPath(),
                t.moveTo(l.x - .4 * d - .9 * v, l.y - .4 * f - .9 * g),
                t.lineTo(l.x + .8 * d - .9 * v, l.y + .8 * f - .9 * g),
                t.stroke(),
                t.closePath(),
                t.save(),
                t.fillStyle = window.lite.getVar("dark") ? "#888888" : "#777777",
                t.beginPath(),
                t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
                t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
                t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
                t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
                t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
                t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
                t.closePath(),
                t.fill(),
                t.save(),
                t.lineWidth = 2 * i,
                t.strokeStyle = window.lite.getVar("dark") ? "#bbbbbb" : "#444444",
                t.beginPath(),
                t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
                t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
                t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
                t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
                t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
                t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
                t.closePath(),
                t.stroke(),
                t.strokeStyle = window.lite.getVar("dark") ? "#bbbbbb" : "#444444",
                t.lineWidth = i,
                t.beginPath(),
                t.moveTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
                t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
                t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
                t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
                t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
                t.closePath(),
                t.stroke(),
                t.beginPath(),
                this.tire(t, h.x, h.y, 10 * i, i, this.rearWheel.angle),
                t.closePath(),
                t.beginPath(),
                this.tire(t, a.x, a.y, 10 * i, i, this.frontWheel.angle),
                t.closePath(),
                t.restore()
            }
            tire(t, e, i, s, n, r) {
                var a;
                for (t.beginPath(),
                t.arc(e, i, 10 * n, 0, 2 * PI, !1),
                t.fillStyle = "#888888",
                t.fill(),
                t.lineWidth = 5.9 * n,
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
                t.closePath(),
                t.stroke(),
                t.beginPath(),
                t.lineWidth = 2 * n,
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "0x000000",
                a = 0,
                s += 3 * n; a++ < 8; )
                    t.moveTo(e + s * cos(r + 6.283 * a / 8), i + s * sin(r + 6.283 * a / 8)),
                    t.lineTo(e + s * cos(r + 6.283 * (a + .5) / 8), i + s * sin(r + 6.283 * (a + .5) / 8));
                for (t.stroke(),
                t.closePath(),
                t.beginPath(),
                t.lineWidth = 2 * n,
                t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "0x000000",
                a = 0,
                s += -9 * n; a++ < 5; )
                    t.moveTo(e + s * cos(r + 6.283 * a / 5), i + s * sin(r + 6.283 * a / 5)),
                    t.lineTo(e + s * cos(r + 6.283 * (a + .2) / 5), i + s * sin(r + 6.283 * (a + .2) / 5));
                t.closePath(),
                t.stroke()
            }
        }
        e.exports = Truck;
    },
    85: function(t, e) {
        var Vector = t(14)
          , Explosion = t(75);
        class Vehicle {
            init(t) {
                this.player = t,
                this.scene = t._scene,
                this.gamepad = t._gamepad,
                this.settings = t._settings,
                this.gravity = new Vector(0,.3),
                this.complete = !1,
                this.alive = !0,
                this.crashed = !1,
                this.dir = 1,
                this.ghost = !1,
                this.ragdoll = !1,
                this.explosion = !1,
                this.speed = 0,
                this.powerupsEnabled = !0,
                this.createCosmetics()
            }
            explode() {
                this.scene.sound.play("bomb_sound", 1),
                this.explosion = new Explosion(this.masses[0].pos,this.scene),
                this.dead()
            }
            createCosmetics() {
                var t = this.player._user
                  , e = t.cosmetics;
                this.cosmetics = e
            }
            updateSpeed() {
                this.speed = abs(round(this.focalPoint.vel.x + this.focalPoint.vel.y))
            }
            close() {
                this.scene = null,
                this.settings = null,
                this.gravity = null,
                this.speed = null,
                this.cosmetics = null,
                this.explosion = null,
                this.ragdoll = null,
                this.ghost = null,
                this.crashed = null,
                this.alive = null,
                this.gamepad = null
            }
            dead() {
                this.stopSounds(),
                this.player.dead(),
                this.crashed = !0,
                this.alive = !1
            }
            moveVehicle(t, e) {
                for (var i = this.masses, s = i.length, n = s - 1; n >= 0; n--)
                    i[n].pos.x = i[n].pos.x + t,
                    i[n].pos.y = i[n].pos.y + e,
                    i[n].old.x = i[n].old.x + t,
                    i[n].old.y = i[n].old.y + e
            }
            stopSounds() {}
        }
        e.exports = Vehicle;
    },
    86: function(t, e) {
        var Mass = t(77);
        class Wheel extends Mass {
            constructor(a, b) {
                super();
                this.init(a, b),
                this.motor = 0,
                this.brake = !1,
                this.angle = 0,
                this.speed = 0,
                this.rotationSpeed = 0
            }
            motor = 0;
            brake = !1;
            angle = 0;
            speed = 0;
            drive(t, e) {
                var i = this.pos
                , s = this.motor * this.parent.dir
                , n = s * t
                , r = s * e;
                if (i.x += n,
                i.y += r,
                this.brake) {
                    var o = .3 * -(t * this.vel.x + e * this.vel.y)
                    , a = t * o
                    , h = e * o;
                    i.x += a,
                    i.y += h
                }
                this.speed = (t * this.vel.x + e * this.vel.y) / this.radius,
                this.rotationSpeed = this.speed,
                this.angle += this.speed,
                this.contact = !0
            }
            massUpdate = this.update;
            update() {
                var t = this.parent.gravity
                , e = this.pos
                , i = this.old
                , s = this.vel;
                s.x += t.x,
                s.y += t.y,
                (0 != t.x || 0 != t.y) && (s.x = .99 * s.x,
                s.y = .99 * s.y),
                e.x += s.x,
                e.y += s.y,
                this.contact = !1,
                this.collide && this.scene.track.collide(this),
                s.x = e.x - i.x,
                s.y = e.y - i.y,
                this.old.equ(this.pos),
                this.rotationSpeed = .999 * this.rotationSpeed
            }
        }
        e.exports = Wheel
    },
    87: function(t, e) {
        var Vector = t(14);
        class Camera {
            constructor(a) {
                var e = a.settings;
                this.settings = e,
                this.scene = a,
                this.zoom = e.cameraStartZoom * a.game.pixelRatio,
                this.desiredZoom = e.cameraStartZoom * a.game.pixelRatio,
                this.zooming = !1,
                this.position = new Vector(0,0),
                this.zoomPercentage = this.getZoomAsPercentage(),
                this.zoomPoint = !1
            }
            settings = null;
            scene = null;
            zoom = 1;
            position = null;
            desiredZoom = 1;
            zoomPercentage = 0;
            focusIndex = 0;
            playerFocus = null;
            focusOnNextPlayer() {
                var t = this.scene.playerManager.getPlayerCount();
                this.focusIndex = (this.focusIndex + 1) % t,
                this.focusOnPlayer()
            }
            focusOnPlayer() {
                var t = this.scene
                  , e = t.playerManager
                  , i = e.getPlayerCount();
                i <= this.focusIndex && (this.focusIndex = 0);
                var s = e.getPlayerByIndex(this.focusIndex);
                if (this.playerFocus !== s) {
                    var n = this.playerFocus;
                    if (this.playerFocus = s,
                    t.vehicleTimer.setPlayer(s),
                    n) {
                        var r = s.getDistanceBetweenPlayers(n);
                        r > 1500 && this.fastforward()
                    } else
                        this.fastforward()
                }
            }
            focusOnMainPlayer() {
                0 === this.focusIndex && this.playerFocus || (this.focusIndex = 0,
                this.focusOnPlayer())
            }
            update() {
                if (this.playerFocus) {
                    var t = this.playerFocus.getActiveVehicle()
                      , e = t.focalPoint
                      , i = this.position
                      , s = 3
                      , n = e.pos.x - i.x
                      , r = e.pos.y - i.y
                      , h = sqrt(pow(n, 2) + pow(r, 2));
                    h > 1500 && (s = 1),
                    i.x += (e.pos.x - i.x) / s,
                    i.y += (e.pos.y - i.y) / s
                }
            }
            updateZoom() {
                var t = this.zoom
                  , e = this.desiredZoom;
                t !== e && (this.scene.loading = !0,
                this._performZoom(),
                this.zoom === this.desiredZoom && this.zoomComplete())
            }
            zoomToPoint(t) {
                var e = this.scene
                  , i = e.screen
                  , s = this.position
                  , n = this.zoomPoint
                  , r = i.toReal(n.x, "x")
                  , o = i.toReal(n.y, "y")
                  , a = n.x / i.width
                  , h = n.y / i.height
                  , l = i.width / t
                  , c = i.height / t;
                s.x = r - l * a + l / 2,
                s.y = o - c * h + c / 2
            }
            _performZoom() {
                var t = this.scene
                  , e = this.zoom
                  , i = this.desiredZoom
                  , s = i - e
                  , n = s / 3;
                e += n,
                abs(s) < .05 && (e = i),
                this.zoomPoint && this.zoomToPoint(e),
                this.zoom = e
            }
            zoomComplete() {
                this.scene.redraw(),
                this.zooming = !1,
                this.scene.loading = !1
            }
            setZoom(t, e) {
                var i = this.scene;
                this.desiredZoom = round(t * i.game.pixelRatio * 10) / 10,
                this.zooming = !0,
                this.desiredZoom === this.zoom && (this.zooming = !1,
                this.scene.state.loading = !1),
                this.zoomPoint = !1,
                null === this.playerFocus && e && (this.zoomPoint = e),
                this.zoomPercentage = this.getZoomAsPercentage(),
                i.stateChanged()
            }
            resetZoom() {
                var t = this.settings.cameraStartZoom;
                this.setZoom(t)
            }
            getZoomAsPercentage() {
                var t = this.scene.settings
                  , e = this.desiredZoom / this.scene.game.pixelRatio / t.cameraStartZoom * 100;
                return 0 | e
            }
            increaseZoom() {
                var t = this.scene.settings
                  , e = t.cameraSensitivity
                  , i = this.desiredZoom + 2 * e
                  , s = this.scene.game.pixelRatio
                  , n = t.cameraZoomMax
                  , r = n * s;
                this.setZoom(i / s),
                this.desiredZoom > r && this.setZoom(n)
            }
            decreaseZoom() {
                var t = this.scene.settings
                  , e = t.cameraSensitivity
                  , i = this.desiredZoom - 2 * e
                  , s = this.scene.game.pixelRatio
                  , n = t.cameraZoomMin
                  , r = n * s;
                this.setZoom(i / s),
                this.desiredZoom < r && this.setZoom(n)
            }
            unfocus() {
                this.playerFocus = null,
                this.scene.vehicleTimer.removePlayer()
            }
            fastforward() {
                if (this.playerFocus) {
                    var t = this.playerFocus.getActiveVehicle()
                      , e = t.focalPoint;
                    this.position.x = e.pos.x,
                    this.position.y = e.pos.y
                }
            }
            close() {
                this.zoom = null,
                this.scene = null,
                this.position = null,
                this.playerFocus = null
            }
        }
        e.exports = Camera
    },
    88: function(t, e) {
        var Vector = t(14);
        class Screen {
            constructor(a) {
                this.scene = a,
                this.game = a.game,
                this.size = new Vector(0,0),
                this.center = new Vector(0,0),
                this.setScreen()
            }
            game = null;
            scene = null;
            size = null;
            center = null;
            width = 0;
            height = 0;
            setScreen() {
                var t = this.game.width
                  , e = this.game.height;
                this.width = t,
                this.height = e,
                this.size.x = t,
                this.size.y = e,
                this.center.x = t / 2,
                this.center.y = e / 2
            }
            update() {
                var t = this.game;
                (t.width !== this.width || t.height !== this.height) && this.setScreen()
            }
            realToScreen(t, e) {
                var i = this.scene
                  , s = i.camera
                  , n = i.screen;
                return (t - s.position[e]) * s.zoom + n.center[e]
            }
            toReal(t, e) {
                var i = this.scene
                  , s = i.camera
                  , n = i.screen;
                return (t - n.center[e]) / s.zoom + s.position[e]
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
        e.exports = Screen
    },
    89: function() {
        this.createjs = this.createjs || {},
        createjs.extend = function(t, e) {
            "use strict";
            function i() {
                this.constructor = t
            }
            return i.prototype = e.prototype,
            t.prototype = new i
        },
        this.createjs = this.createjs || {},
        createjs.promote = function(t, e) {
            "use strict";
            var i = t.prototype
              , s = Object.getPrototypeOf && Object.getPrototypeOf(i) || i.__proto__;
            if (s) {
                i[(e += "_") + "constructor"] = s.constructor;
                for (var n in s)
                    i.hasOwnProperty(n) && "function" == typeof s[n] && (i[e + n] = s[n])
            }
            return t
        },
        this.createjs = this.createjs || {},
        createjs.indexOf = function(t, e) {
            "use strict";
            for (var i = 0, s = t.length; s > i; i++)
                if (e === t[i])
                    return i;
            return -1
        },
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t(t, e, i) {
                this.type = t,
                this.target = null,
                this.currentTarget = null,
                this.eventPhase = 0,
                this.bubbles = !!e,
                this.cancelable = !!i,
                this.timeStamp = (new Date).getTime(),
                this.defaultPrevented = !1,
                this.propagationStopped = !1,
                this.immediatePropagationStopped = !1,
                this.removed = !1
            }
            var e = t.prototype;
            e.preventDefault = function() {
                this.defaultPrevented = this.cancelable && !0
            },
            e.stopPropagation = function() {
                this.propagationStopped = !0
            },
            e.stopImmediatePropagation = function() {
                this.immediatePropagationStopped = this.propagationStopped = !0
            },
            e.remove = function() {
                this.removed = !0
            },
            e.clone = function() {
                return new t(this.type,this.bubbles,this.cancelable)
            },
            e.set = function(t) {
                for (var e in t)
                    this[e] = t[e];
                return this
            },
            e.toString = function() {
                return "[Event (type=" + this.type + ")]"
            },
            createjs.Event = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                this._listeners = null,
                this._captureListeners = null
            }
            var e = t.prototype;
            t.initialize = function(t) {
                t.addEventListener = e.addEventListener,
                t.on = e.on,
                t.removeEventListener = t.off = e.removeEventListener,
                t.removeAllEventListeners = e.removeAllEventListeners,
                t.hasEventListener = e.hasEventListener,
                t.dispatchEvent = e.dispatchEvent,
                t._dispatchEvent = e._dispatchEvent,
                t.willTrigger = e.willTrigger
            },
            e.addEventListener = function(t, e, i) {
                var s;
                s = i ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
                var n = s[t];
                return n && this.removeEventListener(t, e, i),
                n = s[t],
                n ? n.push(e) : s[t] = [e],
                e
            },
            e.on = function(t, e, i, s, n, r) {
                return e.handleEvent && (i = i || e,
                e = e.handleEvent),
                i = i || this,
                this.addEventListener(t, function(t) {
                    e.call(i, t, n),
                    s && t.remove()
                }, r)
            },
            e.removeEventListener = function(t, e, i) {
                var s = i ? this._captureListeners : this._listeners;
                if (s) {
                    var n = s[t];
                    if (n)
                        for (var r = 0, o = n.length; o > r; r++)
                            if (n[r] == e) {
                                1 == o ? delete s[t] : n.splice(r, 1);
                                break
                            }
                }
            },
            e.off = e.removeEventListener,
            e.removeAllEventListeners = function(t) {
                t ? (this._listeners && delete this._listeners[t],
                this._captureListeners && delete this._captureListeners[t]) : this._listeners = this._captureListeners = null
            },
            e.dispatchEvent = function(t) {
                if ("string" == typeof t) {
                    var e = this._listeners;
                    if (!e || !e[t])
                        return !1;
                    t = new createjs.Event(t)
                } else
                    t.target && t.clone && (t = t.clone());
                try {
                    t.target = this
                } catch (i) {}
                if (t.bubbles && this.parent) {
                    for (var s = this, n = [s]; s.parent; )
                        n.push(s = s.parent);
                    var r, o = n.length;
                    for (r = o - 1; r >= 0 && !t.propagationStopped; r--)
                        n[r]._dispatchEvent(t, 1 + (0 == r));
                    for (r = 1; o > r && !t.propagationStopped; r++)
                        n[r]._dispatchEvent(t, 3)
                } else
                    this._dispatchEvent(t, 2);
                return t.defaultPrevented
            },
            e.hasEventListener = function(t) {
                var e = this._listeners
                  , i = this._captureListeners;
                return !!(e && e[t] || i && i[t])
            },
            e.willTrigger = function(t) {
                for (var e = this; e; ) {
                    if (e.hasEventListener(t))
                        return !0;
                    e = e.parent
                }
                return !1
            },
            e.toString = function() {
                return "[EventDispatcher]"
            },
            e._dispatchEvent = function(t, e) {
                var i, s = 1 == e ? this._captureListeners : this._listeners;
                if (t && s) {
                    var n = s[t.type];
                    if (!n || !(i = n.length))
                        return;
                    try {
                        t.currentTarget = this
                    } catch (r) {}
                    try {
                        t.eventPhase = e
                    } catch (r) {}
                    t.removed = !1,
                    n = n.slice();
                    for (var o = 0; i > o && !t.immediatePropagationStopped; o++) {
                        var a = n[o];
                        a.handleEvent ? a.handleEvent(t) : a(t),
                        t.removed && (this.off(t.type, a, 1 == e),
                        t.removed = !1)
                    }
                }
            },
            createjs.EventDispatcher = t
        }(),
        this.createjs = this.createjs || {},
        function() {
            "use strict";
            function t() {
                throw "Ticker cannot be instantiated."
            }
            t.RAF_SYNCHED = "synched",
            t.RAF = "raf",
            t.TIMEOUT = "timeout",
            t.useRAF = !1,
            t.timingMode = null,
            t.maxDelta = 0,
            t.paused = !1,
            t.removeEventListener = null,
            t.removeAllEventListeners = null,
            t.dispatchEvent = null,
            t.hasEventListener = null,
            t._listeners = null,
            createjs.EventDispatcher.initialize(t),
            t._addEventListener = t.addEventListener,
            t.addEventListener = function() {
                return !t._inited && t.init(),
                t._addEventListener.apply(t, arguments)
            },
            t._inited = !1,
            t._startTime = 0,
            t._pausedTime = 0,
            t._ticks = 0,
            t._pausedTicks = 0,
            t._interval = 50,
            t._lastTime = 0,
            t._times = null,
            t._tickTimes = null,
            t._timerId = null,
            t._raf = !0,
            t.setInterval = function(e) {
                t._interval = e,
                t._inited && t._setupTick()
            },
            t.getInterval = function() {
                return t._interval
