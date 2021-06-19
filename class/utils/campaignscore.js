export default class {
    constructor(t) {
        this.scene = t;
        this.settings = t.settings;
        this.build_interface();
    }
    scene = null;
    container = null;
    cached = !1;
    build_interface() {
        this.sprite_sheet = this.create_sprite_sheet();
        var t = this.scene.game.pixelRatio
          , e = new createjs.Container
          , i = "helsinki"
          , s = this.settings.campaignData
          , n = s.goals
          , r = n.third
          , o = new createjs.Container
          , a = this.get_sprite("bronze_medal")
          , r = new createjs.Text(r, "30px " + i, window.lite.getVar("dark") ? "#fdfdfd" : "#000")
          , h = n.second
          , l = new createjs.Container
          , c = this.get_sprite("silver_medal")
          , h = new createjs.Text(h, "30px " + i, window.lite.getVar("dark") ? "#fdfdfd" : "#000")
          , u = n.first
          , p = new createjs.Container
          , d = this.get_sprite("gold_medal")
          , u = new createjs.Text(u, "30px " + i, window.lite.getVar("dark") ? "#fdfdfd" : "#000")
          , f = t / 2.5;
        "phone" === this.settings.controls && (f = t / 2.5),
        a.y = 7,
        a.x = 16,
        r.x = 69,
        r.y = 14,
        c.y = 7,
        c.x = 175,
        h.x = 229,
        h.y = 14,
        d.y = 7,
        d.x = 350,
        u.y = 14,
        u.x = 400,
        o.addChild(a),
        o.addChild(r),
        l.addChild(c),
        l.addChild(h),
        p.addChild(d),
        p.addChild(u),
        o.alpha = .4,
        l.alpha = .4,
        p.alpha = .4,
        e.addChild(o),
        e.addChild(l),
        e.addChild(p),
        e.scaleX = e.scaleY = f,
        e.y = 80 * f,
        e.x = 0,
        this.bronze_container = o,
        this.silver_container = l,
        this.gold_container = p,
        this.container = e,
        this.scene.game.stage.addChild(e),
        this.update_state()
    }
    update_state() {
        var t = this.settings.campaignData
          , e = t.user;
        switch (e.has_goal) {
        case 1:
        case "first":
            this.gold_container.alpha = 1;
        case "second":
        case 2:
            this.silver_container.alpha = 1;
        case "third":
        case 3:
            this.bronze_container.alpha = 1;
        case 0:
        }
    }
    center_container() {
        var t = this.scene.screen
          , e = this.container
          , i = e.getBounds()
          , s = this.scene.game.pixelRatio;
        e.x = t.width / 2 - i.width / 2 * e.scaleY,
        e.y = 40 * s
    }
    update() {
        this.settings.mobile && this.center_container(),
        this.update_state()
    }
    create_sprite_sheet() {
        var t = this.scene.assets.getResult("campaign_icons")
          , e = {
            images: [t],
            frames: [[548, 68, 44, 44], [2, 68, 452, 56], [502, 68, 44, 44], [2, 2, 588, 64], [456, 68, 44, 44]],
            animations: {
                bronze_medal: [0],
                center_panel: [1],
                silver_medal: [2],
                left_panel: [3],
                gold_medal: [4]
            }
        }
          , i = new createjs.SpriteSheet(e);
        return i
    }
    get_sprite(t) {
        var e = this.sprite_sheet
          , i = new createjs.Sprite(e,t);
        return i.stop(),
        i
    }
}