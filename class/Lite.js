import StrongMap from "./StrongMap.js";

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
            }

            super.push(...args);
        }
    }

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

		this.refresh();
    }

    load() {
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


	}

    refresh() {
        let keymap = this.storage.get("keymap");
        this.game.currentScene.playerManager.firstPlayer._gamepad.setKeyMap(this.game.settings[(this.game.currentScene.hasOwnProperty("races") ? "play" : "editor") + "Hotkeys"]);
        for (let key in keymap) {
            this.game.currentScene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key];
        }

        this.game.settings.physicsLineColor = this.storage.get("theme") === "midnight" ? "#ccc" : this.storage.get("theme") === "dark" ? "#fdfdfd" : "#000";
        this.game.settings.sceneryLineColor = this.storage.get("theme") === "midnight" ? "#444" : this.storage.get("theme") === "dark" ? "#666" : "#aaa";
        this.game.currentScene.toolHandler.options.gridMinorLineColor = this.storage.get("theme") === "midnight" ? "#20282e" : this.storage.get("theme") === "dark" ? "#252525" : "#eee";
        this.game.currentScene.toolHandler.options.gridMajorLineColor = this.storage.get("theme") === "midnight" ? "#161b20" : this.storage.get("theme") === "dark" ? "#3e3e3e" : "#ccc";
        this.game.canvas.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#1d2328" : this.storage.get("theme") === "dark" ? "#1b1b1b" : "#fff");
        this.focusOverlay && this.focusOverlay.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#333333bb" : this.storage.get("theme") === "dark" ? "#000000bb" : "#ffffffbb");

        this.game.currentScene.redraw();
    }
    
    update() {
        this.storage.get("di") && this.drawInputDisplay(this.game.canvas);
        window.lite.focusOverlay && window.lite.focusOverlay.style.setProperty("background-color", window.lite.storage.get("theme") === "midnight" ? "#333333bb" : window.lite.storage.get("theme") === "dark" ? "#000000bb" : "#ffffffbb");
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