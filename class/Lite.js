import Builder from "./Builder.js";

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
				snapshots: 10
			}
		});
		
		this.init(),
		this.initFeatures(),

        window.addEventListener("message", this.listener.bind(this));
	}

	get head() {
        class Head extends GameInventoryManager.HeadClass {
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
                v.strokeStyle = lite.storage.get("dark") ? "#FBFBFB" : "#000000";
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
        }

		return {
			classname: "cap",
			script: GameInventoryManager.register("cap", Head),
			type: 1
		}
	}

    listener(event) {
        switch(event.data.action) {
            case "update":
                this.scene.redraw();
                break;
        }

        return true;
    }

	init() {
		let loc = location.pathname;
		window.addEventListener("popstate", window.onclick = () => {
			if (location.pathname != loc) {
				loc = location.pathname;

				this.initFeatures();
			}
		});
	}

	initFeatures() {
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
    
	drawInputDisplay(canvas = document.createElement("canvas")) {
		if (!this.scene)
			return;

		const gamepad = this.scene.playerManager._players[this.scene.camera.focusIndex]._gamepad.downButtons;
		const ctx = canvas.getContext("2d");

		let size = parseInt(this.storage.get("di_size"));
		let dark = this.storage.get("dark");
		let offset = {
			x: size,
			y: canvas.height - size * 10
		}

		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineWidth = size / 2;
		ctx.strokeStyle = dark ? "#ffffff" : "#000000";
		ctx.fillStyle = dark ? "#ffffff" : "#000000";

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
		ctx.strokeStyle = gamepad.z ? (dark ? "#000000" : "#ffffff") : (dark ? "#ffffff" : "#000000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.up ? (dark ? "#000000" : "#ffffff") : (dark ? "#ffffff" : "#000000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.left ? (dark ? "#000000" : "#ffffff") : (dark ? "#ffffff" : "#000000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.down ? (dark ? "#000000" : "#ffffff") : (dark ? "#ffffff" : "#000000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = gamepad.right ? (dark ? "#000000" : "#ffffff") : (dark ? "#ffffff" : "#000000");
		ctx.beginPath();
		ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
	}
}