import Controls from "./controls.js";

export default class extends Controls {
    constructor(t) {
        super(t);
        this.container = {
            alpha: .5,
            parent: this,
            image: 154,
            scaleX: this.scene.game.pixelRatio / 2.5,
            scaleY: this.scene.game.pixelRatio / 2.5,
            get x() {
                return this.parent.scene.screen.width - 100
            },
            get y() {
                return 26 * this.parent.scene.game.pixelRatio / 2.5
            }
        }
    }
    name = "redo_undo_controls";
    controlsSpriteSheetData = {
        frames: [[78, 2, 76, 76], [2, 2, 76, 76]],
        animations: {
            redo: [0],
            undo: [1]
        }
    }
    controlData = {
        redo: {
            keys: ["ctrl", "y"],
            top: 60,
            right: 160
        },
        undo: {
            keys: ["ctrl", "z"],
            top: 60,
            right: 240
        }
    }
    update() {
        this.scene.controls && this.controlsContainer.visible !== this.scene.state.paused && (this.controlsContainer.visible = this.scene.state.paused)
    }
    draw() {
        //return
        let frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations["redo"]];
        const ctx = this.scene.game.canvas.getContext("2d");
        ctx.globalAlpha = this.check(this.mouse.touch.pos) == 1 ? .8 : this.container.alpha;
        ctx.drawImage(this.scene.assets.getResult("redo_undo_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x, this.container.y, 39, 39);
        frame = this.controlsSpriteSheetData.frames[this.controlsSpriteSheetData.animations["undo"]];
        ctx.globalAlpha = this.check(this.mouse.touch.pos) == 2 ? .8 : this.container.alpha;
        ctx.drawImage(this.scene.assets.getResult("redo_undo_controls"), frame[0], frame[1], frame[2], frame[3], this.container.x - 40, this.container.y, 39, 39);
        ctx.globalAlpha = 1;
    }
    check(t) {
        if (t.x > this.container.x && t.x < this.container.x + 38 && t.y > this.container.y && t.y < this.container.y + 38) {
            return 1;
        } else if (t.x > this.container.x - 40 && t.x < this.container.x && t.y > this.container.y && t.y < this.container.y + 38) {
            return 2;
        }
        return false
    }
    click(t) {
        let e = this.playerManager.firstPlayer.getGamepad();
        e.setButtonDown("ctrl"),
        e.setButtonDown(t ? "y" : "z")
    }
}