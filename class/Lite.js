import StrongMap from "./StrongMap.js";
<<<<<<< HEAD
import Vector from "./Vector.js";

window.lite = new class {
	constructor() {
        GameManager.on("stateChange", (state) => {
            if (state.preloading === false && this.loaded === false) {
                this.loaded = this.load();
            }
        });

        Application.events.subscribe("route", () => this.loaded = false);
        Application.events.subscribe("mainview.loaded", this.childLoad.bind(this));

        this.childLoad();

        addEventListener("message", ({ data }) => {
            switch(data.action) {
                case "updateStorage":
                    this.storage = new StrongMap(data.storage);
                    break;
            }
    
            this.refresh();
        });
	}
    loaded = false;
    storage = new StrongMap(JSON.parse(sessionStorage.getItem("lite")));
    snapshots = new class extends Array {
        push(...args) {
            if (this.length >= parseInt(lite.storage.get("snapshots"))) {
                this.splice(0, this.length - parseInt(lite.storage.get("snapshots")));
=======

window.lite = new class {
	constructor() {
		this.childLoad();
        Application.events.subscribe("route.after", this.childLoad.bind(this));

        addEventListener("message", this.listener.bind(this));
	}

    storage = new StrongMap(JSON.parse(sessionStorage.getItem("lite")));
    snapshots = new class extends Array {
        push(...args) {
            if (this.length >= parseInt(window.lite.storage.get("snapshots"))) {
                this.splice(0, this.length - parseInt(window.lite.storage.get("snapshots")));
>>>>>>> parent of 6e3ea12 (Delete class directory)
            }

            super.push(...args);
        }
    }
<<<<<<< HEAD
=======

>>>>>>> parent of 6e3ea12 (Delete class directory)
    get game() {
        if (GameManager.hasOwnProperty("game") && GameManager.game !== null) {
            return GameManager.game;
        }
        
        return null;
    }

    get focusOverlay() {
        return this.game.gameContainer.querySelector(".gameFocusOverlay");
    }

    createElement(type, options) {
        let element = document.createElement(type);
        for (const attribute in options) {
            if (typeof options[attribute] === "object") {
                if (attribute === "style") {
                    for (const property in options[attribute]) {
                        element.style.setProperty(property, options[attribute][property]);
                    }
                } else if (attribute === "children") {
                    element.append(...options[attribute]);
                }
            } else if (typeof options[attribute] === "function") {
                element.addEventListener(attribute, options[attribute]);
            } else {
                if (attribute.startsWith("inner")) {
                    element[attribute] = options[attribute];
                } else {
                    element.setAttribute(attribute, options[attribute]);
                }
            }
        }
    
        return element;
    }

    createAccountContainer({ login, password }) {
        let container = this.createElement("div", {
            children: [
                this.createElement("button", {
                    class: "new-button button-type-1",
                    innerText: login,
                    style: {
                        width: "82%"
                    },
                    click() {
                        document.querySelector("#simplemodal-overlay")?.remove();
                        document.querySelector("#signup_login_container")?.remove();
                        Application.Helpers.AjaxHelper.post("/auth/standard_login", { login, password }).done(function(response) {
                            response.result && Application.events.publish("auth.login", response.data.user, response.data.user_stats);
                        });
                    }
                }),
                this.createElement("button", {
                    class: "btn new-button button-type-1 moderator-remove-race",
                    innerText: "X",
                    style: {
                        height: "100%",
                        'margin-right': 0,
                        width: "16%"
                    },
                    click() {
                        let accounts = JSON.parse(localStorage.getItem("switcher-accounts")) ?? [];
                        accounts.splice(accounts.indexOf(accounts.find((account) => account.login === login)), 1);
    
                        localStorage.setItem("switcher-accounts", JSON.stringify(accounts));
    
                        container.remove();
                    }
                })
            ],
            style: {
                display: "flex",
                'justify-content': "space-between",
                margin: "4px",
                width: "100%"
            }
        });
    
        return container;
    }

<<<<<<< HEAD
	overrideMethods() {
        let update = this.game.currentScene.playerManager.firstPlayer.constructor.prototype.update;
        this.game.currentScene.playerManager.firstPlayer.constructor.prototype.update = function() {
            let t = {};
            this._tempVehicleTicks > 0 ? (t._tempVehicleType = this._tempVehicleType,
            t._tempVehicle = JSON.stringify(this._tempVehicle, this._snapshotFilter),
            t._tempVehicleTicks = this._tempVehicleTicks) : (t._baseVehicleType = this._baseVehicleType,
            t._baseVehicle = JSON.stringify(this._baseVehicle, this._snapshotFilter)),
            t._powerupsConsumed = JSON.stringify(this._powerupsConsumed),
            t._crashed = this._crashed;
            this.isGhost() || lite.storage.get("trail") && lite.snapshots.push(t);
            update.apply(this, arguments);
        }

        function drawBaseVehicle() {
            if (this.explosion)
                this.explosion.draw(1);
            else {
                let t = this.scene.game.canvas.getContext("2d");
                if (t.imageSmoothingEnabled = !0,
                t.webkitImageSmoothingEnabled = !0,
                t.mozImageSmoothingEnabled = !0,
                this.settings.developerMode)
                    for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                        e[s].draw();

                let max = lite.storage.get("snapshots");
                if (max > 0) {
                    if (lite.storage.get("trail")) {
                        lite.snapshots.forEach((snapshot, index) => {
                            snapshot.hasOwnProperty("_baseVehicle") && this.drawBikeFrame(JSON.parse(snapshot._baseVehicle), max / (max * 200) * index % 1);
                        });
                    }

                    if (this.player.isGhost() || this.scene.ticks && this.scene.state.playing == !1) {
                        // this.player._checkpoints = this.player._checkpoints.slice(-101);
                        this.player._checkpoints.forEach((checkpoint, index) => {
                            if (index > this.player._checkpoints.length - (parseInt(max) + 1)) {
                                checkpoint.hasOwnProperty("_baseVehicle") && this.drawBikeFrame(JSON.parse(checkpoint._baseVehicle), max / 3e2 * index  % 1);
                            }
                        });
                    }
                }
    
                this.drawBikeFrame()
            }
        }

        this.game.currentScene.playerManager.firstPlayer.setBaseVehicle("BMX");
        Object.getPrototypeOf(this.game.currentScene.playerManager.firstPlayer._baseVehicle).draw = drawBaseVehicle;
        Object.getPrototypeOf(this.game.currentScene.playerManager.firstPlayer._baseVehicle).drawBikeFrame = function(self = this, alpha = this.player._opacity) {
            var t = this.scene
            , rearWheel = new Vector(self.rearWheel.pos.x, self.rearWheel.pos.y)
            , frontWheel = new Vector(self.frontWheel.pos.x, self.frontWheel.pos.y)
            , head = new Vector(self.head.pos.x, self.head.pos.y)
            , e = rearWheel.toScreen(t)
            , i = frontWheel.toScreen(t)
            , n = head.toScreen(t)
            , r = alpha
            , o = i.sub(e)
            , l = self.dir
            , a = new Vector((i.y - e.y) * l,(e.x - i.x) * l)
            , h = self.pedala
            , c = t.camera.zoom
            , u = t.game.canvas.getContext("2d");
            u.globalAlpha = r,
            u.strokeStyle = window.lite.storage.get("cc") || (window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000000"),
            u.lineWidth = 3 * c,
            u.lineCap = "round",
            u.lineJoin = "round",
            u.beginPath(),
            u.fillStyle = "rgba(200,200, 200, 0.2)",
            u.arc(i.x, i.y, 10.5 * c, 0, 2 * Math.PI, !1),
            u.fill(),
            u.stroke(),
            u.beginPath(),
            u.arc(e.x, e.y, 10.5 * c, 0, 2 * Math.PI, !1),
            u.fill(),
            u.stroke();
            var p = e.add(o.factor(.3)).add(a.factor(.25))
            , d = e.add(o.factor(.4)).add(a.factor(.05))
            , f = e.add(o.factor(.84)).add(a.factor(.42))
            , v = e.add(o.factor(.84)).add(a.factor(.37));
            u.beginPath(),
            u.strokeStyle = window.lite.storage.get("cc") || (window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000000"),
            u.moveTo(e.x, e.y),
            u.lineTo(p.x, p.y),
            u.lineTo(f.x, f.y),
            u.moveTo(v.x, v.y),
            u.lineTo(d.x, d.y),
            u.lineTo(e.x, e.y),
            u.stroke(),
            u.beginPath(),
            u.strokeStyle = window.lite.storage.get("cc") || (window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000000"),
            u.lineWidth = Math.max(1 * c, .5),
            u.arc(d.x, d.y, 3 * c, 0, 2 * Math.PI, !1),
            u.stroke();
            var g = new Vector(6 * Math.cos(h) * c,6 * Math.sin(h) * c)
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
            u.strokeStyle = window.lite.storage.get("cc") || (window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000000"),
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
            u.moveTo(C.x, C.y),
            u.lineTo(k.x, k.y),
            u.lineTo(S.x, S.y),
            u.lineTo(P.x, P.y),
            u.stroke(),
            u.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000000";
            if (self.crashed) {
                self.ragdoll && typeof self.ragdoll.draw === "function" && self.ragdoll.draw();
            } else {
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
                u.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#cccccca5" : window.lite.storage.get("theme") === "dark" ? "#fdfdfda5" : "#000000a5",
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
                u.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fdfdfd" : "#000000",
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
                var R = GameInventoryManager.getItem(this.cosmetics.head);
                R.draw(u, L.x, L.y, self.drawHeadAngle, c, self.dir),
                u.globalAlpha = 1
            }
        }

        this.game.currentScene.playerManager.firstPlayer.setBaseVehicle("MTB");
        Object.getPrototypeOf(this.game.currentScene.playerManager.firstPlayer._baseVehicle).draw = drawBaseVehicle;
        Object.getPrototypeOf(this.game.currentScene.playerManager.firstPlayer._baseVehicle).drawBikeFrame = function(self = this, alpha = this.player._opacity) {
            var t = this.scene
                , frontWheel = new Vector(self.frontWheel.pos.x, self.frontWheel.pos.y)
                , rearWheel = new Vector(self.rearWheel.pos.x, self.rearWheel.pos.y)
                , head = new Vector(self.head.pos.x, self.head.pos.y)
                , e = frontWheel.toScreen(t)
                , i = rearWheel.toScreen(t)
                , n = head.toScreen(t)
                , r = t.camera.zoom
                , o = t.game.canvas.getContext("2d")
                , a = alpha
                , h = e.sub(i)
                , l = new Vector((e.y - i.y) * self.dir,(i.x - e.x) * self.dir)
                , c = h.factor(.5);
            i.addOut(c, c),
            n.subOut(c, c),
            o.globalAlpha = a,
            o.strokeStyle = window.lite.storage.get("cc") || (window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000"),
            o.lineWidth = 3 * r,
            o.lineCap = "round",
            o.lineJoin = "round",
            o.beginPath(),
            o.fillStyle = "rgba(200,200, 200,0.2)",
            o.arc(e.x, e.y, 12.5 * r, 0, 2 * Math.PI, !1),
            o.fill(),
            o.stroke(),
            o.beginPath(),
            o.arc(i.x, i.y, 12.5 * r, 0, 2 * Math.PI, !1),
            o.fill(),
            o.stroke(),
            o.strokeStyle = "rgba(153, 153, 153,1)",
            o.fillStyle = "rgba(204, 204, 204,1)",
            o.lineWidth = 1,
            o.beginPath(),
            o.arc(e.x, e.y, 6 * r, 0, 2 * Math.PI, !1),
            o.fill(),
            o.stroke(),
            o.beginPath(),
            o.arc(i.x, i.y, 6 * r, 0, 2 * Math.PI, !1),
            o.fill(),
            o.stroke(),
            o.beginPath(),
            o.strokeStyle = window.lite.storage.get("cc") || (window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000"),
            o.lineWidth = 5 * r,
            o.moveTo(i.x, i.y),
            o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
            o.moveTo(i.x + .72 * h.x + .64 * c.x, i.y + .72 * h.y + .64 * c.y),
            o.lineTo(i.x + .46 * h.x + .4 * c.x, i.y + .46 * h.y + .4 * c.y),
            o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
            o.stroke(),
            o.beginPath(),
            o.lineWidth = 2 * r,
            o.strokeStyle = window.lite.storage.get("cc") || (window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000"),
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
            var u = new Vector(6 * Math.cos(this.pedala) * r,6 * Math.sin(this.pedala) * r);
            o.moveTo(i.x + .43 * h.x + .05 * l.x + u.x, i.y + .43 * h.y + .05 * l.y + u.y),
            o.lineTo(i.x + .43 * h.x + .05 * l.x - u.x, i.y + .43 * h.y + .05 * l.y - u.y),
            o.stroke(),
            o.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000";
            if (self.crashed)
                self.ragdoll && self.ragdoll.draw && self.ragdoll.draw();
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
                o.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#cccccca5" : window.lite.storage.get("theme") === "dark" ? "#fdfdfda5" : "rgba(0,0,0," + .5 * a + ")",
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
                o.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000000",
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
                l.x = h.y * self.dir,
                l.y = -h.x * self.dir,
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
                var A = GameInventoryManager.getItem(this.cosmetics.head);
                A.draw(o, k.x, k.y, self.drawHeadAngle, r, self.dir),
                o.globalAlpha = 1
            }
        }

        this.game.currentScene.playerManager.firstPlayer.setBaseVehicle(this.game.settings.track?.vehicle || this.game.settings.startVehicle);

        Object.getPrototypeOf(this.game.currentScene.mouse).updateRealPosition = function(t) {
            let i = t.real;
            i.x = Math.round((t.pos.x - this.scene.screen.center.x) / this.scene.camera.zoom + this.scene.camera.position.x),
            i.y = Math.round((t.pos.y - this.scene.screen.center.y) / this.scene.camera.zoom + this.scene.camera.position.y);
            if (this.scene.toolHandler.options.grid) {
                let p = this.scene.settings.toolHandler.gridSize | 0;
                if (lite.storage.get("isometric")) {
                    let Ab = (t, e) => ((t % e) + e) % e;
                    let g = p / 2,
                        adjusted = Math.round(i.x / p);
                    i.x = adjusted * p;
                    i.y = i.y - Ab(i.y + g * (Ab(adjusted, 2) + 1), p) - (g * (Ab(adjusted, 2) - 1)) + (Ab(adjusted, 2) * g);
                } else {
                    i.x = Math.round(i.x / p) * p
                    i.y = Math.round(i.y / p) * p
                }
            }
=======
    listener({ data }) {
        switch(data.action) {
            case "updateStorage":
                this.storage = new StrongMap(data.storage);
                break;
        }

        this.refresh();
    }

	overrideMethods() {
        this.game.currentScene.__proto__.draw = function() {
            this.toolHandler.drawGrid(),
            this.track.draw(),
            this.drawPlayers(),
            this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
            this.loading && this.loadingcircle.draw(),
            this.message.draw()
        }

        this.game.currentScene.playerManager.constructor.prototype.createPlayer = function(t, e) {
            return new Player(this.scene,e);
        }

        this.game.currentScene.playerManager.firstPlayer.constructor.prototype.draw = function() {
            this.updateOpacity();
            let t = this._baseVehicle;
            this._tempVehicleTicks > 0 && (t = this._tempVehicle),
            this._effectTicks > 0 && this._effect.draw(this._effectTicks / 100),
            t.draw(),
            // this._scene.ticks > 0 && this._scene.state.playing == !1 && t.clone(),
            this.isGhost() && this.drawName()
>>>>>>> parent of 6e3ea12 (Delete class directory)
        }

        this.game.currentScene.message.constructor.prototype.draw = function() {
            var t = this.message
              , e = this.timeout
              , i = this.color
              , s = this.outline;
            if (e !== !1 && 0 >= e && (t = !1),
            this.scene.state.paused && (i = !1,
            s = !1,
            t = this.scene.settings.mobile ? "Paused" : "Paused - Press Spacebar to Continue"),
            i === !1 && (i = lite.storage.get("theme") === "midnight" ? "#888" : lite.storage.get("theme") === "dark" ? "#ccc" : "#333"),
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
                a.fillStyle = lite.storage.get("theme") === "midnight" ? "#888" : lite.storage.get("theme") === "dark" ? "#999" : i,
                a.lineWidth = 4 * (o / 2),
                a.font = 12 * o + "pt helsinki",
                a.textAlign = "center",
                s && (a.strokeStyle = lite.storage.get("theme") === "dark" ? "#fff" : s,
                a.strokeText(t, h, l * o),
                a.strokeStyle = lite.storage.get("theme") === "dark" ? "#fff" : "#000"),
                a.fillText(t, h, l * o),
                a.restore()
            }
        }

<<<<<<< HEAD
        this.game.currentScene.toolHandler.drawGrid = function() {
            var t = this.scene.game.pixelRatio
              , e = this.scene.game.canvas.getContext("2d");
            this.options.grid === !0 && this.options.visibleGrid && (lite.storage.get("isometric") ? this.drawCachedIsometricGrid(e, t) : this.drawCachedGrid(e, t))
        }

        this.game.currentScene.toolHandler.drawCachedIsometricGrid = function(t, e) {
            this.cacheIsometricGrid(e);
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

        this.game.currentScene.toolHandler.cacheIsometricGrid = function() {
            var t = this.scene.camera.zoom
              , e = 200 * t
              , i = 200 * t
              , n = this.options.gridSize
              , r = n * t
              , o = document.createElement("canvas");
            o.width = e,
            o.height = i;
            var a = o.getContext("2d");
            a.strokeStyle = this.options.gridMinorLineColor,
            a.fillStyle = this.options.gridMinorLineColor,
            a.strokeWidth = 1,
            a.beginPath();
            var h = null
              , b = null
              , l = null
              , c = null
              , u = null;
            for (h = Math.floor(e / r),
            l = 0; h >= l; l++) {
                for (h = Math.floor(i / r),
                b = 0; h >= b; b+=.5) {
                    a.beginPath();
                    if(b - Math.floor(b) === 0) {
                        c = b * r,
                        u = l * r,
                        a.arc(c * 2, u, 2, 0, 2 * Math.PI);
                    } else {
                        c = b * r,
                        u = (l + .5) * r,
                        a.arc(c * 2, u, 2, 0, 2 * Math.PI);
                    }
                    a.fill(),
                    a.stroke();
                }
            }
            this.gridCache = o,
            this.gridCacheAlpha = Math.min(t + .2, 1)
        }

        this.game.currentScene.toolHandler.tools.hasOwnProperty("brush") && (Object.getPrototypeOf(this.game.currentScene.toolHandler.tools.brush).drawLine = function(t, e) {
            var i = this.scene,
                s = 2 * e > .5 ? 2 * e : .5,
                n = this.toolhandler,
                r = n.options.lineType,
                o = "physics" === r ? i.game.settings.physicsLineColor : i.game.settings.sceneryLineColor;
            t.beginPath(),
            t.lineWidth = s,
            t.lineCap = "round",
            t.strokeStyle = o;
            var a = this.p1.toScreen(i)
              , h = this.p2.toScreen(i);
            t.moveTo(a.x, a.y),
            t.lineTo(h.x, h.y),
            t.stroke()
        });

        this.game.currentScene.toolHandler.tools.hasOwnProperty("curve") && (Object.getPrototypeOf(this.game.currentScene.toolHandler.tools.curve).drawLine = function(t, e) {
            var i = this.scene
              , s = 2 * e > .5 ? 2 * e : .5
              , n = this.toolhandler
              , r = n.options.lineType
              , o = "physics" === r ? i.game.settings.physicsLineColor : i.game.settings.sceneryLineColor;
            t.beginPath(),
            t.lineWidth = s,
            t.lineCap = "round",
            t.strokeStyle = o;
            var a = this.p1.toScreen(i)
              , h = this.p2.toScreen(i)
              , l = this.midpoint.toScreen(i);
            t.moveTo(a.x, a.y),
            t.quadraticCurveTo(l.x, l.y, h.x, h.y),
            t.stroke()
        });

        this.game.currentScene.toolHandler.tools.hasOwnProperty("straightline") && (Object.getPrototypeOf(this.game.currentScene.toolHandler.tools.straightline).drawLine = function(t, e) {
            var i = this.scene
                , s = 2 * e > .5 ? 2 * e : .5
                , n = this.toolhandler
                , r = n.options.lineType
                , o = "physics" === r ? i.game.settings.physicsLineColor : i.game.settings.sceneryLineColor;
            t.beginPath(),
            t.lineWidth = s,
            t.lineCap = "round",
            t.strokeStyle = o;
            var a = this.p1.toScreen(i)
              , h = this.p2.toScreen(i);
            t.moveTo(a.x, a.y),
            t.lineTo(h.x, h.y),
            t.stroke()
        });

=======
>>>>>>> parent of 6e3ea12 (Delete class directory)
		this.refresh();
    }

    load() {
<<<<<<< HEAD
        this.overrideMethods();
        this.snapshots.splice(0, this.snapshots.length);
        createjs.Ticker.removeAllEventListeners();
        createjs.Ticker.on("tick", (() => {
            this.game.currentScene.update(),
            this.update(),
            this.game.tickCount++;
        }).bind(this.game));
        this.refresh();

        return true;
    }

	childLoad() {
        if (location.pathname.match(/^\/t\//gi) && this.storage.get("feats")) {
            fetch("https://raw.githubusercontent.com/Calculamatrise/frhd_featured_ghosts/master/display.js").then(r => r.text()).then(data => {
                document.head.appendChild(Object.assign(document.createElement("script"), {
                    innerHTML: data,
                    onload: function() {
                        this.remove()
                    }
                }));
            })
        }

		if (location.pathname.match(/^\/u\//gi)) {
            Application.Helpers.AjaxHelper.get(location.pathname).done((response) => {
                if (!document.querySelector(".friend-list.friends-all.active")) return;
				for (const element of document.querySelector(".friend-list.friends-all.active").children) {
					if (element.querySelector(".friend-list-item-date") !== null) return;
                    element.querySelector(".friend-list-item-info").appendChild(this.createElement("div", {
                        class: "friend-list-item-date",
                        innerText: "Last Played " + response.friends.friends_data.find((user) => user.d_name == element.querySelector(".friend-list-item-name.bold").innerText).activity_time_ago
                    }));
				}
            });
		}

        if (this.storage.get("multi-account")) {
            let logout = document.querySelector("a.logout");
            logout.removeAttribute("id");
            logout.innerText = "Switch";
            logout.addEventListener("click", function() {
                let overlay = createElement("div", {
                    class: "simplemodal-overlay",
                    id: "simplemodal-overlay",
                    style: {
                        height: "100%",
                        left: 0,
                        opacity: 0.5,
                        position: "fixed",
                        top: 0,
                        width: "100%",
                        'z-index': 1001
                    }
                });
        
                let container = this.createElement("div", {
                    children: [
                        this.createElement("span", {
                            class: "core_icons core_icons-icon_close signup-login-modal-close",
                            click() {
                                overlay.remove();
                                container.remove();
                            }
                        }),
                        this.createElement("div", {
                            children: (JSON.parse(localStorage.getItem("switcher-accounts")) ?? []).map((account) => createUserElement(account)),
                            id: "accounts-container",
                            style: {
                                display: "flex",
                                'flex-direction': "column"
                            }
                        }),
                        createElement("button", {
                            class: "btn new-button button-type-2",
                            innerText: "Add account",
                            style: {
                                'font-size': "16px",
                                height: "36px",
                                margin: "4px",
                                width: "100%"
                            },
                            click() {
                                if (document.querySelector("div#login-container")) {
                                    this.innerText = "Add account";
                                    this.classList.remove("moderator-remove-race");
                                    document.querySelector("div#login-container").remove();
                                    return;
                                }
        
                                this.before(createElement("div", {
                                    children: [
                                        createElement("input", {
                                            class: "field auth-field",
                                            id: "save-account-login",
                                            placeholder: "Username or Email",
                                            style: {
                                                'border-radius': "20px",
                                                margin: "4px",
                                                width: "100%"
                                            },
                                            type: "text"
                                        }),
                                        createElement("input", {
                                            class: "field auth-field",
                                            id: "save-account-password",
                                            placeholder: "Password",
                                            style: {
                                                'border-radius': "20px",
                                                margin: "4px",
                                                width: "100%"
                                            },
                                            type: "password"
                                        }),
                                        createElement("button", {
                                            class: "new-button button-type-1",
                                            innerText: "Save account",
                                            style: {
                                                margin: "4px",
                                                width: "100%"
                                            },
                                            click() {
                                                Application.Helpers.AjaxHelper.post("/auth/standard_login", { login: document.querySelector("#save-account-login")?.value, password: document.querySelector("#save-account-password")?.value }).done((response) => {
                                                    if (response.result) {
                                                        let accounts = JSON.parse(localStorage.getItem("switcher-accounts")) || [];
                                                        if (accounts.find(({ login }) => login === response.data.user.d_name)) {
                                                            return;
                                                        }
        
                                                        accounts.push({
                                                            login: response.data.user.d_name,
                                                            password: document.querySelector("#save-account-password")?.value
                                                        });
        
                                                        document.querySelector("#accounts-container")?.append(createUserElement(accounts[accounts.length - 1]));
        
                                                        localStorage.setItem("switcher-accounts", JSON.stringify(accounts));
                                                        this.parentElement.remove();
                                                    }
                                                });
                                            }
                                        })
                                    ],
                                    id: "login-container",
                                    style: {
                                        display: "flex",
                                        'flex-direction': "column",
                                        'margin-top': "16px"
                                    }
                                }));
                                this.classList.add("moderator-remove-race");
                                this.innerText = "Cancel";
                            }
                        })
                    ],
                    class: "simplemodal-container",
                    id: "signup_login_container",
                    style: {
                        display: "flex",
                        'flex-direction': "column",
                        height: "50%",
                        left: "36%",
                        padding: "50px",
                        position: "fixed",
                        top: "25%",
                        width: "360px",
                        'z-index': 1002
                    }
                });
        
                document.body.append(overlay, container);
            });
        }
=======
        // this.overrideMethods();
        // createjs.Ticker.removeAllEventListeners();
        // createjs.Ticker.on("tick", (() => {
        //     this.game.currentScene.update(),
        //     this.update(),
        //     this.game.tickCount++;
        // }).bind(this.game));
        this.refresh();
    }

	childLoad() {
		if (location.pathname.match(/^\/u\//gi)) {
			fetch(`${location.href}?ajax=true`).then(t => t.json()).then(t => {
				if (!document.querySelector(".friend-list.friends-all.active")) return;
				for (const e of document.querySelector(".friend-list.friends-all.active").children) {
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


>>>>>>> parent of 6e3ea12 (Delete class directory)
	}

    refresh() {
        let keymap = this.storage.get("keymap");
        this.game.currentScene.playerManager.firstPlayer._gamepad.setKeyMap(this.game.settings[(this.game.currentScene.hasOwnProperty("races") ? "play" : "editor") + "Hotkeys"]);
        for (let key in keymap) {
            this.game.currentScene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key];
        }

<<<<<<< HEAD
        this.game.currentScene.score.best_time.color = (lite.storage.get("theme") === "midnight" || lite.storage.get("theme") === "dark") ? "#888" : "#999";
        this.game.currentScene.score.best_time_title.color = (lite.storage.get("theme") === "midnight" || lite.storage.get("theme") === "dark") ? "#888" : "#999";
        this.game.currentScene.score.goals.color = lite.storage.get("theme") === "midnight" ? "#ddd" : lite.storage.get("theme") === "dark" ? "#fff" : "#000";
        this.game.currentScene.score.time.color = lite.storage.get("theme") === "midnight" ? "#ddd" : lite.storage.get("theme") === "dark" ? "#fff" : "#000";
        this.game.currentScene.score.time_title.color = (lite.storage.get("theme") === "midnight" || lite.storage.get("theme") === "dark") ? "#888" : "#999";
        if (this.game.currentScene.hasOwnProperty("raceTimes")) {
            this.game.currentScene.raceTimes.raceList.forEach((race) => {
                race.children.forEach((element) => {
                    element.color = lite.storage.get("theme") === "midnight" ? "#ddd" : lite.storage.get("theme") === "dark" ? "#fff" : "#000";
                });
            });
        }

        if (this.game.currentScene.hasOwnProperty("campaignScore")) {
            this.game.currentScene.campaignScore.container.children.forEach((medal) => {
                medal.children.forEach((element) => {
                    element.color = lite.storage.get("theme") === "midnight" ? "#ddd" : lite.storage.get("theme") === "dark" ? "#fff" : "#000";
                });
            });
        }

=======
>>>>>>> parent of 6e3ea12 (Delete class directory)
        this.game.settings.physicsLineColor = this.storage.get("theme") === "midnight" ? "#ccc" : this.storage.get("theme") === "dark" ? "#fdfdfd" : "#000";
        this.game.settings.sceneryLineColor = this.storage.get("theme") === "midnight" ? "#444" : this.storage.get("theme") === "dark" ? "#666" : "#aaa";
        this.game.currentScene.toolHandler.options.gridMinorLineColor = this.storage.get("theme") === "midnight" ? "#20282e" : this.storage.get("theme") === "dark" ? "#252525" : "#eee";
        this.game.currentScene.toolHandler.options.gridMajorLineColor = this.storage.get("theme") === "midnight" ? "#161b20" : this.storage.get("theme") === "dark" ? "#3e3e3e" : "#ccc";
        this.game.canvas.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#1d2328" : this.storage.get("theme") === "dark" ? "#1b1b1b" : "#fff");
<<<<<<< HEAD
        if (this.focusOverlay) {
            this.focusOverlay.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#333b" : this.storage.get("theme") === "dark" ? "#000b" : "#fffb");
        }
=======
        this.focusOverlay && this.focusOverlay.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#333333bb" : this.storage.get("theme") === "dark" ? "#000000bb" : "#ffffffbb");
>>>>>>> parent of 6e3ea12 (Delete class directory)

        this.game.currentScene.redraw();
    }
    
    update() {
        this.storage.get("di") && this.drawInputDisplay(this.game.canvas);
<<<<<<< HEAD
        this.focusOverlay && this.focusOverlay.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#333b" : this.storage.get("theme") === "dark" ? "#000b" : "#fffb");
=======
        window.lite.focusOverlay && window.lite.focusOverlay.style.setProperty("background-color", window.lite.storage.get("theme") === "midnight" ? "#333333bb" : window.lite.storage.get("theme") === "dark" ? "#000000bb" : "#ffffffbb");
>>>>>>> parent of 6e3ea12 (Delete class directory)
    }

	drawInputDisplay(canvas = document.createElement("canvas")) {
		const gamepad = this.game.currentScene.playerManager._players[this.game.currentScene.camera.focusIndex]._gamepad.downButtons;
		const ctx = canvas.getContext("2d");

		let size = parseInt(this.storage.get("di_size"));
		let theme = this.storage.get("theme");
		let offset = {
			x: size,
			y: canvas.height - size * 10
		}

		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineWidth = size / 2;
		ctx.strokeStyle = theme === "midnight" ? "#ddd" : theme === "dark" ? "#fff" : "#000";
		ctx.fillStyle = theme === "midnight" ? "#ddd" : theme === "dark" ? "#fff" : "#000";

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

        let activeStroke = theme === "midnight" ? "#444" : theme === "dark" ? "#000" : "#fff";
        let inactiveStroke = theme === "midnight" ? "#ddd" : theme === "dark" ? "#fff" : "#000";

		ctx.lineWidth = size / 3;
		ctx.strokeStyle = gamepad.z ? activeStroke : inactiveStroke;
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.up ? activeStroke : inactiveStroke;
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.left ? activeStroke : inactiveStroke;
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.down ? activeStroke : inactiveStroke;
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.right ? activeStroke : inactiveStroke;
		ctx.beginPath();
		ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
	}
}