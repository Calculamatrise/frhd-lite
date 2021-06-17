import s from "./formatnumber.js";

export default class {
    constructor(t) {
        this.scene = t;
        this.maxRaces = this.scene.settings.mobile ? 3 : 10;
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
            var f = s(parseInt(o.run_ticks) / h * 1e3)
              , v = new createjs.Text(f,"30px " + c,"#000000");
            v.x = 55,
            v.y = 9;
            var g = new createjs.Text(r.d_name.charAt(0),"25px " + c,"#000000");
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
            this.raceList.push(u),
            this.container.addChild(u),
            this.raceCount++
        }
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