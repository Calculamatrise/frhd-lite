import Builder from "./Builder.js";

import BMX from "./vehicles/bmx.js";
import MTB from "./vehicles/mtb.js";
import HELI from "./vehicles/helicopter.js";
import TRUCK from "./vehicles/truck.js";
import BALLOON from "./vehicles/balloon.js";
import BLOB from "./vehicles/blob.js";

import Explosion from "./vehicles/explosion.js";

let v = {
    BMX,
    MTB,
    HELI,
    TRUCK,
    BALLOON,
    BLOB
}

window.lite = new class extends Builder {
	constructor() {
		super({
			name: "lite",
			defaults: {
				cc: false,
				di: true,
				di_size: 10,
				feats: true,
				isometric: false,
				snapshots: 10,
                theme: "dark",
                trail: false
			}
		});
		
		this.childLoad(),
        this.on("ready", this.init),

        window.addEventListener("message", this.listener.bind(this));
	}

    snapshots = new class extends Array {
        push(...args) {
            if (this.length >= parseInt(window.lite.storage.get("snapshots"))) {
                this.splice(0, 1);
            }

            super.push(...args);
        }
    }

    get focusOverlay() {
        return this.game.gameContainer.querySelector(".gameFocusOverlay");
    }

    listener({ data }) {
        if (data.sender) {
            switch(data.action) {
                case "getStorage":
                    postMessage(this.storage);
                    break;

                case "resetSettings":
                    this.storage.reset();

                    postMessage(this.storage);
                    break;

                case "setStorageItem":
                    this.storage.set(data.item, data.data);

                    postMessage(this.storage);
                    break;

                case "toggleStorageItem":
                    if (this.storage.has(data.item)) {
                        this.storage.set(data.item, !this.storage.get(data.item));
                    }

                    postMessage(this.storage);
                    break;
            }

            this.refresh();
        }
    }

	init() {
        self = this;
        this.game.currentScene.__proto__.draw = function() {
            this.toolHandler.drawGrid(),
            this.track.draw(),
            this.drawPlayers(),
            this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
            this.loading && this.loadingcircle.draw(),
            this.message.draw()
        }

        this.game.currentScene.playerManager.constructor.prototype.draw
        this.game.currentScene.playerManager.firstPlayer.constructor.prototype.draw

        this.game.currentScene.playerManager.firstPlayer.constructor.prototype.createBaseVehicle = function(t, e, i) {
            this._tempVehicle && this._tempVehicle.stopSounds(),
            this._baseVehicle = new v[this._baseVehicleType](this, t, e, i),
            this._tempVehicle = !1,
            this._tempVehicleType = !1,
            this._tempVehicleTicks = 0
        }

        this.game.currentScene.playerManager.firstPlayer.constructor.prototype.createTempVehicle = function(t, e, i, s) {
            if (this._temp_vehicle_options) {
                let n = this._temp_vehicle_options;
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

        this.game.currentScene.playerManager.firstPlayer.constructor.prototype.draw = function() {
            this.updateOpacity();
            let t = this._baseVehicle;
            this._tempVehicleTicks > 0 && (t = this._tempVehicle),
            this._effectTicks > 0 && this._effect.draw(this._effectTicks / 100),
            t.draw(),
            this._scene.ticks > 0 && this._scene.state.playing == !1 && t.clone(),
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
            i === !1 && (i = self.storage.get("dark") ? "#999" : "#333"),
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
                a.fillStyle = self.storage.get("dark") ? "#999" : i,
                a.lineWidth = 4 * (o / 2),
                a.font = 12 * o + "pt helsinki",
                a.textAlign = "center",
                s && (a.strokeStyle = self.storage.get("dark") ? "#fff" : s,
                a.strokeText(t, h, l * o),
                a.strokeStyle = self.storage.get("dark") ? "#fff" : "#000"),
                a.fillText(t, h, l * o),
                a.restore()
            }
        }

		this.refresh();
    }

	childLoad() {
		if (location.pathname.match(/^\/u\//gi)) {
			fetch(`${location.href}?ajax=true`).then(t => t.json()).then(t => {
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
	}

    refresh() {
        this.game.settings.physicsLineColor = this.storage.get("theme") === "midnight" ? "#ccc" : this.storage.get("theme") === "dark" ? "#fdfdfd" : "#000";
        this.game.settings.sceneryLineColor = this.storage.get("theme") === "midnight" ? "#888" : this.storage.get("theme") === "dark" ? "#666" : "#aaa";
        this.game.canvas.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#1d2328" : this.storage.get("theme") === "dark" ? "#1b1b1b" : "#fff");
        this.focusOverlay && this.focusOverlay.style.setProperty("background-color", this.storage.get("theme") === "midnight" ? "#333333bb" : this.storage.get("theme") === "dark" ? "#000000bb" : "#ffffffbb");
        
        this.game.currentScene.redraw();
    }
    
    update() {
        // this.drawMTB();
        this.storage.get("di") && this.drawInputDisplay(this.game.canvas);
    }

	drawInputDisplay(canvas = document.createElement("canvas")) {
		if (!this.game.currentScene)
			return;

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
		ctx.strokeStyle = theme === "dark" ? "#fff" : "#000";
		ctx.fillStyle = theme === "dark" ? "#fff" : "#000";

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
		ctx.strokeStyle = gamepad.z ? (theme === "dark" ? "#000" : "#fff") : (theme === "dark" ? "#fff" : "#000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.up ? (theme === "dark" ? "#000" : "#fff") : (theme === "dark" ? "#fff" : "#000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.left ? (theme === "dark" ? "#000" : "#fff") : (theme === "dark" ? "#fff" : "#000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.down ? (theme === "dark" ? "#000" : "#fff") : (theme === "dark" ? "#fff" : "#000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.right ? (theme === "dark" ? "#000" : "#fff") : (theme === "dark" ? "#fff" : "#000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
	}
}