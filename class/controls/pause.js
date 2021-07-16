import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super(t);
        this.container = {
            alpha: .8,
            parent: this,
            image: 154,
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            get x() {
                return this.parent.scene.screen.width - 55
            },
            get y() {
                return 25 * this.parent.scene.game.pixelRatio / 2.5
            }
        }
    }
    name = "pause_controls";
    pauseControl = null;
    paused = !1;
    controlsSpriteSheetData = {
        frames: [[230, 2, 76, 76], [154, 2, 76, 76], [78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            "pause_btn-hover": [0],
            pause_btn: [1],
            "play_btn-hover": [2],
            play_btn: [3]
        }
    }
    controlData = {
        "pause_btn-hover": {
            key: "pause",
            top: 60,
            right: 70
        }
    }
    update() {
        this.paused !== this.scene.state.paused && (this.paused = this.scene.state.paused)
    }
    draw() {
        let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations[(this.paused ? "play_btn" : "pause_btn") + (this.mouse.touch.pos.x < this.container.x + 76 / 2 && this.mouse.touch.pos.x > this.container.x && this.mouse.touch.pos.y < this.container.y + 76 / 2 && this.mouse.touch.pos.y > this.container.y ? "-hover" : "")]];
        const ctx = this.scene.game.canvas.getContext("2d");
        ctx.globalAlpha = this.container.alpha;
        ctx.drawImage(this.scene.assets.getResult("pause_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 40, 40);
        ctx.globalAlpha = 1;
    }
    click() {
        this.scene.state.paused = !this.scene.state.paused;
    }
}