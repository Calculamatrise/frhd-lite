import format from "./formatnumber.js";

export default class {
    constructor(t) {
        this.scene = t;
        this.maxRaces = this.scene.settings.mobile ? 3 : 10;
        this.container = {
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            x: 40 * this.scene.game.pixelRatio / 2.5,
            y: 105 * this.scene.game.pixelRatio / 2.5
        }
    }
    container = null;
    raceList = [];
    raceCount = 0;
    highlightedRace = null;
    raceOpacity = .3;
    raceYOffset = 50;
    mobileRaceXOffset = 180;
    maxRaces = 10;
    clear() {
        this.raceList = [],
        this.raceCount = 0
    }
    addRace(t, e) {
        if (this.raceCount < this.maxRaces) {
            this.container.y += this.scene.campaignScore ? this.scene.campaignScore.container.y / 2.5 : 0;
            this.raceList.push({
                alpha: this.raceOpacity,
                char: t.user.d_name.charAt(0),
                color: t.user.color,
                time: format(parseInt(t.race.run_ticks) / this.scene.settings.drawFPS * 1e3),
                offset: {
                    x: 0,
                    y: (parseInt(e)) * 20
                }
            });
            this.raceCount++
        }
    }
    update() {
        if (this.raceCount > 0) {
            for (const i in this.raceTimes) {
                for (const x in this.scene.playerManager._players) {
                    if (this.scene.playerManager._players[x]._user.d_name == i) {
                        this.raceTimes[i].time.text = this.raceTimes[i].time.text.split(" ")[0] + " " + this.scene.playerManager._players[x].getTargetsHit() + "/" + this.scene.track.targetCount;
                        this.raceTimes[i].time.color = lite.storage.get("dark") ? "#f1f1f1" : "#000"
                    }
                }
            }
            this.scene.camera.focusIndex > 0 && this.scene.camera.focusIndex < this.maxRaces ? this.highlightRace(this.scene.camera.focusIndex - 1) : this.unhighlightRace(),
            this.scene.settings.mobile && this.centerContainer()
        }
    }
    draw() {
        const ctx = this.scene.game.canvas.getContext("2d");
        for (const t in this.raceList) {
            ctx.globalAlpha = this.raceList[t].alpha;
            ctx.fillStyle = this.raceList[t].color;
            ctx.beginPath();
            ctx.arc(this.container.x + this.raceList[t].offset.x, this.container.y + this.raceList[t].offset.y, 8, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = lite.storage.get("dark") ? "#FBFBFB" : "#000000";
            ctx.font = "10px helsinki";
            ctx.fillText(this.raceList[t].char, this.container.x + this.raceList[t].offset.x, this.container.y + this.raceList[t].offset.y + 4);
            ctx.font = "12.5px helsinki";
            ctx.fillText(this.raceList[t].time, this.container.x + this.raceList[t].offset.x + 35, this.container.y + this.raceList[t].offset.y + 4);
            ctx.globalAlpha = 1;
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