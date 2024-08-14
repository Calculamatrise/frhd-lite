import SceneryLine from "./sceneryline.js";

export default class extends SceneryLine {
	collide(t) {
		if (this.collided) return;
		this.collided = !0;
		let e = t.pos
			, i = t.vel
			, s = t.radius
			, o = 0
			, a = 0
			, h = 0
			, l = this.p1
			, c = this.p2
			, u = e.x - l.x
			, p = e.y - l.y
			, d = this.pp
			, f = this.len
			, v = (u * d.x + p * d.y) / f / f;
		if (v >= 0 && 1 >= v) {
			let g = (u * d.y - p * d.x) * ((u - i.x) * d.y - (p - i.y) * d.x) < 0 ? -1 : 1
				, o = u - d.x * v
				, a = p - d.y * v;
			if (h = Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2)),
			0 === h && (h = 1),
			s > h || 0 > g) {
				let m = (s * g - h) / h;
				return e.x += o * m,
				e.y += a * m,
				void t.drive(-a / h, o / h)
			}
		}
		if (!(-s > v * f || v * f > f + s)) {
			let y = v > 0 ? c : l;
			if (o = e.x - y.x,
				a = e.y - y.y,
				h = Math.sqrt(o ** 2 + a ** 2),
				0 === h && (h = 1),
				s > h) {
				let m = (s - h) / h;
				return e.x += o * m,
				e.y += a * m,
				void t.drive(-a / h, o / h)
			}
		}
	}

	static type = 'physics';
}