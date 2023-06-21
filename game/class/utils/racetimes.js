import formatnumber from "./formatnumber.js";

export default class {
    raceCount = 0;
    highlightedRace = null;
    raceOpacity = .3;
    raceYOffset = 50;
    mobileRaceXOffset = 180;
    maxRaces = 10;
	container = {
		children: [],
		color: "#000000",
		font: 25,
		x: 15,
		y: 80,
		scaleX: window.devicePixelRatio / 2.5,
		scaleY: window.devicePixelRatio / 2.5,
		visible: true
	}
    constructor(t) {
        this.scene = t,
		this.scene.game.settings.isCampaign && (this.container.y += 55),
        this.maxRaces = this.scene.settings.mobile ? 3 : 10
    }
	get raceList() {
		return this.container.children;
	}
    clear() {
		this.container.children.splice(0);
        this.raceCount = 0
    }
    centerContainer() {
        let t = this.scene
          , e = t.screen
          , i = this.container
          , s = i.children.reduce((width, child) => width += 160 /* child.width */, 0)
          , n = this.scene.game.pixelRatio;
        i.x = e.width / 2 - s / 2 * i.scaleY;
        t.settings.isCampaign && (i.visible = !1),
        i.y = 40 * n
    }
    addRace(t, e) {
        if (this.raceCount < this.maxRaces) {
            var i = this.scene
              , r = t.user
              , o = t.race
              , a = i.settings
              , h = a.drawFPS
              , u = {
				alpha: this.raceOpacity,
				children: [],
				color: r.color,
				initial: r.d_name.charAt(0).toUpperCase(),
				runTime: formatnumber(parseInt(o.run_ticks) / h * 1e3),
				x: 25,
				y: 25
			};
            a.mobile ? u.x = e * this.mobileRaceXOffset : u.y = e * this.raceYOffset,
			this.container.children.push(u);
            this.raceCount++
        }
    }
	draw() {
		let t = this.scene.game.canvas.getContext("2d");
		t.save();
		t.textAlign = "center";
		t.textBaseline = "middle";
		for (const i in this.container.children) {
			const data = this.container.children[i];
			t.globalAlpha = data.alpha;
			t.fillStyle = data.color;
			t.beginPath();
			t.arc((this.container.x + data.x) * this.container.scaleX, (this.container.y + data.y + 25) * this.container.scaleY/* * i*/, 20 * this.container.scaleY, 0, 2 * Math.PI);
			t.fill();
			t.fillStyle = this.container.color;
			t.font = this.container.font * this.container.scaleY + "px helsinki";
			t.fillText(data.initial, (this.container.x + data.x) * this.container.scaleX, (this.container.y + data.y + 25) * this.container.scaleY/* * i*/);
			t.font = (this.container.font + 5) * this.container.scaleY + "px helsinki";
			let e = t.measureText(data.runTime);
			data.width = 20 + e.width;
			data.height = 20 + e.actualBoundingBoxAscent + e.actualBoundingBoxDescent;
			t.fillText(data.runTime, (this.container.x + data.x + 20 + 9) * this.container.scaleX + e.width / 2, (this.container.y + data.y + 25) * this.container.scaleY/* * i*/);
		}

		t.restore();
	}
    update() {
        if (this.raceCount > 0) {
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