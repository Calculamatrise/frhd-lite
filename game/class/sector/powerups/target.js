import Powerup from "../powerup.js";

export default class extends Powerup {
	color = '#FAE335';
	name = "goal";
	hit = !1;
	id = crypto.randomUUID();
	prefix = 'T';
	cacheStar(t) {
		let e = this.constructor.cache.canvas;
		e.width = this.constructor.cache.width * t,
		e.height = this.constructor.cache.height * t;
		let i = e.getContext('2d')
		  , s = e.width / 2
		  , n = e.height / 2;
		this.drawStar(s, n, 5, 10, 5, !0, t, i),
		this.settings.developerMode && (i.beginPath(),
		i.rect(0, 0, e.width, e.height),
		i.strokeStyle = 'red',
		i.strokeWidth = 1 * t,
		i.stroke())
	}
	cacheEmptyStar(t) {
		let e = this.constructor.hitCache.canvas;
		e.width = this.constructor.hitCache.width * t,
		e.height = this.constructor.hitCache.height * t;
		let i = e.getContext('2d')
		  , s = e.width / 2
		  , n = e.height / 2;
		this.drawStar(s, n, 5, 10, 5, !1, t, i),
		this.settings.developerMode && (i.beginPath(),
		i.rect(0, 0, e.width, e.height),
		i.strokeStyle = 'red',
		i.strokeWidth = 1 * t,
		i.stroke())
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = t.pos.x - this.x
		  , o = t.pos.y - this.y
		  , a = Math.sqrt(Math.pow(s, 2) + Math.pow(o, 2))
		  , h = i._powerupsConsumed.targets
		  , l = this.scene;
		if (26 > a && i.isAlive() && -1 === h.indexOf(this.id)) {
			h.push(this.id);
			let c = h.length
			  , u = l.track.targetCount;
			i.isGhost() === !1 && (this.hit = !0,
			this.sector.powerupCanvasDrawn = !1,
			l.sound.play('goal_sound'),
			l.message.show(c + " of " + u + ' Stars', 50, this.color, '#666')),
			c >= u && (i.complete = !0)
		}
	}
	draw(t, e, i, s) {
		let cache = this.constructor.hitCache;
		this.hit || (cache = this.constructor.cache,
		cache.dirty && this.recache(i));
		let n = cache.width * i
		  , r = cache.height * i
		  , o = n / 2
		  , c = r / 2;
		s.drawImage(cache.canvas, t - o, e - c, n, r)
	}
	drawStar(t, e, i, s, n, r, o, a) {
		let h = Math.PI / 2 * 3
		  , l = t
		  , c = e
		  , u = Math.PI / i;
		s *= o,
		n *= o,
		a.beginPath(),
		a.moveTo(t, e - s);
		for (let p = 0; i > p; p++)
			l = t + Math.cos(h) * s,
			c = e + Math.sin(h) * s,
			a.lineTo(l, c),
			h += u,
			l = t + Math.cos(h) * n,
			c = e + Math.sin(h) * n,
			a.lineTo(l, c),
			h += u;
		a.lineTo(t, e - s),
		a.closePath(),
		a.lineWidth = Math.max(2 * o, 1),
		a.strokeStyle = /^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) ? '#FBFBFB' : this.outline,
		a.stroke(),
		a.fillStyle = r ? this.color : '#FFFFFF',
		a.fill()
	}
	recache(t) {
		this.setDirty(!1);
		this.cacheStar(t),
		this.cacheEmptyStar(t)
	}
	static cache = Object.assign(this.createCache(), {
		width: 35,
		height: 35
	})
	static hitCache = Object.assign(this.createCache(), {
		width: 35,
		height: 35
	})
}