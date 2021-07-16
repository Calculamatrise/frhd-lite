import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super(t);
        if (t.settings.fullscreenAvailable === !1) {
            let i = this.controlData["settings_btn-hover"];
            i.top = 60;
            i.right = 150;
        }
        this.container = {
            parent: this,
            alpha: .8,
            image: 154,
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            get x() {
                return this.parent.scene.screen.width - 135
            },
            get y() {
                return 25 * this.parent.scene.game.pixelRatio / 2.5
            }
        }
    }
    name = "settings_controls"
    controlsSpriteSheetData = {
        frames: [[78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            "settings_btn-hover": [0],
            settings_btn: [1]
        }
    }
    controlData = {
        "settings_btn-hover": {
            top: 60,
            right: 230,
            key: "settings"
        }
    }
    update() {}
    draw() {
        let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations["settings_btn" + (this.mouse.touch.pos.x < this.container.x + 76 / 2 && this.mouse.touch.pos.x > this.container.x && this.mouse.touch.pos.y < this.container.y + 76 / 2 && this.mouse.touch.pos.y > this.container.y ? "-hover" : "")]];
        const ctx = this.scene.game.canvas.getContext("2d");
        ctx.globalAlpha = this.container.alpha;
        ctx.drawImage(this.scene.assets.getResult("settings_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 40, 40);
        ctx.globalAlpha = 1;
    }
    click() {
        let t = this.playerManager.firstPlayer.getGamepad();
        t.setButtonDown("settings");
        t.setButtonUp("settings");
    }
}