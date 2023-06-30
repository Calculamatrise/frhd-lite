import VehiclePowerup from "../vehiclepowerup.js";

export default class extends VehiclePowerup {
	name = "blob";
    constructor(t, e, i, s) {
        super(s);
        this.x = t;
        this.y = e;
        this.time = i;
        this.id = Math.random().toString(36).slice(2);
        this.hit = !1;
    }
    getCode() {
        return "V " + this.x.toString(32) + " " + this.y.toString(32) + " 4 " + this.time.toString(32)
    }
    drawIcon(t, e, i, s) {
        i *= 1,
        s.lineCap = "butt",
        s.lineJoin = "miter",
        s.miterLimit = 4 * i,
        s.save(),
        s.scale(i, i),
        s.beginPath(),
        s.moveTo(0, 0),
        s.lineTo(24, 0),
        s.lineTo(24, 22),
        s.lineTo(0, 22),
        s.closePath(),
        s.clip(),
        s.translate(0, 0),
        s.translate(0, 0),
        s.scale(1, 1),
        s.translate(0, 0),
        s.strokeStyle = "rgba(0,0,0,0)",
        s.lineCap = "butt",
        s.lineJoin = "miter",
        s.miterLimit = 4,
        s.save(),
        s.restore(),
        s.save(),
        s.restore(),
        s.save(),
        s.fillStyle = "rgba(0, 0, 0, 0)",
        s.strokeStyle = "rgba(0, 0, 0, 0)",
        s.lineWidth = 1,
        s.translate(-1320, -491),
        s.save(),
        s.translate(251, 28),
        s.save(),
        s.translate(1056, 265),
        s.save(),
        s.translate(3, 187),
        s.save(),
        s.translate(10, 11),
        s.save(),
        s.save(),
        s.fillStyle = "#a784c5",
        s.save(),
        s.beginPath(),
        s.moveTo(4, 0),
        s.lineTo(20, 0),
        s.quadraticCurveTo(24, 0, 24, 4),
        s.lineTo(24, 18),
        s.quadraticCurveTo(24, 22, 20, 22),
        s.lineTo(4, 22),
        s.quadraticCurveTo(0, 22, 0, 18),
        s.lineTo(0, 4),
        s.quadraticCurveTo(0, 0, 4, 0),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.restore(),
        s.save(),
        s.strokeStyle = /^(dark|midnight)$/i.test(lite.storage.get('theme')) ? "#FBFBFB" : this.outline,
        s.lineWidth = 2,
        s.beginPath(),
        s.moveTo(5, 1),
        s.lineTo(19, 1),
        s.quadraticCurveTo(23, 1, 23, 5),
        s.lineTo(23, 17),
        s.quadraticCurveTo(23, 21, 19, 21),
        s.lineTo(5, 21),
        s.quadraticCurveTo(1, 21, 1, 17),
        s.lineTo(1, 5),
        s.quadraticCurveTo(1, 1, 5, 1),
        s.closePath(),
        s.fill(),
        s.stroke(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore(),
        s.restore()
    }
	static cache = Object.assign({}, this.cache, {
		canvas: document.createElement("canvas")
	})
}