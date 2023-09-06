export default class {
	scene = null;
	angle = 0;
	x = 0;
	y = 0;
	name = null;
	sector = null;
	settings = null;
	outline = '#000'; // /^(dark|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : '#000';
	remove = !1;
	constructor(e, i) {
		let t = arguments[arguments.length - 1];
		this.game = t.scene.game,
		this.scene = t.scene,
		this.settings = this.game.settings,
		this.x = e,
		this.y = i,
		this.remove = !1
	}
	getCode() {
		return this.x.toString(32) + ' ' + this.y.toString(32)
	}
	draw(t, e, i, s) {
		if (!this.hit) {
			this.constructor.cache.dirty && this.recache(i);
			let r = this.constructor.cache.width * i
			, o = this.constructor.cache.height * i
			, a = r / 2
			, h = o / 2;
			s.drawImage(this.constructor.cache.canvas, t - a, e - h, r, o)
		}
	}
	erase(t, e) {
		let i = !1;
		if (!this.remove) {
			let r = Math.sqrt(Math.pow(t.x - this.x, 2) + Math.pow(t.y - this.y, 2));
			e >= r && (i = [this],
			this.removeAllReferences())
		}
		return i
	}
	removeAllReferences() {
		this.remove = !0,
		this.sector && (this.sector.powerupCanvasDrawn = !1,
		this.sector.dirty = !0,
		this.sector = null),
		this.scene.track.cleanPowerups()
	}
	collide(t) {
		let e = t.pos.x - this.x
		  , i = t.pos.y - this.y
		  , r = Math.sqrt(Math.pow(e, 2) + Math.pow(i, 2));
		!this.hit && 26 > r && (this.hit = !0,
		this.sector.powerupCanvasDrawn = !1)
	}
	addSectorReference(t) {
		this.sector = t
	}
	move(t, e) {
		this.x += parseInt(t) | 0;
		this.y += parseInt(e) | 0;
		return this;
	}
	setDirty(t) {
		this.constructor.cache.dirty = t
	}
	static canvasPool = new Set()
	static createCache() {
		let cache = {
			canvas: document.createElement('canvas'),
			dirty: !0,
			width: 25,
			height: 25
		}
		return this.canvasPool.add(cache),
		cache;
	}
}