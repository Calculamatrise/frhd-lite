import format from "./formatnumber.js";

export default class {
    constructor(t) {
        this.scene = t;
        this.maxRaces = this.scene.settings.mobile ? 3 : 10;
        this.container = {
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            x: 80 * this.scene.game.pixelRatio / 2.5,
            y: 15 * this.scene.game.pixelRatio / 2.5
        }
        this.createContainer();
    }
    container = null;
    raceList = [];
    raceCount = 0;
    highlightedRace = null;
    raceOpacity = .3;
    raceYOffset = 50;
    mobileRaceXOffset = 180;
    maxRaces = 10;
    createContainer() {
        this.container = new createjs.Container;
        this.container.scaleX = this.container.scaleY = this.scene.game.pixelRatio / 2.5,
        this.container.y = 80 * this.scene.game.pixelRatio / 2.5,
        this.container.x = 15 * this.scene.game.pixelRatio / 2.5,
        this.scene.game.settings.isCampaign && (this.container.y += 55 * this.scene.game.pixelRatio / 2.5),
        this.scene.game.stage.addChild(this.container)
    }
    clear() {
        this.container.removeAllChildren(),
        this.raceList = [],
        this.raceCount = 0
    }
    centerContainer() {
        let t = this.container.getBounds();
        this.container.x = this.scene.screen.width / 2 - t.width / 2 * this.container.scaleY;
        this.scene.settings.isCampaign && (this.container.visible = !1),
        this.container.y = 40 * this.scene.game.pixelRatio
    }
    addRace(t, e) {
        if (this.raceCount < this.maxRaces) {
            let u = new createjs.Container,
                p = new createjs.Shape;
            p.graphics.setStrokeStyle(4, "round"),
            p.graphics.beginFill(t.user.color).drawCircle(0, 0, 20),
            p.x = 25,
            p.y = 25;
            let f = format(parseInt(t.race.run_ticks) / this.scene.settings.drawFPS * 1e3),
                v = new createjs.Text(f,"30px helsinki", lite.getVar("dark") ? "#f1f1f1" : "#000");
            v.x = 55,
            v.y = 9;
            let g = new createjs.Text(t.user.d_name.charAt(0),"25px helsinki", lite.getVar("dark") ? "#f1f1f1" : "#000");
            g.x = 17,
            g.y = 33,
            g.textBaseline = "alphabetic";
            let m = new createjs.Container;
            m.addChild(p),
            m.addChild(g),
            m.cache(0, 0, 50, 50),
            m.removeAllChildren(),
            u.addChild(m, v),
            u.alpha = this.raceOpacity,
            this.scene.settings.mobile ? u.x = e * this.mobileRaceXOffset : (u.x = -2,
            u.y = e * this.raceYOffset),
            this.raceList.push(u),
            this.container.addChild(u),
            this.raceCount++
        }
    }
    update() {
        if (this.raceCount > 0) {
            for (const i in this.raceTimes) {
                for (const x in this.scene.playerManager._players) {
                    if (this.scene.playerManager._players[x]._user.d_name == i) {
                        this.raceTimes[i].time.text = this.raceTimes[i].time.text.split(" ")[0] + " " + this.scene.playerManager._players[x].getTargetsHit() + "/" + this.scene.track.targetCount;
                        this.raceTimes[i].time.color = lite.getVar("dark") ? "#f1f1f1" : "#000"
                    }
                }
            }
            this.scene.camera.focusIndex > 0 && this.scene.camera.focusIndex < this.maxRaces ? this.highlightRace(this.scene.camera.focusIndex - 1) : this.unhighlightRace(),
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