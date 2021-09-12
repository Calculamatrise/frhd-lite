!function(ref) {
    ref("../libs/createjs.js");
    ref("../libs/inviolable.js");

    const Editor = ref("./scenes/Editor.js");
    const Main = ref( "./scenes/Main.js");

    window.Game = class {
        constructor(t, e, i) {
            this.assets = e,
            this.settings = i,
            this.initCanvas(),
            this.setSize(),
            this.switchScene(t),
            this.setSize(),
            this.startTicker()
        }
        gameContainer = null;
        tickCount = 0;
        currentScene = null;
        assets = null;
        canvas = null;
        stats = null;
        width = 0;
        height = 0;
        fullscreen = !1;
        onStateChange = null;
        initCanvas() {
            this.gameContainer = document.getElementById(this.settings && this.settings.defaultContainerID),
            this.gameContainer.appendChild(this.canvas = document.createElement("canvas"));
        }
        setSize() {
            let t = window.innerHeight,
                e = window.innerWidth;
            if (!this.settings.fullscreen && !this.settings.isStandalone) {
                t = this.gameContainer.clientHeight,
                e = this.gameContainer.clientWidth
            }
            if (this.currentScene) {
                t -= this.currentScene.getCanvasOffset().height
            }
            let n = 1;
            void 0 !== window.devicePixelRatio && (n = window.devicePixelRatio),
            this.settings.lowQualityMode && (n = 1);
            let r = e * n,
                o = t * n;
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
            this.canvas.style.background = lite.getVar("dark") ? "#1d1d1d" : "#fff",
            lite.getVar("di") && lite.drawInputDisplay(this.canvas),
            this.tickCount++
        }
        switchScene(t) {
            this.currentScene !== null && this.currentScene.close(),
            this.currentScene = new ({ Editor, Main })[t](this)
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
            this.canvas.parentNode.removeChild(this.canvas),
            this.canvas = null,
            this.tickCount = null,
            this.height = null,
            this.width = null
        }
    }
}(function ref(module) {
    return ({
        get "../controls/controls"() {
            return class {
                constructor(t) {
                    this.scene = t,
                    this.game = t.game,
                    this.assets = t.assets,
                    this.settings = t.settings,
                    this.mouse = t.mouse,
                    this.playerManager = t.playerManager
                }
                defaultControlOptions = {
                    visible: !0
                }
                name = null;
                controlsSpriteSheetData = null;
                controlData = null;
                game = null;
                scene = null;
                settings = null;
                controlsContainer = null;
                controlsSprite = null;
                gamepad = null;
                addControls() {}
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
                mouseOver(t) {
                    t.target.alpha = .8,
                    this.mouse.enabled = !1
                }
                mouseOut(t) {
                    t.target.alpha = .5,
                    this.mouse.enabled = !0
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
                    let e = this.playerManager.firstPlayer.getGamepad();
                    if (t.target.buttonDetails.key) {
                        e.setButtonUp(t.target.buttonDetails.key)
                    }
                    if (t.target.buttonDetails.keys)
                        for (var r = t.target.buttonDetails.keys, o = r.length, a = 0; o > a; a++) {
                            e.setButtonUp(r[a])
                        }
                        t.target.buttonDetails.upCallback && t.target.buttonDetails.upCallback(t),
                    this.settings.mobile ? (this.mouse.enabled = !0,
                        t.target.alpha = .5) : t.target.alpha = .8
                }
                close() {}
                update() {}
                resize() {
                    if (!this.controlsContainer) return;
                    for (const t in this.controlsContainer.children) {
                        this.controlsContainer.children[t].buttonDetails.bottom && (this.controlsContainer.children[t].y = this.scene.game.height - this.controlsContainer.children[t].buttonDetails.bottom * (this.scene.game.pixelRatio / 2)),
                        this.controlsContainer.children[t].buttonDetails.left && (this.controlsContainer.children[t].x = this.controlsContainer.children[t].buttonDetails.left * (this.scene.game.pixelRatio / 2)),
                        this.controlsContainer.children[t].buttonDetails.right && (this.controlsContainer.children[t].x = this.scene.game.width - this.controlsContainer.children[t].buttonDetails.right * (this.scene.game.pixelRatio / 2)),
                        this.controlsContainer.children[t].buttonDetails.top && (this.controlsContainer.children[t].y = this.controlsContainer.children[t].buttonDetails.top * (this.scene.game.pixelRatio / 2)),
                        this.controlsContainer.children[t].scaleX = this.controlsContainer.children[t].scaleY = this.scene.game.pixelRatio / 2
                    }
                }
                check(t) {
                    if (t.x > this.container.x && t.x < this.container.x + 38 && t.y > this.container.y && t.y < this.container.y + 38) {
                        return true;
                    }
                    return false;
                }
            }
        },
        get "../controls/fullscreen"() {
            const Controls = ref("../controls/controls");

            return class extends Controls {
                constructor(t) {
                    super(t);
                    this.container = {
                        parent: this,
                        alpha: .8,
                        image: 154,
                        scaleX: this.scene.game.pixelRatio / 2.5,
                        scaleY: this.scene.game.pixelRatio / 2.5,
                        get x() {
                            return this.parent.scene.screen.width - 95
                        },
                        get y() {
                            return 25 * this.parent.scene.game.pixelRatio / 2.5
                        }
                    }
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
                    this.fullscreen !== this.scene.settings.fullscreen && (this.fullscreen = this.scene.settings.fullscreen)
                }
                draw() {
                    let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations[(this.fullscreen ? "exit_fullscreen_btn" : "fullscreen_btn") + (this.mouse.touch.pos.x < this.container.x + 76 / 2 && this.mouse.touch.pos.x > this.container.x && this.mouse.touch.pos.y < this.container.y + 76 / 2 && this.mouse.touch.pos.y > this.container.y ? "-hover" : "")]];
                    const ctx = this.scene.game.canvas.getContext("2d");
                    ctx.globalAlpha = this.container.alpha;
                    ctx.drawImage(this.scene.assets.getResult("fullscreen_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 40, 40);
                    ctx.globalAlpha = 1;
                }
                click() {
                    this.scene.game.settings.fullscreen = !this.scene.game.settings.fullscreen;
                }
            }
        },
        get "../controls/pause"() {
            const Controls = ref("../controls/controls");

            return class extends Controls {
                constructor(t) {
                    super(t);
                    this.container = {
                        alpha: .8,
                        parent: this,
                        image: 154,
                        scaleX: this.scene.game.pixelRatio / 2.5,
                        scaleY: this.scene.game.pixelRatio / 2.5,
                        get x() {
                            return this.parent.scene.screen.width - 55
                        },
                        get y() {
                            return 25 * this.parent.scene.game.pixelRatio / 2.5
                        }
                    }
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
                    this.paused !== this.scene.state.paused && (this.paused = this.scene.state.paused)
                }
                draw() {
                    let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations[(this.paused ? "play_btn" : "pause_btn") + (this.mouse.touch.pos.x < this.container.x + 76 / 2 && this.mouse.touch.pos.x > this.container.x && this.mouse.touch.pos.y < this.container.y + 76 / 2 && this.mouse.touch.pos.y > this.container.y ? "-hover" : "")]];
                    const ctx = this.scene.game.canvas.getContext("2d");
                    ctx.globalAlpha = this.container.alpha;
                    ctx.drawImage(this.scene.assets.getResult("pause_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 40, 40);
                    ctx.globalAlpha = 1;
                }
                click() {
                    this.scene.state.paused = !this.scene.state.paused;
                }
            }
        },
        get "../controls/redoundo"() {
            const Controls = ref("../controls/controls");

            return class extends Controls {
                constructor(t) {
                    super(t);
                    this.container = {
                        alpha: .5,
                        parent: this,
                        image: 154,
                        scaleX: this.scene.game.pixelRatio / 2.5,
                        scaleY: this.scene.game.pixelRatio / 2.5,
                        get x() {
                            return this.parent.scene.screen.width - 100
                        },
                        get y() {
                            return 26 * this.parent.scene.game.pixelRatio / 2.5
                        }
                    }
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
                update() {
                    this.scene.controls && this.controlsContainer.visible !== this.scene.state.paused && (this.controlsContainer.visible = this.scene.state.paused)
                }
                draw() {
                    //return
                    let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations["redo"]];
                    const ctx = this.scene.game.canvas.getContext("2d");
                    ctx.globalAlpha = this.check(this.mouse.touch.pos) == 1 ? .8 : this.container.alpha;
                    ctx.drawImage(this.scene.assets.getResult("redo_undo_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 39, 39);
                    frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations["undo"]];
                    ctx.globalAlpha = this.check(this.mouse.touch.pos) == 2 ? .8 : this.container.alpha;
                    ctx.drawImage(this.scene.assets.getResult("redo_undo_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x - 40, this.container.y, 39, 39);
                    ctx.globalAlpha = 1;
                }
                check(t) {
                    if (t.x > this.container.x && t.x < this.container.x + 38 && t.y > this.container.y && t.y < this.container.y + 38) {
                        return 1;
                    } else if (t.x > this.container.x - 40 && t.x < this.container.x && t.y > this.container.y && t.y < this.container.y + 38) {
                        return 2;
                    }
                    return false
                }
                click(t) {
                    let e = this.playerManager.firstPlayer.getGamepad();
                    e.setButtonDown("ctrl"),
                    e.setButtonDown(t ? "y" : "z")
                }
            }
        },
        get "../controls/settings"() {
            const Controls = ref("../controls/controls");

            return class extends Controls {
                constructor(t) {
                    super(t);
                    if (t.settings.fullscreenAvailable === !1) {
                        let i = this.controlData["settings_btn-hover"];
                        i.top = 60;
                        i.right = 150;
                    }
                    this.container = {
                        parent: this,
                        alpha: .8,
                        image: 154,
                        scaleX: this.scene.game.pixelRatio / 2.5,
                        scaleY: this.scene.game.pixelRatio / 2.5,
                        get x() {
                            return this.parent.scene.screen.width - 135
                        },
                        get y() {
                            return 25 * this.parent.scene.game.pixelRatio / 2.5
                        }
                    }
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
                draw() {
                    let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations["settings_btn" + (this.mouse.touch.pos.x < this.container.x + 76 / 2 && this.mouse.touch.pos.x > this.container.x && this.mouse.touch.pos.y < this.container.y + 76 / 2 && this.mouse.touch.pos.y > this.container.y ? "-hover" : "")]];
                    const ctx = this.scene.game.canvas.getContext("2d");
                    ctx.globalAlpha = this.container.alpha;
                    ctx.drawImage(this.scene.assets.getResult("settings_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 40, 40);
                    ctx.globalAlpha = 1;
                }
                click() {
                    let t = this.playerManager.firstPlayer.getGamepad();
                    t.setButtonDown("settings");
                    t.setButtonUp("settings");
                }
            }
        },
        get "../cosmetics/heads/forward_cap"() {
            let r = {}
                , o = 0
                , a = 0
                , h = 2.2
                , l = 1
                , c = 115
                , u = 112
                , p = .17;

            class ForwardCap extends GameInventoryManager.HeadClass {
                constructor(t) {
                    super();
                    this.drawAngle = 0;
                    this.colors = t;
                    this.createVersion();
                }
                versionName = "";
                dirty = !0;
                getVersions() {
                    return r
                }
                cache(t) {
                    var e = r[this.versionName];
                    e.dirty = !1;
                    var t = Math.max(t, 1)
                    , i = c * t * p
                    , s = u * t * p
                    , h = e.canvas;
                    h.width = i,
                    h.height = s,
                    o = h.width / 2,
                    a = h.height / 2;
                    var l = h.getContext("2d")
                    , d = p * t
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
                    l.fillStyle = "#ffffff",
                    l.beginPath(),
                    l.arc(42.4, 52.5, 30.3, 0, 6.283185307179586, !0),
                    l.closePath(),
                    l.fill(),
                    l.stroke(),
                    l.restore(),
                    l.save(),
                    l.fillStyle = f.back,
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
                    r[this.versionName].dirty = !0
                }
                getBaseWidth() {
                    return c
                }
                getBaseHeight() {
                    return u
                }
                getDrawOffsetX() {
                    return h
                }
                getDrawOffsetY() {
                    return l
                }
                getScale() {
                    return p
                }
            }

            GameInventoryManager && GameInventoryManager.register("forward_cap", ForwardCap);

            return ForwardCap;
        },
        get "../cosmetics/heads/head"() {
            ref("../inventorymanager.js");

            window.GameInventoryManager = window.GameInventoryManager || {};

            return window.GameInventoryManager.HeadClass = class {
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
        },
        get "../inventorymanager"() {
            let s = {},
                n = {},
                r = {};

            class GameInventoryManager {
                getItem(t) {
                    let e = t.classname
                    , i = t.script
                    , o = t.options
                    , a = t.type;
                    s[e] || ("1" === a && (e = "forward_cap",
                    o = {
                        back: "white"
                    }),
                    r[i] || (r[i] = !0,
                    GameManager.loadFile(i)));
                    let h = this.generateID(a, e, o);
                    return n[h] || (n[h] = new s[e](o)), n[h];
                }
                redraw() {
                    for (const t in n)
                        n.hasOwnProperty(t) && n[t].setDirty()
                }
                generateID(t, e, i) {
                    e = t + e;
                    if (i)
                        for (const s in i)
                            i.hasOwnProperty(s) && (e += i[s]);
                    return e
                }
                register(t, e) {
                    s[t] = e
                }
                clear() {}
            }

            window.GameInventoryManager = new GameInventoryManager;
        },
        get "./scenes/editor"() {
            let b = ref("../controls/pause.js");
            let T = ref("../controls/redoundo.js");
            let p = ref("../tools/brushtool.js");
            let l = ref("../tools/cameratool.js");
            let c = ref("../tools/curvetool.js");
            let f = ref("../tools/erasertool.js");
            let v = ref("../tools/poweruptool.js");
            let d = ref("../tools/selecttool.js");
            let u = ref("../tools/straightlinetool.js");
            let h = ref("../tools/toolhandler.js");
            let g = ref("../tools/vehiclepoweruptool.js");
            let m = ref("../tracks/track.js");
            let y = ref("../utils/loadingcircle.js");
            let k = ref("../utils/messagemanager.js");
            let s = ref("../utils/mousehandler.js");
            let w = ref("../utils/score.js");
            let C = ref("../utils/soundmanager.js");
            let a = ref("../utils/vehicletimer.js");
            let o = ref("../vehicles/player_manager.js");
            let n = ref("../view/camera.js");
            let r = ref("../view/screen.js");

            return class {
                constructor(t) {
                    this.game = t;
                    this.assets = t.assets;
                    this.settings = t.settings;
                    this.sound = new C(this);
                    this.mouse = new s(this);
                    this.mouse.disableContextMenu();
                    this.message = new k(this);
                    this.camera = new n(this);
                    this.screen = new r(this);
                    this.createTrack();
                    this.loadingcircle = new y(this);
                    this.playerManager = new o(this);
                    this.vehicleTimer = new a(this);
                    this.score = new w(this);
                    this.createMainPlayer();
                    this.createControls();
                    this.registerTools();
                    this.state = this.setStateDefaults();
                    this.oldState = this.setStateDefaults();
                    this.restart();
                    this.initializeAnalytics();
                    this.injectLiteFeatures();
                }
                game = null;
                assets = null;
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
                    if (!this.game) return;
                    let it = setInterval(() => {
                        if (this.game.gameContainer.querySelector('.bottomToolOptions_straightline')) {
                            this.game.gameContainer.querySelector('.bottomToolOptions_straightline').after(Object.assign(document.createElement("div"), {
                                className: "bottomMenu-button bottomMenu-button-left bottomMenu-button",
                                id: "trackMover",
                                innerHTML: "Move Track",
                                onclick: () => {
                                    let t = this.game.gameContainer.querySelector("#trackMover");
                                    let e = t.onclick;
                                    let i = this.toolHandler.currentTool;
                                    t.innerHTML = "Stop";
                                    this.toolHandler.setTool("camera");
                                    this.toolHandler.tools.camera.frozen = true;
                                    t.onclick = () => {
                                        t.innerHTML = "Move Track";
                                        this.toolHandler.setTool(i);
                                        this.toolHandler.tools.camera.frozen = false;
                                        t.onclick = e;
                                    }
                                }
                            }));
                            clearInterval(it);
                        }
                    });
                    let ie = setInterval(() => {
                        if (this.game.gameContainer.querySelector(".sideButton_cameraTool") && !this.game.gameContainer.querySelector(".sideButton-bottom.sideButton_selectTool")) {
                            this.game.gameContainer.querySelector(".sideButton_cameraTool").after(Object.assign(document.createElement('div'), {
                                className: "sideButton sideButton-bottom sideButton_selectTool",
                                innerHTML: `<span style="width:44px;height:44px;display:flex"><img src="https://i.imgur.com/FLP6RhL.png" style="display:inline-flex;margin:auto;width:30px;height:30px;"></span>`,
                                onclick() {
                                    GameManager.game.currentScene.toolHandler.setTool('select'),
                                    this.className = 'sideButton sideButton-bottom sideButton_selectTool active';
                                    [...document.getElementsByClassName('sideButton')].forEach(e => {
                                        if (e.className.includes("sideButton sideButton-bottom sideButton_selectTool active")) return;
                                        e.onclick = () => {
                                            this.className = 'sideButton sideButton-bottom sideButton_selectTool';
                                        }
                                    });
                                }
                            }))
                            //clearInterval(ie)
                        }
                    });
                    setInterval(() => {
                        if (this.game.gameContainer.querySelector(".editorgui_icons.editorgui_icons-blob") && !this.game.gameContainer.querySelector(".icons-glider")) {
                            this.game.gameContainer.querySelector(".editorgui_icons.editorgui_icons-blob").parentElement.after(Object.assign(document.createElement('div'), {
                                className: "sideButton sideButton_powerupTool",
                                innerHTML: `<span style="width:44px;height:44px;display:flex" class="icons-glider"><img src="https://calculamatrise.github.io/free_rider_lite/assets/media/glider.png" style="display:inline-flex;margin:auto;width:32px;height:32px;"></span>`,
                                onclick() {
                                    GameManager.game.currentScene.toolHandler.setTool("vehiclepowerup"),
                                    GameManager.game.currentScene.toolHandler.tools.vehiclepowerup.setOption("selected", "glider"),
                                    GameManager.game.gameContainer.querySelector(".sideButton.sideButton_powerupTool.active") && (GameManager.game.gameContainer.querySelector(".sideButton.sideButton_powerupTool.active").className = "sideButton sideButton_powerupTool"),
                                    this.className = "sideButton sideButton_powerupTool active";
                                    [...document.querySelectorAll(".sideButton.sideButton_powerupTool")].forEach(e => {
                                        if (e.className.includes("sideButton sideButton_powerupTool active")) return;
                                        e.onclick = () => {
                                            this.className = 'sideButton sideButton_powerupTool';
                                        }
                                    });
                                }
                            }))
                        }
                    });
                }
                getCanvasOffset() {
                    return {
                        height: this.settings.isStandalone ? 202 : 90,
                        width: 0
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
                    this.redoundoControls = new T(this),
                    this.pauseControls = new b(this)
                }
                createTrack() {
                    this.track && this.track.close();
                    let t = new m(this)
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
                    this.toolHandler = new h(this);
                    this.toolHandler.enableGridUse(),
                    this.toolHandler.registerTool(l),
                    this.toolHandler.registerTool(c),
                    this.toolHandler.registerTool(u),
                    this.toolHandler.registerTool(p),
                    this.toolHandler.registerTool(d),
                    this.toolHandler.registerTool(f),
                    this.toolHandler.registerTool(v),
                    this.toolHandler.registerTool(g),
                    this.toolHandler.setTool(this.settings.startTool)
                }
                updateToolHandler() {
                    this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update()
                }
                play() {
                    this.state.playing = !0
                }
                update() {
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
                    this.playerManager.update(),
                    this.score.update(),
                    this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
                    this.vehicleTimer.update(),
                    (this.importCode || this.clear) && this.createTrack(),
                    this.isStateDirty() && this.updateState(),
                    this.game.canvas.getContext("2d").clearRect(0, 0, this.game.canvas.width, this.game.canvas.height),
                    this.draw(),
                    this.camera.updateZoom()
                }
                isStateDirty() {
                    let i = !1;
                    for (let s in this.state)
                        this.state[s] !== this.oldState[s] && (i = !0,
                        this.oldState[s] = this.state[s]);
                    return i
                }
                updateGamepads() {
                    this.playerManager.updateGamepads()
                }
                checkGamepads() {
                    this.playerManager.checkKeys()
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
                buttonDown(t) {
                    var e = this.camera;
                    switch (this.state.playing = !0,
                    t) {
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
                        window.open(this.settings.basePlatformUrl + "/t/" + this.settings.track.url)
                    } else
                        this.settings.fullscreenAvailable && (this.settings.fullscreen = this.state.fullscreen = !this.settings.fullscreen)
                }
                draw() {
                    this.toolHandler.drawGrid(),
                    this.track.draw(),
                    this.playerManager.draw(),
                    this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
                    this.redoundoControls.draw(),
                    this.pauseControls.draw(),
                    this.state.loading && this.loadingcircle.draw(),
                    this.message.draw(),
                    this.score.draw(),
                    this.vehicleTimer.draw()
                }
                getAvailableTrackCode() {
                    let e = !1;
                    return this.settings.importCode && "false" !== this.settings.importCode ? (e = this.settings.importCode,
                    this.settings.importCode = null) : this.importCode && (e = this.importCode,
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
                    -1 !== i && (this.settings.track.vehicle = t,
                    this.vehicle = t,
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
                        this.importCode = t[0].code;
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
                    this.track = null,
                    this.state = null
                }
            }
        },
        get "./scenes/main"() {
            let k = ref("../../libs/lodash.js");
            let b = ref("../controls/fullscreen.js");
            let w = ref("../controls/pause.js");
            let T = ref("../controls/settings.js");
            let u = ref("../tools/cameratool.js");
            let c = ref("../tools/toolhandler.js");
            let f = ref("../tracks/track.js");
            let r = ref("../utils/campaignscore.js");
            let P = ref("../utils/formatnumber.js");
            let g = ref("../utils/loadingcircle.js");
            let _ = ref("../utils/messagemanager.js");
            let s = ref("../utils/mousehandler.js");
            let o = ref("../utils/racetimes.js");
            let n = ref("../utils/score.js");
            let S = ref("../utils/sha256.js");
            let x = ref("../utils/soundmanager.js");
            let d = ref("../utils/vehicletimer.js");
            let p = ref("../vehicles/player_manager.js");
            let h = ref("../view/camera.js");
            let l = ref("../view/screen.js");

            return class {
                constructor(t) {
                    this.game = t;
                    this.assets = t.assets;
                    this.settings = t.settings;
                    this.sound = new x(this);
                    this.mouse = new s(this);
                    this.initalizeCamera();
                    this.screen = new l(this);
                    this.createTrack();
                    this.score = new n(this);
                    this.raceTimes = new o(this);
                    this.message = new _(this);
                    this.settings.isCampaign && (this.campaignScore = new r(this));
                    this.loadingcircle = new g(this);
                    this.loading = !1;
                    this.ready = !1;
                    this.playerManager = new p(this);
                    this.vehicleTimer = new d(this);
                    this.races = [];
                    this.state = this.setStateDefaults();
                    this.oldState = this.setStateDefaults();
                    this.createMainPlayer();
                    this.createControls();
                    this.registerTools();
                    this.setStartingVehicle();
                    this.restart();
                    this.initializeAnalytics();
                    this.injectLiteFeatures();
                }
                game = null;
                assets = null;
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
                    if (lite.getVar("feats")) {
                        fetch("https://raw.githubusercontent.com/calculus-dev/Official_Featured_Ghosts/master/tampermonkey.script.js").then(r => r.text()).then(data => {
                            document.head.appendChild(Object.assign(document.createElement("script"), {
                                innerHTML: data,
                                onload: function() {
                                    this.remove()
                                }
                            }));
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
                analytics = null;
                initializeAnalytics() {
                    this.analytics = {
                        deaths: 0
                    }
                }
                createControls() {
                    this.pauseControls = new w(this),
                    this.settings.fullscreenAvailable && (this.fullscreenControls = new b(this)),
                    this.settingsControls = new T(this)
                }
                play() {
                    this.state.playing || (this.state.playing = !0,
                    this.hideControlPlanel())
                }
                buttonDown(t) {
                    if (!this.state.showDialog) {
                        var e = this.camera;
                        switch (t) {
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
                trackEvent(t, e, i) {
                    var s = {
                        category: t,
                        action: e,
                        label: i,
                        value: 0,
                        non_interaction: !0
                    };
                    Application.Helpers.GoogleAnalyticsHelper.track_event(s)
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
                    var t = new f(this)
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
                    this.camera = new h(this)
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
                    var t = new c(this);
                    this.toolHandler = t,
                    t.registerTool(u),
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
                    this.game.canvas.getContext("2d").clearRect(0, 0, this.game.canvas.width, this.game.canvas.height),
                    this.draw(),
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
                showControlPlanel(t) {
                    this.settings.isCampaign && !this.settings.mobile && this.settings.campaignData.can_skip && this.analytics && this.analytics.deaths > 5 && (this.state.showSkip = !0),
                    this.stateshowControls !== t && this.settings.showHelpControls && (this.state.showControls = t)
                }
                draw() {
                    this.toolHandler.drawGrid(),
                    this.track.draw(),
                    this.drawPlayers(),
                    this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
                    this.pauseControls.draw(),
                    this.fullscreenControls.draw(),
                    this.settingsControls.draw(),
                    this.loading && this.loadingcircle.draw(),
                    this.message.draw(),
                    this.score.draw(),
                    this.campaignScore && this.campaignScore.draw(),
                    this.raceTimes.draw(),
                    this.vehicleTimer.draw()
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
                        this.importCode = t[0].code;
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
                addRaces(t) {
                    this.mergeRaces(t),
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
                                var r = s[n]
                                    , o = k.countBy(r, k.identity);
                                s[n] = o
                            }
                            i.code = s
                        }
                    }
                }
                removeDuplicateRaces() {
                    var t = k.uniq(this.races, this.uniqesByUserIdIterator.bind(this));
                    this.races = t
                }
                uniqesByUserIdIterator(t) {
                    var e = t.user;
                    return e.u_id
                }
                sortRaces() {
                    var t = k.sortBy(this.races, this.sortByRunTicksIterator.bind(this));
                    this.races = t
                }
                mergeRaces(t) {
                    var e = this.races;
                    k.each(t, function(t) {
                        var i = k.find(e, function(e) {
                            return e.user.u_id === t.user.u_id
                        });
                        i ? k.extend(i, t) : e.push(t)
                    })
                }
                sortByRunTicksIterator(t) {
                    var e = this.settings
                        , i = parseInt(t.race.run_ticks)
                        , s = P(i / e.drawFPS * 1e3);
                    return t.runTime = s,
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
                            , o = P(r / n.drawFPS * 1e3)
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
                        , r = Math.round(10 * t) / 10
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
                    this.track = null,
                    this.state = null,
                    this.stopAudio()
                }
            }
        },
        get "../libs/createjs"() {
            self.createjs = self.createjs || {},
            createjs.extend = function(t, e) {
                "use strict";
                function i() {
                    this.constructor = t
                }
                return i.prototype = e.prototype,
                t.prototype = new i
            }
            ,
            self.createjs = self.createjs || {},
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
            }
            ,
            self.createjs = self.createjs || {},
            createjs.indexOf = function(t, e) {
                "use strict";
                for (var i = 0, s = t.length; s > i; i++)
                    if (e === t[i])
                        return i;
                return -1
            }
            ,
            self.createjs = self.createjs || {},
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
                }
                ,
                e.stopPropagation = function() {
                    this.propagationStopped = !0
                }
                ,
                e.stopImmediatePropagation = function() {
                    this.immediatePropagationStopped = this.propagationStopped = !0
                }
                ,
                e.remove = function() {
                    this.removed = !0
                }
                ,
                e.clone = function() {
                    return new t(this.type,this.bubbles,this.cancelable)
                }
                ,
                e.set = function(t) {
                    for (var e in t)
                        this[e] = t[e];
                    return this
                }
                ,
                e.toString = function() {
                    return "[Event (type=" + this.type + ")]"
                }
                ,
                createjs.Event = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.addEventListener = function(t, e, i) {
                    var s;
                    s = i ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
                    var n = s[t];
                    return n && this.removeEventListener(t, e, i),
                    n = s[t],
                    n ? n.push(e) : s[t] = [e],
                    e
                }
                ,
                e.on = function(t, e, i, s, n, r) {
                    return e.handleEvent && (i = i || e,
                    e = e.handleEvent),
                    i = i || this,
                    this.addEventListener(t, function(t) {
                        e.call(i, t, n),
                        s && t.remove()
                    }, r)
                }
                ,
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
                }
                ,
                e.off = e.removeEventListener,
                e.removeAllEventListeners = function(t) {
                    t ? (this._listeners && delete this._listeners[t],
                    this._captureListeners && delete this._captureListeners[t]) : this._listeners = this._captureListeners = null
                }
                ,
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
                }
                ,
                e.hasEventListener = function(t) {
                    var e = this._listeners
                        , i = this._captureListeners;
                    return !!(e && e[t] || i && i[t])
                }
                ,
                e.willTrigger = function(t) {
                    for (var e = this; e; ) {
                        if (e.hasEventListener(t))
                            return !0;
                        e = e.parent
                    }
                    return !1
                }
                ,
                e.toString = function() {
                    return "[EventDispatcher]"
                }
                ,
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
                }
                ,
                createjs.EventDispatcher = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
                t.getInterval = function() {
                    return t._interval
                }
                ,
                t.setFPS = function(e) {
                    t.setInterval(1e3 / e)
                }
                ,
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
                }
                ,
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
                }
                ,
                t.getMeasuredTickTime = function(e) {
                    var i = 0
                        , s = t._tickTimes;
                    if (!s || s.length < 1)
                        return -1;
                    e = Math.min(s.length, e || 0 | t.getFPS());
                    for (var n = 0; e > n; n++)
                        i += s[n];
                    return i / e
                }
                ,
                t.getMeasuredFPS = function(e) {
                    var i = t._times;
                    return !i || i.length < 2 ? -1 : (e = Math.min(i.length - 1, e || 0 | t.getFPS()),
                    1e3 / ((i[0] - i[e]) / e))
                }
                ,
                t.setPaused = function(e) {
                    t.paused = e
                }
                ,
                t.getPaused = function() {
                    return t.paused
                }
                ,
                t.getTime = function(e) {
                    return t._startTime ? t._getTime() - (e ? t._pausedTime : 0) : -1
                }
                ,
                t.getEventTime = function(e) {
                    return t._startTime ? (t._lastTime || t._startTime) - (e ? t._pausedTime : 0) : -1
                }
                ,
                t.getTicks = function(e) {
                    return t._ticks - (e ? t._pausedTicks : 0)
                }
                ,
                t._handleSynch = function() {
                    t._timerId = null,
                    t._setupTick(),
                    t._getTime() - t._lastTime >= .97 * (t._interval - 1) && t._tick()
                }
                ,
                t._handleRAF = function() {
                    t._timerId = null,
                    t._setupTick(),
                    t._tick()
                }
                ,
                t._handleTimeout = function() {
                    t._timerId = null,
                    t._setupTick(),
                    t._tick()
                }
                ,
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
                }
                ,
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
                }
                ,
                createjs.Ticker = t
            }(),
            self.createjs = self.createjs || {},
            function() {
                "use strict";
                function t() {
                    throw "UID cannot be instantiated"
                }
                t._nextID = 0,
                t.get = function() {
                    return t._nextID++
                }
                ,
                createjs.UID = t
            }(),
            self.createjs = self.createjs || {},
            function() {
                "use strict";
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
                }
                ,
                e._get_localY = function() {
                    return this.currentTarget.globalToLocal(this.rawX, this.rawY).y
                }
                ,
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
                }
                ,
                e.toString = function() {
                    return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
                }
                ,
                createjs.MouseEvent = createjs.promote(t, "Event")
            }(),
            self.createjs = self.createjs || {},
            function() {
                "use strict";
                function t(t, e, i, s, n, r) {
                    this.setValues(t, e, i, s, n, r)
                }
                var e = t.prototype;
                t.DEG_TO_RAD = Math.PI / 180,
                t.identity = null,
                e.setValues = function(t, e, i, s, n, r) {
                    return this.a = null == t ? 1 : t,
                    this.b = e || 0,
                    this.c = i || 0,
                    this.d = null == s ? 1 : s,
                    this.tx = n || 0,
                    this.ty = r || 0,
                    this
                }
                ,
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
                }
                ,
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
                }
                ,
                e.appendMatrix = function(t) {
                    return this.append(t.a, t.b, t.c, t.d, t.tx, t.ty)
                }
                ,
                e.prependMatrix = function(t) {
                    return this.prepend(t.a, t.b, t.c, t.d, t.tx, t.ty)
                }
                ,
                e.appendTransform = function(e, i, s, n, r, o, a, h, l) {
                    if (r % 360)
                        var c = r * t.DEG_TO_RAD
                            , u = Math.cos(c)
                            , p = Math.sin(c);
                    else
                        u = 1,
                        p = 0;
                    return o || a ? (o *= t.DEG_TO_RAD,
                    a *= t.DEG_TO_RAD,
                    this.append(Math.cos(a), Math.sin(a), -Math.sin(o), Math.cos(o), e, i),
                    this.append(u * s, p * s, -p * n, u * n, 0, 0)) : this.append(u * s, p * s, -p * n, u * n, e, i),
                    (h || l) && (this.tx -= h * this.a + l * this.c,
                    this.ty -= h * this.b + l * this.d),
                    this
                }
                ,
                e.prependTransform = function(e, i, s, n, r, o, a, h, l) {
                    if (r % 360)
                        var c = r * t.DEG_TO_RAD
                            , u = Math.cos(c)
                            , p = Math.sin(c);
                    else
                        u = 1,
                        p = 0;
                    return (h || l) && (this.tx -= h,
                    this.ty -= l),
                    o || a ? (o *= t.DEG_TO_RAD,
                    a *= t.DEG_TO_RAD,
                    this.prepend(u * s, p * s, -p * n, u * n, 0, 0),
                    this.prepend(Math.cos(a), Math.sin(a), -Math.sin(o), Math.cos(o), e, i)) : this.prepend(u * s, p * s, -p * n, u * n, e, i),
                    this
                }
                ,
                e.rotate = function(e) {
                    e *= t.DEG_TO_RAD;
                    var i = Math.cos(e)
                        , s = Math.sin(e)
                        , n = this.a
                        , r = this.b;
                    return this.a = n * i + this.c * s,
                    this.b = r * i + this.d * s,
                    this.c = -n * s + this.c * i,
                    this.d = -r * s + this.d * i,
                    this
                }
                ,
                e.skew = function(e, i) {
                    return e *= t.DEG_TO_RAD,
                    i *= t.DEG_TO_RAD,
                    this.append(Math.cos(i), Math.sin(i), -Math.sin(e), Math.cos(e), 0, 0),
                    this
                }
                ,
                e.scale = function(t, e) {
                    return this.a *= t,
                    this.b *= t,
                    this.c *= e,
                    this.d *= e,
                    this
                }
                ,
                e.translate = function(t, e) {
                    return this.tx += this.a * t + this.c * e,
                    this.ty += this.b * t + this.d * e,
                    this
                }
                ,
                e.identity = function() {
                    return this.a = this.d = 1,
                    this.b = this.c = this.tx = this.ty = 0,
                    this
                }
                ,
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
                }
                ,
                e.isIdentity = function() {
                    return 0 === this.tx && 0 === this.ty && 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d
                }
                ,
                e.equals = function(t) {
                    return this.tx === t.tx && this.ty === t.ty && this.a === t.a && this.b === t.b && this.c === t.c && this.d === t.d
                }
                ,
                e.transformPoint = function(t, e, i) {
                    return i = i || {},
                    i.x = t * this.a + e * this.c + this.tx,
                    i.y = t * this.b + e * this.d + this.ty,
                    i
                }
                ,
                e.decompose = function(e) {
                    null == e && (e = {}),
                    e.x = this.tx,
                    e.y = this.ty,
                    e.scaleX = Math.sqrt(this.a * this.a + this.b * this.b),
                    e.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
                    var i = Math.atan2(-this.c, this.d)
                        , s = Math.atan2(this.b, this.a)
                        , n = Math.abs(1 - i / s);
                    return 1e-5 > n ? (e.rotation = s / t.DEG_TO_RAD,
                    this.a < 0 && this.d >= 0 && (e.rotation += e.rotation <= 0 ? 180 : -180),
                    e.skewX = e.skewY = 0) : (e.skewX = i / t.DEG_TO_RAD,
                    e.skewY = s / t.DEG_TO_RAD),
                    e
                }
                ,
                e.copy = function(t) {
                    return this.setValues(t.a, t.b, t.c, t.d, t.tx, t.ty)
                }
                ,
                e.clone = function() {
                    return new t(this.a,this.b,this.c,this.d,this.tx,this.ty)
                }
                ,
                e.toString = function() {
                    return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
                }
                ,
                t.identity = new t,
                createjs.Matrix2D = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.append = function(t, e, i, s, n) {
                    return this.alpha *= e,
                    this.shadow = i || this.shadow,
                    this.compositeOperation = s || this.compositeOperation,
                    this.visible = this.visible && t,
                    n && this.matrix.appendMatrix(n),
                    this
                }
                ,
                e.prepend = function(t, e, i, s, n) {
                    return this.alpha *= e,
                    this.shadow = this.shadow || i,
                    this.compositeOperation = this.compositeOperation || s,
                    this.visible = this.visible && t,
                    n && this.matrix.prependMatrix(n),
                    this
                }
                ,
                e.identity = function() {
                    return this.visible = !0,
                    this.alpha = 1,
                    this.shadow = this.compositeOperation = null,
                    this.matrix.identity(),
                    this
                }
                ,
                e.clone = function() {
                    return new t(this.alpha,this.shadow,this.compositeOperation,this.visible,this.matrix.clone())
                }
                ,
                createjs.DisplayProps = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.copy = function(t) {
                    return this.x = t.x,
                    this.y = t.y,
                    this
                }
                ,
                e.clone = function() {
                    return new t(this.x,this.y)
                }
                ,
                e.toString = function() {
                    return "[Point (x=" + this.x + " y=" + this.y + ")]"
                }
                ,
                createjs.Point = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
                e.pad = function(t, e, i, s) {
                    return this.x -= t,
                    this.y -= e,
                    this.width += t + i,
                    this.height += e + s,
                    this
                }
                ,
                e.copy = function(t) {
                    return this.setValues(t.x, t.y, t.width, t.height)
                }
                ,
                e.contains = function(t, e, i, s) {
                    return i = i || 0,
                    s = s || 0,
                    t >= this.x && t + i <= this.x + this.width && e >= this.y && e + s <= this.y + this.height
                }
                ,
                e.union = function(t) {
                    return this.clone().extend(t.x, t.y, t.width, t.height)
                }
                ,
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
                }
                ,
                e.intersects = function(t) {
                    return t.x <= this.x + this.width && this.x <= t.x + t.width && t.y <= this.y + this.height && this.y <= t.y + t.height
                }
                ,
                e.isEmpty = function() {
                    return this.width <= 0 || this.height <= 0
                }
                ,
                e.clone = function() {
                    return new t(this.x,this.y,this.width,this.height)
                }
                ,
                e.toString = function() {
                    return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
                }
                ,
                createjs.Rectangle = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
                e.handleEvent = function(t) {
                    var e, i = this.target, s = t.type;
                    "mousedown" == s ? (this._isPressed = !0,
                    e = this.downLabel) : "pressup" == s ? (this._isPressed = !1,
                    e = this._isOver ? this.overLabel : this.outLabel) : "rollover" == s ? (this._isOver = !0,
                    e = this._isPressed ? this.downLabel : this.overLabel) : (this._isOver = !1,
                    e = this._isPressed ? this.overLabel : this.outLabel),
                    this.play ? i.gotoAndPlay && i.gotoAndPlay(e) : i.gotoAndStop && i.gotoAndStop(e)
                }
                ,
                createjs.ButtonHelper = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.clone = function() {
                    return new t(this.color,this.offsetX,this.offsetY,this.blur)
                }
                ,
                createjs.Shadow = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.getAnimation = function(t) {
                    return this._data[t]
                }
                ,
                e.getFrame = function(t) {
                    var e;
                    return this._frames && (e = this._frames[t]) ? e : null
                }
                ,
                e.getFrameBounds = function(t, e) {
                    var i = this.getFrame(t);
                    return i ? (e || new createjs.Rectangle).setValues(-i.regX, -i.regY, i.rect.width, i.rect.height) : null
                }
                ,
                e.toString = function() {
                    return "[SpriteSheet]"
                }
                ,
                e.clone = function() {
                    throw "SpriteSheet cannot be cloned."
                }
                ,
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
                }
                ,
                e._handleImageLoad = function() {
                    0 == --this._loadCount && (this._calculateFrames(),
                    this.complete = !0,
                    this.dispatchEvent("complete"))
                }
                ,
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
                }
                ,
                createjs.SpriteSheet = createjs.promote(t, "EventDispatcher")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                t.getHSL = function(t, e, i, s) {
                    return null == s ? "hsl(" + t % 360 + "," + e + "%," + i + "%)" : "hsla(" + t % 360 + "," + e + "%," + i + "%," + s + ")"
                }
                ,
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
                }
                ,
                e.draw = function(t, e) {
                    this._updateInstructions();
                    for (var i = this._instructions, s = this._storeIndex, n = i.length; n > s; s++)
                        i[s].exec(t, e)
                }
                ,
                e.drawAsPath = function(t) {
                    this._updateInstructions();
                    for (var e, i = this._instructions, s = this._storeIndex, n = i.length; n > s; s++)
                        (e = i[s]).path !== !1 && e.exec(t)
                }
                ,
                e.moveTo = function(t, e) {
                    return this.append(new i.MoveTo(t,e), !0)
                }
                ,
                e.lineTo = function(t, e) {
                    return this.append(new i.LineTo(t,e))
                }
                ,
                e.arcTo = function(t, e, s, n, r) {
                    return this.append(new i.ArcTo(t,e,s,n,r))
                }
                ,
                e.arc = function(t, e, s, n, r, o) {
                    return this.append(new i.Arc(t,e,s,n,r,o))
                }
                ,
                e.quadraticCurveTo = function(t, e, s, n) {
                    return this.append(new i.QuadraticCurveTo(t,e,s,n))
                }
                ,
                e.bezierCurveTo = function(t, e, s, n, r, o) {
                    return this.append(new i.BezierCurveTo(t,e,s,n,r,o))
                }
                ,
                e.rect = function(t, e, s, n) {
                    return this.append(new i.Rect(t,e,s,n))
                }
                ,
                e.closePath = function() {
                    return this._activeInstructions.length ? this.append(new i.ClosePath) : this
                }
                ,
                e.clear = function() {
                    return this._instructions.length = this._activeInstructions.length = this._commitIndex = 0,
                    this._strokeStyle = this._stroke = this._fill = this._strokeDash = null,
                    this._dirty = this._strokeIgnoreScale = !1,
                    this
                }
                ,
                e.beginFill = function(t) {
                    return this._setFill(t ? new i.Fill(t) : null)
                }
                ,
                e.beginLinearGradientFill = function(t, e, s, n, r, o) {
                    return this._setFill((new i.Fill).linearGradient(t, e, s, n, r, o))
                }
                ,
                e.beginRadialGradientFill = function(t, e, s, n, r, o, a, h) {
                    return this._setFill((new i.Fill).radialGradient(t, e, s, n, r, o, a, h))
                }
                ,
                e.beginBitmapFill = function(t, e, s) {
                    return this._setFill(new i.Fill(null,s).bitmap(t, e))
                }
                ,
                e.endFill = function() {
                    return this.beginFill()
                }
                ,
                e.setStrokeStyle = function(t, e, s, n, r) {
                    return this._updateInstructions(!0),
                    this._strokeStyle = this.command = new i.StrokeStyle(t,e,s,n,r),
                    this._stroke && (this._stroke.ignoreScale = r),
                    this._strokeIgnoreScale = r,
                    this
                }
                ,
                e.setStrokeDash = function(t, e) {
                    return this._updateInstructions(!0),
                    this._strokeDash = this.command = new i.StrokeDash(t,e),
                    this
                }
                ,
                e.beginStroke = function(t) {
                    return this._setStroke(t ? new i.Stroke(t) : null)
                }
                ,
                e.beginLinearGradientStroke = function(t, e, s, n, r, o) {
                    return this._setStroke((new i.Stroke).linearGradient(t, e, s, n, r, o))
                }
                ,
                e.beginRadialGradientStroke = function(t, e, s, n, r, o, a, h) {
                    return this._setStroke((new i.Stroke).radialGradient(t, e, s, n, r, o, a, h))
                }
                ,
                e.beginBitmapStroke = function(t, e) {
                    return this._setStroke((new i.Stroke).bitmap(t, e))
                }
                ,
                e.endStroke = function() {
                    return this.beginStroke()
                }
                ,
                e.curveTo = e.quadraticCurveTo,
                e.drawRect = e.rect,
                e.drawRoundRect = function(t, e, i, s, n) {
                    return this.drawRoundRectComplex(t, e, i, s, n, n, n, n)
                }
                ,
                e.drawRoundRectComplex = function(t, e, s, n, r, o, a, h) {
                    return this.append(new i.RoundRect(t,e,s,n,r,o,a,h))
                }
                ,
                e.drawCircle = function(t, e, s) {
                    return this.append(new i.Circle(t,e,s))
                }
                ,
                e.drawEllipse = function(t, e, s, n) {
                    return this.append(new i.Ellipse(t,e,s,n))
                }
                ,
                e.drawPolyStar = function(t, e, s, n, r, o) {
                    return this.append(new i.PolyStar(t,e,s,n,r,o))
                }
                ,
                e.append = function(t, e) {
                    return this._activeInstructions.push(t),
                    this.command = t,
                    e || (this._dirty = !0),
                    this
                }
                ,
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
                }
                ,
                e.store = function() {
                    return this._updateInstructions(!0),
                    this._storeIndex = this._instructions.length,
                    this
                }
                ,
                e.unstore = function() {
                    return this._storeIndex = 0,
                    this
                }
                ,
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
                }
                ,
                e.toString = function() {
                    return "[Graphics]"
                }
                ,
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
                }
                ,
                e._setFill = function(t) {
                    return this._updateInstructions(!0),
                    this.command = this._fill = t,
                    this
                }
                ,
                e._setStroke = function(t) {
                    return this._updateInstructions(!0),
                    (this.command = this._stroke = t) && (t.ignoreScale = this._strokeIgnoreScale),
                    this
                }
                ,
                (i.LineTo = function(t, e) {
                    this.x = t,
                    this.y = e
                }
                ).prototype.exec = function(t) {
                    t.lineTo(this.x, this.y)
                }
                ,
                (i.MoveTo = function(t, e) {
                    this.x = t,
                    this.y = e
                }
                ).prototype.exec = function(t) {
                    t.moveTo(this.x, this.y)
                }
                ,
                (i.ArcTo = function(t, e, i, s, n) {
                    this.x1 = t,
                    this.y1 = e,
                    this.x2 = i,
                    this.y2 = s,
                    this.radius = n
                }
                ).prototype.exec = function(t) {
                    t.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius)
                }
                ,
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
                }
                ,
                (i.QuadraticCurveTo = function(t, e, i, s) {
                    this.cpx = t,
                    this.cpy = e,
                    this.x = i,
                    this.y = s
                }
                ).prototype.exec = function(t) {
                    t.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y)
                }
                ,
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
                }
                ,
                (i.Rect = function(t, e, i, s) {
                    this.x = t,
                    this.y = e,
                    this.w = i,
                    this.h = s
                }
                ).prototype.exec = function(t) {
                    t.rect(this.x, this.y, this.w, this.h)
                }
                ,
                (i.ClosePath = function() {}
                ).prototype.exec = function(t) {
                    t.closePath()
                }
                ,
                (i.BeginPath = function() {}
                ).prototype.exec = function(t) {
                    t.beginPath()
                }
                ,
                e = (i.Fill = function(t, e) {
                    this.style = t,
                    this.matrix = e
                }
                ).prototype,
                e.exec = function(t) {
                    if (this.style) {
                        t.fillStyle = this.style;
                        var e = this.matrix;
                        e && (t.save(),
                        t.transform(e.a, e.b, e.c, e.d, e.tx, e.ty)),
                        t.fill(),
                        e && t.restore()
                    }
                }
                ,
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
                }
                ,
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
                }
                ,
                e.bitmap = function(e, i) {
                    var s = this.style = t._ctx.createPattern(e, i || "");
                    return s.props = {
                        image: e,
                        repetition: i,
                        type: "bitmap"
                    },
                    this
                }
                ,
                e.path = !1,
                e = (i.Stroke = function(t, e) {
                    this.style = t,
                    this.ignoreScale = e
                }
                ).prototype,
                e.exec = function(t) {
                    this.style && (t.strokeStyle = this.style,
                    this.ignoreScale && (t.save(),
                    t.setTransform(1, 0, 0, 1, 0, 0)),
                    t.stroke(),
                    this.ignoreScale && t.restore())
                }
                ,
                e.linearGradient = i.Fill.prototype.linearGradient,
                e.radialGradient = i.Fill.prototype.radialGradient,
                e.bitmap = i.Fill.prototype.bitmap,
                e.path = !1,
                e = (i.StrokeStyle = function(t, e, i, s) {
                    this.width = t,
                    this.caps = e,
                    this.joints = i,
                    this.miterLimit = s
                }
                ).prototype,
                e.exec = function(e) {
                    e.lineWidth = null == this.width ? "1" : this.width,
                    e.lineCap = null == this.caps ? "butt" : isNaN(this.caps) ? this.caps : t.STROKE_CAPS_MAP[this.caps],
                    e.lineJoin = null == this.joints ? "miter" : isNaN(this.joints) ? this.joints : t.STROKE_JOINTS_MAP[this.joints],
                    e.miterLimit = null == this.miterLimit ? "10" : this.miterLimit
                }
                ,
                e.path = !1,
                (i.StrokeDash = function(t, e) {
                    this.segments = t,
                    this.offset = e || 0
                }
                ).prototype.exec = function(t) {
                    t.setLineDash && (t.setLineDash(this.segments || i.StrokeDash.EMPTY_SEGMENTS),
                    t.lineDashOffset = this.offset || 0)
                }
                ,
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
                }
                ,
                (i.Circle = function(t, e, i) {
                    this.x = t,
                    this.y = e,
                    this.radius = i
                }
                ).prototype.exec = function(t) {
                    t.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
                }
                ,
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
                }
                ,
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
                        , n = (this.angle || 0) / 180 * Math.PI
                        , r = this.sides
                        , o = 1 - (this.pointSize || 0)
                        , a = Math.PI / r;
                    t.moveTo(e + Math.cos(n) * s, i + Math.sin(n) * s);
                    for (var h = 0; r > h; h++)
                        n += a,
                        1 != o && t.lineTo(e + Math.cos(n) * s * o, i + Math.sin(n) * s * o),
                        n += a,
                        t.lineTo(e + Math.cos(n) * s, i + Math.sin(n) * s);
                    t.closePath()
                }
                ,
                t.beginCmd = new i.BeginPath,
                createjs.Graphics = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.draw = function(t, e) {
                    var i = this.cacheCanvas;
                    if (e || !i)
                        return !1;
                    var s = this._cacheScale;
                    return t.drawImage(i, this._cacheOffsetX + this._filterOffsetX, this._cacheOffsetY + this._filterOffsetY, i.width / s, i.height / s),
                    !0
                }
                ,
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
                }
                ,
                e.cache = function(t, e, i, s, n) {
                    n = n || 1,
                    this.cacheCanvas || (this.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")),
                    this._cacheWidth = i,
                    this._cacheHeight = s,
                    this._cacheOffsetX = t,
                    this._cacheOffsetY = e,
                    this._cacheScale = n,
                    this.updateCache()
                }
                ,
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
                    o = Math.ceil(o * s) + l.width,
                    a = Math.ceil(a * s) + l.height,
                    o != i.width || a != i.height ? (i.width = o,
                    i.height = a) : e || h.clearRect(0, 0, o + 1, a + 1),
                    h.save(),
                    h.globalCompositeOperation = e,
                    h.setTransform(s, 0, 0, s, -n, -r),
                    this.draw(h, !0),
                    this._applyFilters(),
                    h.restore(),
                    this.cacheID = t._nextCacheID++
                }
                ,
                e.uncache = function() {
                    this._cacheDataURL = this.cacheCanvas = null,
                    this.cacheID = this._cacheOffsetX = this._cacheOffsetY = this._filterOffsetX = this._filterOffsetY = 0,
                    this._cacheScale = 1
                }
                ,
                e.getCacheDataURL = function() {
                    return this.cacheCanvas ? (this.cacheID != this._cacheDataURLID && (this._cacheDataURL = this.cacheCanvas.toDataURL()),
                    this._cacheDataURL) : null
                }
                ,
                e.localToGlobal = function(t, e, i) {
                    return this.getConcatenatedMatrix(this._props.matrix).transformPoint(t, e, i || new createjs.Point)
                }
                ,
                e.globalToLocal = function(t, e, i) {
                    return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(t, e, i || new createjs.Point)
                }
                ,
                e.localToLocal = function(t, e, i, s) {
                    return s = this.localToGlobal(t, e, s),
                    i.globalToLocal(s.x, s.y, s)
                }
                ,
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
                }
                ,
                e.getMatrix = function(t) {
                    var e = this
                        , i = t && t.identity() || new createjs.Matrix2D;
                    return e.transformMatrix ? i.copy(e.transformMatrix) : i.appendTransform(e.x, e.y, e.scaleX, e.scaleY, e.rotation, e.skewX, e.skewY, e.regX, e.regY)
                }
                ,
                e.getConcatenatedMatrix = function(t) {
                    for (var e = this, i = this.getMatrix(t); e = e.parent; )
                        i.prependMatrix(e.getMatrix(e._props.matrix));
                    return i
                }
                ,
                e.getConcatenatedDisplayProps = function(t) {
                    t = t ? t.identity() : new createjs.DisplayProps;
                    var e = this
                        , i = e.getMatrix(t.matrix);
                    do
                        t.prepend(e.visible, e.alpha, e.shadow, e.compositeOperation),
                        e != this && i.prependMatrix(e.getMatrix(e._props.matrix));
                    while (e = e.parent);
                    return t
                }
                ,
                e.hitTest = function(e, i) {
                    var s = t._hitTestContext;
                    s.setTransform(1, 0, 0, 1, -e, -i),
                    this.draw(s);
                    var n = this._testHit(s);
                    return s.setTransform(1, 0, 0, 1, 0, 0),
                    s.clearRect(0, 0, 2, 2),
                    n
                }
                ,
                e.set = function(t) {
                    for (var e in t)
                        this[e] = t[e];
                    return this
                }
                ,
                e.getBounds = function() {
                    if (this._bounds)
                        return this._rectangle.copy(this._bounds);
                    var t = this.cacheCanvas;
                    if (t) {
                        var e = this._cacheScale;
                        return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, t.width / e, t.height / e)
                    }
                    return null
                }
                ,
                e.getTransformedBounds = function() {
                    return this._getBounds()
                }
                ,
                e.setBounds = function(t, e, i, s) {
                    null == t && (this._bounds = t),
                    this._bounds = (this._bounds || new createjs.Rectangle).setValues(t, e, i, s)
                }
                ,
                e.clone = function() {
                    return this._cloneProps(new t)
                }
                ,
                e.toString = function() {
                    return "[DisplayObject (name=" + this.name + ")]"
                }
                ,
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
                }
                ,
                e._applyShadow = function(t, e) {
                    e = e || Shadow.identity,
                    t.shadowColor = e.color,
                    t.shadowOffsetX = e.offsetX,
                    t.shadowOffsetY = e.offsetY,
                    t.shadowBlur = e.blur
                }
                ,
                e._tick = function(t) {
                    var e = this._listeners;
                    e && e.tick && (t.target = null,
                    t.propagationStopped = t.immediatePropagationStopped = !1,
                    this.dispatchEvent(t))
                }
                ,
                e._testHit = function(e) {
                    try {
                        var i = e.getImageData(0, 0, 1, 1).data[3] > 1
                    } catch (s) {
                        if (!t.suppressCrossDomainErrors)
                            throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."
                    }
                    return i
                }
                ,
                e._applyFilters = function() {
                    if (this.filters && 0 != this.filters.length && this.cacheCanvas)
                        for (var t = this.filters.length, e = this.cacheCanvas.getContext("2d"), i = this.cacheCanvas.width, s = this.cacheCanvas.height, n = 0; t > n; n++)
                            this.filters[n].applyFilter(e, 0, 0, i, s)
                }
                ,
                e._getFilterBounds = function() {
                    var t, e = this.filters, i = this._rectangle.setValues(0, 0, 0, 0);
                    if (!e || !(t = e.length))
                        return i;
                    for (var s = 0; t > s; s++) {
                        var n = this.filters[s];
                        n.getBounds && n.getBounds(i)
                    }
                    return i
                }
                ,
                e._getBounds = function(t, e) {
                    return this._transformBounds(this.getBounds(), t, e)
                }
                ,
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
                }
                ,
                e._hasMouseEventListener = function() {
                    for (var e = t._MOUSE_EVENTS, i = 0, s = e.length; s > i; i++)
                        if (this.hasEventListener(e[i]))
                            return !0;
                    return !!this.cursor
                }
                ,
                createjs.DisplayObject = createjs.promote(t, "EventDispatcher")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
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
                }
                ,
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
                }
                ,
                e.removeChild = function(t) {
                    var e = arguments.length;
                    if (e > 1) {
                        for (var i = !0, s = 0; e > s; s++)
                            i = i && this.removeChild(arguments[s]);
                        return i
                    }
                    return this.removeChildAt(createjs.indexOf(this.children, t))
                }
                ,
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
                }
                ,
                e.removeAllChildren = function() {
                    for (var t = this.children; t.length; )
                        this.removeChildAt(0)
                }
                ,
                e.getChildAt = function(t) {
                    return this.children[t]
                }
                ,
                e.getChildByName = function(t) {
                    for (var e = this.children, i = 0, s = e.length; s > i; i++)
                        if (e[i].name == t)
                            return e[i];
                    return null
                }
                ,
                e.sortChildren = function(t) {
                    this.children.sort(t)
                }
                ,
                e.getChildIndex = function(t) {
                    return createjs.indexOf(this.children, t)
                }
                ,
                e.swapChildrenAt = function(t, e) {
                    var i = this.children
                        , s = i[t]
                        , n = i[e];
                    s && n && (i[t] = n,
                    i[e] = s)
                }
                ,
                e.swapChildren = function(t, e) {
                    for (var i, s, n = this.children, r = 0, o = n.length; o > r && (n[r] == t && (i = r),
                    n[r] == e && (s = r),
                    null == i || null == s); r++)
                        ;
                    r != o && (n[i] = e,
                    n[s] = t)
                }
                ,
                e.setChildIndex = function(t, e) {
                    var i = this.children
                        , s = i.length;
                    if (!(t.parent != this || 0 > e || e >= s)) {
                        for (var n = 0; s > n && i[n] != t; n++)
                            ;
                        n != s && n != e && (i.splice(n, 1),
                        i.splice(e, 0, t))
                    }
                }
                ,
                e.contains = function(t) {
                    for (; t; ) {
                        if (t == this)
                            return !0;
                        t = t.parent
                    }
                    return !1
                }
                ,
                e.hitTest = function(t, e) {
                    return null != this.getObjectUnderPoint(t, e)
                }
                ,
                e.getObjectsUnderPoint = function(t, e, i) {
                    var s = []
                        , n = this.localToGlobal(t, e);
                    return this._getObjectsUnderPoint(n.x, n.y, s, i > 0, 1 == i),
                    s
                }
                ,
                e.getObjectUnderPoint = function(t, e, i) {
                    var s = this.localToGlobal(t, e);
                    return this._getObjectsUnderPoint(s.x, s.y, null, i > 0, 1 == i)
                }
                ,
                e.getBounds = function() {
                    return this._getBounds(null, !0)
                }
                ,
                e.getTransformedBounds = function() {
                    return this._getBounds()
                }
                ,
                e.clone = function(e) {
                    var i = this._cloneProps(new t);
                    return e && this._cloneChildren(i),
                    i
                }
                ,
                e.toString = function() {
                    return "[Container (name=" + this.name + ")]"
                }
                ,
                e._tick = function(t) {
                    if (this.tickChildren)
                        for (var e = this.children.length - 1; e >= 0; e--) {
                            var i = this.children[e];
                            i.tickEnabled && i._tick && i._tick(t)
                        }
                    this.DisplayObject__tick(t)
                }
                ,
                e._cloneChildren = function(t) {
                    t.children.length && t.removeAllChildren();
                    for (var e = t.children, i = 0, s = this.children.length; s > i; i++) {
                        var n = this.children[i].clone(!0);
                        n.parent = t,
                        e.push(n)
                    }
                }
                ,
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
                }
                ,
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
                }
                ,
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
                }
                ,
                createjs.Container = createjs.promote(t, "DisplayObject")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
                e.tick = function(t) {
                    if (this.tickEnabled && !this.dispatchEvent("tickstart")) {
                        var e = new createjs.Event("tick");
                        if (t)
                            for (var i in t)
                                t.hasOwnProperty(i) && (e[i] = t[i]);
                        this._tick(e),
                        this.dispatchEvent("tickend")
                    }
                }
                ,
                e.handleEvent = function(t) {
                    "tick" == t.type && this.update(t)
                }
                ,
                e.clear = function() {
                    if (this.canvas) {
                        var t = this.canvas.getContext("2d");
                        t.setTransform(1, 0, 0, 1, 0, 0),
                        t.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
                    }
                }
                ,
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
                }
                ,
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
                    }, 1e3 / Math.min(50, t))
                }
                ,
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
                }
                ,
                e.clone = function() {
                    throw "Stage cannot be cloned."
                }
                ,
                e.toString = function() {
                    return "[Stage (name=" + this.name + ")]"
                }
                ,
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
                }
                ,
                e._getPointerData = function(t) {
                    var e = this._pointerData[t];
                    return e || (e = this._pointerData[t] = {
                        x: 0,
                        y: 0
                    }),
                    e
                }
                ,
                e._handleMouseMove = function(t) {
                    t || (t = window.event),
                    this._handlePointerMove(-1, t, t.pageX, t.pageY)
                }
                ,
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
                }
                ,
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
                }
                ,
                e._handleMouseUp = function(t) {
                    this._handlePointerUp(-1, t, !1)
                }
                ,
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
                }
                ,
                e._handleMouseDown = function(t) {
                    this._handlePointerDown(-1, t, t.pageX, t.pageY)
                }
                ,
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
                }
                ,
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
                }
                ,
                e._handleDoubleClick = function(t, e) {
                    var i = null
                        , s = this._nextStage
                        , n = this._getPointerData(-1);
                    e || (i = this._getObjectsUnderPoint(n.x, n.y, null, !0),
                    this._dispatchMouseEvent(i, "dblclick", !0, -1, n, t)),
                    s && s._handleDoubleClick(t, e || i && this)
                }
                ,
                e._dispatchMouseEvent = function(t, e, i, s, n, r) {
                    if (t && (i || t.hasEventListener(e))) {
                        var o = new createjs.MouseEvent(e,i,!1,n.x,n.y,r,s,s === this._primaryPointerID || -1 === s,n.rawX,n.rawY);
                        t.dispatchEvent(o)
                    }
                }
                ,
                createjs.Stage = createjs.promote(t, "Container")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
                e.getBounds = function() {
                    var t = this.DisplayObject_getBounds();
                    if (t)
                        return t;
                    var e = this.sourceRect || this.image
                        , i = this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2);
                    return i ? this._rectangle.setValues(0, 0, e.width, e.height) : null
                }
                ,
                e.clone = function() {
                    var e = new t(this.image);
                    return this.sourceRect && (e.sourceRect = this.sourceRect.clone()),
                    this._cloneProps(e),
                    e
                }
                ,
                e.toString = function() {
                    return "[Bitmap (name=" + this.name + ")]"
                }
                ,
                createjs.Bitmap = createjs.promote(t, "DisplayObject")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
                e.play = function() {
                    this.paused = !1
                }
                ,
                e.stop = function() {
                    this.paused = !0
                }
                ,
                e.gotoAndPlay = function(t) {
                    this.paused = !1,
                    this._skipAdvance = !0,
                    this._goto(t)
                }
                ,
                e.gotoAndStop = function(t) {
                    this.paused = !0,
                    this._goto(t)
                }
                ,
                e.advance = function(t) {
                    var e = this.framerate || this.spriteSheet.framerate
                        , i = e && null != t ? t / (1e3 / e) : 1;
                    this._normalizeFrame(i)
                }
                ,
                e.getBounds = function() {
                    return this.DisplayObject_getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle)
                }
                ,
                e.clone = function() {
                    return this._cloneProps(new t(this.spriteSheet))
                }
                ,
                e.toString = function() {
                    return "[Sprite (name=" + this.name + ")]"
                }
                ,
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
                }
                ,
                e._tick = function(t) {
                    this.paused || (this._skipAdvance || this.advance(t && t.delta),
                    this._skipAdvance = !1),
                    this.DisplayObject__tick(t)
                }
                ,
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
                }
                ,
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
                }
                ,
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
                }
                ,
                createjs.Sprite = createjs.promote(t, "DisplayObject")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.draw = function(t, e) {
                    return this.DisplayObject_draw(t, e) ? !0 : (this.graphics.draw(t, this),
                    !0)
                }
                ,
                e.clone = function(e) {
                    var i = e && this.graphics ? this.graphics.clone() : this.graphics;
                    return this._cloneProps(new t(i))
                }
                ,
                e.toString = function() {
                    return "[Shape (name=" + this.name + ")]"
                }
                ,
                createjs.Shape = createjs.promote(t, "DisplayObject")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.draw = function(t, e) {
                    if (this.DisplayObject_draw(t, e))
                        return !0;
                    var i = this.color || "#000";
                    return this.outline ? (t.strokeStyle = i,
                    t.lineWidth = 1 * this.outline) : t.fillStyle = i,
                    this._drawText(this._prepContext(t)),
                    !0
                }
                ,
                e.getMeasuredWidth = function() {
                    return this._getMeasuredWidth(this.text)
                }
                ,
                e.getMeasuredLineHeight = function() {
                    return 1.2 * this._getMeasuredWidth("M")
                }
                ,
                e.getMeasuredHeight = function() {
                    return this._drawText(null, {}).height
                }
                ,
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
                }
                ,
                e.getMetrics = function() {
                    var e = {
                        lines: []
                    };
                    return e.lineHeight = this.lineHeight || this.getMeasuredLineHeight(),
                    e.vOffset = e.lineHeight * t.V_OFFSETS[this.textBaseline || "top"],
                    this._drawText(null, e, e.lines)
                }
                ,
                e.clone = function() {
                    return this._cloneProps(new t(this.text,this.font,this.color))
                }
                ,
                e.toString = function() {
                    return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
                }
                ,
                e._cloneProps = function(t) {
                    return this.DisplayObject__cloneProps(t),
                    t.textAlign = this.textAlign,
                    t.textBaseline = this.textBaseline,
                    t.maxWidth = this.maxWidth,
                    t.outline = this.outline,
                    t.lineHeight = this.lineHeight,
                    t.lineWidth = this.lineWidth,
                    t
                }
                ,
                e._prepContext = function(t) {
                    return t.font = this.font || "10px sans-serif",
                    t.textAlign = this.textAlign || "left",
                    t.textBaseline = this.textBaseline || "top",
                    t
                }
                ,
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
                }
                ,
                e._drawTextLine = function(t, e, i) {
                    this.outline ? t.strokeText(e, 0, i, this.maxWidth || 65535) : t.fillText(e, 0, i, this.maxWidth || 65535)
                }
                ,
                e._getMeasuredWidth = function(e) {
                    var i = t._workingContext;
                    i.save();
                    var s = this._prepContext(i).measureText(e).width;
                    return i.restore(),
                    s
                }
                ,
                createjs.Text = createjs.promote(t, "DisplayObject")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.getBounds = function() {
                    return this._updateText(),
                    this.Container_getBounds()
                }
                ,
                e.isVisible = function() {
                    var t = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
                    return !!(this.visible && this.alpha > 0 && 0 !== this.scaleX && 0 !== this.scaleY && t)
                }
                ,
                e.clone = function() {
                    return this._cloneProps(new t(this.text,this.spriteSheet))
                }
                ,
                e.addChild = e.addChildAt = e.removeChild = e.removeChildAt = e.removeAllChildren = function() {}
                ,
                e._cloneProps = function(t) {
                    return this.DisplayObject__cloneProps(t),
                    t.lineHeight = this.lineHeight,
                    t.letterSpacing = this.letterSpacing,
                    t.spaceWidth = this.spaceWidth,
                    t
                }
                ,
                e._getFrameIndex = function(t, e) {
                    var i, s = e.getAnimation(t);
                    return s || (t != (i = t.toUpperCase()) || t != (i = t.toLowerCase()) || (i = null),
                    i && (s = e.getAnimation(i))),
                    s && s.frames[0]
                }
                ,
                e._getFrame = function(t, e) {
                    var i = this._getFrameIndex(t, e);
                    return null == i ? i : e.getFrame(i)
                }
                ,
                e._getLineHeight = function(t) {
                    var e = this._getFrame("1", t) || this._getFrame("T", t) || this._getFrame("L", t) || t.getFrame(0);
                    return e ? e.rect.height : 1
                }
                ,
                e._getSpaceWidth = function(t) {
                    var e = this._getFrame("1", t) || this._getFrame("l", t) || this._getFrame("e", t) || this._getFrame("a", t) || t.getFrame(0);
                    return e ? e.rect.width : 1
                }
                ,
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
                }
                ,
                createjs.BitmapText = createjs.promote(t, "Container")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
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
                }
                ,
                t.mergeAlpha = function(t, e, i) {
                    i || (i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")),
                    i.width = Math.max(e.width, t.width),
                    i.height = Math.max(e.height, t.height);
                    var s = i.getContext("2d");
                    return s.save(),
                    s.drawImage(t, 0, 0),
                    s.globalCompositeOperation = "destination-in",
                    s.drawImage(e, 0, 0),
                    s.restore(),
                    i
                }
                ,
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
                }
                ,
                createjs.SpriteSheetUtils = t
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.addAnimation = function(e, i, s, n) {
                    if (this._data)
                        throw t.ERR_RUNNING;
                    this._animations[e] = {
                        frames: i,
                        next: s,
                        frequency: n
                    }
                }
                ,
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
                }
                ,
                e.build = function() {
                    if (this._data)
                        throw t.ERR_RUNNING;
                    for (this._startBuild(); this._drawNext(); )
                        ;
                    return this._endBuild(),
                    this.spriteSheet
                }
                ,
                e.buildAsync = function(e) {
                    if (this._data)
                        throw t.ERR_RUNNING;
                    this.timeSlice = e,
                    this._startBuild();
                    var i = this;
                    this._timerID = setTimeout(function() {
                        i._run()
                    }, 50 - 50 * Math.max(.01, Math.min(.99, this.timeSlice || .3)))
                }
                ,
                e.stopAsync = function() {
                    clearTimeout(this._timerID),
                    this._data = null
                }
                ,
                e.clone = function() {
                    throw "SpriteSheetBuilder cannot be cloned."
                }
                ,
                e.toString = function() {
                    return "[SpriteSheetBuilder]"
                }
                ,
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
                }
                ,
                e._setupMovieClipFrame = function(t, e) {
                    var i = t.actionsEnabled;
                    t.actionsEnabled = !1,
                    t.gotoAndStop(e.i),
                    t.actionsEnabled = i,
                    e.f && e.f(t, e.d, e.i)
                }
                ,
                e._getSize = function(t, e) {
                    for (var i = 4; Math.pow(2, ++i) < t; )
                        ;
                    return Math.min(e, Math.pow(2, i))
                }
                ,
                e._fillRow = function(e, i, s, n, r) {
                    var o = this.maxWidth
                        , a = this.maxHeight;
                    i += r;
                    for (var h = a - i, l = r, c = 0, u = e.length - 1; u >= 0; u--) {
                        var p = e[u]
                            , d = this._scale * p.scale
                            , f = p.sourceRect
                            , v = p.source
                            , g = Math.floor(d * f.x - r)
                            , m = Math.floor(d * f.y - r)
                            , y = Math.ceil(d * f.height + 2 * r)
                            , w = Math.ceil(d * f.width + 2 * r);
                        if (w > o)
                            throw t.ERR_DIMENSIONS;
                        y > h || l + w > o || (p.img = s,
                        p.rect = new createjs.Rectangle(l,i,w,y),
                        c = c || y,
                        e.splice(u, 1),
                        n[p.index] = [l, i, w, y, s, Math.round(-g + d * v.regX - r), Math.round(-m + d * v.regY - r)],
                        l += w)
                    }
                    return {
                        w: l,
                        h: c
                    }
                }
                ,
                e._endBuild = function() {
                    this.spriteSheet = new createjs.SpriteSheet(this._data),
                    this._data = null,
                    this.progress = 1,
                    this.dispatchEvent("complete")
                }
                ,
                e._run = function() {
                    for (var t = 50 * Math.max(.01, Math.min(.99, this.timeSlice || .3)), e = (new Date).getTime() + t, i = !1; e > (new Date).getTime(); )
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
                }
                ,
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
                    r.translate(Math.ceil(i.x - s.x * e), Math.ceil(i.y - s.y * e)),
                    r.scale(e, e),
                    t.source.draw(r),
                    r.restore(),
                    ++this._index < this._frames.length
                }
                ,
                createjs.SpriteSheetBuilder = createjs.promote(t, "EventDispatcher")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.draw = function() {
                    return !0
                }
                ,
                e.cache = function() {}
                ,
                e.uncache = function() {}
                ,
                e.updateCache = function() {}
                ,
                e.hitTest = function() {}
                ,
                e.localToGlobal = function() {}
                ,
                e.globalToLocal = function() {}
                ,
                e.localToLocal = function() {}
                ,
                e.clone = function() {
                    throw "DOMElement cannot be cloned."
                }
                ,
                e.toString = function() {
                    return "[DOMElement (name=" + this.name + ")]"
                }
                ,
                e._tick = function(t) {
                    var e = this.getStage();
                    e && e.on("drawend", this._handleDrawEnd, this, !0),
                    this.DisplayObject__tick(t)
                }
                ,
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
                }
                ,
                createjs.DOMElement = createjs.promote(t, "DisplayObject")
            }(),
            self.createjs = self.createjs || {},
            function() {
                "use strict";
                function t() {}
                var e = t.prototype;
                e.getBounds = function(t) {
                    return t
                }
                ,
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
                }
                ,
                e.toString = function() {
                    return "[Filter]"
                }
                ,
                e.clone = function() {
                    return new t
                }
                ,
                e._applyFilter = function() {
                    return !0
                }
                ,
                createjs.Filter = t
            }(),
            self.createjs = self.createjs || {},
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
                    var s = Math.pow(this.quality, .2);
                    return (t || new createjs.Rectangle).pad(e * s + 1, i * s + 1, e * s + 1, i * s + 1)
                }
                ,
                e.clone = function() {
                    return new t(this.blurX,this.blurY,this.quality)
                }
                ,
                e.toString = function() {
                    return "[BlurFilter]"
                }
                ,
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
                }
                ,
                createjs.BlurFilter = createjs.promote(t, "Filter")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.toString = function() {
                    return "[AlphaMapFilter]"
                }
                ,
                e._applyFilter = function(t) {
                    if (!this.alphaMap)
                        return !0;
                    if (!this._prepAlphaMap())
                        return !1;
                    for (var e = t.data, i = this._mapData, s = 0, n = e.length; n > s; s += 4)
                        e[s + 3] = i[s] || 0;
                    return !0
                }
                ,
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
                }
                ,
                createjs.AlphaMapFilter = createjs.promote(t, "Filter")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.clone = function() {
                    return new t(this.mask)
                }
                ,
                e.toString = function() {
                    return "[AlphaMaskFilter]"
                }
                ,
                createjs.AlphaMaskFilter = createjs.promote(t, "Filter")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.clone = function() {
                    return new t(this.redMultiplier,this.greenMultiplier,this.blueMultiplier,this.alphaMultiplier,this.redOffset,this.greenOffset,this.blueOffset,this.alphaOffset)
                }
                ,
                e._applyFilter = function(t) {
                    for (var e = t.data, i = e.length, s = 0; i > s; s += 4)
                        e[s] = e[s] * this.redMultiplier + this.redOffset,
                        e[s + 1] = e[s + 1] * this.greenMultiplier + this.greenOffset,
                        e[s + 2] = e[s + 2] * this.blueMultiplier + this.blueOffset,
                        e[s + 3] = e[s + 3] * this.alphaMultiplier + this.alphaOffset;
                    return !0
                }
                ,
                createjs.ColorFilter = createjs.promote(t, "Filter")
            }(),
            self.createjs = self.createjs || {},
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
                }
                ,
                e.reset = function() {
                    return this.copy(t.IDENTITY_MATRIX)
                }
                ,
                e.adjustColor = function(t, e, i, s) {
                    return this.adjustHue(s),
                    this.adjustContrast(e),
                    this.adjustBrightness(t),
                    this.adjustSaturation(i)
                }
                ,
                e.adjustBrightness = function(t) {
                    return 0 == t || isNaN(t) ? this : (t = this._cleanValue(t, 255),
                    this._multiplyMatrix([1, 0, 0, 0, t, 0, 1, 0, 0, t, 0, 0, 1, 0, t, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
                    this)
                }
                ,
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
                }
                ,
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
                }
                ,
                e.adjustHue = function(t) {
                    if (0 == t || isNaN(t))
                        return this;
                    t = this._cleanValue(t, 180) / 180 * Math.PI;
                    var e = Math.cos(t)
                        , i = Math.sin(t)
                        , s = .213
                        , n = .715
                        , r = .072;
                    return this._multiplyMatrix([s + e * (1 - s) + i * -s, n + e * -n + i * -n, r + e * -r + i * (1 - r), 0, 0, s + e * -s + .143 * i, n + e * (1 - n) + .14 * i, r + e * -r + i * -.283, 0, 0, s + e * -s + i * -(1 - s), n + e * -n + i * n, r + e * (1 - r) + i * r, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
                    this
                }
                ,
                e.concat = function(e) {
                    return e = this._fixMatrix(e),
                    e.length != t.LENGTH ? this : (this._multiplyMatrix(e),
                    this)
                }
                ,
                e.clone = function() {
                    return (new t).copy(this)
                }
                ,
                e.toArray = function() {
                    for (var e = [], i = 0, s = t.LENGTH; s > i; i++)
                        e[i] = this[i];
                    return e
                }
                ,
                e.copy = function(e) {
                    for (var i = t.LENGTH, s = 0; i > s; s++)
                        this[s] = e[s];
                    return this
                }
                ,
                e.toString = function() {
                    return "[ColorMatrix]"
                }
                ,
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
                }
                ,
                e._cleanValue = function(t, e) {
                    return Math.min(e, Math.max(-e, t))
                }
                ,
                e._fixMatrix = function(e) {
                    return e instanceof t && (e = e.toArray()),
                    e.length < t.LENGTH ? e = e.slice(0, e.length).concat(t.IDENTITY_MATRIX.slice(e.length, t.LENGTH)) : e.length > t.LENGTH && (e = e.slice(0, t.LENGTH)),
                    e
                }
                ,
                createjs.ColorMatrix = t
            }(),
            self.createjs = self.createjs || {},
            function() {
                "use strict";
                function t(t) {
                    this.matrix = t
                }
                var e = createjs.extend(t, createjs.Filter);
                e.toString = function() {
                    return "[ColorMatrixFilter]"
                }
                ,
                e.clone = function() {
                    return new t(this.matrix)
                }
                ,
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
                }
                ,
                createjs.ColorMatrixFilter = createjs.promote(t, "Filter")
            }(),
            self.createjs = self.createjs || {},
            function() {
                "use strict";
                function t() {
                    throw "Touch cannot be instantiated"
                }
                t.isSupported = function() {
                    return !!("ontouchstart"in window || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0)
                }
                ,
                t.enable = function(e, i, s) {
                    return e && e.canvas && t.isSupported() ? e.__touch ? !0 : (e.__touch = {
                        pointers: {},
                        multitouch: !i,
                        preventDefault: !s,
                        count: 0
                    },
                    "ontouchstart"in window ? t._IOS_enable(e) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && t._IE_enable(e),
                    !0) : !1
                }
                ,
                t.disable = function(e) {
                    e && ("ontouchstart"in window ? t._IOS_disable(e) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && t._IE_disable(e),
                    delete e.__touch)
                }
                ,
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
                }
                ,
                t._IOS_disable = function(t) {
                    var e = t.canvas;
                    if (e) {
                        var i = t.__touch.f;
                        e.removeEventListener("touchstart", i, !1),
                        e.removeEventListener("touchmove", i, !1),
                        e.removeEventListener("touchend", i, !1),
                        e.removeEventListener("touchcancel", i, !1)
                    }
                }
                ,
                t._IOS_handleEvent = function(t, e) {
                    if (t) {
                        t.__touch.preventDefault && e.preventDefault && e.preventDefault();
                        for (var i = e.changedTouches, s = e.type, n = 0, r = i.length; r > n; n++) {
                            var o = i[n]
                                , a = o.identifier;
                            o.target == t.canvas && ("touchstart" == s ? this._handleStart(t, a, e, o.pageX, o.pageY) : "touchmove" == s ? this._handleMove(t, a, e, o.pageX, o.pageY) : ("touchend" == s || "touchcancel" == s) && this._handleEnd(t, a, e))
                        }
                    }
                }
                ,
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
                }
                ,
                t._IE_disable = function(t) {
                    var e = t.__touch.f;
                    void 0 === window.navigator.pointerEnabled ? (window.removeEventListener("MSPointerMove", e, !1),
                    window.removeEventListener("MSPointerUp", e, !1),
                    window.removeEventListener("MSPointerCancel", e, !1),
                    t.canvas && t.canvas.removeEventListener("MSPointerDown", e, !1)) : (window.removeEventListener("pointermove", e, !1),
                    window.removeEventListener("pointerup", e, !1),
                    window.removeEventListener("pointercancel", e, !1),
                    t.canvas && t.canvas.removeEventListener("pointerdown", e, !1))
                }
                ,
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
                }
                ,
                t._handleStart = function(t, e, i, s, n) {
                    var r = t.__touch;
                    if (r.multitouch || !r.count) {
                        var o = r.pointers;
                        o[e] || (o[e] = !0,
                        r.count++,
                        t._handlePointerDown(e, i, s, n))
                    }
                }
                ,
                t._handleMove = function(t, e, i, s, n) {
                    t.__touch.pointers[e] && t._handlePointerMove(e, i, s, n)
                }
                ,
                t._handleEnd = function(t, e, i) {
                    var s = t.__touch
                        , n = s.pointers;
                    n[e] && (s.count--,
                    t._handlePointerUp(e, i, !0),
                    delete n[e])
                }
                ,
                createjs.Touch = t
            }(),
            self.createjs = self.createjs || {},
            function() {
                "use strict";
                var t = createjs.EaselJS = createjs.EaselJS || {};
                t.version = "0.8.0",
                t.buildDate = "Thu, 15 Jan 2015 23:50:40 GMT"
            }()
        },
        get "../libs/lodash"() {
            return (function(t, e) {
                return (function() {
                    function s(t, e) {
                        if (t !== e) {
                            var i = null === t
                                , s = t === T
                                , n = t === t
                                , r = null === e
                                , o = e === T
                                , a = e === e;
                            if (t > e && !r || !n || i && !o && a || s && a)
                                return 1;
                            if (e > t && !i || !a || r && !s && n || o && n)
                                return -1
                        }
                        return 0
                    }
                    function n(t, e, i) {
                        for (var s = t.length, n = i ? s : -1; i ? n-- : ++n < s; )
                            if (e(t[n], n, t))
                                return n;
                        return -1
                    }
                    function r(t, e, i) {
                        if (e !== e)
                            return v(t, i);
                        i -= 1;
                        for (var s = t.length; ++i < s; )
                            if (t[i] === e)
                                return i;
                        return -1
                    }
                    function o(t) {
                        return "function" == typeof t || !1
                    }
                    function a(t) {
                        return null == t ? "" : t + ""
                    }
                    function h(t, e) {
                        for (var i = -1, s = t.length; ++i < s && -1 < e.indexOf(t.charAt(i)); )
                            ;
                        return i
                    }
                    function l(t, e) {
                        for (var i = t.length; i-- && -1 < e.indexOf(t.charAt(i)); )
                            ;
                        return i
                    }
                    function c(t, e) {
                        return s(t.a, e.a) || t.b - e.b
                    }
                    function u(t) {
                        return Fe[t]
                    }
                    function p(t) {
                        return Re[t]
                    }
                    function d(t, e, i) {
                        return e ? t = Ve[t] : i && (t = Ne[t]),
                        "\\" + t
                    }
                    function f(t) {
                        return "\\" + Ne[t]
                    }
                    function v(t, e, i) {
                        var s = t.length;
                        for (e += i ? 0 : -1; i ? e-- : ++e < s; ) {
                            var n = t[e];
                            if (n !== n)
                                return e
                        }
                        return -1
                    }
                    function g(t) {
                        return !!t && "object" == typeof t
                    }
                    function m(t) {
                        return 160 >= t && t >= 9 && 13 >= t || 32 == t || 160 == t || 5760 == t || 6158 == t || t >= 8192 && (8202 >= t || 8232 == t || 8233 == t || 8239 == t || 8287 == t || 12288 == t || 65279 == t)
                    }
                    function y(t, e) {
                        for (var i = -1, s = t.length, n = -1, r = []; ++i < s; )
                            t[i] === e && (t[i] = V,
                            r[++n] = i);
                        return r
                    }
                    function w(t) {
                        for (var e = -1, i = t.length; ++e < i && m(t.charCodeAt(e)); )
                            ;
                        return e
                    }
                    function x(t) {
                        for (var e = t.length; e-- && m(t.charCodeAt(e)); )
                            ;
                        return e
                    }
                    function _(t) {
                        return We[t]
                    }
                    function b(t) {
                        function e(t) {
                            if (g(t) && !(Mo(t) || t instanceof Fe)) {
                                if (t instanceof m)
                                    return t;
                                if (tr.call(t, "__chain__") && tr.call(t, "__wrapped__"))
                                    return Us(t)
                            }
                            return new m(t)
                        }
                        function i() {}
                        function m(t, e, i) {
                            this.__wrapped__ = t,
                            this.__actions__ = i || [],
                            this.__chain__ = !!e
                        }
                        function Fe(t) {
                            this.__wrapped__ = t,
                            this.__actions__ = [],
                            this.__dir__ = 1,
                            this.__filtered__ = !1,
                            this.__iteratees__ = [],
                            this.__takeCount__ = Pr,
                            this.__views__ = []
                        }
                        function Re() {
                            this.__data__ = {}
                        }
                        function We(t) {
                            var e = t ? t.length : 0;
                            for (this.data = {
                                hash: gr(null),
                                set: new cr
                            }; e--; )
                                this.push(t[e])
                        }
                        function Ue(t, e) {
                            var i = t.data;
                            return ("string" == typeof e || gn(e) ? i.set.has(e) : i.hash[e]) ? 0 : -1
                        }
                        function Ve(t, e) {
                            var i = -1
                                , s = t.length;
                            for (e || (e = Wn(s)); ++i < s; )
                                e[i] = t[i];
                            return e
                        }
                        function Ne(t, e) {
                            for (var i = -1, s = t.length; ++i < s && !1 !== e(t[i], i, t); )
                                ;
                            return t
                        }
                        function He(t, e) {
                            for (var i = -1, s = t.length; ++i < s; )
                                if (!e(t[i], i, t))
                                    return !1;
                            return !0
                        }
                        function Ge(t, e) {
                            for (var i = -1, s = t.length, n = -1, r = []; ++i < s; ) {
                                var o = t[i];
                                e(o, i, t) && (r[++n] = o)
                            }
                            return r
                        }
                        function qe(t, e) {
                            for (var i = -1, s = t.length, n = Wn(s); ++i < s; )
                                n[i] = e(t[i], i, t);
                            return n
                        }
                        function Ye(t, e) {
                            for (var i = -1, s = e.length, n = t.length; ++i < s; )
                                t[n + i] = e[i];
                            return t
                        }
                        function Xe(t, e, i, s) {
                            var n = -1
                                , r = t.length;
                            for (s && r && (i = t[++n]); ++n < r; )
                                i = e(i, t[n], n, t);
                            return i
                        }
                        function Je(t, e) {
                            for (var i = -1, s = t.length; ++i < s; )
                                if (e(t[i], i, t))
                                    return !0;
                            return !1
                        }
                        function $e(t, e, i, s) {
                            return t !== T && tr.call(s, i) ? t : e
                        }
                        function Qe(t, e, i) {
                            for (var s = -1, n = Ro(e), r = n.length; ++s < r; ) {
                                var o = n[s]
                                    , a = t[o]
                                    , h = i(a, e[o], o, t, e);
                                (h === h ? h === a : a !== a) && (a !== T || o in t) || (t[o] = h)
                            }
                            return t
                        }
                        function ti(t, e) {
                            return null == e ? t : ii(e, Ro(e), t)
                        }
                        function ei(t, e) {
                            for (var i = -1, s = null == t, n = !s && Ms(t), r = n ? t.length : 0, o = e.length, a = Wn(o); ++i < o; ) {
                                var h = e[i];
                                a[i] = n ? As(h, r) ? t[h] : T : s ? T : t[h]
                            }
                            return a
                        }
                        function ii(t, e, i) {
                            i || (i = {});
                            for (var s = -1, n = e.length; ++s < n; ) {
                                var r = e[s];
                                i[r] = t[r]
                            }
                            return i
                        }
                        function si(t, e, i) {
                            var s = typeof t;
                            return "function" == s ? e === T ? t : Ri(t, e, i) : null == t ? jn : "object" == s ? xi(t) : e === T ? Rn(t) : _i(t, e)
                        }
                        function ni(t, e, i, s, n, r, o) {
                            var a;
                            if (i && (a = n ? i(t, s, n) : i(t)),
                            a !== T)
                                return a;
                            if (!gn(t))
                                return t;
                            if (s = Mo(t)) {
                                if (a = Cs(t),
                                !e)
                                    return Ve(t, a)
                            } else {
                                var h = ir.call(t)
                                    , l = h == X;
                                if (h != Z && h != N && (!l || n))
                                    return Be[h] ? Ss(t, h, e) : n ? t : {};
                                if (a = ks(l ? {} : t),
                                !e)
                                    return ti(a, t)
                            }
                            for (r || (r = []),
                            o || (o = []),
                            n = r.length; n--; )
                                if (r[n] == t)
                                    return o[n];
                            return r.push(t),
                            o.push(a),
                            (s ? Ne : di)(t, function(s, n) {
                                a[n] = ni(s, e, i, n, t, r, o)
                            }),
                            a
                        }
                        function ri(t, e, i) {
                            if ("function" != typeof t)
                                throw new Kn(U);
                            return ur(function() {
                                t.apply(T, i)
                            }, e)
                        }
                        function oi(t, e) {
                            var i = t ? t.length : 0
                                , s = [];
                            if (!i)
                                return s;
                            var n = -1
                                , o = _s()
                                , a = o === r
                                , h = a && e.length >= F && gr && cr ? new We(e) : null
                                , l = e.length;
                            h && (o = Ue,
                            a = !1,
                            e = h);
                            t: for (; ++n < i; )
                                if (h = t[n],
                                a && h === h) {
                                    for (var c = l; c--; )
                                        if (e[c] === h)
                                            continue t;
                                    s.push(h)
                                } else
                                    0 > o(e, h, 0) && s.push(h);
                            return s
                        }
                        function ai(t, e) {
                            var i = !0;
                            return zr(t, function(t, s, n) {
                                return i = !!e(t, s, n)
                            }),
                            i
                        }
                        function hi(t, e, i, s) {
                            var n = s
                                , r = n;
                            return zr(t, function(t, o, a) {
                                o = +e(t, o, a),
                                (i(o, n) || o === s && o === r) && (n = o,
                                r = t)
                            }),
                            r
                        }
                        function li(t, e) {
                            var i = [];
                            return zr(t, function(t, s, n) {
                                e(t, s, n) && i.push(t)
                            }),
                            i
                        }
                        function ci(t, e, i, s) {
                            var n;
                            return i(t, function(t, i, r) {
                                return e(t, i, r) ? (n = s ? i : t,
                                !1) : void 0
                            }),
                            n
                        }
                        function ui(t, e, i, s) {
                            s || (s = []);
                            for (var n = -1, r = t.length; ++n < r; ) {
                                var o = t[n];
                                g(o) && Ms(o) && (i || Mo(o) || pn(o)) ? e ? ui(o, e, i, s) : Ye(s, o) : i || (s[s.length] = o)
                            }
                            return s
                        }
                        function pi(t, e) {
                            Lr(t, e, Pn)
                        }
                        function di(t, e) {
                            return Lr(t, e, Ro)
                        }
                        function fi(t, e) {
                            return Br(t, e, Ro)
                        }
                        function vi(t, e) {
                            for (var i = -1, s = e.length, n = -1, r = []; ++i < s; ) {
                                var o = e[i];
                                vn(t[o]) && (r[++n] = o)
                            }
                            return r
                        }
                        function gi(t, e, i) {
                            if (null != t) {
                                i !== T && i in Rs(t) && (e = [i]),
                                i = 0;
                                for (var s = e.length; null != t && s > i; )
                                    t = t[e[i++]];
                                return i && i == s ? t : T
                            }
                        }
                        function mi(t, e, i, s, n, r) {
                            if (t === e)
                                t = !0;
                            else if (null == t || null == e || !gn(t) && !g(e))
                                t = t !== t && e !== e;
                            else
                                t: {
                                    var o = mi
                                        , a = Mo(t)
                                        , h = Mo(e)
                                        , l = H
                                        , c = H;
                                    a || (l = ir.call(t),
                                    l == N ? l = Z : l != Z && (a = bn(t))),
                                    h || (c = ir.call(e),
                                    c == N ? c = Z : c != Z && bn(e));
                                    var u = l == Z
                                        , h = c == Z
                                        , c = l == c;
                                    if (!c || a || u) {
                                        if (!s && (l = u && tr.call(t, "__wrapped__"),
                                        h = h && tr.call(e, "__wrapped__"),
                                        l || h)) {
                                            t = o(l ? t.value() : t, h ? e.value() : e, i, s, n, r);
                                            break t
                                        }
                                        if (c) {
                                            for (n || (n = []),
                                            r || (r = []),
                                            l = n.length; l--; )
                                                if (n[l] == t) {
                                                    t = r[l] == e;
                                                    break t
                                                }
                                            n.push(t),
                                            r.push(e),
                                            t = (a ? gs : ys)(t, e, o, i, s, n, r),
                                            n.pop(),
                                            r.pop()
                                        } else
                                            t = !1
                                    } else
                                        t = ms(t, e, l)
                                }
                            return t
                        }
                        function yi(t, e, i) {
                            var s = e.length
                                , n = s
                                , r = !i;
                            if (null == t)
                                return !n;
                            for (t = Rs(t); s--; ) {
                                var o = e[s];
                                if (r && o[2] ? o[1] !== t[o[0]] : !(o[0]in t))
                                    return !1
                            }
                            for (; ++s < n; ) {
                                var o = e[s]
                                    , a = o[0]
                                    , h = t[a]
                                    , l = o[1];
                                if (r && o[2]) {
                                    if (h === T && !(a in t))
                                        return !1
                                } else if (o = i ? i(h, l, a) : T,
                                o === T ? !mi(l, h, i, !0) : !o)
                                    return !1
                            }
                            return !0
                        }
                        function wi(t, e) {
                            var i = -1
                                , s = Ms(t) ? Wn(t.length) : [];
                            return zr(t, function(t, n, r) {
                                s[++i] = e(t, n, r)
                            }),
                            s
                        }
                        function xi(t) {
                            var e = bs(t);
                            if (1 == e.length && e[0][2]) {
                                var i = e[0][0]
                                    , s = e[0][1];
                                return function(t) {
                                    return null == t ? !1 : t[i] === s && (s !== T || i in Rs(t))
                                }
                            }
                            return function(t) {
                                return yi(t, e)
                            }
                        }
                        function _i(t, e) {
                            var i = Mo(t)
                                , s = Is(t) && e === e && !gn(e)
                                , n = t + "";
                            return t = Ws(t),
                            function(r) {
                                if (null == r)
                                    return !1;
                                var o = n;
                                if (r = Rs(r),
                                !(!i && s || o in r)) {
                                    if (r = 1 == t.length ? r : gi(r, Mi(t, 0, -1)),
                                    null == r)
                                        return !1;
                                    o = qs(t),
                                    r = Rs(r)
                                }
                                return r[o] === e ? e !== T || o in r : mi(e, r[o], T, !0)
                            }
                        }
                        function bi(t, e, i, s, n) {
                            if (!gn(t))
                                return t;
                            var r = Ms(e) && (Mo(e) || bn(e))
                                , o = r ? T : Ro(e);
                            return Ne(o || e, function(a, h) {
                                if (o && (h = a,
                                a = e[h]),
                                g(a)) {
                                    s || (s = []),
                                    n || (n = []);
                                    t: {
                                        for (var l = h, c = s, u = n, p = c.length, d = e[l]; p--; )
                                            if (c[p] == d) {
                                                t[l] = u[p];
                                                break t
                                            }
                                        var p = t[l]
                                            , f = i ? i(p, d, l, t, e) : T
                                            , v = f === T;
                                        v && (f = d,
                                        Ms(d) && (Mo(d) || bn(d)) ? f = Mo(p) ? p : Ms(p) ? Ve(p) : [] : wn(d) || pn(d) ? f = pn(p) ? kn(p) : wn(p) ? p : {} : v = !1),
                                        c.push(d),
                                        u.push(f),
                                        v ? t[l] = bi(f, d, i, c, u) : (f === f ? f !== p : p === p) && (t[l] = f)
                                    }
                                } else
                                    l = t[h],
                                    c = i ? i(l, a, h, t, e) : T,
                                    (u = c === T) && (c = a),
                                    c === T && (!r || h in t) || !u && (c === c ? c === l : l !== l) || (t[h] = c)
                            }),
                            t
                        }
                        function Ti(t) {
                            return function(e) {
                                return null == e ? T : e[t]
                            }
                        }
                        function Ci(t) {
                            var e = t + "";
                            return t = Ws(t),
                            function(i) {
                                return gi(i, t, e)
                            }
                        }
                        function ki(t, e) {
                            for (var i = t ? e.length : 0; i--; ) {
                                var s = e[i];
                                if (s != n && As(s)) {
                                    var n = s;
                                    pr.call(t, s, 1)
                                }
                            }
                        }
                        function Si(t, e) {
                            return t + mr(kr() * (e - t + 1))
                        }
                        function Pi(t, e, i, s, n) {
                            return n(t, function(t, n, r) {
                                i = s ? (s = !1,
                                t) : e(i, t, n, r)
                            }),
                            i
                        }
                        function Mi(t, e, i) {
                            var s = -1
                                , n = t.length;
                            for (e = null == e ? 0 : +e || 0,
                            0 > e && (e = -e > n ? 0 : n + e),
                            i = i === T || i > n ? n : +i || 0,
                            0 > i && (i += n),
                            n = e > i ? 0 : i - e >>> 0,
                            e >>>= 0,
                            i = Wn(n); ++s < n; )
                                i[s] = t[s + e];
                            return i
                        }
                        function Ai(t, e) {
                            var i;
                            return zr(t, function(t, s, n) {
                                return i = e(t, s, n),
                                !i
                            }),
                            !!i
                        }
                        function Di(t, e) {
                            var i = t.length;
                            for (t.sort(e); i--; )
                                t[i] = t[i].c;
                            return t
                        }
                        function Ii(t, e, i) {
                            var n = ws()
                                , r = -1;
                            return e = qe(e, function(t) {
                                return n(t)
                            }),
                            t = wi(t, function(t) {
                                return {
                                    a: qe(e, function(e) {
                                        return e(t)
                                    }),
                                    b: ++r,
                                    c: t
                                }
                            }),
                            Di(t, function(t, e) {
                                var n;
                                t: {
                                    for (var r = -1, o = t.a, a = e.a, h = o.length, l = i.length; ++r < h; )
                                        if (n = s(o[r], a[r])) {
                                            if (r >= l)
                                                break t;
                                            r = i[r],
                                            n *= "asc" === r || !0 === r ? 1 : -1;
                                            break t
                                        }
                                    n = t.b - e.b
                                }
                                return n
                            })
                        }
                        function Ei(t, e) {
                            var i = 0;
                            return zr(t, function(t, s, n) {
                                i += +e(t, s, n) || 0
                            }),
                            i
                        }
                        function Oi(t, e) {
                            var i = -1
                                , s = _s()
                                , n = t.length
                                , o = s === r
                                , a = o && n >= F
                                , h = a && gr && cr ? new We(void 0) : null
                                , l = [];
                            h ? (s = Ue,
                            o = !1) : (a = !1,
                            h = e ? [] : l);
                            t: for (; ++i < n; ) {
                                var c = t[i]
                                    , u = e ? e(c, i, t) : c;
                                if (o && c === c) {
                                    for (var p = h.length; p--; )
                                        if (h[p] === u)
                                            continue t;
                                    e && h.push(u),
                                    l.push(c)
                                } else
                                    0 > s(h, u, 0) && ((e || a) && h.push(u),
                                    l.push(c))
                            }
                            return l
                        }
                        function zi(t, e) {
                            for (var i = -1, s = e.length, n = Wn(s); ++i < s; )
                                n[i] = t[e[i]];
                            return n
                        }
                        function ji(t, e, i, s) {
                            for (var n = t.length, r = s ? n : -1; (s ? r-- : ++r < n) && e(t[r], r, t); )
                                ;
                            return i ? Mi(t, s ? 0 : r, s ? r + 1 : n) : Mi(t, s ? r + 1 : 0, s ? n : r)
                        }
                        function Li(t, e) {
                            var i = t;
                            i instanceof Fe && (i = i.value());
                            for (var s = -1, n = e.length; ++s < n; )
                                var r = e[s]
                                    , i = r.func.apply(r.thisArg, Ye([i], r.args));
                            return i
                        }
                        function Bi(t, e, i) {
                            var s = 0
                                , n = t ? t.length : s;
                            if ("number" == typeof e && e === e && Ar >= n) {
                                for (; n > s; ) {
                                    var r = s + n >>> 1
                                        , o = t[r];
                                    (i ? e >= o : e > o) && null !== o ? s = r + 1 : n = r
                                }
                                return n
                            }
                            return Fi(t, e, jn, i)
                        }
                        function Fi(t, e, i, s) {
                            e = i(e);
                            for (var n = 0, r = t ? t.length : 0, o = e !== e, a = null === e, h = e === T; r > n; ) {
                                var l = mr((n + r) / 2)
                                    , c = i(t[l])
                                    , u = c !== T
                                    , p = c === c;
                                (o ? p || s : a ? p && u && (s || null != c) : h ? p && (s || u) : null == c ? 0 : s ? e >= c : e > c) ? n = l + 1 : r = l
                            }
                            return br(r, Mr)
                        }
                        function Ri(t, e, i) {
                            if ("function" != typeof t)
                                return jn;
                            if (e === T)
                                return t;
                            switch (i) {
                            case 1:
                                return function(i) {
                                    return t.call(e, i)
                                }
                                ;
                            case 3:
                                return function(i, s, n) {
                                    return t.call(e, i, s, n)
                                }
                                ;
                            case 4:
                                return function(i, s, n, r) {
                                    return t.call(e, i, s, n, r)
                                }
                                ;
                            case 5:
                                return function(i, s, n, r, o) {
                                    return t.call(e, i, s, n, r, o)
                                }
                            }
                            return function() {
                                return t.apply(e, arguments)
                            }
                        }
                        function Wi(t) {
                            var e = new rr(t.byteLength);
                            return new dr(e).set(new dr(t)),
                            e
                        }
                        function Ui(t, e, i) {
                            for (var s = i.length, n = -1, r = _r(t.length - s, 0), o = -1, a = e.length, h = Wn(a + r); ++o < a; )
                                h[o] = e[o];
                            for (; ++n < s; )
                                h[i[n]] = t[n];
                            for (; r--; )
                                h[o++] = t[n++];
                            return h
                        }
                        function Vi(t, e, i) {
                            for (var s = -1, n = i.length, r = -1, o = _r(t.length - n, 0), a = -1, h = e.length, l = Wn(o + h); ++r < o; )
                                l[r] = t[r];
                            for (o = r; ++a < h; )
                                l[o + a] = e[a];
                            for (; ++s < n; )
                                l[o + i[s]] = t[r++];
                            return l
                        }
                        function Ni(t, e) {
                            return function(i, s, n) {
                                var r = e ? e() : {};
                                if (s = ws(s, n, 3),
                                Mo(i)) {
                                    n = -1;
                                    for (var o = i.length; ++n < o; ) {
                                        var a = i[n];
                                        t(r, a, s(a, n, i), i)
                                    }
                                } else
                                    zr(i, function(e, i, n) {
                                        t(r, e, s(e, i, n), n)
                                    });
                                return r
                            }
                        }
                        function Hi(t) {
                            return cn(function(e, i) {
                                var s = -1
                                    , n = null == e ? 0 : i.length
                                    , r = n > 2 ? i[n - 2] : T
                                    , o = n > 2 ? i[2] : T
                                    , a = n > 1 ? i[n - 1] : T;
                                for ("function" == typeof r ? (r = Ri(r, a, 5),
                                n -= 2) : (r = "function" == typeof a ? a : T,
                                n -= r ? 1 : 0),
                                o && Ds(i[0], i[1], o) && (r = 3 > n ? T : r,
                                n = 1); ++s < n; )
                                    (o = i[s]) && t(e, o, r);
                                return e
                            })
                        }
                        function Gi(t, e) {
                            return function(i, s) {
                                var n = i ? Wr(i) : 0;
                                if (!Os(n))
                                    return t(i, s);
                                for (var r = e ? n : -1, o = Rs(i); (e ? r-- : ++r < n) && !1 !== s(o[r], r, o); )
                                    ;
                                return i
                            }
                        }
                        function qi(t) {
                            return function(e, i, s) {
                                var n = Rs(e);
                                s = s(e);
                                for (var r = s.length, o = t ? r : -1; t ? o-- : ++o < r; ) {
                                    var a = s[o];
                                    if (!1 === i(n[a], a, n))
                                        break
                                }
                                return e
                            }
                        }
                        function Yi(t, e) {
                            function i() {
                                return (this && this !== Ke && this instanceof i ? s : t).apply(e, arguments)
                            }
                            var s = Ki(t);
                            return i
                        }
                        function Xi(t) {
                            return function(e) {
                                var i = -1;
                                e = On(Dn(e));
                                for (var s = e.length, n = ""; ++i < s; )
                                    n = t(n, e[i], i);
                                return n
                            }
                        }
                        function Ki(t) {
                            return function() {
                                var e = arguments;
                                switch (e.length) {
                                case 0:
                                    return new t;
                                case 1:
                                    return new t(e[0]);
                                case 2:
                                    return new t(e[0],e[1]);
                                case 3:
                                    return new t(e[0],e[1],e[2]);
                                case 4:
                                    return new t(e[0],e[1],e[2],e[3]);
                                case 5:
                                    return new t(e[0],e[1],e[2],e[3],e[4]);
                                case 6:
                                    return new t(e[0],e[1],e[2],e[3],e[4],e[5]);
                                case 7:
                                    return new t(e[0],e[1],e[2],e[3],e[4],e[5],e[6])
                                }
                                var i = Or(t.prototype)
                                    , e = t.apply(i, e);
                                return gn(e) ? e : i
                            }
                        }
                        function Zi(t) {
                            function e(i, s, n) {
                                return n && Ds(i, s, n) && (s = T),
                                i = vs(i, t, T, T, T, T, T, s),
                                i.placeholder = e.placeholder,
                                i
                            }
                            return e
                        }
                        function Ji(t, e) {
                            return cn(function(i) {
                                var s = i[0];
                                return null == s ? s : (i.push(e),
                                t.apply(T, i))
                            })
                        }
                        function $i(t, e) {
                            return function(i, s, n) {
                                if (n && Ds(i, s, n) && (s = T),
                                s = ws(s, n, 3),
                                1 == s.length) {
                                    n = i = Mo(i) ? i : Fs(i);
                                    for (var r = s, o = -1, a = n.length, h = e, l = h; ++o < a; ) {
                                        var c = n[o]
                                            , u = +r(c);
                                        t(u, h) && (h = u,
                                        l = c)
                                    }
                                    if (n = l,
                                    !i.length || n !== e)
                                        return n
                                }
                                return hi(i, s, t, e)
                            }
                        }
                        function Qi(t, e) {
                            return function(i, s, r) {
                                return s = ws(s, r, 3),
                                Mo(i) ? (s = n(i, s, e),
                                s > -1 ? i[s] : T) : ci(i, s, t)
                            }
                        }
                        function ts(t) {
                            return function(e, i, s) {
                                return e && e.length ? (i = ws(i, s, 3),
                                n(e, i, t)) : -1
                            }
                        }
                        function es(t) {
                            return function(e, i, s) {
                                return i = ws(i, s, 3),
                                ci(e, i, t, !0)
                            }
                        }
                        function is(t) {
                            return function() {
                                for (var e, i = arguments.length, s = t ? i : -1, n = 0, r = Wn(i); t ? s-- : ++s < i; ) {
                                    var o = r[n++] = arguments[s];
                                    if ("function" != typeof o)
                                        throw new Kn(U);
                                    !e && m.prototype.thru && "wrapper" == xs(o) && (e = new m([],!0))
                                }
                                for (s = e ? -1 : i; ++s < i; ) {
                                    var o = r[s]
                                        , n = xs(o)
                                        , a = "wrapper" == n ? Rr(o) : T;
                                    e = a && Es(a[0]) && a[1] == (E | M | D | O) && !a[4].length && 1 == a[9] ? e[xs(a[0])].apply(e, a[3]) : 1 == o.length && Es(o) ? e[n]() : e.thru(o)
                                }
                                return function() {
                                    var t = arguments
                                        , s = t[0];
                                    if (e && 1 == t.length && Mo(s) && s.length >= F)
                                        return e.plant(s).value();
                                    for (var n = 0, t = i ? r[n].apply(this, t) : s; ++n < i; )
                                        t = r[n].call(this, t);
                                    return t
                                }
                            }
                        }
                        function ss(t, e) {
                            return function(i, s, n) {
                                return "function" == typeof s && n === T && Mo(i) ? t(i, s) : e(i, Ri(s, n, 3))
                            }
                        }
                        function ns(t) {
                            return function(e, i, s) {
                                return ("function" != typeof i || s !== T) && (i = Ri(i, s, 3)),
                                t(e, i, Pn)
                            }
                        }
                        function rs(t) {
                            return function(e, i, s) {
                                return ("function" != typeof i || s !== T) && (i = Ri(i, s, 3)),
                                t(e, i)
                            }
                        }
                        function os(t) {
                            return function(e, i, s) {
                                var n = {};
                                return i = ws(i, s, 3),
                                di(e, function(e, s, r) {
                                    r = i(e, s, r),
                                    s = t ? r : s,
                                    e = t ? e : r,
                                    n[s] = e
                                }),
                                n
                            }
                        }
                        function as(t) {
                            return function(e, i, s) {
                                return e = a(e),
                                (t ? e : "") + us(e, i, s) + (t ? "" : e)
                            }
                        }
                        function hs(t) {
                            var e = cn(function(i, s) {
                                var n = y(s, e.placeholder);
                                return vs(i, t, T, s, n)
                            });
                            return e
                        }
                        function ls(t, e) {
                            return function(i, s, n, r) {
                                var o = 3 > arguments.length;
                                return "function" == typeof s && r === T && Mo(i) ? t(i, s, n, o) : Pi(i, ws(s, r, 4), n, o, e)
                            }
                        }
                        function cs(t, e, i, s, n, r, o, a, h, l) {
                            function c() {
                                for (var w = arguments.length, x = w, _ = Wn(w); x--; )
                                    _[x] = arguments[x];
                                if (s && (_ = Ui(_, s, n)),
                                r && (_ = Vi(_, r, o)),
                                f || g) {
                                    var x = c.placeholder
                                        , b = y(_, x)
                                        , w = w - b.length;
                                    if (l > w) {
                                        var C = a ? Ve(a) : T
                                            , w = _r(l - w, 0)
                                            , P = f ? b : T
                                            , b = f ? T : b
                                            , M = f ? _ : T
                                            , _ = f ? T : _;
                                        return e |= f ? D : I,
                                        e &= ~(f ? I : D),
                                        v || (e &= ~(k | S)),
                                        _ = [t, e, i, M, P, _, b, C, h, w],
                                        C = cs.apply(T, _),
                                        Es(t) && Ur(C, _),
                                        C.placeholder = x,
                                        C
                                    }
                                }
                                if (x = p ? i : this,
                                C = d ? x[t] : t,
                                a)
                                    for (w = _.length,
                                    P = br(a.length, w),
                                    b = Ve(_); P--; )
                                        M = a[P],
                                        _[P] = As(M, w) ? b[M] : T;
                                return u && h < _.length && (_.length = h),
                                this && this !== Ke && this instanceof c && (C = m || Ki(t)),
                                C.apply(x, _)
                            }
                            var u = e & E
                                , p = e & k
                                , d = e & S
                                , f = e & M
                                , v = e & P
                                , g = e & A
                                , m = d ? T : Ki(t);
                            return c
                        }
                        function us(t, e, i) {
                            return t = t.length,
                            e = +e,
                            e > t && wr(e) ? (e -= t,
                            i = null == i ? " " : i + "",
                            In(i, vr(e / i.length)).slice(0, e)) : ""
                        }
                        function ps(t, e, i, s) {
                            function n() {
                                for (var e = -1, a = arguments.length, h = -1, l = s.length, c = Wn(l + a); ++h < l; )
                                    c[h] = s[h];
                                for (; a--; )
                                    c[h++] = arguments[++e];
                                return (this && this !== Ke && this instanceof n ? o : t).apply(r ? i : this, c)
                            }
                            var r = e & k
                                , o = Ki(t);
                            return n
                        }
                        function ds(t) {
                            var e = Hn[t];
                            return function(t, i) {
                                return (i = i === T ? 0 : +i || 0) ? (i = hr(10, i),
                                e(t * i) / i) : e(t)
                            }
                        }
                        function fs(t) {
                            return function(e, i, s, n) {
                                var r = ws(s);
                                return null == s && r === si ? Bi(e, i, t) : Fi(e, i, r(s, n, 1), t)
                            }
                        }
                        function vs(t, e, i, s, n, r, o, a) {
                            var h = e & S;
                            if (!h && "function" != typeof t)
                                throw new Kn(U);
                            var l = s ? s.length : 0;
                            if (l || (e &= ~(D | I),
                            s = n = T),
                            l -= n ? n.length : 0,
                            e & I) {
                                var c = s
                                    , u = n;
                                s = n = T
                            }
                            var p = h ? T : Rr(t);
                            return i = [t, e, i, s, n, c, u, r, o, a],
                            p && (s = i[1],
                            e = p[1],
                            a = s | e,
                            n = e == E && s == M || e == E && s == O && i[7].length <= p[8] || e == (E | O) && s == M,
                            (E > a || n) && (e & k && (i[2] = p[2],
                            a |= s & k ? 0 : P),
                            (s = p[3]) && (n = i[3],
                            i[3] = n ? Ui(n, s, p[4]) : Ve(s),
                            i[4] = n ? y(i[3], V) : Ve(p[4])),
                            (s = p[5]) && (n = i[5],
                            i[5] = n ? Vi(n, s, p[6]) : Ve(s),
                            i[6] = n ? y(i[5], V) : Ve(p[6])),
                            (s = p[7]) && (i[7] = Ve(s)),
                            e & E && (i[8] = null == i[8] ? p[8] : br(i[8], p[8])),
                            null == i[9] && (i[9] = p[9]),
                            i[0] = p[0],
                            i[1] = a),
                            e = i[1],
                            a = i[9]),
                            i[9] = null == a ? h ? 0 : t.length : _r(a - l, 0) || 0,
                            (p ? Fr : Ur)(e == k ? Yi(i[0], i[2]) : e != D && e != (k | D) || i[4].length ? cs.apply(T, i) : ps.apply(T, i), i)
                        }
                        function gs(t, e, i, s, n, r, o) {
                            var a = -1
                                , h = t.length
                                , l = e.length;
                            if (h != l && (!n || h >= l))
                                return !1;
                            for (; ++a < h; ) {
                                var c = t[a]
                                    , l = e[a]
                                    , u = s ? s(n ? l : c, n ? c : l, a) : T;
                                if (u !== T) {
                                    if (u)
                                        continue;
                                    return !1
                                }
                                if (n) {
                                    if (!Je(e, function(t) {
                                        return c === t || i(c, t, s, n, r, o)
                                    }))
                                        return !1
                                } else if (c !== l && !i(c, l, s, n, r, o))
                                    return !1
                            }
                            return !0
                        }
                        function ms(t, e, i) {
                            switch (i) {
                            case G:
                            case q:
                                return +t == +e;
                            case Y:
                                return t.name == e.name && t.message == e.message;
                            case K:
                                return t != +t ? e != +e : t == +e;
                            case J:
                            case $:
                                return t == e + ""
                            }
                            return !1
                        }
                        function ys(t, e, i, s, n, r, o) {
                            var a = Ro(t)
                                , h = a.length
                                , l = Ro(e).length;
                            if (h != l && !n)
                                return !1;
                            for (l = h; l--; ) {
                                var c = a[l];
                                if (!(n ? c in e : tr.call(e, c)))
                                    return !1
                            }
                            for (var u = n; ++l < h; ) {
                                var c = a[l]
                                    , p = t[c]
                                    , d = e[c]
                                    , f = s ? s(n ? d : p, n ? p : d, c) : T;
                                if (f === T ? !i(p, d, s, n, r, o) : !f)
                                    return !1;
                                u || (u = "constructor" == c)
                            }
                            return u || (i = t.constructor,
                            s = e.constructor,
                            !(i != s && "constructor"in t && "constructor"in e) || "function" == typeof i && i instanceof i && "function" == typeof s && s instanceof s) ? !0 : !1
                        }
                        function ws(t, i, s) {
                            var n = e.callback || zn
                                , n = n === zn ? si : n;
                            return s ? n(t, i, s) : n
                        }
                        function xs(t) {
                            for (var e = t.name + "", i = Er[e], s = i ? i.length : 0; s--; ) {
                                var n = i[s]
                                    , r = n.func;
                                if (null == r || r == t)
                                    return n.name
                            }
                            return e
                        }
                        function _s(t, i, s) {
                            var n = e.indexOf || Gs
                                , n = n === Gs ? r : n;
                            return t ? n(t, i, s) : n
                        }
                        function bs(t) {
                            t = Mn(t);
                            for (var e = t.length; e--; ) {
                                var i = t[e][1];
                                t[e][2] = i === i && !gn(i)
                            }
                            return t
                        }
                        function Ts(t, e) {
                            var i = null == t ? T : t[e];
                            return mn(i) ? i : T
                        }
                        function Cs(t) {
                            var e = t.length
                                , i = new t.constructor(e);
                            return e && "string" == typeof t[0] && tr.call(t, "index") && (i.index = t.index,
                            i.input = t.input),
                            i
                        }
                        function ks(t) {
                            return t = t.constructor,
                            "function" == typeof t && t instanceof t || (t = qn),
                            new t
                        }
                        function Ss(t, e, i) {
                            var s = t.constructor;
                            switch (e) {
                            case Q:
                                return Wi(t);
                            case G:
                            case q:
                                return new s(+t);
                            case te:
                            case ee:
                            case ie:
                            case se:
                            case ne:
                            case re:
                            case oe:
                            case ae:
                            case he:
                                return e = t.buffer,
                                new s(i ? Wi(e) : e,t.byteOffset,t.length);
                            case K:
                            case $:
                                return new s(t);
                            case J:
                                var n = new s(t.source,Pe.exec(t));
                                n.lastIndex = t.lastIndex
                            }
                            return n
                        }
                        function Ps(t, e, i) {
                            return null == t || Is(e, t) || (e = Ws(e),
                            t = 1 == e.length ? t : gi(t, Mi(e, 0, -1)),
                            e = qs(e)),
                            e = null == t ? t : t[e],
                            null == e ? T : e.apply(t, i)
                        }
                        function Ms(t) {
                            return null != t && Os(Wr(t))
                        }
                        function As(t, e) {
                            return t = "number" == typeof t || De.test(t) ? +t : -1,
                            e = null == e ? Dr : e,
                            t > -1 && 0 == t % 1 && e > t
                        }
                        function Ds(t, e, i) {
                            if (!gn(i))
                                return !1;
                            var s = typeof e;
                            return ("number" == s ? Ms(i) && As(e, i.length) : "string" == s && e in i) ? (e = i[e],
                            t === t ? t === e : e !== e) : !1
                        }
                        function Is(t, e) {
                            var i = typeof t;
                            return "string" == i && xe.test(t) || "number" == i ? !0 : Mo(t) ? !1 : !we.test(t) || null != e && t in Rs(e)
                        }
                        function Es(t) {
                            var i = xs(t)
                                , s = e[i];
                            return "function" == typeof s && i in Fe.prototype ? t === s ? !0 : (i = Rr(s),
                            !!i && t === i[0]) : !1
                        }
                        function Os(t) {
                            return "number" == typeof t && t > -1 && 0 == t % 1 && Dr >= t
                        }
                        function zs(t, e) {
                            return t === T ? e : Ao(t, e, zs)
                        }
                        function js(t, e) {
                            t = Rs(t);
                            for (var i = -1, s = e.length, n = {}; ++i < s; ) {
                                var r = e[i];
                                r in t && (n[r] = t[r])
                            }
                            return n
                        }
                        function Ls(t, e) {
                            var i = {};
                            return pi(t, function(t, s, n) {
                                e(t, s, n) && (i[s] = t)
                            }),
                            i
                        }
                        function Bs(t) {
                            for (var e = Pn(t), i = e.length, s = i && t.length, n = !!s && Os(s) && (Mo(t) || pn(t)), r = -1, o = []; ++r < i; ) {
                                var a = e[r];
                                (n && As(a, s) || tr.call(t, a)) && o.push(a)
                            }
                            return o
                        }
                        function Fs(t) {
                            return null == t ? [] : Ms(t) ? gn(t) ? t : qn(t) : An(t)
                        }
                        function Rs(t) {
                            return gn(t) ? t : qn(t)
                        }
                        function Ws(t) {
                            if (Mo(t))
                                return t;
                            var e = [];
                            return a(t).replace(_e, function(t, i, s, n) {
                                e.push(s ? n.replace(ke, "$1") : i || t)
                            }),
                            e
                        }
                        function Us(t) {
                            return t instanceof Fe ? t.clone() : new m(t.__wrapped__,t.__chain__,Ve(t.__actions__))
                        }
                        function Vs(t, e, i) {
                            return t && t.length ? ((i ? Ds(t, e, i) : null == e) && (e = 1),
                            Mi(t, 0 > e ? 0 : e)) : []
                        }
                        function Ns(t, e, i) {
                            var s = t ? t.length : 0;
                            return s ? ((i ? Ds(t, e, i) : null == e) && (e = 1),
                            e = s - (+e || 0),
                            Mi(t, 0, 0 > e ? 0 : e)) : []
                        }
                        function Hs(t) {
                            return t ? t[0] : T
                        }
                        function Gs(t, e, i) {
                            var s = t ? t.length : 0;
                            if (!s)
                                return -1;
                            if ("number" == typeof i)
                                i = 0 > i ? _r(s + i, 0) : i;
                            else if (i)
                                return i = Bi(t, e),
                                s > i && (e === e ? e === t[i] : t[i] !== t[i]) ? i : -1;
                            return r(t, e, i || 0)
                        }
                        function qs(t) {
                            var e = t ? t.length : 0;
                            return e ? t[e - 1] : T
                        }
                        function Ys(t) {
                            return Vs(t, 1)
                        }
                        function Xs(t, e, i, s) {
                            if (!t || !t.length)
                                return [];
                            null != e && "boolean" != typeof e && (s = i,
                            i = Ds(t, e, s) ? T : e,
                            e = !1);
                            var n = ws();
                            if ((null != i || n !== si) && (i = n(i, s, 3)),
                            e && _s() === r) {
                                e = i;
                                var o;
                                i = -1,
                                s = t.length;
                                for (var n = -1, a = []; ++i < s; ) {
                                    var h = t[i]
                                        , l = e ? e(h, i, t) : h;
                                    i && o === l || (o = l,
                                    a[++n] = h)
                                }
                                t = a
                            } else
                                t = Oi(t, i);
                            return t
                        }
                        function Ks(t) {
                            if (!t || !t.length)
                                return [];
                            var e = -1
                                , i = 0;
                            t = Ge(t, function(t) {
                                return Ms(t) ? (i = _r(t.length, i),
                                !0) : void 0
                            });
                            for (var s = Wn(i); ++e < i; )
                                s[e] = qe(t, Ti(e));
                            return s
                        }
                        function Zs(t, e, i) {
                            return t && t.length ? (t = Ks(t),
                            null == e ? t : (e = Ri(e, i, 4),
                            qe(t, function(t) {
                                return Xe(t, e, T, !0)
                            }))) : []
                        }
                        function Js(t, e) {
                            var i = -1
                                , s = t ? t.length : 0
                                , n = {};
                            for (!s || e || Mo(t[0]) || (e = []); ++i < s; ) {
                                var r = t[i];
                                e ? n[r] = e[i] : r && (n[r[0]] = r[1])
                            }
                            return n
                        }
                        function $s(t) {
                            return t = e(t),
                            t.__chain__ = !0,
                            t
                        }
                        function Qs(t, e, i) {
                            return e.call(i, t)
                        }
                        function tn(t, e, i) {
                            var s = Mo(t) ? He : ai;
                            return i && Ds(t, e, i) && (e = T),
                            ("function" != typeof e || i !== T) && (e = ws(e, i, 3)),
                            s(t, e)
                        }
                        function en(t, e, i) {
                            var s = Mo(t) ? Ge : li;
                            return e = ws(e, i, 3),
                            s(t, e)
                        }
                        function sn(t, e, i, s) {
                            var n = t ? Wr(t) : 0;
                            return Os(n) || (t = An(t),
                            n = t.length),
                            i = "number" != typeof i || s && Ds(e, i, s) ? 0 : 0 > i ? _r(n + i, 0) : i || 0,
                            "string" == typeof t || !Mo(t) && _n(t) ? n >= i && -1 < t.indexOf(e, i) : !!n && -1 < _s(t, e, i)
                        }
                        function nn(t, e, i) {
                            var s = Mo(t) ? qe : wi;
                            return e = ws(e, i, 3),
                            s(t, e)
                        }
                        function rn(t, e, i) {
                            if (i ? Ds(t, e, i) : null == e) {
                                t = Fs(t);
                                var s = t.length;
                                return s > 0 ? t[Si(0, s - 1)] : T
                            }
                            i = -1,
                            t = Cn(t);
                            var s = t.length
                                , n = s - 1;
                            for (e = br(0 > e ? 0 : +e || 0, s); ++i < e; ) {
                                var s = Si(i, n)
                                    , r = t[s];
                                t[s] = t[i],
                                t[i] = r
                            }
                            return t.length = e,
                            t
                        }
                        function on(t, e, i) {
                            var s = Mo(t) ? Je : Ai;
                            return i && Ds(t, e, i) && (e = T),
                            ("function" != typeof e || i !== T) && (e = ws(e, i, 3)),
                            s(t, e)
                        }
                        function an(t, e) {
                            var i;
                            if ("function" != typeof e) {
                                if ("function" != typeof t)
                                    throw new Kn(U);
                                var s = t;
                                t = e,
                                e = s
                            }
                            return function() {
                                return 0 < --t && (i = e.apply(this, arguments)),
                                1 >= t && (e = T),
                                i
                            }
                        }
                        function hn(t, e, i) {
                            function s(e, i) {
                                i && or(i),
                                h = p = d = T,
                                e && (f = fo(),
                                l = t.apply(u, a),
                                p || h || (a = u = T))
                            }
                            function n() {
                                var t = e - (fo() - c);
                                0 >= t || t > e ? s(d, h) : p = ur(n, t)
                            }
                            function r() {
                                s(g, p)
                            }
                            function o() {
                                if (a = arguments,
                                c = fo(),
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
                                    l = t.apply(u, a)) : h || (h = ur(r, s))
                                }
                                return o && p ? p = or(p) : p || e === v || (p = ur(n, e)),
                                i && (o = !0,
                                l = t.apply(u, a)),
                                !o || p || h || (a = u = T),
                                l
                            }
                            var a, h, l, c, u, p, d, f = 0, v = !1, g = !0;
                            if ("function" != typeof t)
                                throw new Kn(U);
                            if (e = 0 > e ? 0 : +e || 0,
                            !0 === i)
                                var m = !0
                                    , g = !1;
                            else
                                gn(i) && (m = !!i.leading,
                                v = "maxWait"in i && _r(+i.maxWait || 0, e),
                                g = "trailing"in i ? !!i.trailing : g);
                            return o.cancel = function() {
                                p && or(p),
                                h && or(h),
                                f = 0,
                                h = p = d = T
                            }
                            ,
                            o
                        }
                        function ln(t, e) {
                            function i() {
                                var s = arguments
                                    , n = e ? e.apply(this, s) : s[0]
                                    , r = i.cache;
                                return r.has(n) ? r.get(n) : (s = t.apply(this, s),
                                i.cache = r.set(n, s),
                                s)
                            }
                            if ("function" != typeof t || e && "function" != typeof e)
                                throw new Kn(U);
                            return i.cache = new ln.Cache,
                            i
                        }
                        function cn(t, e) {
                            if ("function" != typeof t)
                                throw new Kn(U);
                            return e = _r(e === T ? t.length - 1 : +e || 0, 0),
                            function() {
                                for (var i = arguments, s = -1, n = _r(i.length - e, 0), r = Wn(n); ++s < n; )
                                    r[s] = i[e + s];
                                switch (e) {
                                case 0:
                                    return t.call(this, r);
                                case 1:
                                    return t.call(this, i[0], r);
                                case 2:
                                    return t.call(this, i[0], i[1], r)
                                }
                                for (n = Wn(e + 1),
                                s = -1; ++s < e; )
                                    n[s] = i[s];
                                return n[e] = r,
                                t.apply(this, n)
                            }
                        }
                        function un(t, e) {
                            return t > e
                        }
                        function pn(t) {
                            return g(t) && Ms(t) && tr.call(t, "callee") && !lr.call(t, "callee")
                        }
                        function dn(t, e, i, s) {
                            return s = (i = "function" == typeof i ? Ri(i, s, 3) : T) ? i(t, e) : T,
                            s === T ? mi(t, e, i) : !!s
                        }
                        function fn(t) {
                            return g(t) && "string" == typeof t.message && ir.call(t) == Y
                        }
                        function vn(t) {
                            return gn(t) && ir.call(t) == X
                        }
                        function gn(t) {
                            var e = typeof t;
                            return !!t && ("object" == e || "function" == e)
                        }
                        function mn(t) {
                            return null == t ? !1 : vn(t) ? nr.test(Qn.call(t)) : g(t) && Ae.test(t)
                        }
                        function yn(t) {
                            return "number" == typeof t || g(t) && ir.call(t) == K
                        }
                        function wn(t) {
                            var e;
                            if (!g(t) || ir.call(t) != Z || pn(t) || !(tr.call(t, "constructor") || (e = t.constructor,
                            "function" != typeof e || e instanceof e)))
                                return !1;
                            var i;
                            return pi(t, function(t, e) {
                                i = e
                            }),
                            i === T || tr.call(t, i)
                        }
                        function xn(t) {
                            return gn(t) && ir.call(t) == J
                        }
                        function _n(t) {
                            return "string" == typeof t || g(t) && ir.call(t) == $
                        }
                        function bn(t) {
                            return g(t) && Os(t.length) && !!Le[ir.call(t)]
                        }
                        function Tn(t, e) {
                            return e > t
                        }
                        function Cn(t) {
                            var e = t ? Wr(t) : 0;
                            return Os(e) ? e ? Ve(t) : [] : An(t)
                        }
                        function kn(t) {
                            return ii(t, Pn(t))
                        }
                        function Sn(t) {
                            return vi(t, Pn(t))
                        }
                        function Pn(t) {
                            if (null == t)
                                return [];
                            gn(t) || (t = qn(t));
                            for (var e = t.length, e = e && Os(e) && (Mo(t) || pn(t)) && e || 0, i = t.constructor, s = -1, i = "function" == typeof i && i.prototype === t, n = Wn(e), r = e > 0; ++s < e; )
                                n[s] = s + "";
                            for (var o in t)
                                r && As(o, e) || "constructor" == o && (i || !tr.call(t, o)) || n.push(o);
                            return n
                        }
                        function Mn(t) {
                            t = Rs(t);
                            for (var e = -1, i = Ro(t), s = i.length, n = Wn(s); ++e < s; ) {
                                var r = i[e];
                                n[e] = [r, t[r]]
                            }
                            return n
                        }
                        function An(t) {
                            return zi(t, Ro(t))
                        }
                        function Dn(t) {
                            return (t = a(t)) && t.replace(Ie, u).replace(Ce, "")
                        }
                        function In(t, e) {
                            var i = "";
                            if (t = a(t),
                            e = +e,
                            1 > e || !t || !wr(e))
                                return i;
                            do
                                e % 2 && (i += t),
                                e = mr(e / 2),
                                t += t;
                            while (e);
                            return i
                        }
                        function En(t, e, i) {
                            var s = t;
                            return (t = a(t)) ? (i ? Ds(s, e, i) : null == e) ? t.slice(w(t), x(t) + 1) : (e += "",
                            t.slice(h(t, e), l(t, e) + 1)) : t
                        }
                        function On(t, e, i) {
                            return i && Ds(t, e, i) && (e = T),
                            t = a(t),
                            t.match(e || ze) || []
                        }
                        function zn(t, e, i) {
                            return i && Ds(t, e, i) && (e = T),
                            g(t) ? Ln(t) : si(t, e)
                        }
                        function jn(t) {
                            return t
                        }
                        function Ln(t) {
                            return xi(ni(t, !0))
                        }
                        function Bn(t, e, i) {
                            if (null == i) {
                                var s = gn(e)
                                    , n = s ? Ro(e) : T;
                                ((n = n && n.length ? vi(e, n) : T) ? n.length : s) || (n = !1,
                                i = e,
                                e = t,
                                t = this)
                            }
                            n || (n = vi(e, Ro(e)));
                            var r = !0
                                , s = -1
                                , o = vn(t)
                                , a = n.length;
                            !1 === i ? r = !1 : gn(i) && "chain"in i && (r = i.chain);
                            for (; ++s < a; ) {
                                i = n[s];
                                var h = e[i];
                                t[i] = h,
                                o && (t.prototype[i] = function(e) {
                                    return function() {
                                        var i = this.__chain__;
                                        if (r || i) {
                                            var s = t(this.__wrapped__);
                                            return (s.__actions__ = Ve(this.__actions__)).push({
                                                func: e,
                                                args: arguments,
                                                thisArg: t
                                            }),
                                            s.__chain__ = i,
                                            s
                                        }
                                        return e.apply(t, Ye([this.value()], arguments))
                                    }
                                }(h))
                            }
                            return t
                        }
                        function Fn() {}
                        function Rn(t) {
                            return Is(t) ? Ti(t) : Ci(t)
                        }
                        t = t ? Ze.defaults(Ke.Object(), t, Ze.pick(Ke, je)) : Ke;
                        var Wn = t.Array
                            , Un = t.Date
                            , Vn = t.Error
                            , Nn = t.Function
                            , Hn = t.Math
                            , Gn = t.Number
                            , qn = t.Object
                            , Yn = t.RegExp
                            , Xn = t.String
                            , Kn = t.TypeError
                            , Zn = Wn.prototype
                            , Jn = qn.prototype
                            , $n = Xn.prototype
                            , Qn = Nn.prototype.toString
                            , tr = Jn.hasOwnProperty
                            , er = 0
                            , ir = Jn.toString
                            , sr = Ke._
                            , nr = Yn("^" + Qn.call(tr).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$")
                            , rr = t.ArrayBuffer
                            , or = t.clearTimeout
                            , ar = t.parseFloat
                            , hr = Hn.pow
                            , lr = Jn.propertyIsEnumerable
                            , cr = Ts(t, "Set")
                            , ur = t.setTimeout
                            , pr = Zn.splice
                            , dr = t.Uint8Array
                            , fr = Ts(t, "WeakMap")
                            , vr = Hn.ceil
                            , gr = Ts(qn, "create")
                            , mr = Hn.floor
                            , yr = Ts(Wn, "isArray")
                            , wr = t.isFinite
                            , xr = Ts(qn, "keys")
                            , _r = Hn.max
                            , br = Hn.min
                            , Tr = Ts(Un, "now")
                            , Cr = t.parseInt
                            , kr = Hn.random
                            , Sr = Gn.NEGATIVE_INFINITY
                            , Pr = Gn.POSITIVE_INFINITY
                            , Mr = 4294967294
                            , Ar = 2147483647
                            , Dr = 9007199254740991
                            , Ir = fr && new fr
                            , Er = {};
                        e.support = {},
                        e.templateSettings = {
                            escape: ge,
                            evaluate: me,
                            interpolate: ye,
                            variable: "",
                            imports: {
                                _: e
                            }
                        };
                        var Or = function() {
                            function t() {}
                            return function(e) {
                                if (gn(e)) {
                                    t.prototype = e;
                                    var i = new t;
                                    t.prototype = T
                                }
                                return i || {}
                            }
                        }()
                            , zr = Gi(di)
                            , jr = Gi(fi, !0)
                            , Lr = qi()
                            , Br = qi(!0)
                            , Fr = Ir ? function(t, e) {
                            return Ir.set(t, e),
                            t
                        }
                        : jn
                            , Rr = Ir ? function(t) {
                            return Ir.get(t)
                        }
                        : Fn
                            , Wr = Ti("length")
                            , Ur = function() {
                            var t = 0
                                , e = 0;
                            return function(i, s) {
                                var n = fo()
                                    , r = B - (n - e);
                                if (e = n,
                                r > 0) {
                                    if (++t >= L)
                                        return i
                                } else
                                    t = 0;
                                return Fr(i, s)
                            }
                        }()
                            , Vr = cn(function(t, e) {
                            return g(t) && Ms(t) ? oi(t, ui(e, !1, !0)) : []
                        })
                            , Nr = ts()
                            , Hr = ts(!0)
                            , Gr = cn(function(t) {
                            for (var e = t.length, i = e, s = Wn(c), n = _s(), o = n === r, a = []; i--; ) {
                                var h = t[i] = Ms(h = t[i]) ? h : [];
                                s[i] = o && 120 <= h.length && gr && cr ? new We(i && h) : null
                            }
                            var o = t[0]
                                , l = -1
                                , c = o ? o.length : 0
                                , u = s[0];
                            t: for (; ++l < c; )
                                if (h = o[l],
                                0 > (u ? Ue(u, h) : n(a, h, 0))) {
                                    for (i = e; --i; ) {
                                        var p = s[i];
                                        if (0 > (p ? Ue(p, h) : n(t[i], h, 0)))
                                            continue t
                                    }
                                    u && u.push(h),
                                    a.push(h)
                                }
                            return a
                        })
                            , qr = cn(function(t, e) {
                            e = ui(e);
                            var i = ei(t, e);
                            return ki(t, e.sort(s)),
                            i
                        })
                            , Yr = fs()
                            , Xr = fs(!0)
                            , Kr = cn(function(t) {
                            return Oi(ui(t, !1, !0))
                        })
                            , Zr = cn(function(t, e) {
                            return Ms(t) ? oi(t, e) : []
                        })
                            , Jr = cn(Ks)
                            , $r = cn(function(t) {
                            var e = t.length
                                , i = e > 2 ? t[e - 2] : T
                                , s = e > 1 ? t[e - 1] : T;
                            return e > 2 && "function" == typeof i ? e -= 2 : (i = e > 1 && "function" == typeof s ? (--e,
                            s) : T,
                            s = T),
                            t.length = e,
                            Zs(t, i, s)
                        })
                            , Qr = cn(function(t) {
                            return t = ui(t),
                            this.thru(function(e) {
                                e = Mo(e) ? e : [Rs(e)];
                                for (var i = t, s = -1, n = e.length, r = -1, o = i.length, a = Wn(n + o); ++s < n; )
                                    a[s] = e[s];
                                for (; ++r < o; )
                                    a[s++] = i[r];
                                return a
                            })
                        })
                            , to = cn(function(t, e) {
                            return ei(t, ui(e))
                        })
                            , eo = Ni(function(t, e, i) {
                            tr.call(t, i) ? ++t[i] : t[i] = 1
                        })
                            , io = Qi(zr)
                            , so = Qi(jr, !0)
                            , no = ss(Ne, zr)
                            , ro = ss(function(t, e) {
                            for (var i = t.length; i-- && !1 !== e(t[i], i, t); )
                                ;
                            return t
                        }, jr)
                            , oo = Ni(function(t, e, i) {
                            tr.call(t, i) ? t[i].push(e) : t[i] = [e]
                        })
                            , ao = Ni(function(t, e, i) {
                            t[i] = e
                        })
                            , ho = cn(function(t, e, i) {
                            var s = -1
                                , n = "function" == typeof e
                                , r = Is(e)
                                , o = Ms(t) ? Wn(t.length) : [];
                            return zr(t, function(t) {
                                var a = n ? e : r && null != t ? t[e] : T;
                                o[++s] = a ? a.apply(t, i) : Ps(t, e, i)
                            }),
                            o
                        })
                            , lo = Ni(function(t, e, i) {
                            t[i ? 0 : 1].push(e)
                        }, function() {
                            return [[], []]
                        })
                            , co = ls(Xe, zr)
                            , uo = ls(function(t, e, i, s) {
                            var n = t.length;
                            for (s && n && (i = t[--n]); n--; )
                                i = e(i, t[n], n, t);
                            return i
                        }, jr)
                            , po = cn(function(t, e) {
                            if (null == t)
                                return [];
                            var i = e[2];
                            return i && Ds(e[0], e[1], i) && (e.length = 1),
                            Ii(t, ui(e), [])
                        })
                            , fo = Tr || function() {
                            return (new Un).getTime()
                        }
                            , vo = cn(function(t, e, i) {
                            var s = k;
                            if (i.length)
                                var n = y(i, vo.placeholder)
                                    , s = s | D;
                            return vs(t, s, e, i, n)
                        })
                            , go = cn(function(t, e) {
                            e = e.length ? ui(e) : Sn(t);
                            for (var i = -1, s = e.length; ++i < s; ) {
                                var n = e[i];
                                t[n] = vs(t[n], k, t)
                            }
                            return t
                        })
                            , mo = cn(function(t, e, i) {
                            var s = k | S;
                            if (i.length)
                                var n = y(i, mo.placeholder)
                                    , s = s | D;
                            return vs(e, s, t, i, n)
                        })
                            , yo = Zi(M)
                            , wo = Zi(A)
                            , xo = cn(function(t, e) {
                            return ri(t, 1, e)
                        })
                            , _o = cn(function(t, e, i) {
                            return ri(t, e, i)
                        })
                            , bo = is()
                            , To = is(!0)
                            , Co = cn(function(t, e) {
                            if (e = ui(e),
                            "function" != typeof t || !He(e, o))
                                throw new Kn(U);
                            var i = e.length;
                            return cn(function(s) {
                                for (var n = br(s.length, i); n--; )
                                    s[n] = e[n](s[n]);
                                return t.apply(this, s)
                            })
                        })
                            , ko = hs(D)
                            , So = hs(I)
                            , Po = cn(function(t, e) {
                            return vs(t, O, T, T, T, ui(e))
                        })
                            , Mo = yr || function(t) {
                            return g(t) && Os(t.length) && ir.call(t) == H
                        }
                            , Ao = Hi(bi)
                            , Do = Hi(function(t, e, i) {
                            return i ? Qe(t, e, i) : ti(t, e)
                        })
                            , Io = Ji(Do, function(t, e) {
                            return t === T ? e : t
                        })
                            , Eo = Ji(Ao, zs)
                            , Oo = es(di)
                            , zo = es(fi)
                            , jo = ns(Lr)
                            , Lo = ns(Br)
                            , Bo = rs(di)
                            , Fo = rs(fi)
                            , Ro = xr ? function(t) {
                            var e = null == t ? T : t.constructor;
                            return "function" == typeof e && e.prototype === t || "function" != typeof t && Ms(t) ? Bs(t) : gn(t) ? xr(t) : []
                        }
                        : Bs
                            , Wo = os(!0)
                            , Uo = os()
                            , Vo = cn(function(t, e) {
                            if (null == t)
                                return {};
                            if ("function" != typeof e[0])
                                return e = qe(ui(e), Xn),
                                js(t, oi(Pn(t), e));
                            var i = Ri(e[0], e[1], 3);
                            return Ls(t, function(t, e, s) {
                                return !i(t, e, s)
                            })
                        })
                            , No = cn(function(t, e) {
                            return null == t ? {} : "function" == typeof e[0] ? Ls(t, Ri(e[0], e[1], 3)) : js(t, ui(e))
                        })
                            , Ho = Xi(function(t, e, i) {
                            return e = e.toLowerCase(),
                            t + (i ? e.charAt(0).toUpperCase() + e.slice(1) : e)
                        })
                            , Go = Xi(function(t, e, i) {
                            return t + (i ? "-" : "") + e.toLowerCase()
                        })
                            , qo = as()
                            , Yo = as(!0)
                            , Xo = Xi(function(t, e, i) {
                            return t + (i ? "_" : "") + e.toLowerCase()
                        })
                            , Ko = Xi(function(t, e, i) {
                            return t + (i ? " " : "") + (e.charAt(0).toUpperCase() + e.slice(1))
                        })
                            , Zo = cn(function(t, e) {
                            try {
                                return t.apply(T, e)
                            } catch (i) {
                                return fn(i) ? i : new Vn(i)
                            }
                        })
                            , Jo = cn(function(t, e) {
                            return function(i) {
                                return Ps(i, t, e)
                            }
                        })
                            , $o = cn(function(t, e) {
                            return function(i) {
                                return Ps(t, i, e)
                            }
                        })
                            , Qo = ds("ceil")
                            , ta = ds("floor")
                            , ea = $i(un, Sr)
                            , ia = $i(Tn, Pr)
                            , sa = ds("round");
                        return e.prototype = i.prototype,
                        m.prototype = Or(i.prototype),
                        m.prototype.constructor = m,
                        Fe.prototype = Or(i.prototype),
                        Fe.prototype.constructor = Fe,
                        Re.prototype["delete"] = function(t) {
                            return this.has(t) && delete this.__data__[t]
                        }
                        ,
                        Re.prototype.get = function(t) {
                            return "__proto__" == t ? T : this.__data__[t]
                        }
                        ,
                        Re.prototype.has = function(t) {
                            return "__proto__" != t && tr.call(this.__data__, t)
                        }
                        ,
                        Re.prototype.set = function(t, e) {
                            return "__proto__" != t && (this.__data__[t] = e),
                            this
                        }
                        ,
                        We.prototype.push = function(t) {
                            var e = this.data;
                            "string" == typeof t || gn(t) ? e.set.add(t) : e.hash[t] = !0
                        }
                        ,
                        ln.Cache = Re,
                        e.after = function(t, e) {
                            if ("function" != typeof e) {
                                if ("function" != typeof t)
                                    throw new Kn(U);
                                var i = t;
                                t = e,
                                e = i
                            }
                            return t = wr(t = +t) ? t : 0,
                            function() {
                                return 1 > --t ? e.apply(this, arguments) : void 0
                            }
                        }
                        ,
                        e.ary = function(t, e, i) {
                            return i && Ds(t, e, i) && (e = T),
                            e = t && null == e ? t.length : _r(+e || 0, 0),
                            vs(t, E, T, T, T, T, e)
                        }
                        ,
                        e.assign = Do,
                        e.at = to,
                        e.before = an,
                        e.bind = vo,
                        e.bindAll = go,
                        e.bindKey = mo,
                        e.callback = zn,
                        e.chain = $s,
                        e.chunk = function(t, e, i) {
                            e = (i ? Ds(t, e, i) : null == e) ? 1 : _r(mr(e) || 1, 1),
                            i = 0;
                            for (var s = t ? t.length : 0, n = -1, r = Wn(vr(s / e)); s > i; )
                                r[++n] = Mi(t, i, i += e);
                            return r
                        }
                        ,
                        e.compact = function(t) {
                            for (var e = -1, i = t ? t.length : 0, s = -1, n = []; ++e < i; ) {
                                var r = t[e];
                                r && (n[++s] = r)
                            }
                            return n
                        }
                        ,
                        e.constant = function(t) {
                            return function() {
                                return t
                            }
                        }
                        ,
                        e.countBy = eo,
                        e.create = function(t, e, i) {
                            var s = Or(t);
                            return i && Ds(t, e, i) && (e = T),
                            e ? ti(s, e) : s
                        }
                        ,
                        e.curry = yo,
                        e.curryRight = wo,
                        e.debounce = hn,
                        e.defaults = Io,
                        e.defaultsDeep = Eo,
                        e.defer = xo,
                        e.delay = _o,
                        e.difference = Vr,
                        e.drop = Vs,
                        e.dropRight = Ns,
                        e.dropRightWhile = function(t, e, i) {
                            return t && t.length ? ji(t, ws(e, i, 3), !0, !0) : []
                        }
                        ,
                        e.dropWhile = function(t, e, i) {
                            return t && t.length ? ji(t, ws(e, i, 3), !0) : []
                        }
                        ,
                        e.fill = function(t, e, i, s) {
                            var n = t ? t.length : 0;
                            if (!n)
                                return [];
                            for (i && "number" != typeof i && Ds(t, e, i) && (i = 0,
                            s = n),
                            n = t.length,
                            i = null == i ? 0 : +i || 0,
                            0 > i && (i = -i > n ? 0 : n + i),
                            s = s === T || s > n ? n : +s || 0,
                            0 > s && (s += n),
                            n = i > s ? 0 : s >>> 0,
                            i >>>= 0; n > i; )
                                t[i++] = e;
                            return t
                        }
                        ,
                        e.filter = en,
                        e.flatten = function(t, e, i) {
                            var s = t ? t.length : 0;
                            return i && Ds(t, e, i) && (e = !1),
                            s ? ui(t, e) : []
                        }
                        ,
                        e.flattenDeep = function(t) {
                            return t && t.length ? ui(t, !0) : []
                        }
                        ,
                        e.flow = bo,
                        e.flowRight = To,
                        e.forEach = no,
                        e.forEachRight = ro,
                        e.forIn = jo,
                        e.forInRight = Lo,
                        e.forOwn = Bo,
                        e.forOwnRight = Fo,
                        e.functions = Sn,
                        e.groupBy = oo,
                        e.indexBy = ao,
                        e.initial = function(t) {
                            return Ns(t, 1)
                        }
                        ,
                        e.intersection = Gr,
                        e.invert = function(t, e, i) {
                            i && Ds(t, e, i) && (e = T),
                            i = -1;
                            for (var s = Ro(t), n = s.length, r = {}; ++i < n; ) {
                                var o = s[i]
                                    , a = t[o];
                                e ? tr.call(r, a) ? r[a].push(o) : r[a] = [o] : r[a] = o
                            }
                            return r
                        }
                        ,
                        e.invoke = ho,
                        e.keys = Ro,
                        e.keysIn = Pn,
                        e.map = nn,
                        e.mapKeys = Wo,
                        e.mapValues = Uo,
                        e.matches = Ln,
                        e.matchesProperty = function(t, e) {
                            return _i(t, ni(e, !0))
                        }
                        ,
                        e.memoize = ln,
                        e.merge = Ao,
                        e.method = Jo,
                        e.methodOf = $o,
                        e.mixin = Bn,
                        e.modArgs = Co,
                        e.negate = function(t) {
                            if ("function" != typeof t)
                                throw new Kn(U);
                            return function() {
                                return !t.apply(this, arguments)
                            }
                        }
                        ,
                        e.omit = Vo,
                        e.once = function(t) {
                            return an(2, t)
                        }
                        ,
                        e.pairs = Mn,
                        e.partial = ko,
                        e.partialRight = So,
                        e.partition = lo,
                        e.pick = No,
                        e.pluck = function(t, e) {
                            return nn(t, Rn(e))
                        }
                        ,
                        e.property = Rn,
                        e.propertyOf = function(t) {
                            return function(e) {
                                return gi(t, Ws(e), e + "")
                            }
                        }
                        ,
                        e.pull = function() {
                            var t = arguments
                                , e = t[0];
                            if (!e || !e.length)
                                return e;
                            for (var i = 0, s = _s(), n = t.length; ++i < n; )
                                for (var r = 0, o = t[i]; -1 < (r = s(e, o, r)); )
                                    pr.call(e, r, 1);
                            return e
                        }
                        ,
                        e.pullAt = qr,
                        e.range = function(t, e, i) {
                            i && Ds(t, e, i) && (e = i = T),
                            t = +t || 0,
                            i = null == i ? 1 : +i || 0,
                            null == e ? (e = t,
                            t = 0) : e = +e || 0;
                            var s = -1;
                            e = _r(vr((e - t) / (i || 1)), 0);
                            for (var n = Wn(e); ++s < e; )
                                n[s] = t,
                                t += i;
                            return n
                        }
                        ,
                        e.rearg = Po,
                        e.reject = function(t, e, i) {
                            var s = Mo(t) ? Ge : li;
                            return e = ws(e, i, 3),
                            s(t, function(t, i, s) {
                                return !e(t, i, s)
                            })
                        }
                        ,
                        e.remove = function(t, e, i) {
                            var s = [];
                            if (!t || !t.length)
                                return s;
                            var n = -1
                                , r = []
                                , o = t.length;
                            for (e = ws(e, i, 3); ++n < o; )
                                i = t[n],
                                e(i, n, t) && (s.push(i),
                                r.push(n));
                            return ki(t, r),
                            s
                        }
                        ,
                        e.rest = Ys,
                        e.restParam = cn,
                        e.set = function(t, e, i) {
                            if (null == t)
                                return t;
                            var s = e + "";
                            e = null != t[s] || Is(e, t) ? [s] : Ws(e);
                            for (var s = -1, n = e.length, r = n - 1, o = t; null != o && ++s < n; ) {
                                var a = e[s];
                                gn(o) && (s == r ? o[a] = i : null == o[a] && (o[a] = As(e[s + 1]) ? [] : {})),
                                o = o[a]
                            }
                            return t
                        }
                        ,
                        e.shuffle = function(t) {
                            return rn(t, Pr)
                        }
                        ,
                        e.slice = function(t, e, i) {
                            var s = t ? t.length : 0;
                            return s ? (i && "number" != typeof i && Ds(t, e, i) && (e = 0,
                            i = s),
                            Mi(t, e, i)) : []
                        }
                        ,
                        e.sortBy = function(t, e, i) {
                            if (null == t)
                                return [];
                            i && Ds(t, e, i) && (e = T);
                            var s = -1;
                            return e = ws(e, i, 3),
                            t = wi(t, function(t, i, n) {
                                return {
                                    a: e(t, i, n),
                                    b: ++s,
                                    c: t
                                }
                            }),
                            Di(t, c)
                        }
                        ,
                        e.sortByAll = po,
                        e.sortByOrder = function(t, e, i, s) {
                            return null == t ? [] : (s && Ds(e, i, s) && (i = T),
                            Mo(e) || (e = null == e ? [] : [e]),
                            Mo(i) || (i = null == i ? [] : [i]),
                            Ii(t, e, i))
                        }
                        ,
                        e.spread = function(t) {
                            if ("function" != typeof t)
                                throw new Kn(U);
                            return function(e) {
                                return t.apply(this, e)
                            }
                        }
                        ,
                        e.take = function(t, e, i) {
                            return t && t.length ? ((i ? Ds(t, e, i) : null == e) && (e = 1),
                            Mi(t, 0, 0 > e ? 0 : e)) : []
                        }
                        ,
                        e.takeRight = function(t, e, i) {
                            var s = t ? t.length : 0;
                            return s ? ((i ? Ds(t, e, i) : null == e) && (e = 1),
                            e = s - (+e || 0),
                            Mi(t, 0 > e ? 0 : e)) : []
                        }
                        ,
                        e.takeRightWhile = function(t, e, i) {
                            return t && t.length ? ji(t, ws(e, i, 3), !1, !0) : []
                        }
                        ,
                        e.takeWhile = function(t, e, i) {
                            return t && t.length ? ji(t, ws(e, i, 3)) : []
                        }
                        ,
                        e.tap = function(t, e, i) {
                            return e.call(i, t),
                            t
                        }
                        ,
                        e.throttle = function(t, e, i) {
                            var s = !0
                                , n = !0;
                            if ("function" != typeof t)
                                throw new Kn(U);
                            return !1 === i ? s = !1 : gn(i) && (s = "leading"in i ? !!i.leading : s,
                            n = "trailing"in i ? !!i.trailing : n),
                            hn(t, e, {
                                leading: s,
                                maxWait: +e,
                                trailing: n
                            })
                        }
                        ,
                        e.thru = Qs,
                        e.times = function(t, e, i) {
                            if (t = mr(t),
                            1 > t || !wr(t))
                                return [];
                            var s = -1
                                , n = Wn(br(t, 4294967295));
                            for (e = Ri(e, i, 1); ++s < t; )
                                4294967295 > s ? n[s] = e(s) : e(s);
                            return n
                        }
                        ,
                        e.toArray = Cn,
                        e.toPlainObject = kn,
                        e.transform = function(t, e, i, s) {
                            var n = Mo(t) || bn(t);
                            return e = ws(e, s, 4),
                            null == i && (n || gn(t) ? (s = t.constructor,
                            i = n ? Mo(t) ? new s : [] : Or(vn(s) ? s.prototype : T)) : i = {}),
                            (n ? Ne : di)(t, function(t, s, n) {
                                return e(i, t, s, n)
                            }),
                            i
                        }
                        ,
                        e.union = Kr,
                        e.uniq = Xs,
                        e.unzip = Ks,
                        e.unzipWith = Zs,
                        e.values = An,
                        e.valuesIn = function(t) {
                            return zi(t, Pn(t))
                        }
                        ,
                        e.where = function(t, e) {
                            return en(t, xi(e))
                        }
                        ,
                        e.without = Zr,
                        e.wrap = function(t, e) {
                            return e = null == e ? jn : e,
                            vs(e, D, T, [t], [])
                        }
                        ,
                        e.xor = function() {
                            for (var t = -1, e = arguments.length; ++t < e; ) {
                                var i = arguments[t];
                                if (Ms(i))
                                    var s = s ? Ye(oi(s, i), oi(i, s)) : i
                            }
                            return s ? Oi(s) : []
                        }
                        ,
                        e.zip = Jr,
                        e.zipObject = Js,
                        e.zipWith = $r,
                        e.backflow = To,
                        e.collect = nn,
                        e.compose = To,
                        e.each = no,
                        e.eachRight = ro,
                        e.extend = Do,
                        e.iteratee = zn,
                        e.methods = Sn,
                        e.object = Js,
                        e.select = en,
                        e.tail = Ys,
                        e.unique = Xs,
                        Bn(e, e),
                        e.add = function(t, e) {
                            return (+t || 0) + (+e || 0)
                        }
                        ,
                        e.attempt = Zo,
                        e.camelCase = Ho,
                        e.capitalize = function(t) {
                            return (t = a(t)) && t.charAt(0).toUpperCase() + t.slice(1)
                        }
                        ,
                        e.ceil = Qo,
                        e.clone = function(t, e, i, s) {
                            return e && "boolean" != typeof e && Ds(t, e, i) ? e = !1 : "function" == typeof e && (s = i,
                            i = e,
                            e = !1),
                            "function" == typeof i ? ni(t, e, Ri(i, s, 3)) : ni(t, e)
                        }
                        ,
                        e.cloneDeep = function(t, e, i) {
                            return "function" == typeof e ? ni(t, !0, Ri(e, i, 3)) : ni(t, !0)
                        }
                        ,
                        e.deburr = Dn,
                        e.endsWith = function(t, e, i) {
                            t = a(t),
                            e += "";
                            var s = t.length;
                            return i = i === T ? s : br(0 > i ? 0 : +i || 0, s),
                            i -= e.length,
                            i >= 0 && t.indexOf(e, i) == i
                        }
                        ,
                        e.escape = function(t) {
                            return (t = a(t)) && ve.test(t) ? t.replace(de, p) : t
                        }
                        ,
                        e.escapeRegExp = function(t) {
                            return (t = a(t)) && Te.test(t) ? t.replace(be, d) : t || "(?:)"
                        }
                        ,
                        e.every = tn,
                        e.find = io,
                        e.findIndex = Nr,
                        e.findKey = Oo,
                        e.findLast = so,
                        e.findLastIndex = Hr,
                        e.findLastKey = zo,
                        e.findWhere = function(t, e) {
                            return io(t, xi(e))
                        }
                        ,
                        e.first = Hs,
                        e.floor = ta,
                        e.get = function(t, e, i) {
                            return t = null == t ? T : gi(t, Ws(e), e + ""),
                            t === T ? i : t
                        }
                        ,
                        e.gt = un,
                        e.gte = function(t, e) {
                            return t >= e
                        }
                        ,
                        e.has = function(t, e) {
                            if (null == t)
                                return !1;
                            var i = tr.call(t, e);
                            if (!i && !Is(e)) {
                                if (e = Ws(e),
                                t = 1 == e.length ? t : gi(t, Mi(e, 0, -1)),
                                null == t)
                                    return !1;
                                e = qs(e),
                                i = tr.call(t, e)
                            }
                            return i || Os(t.length) && As(e, t.length) && (Mo(t) || pn(t))
                        }
                        ,
                        e.identity = jn,
                        e.includes = sn,
                        e.indexOf = Gs,
                        e.inRange = function(t, e, i) {
                            return e = +e || 0,
                            i === T ? (i = e,
                            e = 0) : i = +i || 0,
                            t >= br(e, i) && t < _r(e, i)
                        }
                        ,
                        e.isArguments = pn,
                        e.isArray = Mo,
                        e.isBoolean = function(t) {
                            return !0 === t || !1 === t || g(t) && ir.call(t) == G
                        }
                        ,
                        e.isDate = function(t) {
                            return g(t) && ir.call(t) == q
                        }
                        ,
                        e.isElement = function(t) {
                            return !!t && 1 === t.nodeType && g(t) && !wn(t)
                        }
                        ,
                        e.isEmpty = function(t) {
                            return null == t ? !0 : Ms(t) && (Mo(t) || _n(t) || pn(t) || g(t) && vn(t.splice)) ? !t.length : !Ro(t).length
                        }
                        ,
                        e.isEqual = dn,
                        e.isError = fn,
                        e.isFinite = function(t) {
                            return "number" == typeof t && wr(t)
                        }
                        ,
                        e.isFunction = vn,
                        e.isMatch = function(t, e, i, s) {
                            return i = "function" == typeof i ? Ri(i, s, 3) : T,
                            yi(t, bs(e), i)
                        }
                        ,
                        e.isNaN = function(t) {
                            return yn(t) && t != +t
                        }
                        ,
                        e.isNative = mn,
                        e.isNull = function(t) {
                            return null === t
                        }
                        ,
                        e.isNumber = yn,
                        e.isObject = gn,
                        e.isPlainObject = wn,
                        e.isRegExp = xn,
                        e.isString = _n,
                        e.isTypedArray = bn,
                        e.isUndefined = function(t) {
                            return t === T
                        }
                        ,
                        e.kebabCase = Go,
                        e.last = qs,
                        e.lastIndexOf = function(t, e, i) {
                            var s = t ? t.length : 0;
                            if (!s)
                                return -1;
                            var n = s;
                            if ("number" == typeof i)
                                n = (0 > i ? _r(s + i, 0) : br(i || 0, s - 1)) + 1;
                            else if (i)
                                return n = Bi(t, e, !0) - 1,
                                t = t[n],
                                (e === e ? e === t : t !== t) ? n : -1;
                            if (e !== e)
                                return v(t, n, !0);
                            for (; n--; )
                                if (t[n] === e)
                                    return n;
                            return -1
                        }
                        ,
                        e.lt = Tn,
                        e.lte = function(t, e) {
                            return e >= t
                        }
                        ,
                        e.max = ea,
                        e.min = ia,
                        e.noConflict = function() {
                            return Ke._ = sr,
                            this
                        }
                        ,
                        e.noop = Fn,
                        e.now = fo,
                        e.pad = function(t, e, i) {
                            t = a(t),
                            e = +e;
                            var s = t.length;
                            return e > s && wr(e) ? (s = (e - s) / 2,
                            e = mr(s),
                            s = vr(s),
                            i = us("", s, i),
                            i.slice(0, e) + t + i) : t
                        }
                        ,
                        e.padLeft = qo,
                        e.padRight = Yo,
                        e.parseInt = function(t, e, i) {
                            return (i ? Ds(t, e, i) : null == e) ? e = 0 : e && (e = +e),
                            t = En(t),
                            Cr(t, e || (Me.test(t) ? 16 : 10))
                        }
                        ,
                        e.random = function(t, e, i) {
                            i && Ds(t, e, i) && (e = i = T);
                            var s = null == t
                                , n = null == e;
                            return null == i && (n && "boolean" == typeof t ? (i = t,
                            t = 1) : "boolean" == typeof e && (i = e,
                            n = !0)),
                            s && n && (e = 1,
                            n = !1),
                            t = +t || 0,
                            n ? (e = t,
                            t = 0) : e = +e || 0,
                            i || t % 1 || e % 1 ? (i = kr(),
                            br(t + i * (e - t + ar("1e-" + ((i + "").length - 1))), e)) : Si(t, e)
                        }
                        ,
                        e.reduce = co,
                        e.reduceRight = uo,
                        e.repeat = In,
                        e.result = function(t, e, i) {
                            var s = null == t ? T : t[e];
                            return s === T && (null == t || Is(e, t) || (e = Ws(e),
                            t = 1 == e.length ? t : gi(t, Mi(e, 0, -1)),
                            s = null == t ? T : t[qs(e)]),
                            s = s === T ? i : s),
                            vn(s) ? s.call(t) : s
                        }
                        ,
                        e.round = sa,
                        e.runInContext = b,
                        e.size = function(t) {
                            var e = t ? Wr(t) : 0;
                            return Os(e) ? e : Ro(t).length
                        }
                        ,
                        e.snakeCase = Xo,
                        e.some = on,
                        e.sortedIndex = Yr,
                        e.sortedLastIndex = Xr,
                        e.startCase = Ko,
                        e.startsWith = function(t, e, i) {
                            return t = a(t),
                            i = null == i ? 0 : br(0 > i ? 0 : +i || 0, t.length),
                            t.lastIndexOf(e, i) == i
                        }
                        ,
                        e.sum = function(t, e, i) {
                            if (i && Ds(t, e, i) && (e = T),
                            e = ws(e, i, 3),
                            1 == e.length) {
                                t = Mo(t) ? t : Fs(t),
                                i = t.length;
                                for (var s = 0; i--; )
                                    s += +e(t[i]) || 0;
                                t = s
                            } else
                                t = Ei(t, e);
                            return t
                        }
                        ,
                        e.template = function(t, i, s) {
                            var n = e.templateSettings;
                            s && Ds(t, i, s) && (i = s = T),
                            t = a(t),
                            i = Qe(ti({}, s || i), n, $e),
                            s = Qe(ti({}, i.imports), n.imports, $e);
                            var r, o, h = Ro(s), l = zi(s, h), c = 0;
                            s = i.interpolate || Ee;
                            var u = "__p+='";
                            s = Yn((i.escape || Ee).source + "|" + s.source + "|" + (s === ye ? Se : Ee).source + "|" + (i.evaluate || Ee).source + "|$", "g");
                            var p = "sourceURL"in i ? "//# sourceURL=" + i.sourceURL + "\n" : "";
                            if (t.replace(s, function(e, i, s, n, a, h) {
                                return s || (s = n),
                                u += t.slice(c, h).replace(Oe, f),
                                i && (r = !0,
                                u += "'+__e(" + i + ")+'"),
                                a && (o = !0,
                                u += "';" + a + ";\n__p+='"),
                                s && (u += "'+((__t=(" + s + "))==null?'':__t)+'"),
                                c = h + e.length,
                                e
                            }),
                            u += "';",
                            (i = i.variable) || (u = "with(obj){" + u + "}"),
                            u = (o ? u.replace(le, "") : u).replace(ce, "$1").replace(ue, "$1;"),
                            u = "function(" + (i || "obj") + "){" + (i ? "" : "obj||(obj={});") + "var __t,__p=''" + (r ? ",__e=_.escape" : "") + (o ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + u + "return __p}",
                            i = Zo(function() {
                                return Nn(h, p + "return " + u).apply(T, l)
                            }),
                            i.source = u,
                            fn(i))
                                throw i;
                            return i
                        }
                        ,
                        e.trim = En,
                        e.trimLeft = function(t, e, i) {
                            var s = t;
                            return (t = a(t)) ? t.slice((i ? Ds(s, e, i) : null == e) ? w(t) : h(t, e + "")) : t
                        }
                        ,
                        e.trimRight = function(t, e, i) {
                            var s = t;
                            return (t = a(t)) ? (i ? Ds(s, e, i) : null == e) ? t.slice(0, x(t) + 1) : t.slice(0, l(t, e + "") + 1) : t
                        }
                        ,
                        e.trunc = function(t, e, i) {
                            i && Ds(t, e, i) && (e = T);
                            var s = z;
                            if (i = j,
                            null != e)
                                if (gn(e)) {
                                    var n = "separator"in e ? e.separator : n
                                        , s = "length"in e ? +e.length || 0 : s;
                                    i = "omission"in e ? a(e.omission) : i
                                } else
                                    s = +e || 0;
                            if (t = a(t),
                            s >= t.length)
                                return t;
                            if (s -= i.length,
                            1 > s)
                                return i;
                            if (e = t.slice(0, s),
                            null == n)
                                return e + i;
                            if (xn(n)) {
                                if (t.slice(s).search(n)) {
                                    var r, o = t.slice(0, s);
                                    for (n.global || (n = Yn(n.source, (Pe.exec(n) || "") + "g")),
                                    n.lastIndex = 0; t = n.exec(o); )
                                        r = t.index;
                                    e = e.slice(0, null == r ? s : r)
                                }
                            } else
                                t.indexOf(n, s) != s && (n = e.lastIndexOf(n),
                                n > -1 && (e = e.slice(0, n)));
                            return e + i
                        }
                        ,
                        e.unescape = function(t) {
                            return (t = a(t)) && fe.test(t) ? t.replace(pe, _) : t
                        }
                        ,
                        e.uniqueId = function(t) {
                            var e = ++er;
                            return a(t) + e
                        }
                        ,
                        e.words = On,
                        e.all = tn,
                        e.any = on,
                        e.contains = sn,
                        e.eq = dn,
                        e.detect = io,
                        e.foldl = co,
                        e.foldr = uo,
                        e.head = Hs,
                        e.include = sn,
                        e.inject = co,
                        Bn(e, function() {
                            var t = {};
                            return di(e, function(i, s) {
                                e.prototype[s] || (t[s] = i)
                            }),
                            t
                        }(), !1),
                        e.sample = rn,
                        e.prototype.sample = function(t) {
                            return this.__chain__ || null != t ? this.thru(function(e) {
                                return rn(e, t)
                            }) : rn(this.value())
                        }
                        ,
                        e.VERSION = C,
                        Ne("bind bindKey curry curryRight partial partialRight".split(" "), function(t) {
                            e[t].placeholder = e
                        }),
                        Ne(["drop", "take"], function(t, e) {
                            Fe.prototype[t] = function(i) {
                                var s = this.__filtered__;
                                if (s && !e)
                                    return new Fe(this);
                                i = null == i ? 1 : _r(mr(i) || 0, 0);
                                var n = this.clone();
                                return s ? n.__takeCount__ = br(n.__takeCount__, i) : n.__views__.push({
                                    size: i,
                                    type: t + (0 > n.__dir__ ? "Right" : "")
                                }),
                                n
                            }
                            ,
                            Fe.prototype[t + "Right"] = function(e) {
                                return this.reverse()[t](e).reverse()
                            }
                        }),
                        Ne(["filter", "map", "takeWhile"], function(t, e) {
                            var i = e + 1
                                , s = i != W;
                            Fe.prototype[t] = function(t, e) {
                                var n = this.clone();
                                return n.__iteratees__.push({
                                    iteratee: ws(t, e, 1),
                                    type: i
                                }),
                                n.__filtered__ = n.__filtered__ || s,
                                n
                            }
                        }),
                        Ne(["first", "last"], function(t, e) {
                            var i = "take" + (e ? "Right" : "");
                            Fe.prototype[t] = function() {
                                return this[i](1).value()[0]
                            }
                        }),
                        Ne(["initial", "rest"], function(t, e) {
                            var i = "drop" + (e ? "" : "Right");
                            Fe.prototype[t] = function() {
                                return this.__filtered__ ? new Fe(this) : this[i](1)
                            }
                        }),
                        Ne(["pluck", "where"], function(t, e) {
                            var i = e ? "filter" : "map"
                                , s = e ? xi : Rn;
                            Fe.prototype[t] = function(t) {
                                return this[i](s(t))
                            }
                        }),
                        Fe.prototype.compact = function() {
                            return this.filter(jn)
                        }
                        ,
                        Fe.prototype.reject = function(t, e) {
                            return t = ws(t, e, 1),
                            this.filter(function(e) {
                                return !t(e)
                            })
                        }
                        ,
                        Fe.prototype.slice = function(t, e) {
                            t = null == t ? 0 : +t || 0;
                            var i = this;
                            return i.__filtered__ && (t > 0 || 0 > e) ? new Fe(i) : (0 > t ? i = i.takeRight(-t) : t && (i = i.drop(t)),
                            e !== T && (e = +e || 0,
                            i = 0 > e ? i.dropRight(-e) : i.take(e - t)),
                            i)
                        }
                        ,
                        Fe.prototype.takeRightWhile = function(t, e) {
                            return this.reverse().takeWhile(t, e).reverse()
                        }
                        ,
                        Fe.prototype.toArray = function() {
                            return this.take(Pr)
                        }
                        ,
                        di(Fe.prototype, function(t, i) {
                            var s = /^(?:filter|map|reject)|While$/.test(i)
                                , n = /^(?:first|last)$/.test(i)
                                , r = e[n ? "take" + ("last" == i ? "Right" : "") : i];
                            r && (e.prototype[i] = function() {
                                function e(t) {
                                    return n && o ? r(t, 1)[0] : r.apply(T, Ye([t], i))
                                }
                                var i = n ? [1] : arguments
                                    , o = this.__chain__
                                    , a = this.__wrapped__
                                    , h = !!this.__actions__.length
                                    , l = a instanceof Fe
                                    , c = i[0]
                                    , u = l || Mo(a);
                                return u && s && "function" == typeof c && 1 != c.length && (l = u = !1),
                                c = {
                                    func: Qs,
                                    args: [e],
                                    thisArg: T
                                },
                                h = l && !h,
                                n && !o ? h ? (a = a.clone(),
                                a.__actions__.push(c),
                                t.call(a)) : r.call(T, this.value())[0] : !n && u ? (a = h ? a : new Fe(this),
                                a = t.apply(a, i),
                                a.__actions__.push(c),
                                new m(a,o)) : this.thru(e)
                            }
                            )
                        }),
                        Ne("join pop push replace shift sort splice split unshift".split(" "), function(t) {
                            var i = (/^(?:replace|split)$/.test(t) ? $n : Zn)[t]
                                , s = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru"
                                , n = /^(?:join|pop|replace|shift)$/.test(t);
                            e.prototype[t] = function() {
                                var t = arguments;
                                return n && !this.__chain__ ? i.apply(this.value(), t) : this[s](function(e) {
                                    return i.apply(e, t)
                                })
                            }
                        }),
                        di(Fe.prototype, function(t, i) {
                            var s = e[i];
                            if (s) {
                                var n = s.name + "";
                                (Er[n] || (Er[n] = [])).push({
                                    name: i,
                                    func: s
                                })
                            }
                        }),
                        Er[cs(T, S).name] = [{
                            name: "wrapper",
                            func: T
                        }],
                        Fe.prototype.clone = function() {
                            var t = new Fe(this.__wrapped__);
                            return t.__actions__ = Ve(this.__actions__),
                            t.__dir__ = this.__dir__,
                            t.__filtered__ = this.__filtered__,
                            t.__iteratees__ = Ve(this.__iteratees__),
                            t.__takeCount__ = this.__takeCount__,
                            t.__views__ = Ve(this.__views__),
                            t
                        }
                        ,
                        Fe.prototype.reverse = function() {
                            if (this.__filtered__) {
                                var t = new Fe(this);
                                t.__dir__ = -1,
                                t.__filtered__ = !0
                            } else
                                t = this.clone(),
                                t.__dir__ *= -1;
                            return t
                        }
                        ,
                        Fe.prototype.value = function() {
                            var t, e = this.__wrapped__.value(), i = this.__dir__, s = Mo(e), n = 0 > i, r = s ? e.length : 0;
                            t = r;
                            for (var o = this.__views__, a = 0, h = -1, l = o.length; ++h < l; ) {
                                var c = o[h]
                                    , u = c.size;
                                switch (c.type) {
                                case "drop":
                                    a += u;
                                    break;
                                case "dropRight":
                                    t -= u;
                                    break;
                                case "take":
                                    t = br(t, a + u);
                                    break;
                                case "takeRight":
                                    a = _r(a, t - u)
                                }
                            }
                            if (t = {
                                start: a,
                                end: t
                            },
                            o = t.start,
                            a = t.end,
                            t = a - o,
                            n = n ? a : o - 1,
                            o = this.__iteratees__,
                            a = o.length,
                            h = 0,
                            l = br(t, this.__takeCount__),
                            !s || F > r || r == t && l == t)
                                return Li(e, this.__actions__);
                            s = [];
                            t: for (; t-- && l > h; ) {
                                for (n += i,
                                r = -1,
                                c = e[n]; ++r < a; ) {
                                    var p = o[r]
                                        , u = p.type
                                        , p = p.iteratee(c);
                                    if (u == W)
                                        c = p;
                                    else if (!p) {
                                        if (u == R)
                                            continue t;
                                        break t
                                    }
                                }
                                s[h++] = c
                            }
                            return s
                        }
                        ,
                        e.prototype.chain = function() {
                            return $s(this)
                        }
                        ,
                        e.prototype.commit = function() {
                            return new m(this.value(),this.__chain__)
                        }
                        ,
                        e.prototype.concat = Qr,
                        e.prototype.plant = function(t) {
                            for (var e, s = this; s instanceof i; ) {
                                var n = Us(s);
                                e ? r.__wrapped__ = n : e = n;
                                var r = n
                                    , s = s.__wrapped__
                            }
                            return r.__wrapped__ = t,
                            e
                        }
                        ,
                        e.prototype.reverse = function() {
                            function t(t) {
                                return t.reverse()
                            }
                            var e = this.__wrapped__;
                            return e instanceof Fe ? (this.__actions__.length && (e = new Fe(this)),
                            e = e.reverse(),
                            e.__actions__.push({
                                func: Qs,
                                args: [t],
                                thisArg: T
                            }),
                            new m(e,this.__chain__)) : this.thru(t)
                        }
                        ,
                        e.prototype.toString = function() {
                            return this.value() + ""
                        }
                        ,
                        e.prototype.run = e.prototype.toJSON = e.prototype.valueOf = e.prototype.value = function() {
                            return Li(this.__wrapped__, this.__actions__)
                        }
                        ,
                        e.prototype.collect = e.prototype.map,
                        e.prototype.head = e.prototype.first,
                        e.prototype.select = e.prototype.filter,
                        e.prototype.tail = e.prototype.rest,
                        e
                    }
                    var T, C = "3.10.1", k = 1, S = 2, P = 4, M = 8, A = 16, D = 32, I = 64, E = 128, O = 256, z = 30, j = "...", L = 150, B = 16, F = 200, R = 1, W = 2, U = "Expected a function", V = "__lodash_placeholder__", N = "[object Arguments]", H = "[object Array]", G = "[object Boolean]", q = "[object Date]", Y = "[object Error]", X = "[object Function]", K = "[object Number]", Z = "[object Object]", J = "[object RegExp]", $ = "[object String]", Q = "[object ArrayBuffer]", te = "[object Float32Array]", ee = "[object Float64Array]", ie = "[object Int8Array]", se = "[object Int16Array]", ne = "[object Int32Array]", re = "[object Uint8Array]", oe = "[object Uint8ClampedArray]", ae = "[object Uint16Array]", he = "[object Uint32Array]", le = /\b__p\+='';/g, ce = /\b(__p\+=)''\+/g, ue = /(__e\(.*?\)|\b__t\))\+'';/g, pe = /&(?:amp|lt|gt|quot|#39|#96);/g, de = /[&<>"'`]/g, fe = RegExp(pe.source), ve = RegExp(de.source), ge = /<%-([\s\S]+?)%>/g, me = /<%([\s\S]+?)%>/g, ye = /<%=([\s\S]+?)%>/g, we = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/, xe = /^\w*$/, _e = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g, be = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g, Te = RegExp(be.source), Ce = /[\u0300-\u036f\ufe20-\ufe23]/g, ke = /\\(\\)?/g, Se = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Pe = /\w*$/, Me = /^0[xX]/, Ae = /^\[object .+?Constructor\]$/, De = /^\d+$/, Ie = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g, Ee = /($^)/, Oe = /['\n\r\u2028\u2029\\]/g, ze = RegExp("[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?=[A-Z\\xc0-\\xd6\\xd8-\\xde][a-z\\xdf-\\xf6\\xf8-\\xff]+)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+|[A-Z\\xc0-\\xd6\\xd8-\\xde]+|[0-9]+", "g"), je = "Array ArrayBuffer Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Math Number Object RegExp Set String _ clearTimeout isFinite parseFloat parseInt setTimeout TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap".split(" "), Le = {};
                    Le[te] = Le[ee] = Le[ie] = Le[se] = Le[ne] = Le[re] = Le[oe] = Le[ae] = Le[he] = !0,
                    Le[N] = Le[H] = Le[Q] = Le[G] = Le[q] = Le[Y] = Le[X] = Le["[object Map]"] = Le[K] = Le[Z] = Le[J] = Le["[object Set]"] = Le[$] = Le["[object WeakMap]"] = !1;
                    var Be = {};
                    Be[N] = Be[H] = Be[Q] = Be[G] = Be[q] = Be[te] = Be[ee] = Be[ie] = Be[se] = Be[ne] = Be[K] = Be[Z] = Be[J] = Be[$] = Be[re] = Be[oe] = Be[ae] = Be[he] = !0,
                    Be[Y] = Be[X] = Be["[object Map]"] = Be["[object Set]"] = Be["[object WeakMap]"] = !1;
                    var Fe = {
                        "À": "A",
                        "Á": "A",
                        "Â": "A",
                        "Ã": "A",
                        "Ä": "A",
                        "Å": "A",
                        "à": "a",
                        "á": "a",
                        "â": "a",
                        "ã": "a",
                        "ä": "a",
                        "å": "a",
                        "Ç": "C",
                        "ç": "c",
                        "Ð": "D",
                        "ð": "d",
                        "È": "E",
                        "É": "E",
                        "Ê": "E",
                        "Ë": "E",
                        "è": "e",
                        "é": "e",
                        "ê": "e",
                        "ë": "e",
                        "Ì": "I",
                        "Í": "I",
                        "Î": "I",
                        "Ï": "I",
                        "ì": "i",
                        "í": "i",
                        "î": "i",
                        "ï": "i",
                        "Ñ": "N",
                        "ñ": "n",
                        "Ò": "O",
                        "Ó": "O",
                        "Ô": "O",
                        "Õ": "O",
                        "Ö": "O",
                        "Ø": "O",
                        "ò": "o",
                        "ó": "o",
                        "ô": "o",
                        "õ": "o",
                        "ö": "o",
                        "ø": "o",
                        "Ù": "U",
                        "Ú": "U",
                        "Û": "U",
                        "Ü": "U",
                        "ù": "u",
                        "ú": "u",
                        "û": "u",
                        "ü": "u",
                        "Ý": "Y",
                        "ý": "y",
                        "ÿ": "y",
                        "Æ": "Ae",
                        "æ": "ae",
                        "Þ": "Th",
                        "þ": "th",
                        "ß": "ss"
                    }
                        , Re = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;",
                        "`": "&#96;"
                    }
                        , We = {
                        "&amp;": "&",
                        "&lt;": "<",
                        "&gt;": ">",
                        "&quot;": '"',
                        "&#39;": "'",
                        "&#96;": "`"
                    }
                        , Ue = {
                        "function": !0,
                        object: !0
                    }
                        , Ve = {
                        0: "x30",
                        1: "x31",
                        2: "x32",
                        3: "x33",
                        4: "x34",
                        5: "x35",
                        6: "x36",
                        7: "x37",
                        8: "x38",
                        9: "x39",
                        A: "x41",
                        B: "x42",
                        C: "x43",
                        D: "x44",
                        E: "x45",
                        F: "x46",
                        a: "x61",
                        b: "x62",
                        c: "x63",
                        d: "x64",
                        e: "x65",
                        f: "x66",
                        n: "x6e",
                        r: "x72",
                        t: "x74",
                        u: "x75",
                        v: "x76",
                        x: "x78"
                    }
                        , Ne = {
                        "\\": "\\",
                        "'": "'",
                        "\n": "n",
                        "\r": "r",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    }
                        , He = Ue[typeof i] && i && !i.nodeType && i
                        , Ge = Ue[typeof e] && e && !e.nodeType && e
                        , qe = Ue[typeof self] && self && self.Object && self
                        , Ye = Ue[typeof window] && window && window.Object && window
                        , Xe = Ge && Ge.exports === He && He
                        , Ke = He && Ge && "object" == typeof t && t && t.Object && t || Ye !== (this && this.window) && Ye || qe || this
                        , Ze = b();
                    "function" == typeof define && "object" == typeof define.amd && define.amd ? (Ke._ = Ze,
                    define(function() {
                        return Ze
                    })) : He && Ge ? Xe ? (Ge.exports = Ze)._ = Ze : He._ = Ze : Ke._ = Ze
                    return Ze;
                }).call(this)
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        },
        get "../../libs/lodash"() {
            return ref("../libs/lodash");
        },
        get "../libs/inviolable"() {
            const Builder = ref("../libs/Builder.js");

            window.lite = new class extends Builder {
                constructor() {
                    super({
                        name: "lite",
                        defaults: {
                            cr: false,
                            cc: false,
                            dark: false,
                            di: true,
                            di_size: 10,
                            feats: true,
                            isometric: false,
                            snapshots: 10,
                            cloud: {
                                dismissed: false,
                                notification: sessionStorage.getItem("lite_version")
                            }
                        }
                    });

                    this.icon = document.createElement("div"),
                    this.interface = document.createElement("div"),
                    this.stylesheet = document.createElement("link"),

                    this.createIcon(),
                    this.createInterface(),
                    this.createStyleSheet(),
                    this.init(),
                    this.initCustomization()
                }
                get head() {
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
                                var a = 115*(e=Math.max(e,1))*.17,s=112*e*.17,
                                u = r.canvas;u.width=a,
                                u.height=s;
                                var v=u.getContext("2d"),
                                l=.17*e;
                                v.save(),
                                v.scale(l,l),
                                v.strokeStyle = lite.get("dark") ? "#fdfdfd" : "#000000";
                                v.fillStyle = "#ffffff00";
                                v.lineCap = "round";
                                v.lineWidth = 11.5;
                                v.beginPath(),
                                v.arc(44, 50.5, 29.5, 0, 2 * Math.PI),
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
                init() {
                    for (const t in this.storage) {
                        let element = this.interface.querySelector("#" + t);
                        if (element) {
                            element.parentElement.onclick = () => element.click();
                            element.oninput = () => {
                                if (t == "cc")
                                    return this.storage.set(t, element.value), element.style.background = this.storage.get(t) || "#000000"
                                else if (t == "snapshots")
                                    return this.storage.set(t, element.value), element.parentElement.querySelector(".name").innerText = "Snapshot Count (" + this.storage.get(t) + ")";
                                else if (t == "di_size")
                                    return this.storage.set(t, element.value), element.parentElement.querySelector(".name").innerText = "Input display size (" + this.storage.get(t) + ")";

                                console.log(this.storage.get(t))
                                this.storage.set(t, !this.storage.get(t)),
                                element.checked = this.storage.get(t),
                                this.icon.style["background-color"] = this.storage.get("dark") ? "#1d1d1d" : "#ffffff",
                                this.icon.style.fill = this.storage.get("dark") ? "#ffffff" : "#1d1d1d",
                                GameManager.game && GameManager.game.currentScene.redraw()
                            }
                        }
                    }
                    let loc = location.pathname;
                    window.onclick = window.onpopstate = () => {
                        if (location.pathname != loc) {
                            loc = location.pathname;
                            this.initCustomization();
                        }
                    }
                }
                createIcon() {
                    this.icon.className = "lite icon";
                    this.icon.style = `background-color: ${this.storage.get("dark") ? "#1d1d1d" : "#ffffff"}; fill: ${this.storage.get("dark") ? "#ffffff" : "#1d1d1d"}`;
                    this.icon.innerHTML = `<svg width="32pt" height="32pt" style="width: 32px; height: 32px">
                        <path d="M 5.054688 4.414062 C 5.011719 4.5 5.066406 4.511719 5.179688 4.46875 C 5.4375 4.371094 5.480469 4.269531 5.28125 4.269531 C 5.195312 4.269531 5.097656 4.328125 5.054688 4.414062 Z M 5.054688 4.414062 "/>
                        <path d="M 15.117188 5.265625 C 14.25 5.464844 13.523438 6.40625 13.523438 7.300781 C 13.523438 7.730469 13.464844 7.800781 13.097656 7.871094 C 12.8125 7.929688 12.539062 8.15625 12.242188 8.570312 C 12.015625 8.910156 11.757812 9.253906 11.671875 9.351562 C 11.601562 9.453125 11.53125 9.59375 11.53125 9.679688 C 11.53125 9.75 11.488281 9.820312 11.417969 9.820312 C 11.359375 9.820312 11.1875 10.050781 11.046875 10.320312 C 10.890625 10.589844 10.71875 10.820312 10.648438 10.820312 C 10.589844 10.820312 10.535156 10.917969 10.535156 11.03125 C 10.535156 11.144531 10.476562 11.246094 10.421875 11.246094 C 10.363281 11.246094 10.191406 11.460938 10.035156 11.699219 C 9.894531 11.957031 9.738281 12.199219 9.679688 12.242188 C 9.636719 12.285156 9.367188 12.65625 9.066406 13.066406 C 8.65625 13.652344 8.539062 13.9375 8.539062 14.449219 C 8.539062 14.988281 8.597656 15.117188 9.011719 15.417969 C 9.253906 15.601562 10.0625 15.941406 10.777344 16.171875 C 11.984375 16.539062 12.328125 16.78125 11.972656 17.011719 C 11.898438 17.054688 11.800781 17.023438 11.742188 16.941406 C 11.585938 16.683594 10.675781 16.78125 10.136719 17.140625 C 9.578125 17.496094 8.753906 18.347656 8.414062 18.933594 C 7.886719 19.816406 7.542969 20.597656 7.542969 20.882812 C 7.542969 21.054688 7.488281 21.222656 7.417969 21.265625 C 7.144531 21.4375 6.859375 24.425781 7.101562 24.667969 C 7.1875 24.753906 7.261719 24.96875 7.261719 25.152344 C 7.261719 25.339844 7.402344 25.707031 7.574219 25.980469 C 8.5 27.386719 10.179688 27.058594 11.542969 25.195312 C 12 24.570312 12.753906 22.988281 12.882812 22.378906 C 12.96875 21.949219 13.011719 21.90625 13.394531 21.992188 C 13.992188 22.121094 14.292969 21.78125 14.191406 21.066406 C 14.121094 20.554688 14.148438 20.511719 14.535156 20.425781 C 14.761719 20.371094 14.945312 20.285156 14.945312 20.214844 C 14.945312 20.15625 15.132812 20.027344 15.359375 19.929688 C 15.773438 19.757812 16.371094 18.875 16.183594 18.703125 C 16.128906 18.648438 16 18.789062 15.914062 19.046875 C 15.800781 19.316406 15.617188 19.515625 15.386719 19.574219 C 15.019531 19.671875 14.191406 20.183594 14.121094 20.382812 C 14.09375 20.441406 13.878906 20.5 13.652344 20.5 C 13.339844 20.5 13.238281 20.425781 13.238281 20.226562 C 13.238281 20.070312 13.308594 19.898438 13.378906 19.859375 C 13.464844 19.816406 13.523438 19.617188 13.523438 19.417969 C 13.523438 19.144531 13.59375 19.074219 13.863281 19.074219 C 14.25 19.074219 15.089844 18.335938 15.089844 17.992188 C 15.089844 17.878906 15.144531 17.792969 15.203125 17.792969 C 15.332031 17.792969 15.6875 16.910156 15.585938 16.8125 C 15.5 16.738281 15.53125 16.699219 14.976562 17.539062 C 14.71875 17.90625 14.519531 18.261719 14.519531 18.335938 C 14.519531 18.503906 13.835938 18.859375 13.707031 18.746094 C 13.652344 18.691406 13.75 18.460938 13.9375 18.25 C 14.105469 18.035156 14.421875 17.59375 14.632812 17.253906 C 14.847656 16.925781 15.160156 16.613281 15.332031 16.570312 C 15.5 16.527344 15.773438 16.226562 15.929688 15.929688 C 16.285156 15.261719 16.300781 15.132812 16.015625 15.429688 C 15.898438 15.542969 15.800781 15.6875 15.800781 15.742188 C 15.800781 15.871094 15.058594 16.511719 14.902344 16.511719 C 14.847656 16.511719 14.734375 16.65625 14.648438 16.839844 C 14.5625 17.023438 14.363281 17.253906 14.191406 17.351562 C 13.9375 17.507812 13.90625 17.507812 14.0625 17.351562 C 14.148438 17.253906 14.234375 16.980469 14.234375 16.769531 C 14.234375 16.554688 14.304688 16.371094 14.378906 16.371094 C 14.578125 16.371094 14.5625 15.929688 14.347656 15.488281 C 14.136719 15.046875 12.953125 14.449219 12.527344 14.5625 C 12.371094 14.605469 12.242188 14.578125 12.242188 14.519531 C 12.242188 14.378906 11.316406 14.09375 10.890625 14.09375 C 10.632812 14.105469 10.621094 14.105469 10.859375 14.25 C 10.988281 14.320312 11.175781 14.347656 11.246094 14.304688 C 11.332031 14.261719 11.386719 14.292969 11.386719 14.363281 C 11.386719 14.449219 11.515625 14.519531 11.671875 14.519531 C 11.828125 14.519531 12.070312 14.578125 12.214844 14.648438 C 12.339844 14.71875 12.769531 14.890625 13.140625 15.019531 C 13.507812 15.144531 13.921875 15.417969 14.050781 15.601562 C 14.25 15.914062 14.25 16.027344 14.019531 16.839844 C 13.878906 17.324219 13.679688 17.851562 13.578125 18.007812 C 13.464844 18.164062 13.378906 18.519531 13.378906 18.820312 C 13.378906 19.101562 13.308594 19.515625 13.222656 19.730469 C 13.039062 20.257812 13.167969 20.726562 13.539062 20.824219 C 13.964844 20.941406 13.835938 21.410156 13.351562 21.464844 C 12.953125 21.507812 12.382812 22.09375 12.382812 22.433594 C 12.382812 22.535156 12.226562 22.976562 12.042969 23.402344 C 11.230469 25.238281 10.105469 26.335938 9.039062 26.335938 C 8.398438 26.335938 8.171875 26.164062 7.773438 25.378906 C 7.472656 24.78125 7.542969 22.019531 7.886719 21.066406 C 8.796875 18.578125 10.25 17.109375 11.574219 17.324219 C 12.027344 17.394531 12.113281 17.351562 12.257812 17.054688 C 12.527344 16.441406 12.257812 16.199219 10.621094 15.601562 C 8.582031 14.859375 8.5 14.5625 9.835938 12.753906 L 10.546875 11.785156 L 10.875 12.085938 C 11.21875 12.414062 11.386719 12.46875 11.386719 12.242188 C 11.386719 12.15625 11.316406 12.101562 11.230469 12.101562 C 10.875 12.101562 10.648438 11.671875 10.789062 11.273438 L 10.933594 10.890625 L 11.089844 11.273438 C 11.261719 11.730469 11.6875 11.785156 12.597656 11.460938 C 12.910156 11.34375 13.28125 11.246094 13.421875 11.246094 C 13.550781 11.246094 13.664062 11.175781 13.664062 11.101562 C 13.664062 11.019531 13.820312 10.960938 14.019531 10.960938 C 14.21875 10.960938 14.378906 10.902344 14.378906 10.832031 C 14.378906 10.734375 14.804688 10.589844 15.445312 10.476562 C 15.53125 10.460938 15.714844 10.390625 15.871094 10.304688 C 16.113281 10.191406 16.070312 10.164062 15.585938 10.105469 C 15.144531 10.050781 15.019531 9.980469 15.019531 9.765625 C 15.019531 9.296875 15.742188 9.152344 16.425781 9.496094 C 17.539062 10.050781 19.714844 10.535156 21.054688 10.535156 C 21.75 10.535156 22.148438 10.605469 22.292969 10.734375 C 22.589844 11.03125 22.535156 11.132812 22.105469 11.089844 C 21.878906 11.074219 21.539062 11.101562 21.324219 11.175781 C 21.109375 11.230469 20.738281 11.203125 20.5 11.132812 C 20.085938 10.976562 20.070312 10.988281 20.070312 11.402344 C 20.070312 11.628906 20.140625 11.816406 20.214844 11.816406 C 20.300781 11.816406 20.355469 11.730469 20.355469 11.628906 C 20.355469 11.53125 20.570312 11.445312 20.898438 11.429688 C 21.179688 11.417969 21.722656 11.359375 22.078125 11.316406 C 22.675781 11.230469 22.789062 11.261719 23.21875 11.644531 C 24.070312 12.382812 24.382812 13.238281 24.457031 14.945312 C 24.527344 16.738281 24.226562 18.191406 23.402344 19.898438 C 22.546875 21.679688 20.953125 23.058594 19.742188 23.058594 C 18.734375 23.058594 17.90625 22.347656 17.621094 21.253906 C 17.539062 20.910156 17.4375 20.613281 17.378906 20.582031 C 17.238281 20.484375 17.480469 16.796875 17.664062 16.3125 C 18.078125 15.230469 18.546875 14.234375 18.648438 14.234375 C 18.703125 14.234375 18.820312 14.390625 18.902344 14.589844 C 19.046875 14.890625 19.03125 15.058594 18.804688 15.488281 C 18.234375 16.625 18.019531 17.664062 18.007812 19.359375 C 18.007812 20.898438 18.035156 21.039062 18.40625 21.664062 C 19.089844 22.832031 19.859375 22.777344 21.140625 21.453125 C 22.632812 19.914062 23.628906 17.339844 23.628906 15.003906 C 23.628906 13.339844 23.132812 12.113281 22.347656 11.914062 C 21.9375 11.816406 20.996094 12.3125 20.554688 12.867188 C 20.085938 13.453125 19.859375 13.507812 19.742188 13.066406 C 19.6875 12.855469 19.757812 12.640625 19.957031 12.425781 C 20.300781 12.058594 20.226562 11.816406 19.886719 12.171875 C 19.757812 12.285156 19.585938 12.382812 19.5 12.382812 C 19.300781 12.382812 19.460938 13.265625 19.6875 13.394531 C 19.773438 13.453125 19.785156 13.75 19.742188 14.105469 C 19.6875 14.546875 19.742188 14.890625 19.957031 15.359375 C 20.582031 16.796875 20.667969 17.054688 20.5 17.152344 C 20.414062 17.210938 20.355469 17.140625 20.355469 17.011719 C 20.355469 16.898438 20.300781 16.683594 20.226562 16.539062 C 20.15625 16.414062 20.015625 16.085938 19.929688 15.828125 C 19.828125 15.585938 19.699219 15.375 19.628906 15.375 C 19.460938 15.375 19.472656 16.042969 19.644531 16.15625 C 19.730469 16.199219 19.785156 16.371094 19.785156 16.527344 C 19.785156 16.925781 20.3125 17.792969 20.570312 17.792969 C 20.625 17.792969 20.753906 17.707031 20.867188 17.59375 C 21.097656 17.351562 21.140625 16.796875 20.925781 16.796875 C 20.855469 16.796875 20.78125 16.640625 20.78125 16.441406 C 20.78125 16.242188 20.726562 16.085938 20.640625 16.085938 C 20.570312 16.085938 20.5 15.972656 20.5 15.828125 C 20.5 15.699219 20.355469 15.316406 20.183594 14.988281 C 19.871094 14.40625 19.871094 14.363281 20.101562 13.992188 C 20.457031 13.394531 20.726562 13.410156 20.726562 14.019531 C 20.726562 14.292969 20.667969 14.519531 20.613281 14.519531 C 20.554688 14.519531 20.5 14.449219 20.5 14.347656 C 20.5 14.261719 20.46875 14.21875 20.425781 14.261719 C 20.3125 14.378906 20.511719 15.230469 20.65625 15.230469 C 20.726562 15.230469 20.78125 15.132812 20.78125 15.019531 C 20.78125 14.902344 20.839844 14.804688 20.898438 14.804688 C 20.96875 14.804688 21.28125 14.578125 21.59375 14.304688 C 21.921875 14.035156 22.277344 13.808594 22.40625 13.808594 C 22.535156 13.808594 22.632812 13.738281 22.632812 13.664062 C 22.632812 13.578125 22.476562 13.523438 22.304688 13.523438 C 21.964844 13.523438 21.496094 13.921875 21.496094 14.207031 C 21.496094 14.292969 21.394531 14.335938 21.28125 14.292969 C 21.167969 14.234375 21.066406 14.121094 21.066406 14.007812 C 21.066406 13.894531 20.996094 13.679688 20.898438 13.539062 C 20.683594 13.195312 20.839844 12.996094 21.636719 12.539062 L 22.21875 12.214844 L 22.621094 12.65625 C 22.960938 13.023438 23.058594 13.28125 23.144531 14.050781 C 23.246094 15.03125 23.132812 16.941406 22.945312 17.082031 C 22.890625 17.125 22.832031 17.308594 22.804688 17.507812 C 22.777344 17.921875 22.691406 18.121094 22.136719 19.289062 C 21.90625 19.757812 21.621094 20.226562 21.523438 20.339844 C 21.421875 20.457031 21.222656 20.699219 21.109375 20.882812 C 20.8125 21.324219 19.742188 22.0625 19.386719 22.0625 C 19.203125 22.0625 19.03125 21.90625 18.902344 21.636719 C 18.804688 21.394531 18.675781 21.210938 18.621094 21.210938 C 18.546875 21.210938 18.503906 20.953125 18.503906 20.625 C 18.503906 20.171875 18.5625 20.027344 18.789062 19.972656 C 19.175781 19.871094 19.144531 19.417969 18.734375 19.058594 C 18.449219 18.820312 18.40625 18.675781 18.460938 18.179688 C 18.546875 17.496094 19.175781 15.53125 19.402344 15.261719 C 19.488281 15.144531 19.5 15.03125 19.417969 14.976562 C 19.261719 14.859375 18.988281 14.304688 18.859375 13.835938 C 18.761719 13.480469 18.503906 13.410156 18.503906 13.738281 C 18.503906 13.851562 18.335938 14.292969 18.136719 14.703125 C 17.921875 15.101562 17.695312 15.558594 17.636719 15.6875 C 17.566406 15.828125 17.507812 16.070312 17.507812 16.214844 C 17.507812 16.371094 17.4375 16.539062 17.351562 16.582031 C 17.265625 16.640625 17.253906 16.855469 17.296875 17.109375 C 17.367188 17.378906 17.339844 17.578125 17.238281 17.652344 C 17.140625 17.707031 17.066406 18.261719 17.054688 19.117188 L 17.039062 20.5 L 16.554688 20.5 C 16.183594 20.5 16.085938 20.441406 16.085938 20.214844 C 16.085938 19.914062 15.871094 19.828125 15.730469 20.085938 C 15.671875 20.171875 15.488281 20.285156 15.316406 20.355469 C 15.046875 20.46875 15.046875 20.484375 15.417969 20.484375 C 15.628906 20.5 15.800781 20.554688 15.800781 20.613281 C 15.800781 20.683594 15.957031 20.8125 16.15625 20.898438 C 16.371094 20.996094 16.511719 21.011719 16.511719 20.925781 C 16.511719 20.839844 16.640625 20.78125 16.78125 20.78125 C 16.980469 20.78125 17.097656 20.925781 17.152344 21.238281 C 17.28125 21.820312 17.738281 22.621094 18.136719 22.960938 C 19.074219 23.800781 20.769531 23.617188 22.035156 22.546875 C 22.535156 22.136719 23.488281 20.867188 23.488281 20.640625 C 23.488281 20.554688 23.558594 20.5 23.628906 20.5 C 23.714844 20.5 23.773438 20.371094 23.773438 20.226562 C 23.773438 20.070312 23.816406 19.929688 23.886719 19.898438 C 24.042969 19.828125 24.769531 17.609375 24.769531 17.179688 C 24.769531 16.980469 24.824219 16.78125 24.882812 16.738281 C 24.953125 16.699219 25.011719 16.171875 25.023438 15.558594 C 25.039062 14.945312 25.039062 14.40625 25.054688 14.335938 C 25.066406 14.105469 26.007812 14.25 26.304688 14.519531 C 26.675781 14.859375 26.761719 14.875 26.761719 14.578125 C 26.761719 14.449219 26.632812 14.320312 26.476562 14.277344 C 26.320312 14.234375 26.191406 14.136719 26.191406 14.0625 C 26.191406 13.964844 25.964844 13.9375 25.636719 13.992188 C 25.011719 14.0625 24.769531 13.90625 24.769531 13.4375 C 24.769531 13.253906 24.699219 13.066406 24.625 13.023438 C 24.539062 12.96875 24.511719 12.867188 24.554688 12.796875 C 24.597656 12.726562 24.570312 12.597656 24.5 12.5 C 23.730469 11.574219 23.34375 11.058594 23.34375 10.960938 C 23.34375 10.902344 23.160156 10.820312 22.917969 10.761719 C 22.691406 10.71875 22.492188 10.621094 22.492188 10.535156 C 22.492188 10.09375 21.507812 9.75 21.28125 10.105469 C 21.179688 10.277344 20.457031 10.292969 20.300781 10.136719 C 20.199219 10.050781 19.402344 9.894531 17.410156 9.59375 C 16.710938 9.480469 16.65625 9.378906 17.125 9.011719 C 17.308594 8.867188 17.539062 8.597656 17.636719 8.425781 C 17.808594 8.113281 17.835938 8.101562 18.164062 8.328125 C 18.492188 8.539062 18.503906 8.527344 18.503906 8.242188 C 18.503906 8.070312 18.390625 7.828125 18.234375 7.699219 C 18.09375 7.574219 17.921875 7.246094 17.863281 6.976562 C 17.578125 5.695312 16.414062 4.953125 15.117188 5.265625 Z M 16.65625 5.863281 C 17.140625 6.207031 17.621094 6.902344 17.480469 7.046875 C 17.4375 7.101562 17.238281 7.058594 17.054688 6.945312 C 16.882812 6.847656 16.183594 6.734375 15.515625 6.691406 C 14.136719 6.605469 13.980469 6.421875 14.789062 5.878906 C 15.402344 5.464844 16.058594 5.464844 16.65625 5.863281 Z M 14.449219 7.117188 C 14.492188 7.1875 14.933594 7.261719 15.417969 7.261719 C 16.214844 7.261719 17.222656 7.488281 17.453125 7.730469 C 17.496094 7.773438 17.351562 8.070312 17.140625 8.371094 C 16.78125 8.855469 16.65625 8.941406 16.226562 8.910156 C 15.957031 8.910156 15.542969 8.953125 15.332031 9.011719 C 14.976562 9.109375 14.859375 9.054688 14.449219 8.625 C 14.019531 8.171875 13.792969 7.53125 13.921875 7.144531 C 13.992188 6.933594 14.335938 6.917969 14.449219 7.117188 Z M 14.292969 9.097656 C 14.519531 9.296875 15.160156 10.390625 15.046875 10.390625 C 15.019531 10.390625 14.234375 10.648438 13.324219 10.976562 C 11.660156 11.558594 11.246094 11.601562 11.246094 11.175781 C 11.246094 10.605469 12.613281 8.65625 13.222656 8.355469 C 13.566406 8.183594 13.609375 8.199219 13.820312 8.539062 C 13.949219 8.738281 14.164062 8.980469 14.292969 9.097656 Z M 18.746094 19.699219 C 18.578125 20.128906 18.261719 19.957031 18.335938 19.488281 C 18.390625 19.101562 18.421875 19.074219 18.621094 19.261719 C 18.734375 19.386719 18.789062 19.585938 18.746094 19.699219 Z M 18.746094 19.699219 "/>
                        <path d="M 1.722656 9.054688 C 1.722656 9.210938 1.765625 9.253906 1.808594 9.140625 C 1.851562 9.039062 1.835938 8.910156 1.792969 8.867188 C 1.75 8.8125 1.707031 8.898438 1.722656 9.054688 Z M 1.722656 9.054688 "/>
                        <path d="M 16.511719 10.390625 C 16.511719 10.460938 16.414062 10.535156 16.300781 10.535156 C 16.183594 10.535156 16.085938 10.589844 16.085938 10.675781 C 16.085938 10.746094 15.886719 10.820312 15.644531 10.820312 C 15.402344 10.820312 15.003906 10.917969 14.761719 11.046875 C 13.90625 11.488281 13.808594 11.53125 13.523438 11.53125 C 13.367188 11.53125 13.238281 11.585938 13.238281 11.671875 C 13.238281 11.742188 13.109375 11.816406 12.953125 11.816406 C 12.796875 11.816406 12.554688 11.871094 12.414062 11.941406 C 12.285156 12.015625 12.042969 12.128906 11.886719 12.183594 C 11.660156 12.269531 11.644531 12.300781 11.828125 12.339844 C 11.941406 12.371094 12.242188 12.3125 12.46875 12.226562 C 13.507812 11.800781 14.21875 11.585938 14.136719 11.730469 C 14.09375 11.816406 13.835938 12.183594 13.566406 12.539062 C 13.308594 12.910156 13.097656 13.265625 13.097656 13.351562 C 13.097656 13.421875 12.996094 13.566406 12.882812 13.664062 C 12.710938 13.808594 12.511719 13.808594 11.886719 13.621094 C 11.460938 13.507812 11.101562 13.464844 11.101562 13.539062 C 11.101562 13.652344 11.417969 13.722656 11.714844 13.679688 C 11.773438 13.679688 11.816406 13.722656 11.816406 13.808594 C 11.816406 13.878906 11.972656 13.949219 12.171875 13.949219 C 12.371094 13.949219 12.527344 14.007812 12.527344 14.09375 C 12.527344 14.519531 13.28125 13.921875 13.636719 13.222656 C 13.75 13.011719 13.992188 12.683594 14.179688 12.484375 C 14.363281 12.285156 14.519531 12.042969 14.519531 11.957031 C 14.519531 11.886719 14.578125 11.816406 14.632812 11.816406 C 14.703125 11.816406 14.832031 11.660156 14.917969 11.472656 C 15.03125 11.21875 15.144531 11.144531 15.359375 11.203125 C 15.53125 11.246094 15.660156 11.332031 15.660156 11.402344 C 15.660156 11.472656 15.730469 11.53125 15.828125 11.53125 C 15.914062 11.53125 16.199219 11.6875 16.457031 11.886719 C 16.710938 12.085938 16.980469 12.242188 17.066406 12.242188 C 17.351562 12.242188 17.222656 12.597656 16.726562 13.167969 C 16.457031 13.480469 16.226562 13.78125 16.226562 13.820312 C 16.226562 14.007812 15.757812 14.105469 15.601562 13.949219 C 15.53125 13.878906 15.246094 13.808594 15.003906 13.808594 C 14.746094 13.808594 14.390625 13.75 14.191406 13.679688 C 13.835938 13.539062 13.4375 13.695312 13.566406 13.90625 C 13.621094 13.992188 14.078125 14.09375 14.605469 14.136719 C 15.117188 14.191406 15.644531 14.304688 15.757812 14.40625 C 15.941406 14.5625 16.085938 14.460938 16.683594 13.808594 C 17.066406 13.378906 17.421875 12.839844 17.464844 12.613281 C 17.507812 12.382812 17.835938 11.929688 18.179688 11.585938 C 18.503906 11.246094 18.789062 10.917969 18.789062 10.847656 C 18.789062 10.605469 18.105469 10.25 17.652344 10.25 C 17.082031 10.25 17.222656 10.476562 17.863281 10.589844 C 18.320312 10.675781 18.503906 10.917969 18.277344 11.144531 C 18.179688 11.246094 17.167969 10.734375 16.925781 10.449219 C 16.738281 10.21875 16.511719 10.179688 16.511719 10.390625 Z M 17.195312 11.101562 C 17.4375 11.332031 17.652344 11.585938 17.652344 11.660156 C 17.652344 11.984375 17.324219 11.941406 16.710938 11.515625 C 16.085938 11.089844 16.058594 11.046875 16.300781 10.859375 C 16.65625 10.621094 16.65625 10.621094 17.195312 11.101562 Z M 17.195312 11.101562 "/>
                        <path d="M 26.25 11.515625 C 25.367188 11.628906 24.769531 12 24.769531 12.425781 C 24.78125 12.699219 24.796875 12.710938 24.953125 12.527344 C 25.394531 11.957031 25.808594 11.816406 27.003906 11.816406 C 28.113281 11.816406 28.214844 11.84375 28.613281 12.226562 C 28.855469 12.441406 29.039062 12.726562 29.039062 12.839844 C 29.039062 13.011719 29.265625 13.082031 29.949219 13.167969 C 30.546875 13.222656 30.960938 13.351562 31.144531 13.539062 C 31.472656 13.820312 31.886719 13.90625 31.886719 13.664062 C 31.886719 13.578125 31.785156 13.523438 31.671875 13.523438 C 31.558594 13.523438 31.460938 13.453125 31.460938 13.378906 C 31.460938 13.296875 31.359375 13.238281 31.246094 13.238281 C 31.132812 13.238281 31.03125 13.179688 31.03125 13.097656 C 31.03125 13.023438 30.660156 12.925781 30.21875 12.867188 C 29.464844 12.78125 29.351562 12.726562 29.011719 12.226562 C 28.753906 11.859375 28.457031 11.644531 28.085938 11.542969 C 27.515625 11.375 27.386719 11.375 26.25 11.515625 Z M 26.25 11.515625 "/>
                        <path d="M 18.503906 13.097656 C 18.503906 13.167969 18.578125 13.238281 18.648438 13.238281 C 18.734375 13.238281 18.789062 13.167969 18.789062 13.097656 C 18.789062 13.011719 18.734375 12.953125 18.648438 12.953125 C 18.578125 12.953125 18.503906 13.011719 18.503906 13.097656 Z M 18.503906 13.097656 "/>
                        <path d="M 1.023438 14.0625 C 0.867188 14.207031 0.710938 14.535156 0.683594 14.804688 C 0.65625 15.160156 0.539062 15.34375 0.328125 15.445312 C 0.140625 15.515625 0 15.628906 0 15.6875 C 0 15.859375 0.398438 15.828125 0.5 15.644531 C 0.554688 15.558594 0.683594 15.53125 0.796875 15.574219 C 0.953125 15.628906 0.996094 15.5 0.996094 15.019531 C 0.996094 14.277344 1.222656 14.09375 2.179688 14.0625 C 2.988281 14.050781 3.402344 14.292969 3.515625 14.820312 C 3.585938 15.175781 3.660156 15.230469 4.058594 15.230469 C 4.726562 15.230469 5.339844 16.070312 4.8125 16.269531 C 4.710938 16.300781 4.667969 16.382812 4.726562 16.441406 C 4.78125 16.5 4.925781 16.46875 5.039062 16.382812 C 5.152344 16.285156 5.507812 16.226562 5.820312 16.242188 C 6.136719 16.269531 6.433594 16.242188 6.476562 16.199219 C 6.605469 16.070312 6.007812 15.898438 5.820312 16.015625 C 5.75 16.070312 5.421875 15.859375 5.109375 15.53125 C 4.699219 15.117188 4.414062 14.945312 4.128906 14.945312 C 3.816406 14.945312 3.730469 14.890625 3.785156 14.734375 C 3.828125 14.621094 3.699219 14.378906 3.5 14.164062 C 3.1875 13.851562 3.019531 13.808594 2.234375 13.808594 C 1.566406 13.808594 1.253906 13.878906 1.023438 14.0625 Z M 1.023438 14.0625 "/>
                        <path d="M 30.261719 14.019531 C 30.320312 14.136719 30.433594 14.234375 30.546875 14.234375 C 30.789062 14.234375 30.804688 14.476562 30.578125 14.5625 C 30.476562 14.589844 30.433594 14.675781 30.503906 14.734375 C 30.5625 14.804688 30.691406 14.777344 30.777344 14.691406 C 30.875 14.589844 31.117188 14.519531 31.332031 14.519531 C 31.542969 14.519531 31.785156 14.421875 31.886719 14.304688 C 32.058594 14.105469 32 14.09375 31.515625 14.179688 C 31.089844 14.234375 30.902344 14.207031 30.761719 14.035156 C 30.519531 13.75 30.164062 13.738281 30.261719 14.019531 Z M 30.261719 14.019531 "/>
                        <path d="M 15.429688 14.703125 C 15.058594 15.132812 14.777344 15.671875 14.875 15.773438 C 14.933594 15.828125 15.019531 15.785156 15.046875 15.6875 C 15.089844 15.585938 15.203125 15.417969 15.316406 15.316406 C 15.429688 15.203125 15.515625 15.046875 15.515625 14.960938 C 15.515625 14.875 15.585938 14.804688 15.660156 14.804688 C 15.742188 14.804688 15.800781 14.734375 15.800781 14.660156 C 15.800781 14.460938 15.617188 14.492188 15.429688 14.703125 Z M 15.429688 14.703125 "/>
                        <path d="M 21.765625 15.742188 C 21.792969 16.425781 21.75 17.109375 21.664062 17.28125 C 21.59375 17.4375 21.421875 17.808594 21.296875 18.078125 C 20.796875 19.132812 20.484375 19.5 20.085938 19.5 C 19.816406 19.5 19.785156 19.417969 19.785156 18.433594 C 19.785156 17.820312 19.730469 17.367188 19.644531 17.367188 C 19.558594 17.367188 19.5 17.792969 19.5 18.347656 C 19.5 18.902344 19.574219 19.386719 19.644531 19.429688 C 19.898438 19.585938 19.785156 19.800781 19.5 19.714844 C 19.34375 19.671875 19.21875 19.6875 19.21875 19.757812 C 19.21875 19.914062 19.558594 20.070312 19.871094 20.070312 C 20.371094 20.070312 21.78125 18.164062 21.78125 17.507812 C 21.78125 17.28125 21.878906 17.222656 22.21875 17.222656 C 22.476562 17.222656 22.621094 17.167969 22.5625 17.082031 C 22.503906 16.996094 22.40625 16.96875 22.335938 17.011719 C 22.0625 17.179688 21.964844 16.925781 22.0625 16.339844 C 22.191406 15.660156 22.0625 14.632812 21.851562 14.5625 C 21.765625 14.535156 21.722656 14.976562 21.765625 15.742188 Z M 21.765625 15.742188 "/>
                        <path d="M 0 14.890625 C 0 15.003906 0.0703125 15.058594 0.140625 15.019531 C 0.226562 14.976562 0.285156 14.875 0.285156 14.789062 C 0.285156 14.71875 0.226562 14.660156 0.140625 14.660156 C 0.0703125 14.660156 0 14.761719 0 14.890625 Z M 0 14.890625 "/>
                        <path d="M 31.742188 14.875 C 31.742188 14.988281 31.816406 15.089844 31.886719 15.089844 C 31.972656 15.089844 32.027344 14.988281 32.027344 14.875 C 32.027344 14.761719 31.972656 14.660156 31.886719 14.660156 C 31.816406 14.660156 31.742188 14.761719 31.742188 14.875 Z M 31.742188 14.875 "/>
                        <path d="M 6.304688 15.1875 C 6.050781 15.21875 5.835938 15.300781 5.835938 15.386719 C 5.835938 15.460938 5.738281 15.515625 5.621094 15.515625 C 5.507812 15.515625 5.410156 15.574219 5.410156 15.660156 C 5.410156 15.84375 5.738281 15.84375 5.921875 15.671875 C 6.050781 15.53125 6.578125 15.472656 7.34375 15.5 C 7.859375 15.515625 8.539062 16.113281 8.539062 16.527344 C 8.539062 16.753906 8.65625 16.796875 9.296875 16.796875 C 9.695312 16.796875 10.136719 16.726562 10.25 16.65625 C 10.40625 16.554688 10.21875 16.511719 9.652344 16.511719 C 9.140625 16.511719 8.824219 16.457031 8.824219 16.355469 C 8.824219 16.269531 8.613281 15.984375 8.355469 15.730469 C 7.871094 15.246094 7.21875 15.074219 6.304688 15.1875 Z M 6.304688 15.1875 "/>
                        <path d="M 31.261719 15.898438 C 31.101562 15.941406 30.746094 16.128906 30.460938 16.3125 C 30.164062 16.511719 29.539062 16.726562 29.023438 16.8125 C 28.527344 16.898438 28.058594 17.011719 27.972656 17.097656 C 27.898438 17.167969 27.21875 17.222656 26.449219 17.222656 C 25.609375 17.222656 25.054688 17.28125 25.054688 17.367188 C 25.054688 17.453125 25.453125 17.507812 25.949219 17.507812 C 26.449219 17.507812 26.917969 17.578125 27.003906 17.664062 C 27.144531 17.808594 27.203125 17.792969 28 17.394531 C 28.171875 17.296875 28.582031 17.195312 28.925781 17.152344 C 29.90625 17.011719 30.148438 16.953125 30.347656 16.753906 C 30.71875 16.425781 31.175781 16.226562 31.601562 16.226562 C 31.886719 16.226562 32.027344 16.15625 32.027344 16.015625 C 32.027344 15.800781 31.785156 15.773438 31.261719 15.898438 Z M 31.261719 15.898438 "/>
                        <path d="M 2.5625 16.085938 C 2.449219 16.15625 2.207031 16.226562 2.035156 16.226562 C 1.835938 16.226562 1.707031 16.3125 1.707031 16.441406 C 1.707031 16.613281 1.808594 16.640625 2.105469 16.570312 C 2.320312 16.511719 2.519531 16.414062 2.535156 16.339844 C 2.648438 16.070312 3.386719 16.328125 3.84375 16.8125 C 3.957031 16.941406 4.355469 17.082031 4.738281 17.140625 C 5.109375 17.195312 5.410156 17.296875 5.410156 17.378906 C 5.410156 17.621094 5.722656 17.507812 6.007812 17.152344 C 6.164062 16.953125 6.390625 16.796875 6.519531 16.796875 C 6.847656 16.8125 7.261719 17.140625 7.261719 17.410156 C 7.261719 17.523438 7.359375 17.664062 7.488281 17.707031 C 7.859375 17.851562 8.96875 17.808594 8.96875 17.652344 C 8.96875 17.566406 8.710938 17.507812 8.414062 17.507812 C 7.972656 17.507812 7.757812 17.410156 7.359375 17.011719 C 6.789062 16.441406 6.347656 16.382812 5.878906 16.824219 C 5.59375 17.082031 5.507812 17.109375 5.195312 16.96875 C 4.996094 16.867188 4.683594 16.796875 4.511719 16.796875 C 4.339844 16.78125 3.972656 16.597656 3.699219 16.371094 C 3.1875 15.929688 2.917969 15.859375 2.5625 16.085938 Z M 2.5625 16.085938 "/>
                        <path d="M 22.492188 16.371094 C 22.492188 16.441406 22.5625 16.511719 22.648438 16.511719 C 22.71875 16.511719 22.746094 16.441406 22.703125 16.371094 C 22.660156 16.285156 22.589844 16.226562 22.546875 16.226562 C 22.519531 16.226562 22.492188 16.285156 22.492188 16.371094 Z M 22.492188 16.371094 "/>
                        <path d="M 27.757812 16.371094 C 27.757812 16.441406 27.886719 16.511719 28.058594 16.511719 C 28.214844 16.511719 28.300781 16.441406 28.257812 16.371094 C 28.214844 16.285156 28.070312 16.226562 27.957031 16.226562 C 27.84375 16.226562 27.757812 16.285156 27.757812 16.371094 Z M 27.757812 16.371094 "/>
                        <path d="M 25.195312 16.65625 C 25.195312 16.726562 25.394531 16.796875 25.621094 16.796875 C 25.863281 16.796875 26.050781 16.726562 26.050781 16.65625 C 26.050781 16.570312 25.863281 16.511719 25.621094 16.511719 C 25.394531 16.511719 25.195312 16.570312 25.195312 16.65625 Z M 25.195312 16.65625 "/>
                        <path d="M 26.761719 16.65625 C 26.761719 16.726562 26.890625 16.796875 27.046875 16.796875 C 27.203125 16.796875 27.332031 16.726562 27.332031 16.65625 C 27.332031 16.570312 27.203125 16.511719 27.046875 16.511719 C 26.890625 16.511719 26.761719 16.570312 26.761719 16.65625 Z M 26.761719 16.65625 "/>
                        <path d="M 10.25 17.992188 C 9.652344 18.390625 9.265625 18.917969 8.683594 20.058594 C 7.574219 22.234375 7.53125 24.867188 8.597656 25.75 C 8.941406 26.035156 9.539062 25.808594 10.179688 25.152344 C 10.746094 24.554688 11.628906 23.046875 11.714844 22.546875 C 11.730469 22.390625 11.785156 22.207031 11.84375 22.136719 C 11.984375 21.90625 11.089844 21.980469 10.578125 22.234375 C 10.078125 22.492188 9.820312 22.363281 9.820312 21.835938 C 9.820312 21.636719 10.019531 21.410156 10.390625 21.152344 L 10.960938 20.78125 L 11.089844 21.109375 C 11.160156 21.308594 11.332031 21.496094 11.460938 21.550781 C 11.859375 21.695312 11.886719 21.652344 11.558594 21.351562 C 11.175781 20.996094 11.175781 20.925781 11.53125 19.929688 C 11.886719 18.917969 11.886719 18.347656 11.53125 17.964844 C 11.144531 17.566406 10.859375 17.566406 10.25 17.992188 Z M 11.359375 18.378906 C 11.5 18.589844 11.515625 18.71875 11.402344 18.832031 C 11.316406 18.917969 11.246094 19.117188 11.246094 19.273438 C 11.246094 19.816406 10.902344 20.484375 10.546875 20.65625 C 9.820312 21.011719 9.253906 21.507812 9.253906 21.78125 C 9.253906 22.179688 9.808594 22.777344 10.179688 22.777344 C 10.347656 22.777344 10.621094 22.648438 10.789062 22.492188 C 11.058594 22.234375 11.386719 22.105469 11.386719 22.277344 C 11.386719 22.421875 10.734375 23.699219 10.648438 23.742188 C 10.578125 23.773438 10.535156 23.871094 10.535156 23.972656 C 10.535156 24.300781 9.394531 25.339844 9.039062 25.339844 C 8.554688 25.339844 8.257812 24.640625 8.257812 23.542969 C 8.257812 22.648438 8.597656 20.96875 8.839844 20.710938 C 8.910156 20.640625 8.96875 20.46875 8.96875 20.328125 C 8.96875 20.183594 9.039062 20.070312 9.109375 20.070312 C 9.195312 20.070312 9.253906 19.972656 9.253906 19.859375 C 9.253906 19.574219 10.703125 18.078125 10.976562 18.078125 C 11.089844 18.078125 11.261719 18.21875 11.359375 18.378906 Z M 11.359375 18.378906 "/>
                        <path d="M 10.535156 18.933594 C 10.535156 19.003906 10.632812 19.074219 10.746094 19.074219 C 10.859375 19.074219 10.960938 19.003906 10.960938 18.933594 C 10.960938 18.847656 10.859375 18.789062 10.746094 18.789062 C 10.632812 18.789062 10.535156 18.847656 10.535156 18.933594 Z M 10.535156 18.933594 "/>
                        <path d="M 9.707031 20.085938 C 9.851562 20.328125 9.851562 20.414062 9.722656 20.457031 C 9.621094 20.5 9.539062 20.597656 9.539062 20.683594 C 9.539062 20.769531 9.722656 20.667969 9.9375 20.457031 C 10.148438 20.242188 10.40625 20.070312 10.503906 20.070312 C 10.605469 20.070312 10.675781 20 10.675781 19.929688 C 10.675781 19.84375 10.421875 19.785156 10.105469 19.785156 C 9.566406 19.785156 9.539062 19.800781 9.707031 20.085938 Z M 9.707031 20.085938 "/>
                        <path d="M 8.898438 22.761719 C 8.769531 23.160156 9.082031 24.058594 9.339844 24.058594 C 9.578125 24.058594 10.25 23.429688 10.25 23.203125 C 10.25 22.976562 10.121094 23.03125 9.75 23.445312 C 9.367188 23.914062 9.253906 23.859375 9.195312 23.144531 C 9.140625 22.503906 9.023438 22.363281 8.898438 22.761719 Z M 8.898438 22.761719 "/>
                        <path d="M 16.511719 17.835938 C 16.511719 17.964844 16.457031 18.078125 16.371094 18.078125 C 16.300781 18.078125 16.226562 18.179688 16.226562 18.292969 C 16.226562 18.40625 16.285156 18.503906 16.355469 18.503906 C 16.5 18.503906 16.710938 17.792969 16.582031 17.679688 C 16.539062 17.636719 16.511719 17.707031 16.511719 17.835938 Z M 16.511719 17.835938 "/>
                        <path d="M 30.675781 17.75 C 30.136719 17.78125 29.082031 17.851562 28.339844 17.9375 C 27.273438 18.050781 26.976562 18.050781 26.890625 17.90625 C 26.804688 17.78125 26.703125 17.765625 26.535156 17.863281 C 26.105469 18.136719 26.320312 18.277344 27.160156 18.25 C 29.878906 18.164062 31.898438 18.019531 31.957031 17.9375 C 32.070312 17.765625 31.757812 17.722656 30.675781 17.75 Z M 30.675781 17.75 "/>
                        <path d="M 31.628906 18.71875 C 31.628906 18.945312 31.660156 19.03125 31.699219 18.890625 C 31.730469 18.761719 31.730469 18.5625 31.699219 18.460938 C 31.660156 18.378906 31.628906 18.476562 31.628906 18.71875 Z M 31.628906 18.71875 "/>
                        <path d="M 3.203125 19.359375 C 3.046875 19.429688 2.363281 19.488281 1.679688 19.488281 C 0.898438 19.5 0.425781 19.558594 0.425781 19.660156 C 0.425781 19.757812 0.910156 19.785156 1.878906 19.742188 C 3.542969 19.660156 4.414062 19.53125 4.414062 19.34375 C 4.414062 19.1875 3.585938 19.1875 3.203125 19.359375 Z M 3.203125 19.359375 "/>
                        <path d="M 4.910156 19.359375 C 4.855469 19.445312 5.011719 19.5 5.253906 19.5 C 5.496094 19.5 5.695312 19.429688 5.695312 19.359375 C 5.695312 19.273438 5.539062 19.21875 5.351562 19.21875 C 5.152344 19.21875 4.953125 19.273438 4.910156 19.359375 Z M 4.910156 19.359375 "/>
                        <path d="M 5.339844 20.101562 C 4.484375 20.171875 3.019531 20.199219 2.09375 20.15625 C 0.613281 20.101562 0.425781 20.113281 0.582031 20.300781 C 0.726562 20.46875 1.210938 20.5 3.6875 20.441406 C 6.632812 20.382812 7.460938 20.285156 7.316406 20.058594 C 7.273438 19.984375 7.160156 19.941406 7.074219 19.941406 C 6.976562 19.957031 6.207031 20.027344 5.339844 20.101562 Z M 5.339844 20.101562 "/>
                        <path d="M 2.988281 25.179688 C 2.988281 25.265625 3.046875 25.367188 3.132812 25.410156 C 3.21875 25.453125 3.230469 25.394531 3.1875 25.28125 C 3.089844 25.023438 2.988281 24.980469 2.988281 25.179688 Z M 2.988281 25.179688 "/>
                        <path d="M 13.421875 31.699219 C 13.550781 31.730469 13.78125 31.730469 13.921875 31.699219 C 14.050781 31.660156 13.9375 31.628906 13.664062 31.628906 C 13.394531 31.628906 13.28125 31.660156 13.421875 31.699219 Z M 13.421875 31.699219 "/>
                        <path d="M 18.121094 31.699219 C 18.25 31.730469 18.449219 31.730469 18.546875 31.699219 C 18.632812 31.660156 18.535156 31.628906 18.292969 31.628906 C 18.0625 31.628906 17.980469 31.660156 18.121094 31.699219 Z M 18.121094 31.699219 "/>
                    </svg>`;
                    this.icon.onclick = () => {
                        this.interface.style.display = this.interface.style.display === "block" ? "none" : "block";
                    }
                    document.body.appendChild(this.icon);
                }
                createInterface() {
                    this.interface.className = "lite overlay";
                    this.interface.innerHTML = `<div class="content">
                        <p style="text-align: center;"><b>Free Rider Lite</b></p><br>
                        <div class="lite-tabs">
                            <button class="tablinks" name="options" onclick="[...document.querySelectorAll('.lite.overlay .lite-content')].forEach(t => t.style.display = 'none'), document.querySelector('.lite.overlay .lite-content.options').style.display = 'block'">Options</button>
                            <button class="tablinks" name="options" onclick="[...document.querySelectorAll('.lite.overlay .lite-content')].forEach(t => t.style.display = 'none'), document.querySelector('.lite.overlay .lite-content.advanced').style.display = 'block'">Advanced Options</button>
                            <button class="tablinks" name="changes" onclick="[...document.querySelectorAll('.lite.overlay .lite-content')].forEach(t => t.style.display = 'none'), document.querySelector('.lite.overlay .lite-content.changes').style.display = 'block', this.lastElementChild.style.display = 'none', lite.storage.set('cloud', { dismissed: true, notification: sessionStorage.getItem('lite_version') })">
                                Changes
                                <p class="lite-notification new" style="display: ${(!this.storage.get("cloud").dismissed && this.storage.get("cloud").notification <= "4.0.23") ? "inline-block" : "none"}">NEW!</p>
                            </button>
                        </div>
                        <div class="lite-content options">
                            <div class="option" title="Custom rider cosmetic"><input type="checkbox" id="cr" ${this.storage.get("cr") ? "checked" : ""}>Canvas rider</div>
                            <div class="option" title="Toggle dark mode"><input type="checkbox" id="dark" ${this.storage.get("dark") ? "checked" : ""}>Dark mode</div>
                            <div class="option" title="Toggle an input display"><input type="checkbox" id="di" ${this.storage.get("di") ? "checked" : ""}>Input display</div>
                            <div class="option" title="Displays featured ghosts on the leaderboard"><input type="checkbox" id="feats" ${this.storage.get("feats") ? "checked" : ""}>Feat. ghosts</div>
                            <div class="option" title="Change grid style"><input type="checkbox" id="isometric" ${this.storage.get("isometric") ? "checked" : ""}> Isometric grid</div>
                            <div class="option" title="Customize your bike frame"><input type="color" id="cc" value="${this.storage.get("cc") || "#000000"}" style="background: ${this.storage.get("cc") || "#000000"}">Custom bike colour</div>
                        </div>
                        <div class="lite-content advanced" style="display:none">
                            <div class="option" title="Change the size of the input display"><span class="name" style="background-color:rgba(0,0,0,0)">Input display size (${this.storage.get("di_size") || "10"})</span><br><input type="range" id="di_size" min="1" max="10" value="${this.storage.get("di_size") || "10"}" style="padding:0"></div>
                            <div class="option" title="Change the number of snaphsots shown on checkpoints"><span class="name" style="background-color:rgba(0,0,0,0)">Snapshot Count (${this.storage.get("snapshots") || "10"})</span><br><input type="range" id="snapshots" min="0" max="15" value="${this.storage.get("snapshots") || "10"}" style="padding:0"></div>
                            <div class="option" title="Reset all the settings to their default state (THIS CANNOT BE UNDONE)" onclick="lite.storage.reset(), GameManager.game && GameManager.game.currentScene.redraw()">Reset settings</div>
                        </div>
                        <div class="lite-content changes" style="display:none">
                            <ul>
                                <li title="Normally, you could only see them from your own.">
                                    Added the ability to see the last time a user has logged in from other's friends lists
                                </li>
                                <li title="See the advanced tab for more details.">
                                    Added the advanced tab with extra settings. Maily resizing and such
                                </li>
                                <li title="Work in progress...">
                                    Replacing createjs library (programmers' update)
                                </li>
                            </ul>
                        </div>
                    </div>`;
                    this.interface.onmousemove = function(event) {
                        this.style.cursor = this == event.target ? "pointer" : "default";
                    }
                    this.interface.onclick = function(event) {
                        this == event.target && (this.style.display = "none")
                    }
                    document.body.appendChild(this.interface);
                }
                createStyleSheet() {
                    this.stylesheet.href = /*`chrome-extension://eoobfbpaidheakijfedonmpjolfmebjn/overlay/style.css`*/"https://calculamatrise.github.io/free_rider_lite/overlay/style.css";
                    this.stylesheet.rel = "stylesheet";
                    document.head.appendChild(this.stylesheet);
                }
                initCustomization() {
                    if (location.pathname.match(/^\/u/gi)) {
                        fetch(location.href + "?ajax=true").then(t => t.json()).then(t => {
                            if (!document.querySelector(".friend-list.friends-all.active")) return;
                            for (const e of [...document.querySelector(".friend-list.friends-all.active").children]) {
                                if (e.querySelector(".friend-list-item-date")) return;
                                try {
                                    e.querySelector(".friend-list-item-info").appendChild(Object.assign(document.createElement("div"), {
                                        className: "friend-list-item-date",
                                        innerText: "Last Played " + t.friends.friends_data.find(i => i.d_name == e.querySelector(".friend-list-item-name.bold").innerText).activity_time_ago
                                    }));
                                } catch(e) {}
                            }
                        });
                    }
                    if (!location.pathname.match(/^\/customization/gi)) return;
                    document.querySelector("#content").innerHTML = null;
                    fetch("https://raw.githubusercontent.com/Calculamatrise/Calculamatrise.github.io/master/header.html").then(t => t.text()).then(t => document.querySelector("#content").innerHTML = t);
                }
                drawInputDisplay(canvas = document.createElement('canvas')) {
                    const gamepad = GameManager.game.currentScene.playerManager._players[GameManager.game.currentScene.camera.focusIndex]._gamepad.downButtons;
                    const ctx = canvas.getContext('2d');

                    let size = parseInt(this.storage.get("di_size"));
                    let dark = this.storage.get("dark");
                    let offset = {
                        x: size,
                        y: canvas.height - size * 10
                    }

                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.lineWidth = size / 2;
                    ctx.strokeStyle = dark ? "#fff" : "#000000";
                    ctx.fillStyle = dark ? "#fff" : "#000000";

                    ctx.strokeRect(offset.x, offset.y, size * 4, size * 4);
                    gamepad.z && ctx.fillRect(offset.x, offset.y, size * 4, size * 4);
                    ctx.strokeRect(offset.x + 5 * size, offset.y, size * 4, size * 4);
                    gamepad.up && ctx.fillRect(offset.x + 5 * size, offset.y, size * 4, size * 4);
                    ctx.strokeRect(offset.x, offset.y + 5 * size, size * 4, size * 4);
                    gamepad.left && ctx.fillRect(offset.x, offset.y + 5 * size, size * 4, size * 4);
                    ctx.strokeRect(offset.x + 5 * size, offset.y + 5 * size, size * 4, size * 4);
                    gamepad.down && ctx.fillRect(offset.x + 5 * size, offset.y + 5 * size, size * 4, size * 4);
                    ctx.strokeRect(offset.x + 10 * size, offset.y + 5 * size, size * 4, size * 4);
                    gamepad.right && ctx.fillRect(offset.x + 10 * size, offset.y + 5 * size, size * 4, size * 4);

                    ctx.lineWidth = size / 3;
                    ctx.strokeStyle = gamepad.z ? (dark ? "#000000" : "#fff") : (dark ? "#fff" : "#000000");
                    ctx.beginPath();
                    ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size);
                    ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size);
                    ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size);
                    ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size);
                    ctx.stroke();
                    ctx.strokeStyle = gamepad.up ? (dark ? "#000000" : "#fff") : (dark ? "#fff" : "#000000");
                    ctx.beginPath();
                    ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size);
                    ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size);
                    ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size);
                    ctx.stroke();
                    ctx.strokeStyle = gamepad.left ? (dark ? "#000000" : "#fff") : (dark ? "#fff" : "#000000");
                    ctx.beginPath();
                    ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size);
                    ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size);
                    ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size);
                    ctx.stroke();
                    ctx.strokeStyle = gamepad.down ? (dark ? "#000000" : "#fff") : (dark ? "#fff" : "#000000");
                    ctx.beginPath();
                    ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size);
                    ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size);
                    ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size);
                    ctx.stroke();
                    ctx.strokeStyle = gamepad.right ? (dark ? "#000000" : "#fff") : (dark ? "#fff" : "#000000");
                    ctx.beginPath();
                    ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size);
                    ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size);
                    ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size);
                    ctx.stroke();
                }
            }
        },
        get "../libs/builder"() {
            function merge(original, object) {
                for (const key in object) {
                    if (object.hasOwnProperty(key)) {
                        if (typeof original[key] === "object" && typeof object[key] === "object") {
                            merge(original[key], object[key]);

                            continue;
                        }

                        original[key] = object[key];
                    }
                }

                return original;
            }

            return class {
                constructor({ name, defaults }) {
                    if (name !== void 0 && typeof name === "string" || typeof name === "number")
                        this.$name = name;

                    this.$defaults = defaults;
                }
                $name = "default";
                $defaults = {};
                static createElement(t, e) {
                    return Object.assign(document.createElement(t), e);
                }
                get storage() {
                    localStorage.getItem(this.$name) ?? (this.storage = this.$defaults);

                    self = this;

                    return Object.defineProperties(JSON.parse(localStorage.getItem(this.$name)), {
                        get: {
                            value(key) {
                                if (this[key] !== void 0)
                                    return this[key];

                                return null;
                            }
                        },
                        set: {
                            value(key, value) {
                                if (typeof value === "object") {
                                    self.storage = {
                                        [key]: merge(this[key], value)
                                    }
                                }

                                self.storage = {
                                    [key]: value
                                }

                                return self.storage.get(key);
                            }
                        },
                        delete: {
                            value(key) {
                                const deleted = delete this[key];
                                if (deleted) {
                                    self.storage = this;

                                    return true;
                                }

                                return false;
                            }
                        },
                        reset: {
                            value() {
                                localStorage.removeItem(self.$name);

                                return self.storage;
                            }
                        }
                    });
                }
                set storage(items) {
                    localStorage.setItem(this.$name, JSON.stringify(JSON.parse(localStorage.getItem(this.$name)) ? merge(JSON.parse(localStorage.getItem(this.$name)), items) : items));

                    return this.storage;
                }
            }
        }
    })[module.toLowerCase().replace(/\.js$/i, "")];
})
