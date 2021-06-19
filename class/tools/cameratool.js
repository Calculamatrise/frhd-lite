import Tool from "./tool.js";

export default class extends Tool {
    name = "Camera";
    hold() {
        var t = this.mouse.touch,
            e = t.pos,
            i = this.camera,
            s = t.old.pos.sub(e).factor(1 / i.zoom);
        i.position.inc(s)
    }
    draw() {
        var t = this.scene;
        t.game.canvas,
        t.game.canvas.getContext("2d")
    }
    drawText(t) {
        var e = this.name,
            i = this.game.pixelRatio;
        t.fillStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000000",
        t.font = 12 * i + "pt arial",
        t.fillText(e, 10 * i, 20 * i),
        t.font = 8 * i + "pt arial"
    }
}