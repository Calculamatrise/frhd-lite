export default class {
    constructor(t) {
        this.scene = t,
        this.settings = t.settings,
        this.container = {
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            x: 0,
            y: 80 * this.scene.game.pixelRatio / 2.5
        },
        this.bronze_container = {
            alpha: .4,
            text: this.settings.campaignData.goals.third
        },
        this.silver_container = {
            alpha: .4,
            text: this.settings.campaignData.goals.second
        },
        this.gold_container = {
            alpha: .4,
            text: this.settings.campaignData.goals.first
        }
    }
    scene = null;
    container = null;
    cached = !1;
    update_state() {
        switch (this.settings.campaignData.user.has_goal) {
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
        this.container.x = this.scene.screen.width * this.container.scaleY,
        this.container.y = 40 * this.scene.game.pixelRatio
    }
    update() {
        this.settings.mobile && this.center_container(),
        this.update_state()
    }
    draw() {
        const ctx = this.scene.game.canvas.getContext("2d");
        ctx.font = "12px helsinki";
        ctx.drawImage(this.scene.assets.getResult("campaign_icons"), 545, 65, 49, 49, this.container.x + 5, this.container.y, 20, 20);
        ctx.globalAlpha = this.bronze_container.alpha;
        ctx.fillText(this.bronze_container.text, this.container.x + 46, this.container.y + 15);
        ctx.drawImage(this.scene.assets.getResult("campaign_icons"), 500, 65, 49, 49, this.container.x + 69, this.container.y, 20, 20);
        ctx.globalAlpha = this.bronze_container.alpha;
        ctx.fillText(this.silver_container.text, this.container.x + 113, this.container.y + 15);
        ctx.drawImage(this.scene.assets.getResult("campaign_icons"), 454, 66, 49, 49, this.container.x + 139, this.container.y, 20, 20);
        ctx.globalAlpha = this.bronze_container.alpha;
        ctx.fillText(this.gold_container.text, this.container.x + 182, this.container.y + 15);
    }
    create_sprite_sheet() {
        return new createjs.SpriteSheet({
            images: [
                this.scene.assets.getResult("campaign_icons")
            ],
            frames: [[548, 68, 44, 44], [2, 68, 452, 56], [502, 68, 44, 44], [2, 2, 588, 64], [456, 68, 44, 44]],
            animations: {
                bronze_medal: [0],
                center_panel: [1],
                silver_medal: [2],
                left_panel: [3],
                gold_medal: [4]
            }
        });
    }
    get_sprite(t) {
        let e = new createjs.Sprite(this.sprite_sheet, t);
        return e.stop(),
        e
    }
}