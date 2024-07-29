export default class {
	game = null;
	scene = null;
	color = '#FFF';
	x = 0;
	y = 0;
	multiplier = 1;
	name = null;
	sector = null;
	settings = null;
	outline = '#000';
	remove = !1;
	constructor(t, e) {
		Object.defineProperty(this, 'game', { enumerable: false }),
		Object.defineProperty(this, 'scene', { enumerable: false });
		let i = arguments[arguments.length - 1];
		this.game = i.scene.game,
		this.scene = i.scene,
		this.settings = this.game.settings,
		this.x = t,
		this.y = e,
		this.remove = !1
	}
	addSectorReference(t) {
		this.sector = t
	}
	collide(t) {
		let e = t.pos.x - this.x
		  , i = t.pos.y - this.y
		  , r = Math.sqrt(e ** 2 + i ** 2);
		!this.hit && 26 > r && (this.hit = !0,
		this.sector.powerupCanvasDrawn = !1)
	}
	draw(t, e, i, s) {
		this.constructor.cache.dirty && this.recache(i);
		let r = this.constructor.cache.width * i
		  , o = this.constructor.cache.height * i
		  , a = r / 2
		  , h = o / 2;
		s.drawImage(this.constructor.cache.canvas, t - a, e - h, r, o)
	}
	drawPowerup() {}
	erase(t, e) {
		let i = !1;
		if (!this.remove) {
			let s = Math.sqrt(Math.pow(t.x - this.x, 2) + Math.pow(t.y - this.y, 2));
			e >= s && (i = [this],
			this.removeAllReferences())
		}
		return i
	}
	getCode() {
		let t = '';
		this.prefix && (t = this.prefix + ' ');
		return t + this.x.toString(32) + ' ' + this.y.toString(32)
	}
	move(t, e) {
		this.x += parseInt(t) | 0,
		this.y += parseInt(e) | 0;
		return this
	}
	recache(t) {
		this.setDirty(!1);
		let e = this.constructor.cache.canvas
		  , i = this.constructor.cache.width * t
		  , s = this.constructor.cache.height * t
		  , n = e.getContext('2d');
		(e.width !== i || e.height !== s) && this.updateCache(n, t);
		let r = e.width / 2
		  , a = e.height / 2;
		this.drawPowerup(n, t, r, a),
		this.settings.developerMode && (n.beginPath(),
		n.rect(0, 0, e.width, e.height),
		n.strokeStyle = 'red',
		n.strokeWidth = 1 * t,
		n.stroke())
	}
	removeAllReferences() {
		this.remove = !0,
		this.sector && (this.sector.powerupCanvasDrawn = !1,
		this.sector.dirty = !0,
		this.sector = null),
		this.scene.track.cleanPowerups()
	}
	setDirty(t) {
		this.constructor.cache.dirty = t
	}
	updateCache(t, e) {
		let i = this.constructor.cache
		  , s = i.canvas;
		s.width = i.width * e,
		s.height = i.height * e
	}
	static createCache(options, callback) {
		let cache = Object.assign({
			canvas: document.createElement('canvas'),
			dirty: !0,
			width: 25,
			height: 25
		}, options);
		typeof callback == 'function' && callback(cache.canvas.getContext('2d'));
		return cache
	}
}