import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super(t);
        this.container = {
            parent: this,
            alpha: .8,
            image: 154,
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            get x() {
                return this.parent.scene.screen.width - 95
            },
            get y() {
                return 25 * this.parent.scene.game.pixelRatio / 2.5
            }
        }
    }
    name = "fullscreen_controls";
    fullscreenControl = null;
    fullscreen = !1;
    controlsSpriteSheetData = {
        frames: [[230, 2, 76, 76], [154, 2, 76, 76], [78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            "exit_fullscreen_btn-hover": [0],
            exit_fullscreen_btn: [1],
            "fullscreen_btn-hover": [2],
            fullscreen_btn: [3]
        }
    }
    controlData = {
        "fullscreen_btn-hover": {
            top: 60,
            right: 150,
            key: "fullscreen"
        }
    }
    update() {
        this.fullscreen !== this.scene.settings.fullscreen && (this.fullscreen = this.scene.settings.fullscreen)
    }
    draw() {
        let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations[(this.fullscreen ? "exit_fullscreen_btn" : "fullscreen_btn") + (this.mouse.touch.pos.x < this.container.x + 76 / 2 && this.mouse.touch.pos.x > this.container.x && this.mouse.touch.pos.y < this.container.y + 76 / 2 && this.mouse.touch.pos.y > this.container.y ? "-hover" : "")]];
        const ctx = this.scene.game.canvas.getContext("2d");
        ctx.globalAlpha = this.container.alpha;
        ctx.drawImage(this.scene.assets.getResult("fullscreen_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 40, 40);
        ctx.globalAlpha = 1;
    }
    click() {
        this.scene.game.settings.fullscreen = !this.scene.game.settings.fullscreen;
    }
}