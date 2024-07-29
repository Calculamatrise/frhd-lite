import Tool from "./tool.js";

export default class Camera extends Tool {
	name = 'camera';
	hold() {
		let t = this.mouse.touch
		  , e = t.pos
		  , i = this.camera
		  , s = t.old.pos.sub(e).factor(1 / i.zoom);
		i.position.inc(s)
	}
	drawText(t) {
		t.fillStyle = /^(dark|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : '#000',
		t.font = 12 * this.game.pixelRatio + "pt arial",
		t.fillText(this.name, 10 * this.game.pixelRatio, 20 * this.game.pixelRatio),
		t.font = 8 * this.game.pixelRatio + "pt arial"
	}
}