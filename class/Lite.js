export default window.lite = new class Lite {
    constructor() {
        this.vars = localStorage.lite ? JSON.parse(localStorage.lite).vars : {
            "canvas-rider": false,
            "custom-colour": false,
            dark: false,
            di: true,
            feats: true,
            isometric: false,
            update: {
                dismissed: false,
                uptodate: false
            }
        }
        this.nodes = {
            trackMover: null,
            tools: null
        }
        this.inject(),
        this.saveToLocalStorage(),
        this.checkForUpdate();
    }
    static encode(t) {
        return t.toString(32);
    }
    static decode(t) {
        return parseInt(t, 32);
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
                    v.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000";
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
    drawInputDisplay(canvas = document.createElement('canvas')) {
        var gamepad = GameManager.game.currentScene.playerManager._players[GameManager.game.currentScene.camera.focusIndex]._gamepad.downButtons;
        var ctx = canvas.getContext('2d');
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.getVar("dark") ? "#fff" : "#000";
        ctx.fillStyle = this.getVar("dark") ? "#fff" : "#000";
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
        const lite = JSON.stringify({
            vars: this.vars
        });
        localStorage.setItem("lite", lite)
    }
    getVar(t) {
        return localStorage.lite ? JSON.parse(localStorage.lite).vars[t] : this.vars[t]
    }
    setVar(t, e) {
        if (typeof this.vars[t] == "object") {
            for (const i in e) {
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
    moveTrack() {
        const x = parseInt(moveX.value) || 0;
        const y = parseInt(moveY.value) || 0;
        const code = GameManager.game.currentScene.track.getCode().split("#").map(t => t?.split(/\u002C+/g));
        const black = code[0].map(t => t.split(/\s+/g).map(t => Lite.decode(t))) || [];
        const grey = code[1].map(t => t.split(/\s+/g).map(t => Lite.decode(t))) || [];
        const powerups = code[2].map(t => t.split(/\s+/g).map((t, e, i) => (i[0] == "V" ? e > 0 && e < 3 : e > 0) ? Lite.decode(t) : t)) || [];
        for (const t of black) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }
        for (const t of grey) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }
        for (const t of powerups) {
            for (let e = 1; e < t.length; e += 2) {
                if (t[0] == "V" && e > 2) continue;
                t[e] += x;
                t[e + 1] += y;
            }
        }
        GameManager.game.currentScene.importCode = black.map(t => t.map(t => Lite.encode(t)).join(" ")).join(",") + "#" + grey.map(t => t.map(t => Lite.encode(t)).join(" ")).join(",") + "#" + powerups.map(t => t.map((t, e, i) => (i[0] == "V" ? e > 0 && e < 3 : e > 0) ? Lite.encode(t) : t)).map(t => t.join(" ")).join(",");
    }
    checkForUpdate() {
        fetch("https://calculamatrise.github.io/free_rider_lite/version.json").then(r => r.json()).then(json => {
            if (json.version > "3.3.2" && this.getVar("update").dismissed != !0) {
                this.setVar("update", {
                    uptodate: !0
                });
            }
            if (this.getVar("update").uptodate != !1) {
                const element = document.body;
                element.innerHTML += `<div class="mod-update-notification" id="update-notice" style="width:100%;height:50px;background-color:#2bb82b;color:#fff;position:fixed;top:0;z-index:1002;text-align:center;line-height:46px;cursor:pointer">A new version of Free Rider Lite is available!&nbsp;&nbsp;&nbsp;<button onclick="window.location.href='https://chrome.google.com/webstore/detail/mmmpacciomidmplocdcaheednkepbdkb'" id="update-button" style="height: 30px;background-color: #27ce35;border: none;border-radius: 4px;color: #fff">Update</button>&nbsp;<button class="mod-dismiss-button" id="dismiss-notice" style="height:30px;background-color:#27ce35;border:none;border-radius:4px;color: #fff">Dismiss</button></div>`;
                document.getElementById('dismiss-notice').onclick = () => {
                    this.setVar("update", {
                        uptodate: !1,
                        dismissed: !0
                    });
                    document.getElementById('update-notice').style.display = "none";
                };
                document.getElementById('update-button').onclick = () => {
                    this.setVar("update", {
                        uptodate: !1,
                        dismissed: !0
                    });
                    document.getElementById('update-notice').style.display = "none";
                };
            }
        });
    }
    inject() {
        document.head.appendChild(Object.assign(document.createElement("style"), {
            type: "text/css",
            innerHTML: `.lite.icon {
                background-image:url(https://i.imgur.com/bNBqU1b.png);
                margin:7px;
                width:32px;
                height:32px;
                position:fixed;
                bottom:40px;
                left:0;
                z-index:10
            }
            .lite.icon:hover {
                opacity:0.4;
                cursor:pointer
            }
            .lite.settings {
                background-color:#fff;
                border:1px solid grey;
                line-height:normal;
                padding:14px;
                position:fixed;
                bottom:0;left:0;
                z-index:11
            }
            .lite.settings input {
                height:auto
            }
            .lite.hacker-mode-text {
                font-family:monospace;
                line-height:20pt
            }
            #color {
                border:none;
                background-color:#ffffff00;
                font-size:13px;
                font-family:roboto_medium,Arial,Helvetica,sans-serif;
                color:#1b5264
            }
            #color:hover {
                cursor:pointer
            }
            .lite.settings .option {
                padding:8px;
                border:none;
                background-color:#ffffff00;
                font-size:13px;
                font-family:roboto_medium,Arial,Helvetica,sans-serif;
                color:#1b5264
            }
            .lite.settings .option:hover, .lite.settings .option:hover * {
                cursor:pointer;
                background:#f0f7ff;
                border-radius: 8px
            }
            .lite.settings .option input[type="checkbox"] {
                transform: scale(.85) rotate(90deg);
                transition: all .2s;
            }
            .lite.settings .option input[type="checkbox"]:checked {
                transform: scale(1) rotate(0);
                transition: all .2s;
            }
            .lite.settings .option input[type="color"] {
                -webkit-appearance: none;
                border: 1px solid rgba(0, 0, 0, 0.2);
                box-sizing: border-box;
                border-radius: 4px;
                padding: 0;
                width: 13px;
                height: 13px;
                background: #000
            }
            .lite.settings .option input[type="color"]::-webkit-color-swatch-wrapper {
                padding: 0;
            }
            .lite.settings .option input[type="color"]::-webkit-color-swatch {
                border: none;
            }`
        }));
        document.body.appendChild(Object.assign(document.createElement("div"), {
            className: "lite icon", //fed7d7  fb3737
            onclick: () => {
                var t = e => {
                    s.contains(e.target) || (document.removeEventListener("click", t),
                    document.body.removeChild(s))
                }
                document.body.appendChild(s),
                setTimeout(() => document.addEventListener("click", t), 0)
            }
        }));
        var s = Object.assign(document.createElement("div"), {
            className: "lite settings",
            innerHTML: `<p style="text-align: center;"><b>Mod</b> <i>Settings</i></p><br>
            <div class="option"><input title="Custom rider cosmetic" type="checkbox" id="canvas-rider" ${this.getVar("canvas-rider") ? "checked" : ""}> Canvas rider</div>
            <div class="option"><input title="Dark mode..." type="checkbox" id="dark" ${this.getVar("dark") ? "checked" : ""}> Dark mode</div>
            <div class="option"><input title="Enables an input display" type="checkbox" id="di" ${this.getVar("di") ? "checked" : ""}> Input display</div>
            <div class="option"><input title="Displays featured ghosts on the leaderboard" type="checkbox" id="feats" ${this.getVar("feats") ? "checked" : ""}> Feat. ghosts</div>
            <div class="option"><input title="Change grid style" type="checkbox" id="isometric" ${this.getVar("isometric") ? "checked" : ""}> Isometric grid</div>
            <div class="option"><input title="Customize your bike frame" type="color" id="custom-colour" value="${this.getVar("custom-colour") || "#000"}" style="background: ${this.getVar("custom-colour") || "#000"}"> Custom bike colour</div><br>`
        });
        for (const t in this.vars) {
            if (s.querySelector("#" + t)) {
                if (t == "custom-colour") {
                    s.querySelector("#" + t).parentElement.onclick = s.querySelector("#" + t).onchange = () => {
                        s.querySelector("#" + t).style.background = s.querySelector("#" + t).value || "#000",
                        this.setVar(t, s.querySelector("#" + t).value),
                        s.querySelector("#custom-colour").click()
                    }
                    continue;
                }
                s.querySelector("#" + t).parentElement.onclick = s.querySelector("#" + t).onchange = () => {
                    s.querySelector("#" + t).checked = !s.querySelector("#" + t).checked,
                    this.setVar(t, !this.getVar(t));
                    if (t == "dark")
                        GameManager.game.currentScene.track.undraw(),
                        GameInventoryManager.redraw()
                }
                s.querySelector("#" + t).onclick = () => {
                    this.setVar(t, !this.getVar(t));
                    if (t == "dark")
                        GameManager.game.currentScene.track.undraw(),
                        GameInventoryManager.redraw()
                }
            }
        }
    }
}