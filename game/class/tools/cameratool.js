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
}