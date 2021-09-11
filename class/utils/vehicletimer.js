export default class {
    constructor(t) {
        this.scene = t;
        this.settings = t.settings;
        this.player = !1;
        this.container = {
            visible: true,
            scaleX: this.scene.game.pixelRatio / 2,
            scaleY: this.scene.game.pixelRatio / 2,
            x: 100,
            y: 30
        };
        this.timeText = {
            text: "00:00"
        };
    }
    scene = null;
    container = null;
    cached = !1;
    setPlayer(t) {
        this.player = t
    }
    removePlayer() {
        this.player = !1
    }
    center_container() {
        this.container.x = this.scene.screen.width / 2 - 100 * this.container.scaleX,
        this.container.y = this.scene.screen.height - 100 * this.container.scaleY
    }
    update() {
        this.player && this.player._tempVehicleTicks > 0 ? (this.center_container(),
        this.updateTime()) : this.container.visible = !1
    }
    draw() {
        if (!this.container.visible) return;
        const ctx = this.scene.game.canvas.getContext("2d");
        ctx.strokeStyle = "rgba(242,144,66,1)";
        ctx.fillStyle = "rgba(242,144,66,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.container.x, this.container.y + 15);
        ctx.arc(this.container.x + 10, this.container.y + 10, 10, Math.PI, -Math.PI / 2);
        ctx.lineTo(this.container.x + 50, this.container.y);
        ctx.arc(this.container.x + 90, this.container.y + 10, 10, -Math.PI / 2, 0);
        ctx.lineTo(this.container.x + 100, this.container.y + 15);
        ctx.arc(this.container.x + 90, this.container.y + 20, 10, 0, Math.PI / 2);
        ctx.lineTo(this.container.x + 20, this.container.y + 30);
        ctx.arc(this.container.x + 10, this.container.y + 20, 10, Math.PI / 2, Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = inviolable.storage.get("dark") ? "#fdfdfd" : "#000000";
        ctx.font = "18px helsinki";
        ctx.fillText(this.timeText.text, this.container.x + 27, this.container.y + 20);
    }
    updateTime() {
        let s = (this.player._tempVehicleTicks / this.scene.settings.drawFPS).toFixed(2);
        let n = "";
        s < 10 && (n = "0"),
        n += s,
        this.timeText.text = n,
        this.container.visible = !0
    }
    close() {
        this.container = null,
        this.player = null,
        this.scene = null,
        this.settings = null,
        this.timeText = null
    }
}