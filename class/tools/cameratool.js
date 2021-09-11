import Tool from "./tool.js";

export default class extends Tool {
    name = "Camera";
    frozen = false;
    hold() {
        let t = this.mouse.touch.old.pos.sub(this.mouse.touch.pos).factor(1 / this.camera.zoom);
        if (this.frozen)
            this.scene.track.move(t.x | 0, t.y | 0)
        else
            this.camera.position.inc(t)
    }
    draw() {
        this.scene.game.canvas,
        this.scene.game.canvas.getContext("2d")
    }
    drawText(t) {
        t.fillStyle = inviolable.storage.get("dark") ? "#fdfdfd" : "#000000",
        t.font = 12 * this.game.pixelRatio + "pt arial",
        t.fillText(this.name, 10 * this.game.pixelRatio, 20 * this.game.pixelRatio),
        t.font = 8 * this.game.pixelRatio + "pt arial"
    }
}