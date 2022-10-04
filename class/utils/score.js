import format from "./formatnumber.js";

export default class {
    constructor(t) {
        this.scene = t,
        this.stage = t.game.stage,
        this.build_interface()
    }
    container = null;
    cached = !1;
    scene = null;
    state = null;
    offset = {
        y: 0,
        x: 0
    }
    build_interface() {
        var t = this.scene
          , e = t.game.pixelRatio
          , i = t.settings
          , s = new createjs.Container
          , n = "helsinki"
          , r = new createjs.Text("00:00.00","40px " + n, lite.storage.get("theme") === "midnight" ? "#ddd" : lite.storage.get("theme") === "dark" ? "#fff" : "#000000")
          , o = new createjs.Text("TIME:","20px " + n, (lite.storage.get("theme") === "midnight" || lite.storage.get("theme") === "dark") ? "#888" : "#999999")
          , a = this.get_timer_sprite()
          , h = new createjs.Text(" -- : --.--","35px " + n, (lite.storage.get("theme") === "midnight" || lite.storage.get("theme") === "dark") ? "#888" : "#999999")
          , l = new createjs.Text("BEST:","20px " + n, (lite.storage.get("theme") === "midnight" || lite.storage.get("theme") === "dark") ? "#888" : "#999999")
          , c = new createjs.Text("0/0","40px " + n, lite.storage.get("theme") === "midnight" ? "#ddd" : lite.storage.get("theme") === "dark" ? "#fff" : "#000000")
          , u = new createjs.Bitmap(t.assets.getResult("targets_icon"))
          , p = e / 2.5;
        i.mobile && (p = e / 2.5),
        r.y = 18,
        r.x = 57,
        o.y = 3,
        o.x = 59,
        a.y = 0,
        a.x = 0,
        h.x = 237,
        h.y = 21,
        l.x = 240,
        l.y = 3,
        c.y = 15,
        c.x = 460,
        u.y = 0,
        u.x = 400,
        s.addChild(r),
        s.addChild(o),
        s.addChild(a),
        s.addChild(h),
        s.addChild(l),
        s.addChild(c),
        s.addChild(u),
        s.scaleX = s.scaleY = p,
        s.y = (10 + this.offset.y) * p,
        s.x = 10 * p,
        this.best_time_title = l,
        this.time_title = o,
        this.container = s,
        this.time = r,
        this.goals = c,
        this.best_time = h,
        this.stage.addChild(s)
    }
    update() {
        this.cached === !1 && this.scene.ticks > 50 && (this.cached = !0);
        this.time.text = format(1e3 * this.scene.ticks / this.scene.settings.drawFPS);
        this.goals.text = this.scene.playerManager.firstPlayer.getTargetsHit() + "/" + this.scene.track.targetCount;
        this.best_time.text = "-- : --.--";
        this.scene.settings.isCampaign && this.scene.settings.campaignData.user.best_time ? this.best_time.text = this.scene.settings.campaignData.user.best_time : this.scene.settings.userTrackStats && this.scene.settings.userTrackStats.best_time && (this.best_time.text = this.scene.settings.userTrackStats.best_time),
        this.scene.settings.mobile && this.center_container();
    }
    center_container() {
        var t = this.container
          , e = t.getBounds()
          , i = this.scene.screen
          , s = this.scene.game.pixelRatio;
        t.x = i.width / 2 - e.width / 2 * t.scaleY,
        t.y = 10 * s
    }
    cache_fixed_text() {
        var t, e = this.best_time_title, i = this.time_title, s = 10;
        t = e.getBounds(),
        e.cache(t.x, t.y, t.width, t.height + s),
        t = i.getBounds(),
        i.cache(t.x, t.y, t.width, t.height + s)
    }
    get_timer_sprite() {
        let t = this.scene.assets.getResult("time_icon")
        return new createjs.Sprite(new createjs.SpriteSheet({
            images: [t],
            frames: {
                width: 60,
                height: 60
            }
        }));
    }
}