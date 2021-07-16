import format from "./formatnumber.js";

export default class {
    constructor(t) {
        this.scene = t,
        this.best_time_title = {
            text: "BEST:"
        },
        this.time_title = {
            text: "TIME:"
        },
        this.container = {
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            x: 10 * this.scene.game.pixelRatio / 2.5,
            y: (10 + this.offset.y) * this.scene.game.pixelRatio / 2.5
        },
        this.time = {
            text: "00:00.00"
        },
        this.goals = {
            text: "0/0"
        },
        this.best_time = {
            text: "-- : --.--"
        }
    }
    container = null;
    cached = !1;
    scene = null;
    state = null;
    offset = {
        y: 0,
        x: 0
    }
    update() {
        this.cached === !1 && this.scene.ticks > 50 && (this.cached = !0);
        this.time.text = format(1e3 * this.scene.ticks / this.scene.settings.drawFPS);
        this.goals.text = this.scene.playerManager.firstPlayer.getTargetsHit() + "/" + this.scene.track.targetCount;
        this.best_time.text = "-- : --.--";
        this.scene.settings.isCampaign && this.scene.settings.campaignData.user.best_time ? this.best_time.text = this.scene.settings.campaignData.user.best_time : this.scene.settings.userTrackStats && this.scene.settings.userTrackStats.best_time && (this.best_time.text = this.scene.settings.userTrackStats.best_time),
        this.scene.settings.mobile && this.center_container();
    }
    draw() {
        const ctx = this.scene.game.canvas.getContext("2d");
        ctx.drawImage(this.scene.assets.getResult("time_icon"), 0, this.scene.pauseControls.paused ? 60 : 0, 60, 60, this.container.x, this.container.y, 24, 24);
        ctx.font = "8px helsinki";
        ctx.fillStyle = lite.getVar("dark") ? "#666666" : "#999999";
        ctx.fillText(this.time_title.text, this.container.x + (GameManager.scene == "Editor" ? 24 : 34), this.container.y + 8);
        ctx.font = "16px helsinki";
        ctx.fillStyle = lite.getVar("dark") ? "#fdfdfd" : "#000000";
        ctx.fillText(this.time.text, this.container.x + (GameManager.scene == "Editor" ? 24 : 54), this.container.y + 20);
        ctx.font = "8px helsinki";
        ctx.fillStyle = lite.getVar("dark") ? "#666666" : "#999999";
        ctx.fillText(this.best_time_title.text, this.container.x + (GameManager.scene == "Editor" ? 96 : 106), this.container.y + 8);
        ctx.font = "14px helsinki";
        ctx.fillText(this.best_time.text, this.container.x + (GameManager.scene == "Editor" ? 96 : 120), this.container.y + 20);
        ctx.drawImage(this.scene.assets.getResult("targets_icon"), 0, 0, 60, 60, this.container.x + 160, this.container.y, 24, 24);
        ctx.font = "16px helsinki";
        ctx.fillStyle = lite.getVar("dark") ? "#fdfdfd" : "#000000";
        ctx.fillText(this.goals.text, this.container.x + (GameManager.scene == "Editor" ? 184 : 194), this.container.y + 20);
    }
    center_container() {
        this.container.x = this.scene.screen.width * this.container.scaleY,
        this.container.y = 10 * this.scene.game.pixelRatio
    }
}